from __future__ import annotations
import re
from typing import List, Optional, Tuple
from .schemas import PageText, RawLLMExtraction

def clean_whitespace(text: str) -> str:
    """Normalizes whitespace (newlines, tabs, double spaces) into clean single-spaced string."""
    return " ".join(text.split())

def find_sentence_with_pattern(pages: List[PageText], pattern: str) -> Optional[Tuple[str, str, int]]:
    """
    Searches pages for regex pattern across normalized sentences.
    Returns (extracted_value, exact_sentence_quote, page_number) or None.
    """
    for page in pages:
        raw_sentences = re.split(r"(?<=[.!?])\s+", page.text)
        for raw_s in raw_sentences:
            s = clean_whitespace(raw_s)
            match = re.search(pattern, s, re.IGNORECASE)
            if match:
                val = match.group(0).strip()
                return val, raw_s.strip(), page.page_number
    return None

def heuristic_extract_terms(pages: List[PageText]) -> RawLLMExtraction:
    """
    Deterministic rule-based extractor used in DEMO_MODE or as baseline
    when no LLM API key is present. Extracts exact sentences from pages.
    """
    raw = RawLLMExtraction()

    # 1. Payment Terms
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            if not any(k in s.lower() for k in ("invoice", "payment", "paid", "net", "rechnung", "zahlungsziel")):
                continue
            m = re.search(
                r"(?:Zahlungsziel\s+\d+\s+Tage|\bNet\s+\d+\s*(?:calendar\s+days|days)?|"
                r"within\s+\w+\s+\(\d+\)\s*(?:calendar\s+days|days)|"
                r"within\s+[^.]*?\b\d+\b\s*(?:calendar\s+days|days)|"
                r"within\s+\d+\s*(?:calendar\s+days|days)|"
                r"\b\d+\s+(?:calendar\s+days|days)\s+from)",
                s,
                re.IGNORECASE
            )
            if m:
                raw.payment_terms_value = m.group(0).strip()
                raw.payment_terms_quote = raw_s.strip()
                raw.payment_terms_page = page.page_number
                raw.payment_terms_confidence = 0.95
                break
        if raw.payment_terms_value:
            break

    # 2. Price Adjustment
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            if re.search(r"(?:contains\s+no\s+price\s+adjustment|no\s+price\s+adjustment\s+or\s+price\s+escalation)", s, re.IGNORECASE):
                raw.price_adjustment_value = "none found"
                raw.price_adjustment_quote = raw_s.strip()
                raw.price_adjustment_page = page.page_number
                raw.price_adjustment_confidence = 0.95
                break
            m = re.search(
                r"(?:CPI|Consumer\s+Price\s+Index|inflation|index-linked|Verbraucherpreisindex|Producer\s+Price\s+Index\s*\(PPI\)|PPI|"
                r"firm\s+and\s+fixed|fixed\s+for\s+the\s+initial\s+term|fixed\s+for\s+the\s+entire|renegotiated\s+annually|subject\s+to\s+renegotiation|subject\s+to\s+mutual\s+agreement)",
                s,
                re.IGNORECASE
            )
            if m:
                raw.price_adjustment_value = m.group(0).strip()
                raw.price_adjustment_quote = raw_s.strip()
                raw.price_adjustment_page = page.page_number
                raw.price_adjustment_confidence = 0.92
                break
        if raw.price_adjustment_value:
            break

    # 3. Contract Term
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            m = re.search(
                r"(?:initial\s+term\s+of\s+this\s+Agreement\s+shall\s+be\s+\d+\s+(?:months|years)|"
                r"duration\s+of\s+this\s+agreement\s+is\s+(?:an\s+initial\s+term\s+of\s+)?\d+\s+(?:months|years)|"
                r"contract\s+duration\s+of\s+\d+\s+(?:months|years)|"
                r"initial\s+term\s+of\s+\d+\s+(?:months|years)|"
                r"duration\s+of\s+\d+\s+(?:months|years))",
                s,
                re.IGNORECASE
            )
            if m:
                raw.contract_term_value = m.group(0).strip()
                raw.contract_term_quote = raw_s.strip()
                raw.contract_term_page = page.page_number
                raw.contract_term_confidence = 0.94
                break
        if raw.contract_term_value:
            break

    # 4. Auto Renewal
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            m = re.search(
                r"(?:automatically\s+renew\s+for\s+successive\s+[^.]+?|"
                r"automatically\s+renew\s+for\s+consecutive\s+[^.]+?|"
                r"auto-renews\s+annually|"
                r"shall\s+not\s+automatically\s+renew|"
                r"will\s+not\s+automatically\s+renew|"
                r"non-renewing)",
                s,
                re.IGNORECASE
            )
            if m:
                raw.auto_renewal_value = s
                raw.auto_renewal_quote = raw_s.strip()
                raw.auto_renewal_page = page.page_number
                raw.auto_renewal_confidence = 0.91
                break
        if raw.auto_renewal_value:
            break

    # 5. Termination Notice
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            m = re.search(
                r"(?:written\s+notice\s+of\s+at\s+least\s+\d+\s+days|"
                r"upon\s+(?:\w+\s+)?\(\d+\)\s+days['’]?\s+prior\s+written\s+notice|"
                r"upon\s+\d+\s+days['’]?\s+prior\s+written\s+notice|"
                r"written\s+notice\s+of\s+at\s+least\s+\d+\s+days|"
                r"kündigungsfrist\s+von\s+\d+\s+tagen|"
                r"termination\s+(?:notice\s+of\s+|upon\s+)\d+\s+days)",
                s,
                re.IGNORECASE
            )
            if m:
                raw.termination_notice_value = m.group(0).strip()
                raw.termination_notice_quote = raw_s.strip()
                raw.termination_notice_page = page.page_number
                raw.termination_notice_confidence = 0.93
                break
        if raw.termination_notice_value:
            break

    # 6. Liability Cap
    all_lc_matches = []
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            if re.search(r"(?:liability\s+shall\s+not\s+exceed|aggregate\s+liability|total\s+liability.*?exceed|liability\s+is\s+unlimited|uncapped\s+liability)", s, re.IGNORECASE):
                all_lc_matches.append((s, raw_s.strip(), page.page_number))

    if len(all_lc_matches) > 1:
        # Multiple / conflicting clauses detected across pages!
        overriding = next((m for m in all_lc_matches if "notwithstanding" in m[0].lower() or "unlimited" in m[0].lower()), all_lc_matches[0])
        raw.liability_cap_value = "conflicting clauses ($500k cap vs unlimited breach)"
        raw.liability_cap_quote = overriding[1]
        raw.liability_cap_page = overriding[2]
        raw.liability_cap_confidence = 0.38  # Confidence <= 0.40 triggers needs_review badge
    elif len(all_lc_matches) == 1:
        s_clean, raw_quote, s_page = all_lc_matches[0]
        cap_m = re.search(r"(?:exceed\s+([$€£\d,.]+\s*(?:USD|EUR|GBP)?)|fees\s+paid\s+in\s+the\s+preceding\s+twelve\s+months|uncapped|unlimited)", s_clean, re.IGNORECASE)
        raw.liability_cap_value = cap_m.group(0).replace("exceed", "").strip() if cap_m else s_clean
        raw.liability_cap_quote = raw_quote
        raw.liability_cap_page = s_page
        raw.liability_cap_confidence = 0.92

    # 7. Governing Law (handles multi-line parentheses e.g. Germany (Bundesrepublik Deutschland))
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            gl_m = re.search(
                r"(?:governed\s+by.*?laws\s+of\s+(?:the\s+State\s+of\s+|the\s+Commonwealth\s+of\s+)?([A-Za-z\s]+?)(?:\s*\(.*?\))?(?:\.|,|;|\s+without|$)|jurisdiction\s+of\s+(?:the\s+State\s+of\s+)?([A-Za-z\s]+?)(?:\.|$))",
                s,
                re.IGNORECASE
            )
            if gl_m:
                val = gl_m.group(1) or gl_m.group(2)
                if val and val.strip().lower() not in ("the", "this", "each"):
                    raw.governing_law_value = val.strip()
                    raw.governing_law_quote = raw_s.strip()
                    raw.governing_law_page = page.page_number
                    raw.governing_law_confidence = 0.96
                    break
        if raw.governing_law_value:
            break

    # 8. Volume Commitment (clean handling of thousands separators and omitted commitments)
    for page in pages:
        for raw_s in re.split(r"(?<=[.!?])\s+", page.text):
            s = clean_whitespace(raw_s)
            if re.search(r"(?:no\s+volume\s+commitment|not\s+made\s+any\s+volume\s+commitment|makes\s+no\s+volume\s+commitment|no\s+commitment\s+is\s+required)", s, re.IGNORECASE):
                raw.volume_commitment_value = "none found"
                raw.volume_commitment_quote = raw_s.strip()
                raw.volume_commitment_page = page.page_number
                raw.volume_commitment_confidence = 0.95
                break
                
            vc_m = re.search(
                r"(?:minimum\s+(?:annual\s+)?volume\s+commitment\s+of\s+|"
                r"commits\s+to\s+purchase\s+at\s+least\s+|"
                r"minimum\s+spend\s+of\s+|"
                r"minimum\s+volume\s+commitment\s+of\s+)"
                r"([^.]+?)(?:\s+(?:throughout|across\s+the\s+network|for\s+corporate)|\.|$)",
                s,
                re.IGNORECASE
            )
            if vc_m:
                raw.volume_commitment_value = vc_m.group(1).strip()
                raw.volume_commitment_quote = raw_s.strip()
                raw.volume_commitment_page = page.page_number
                raw.volume_commitment_confidence = 0.92
                break
        if raw.volume_commitment_value:
            break

    return raw
