from __future__ import annotations
import time
import os
import re
from typing import Dict, List, Optional, Tuple
from .schemas import (
    ExtractionResult,
    ExtractedField,
    ExtractionSummary,
    PageText,
    RawLLMExtraction
)
from .extractor import extract_text_from_pdf_bytes, extract_text_from_pdf_file
from .chunker import format_pages_for_llm
from .grounding import verify_field_grounding
from .normalizer import normalize_field_value
from .levers import generate_negotiation_levers
from .llm import extract_terms_with_llm

FIELD_NAMES = [
    "payment_terms",
    "price_adjustment",
    "contract_term",
    "auto_renewal",
    "termination_notice",
    "liability_cap",
    "governing_law",
    "volume_commitment",
]

# Related keywords for suspicious not-found detection in contract text
SUSPICIOUS_KEYWORDS: Dict[str, List[str]] = {
    "auto_renewal": ["renew", "renewal", "automatic"],
    "governing_law": ["governing law", "governed by", "jurisdiction"],
    "contract_term": ["term", "duration", "effective date"],
    "termination_notice": ["notice", "terminate", "termination"],
    "liability_cap": ["liability", "cap", "limit"],
    "payment_terms": ["payment", "net", "invoice"],
    "volume_commitment": ["volume", "minimum", "units", "quantity"],
    "price_adjustment": ["price", "adjust", "index"],
}

def find_suspicious_not_found_evidence(field_name: str, pages: List[PageText]) -> Optional[Tuple[str, int]]:
    """
    Scans contract pages for related keywords when a field is extracted as 'none found'.
    Returns (matching_sentence, page_number) if suspicious related text exists in the document.
    """
    keywords = SUSPICIOUS_KEYWORDS.get(field_name, [])
    if not keywords:
        return None

    for page in pages:
        for raw_s in re.split(r"(?<=[.!?\n])\s+", page.text):
            s_clean = " ".join(raw_s.split()).strip()
            if len(s_clean) < 10:
                continue
            s_lower = s_clean.lower()
            for kw in keywords:
                pattern = r"\b" + re.escape(kw) + r"\b"
                if re.search(pattern, s_lower):
                    return s_clean, page.page_number
    return None

def process_raw_extraction(
    raw: RawLLMExtraction,
    pages: List[PageText],
    tokens_used: int,
    elapsed_ms: float,
    contract_id: str = "contract",
    filename: str = "contract.pdf",
    demo_mode: bool = False,
    model_name: str = "rule-based baseline",
    actual_cost: Optional[float] = None
) -> ExtractionResult:
    """
    Applies the Trust Layer (grounding verification, review rules, normalization)
    to raw LLM output and generates negotiation levers and summary metrics.
    """
    fields: Dict[str, ExtractedField] = {}
    verified_count = 0
    needs_review_count = 0
    not_found_count = 0
    confidence_sum = 0.0

    for name in FIELD_NAMES:
        val = getattr(raw, f"{name}_value", None)
        quote = getattr(raw, f"{name}_quote", None)
        page = getattr(raw, f"{name}_page", None)
        model_conf = float(getattr(raw, f"{name}_confidence", 0.0))

        # Check if missing / not found
        is_empty = (
            val is None or
            str(val).strip() == "" or
            str(val).lower() in ("none", "none found", "not specified", "n/a", "null", "not_found")
        )

        if is_empty:
            suspicious_match = find_suspicious_not_found_evidence(name, pages)
            if suspicious_match:
                ev_sentence, ev_page = suspicious_match
                field = ExtractedField(
                    field_name=name,
                    value=None,
                    normalized="none found",
                    source_quote=ev_sentence,
                    page=ev_page,
                    confidence=0.35,
                    status="needs_review",
                    review_reason="Not found, but related text exists"
                )
                needs_review_count += 1
                confidence_sum += 0.35
            else:
                field = ExtractedField(
                    field_name=name,
                    value=None,
                    normalized="none found",
                    source_quote=None,
                    page=None,
                    confidence=0.0,
                    status="not_found",
                    review_reason="Term not present in the contract clauses."
                )
                not_found_count += 1
            fields[name] = field
            continue

        # Grounding check via RapidFuzz
        is_grounded, match_score, actual_page, warning_msg = verify_field_grounding(
            quote=quote,
            cited_page=page,
            pages=pages,
            threshold=0.90
        )

        normalized_val = normalize_field_value(name, str(val))
        final_confidence = model_conf
        status = "verified"
        review_reason = None

        if not is_grounded:
            # STRICT TRUST LAYER RULE 1:
            # If grounding check fails, status MUST be needs_review and confidence <= 0.40
            status = "needs_review"
            final_confidence = min(model_conf, 0.40)
            review_reason = warning_msg or f"Grounding check failed (match score {match_score:.2f} < 0.90)."
        elif model_conf < 0.75:
            # TRUST LAYER RULE 3:
            # If model confidence < 0.75, flag for human review
            status = "needs_review"
            review_reason = f"Low model confidence ({model_conf:.2f} < 0.75 threshold)."
        else:
            status = "verified"

        if status == "verified":
            verified_count += 1
        elif status == "needs_review":
            needs_review_count += 1

        confidence_sum += final_confidence

        fields[name] = ExtractedField(
            field_name=name,
            value=val,
            normalized=normalized_val,
            source_quote=quote,
            page=actual_page or page,
            confidence=round(final_confidence, 2),
            status=status,
            review_reason=review_reason
        )

    # Cost calculation: honest reporting
    if actual_cost is not None:
        estimated_cost = actual_cost
    elif demo_mode or model_name.startswith("rule-based") or model_name.startswith("Deterministic"):
        estimated_cost = 0.0  # Real cost of offline rule-based execution is $0.00
    else:
        # Gemini 2.0 Flash pricing: ~$0.0001 / 1K in, $0.0004 / 1K out
        estimated_cost = round((tokens_used / 1000.0) * 0.00035, 5)

    overall_conf = round(confidence_sum / max(1, (verified_count + needs_review_count)), 2)

    summary = ExtractionSummary(
        verified_count=verified_count,
        needs_review_count=needs_review_count,
        not_found_count=not_found_count,
        total_fields=len(FIELD_NAMES),
        overall_confidence=overall_conf,
        processing_time_ms=round(elapsed_ms, 2),
        estimated_cost_usd=estimated_cost,
        tokens_used=tokens_used
    )

    # Generate negotiation levers
    levers = generate_negotiation_levers(fields)

    return ExtractionResult(
        contract_id=contract_id,
        filename=filename,
        num_pages=len(pages),
        fields=fields,
        summary=summary,
        negotiation_levers=levers,
        pages=pages,
        demo_mode=demo_mode
    )

