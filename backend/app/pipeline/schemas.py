from __future__ import annotations
from typing import Dict, List, Optional, Union, Literal
from pydantic import BaseModel, Field

FieldStatus = Literal["verified", "needs_review", "not_found"]
PriceAdjustmentType = Literal["fixed", "index-linked", "renegotiable", "none found"]

class ExtractedField(BaseModel):
    field_name: str
    value: Optional[Union[str, bool, int, float]] = None
    normalized: Optional[Union[str, bool, int, float]] = None
    source_quote: Optional[str] = None
    page: Optional[int] = None
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    status: FieldStatus = "not_found"
    review_reason: Optional[str] = None

class RawLLMExtraction(BaseModel):
    """Raw structured output produced by LLM before code-level grounding check and normalization."""
    payment_terms_value: Optional[str] = None
    payment_terms_quote: Optional[str] = None
    payment_terms_page: Optional[int] = None
    payment_terms_confidence: float = 0.0

    price_adjustment_value: Optional[str] = None
    price_adjustment_quote: Optional[str] = None
    price_adjustment_page: Optional[int] = None
    price_adjustment_confidence: float = 0.0

    contract_term_value: Optional[str] = None
    contract_term_quote: Optional[str] = None
    contract_term_page: Optional[int] = None
    contract_term_confidence: float = 0.0

    auto_renewal_value: Optional[str] = None
    auto_renewal_quote: Optional[str] = None
    auto_renewal_page: Optional[int] = None
    auto_renewal_confidence: float = 0.0

    termination_notice_value: Optional[str] = None
    termination_notice_quote: Optional[str] = None
    termination_notice_page: Optional[int] = None
    termination_notice_confidence: float = 0.0

    liability_cap_value: Optional[str] = None
    liability_cap_quote: Optional[str] = None
    liability_cap_page: Optional[int] = None
    liability_cap_confidence: float = 0.0

    governing_law_value: Optional[str] = None
    governing_law_quote: Optional[str] = None
    governing_law_page: Optional[int] = None
    governing_law_confidence: float = 0.0

    volume_commitment_value: Optional[str] = None
    volume_commitment_quote: Optional[str] = None
    volume_commitment_page: Optional[int] = None
    volume_commitment_confidence: float = 0.0

class NegotiationLever(BaseModel):
    id: str
    field_name: str
    title: str
    current_term: str
    recommendation: str
    rationale: str
    impact: Literal["high", "medium", "low"] = "medium"

class ExtractionSummary(BaseModel):
    verified_count: int = 0
    needs_review_count: int = 0
    not_found_count: int = 0
    total_fields: int = 8
    overall_confidence: float = 0.0
    processing_time_ms: float = 0.0
    estimated_cost_usd: float = 0.0
    tokens_used: int = 0

class PageText(BaseModel):
    page_number: int
    text: str

class ExtractionResult(BaseModel):
    contract_id: str
    filename: str
    num_pages: int
    fields: Dict[str, ExtractedField]
    summary: ExtractionSummary
    negotiation_levers: List[NegotiationLever] = []
    pages: List[PageText] = []
    demo_mode: bool = False

class SampleContractMeta(BaseModel):
    id: str
    name: str
    description: str
    category: str
    filename: str
    num_pages: int
    tags: List[str] = []
    verified_count: int
    needs_review_count: int
    not_found_count: int

class FieldEvalMetric(BaseModel):
    field_name: str
    total_samples: int
    correct_normalized: int
    accuracy: float
    grounding_rate: float
    not_found_precision: float
    not_found_recall: float
    review_rate: float

class FailureCase(BaseModel):
    id: str
    contract_name: str
    field_name: str
    expected: str
    extracted: str
    category: str
    explanation: str
    mitigation: str

class EvaluationReport(BaseModel):
    timestamp: str
    total_contracts: int
    model_used: str = "Deterministic rule-based baseline (offline mode)"
    overall_accuracy: float
    grounding_rate: float
    not_found_precision: float
    not_found_recall: float
    review_rate: float
    avg_latency_ms: float
    avg_cost_usd: float
    per_field_metrics: Dict[str, FieldEvalMetric]
    failure_cases: List[FailureCase]

