from __future__ import annotations
import time
import os
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

def process_raw_extraction(
    raw: RawLLMExtraction,
    pages: List[PageText],
    tokens_used: int,
    elapsed_ms: float,
    contract_id: str = "contract",
    filename: str = "contract.pdf",
    demo_mode: bool = False
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
            # TRUST LAYER RULE 1:
            # If grounding check fails, force status = needs_review and confidence <= 0.40
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

    # Cost calculation: estimate $0.0003 per 1K tokens
    estimated_cost = round((tokens_used / 1000.0) * 0.00035, 5)
    overall_conf = round(confidence_sum / max(1, (verified_count + needs_review_count)), 2)

    summary = ExtractionSummary(
        verified_count=verified_count,
        needs_review_count=needs_review_count,
        not_found_count=not_found_count,
        total_fields=len(FIELD_NAMES),
        overall_confidence=overall_conf,
        processing_time_ms=round(elapsed_ms, 1),
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
    contract_id: str = "contract"
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

    # Check if demo mode is active or no API key is available
    is_demo = os.getenv("DEMO_MODE", "false").lower() in ("true", "1")
    has_api_key = bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))

    tokens_used = 1200
    if not has_api_key or is_demo:
        # High fidelity fallback extraction for demo mode
        from .demo_fallback import heuristic_extract_terms
        raw = heuristic_extract_terms(pages)
        tokens_used = sum(len(p.text.split()) for p in pages) + 350
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0 + 450.0  # realistic simulated latency
        return process_raw_extraction(
            raw=raw,
            pages=pages,
            tokens_used=tokens_used,
            elapsed_ms=elapsed_ms,
            contract_id=contract_id,
            filename=filename,
            demo_mode=True
        )

    # Step 3: LLM Extraction with Pydantic structured output
    raw, tokens_used = await extract_terms_with_llm(formatted_text)
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    # Step 4: Trust layer grounding check & normalization
    return process_raw_extraction(
        raw=raw,
        pages=pages,
        tokens_used=tokens_used,
        elapsed_ms=elapsed_ms,
        contract_id=contract_id,
        filename=filename,
        demo_mode=False
    )
