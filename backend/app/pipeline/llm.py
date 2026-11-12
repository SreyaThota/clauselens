from __future__ import annotations
import os
import json
import logging
from typing import Optional, Tuple
import httpx
from pydantic import ValidationError
from .schemas import RawLLMExtraction

logger = logging.getLogger("clauselens.llm")

EXTRACTION_SYSTEM_PROMPT = """You are a rigorous, highly accurate commercial contract extraction system.
Your job is to extract 8 commercial terms from the provided supplier contract text.

The 8 fields to extract are:
1. payment_terms: invoice payment timeline (e.g., Net 30, Net 60, Zahlungsziel 45 Tage).
2. price_adjustment: mechanism for price changes (fixed, index-linked e.g. CPI/inflation, renegotiable/mutual agreement, or none found).
3. contract_term: contract duration, effective start date and expiration (e.g. 36 months, 2 years, Jan 1 2024 to Dec 31 2026).
4. auto_renewal: whether the contract automatically renews and for what term (e.g. true for successive 1-year terms, or false).
5. termination_notice: required notice period in days or months for convenience or termination (e.g. 30 days, 60 days, 90 days).
6. liability_cap: aggregate liability limitation (e.g. $1,000,000, 12 months fees paid, or 'uncapped').
7. governing_law: jurisdiction/state/country governing the agreement (e.g. Delaware, New York, Germany, England and Wales).
8. volume_commitment: minimum purchase quantity or minimum spend commitment, or none found.

CRITICAL TRUST RULES:
- Never hallucinate or invent terms. If a clause is missing, silent, or omitted, you MUST set value to null, quote to null, page to null, and confidence to 0.0. "Not found" is always a valid and expected answer.
- For every extracted term, provide the EXACT VERBATIM source quote from the document text. Do not paraphrase.
- Provide the 1-indexed page number where the quote is located (use the [START PAGE X] tags in the text).
- Provide a confidence score between 0.0 and 1.0 based on clarity and certainty. If conflicting clauses exist or terms are ambiguous, assign a lower confidence (< 0.70).

You must return a valid JSON object matching this schema:
{
  "payment_terms_value": string or null,
  "payment_terms_quote": string or null,
  "payment_terms_page": integer or null,
  "payment_terms_confidence": float (0.0 to 1.0),

  "price_adjustment_value": string or null,
  "price_adjustment_quote": string or null,
  "price_adjustment_page": integer or null,
  "price_adjustment_confidence": float (0.0 to 1.0),

  "contract_term_value": string or null,
  "contract_term_quote": string or null,
  "contract_term_page": integer or null,
  "contract_term_confidence": float (0.0 to 1.0),

  "auto_renewal_value": string or null,
  "auto_renewal_quote": string or null,
  "auto_renewal_page": integer or null,
  "auto_renewal_confidence": float (0.0 to 1.0),

  "termination_notice_value": string or null,
  "termination_notice_quote": string or null,
  "termination_notice_page": integer or null,
  "termination_notice_confidence": float (0.0 to 1.0),

  "liability_cap_value": string or null,
  "liability_cap_quote": string or null,
  "liability_cap_page": integer or null,
  "liability_cap_confidence": float (0.0 to 1.0),

  "governing_law_value": string or null,
  "governing_law_quote": string or null,
  "governing_law_page": integer or null,
  "governing_law_confidence": float (0.0 to 1.0),

  "volume_commitment_value": string or null,
  "volume_commitment_quote": string or null,
  "volume_commitment_page": integer or null,
  "volume_commitment_confidence": float (0.0 to 1.0)
}
"""

async def call_gemini_api(prompt: str, system_prompt: str, model: str, api_key: str) -> Tuple[str, int]:
    """Call Google Gemini API using native v1beta JSON schema / generation."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{system_prompt}\n\nCONTRACT TEXT:\n{prompt}"}]}
        ],
        "generationConfig": {
            "temperature": 0.0,
            "responseMimeType": "application/json"
        }
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise ValueError("No candidates returned from Gemini API")
        text = candidates[0]["content"]["parts"][0]["text"]
        usage = data.get("usageMetadata", {})
        total_tokens = usage.get("totalTokenCount", 1200)
        return text, total_tokens

async def call_openai_api(prompt: str, system_prompt: str, model: str, api_key: str) -> Tuple[str, int]:
    """Call OpenAI API using structured JSON output."""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "temperature": 0.0,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        text = data["choices"][0]["message"]["content"]
        total_tokens = data.get("usage", {}).get("total_tokens", 1200)
        return text, total_tokens

async def extract_terms_with_llm(contract_text: str) -> Tuple[RawLLMExtraction, int]:
    """
    Extracts structured terms from contract text using configured LLM provider.
    Includes 1 automatic retry on validation failure.
    """
    provider = os.getenv("LLM_PROVIDER", "").lower()
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    openai_key = os.getenv("OPENAI_API_KEY", "")

    # Auto-detect provider if not explicitly given
    if not provider:
        if gemini_key:
            provider = "gemini"
        elif openai_key:
            provider = "openai"
        else:
            provider = "demo"

    model = os.getenv("LLM_MODEL")
    if not model:
        model = "gemini-2.0-flash" if provider == "gemini" else "gpt-4o-mini"

    if provider == "demo" or (not gemini_key and not openai_key):
        raise ValueError("No API key configured for LLM extraction.")

    # Call LLM with 1 retry on Pydantic validation failure
    last_error: Optional[Exception] = None
    for attempt in range(2):
        try:
            current_prompt = contract_text
            if attempt > 0 and last_error:
                current_prompt += f"\n\nNOTE: Previous attempt failed validation with error: {str(last_error)}. Ensure exact JSON structure."

            if provider == "gemini":
                raw_json, tokens = await call_gemini_api(current_prompt, EXTRACTION_SYSTEM_PROMPT, model, gemini_key)
            elif provider == "openai":
                raw_json, tokens = await call_openai_api(current_prompt, EXTRACTION_SYSTEM_PROMPT, model, openai_key)
            else:
                raise ValueError(f"Unsupported LLM provider: {provider}")

            parsed_data = json.loads(raw_json)
            validated = RawLLMExtraction.model_validate(parsed_data)
            return validated, tokens
        except (ValidationError, json.JSONDecodeError, httpx.HTTPError) as err:
            logger.warning(f"LLM extraction attempt {attempt + 1} failed: {err}")
            last_error = err
            if attempt == 1:
                raise err

    raise RuntimeError("Failed to extract terms after retry.")

