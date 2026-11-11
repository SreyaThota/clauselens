import os
import pytest
from backend.app.pipeline.schemas import (
    ExtractedField,
    ExtractionResult,
    ExtractionSummary,
    RawLLMExtraction
)
from backend.app.pipeline.runner import run_extraction_pipeline

DATA_CONTRACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/contracts"))

def test_extracted_field_validation():
    field = ExtractedField(
        field_name="payment_terms",
        value="Net 60",
        normalized=60,
        source_quote="Net 60 calendar days",
        page=2,
        confidence=0.95,
        status="verified"
    )
    assert field.confidence == 0.95
    assert field.status == "verified"
    assert field.normalized == 60

def test_raw_llm_extraction_schema():
    raw = RawLLMExtraction(
        payment_terms_value="Net 30",
        payment_terms_quote="Invoices are Net 30",
        payment_terms_page=1,
        payment_terms_confidence=0.9
    )
    assert raw.payment_terms_value == "Net 30"
    assert raw.payment_terms_page == 1

@pytest.mark.asyncio
async def test_run_extraction_pipeline_end_to_end():
    pdf_path = os.path.join(DATA_CONTRACTS_DIR, "synthetic_01_it_services_standard.pdf")
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    result = await run_extraction_pipeline(
        pdf_bytes=pdf_bytes,
        filename="synthetic_01_it_services_standard.pdf",
        contract_id="synthetic_01_it_services_standard"
    )

    assert result.num_pages == 3
    assert len(result.fields) == 8
    assert result.summary.verified_count >= 6
    assert result.fields["payment_terms"].status == "verified"
    assert result.fields["payment_terms"].normalized == 30
    assert len(result.negotiation_levers) >= 1
