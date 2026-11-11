import pytest
from backend.app.pipeline.normalizer import (
    extract_days_from_text,
    normalize_payment_terms,
    normalize_price_adjustment,
    normalize_contract_term,
    normalize_auto_renewal,
    normalize_termination_notice,
    normalize_liability_cap,
    normalize_governing_law,
    normalize_field_value
)

def test_extract_days():
    assert extract_days_from_text("net 60") == 60
    assert extract_days_from_text("sixty (60) days") == 60
    assert extract_days_from_text("within 30 calendar days") == 30
    assert extract_days_from_text("Zahlungsziel 45 Tage") == 45
    assert extract_days_from_text("30 Tage netto") == 30
    assert extract_days_from_text("14 days") == 14

def test_normalize_price_adjustment():
    assert normalize_price_adjustment("adjusted annually per CPI") == "index-linked"
    assert normalize_price_adjustment("Producer Price Index (PPI)") == "index-linked"
    assert normalize_price_adjustment("firm and fixed for duration") == "fixed"
    assert normalize_price_adjustment("renegotiated annually by mutual agreement") == "renegotiable"
    assert normalize_price_adjustment(None) == "none found"
    assert normalize_price_adjustment("not specified") == "none found"

def test_normalize_auto_renewal():
    assert normalize_auto_renewal("successive 12-month periods") == "true (12 months)"
    assert normalize_auto_renewal("auto-renews annually") == "true (12 months)"
    assert normalize_auto_renewal("shall not automatically renew") == "false"
    assert normalize_auto_renewal("does not renew") == "false"
    assert normalize_auto_renewal(None) == "none found"

def test_normalize_liability_cap():
    assert normalize_liability_cap("unlimited liability") == "uncapped"
    assert normalize_liability_cap("uncapped") == "uncapped"
    assert normalize_liability_cap("$1,000,000 USD") == "$1,000,000 USD"
    assert normalize_liability_cap("fees paid in preceding 12 months") == "fees paid in preceding 12 months"
    assert normalize_liability_cap(None) == "none found"

def test_normalize_governing_law():
    assert normalize_governing_law("State of Delaware") == "Delaware"
    assert normalize_governing_law("laws of the State of New York") == "New York"
    assert normalize_governing_law("Commonwealth of Massachusetts") == "Massachusetts"
    assert normalize_governing_law("Germany") == "Germany"

def test_normalize_field_value_dispatch():
    assert normalize_field_value("payment_terms", "Net 30 days") == 30
    assert normalize_field_value("price_adjustment", "CPI increase") == "index-linked"
    assert normalize_field_value("termination_notice", "60 days") == 60
    assert normalize_field_value("governing_law", "State of California") == "California"
    assert normalize_field_value("volume_commitment", "none") == "none found"
