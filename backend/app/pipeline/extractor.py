from __future__ import annotations
import io
from typing import List, Tuple
import fitz  # PyMuPDF
from .schemas import PageText

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> Tuple[List[PageText], int]:
    """
    Extracts text per page from PDF bytes using PyMuPDF.
    Returns a list of PageText (1-indexed page_number) and total page count.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages: List[PageText] = []
    num_pages = len(doc)
    
    for idx in range(num_pages):
        page = doc[idx]
        text = page.get_text("text")
        pages.append(PageText(page_number=idx + 1, text=text))
        
    doc.close()
    return pages, num_pages

def extract_text_from_pdf_file(filepath: str) -> Tuple[List[PageText], int]:
    """
    Extracts text per page from a PDF file path.
    """
    with open(filepath, "rb") as f:
        data = f.read()
    return extract_text_from_pdf_bytes(data)

