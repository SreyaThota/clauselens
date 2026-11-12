import pytest
from backend.app.pipeline.schemas import PageText
from backend.app.pipeline.grounding import (
    normalize_whitespace,
    check_grounding_on_page,
    verify_field_grounding
)

def test_normalize_whitespace():
    raw = "  Customer   shall pay \n\n all   invoices \t  within 30 days.  "
    expected = "Customer shall pay all invoices within 30 days."
    assert normalize_whitespace(raw) == expected

def test_check_grounding_exact_match():
    page_text = "Section 3. Invoices are payable within thirty (30) days from receipt."
    quote = "Invoices are payable within thirty (30) days from receipt."
    grounded, score = check_grounding_on_page(quote, page_text)
    assert grounded is True
    assert score == 1.0

def test_check_grounding_fuzzy_match():
    page_text = "Section 3. Invoices are payable   within thirty (30)  calendar days from receipt."
    # Slightly altered whitespace and punctuation
    quote = "Invoices are payable within thirty (30) calendar days from receipt"
    grounded, score = check_grounding_on_page(quote, page_text, threshold=0.90)
    assert grounded is True
    assert score >= 0.90

def test_check_grounding_hallucination_fails():
    page_text = "The supplier agrees to deliver the hardware within six weeks of PO receipt."
    fake_quote = "The customer shall pay a penalty of $50,000 for early termination."
    grounded, score = check_grounding_on_page(fake_quote, page_text, threshold=0.90)
    assert grounded is False
    assert score < 0.50

def test_verify_field_grounding_detects_wrong_page():
    pages = [
        PageText(page_number=1, text="Introduction and definitions."),
        PageText(page_number=2, text="Customer guarantees payment terms of Net 45 calendar days after invoice approval.")
    ]
    # Quote is actually on page 2, but cited as page 1
    quote = "Customer guarantees payment terms of Net 45 calendar days after invoice approval."
    is_grounded, score, actual_page, warning = verify_field_grounding(
        quote=quote,
        cited_page=1,
        pages=pages,
        threshold=0.90
    )
    assert is_grounded is False
    assert actual_page == 2
    assert "actually found on page 2" in warning

def test_suspicious_not_found_detection():
    from backend.app.pipeline.runner import find_suspicious_not_found_evidence
    pages = [
        PageText(page_number=1, text="This contract contains provisions regarding early termination and notice of 30 days.")
    ]
    ev = find_suspicious_not_found_evidence("termination_notice", pages)
    assert ev is not None
    assert ev[1] == 1
    assert "notice" in ev[0].lower() or "termination" in ev[0].lower()

def test_suspicious_not_found_no_match():
    from backend.app.pipeline.runner import find_suspicious_not_found_evidence
    pages = [
        PageText(page_number=1, text="Only general definitions and confidentiality clauses are included here.")
    ]
    ev = find_suspicious_not_found_evidence("liability_cap", pages)
    assert ev is None

