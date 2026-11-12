from __future__ import annotations
import re
from typing import List, Tuple, Optional
from rapidfuzz import fuzz
from .schemas import PageText

def normalize_whitespace(text: str) -> str:
    """Normalizes whitespace (newlines, tabs, multiple spaces) into single spaces."""
    if not text:
        return ""
    # Replace non-breaking spaces and other unicode space variants
    cleaned = re.sub(r"[\s\xa0\u200b]+", " ", text)
    return cleaned.strip()

def check_grounding_on_page(quote: str, page_text: str, threshold: float = 0.90) -> Tuple[bool, float]:
    """
    Checks if a quote appears on a given page text using normalized whitespace and fuzzy matching.
    Returns (is_grounded, match_score).
    """
    if not quote or not page_text:
        return False, 0.0
    
    norm_quote = normalize_whitespace(quote).lower()
    norm_page = normalize_whitespace(page_text).lower()
    
    if not norm_quote:
        return False, 0.0
    
    # 1. Exact substring match after whitespace normalization
    if norm_quote in norm_page:
        return True, 1.0
    
    # 2. Fuzzy partial ratio: finds the best matching substring in page_text
    partial_score = fuzz.partial_ratio(norm_quote, norm_page) / 100.0
    
    if partial_score >= threshold:
        return True, round(partial_score, 3)
        
    # 3. Token set ratio for cases where word ordering or minor punctuation differs
    token_score = fuzz.token_set_ratio(norm_quote, norm_page) / 100.0
    if token_score >= 0.95 and len(norm_quote) > 15:
        # Check partial alignment on token level
        return True, round(token_score, 3)
        
    return False, round(partial_score, 3)

def verify_field_grounding(
    quote: Optional[str],
    cited_page: Optional[int],
    pages: List[PageText],
    threshold: float = 0.90
) -> Tuple[bool, float, Optional[int], Optional[str]]:
    """
    Verifies that the source quote exists on the cited page (or another page).
    Returns:
      (is_grounded, match_score, actual_page, warning_message)
    """
    if not quote or not quote.strip():
        return False, 0.0, None, "No source quote provided."
    
    # Check cited page first
    if cited_page is not None and 1 <= cited_page <= len(pages):
        page_obj = pages[cited_page - 1]
        grounded, score = check_grounding_on_page(quote, page_obj.text, threshold=threshold)
        if grounded:
            return True, score, cited_page, None
            
    # If not found on cited page, search all other pages to detect wrong page citation
    best_score = 0.0
    best_page: Optional[int] = None
    for p in pages:
        if cited_page is not None and p.page_number == cited_page:
            continue
        g, s = check_grounding_on_page(quote, p.text, threshold=threshold)
        if s > best_score:
            best_score = s
            best_page = p.page_number
            
    if best_score >= threshold and best_page is not None:
        return False, best_score, best_page, (
            f"Quote was cited on page {cited_page}, but actually found on page {best_page} (score {best_score:.2f})."
        )
        
    return False, best_score, None, f"Source quote could not be verified in the document (best match {best_score:.2f} < {threshold})."

