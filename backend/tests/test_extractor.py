import os
import pytest
from backend.app.pipeline.extractor import extract_text_from_pdf_file

DATA_CONTRACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/contracts"))

def test_extract_text_from_pdf():
    pdf_path = os.path.join(DATA_CONTRACTS_DIR, "synthetic_01_it_services_standard.pdf")
    assert os.path.exists(pdf_path), f"Sample contract {pdf_path} must exist"
    
    pages, num_pages = extract_text_from_pdf_file(pdf_path)
    assert num_pages == 3
    assert len(pages) == 3
    assert pages[0].page_number == 1
    assert "MASTER IT MANAGED SERVICES AGREEMENT" in pages[0].text
    assert "Net 30 days" in pages[1].text
    assert "Delaware" in pages[2].text