async def run_extraction_pipeline(
    pdf_bytes: bytes,
    filename: str = "uploaded_contract.pdf",
    contract_id: str = "contract",
    force_llm: bool = False
) -> ExtractionResult:
    """
    Full end-to-end extraction pipeline:
    PDF -> PyMuPDF pages -> Formatted chunks -> LLM Extraction -> Trust Layer Verification -> Normalization -> Result
    """
    start_time = time.perf_counter()

    # Step 1: PyMuPDF page text extraction
    pages, num_pages = extract_text_from_pdf_bytes(pdf_bytes)

    # Step 2: Format pages with page tags
    formatted_text = format_pages_for_llm(pages)

    # Check if real LLM API key is present
    has_api_key = bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))
    is_demo_requested = os.getenv("DEMO_MODE", "false").lower() in ("true", "1") and not force_llm

    # If force_llm or (has_api_key and not is_demo_requested), call the real LLM
    if has_api_key and (force_llm or not is_demo_requested):
        provider = os.getenv("LLM_PROVIDER", "gemini")
        model = os.getenv("LLM_MODEL", "gemini-2.0-flash" if provider == "gemini" else "gpt-4o-mini")
        raw, tokens_used = await extract_terms_with_llm(formatted_text)
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        
        # Real pricing
        cost_per_1k = 0.00035 if "gemini" in model.lower() else 0.0005
        actual_cost = round((tokens_used / 1000.0) * cost_per_1k, 5)

        return process_raw_extraction(
            raw=raw,
            pages=pages,
            tokens_used=tokens_used,
            elapsed_ms=elapsed_ms,
            contract_id=contract_id,
            filename=filename,
            demo_mode=False,
            model_name=f"{provider}/{model}",
            actual_cost=actual_cost
        )

    # Fallback / baseline execution (deterministic, measured execution time, $0.00 cost)
    from .demo_fallback import heuristic_extract_terms
    raw = heuristic_extract_terms(pages)
    tokens_used = sum(len(p.text.split()) for p in pages)
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0  # Real measured latency

    return process_raw_extraction(
        raw=raw,
        pages=pages,
        tokens_used=tokens_used,
        elapsed_ms=elapsed_ms,
        contract_id=contract_id,
        filename=filename,
        demo_mode=True,
        model_name="Deterministic rule-based baseline (offline)",
        actual_cost=0.0
    )
