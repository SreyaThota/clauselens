from __future__ import annotations
import re
from typing import Optional, Union

WORD_TO_NUMBER = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "fifteen": 15, "twenty": 20, "thirty": 30, "forty": 40, "forty-five": 45,
    "forty five": 45, "fifty": 50, "sixty": 60, "ninety": 90, "one hundred": 100,
    "one hundred twenty": 120, "120": 120, "zehn": 10, "vierzehn": 14,
    "dreißig": 30, "sechzig": 60, "neunzig": 90
}

def extract_days_from_text(text: Optional[str]) -> Optional[int]:
    """
    Extracts number of days from strings like:
    - 'net 60' -> 60
    - 'sixty (60) days' -> 60
    - 'within 30 calendar days' -> 30
    - 'Zahlungsziel 45 Tage' -> 45
    - '30 Tage netto' -> 30
    - '14 days' -> 14
    """
    if not text or text.lower() in ("none", "none found", "not specified", "n/a", "not_found"):
        return None
    
    # 1. Direct digits in parentheses e.g. "sixty (60) days"
    paren_match = re.search(r"\((\d+)\)\s*(?:days|calendar days|tage|business days)?", text, re.IGNORECASE)
    if paren_match:
        return int(paren_match.group(1))

    # 2. German "Zahlungsziel XX Tage" or "XX Tage"
    de_match = re.search(r"(?:zahlungsziel|frist)?\s*(\d+)\s*(?:tage|tagen|werktage)", text, re.IGNORECASE)
    if de_match:
        return int(de_match.group(1))

    # 3. Standard "Net XX" or "XX days"
    net_match = re.search(r"(?:net|within|after)?\s*(\d+)\s*(?:calendar\s+days|business\s+days|days|tage)?", text, re.IGNORECASE)
    if net_match and net_match.group(1):
        digits = int(net_match.group(1))
        if 1 <= digits <= 365:
            return digits

    # 4. Words
    lower = text.lower()
    for word, num in WORD_TO_NUMBER.items():
        if word in lower:
            return num

    return None

def normalize_payment_terms(value: Optional[str]) -> Optional[Union[int, str]]:
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found"):
        return "none found"
    days = extract_days_from_text(value)
    if days is not None:
        return days
    return value.strip()

def normalize_price_adjustment(value: Optional[str]) -> str:
    """
    Normalizes to one of: fixed / index-linked / renegotiable / none found
    """
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found", "silent"):
        return "none found"
        
    lower = value.lower()
    if any(k in lower for k in ["cpi", "rpi", "ppi", "index", "inflation", "verbraucherpreisindex", "cost of living"]):
        return "index-linked"
    if any(k in lower for k in ["renegotiat", "mutual agreement", "review annually", "subject to negotiation", "neu verhandelt"]):
        return "renegotiable"
    if any(k in lower for k in ["fixed", "firm", "no increase", "no adjustment", "unchanged", "festpreis"]):
        return "fixed"
        
    return "none found"

def normalize_contract_term(value: Optional[str]) -> str:
    """
    Normalizes to start date, end date, or duration in months.
    """
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found"):
        return "none found"
        
    val = value.strip()
    year_match = re.search(r"(\d+)\s*(?:year|yr|jahre)", val, re.IGNORECASE)
    if year_match:
        years = int(year_match.group(1))
        return f"{years * 12} months"
        
    month_match = re.search(r"(\d+)\s*(?:month|monate)", val, re.IGNORECASE)
    if month_match:
        return f"{month_match.group(1)} months"
        
    return val

def normalize_auto_renewal(value: Optional[str]) -> str:
    """
    Normalizes to true / false, plus renewal period. E.g. 'true (12 months)' or 'false'
    """
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found"):
        return "none found"
        
    lower = value.lower()
    if any(k in lower for k in ["no auto", "not auto", "shall not", "does not renew", "non-renewing", "false", "no renewal", "will terminate automatically", "without renewal"]):
        return "false"
        
    if any(k in lower for k in ["auto", "renew", "consecutive", "successive", "extended for", "verlängert", "true"]):
        if any(ann in lower for ann in ["annual", "annually", "each year", "jährlich", "1 year", "1-year"]):
            return "true (12 months)"
        period_match = re.search(r"(\d+)[-\s]*(?:month|year|yr|jahre|monate)", lower)
        if period_match:
            period_str = period_match.group(0)
            if "year" in period_str or "yr" in period_str or "jahr" in period_str:
                num = int(period_match.group(1))
                return f"true ({num * 12} months)"
            return f"true ({period_match.group(1)} months)"
        return "true"
        
    return value.strip()

def normalize_termination_notice(value: Optional[str]) -> Optional[Union[int, str]]:
    """
    Normalizes to number of days.
    """
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found"):
        return "none found"
    days = extract_days_from_text(value)
    if days is not None:
        return days
        
    m_match = re.search(r"(\d+)\s*(?:month|monat)", value, re.IGNORECASE)
    if m_match:
        return int(m_match.group(1)) * 30
        
    return value.strip()

