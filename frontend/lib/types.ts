export type FieldStatus = 'verified' | 'needs_review' | 'not_found';

export interface ExtractedField {
  field_name: string;
  value: string | boolean | number | null;
  normalized: string | boolean | number | null;
  source_quote: string | null;
  page: number | null;
  confidence: number;
  status: FieldStatus;
  review_reason?: string | null;
}

export interface NegotiationLever {
  id: string;
  field_name: string;
  title: string;
  current_term: string;
  recommendation: string;
  rationale: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ExtractionSummary {
  verified_count: number;
  needs_review_count: number;
  not_found_count: number;
  total_fields: number;
  overall_confidence: number;
  processing_time_ms: number;
  estimated_cost_usd: number;
  tokens_used: number;
}

export interface PageText {
  page_number: number;
  text: string;
}

export interface ExtractionResult {
  contract_id: string;
  filename: string;
  num_pages: number;
  fields: Record<string, ExtractedField>;
  summary: ExtractionSummary;
  negotiation_levers: NegotiationLever[];
  pages: PageText[];
  demo_mode?: boolean;
}

export interface SampleContractMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  filename: string;
  num_pages: number;
  tags: string[];
  verified_count: number;
  needs_review_count: number;
  not_found_count: number;
}

export interface FieldEvalMetric {
  field_name: string;
  total_samples: number;
  correct_normalized: number;
  accuracy: number;
  grounding_rate: number;
  not_found_precision: number;
  review_rate: number;
}

export interface FailureCase {
  id: string;
  contract_name: string;
  field_name: string;
  expected: string;
  extracted: string;
  category: string;
  explanation: string;
  mitigation: string;
}

export interface EvaluationReport {
  timestamp: string;
  total_contracts: number;
  overall_accuracy: number;
  grounding_rate: number;
  not_found_precision: number;
  review_rate: number;
  avg_latency_ms: number;
  avg_cost_usd: number;
  per_field_metrics: Record<string, FieldEvalMetric>;
  failure_cases: FailureCase[];
}
