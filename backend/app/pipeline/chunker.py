from __future__ import annotations
from typing import List
from .schemas import PageText

def format_pages_for_llm(pages: List[PageText]) -> str:
    """
    Formats extracted page texts into structured markdown-style sections
    with explicit [PAGE N] headers so the LLM can accurately cite page numbers.
    """
    sections = []
    for p in pages:
        cleaned_text = p.text.strip()
        sections.append(f"--- START PAGE {p.page_number} ---\n{cleaned_text}\n--- END PAGE {p.page_number} ---")
    return "\n\n".join(sections)