def normalize_liability_cap(value: Optional[str]) -> str:
    """
    Normalizes liability_cap to 'amount + currency' (e.g. '500,000 EUR', '1,000,000 USD'),
    or 'uncapped' / 'none found'.
    """
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found", "silent"):
        return "none found"
        
    lower = value.lower().strip()
    if any(k in lower for k in ["uncapped", "unlimited", "no limitation", "no cap", "unbeschränkt"]):
        return "uncapped"
        
    if "fees paid" in lower or "charges paid" in lower:
        return value.strip()

    # Determine currency
    currency = "USD"
    if "eur" in lower or "€" in lower:
        currency = "EUR"
    elif "gbp" in lower or "£" in lower:
        currency = "GBP"
    elif "usd" in lower or "$" in lower:
        currency = "USD"

    # Match numbers with thousands separators like 1,000,000 or 500,000 or 500.000
    # Group 1: Number with thousands separators
    num_match = re.search(r"(\d{1,3}(?:[.,]\d{3})+(?:\.\d+)?|\d+)", value)
    if num_match:
        raw_num = num_match.group(1)
        # Normalize European dot separator to standard comma: 500.000 -> 500,000
        if "." in raw_num and "," not in raw_num:
            parts = raw_num.split(".")
            if len(parts) > 1 and all(len(p) == 3 for p in parts[1:]):
                raw_num = ",".join(parts)
        return f"{raw_num} {currency}"

    return value.strip()

def normalize_governing_law(value: Optional[str]) -> str:
    """
    Normalizes to country or state name.
    """
    if not value or value.lower() in ("none", "none found", "not specified", "n/a", "not_found"):
        return "none found"
        
    val = value.strip()
    # Strip common boilerplate
    cleaned = re.sub(r"^(?:laws? of(?: the state of)?|state of|commonwealth of)\s*", "", val, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"[\.,;]+$", "", cleaned)
    # Strip German translation annotations e.g. "Germany (Bundesrepublik Deutschland)" -> "Germany"
    cleaned = re.sub(r"\s*\(.*?\)\s*", "", cleaned).strip()
    return cleaned if cleaned else val

def parse_volume_number(text: str) -> Optional[float]:
    """
    Parses a numeric volume from string with comma or dot thousands separators.
    e.g. '5,000' -> 5000.0, '5.000' -> 5000.0, '10,000 units' -> 10000.0
    """
    if not text:
        return None
    m = re.search(r"(\d{1,3}(?:[.,]\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)", text)
    if not m:
        return None
    raw = m.group(1)
    # Check if dot is thousands separator (e.g. 5.000 or 10.000)
    if "." in raw and "," not in raw:
        parts = raw.split(".")
        if len(parts) > 1 and all(len(p) == 3 for p in parts[1:]):
            return float("".join(parts))
    # Comma thousands separator (e.g. 5,000)
    clean_str = raw.replace(",", "")
    try:
        return float(clean_str)
    except ValueError:
        return None

def normalize_volume_commitment(value: Optional[str]) -> str:
    """
    Normalizes to minimum quantity or spend, or 'none found'.
    Correctly handles thousands separators ('5,000', '5.000').
    """
    if not value or str(value).lower() in (
        "none", "none found", "not specified", "n/a", "not_found",
        "no commitment", "no minimum", "no volume commitment"
    ):
        return "none found"
        
    val = str(value).strip()
    lower = val.lower()
    
    if any(k in lower for k in [
        "no volume commitment",
        "makes no volume commitment",
        "not made any volume commitment",
        "no commitment is required"
    ]):
        return "none found"

    # Standardize thousands separator with dots e.g. '5.000' -> '5,000', '10.000' -> '10,000'
    def replace_dot_thousands(match: re.Match) -> str:
        s = match.group(0)
        parts = s.split(".")
        if len(parts) > 1 and all(len(p) == 3 for p in parts[1:]):
            return ",".join(parts)
        return s

    val = re.sub(r"\b\d{1,3}(?:\.\d{3})+\b", replace_dot_thousands, val)
    
    # Strip leading phrases like "minimum annual volume commitment of", "commits to purchase at least"
    val = re.sub(
        r"^(?:customer\s+guarantees\s+a\s+|buyer\s+guarantees\s+a\s+|der\s+auftraggeber\s+commits\s+to\s+purchase\s+at\s+least\s+|purchaser\s+commits\s+to\s+purchase\s+at\s+least\s+|commits\s+to\s+purchase\s+at\s+least\s+|minimum\s+(?:annual\s+)?volume\s+commitment\s+of\s+|minimum\s+spend\s+of\s+|host\s+guarantees\s+a\s+minimum\s+volume\s+commitment\s+of\s+|client\s+agrees\s+to\s+a\s+minimum\s+volume\s+commitment\s+of\s+)",
        "",
        val,
        flags=re.IGNORECASE
    ).strip()

    # Strip trailing clause padding like "throughout each contract year." or "for corporate campus maintenance."
    val = re.sub(r"\s+(?:throughout|for\s+corporate|across\s+all)\s+.*$", "", val, flags=re.IGNORECASE).strip()
    val = re.sub(r"[\.,;]+$", "", val).strip()

    return val if val else "none found"

def normalize_field_value(field_name: str, raw_value: Optional[str]) -> Optional[Union[str, int, float, bool]]:
    if raw_value is None or str(raw_value).strip().lower() in ("none", "none found", "not_found", "n/a", "null"):
        return "none found"
        
    str_val = str(raw_value).strip()
    
    if field_name == "payment_terms":
        return normalize_payment_terms(str_val)
    elif field_name == "price_adjustment":
        return normalize_price_adjustment(str_val)
    elif field_name == "contract_term":
        return normalize_contract_term(str_val)
    elif field_name == "auto_renewal":
        return normalize_auto_renewal(str_val)
    elif field_name == "termination_notice":
        return normalize_termination_notice(str_val)
    elif field_name == "liability_cap":
        return normalize_liability_cap(str_val)
    elif field_name == "governing_law":
        return normalize_governing_law(str_val)
    elif field_name == "volume_commitment":
        return normalize_volume_commitment(str_val)
        
    return str_val
