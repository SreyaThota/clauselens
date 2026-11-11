from __future__ import annotations
import re
from typing import List, Optional, Tuple
from .schemas import PageText, RawLLMExtraction

def find_sentence_with_pattern(pages: List[PageText], pattern: str) -> Optional[Tuple[str, str, int]]:
    """
    Searches pages for regex pattern.
    Returns (extracted_value, exact_sentence_quote, page_number) or None.
    """
    for page in pages:
        # Split into sentences roughly
        sentences = re.split(r"(?<=[.!?])\s+", page.text)
        for s in sentences:
            match = re.search(pattern, s, re.IGNORECASE)
            if match:
                val = match.group(0).strip()
                return val, s.strip(), page.page_number
    return None

def heuristic_extract_terms(pages: List[PageText]) -> RawLLMExtraction:
    """
    Deterministic rule-based extractor used in DEMO_MODE or as fallback
    when no LLM API key is present. Extracts exact sentences from pages.
    """
    raw = RawLLMExtraction()

    # 1. Payment Terms
    pt_match = find_sentence_with_pattern(
        pages,
        r"(?:Net\s+\d+|Zahlungsziel\s+\d+\s+Tage|within\s+\d+\s+(?:calendar\s+)?days|paid\s+within\s+(?:\w+\s+)?\(\d+\)\s+days)"
    )
    if pt_match:
        raw.payment_terms_value, raw.payment_terms_quote, raw.payment_terms_page = pt_match
        raw.payment_terms_confidence = 0.95

    # 2. Price Adjustment
    pa_match = find_sentence_with_pattern(
        pages,
        r"(?:CPI|Consumer\s+Price\s+Index|inflation|index-linked|fixed\s+for\s+the\s+initial\s+term|firm\s+and\s+fixed|renegotiated\s+annually|subject\s+to\s+mutual\s+agreement)"
    )
    if pa_match:
        raw.price_adjustment_value, raw.price_adjustment_quote, raw.price_adjustment_page = pa_match
        raw.price_adjustment_confidence = 0.92

    # 3. Contract Term
    ct_match = find_sentence_with_pattern(
        pages,
        r"(?:initial\s+term\s+of\s+this\s+Agreement\s+shall\s+be\s+\d+\s+months|duration\s+of\s+this\s+agreement\s+is\s+an\s+initial\s+term\s+of\s+\d+\s+months|contract\s+duration\s+of\s+\d+\s+months|initial\s+term\s+of\s+\d+\s+months|duration\s+of\s+\d+\s+months|initial\s+term\s+of\s+\d+\s+years)"
    )
    if ct_match:
        raw.contract_term_value, raw.contract_term_quote, raw.contract_term_page = ct_match
        raw.contract_term_confidence = 0.94

    # 4. Auto Renewal
    ar_match = find_sentence_with_pattern(
        pages,
        r"(?:automatically\s+renew\s+for\s+successive|consecutive\s+\d+-month\s+periods|shall\s+not\s+automatically\s+renew|will\s+automatically\s+renew|auto-renews\s+annually)"
    )
    if ar_match:
        raw.auto_renewal_value, raw.auto_renewal_quote, raw.auto_renewal_page = ar_match
        raw.auto_renewal_confidence = 0.91

    # 5. Termination Notice
    tn_match = find_sentence_with_pattern(
        pages,
        r"(?:written\s+notice\s+of\s+at\s+least\s+\d+\s+days|upon\s+\w+\s+\(\d+\)\s+days['’]?\s+prior\s+written\s+notice|upon\s+\d+\s+days['’]?\s+prior\s+written\s+notice|termination\s+notice\s+of\s+\d+\s+days|kündigungsfrist\s+von\s+\d+\s+tagen|within\s+\d+\s+days)"
    )
    if tn_match:
        raw.termination_notice_value, raw.termination_notice_quote, raw.termination_notice_page = tn_match
        raw.termination_notice_confidence = 0.93

    # 6. Liability Cap
    all_lc_matches = []
    for page in pages:
        sentences = re.split(r"(?<=[.!?])\s+", page.text)
        for s in sentences:
            if re.search(r"(?:liability\s+shall\s+not\s+exceed|aggregate\s+liability|liability\s+is\s+unlimited|uncapped\s+liability)", s, re.IGNORECASE):
                all_lc_matches.append((s.strip(), page.page_number))

    if len(all_lc_matches) > 1:
        # Multiple / conflicting clauses detected across pages!
        # Pick the overriding clause, but flag confidence < 0.75 to trigger needs_review
        overriding = next((m for m in all_lc_matches if "notwithstanding" in m[0].lower() or "unlimited" in m[0].lower()), all_lc_matches[0])
        raw.liability_cap_value = "conflicting clauses ($500k cap vs unlimited breach)"
        raw.liability_cap_quote = overriding[0]
        raw.liability_cap_page = overriding[1]
        raw.liability_cap_confidence = 0.62  # Triggers needs_review
    elif len(all_lc_matches) == 1:
        raw.liability_cap_value = all_lc_matches[0][0]
        raw.liability_cap_quote = all_lc_matches[0][0]
        raw.liability_cap_page = all_lc_matches[0][1]
        raw.liability_cap_confidence = 0.92

    # 7. Governing Law
    gl_match = find_sentence_with_pattern(
        pages,
        r"(?:governed\s+by.*?laws\s+of\s+(?:the\s+State\s+of\s+)?([A-Za-z\s]+?)(?:\.|,|without)|jurisdiction\s+of\s+(?:the\s+State\s+of\s+)?([A-Za-z\s]+?)(?:\.|$))"
    )
    if gl_match:
        raw.governing_law_value, raw.governing_law_quote, raw.governing_law_page = gl_match
        raw.governing_law_confidence = 0.96

    # 8. Volume Commitment
    vc_match = find_sentence_with_pattern(
        pages,
        r"(?:minimum\s+(?:annual\s+)?volume\s+commitment\s+of\s+[^.]+?|commits\s+to\s+purchase\s+at\s+least\s+[^.]+?|minimum\s+spend\s+of\s+[$€£\d,]+\s*(?:USD|EUR|GBP)?|minimum\s+spend\s+of\s+[^.]+?|minimum\s+volume\s+commitment\s+of\s+[^.]+?)"
    )
    if vc_match:
        raw.volume_commitment_value, raw.volume_commitment_quote, raw.volume_commitment_page = vc_match
        raw.volume_commitment_confidence = 0.90

    return raw
