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
    normalize_volume_commitment,
    parse_volume_number,
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

def test_normalize_liability_cap_amount_and_currency():
    # User requirement: Normalise liability_cap to "amount + currency" (e.g. "500,000 EUR"), or "uncapped"/"none found"
    assert normalize_liability_cap("$1,000,000 USD") == "1,000,000 USD"
    assert normalize_liability_cap("$1,000,000") == "1,000,000 USD"
    assert normalize_liability_cap("500,000 EUR") == "500,000 EUR"
    assert normalize_liability_cap("500.000 EUR") == "500,000 EUR"
    assert normalize_liability_cap("€500,000") == "500,000 EUR"
    assert normalize_liability_cap("$5,000,000 USD") == "5,000,000 USD"
    assert normalize_liability_cap("unlimited liability") == "uncapped"
    assert normalize_liability_cap("uncapped") == "uncapped"
    assert normalize_liability_cap("fees paid in preceding 12 months") == "fees paid in preceding 12 months"
    assert normalize_liability_cap(None) == "none found"
    assert normalize_liability_cap("silent") == "none found"

def test_normalize_governing_law_including_german():
    assert normalize_governing_law("State of Delaware") == "Delaware"
    assert normalize_governing_law("laws of the State of New York") == "New York"
    assert normalize_governing_law("Commonwealth of Massachusetts") == "Massachusetts"
    assert normalize_governing_law("Germany") == "Germany"
    # Specific test case for synthetic_03 parenthetical phrasing
    assert normalize_governing_law("Germany (Bundesrepublik Deutschland)") == "Germany"
    assert normalize_governing_law("laws of Germany (Bundesrepublik Deutschland)") == "Germany"

def test_volume_commitment_thousands_separators():
    # User requirement: In volume_commitment normalisation, parse numbers with thousands separators (“5,000”, “5.000”) correctly.
    assert normalize_volume_commitment("5,000 standard freight pallets") == "5,000 standard freight pallets"
    assert normalize_volume_commitment("5.000 standard freight pallets") == "5,000 standard freight pallets"
    assert normalize_volume_commitment("10,000 accelerator units per calendar year") == "10,000 accelerator units per calendar year"
    assert normalize_volume_commitment("10.000 accelerator units per calendar year") == "10,000 accelerator units per calendar year"
    assert normalize_volume_commitment("1,200 patrol hours per month") == "1,200 patrol hours per month"
    assert normalize_volume_commitment("1.200 patrol hours per month") == "1,200 patrol hours per month"
    assert normalize_volume_commitment("minimum spend of $120,000 USD per contract year") == "$120,000 USD per contract year"
    assert normalize_volume_commitment("no volume commitment") == "none found"
    assert normalize_volume_commitment("none found") == "none found"
    assert normalize_volume_commitment(None) == "none found"

def test_parse_volume_number():
    assert parse_volume_number("5,000") == 5000.0
    assert parse_volume_number("5.000") == 5000.0
    assert parse_volume_number("10,000 units") == 10000.0
    assert parse_volume_number("10.000 units") == 10000.0
    assert parse_volume_number("1,200") == 1200.0
    assert parse_volume_number("1.200") == 1200.0
    assert parse_volume_number("500") == 500.0
    assert parse_volume_number("none found") is None

def test_normalize_field_value_dispatch():
    assert normalize_field_value("payment_terms", "Net 30 days") == 30
    assert normalize_field_value("price_adjustment", "CPI increase") == "index-linked"
    assert normalize_field_value("termination_notice", "60 days") == 60
    assert normalize_field_value("liability_cap", "500,000 EUR") == "500,000 EUR"
    assert normalize_field_value("governing_law", "Germany (Bundesrepublik Deutschland)") == "Germany"
    assert normalize_field_value("volume_commitment", "5.000 pallets") == "5,000 pallets"
