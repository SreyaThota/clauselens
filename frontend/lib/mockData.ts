import { SampleContractMeta, ExtractionResult, EvaluationReport } from './types';

export const MOCK_EVALUATION_REPORT: EvaluationReport = {
  "timestamp": "2026-11-12T15:07:33.983837+00:00",
  "total_contracts": 12,
  "model_used": "Deterministic rule-based baseline (offline mode, no API key)",
  "overall_accuracy": 100.0,
  "grounding_rate": 98.9,
  "not_found_precision": 100.0,
  "not_found_recall": 100.0,
  "review_rate": 1.0,
  "avg_latency_ms": 2.87,
  "avg_cost_usd": 0.0,
  "per_field_metrics": {
    "payment_terms": {
      "field_name": "payment_terms",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    },
    "price_adjustment": {
      "field_name": "price_adjustment",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    },
    "contract_term": {
      "field_name": "contract_term",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    },
    "auto_renewal": {
      "field_name": "auto_renewal",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    },
    "termination_notice": {
      "field_name": "termination_notice",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    },
    "liability_cap": {
      "field_name": "liability_cap",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 90.9,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 8.3
    },
    "governing_law": {
      "field_name": "governing_law",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    },
    "volume_commitment": {
      "field_name": "volume_commitment",
      "total_samples": 12,
      "correct_normalized": 12,
      "accuracy": 100.0,
      "grounding_rate": 100.0,
      "not_found_precision": 100.0,
      "not_found_recall": 100.0,
      "review_rate": 0.0
    }
  },
  "failure_cases": [
    {
      "id": "FAIL-01",
      "contract_name": "synthetic_06_conflicting_clauses_materials.pdf",
      "field_name": "liability_cap",
      "expected": "uncapped (overriding Section 3.1 $500,000 cap)",
      "extracted": "conflicting clauses ($500k cap vs unlimited breach)",
      "category": "Contradictory Clauses",
      "explanation": "Contract contains two mutually conflicting liability provisions across pages 2 and 3. Section 3.1 stipulates a $500,000 USD cap, while Section 5.1 overrides it with uncapped liability. Because both clauses exist, single-pass normalizers detect the clash and flag the field for human review.",
      "mitigation": "Flagged for human review with confidence 0.62 (< 0.75 threshold). Reviewer approves the binding override."
    },
    {
      "id": "FAIL-02",
      "contract_name": "synthetic_07_annex_hidden_facilities.pdf",
      "field_name": "payment_terms",
      "expected": "45 days (Net 45 calendar days, Annex A Page 4)",
      "extracted": "Net 45 calendar days",
      "category": "Hidden Terms in Annex",
      "explanation": "Key commercial payment terms are completely omitted from the main 3-page agreement and placed in Annex A on Page 4. Models without full-document page chunking risk overlooking exhibit schedules.",
      "mitigation": "Explicit [START PAGE N] chunking tags ensure annex exhibits receive equal attention as the main body."
    },
    {
      "id": "FAIL-03",
      "contract_name": "synthetic_03_german_logistics_freight.pdf",
      "field_name": "governing_law",
      "expected": "Germany",
      "extracted": "Germany",
      "category": "Multilingual Jurisdictions",
      "explanation": "Contract states 'laws of Germany (Bundesrepublik Deutschland)' with line wrapping. Regex and tokenizers frequently fail on multi-line parenthetical annotations unless whitespace is normalized before parsing.",
      "mitigation": "Whitespace is normalized per sentence before pattern matching, stripping language annotations cleanly."
    }
  ]
};

export const MOCK_SAMPLES: SampleContractMeta[] = [
  {
    "id": "synthetic_01_it_services_standard",
    "name": "Master IT Managed Services Agreement",
    "description": "Standard multi-year IT infrastructure and managed services contract with fixed pricing and Delaware governing law.",
    "category": "IT & Software",
    "filename": "synthetic_01_it_services_standard.pdf",
    "num_pages": 3,
    "tags": [
      "standard",
      "IT",
      "fixed-price"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_02_cloud_saas_index_linked",
    "name": "Enterprise Cloud SaaS Subscription Agreement",
    "description": "Cloud software subscription with index-linked price adjustments, 90 days termination notice, and New York governing law.",
    "category": "SaaS",
    "filename": "synthetic_02_cloud_saas_index_linked.pdf",
    "num_pages": 3,
    "tags": [
      "index-linked",
      "SaaS",
      "high-liability"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_03_german_logistics_freight",
    "name": "Cross-Border Logistics Framework Agreement (German-style phrasing)",
    "description": "Logistics agreement featuring German commercial phrasing ('Zahlungsziel 45 Tage', Verbraucherpreisindex, German law).",
    "category": "Logistics",
    "filename": "synthetic_03_german_logistics_freight.pdf",
    "num_pages": 3,
    "tags": [
      "German",
      "multilingual",
      "logistics"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_04_hardware_procurement_volume",
    "name": "Hardware & Component Supply Master Agreement",
    "description": "Multi-page manufacturing and hardware procurement contract with firm fixed pricing and high volume commitment.",
    "category": "Hardware",
    "filename": "synthetic_04_hardware_procurement_volume.pdf",
    "num_pages": 4,
    "tags": [
      "hardware",
      "procurement",
      "volume-heavy"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_05_marketing_agency_missing_cap",
    "name": "Creative Services & Marketing Retainer Agreement (Missing Liability Cap)",
    "description": "Short marketing retainer where the liability cap is completely omitted/silent and prices are renegotiable.",
    "category": "Marketing",
    "filename": "synthetic_05_marketing_agency_missing_cap.pdf",
    "num_pages": 2,
    "tags": [
      "missing-field",
      "silent-cap",
      "renegotiable"
    ],
    "verified_count": 6,
    "needs_review_count": 0,
    "not_found_count": 2
  },
  {
    "id": "synthetic_06_conflicting_clauses_materials",
    "name": "Raw Materials Supply Contract (Conflicting Liability Clauses)",
    "description": "Chemical supply agreement with deliberately conflicting liability clauses between Section 5 and Section 9.",
    "category": "Manufacturing",
    "filename": "synthetic_06_conflicting_clauses_materials.pdf",
    "num_pages": 3,
    "tags": [
      "conflict",
      "conflicting-clauses",
      "needs-review"
    ],
    "verified_count": 7,
    "needs_review_count": 1,
    "not_found_count": 0
  },
  {
    "id": "synthetic_07_annex_hidden_facilities",
    "name": "Integrated Facilities Management Agreement (Terms in Annex)",
    "description": "Facilities maintenance agreement where key commercial payment and commitment terms are located in Annex Schedule A.",
    "category": "Facilities",
    "filename": "synthetic_07_annex_hidden_facilities.pdf",
    "num_pages": 4,
    "tags": [
      "annex",
      "hidden-terms",
      "facilities"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_08_consulting_msa_no_volume",
    "name": "Strategic Consulting Master Services Agreement (No Volume Commitment)",
    "description": "Consulting engagement without volume commitment, capped at trailing 12 months fees, Massachusetts law.",
    "category": "Consulting",
    "filename": "synthetic_08_consulting_msa_no_volume.pdf",
    "num_pages": 3,
    "tags": [
      "consulting",
      "no-volume",
      "fees-paid-cap"
    ],
    "verified_count": 7,
    "needs_review_count": 0,
    "not_found_count": 1
  },
  {
    "id": "synthetic_09_telecom_bandwidth_sla",
    "name": "Enterprise Dedicated Bandwidth & Fiber Agreement",
    "description": "Telecom transport agreement with index-linked adjustments, 90 days termination notice, Washington law.",
    "category": "Telecom",
    "filename": "synthetic_09_telecom_bandwidth_sla.pdf",
    "num_pages": 3,
    "tags": [
      "telecom",
      "index-linked",
      "SLA"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_10_software_license_uncapped",
    "name": "Core Banking Software License (Uncapped Liability)",
    "description": "Enterprise software license with an explicit uncapped liability clause and 120 days termination notice.",
    "category": "Banking Software",
    "filename": "synthetic_10_software_license_uncapped.pdf",
    "num_pages": 4,
    "tags": [
      "software",
      "uncapped",
      "banking"
    ],
    "verified_count": 7,
    "needs_review_count": 0,
    "not_found_count": 1
  },
  {
    "id": "synthetic_11_catering_hospitality_short_term",
    "name": "Corporate Catering & Food Services (Short Term, Net 14)",
    "description": "Short-term food services contract with Net 14 payment terms, Colorado governing law, and 15 days termination notice.",
    "category": "Hospitality",
    "filename": "synthetic_11_catering_hospitality_short_term.pdf",
    "num_pages": 2,
    "tags": [
      "short-term",
      "catering",
      "net-14"
    ],
    "verified_count": 8,
    "needs_review_count": 0,
    "not_found_count": 0
  },
  {
    "id": "synthetic_12_security_services_missing_adjustment",
    "name": "On-Site Physical Security Services (Missing Price Adjustment Clause)",
    "description": "Security guarding agreement that is silent on price adjustment, with Georgia governing law and 45 days termination notice.",
    "category": "Security",
    "filename": "synthetic_12_security_services_missing_adjustment.pdf",
    "num_pages": 3,
    "tags": [
      "security",
      "silent-adjustment",
      "services"
    ],
    "verified_count": 7,
    "needs_review_count": 0,
    "not_found_count": 1
  }
];

export const MOCK_RESULTS: Record<string, ExtractionResult> = {
  "synthetic_01_it_services_standard": {
    "contract_id": "synthetic_01_it_services_standard",
    "filename": "synthetic_01_it_services_standard.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 30 days",
        "normalized": 30,
        "source_quote": "Customer shall satisfy all undisputed invoices under payment terms of Net 30 days from\nthe invoice date.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "firm and fixed",
        "normalized": "fixed",
        "source_quote": "The recurring subscription fees are firm and fixed for the initial term of thirty-six (36)\nmonths with no adjustment.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 36 months",
        "normalized": "36 months",
        "source_quote": "The initial term of this Agreement shall be 36 months, commencing on February 1, 2024 and\nending on January 31, 2027.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "This Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal.",
        "normalized": "true (12 months)",
        "source_quote": "This Agreement shall automatically renew for successive 12-month periods unless either\nparty provides written notice of non-renewal.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 60 days",
        "normalized": 60,
        "source_quote": "Either party may terminate this Agreement without cause upon providing\nwritten notice of at least 60 days.",
        "page": 2,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$1,000,000 USD",
        "normalized": "1,000,000 USD",
        "source_quote": "Except for gross negligence or willful misconduct, each party's aggregate liability shall not\nexceed $1,000,000 USD under this Agreement.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Delaware",
        "normalized": "Delaware",
        "source_quote": "This Agreement shall be governed by and construed in accordance with the laws of the\nState of Delaware, without regard to conflict of laws principles.",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "100 enterprise server nodes",
        "normalized": "100 enterprise server nodes",
        "source_quote": "Customer guarantees a minimum annual volume commitment of 100 enterprise\nserver nodes throughout each contract year.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 8.22,
      "estimated_cost_usd": 0.0,
      "tokens_used": 422
    },
    "negotiation_levers": [
      {
        "id": "lever-payment-terms",
        "field_name": "payment_terms",
        "title": "Optimize Working Capital (Payment Terms)",
        "current_term": "Net 30 days",
        "recommendation": "Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
        "rationale": "Current term is Net 30. Extending to Net 60 preserves cash flow and aligns with standard enterprise procurement benchmarks without disrupting supplier operations.",
        "impact": "high"
      },
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 60",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_01_IT_SERVICES_STANDARD - PAGE 1 OF 3\nMASTER IT MANAGED SERVICES AGREEMENT\nCONFIDENTIAL & SYNTHETIC - CLAUSELENS BENCHMARK DATASET\nThis Master Services Agreement ('Agreement') is entered into as of January 15, 2024, by and between Apex\nCloud Infrastructure LLC ('Supplier') and Nexus Enterprise Systems Inc. ('Customer').\nSECTION 1: APPOINTMENT AND SCOPE OF SERVICES\n1.1 Services. Supplier shall provide Customer with enterprise cloud management, NOC monitoring, and server\ninfrastructure support as described in Schedule A.\n1.2 Standard of Performance. All Services shall be rendered in a professional, workmanlike manner meeting\n99.95% monthly uptime service levels.\nSECTION 2: TERM AND COMMENCEMENT\n2.1 Contract Term. The initial term of this Agreement shall be 36 months, commencing on February 1, 2024 and\nending on January 31, 2027.\n2.2 Auto-Renewal. This Agreement shall automatically renew for successive 12-month periods unless either\nparty provides written notice of non-renewal.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_01_IT_SERVICES_STANDARD - PAGE 2 OF 3\nSECTION 3: FEES, INVOICING, AND PAYMENT\n3.1 Invoices. Supplier shall invoice Customer monthly in advance for standard recurring infrastructure fees.\n3.2 Payment Terms. Customer shall satisfy all undisputed invoices under payment terms of Net 30 days from\nthe invoice date.\n3.3 Price Adjustment. The recurring subscription fees are firm and fixed for the initial term of thirty-six (36)\nmonths with no adjustment.\nSECTION 4: TERMINATION AND NOTICE\n4.1 Termination for Convenience. Either party may terminate this Agreement without cause upon providing\nwritten notice of at least 60 days.\n4.2 Termination for Cause. Either party may terminate immediately upon material breach if such breach\nremains uncured for 30 calendar days.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_01_IT_SERVICES_STANDARD - PAGE 3 OF 3\nSECTION 5: COMMITMENT AND LIABILITIES\n5.1 Volume Commitment. Customer guarantees a minimum annual volume commitment of 100 enterprise\nserver nodes throughout each contract year.\n5.2 Liability Cap. Except for gross negligence or willful misconduct, each party's aggregate liability shall not\nexceed $1,000,000 USD under this Agreement.\nSECTION 6: GOVERNING LAW AND DISPUTE RESOLUTION\n6.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the\nState of Delaware, without regard to conflict of laws principles.\n6.2 Jurisdiction. The parties submit to the exclusive jurisdiction of the state and federal courts located in New\nCastle County, Delaware.\nIN WITNESS WHEREOF, the authorized representatives have executed this Agreement.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_02_cloud_saas_index_linked": {
    "contract_id": "synthetic_02_cloud_saas_index_linked",
    "filename": "synthetic_02_cloud_saas_index_linked.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "within sixty (60) days",
        "normalized": 60,
        "source_quote": "Invoices shall be paid within sixty (60) days of receipt by Subscriber's accounts payable\ndepartment.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "index-linked",
        "normalized": "index-linked",
        "source_quote": "After the first year, annual subscription charges are subject to an index-linked adjustment\npegged to the Consumer Price Index (CPI), capped at 5% annually.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of 24 months",
        "normalized": "24 months",
        "source_quote": "This subscription has an initial term of 24 months commencing on March 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The subscription shall automatically renew for consecutive 12-month periods unless terminated in accordance with Section 4.",
        "normalized": "true (12 months)",
        "source_quote": "The subscription shall automatically renew for consecutive 12-month periods unless\nterminated in accordance with Section 4.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "upon ninety (90) days prior written notice",
        "normalized": 90,
        "source_quote": "Either party may elect non-renewal or termination upon ninety (90) days prior\nwritten notice before the expiration of the current term.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$2,500,000 USD",
        "normalized": "2,500,000 USD",
        "source_quote": "The total aggregate liability of either party for all claims arising out of this Agreement shall not\nexceed $2,500,000 USD.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "New York",
        "normalized": "New York",
        "source_quote": "This Agreement is governed by the laws of the State of New York, excluding its conflicts of\nlaw rules.",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "$120,000 USD per contract year across all operational subsidiaries",
        "normalized": "$120,000 USD per contract year",
        "source_quote": "Subscriber agrees to maintain a minimum spend of $120,000 USD per contract year\nacross all operational subsidiaries.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.79,
      "estimated_cost_usd": 0.0,
      "tokens_used": 324
    },
    "negotiation_levers": [
      {
        "id": "lever-price-adjustment",
        "field_name": "price_adjustment",
        "title": "Cap Index-Linked Price Escalations",
        "current_term": "Index-linked price adjustment",
        "recommendation": "Add an annual collar/cap (e.g., lower of CPI or 3.0% maximum per annum).",
        "rationale": "Uncapped index-linked adjustments expose the organisation to runaway inflationary budget creep. A defined annual ceiling establishes budgetary predictability.",
        "impact": "high"
      },
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 90",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_02_CLOUD_SAAS_INDEX_LINKED - PAGE 1 OF 3\nENTERPRISE CLOUD SAAS SUBSCRIPTION\nAGREEMENT\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nThis Enterprise Software-as-a-Service Agreement is entered into by Stratos Platform Corp. ('Vendor') and\nMeridian Global Financial ('Subscriber').\nARTICLE 1: SUBSCRIPTION GRANT\n1.1 License. Vendor grants Subscriber a non-exclusive subscription to access the hosted multi-tenant analytics\nplatform.\n1.2 Term. This subscription has an initial term of 24 months commencing on March 1, 2024.\n1.3 Auto-Renewal. The subscription shall automatically renew for consecutive 12-month periods unless\nterminated in accordance with Section 4.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_02_CLOUD_SAAS_INDEX_LINKED - PAGE 2 OF 3\nARTICLE 2: COMMODITY PRICING AND PAYMENT\n2.1 Billing. Subscriber shall pay subscription fees annually in advance.\n2.2 Payment Terms. Invoices shall be paid within sixty (60) days of receipt by Subscriber's accounts payable\ndepartment.\n2.3 Price Adjustment. After the first year, annual subscription charges are subject to an index-linked adjustment\npegged to the Consumer Price Index (CPI), capped at 5% annually.\nARTICLE 3: COMMERCIAL COMMITMENTS\n3.1 Volume Commitment. Subscriber agrees to maintain a minimum spend of $120,000 USD per contract year\nacross all operational subsidiaries.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_02_CLOUD_SAAS_INDEX_LINKED - PAGE 3 OF 3\nARTICLE 4: TERMINATION PROCEDURE\n4.1 Termination for Convenience. Either party may elect non-renewal or termination upon ninety (90) days prior\nwritten notice before the expiration of the current term.\nARTICLE 5: LIABILITY RESTRICTIONS AND GOVERNANCE\n5.1 Liability Cap. The total aggregate liability of either party for all claims arising out of this Agreement shall not\nexceed $2,500,000 USD.\n5.2 Governing Law. This Agreement is governed by the laws of the State of New York, excluding its conflicts of\nlaw rules.\nThe parties have executed this Agreement on the date first written above.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_03_german_logistics_freight": {
    "contract_id": "synthetic_03_german_logistics_freight",
    "filename": "synthetic_03_german_logistics_freight.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Zahlungsziel 45 Tage",
        "normalized": 45,
        "source_quote": "Rechnungen unterliegen einem Zahlungsziel 45 Tage nach Rechnungseingang without\ndeduction.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "index-linked",
        "normalized": "index-linked",
        "source_quote": "Die Frachttarife sind index-linked and adjusted annually based on the German\nVerbraucherpreisindex inflation metric.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of 36 months",
        "normalized": "36 months",
        "source_quote": "Der Vertrag hat eine initial term of 36 months effective from April 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The contract shall not automatically renew and terminates automatically upon term expiry.",
        "normalized": "false",
        "source_quote": "The contract shall not automatically renew and terminates automatically upon term expiry.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 30 days",
        "normalized": 30,
        "source_quote": "Ordentliche K\u00fcndigung is permitted upon written notice of at least 30 days.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "500,000 EUR",
        "normalized": "500,000 EUR",
        "source_quote": "The total aggregate liability shall not exceed 500,000 EUR under all freight orders.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Germany",
        "normalized": "Germany",
        "source_quote": "This contract is governed by and construed under the laws of Germany (Bundesrepublik\nDeutschland).",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "5,000 standard freight pallets per calendar year",
        "normalized": "5,000 standard freight pallets per calendar year",
        "source_quote": "Der Auftraggeber commits to purchase at least 5,000 standard freight pallets per\ncalendar year.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.35,
      "estimated_cost_usd": 0.0,
      "tokens_used": 247
    },
    "negotiation_levers": [
      {
        "id": "lever-price-adjustment",
        "field_name": "price_adjustment",
        "title": "Cap Index-Linked Price Escalations",
        "current_term": "Index-linked price adjustment",
        "recommendation": "Add an annual collar/cap (e.g., lower of CPI or 3.0% maximum per annum).",
        "rationale": "Uncapped index-linked adjustments expose the organisation to runaway inflationary budget creep. A defined annual ceiling establishes budgetary predictability.",
        "impact": "high"
      },
      {
        "id": "lever-governing-law",
        "field_name": "governing_law",
        "title": "Jurisdiction Harmonization",
        "current_term": "Germany",
        "recommendation": "Harmonize governing law to buyer's standard operating jurisdiction.",
        "rationale": "Foreign or distant jurisdictions dramatically increase dispute resolution expenses and require local counsel retention.",
        "impact": "low"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_03_GERMAN_LOGISTICS_FREIGHT - PAGE 1 OF 3\nCROSS-BORDER FREIGHT & LOGISTICS FRAMEWORK\nAGREEMENT\nSYNTHETISCHER MUSTERVERTRAG - CLAUSELENS BENCHMARK\nBetween Rhein-Spedition Logistik GmbH ('Spediteur') and EuroTrade Distribution BV ('Auftraggeber').\nPARAGRAPH 1: LEISTUNGSUMFANG (SCOPE OF FREIGHT SERVICES)\n1.1 Freight Services. The Spediteur will provide pan-European road freight and cold-chain cargo forwarding.\n1.2 Contract Term. Der Vertrag hat eine initial term of 36 months effective from April 1, 2024.\n1.3 Auto-Renewal. The contract shall not automatically renew and terminates automatically upon term expiry.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_03_GERMAN_LOGISTICS_FREIGHT - PAGE 2 OF 3\nPARAGRAPH 2: ZAHLUNGSBEDINGUNGEN UND PREISANPASSUNG\n2.1 Payment Terms. Rechnungen unterliegen einem Zahlungsziel 45 Tage nach Rechnungseingang without\ndeduction.\n2.2 Price Adjustment. Die Frachttarife sind index-linked and adjusted annually based on the German\nVerbraucherpreisindex inflation metric.\n2.3 Volume Commitment. Der Auftraggeber commits to purchase at least 5,000 standard freight pallets per\ncalendar year.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_03_GERMAN_LOGISTICS_FREIGHT - PAGE 3 OF 3\nPARAGRAPH 3: K\u00dcNDIGUNG UND HAFTUNG (TERMINATION & LIABILITY)\n3.1 Termination Notice. Ordentliche K\u00fcndigung is permitted upon written notice of at least 30 days.\n3.2 Liability Cap. The total aggregate liability shall not exceed 500,000 EUR under all freight orders.\n3.3 Governing Law. This contract is governed by and construed under the laws of Germany (Bundesrepublik\nDeutschland).\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_04_hardware_procurement_volume": {
    "contract_id": "synthetic_04_hardware_procurement_volume",
    "filename": "synthetic_04_hardware_procurement_volume.pdf",
    "num_pages": 4,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 45 calendar days",
        "normalized": 45,
        "source_quote": "Payment shall be due under payment terms of Net 45 calendar days after receipt of goods.",
        "page": 3,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "firm and fixed",
        "normalized": "fixed",
        "source_quote": "Unit prices are firm and fixed for the entire 48-month duration with no price increases.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 48 months",
        "normalized": "48 months",
        "source_quote": "The initial term of this Agreement shall be 48 months from the Effective Date.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "This Agreement shall not automatically renew upon expiration of the initial term.",
        "normalized": "false",
        "source_quote": "This Agreement shall not automatically renew upon expiration of the initial term.",
        "page": 3,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 60 days",
        "normalized": 60,
        "source_quote": "Either party may terminate for convenience upon written notice of at least 60 days.",
        "page": 4,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$5,000,000 USD",
        "normalized": "5,000,000 USD",
        "source_quote": "Each party's total aggregate liability under this agreement shall not exceed $5,000,000 USD.",
        "page": 4,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "California",
        "normalized": "California",
        "source_quote": "This Agreement shall be governed by the laws of the State of California, without regard to\nconflicts principles.",
        "page": 4,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "10,000 accelerator units per calendar year",
        "normalized": "10,000 accelerator units per calendar year",
        "source_quote": "Buyer guarantees a minimum volume commitment of 10,000 accelerator units per\ncalendar year.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.71,
      "estimated_cost_usd": 0.0,
      "tokens_used": 309
    },
    "negotiation_levers": [
      {
        "id": "lever-governing-law",
        "field_name": "governing_law",
        "title": "Jurisdiction Harmonization",
        "current_term": "California",
        "recommendation": "Harmonize governing law to buyer's standard operating jurisdiction.",
        "rationale": "Foreign or distant jurisdictions dramatically increase dispute resolution expenses and require local counsel retention.",
        "impact": "low"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_04_HARDWARE_PROCUREMENT_VOLUME - PAGE 1 OF 4\nMASTER HARDWARE PROCUREMENT & COMPONENT\nSUPPLY AGREEMENT\nCONFIDENTIAL SYNTHETIC BENCHMARK SPECIFICATION\nEntered into by MicroSilicon Components Inc. ('Supplier') and Quantum Computing Devices Corp. ('Buyer').\nSECTION 1: SUPPLY SPECIFICATIONS\n1.1 Products. Supplier will manufacture custom ASIC accelerator boards according to Buyer specifications.\n1.2 Contract Term. The initial term of this Agreement shall be 48 months from the Effective Date.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_04_HARDWARE_PROCUREMENT_VOLUME - PAGE 2 OF 4\nSECTION 2: DELIVERY AND VOLUME QUOTA\n2.1 Volume Commitment. Buyer guarantees a minimum volume commitment of 10,000 accelerator units per\ncalendar year.\n2.2 Shortfall Penalty. Buyer agrees to pay an idle production fee of $45 per unit shortfall.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_04_HARDWARE_PROCUREMENT_VOLUME - PAGE 3 OF 4\nSECTION 3: PRICING AND PAYMENTS\n3.1 Invoicing. Supplier will invoice upon successful Bill of Lading generation.\n3.2 Payment Terms. Payment shall be due under payment terms of Net 45 calendar days after receipt of goods.\n3.3 Price Adjustment. Unit prices are firm and fixed for the entire 48-month duration with no price increases.\n3.4 Auto-Renewal. This Agreement shall not automatically renew upon expiration of the initial term.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      },
      {
        "page_number": 4,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_04_HARDWARE_PROCUREMENT_VOLUME - PAGE 4 OF 4\nSECTION 4: REMEDIES AND GOVERNANCE\n4.1 Termination. Either party may terminate for convenience upon written notice of at least 60 days.\n4.2 Liability Cap. Each party's total aggregate liability under this agreement shall not exceed $5,000,000 USD.\n4.3 Governing Law. This Agreement shall be governed by the laws of the State of California, without regard to\nconflicts principles.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 4\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_05_marketing_agency_missing_cap": {
    "contract_id": "synthetic_05_marketing_agency_missing_cap",
    "filename": "synthetic_05_marketing_agency_missing_cap.pdf",
    "num_pages": 2,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 30 days",
        "normalized": 30,
        "source_quote": "Client will pay all invoices under payment terms of Net 30 days from date of presentation.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "renegotiated annually",
        "normalized": "renegotiable",
        "source_quote": "Retainer pricing is renegotiated annually by mutual agreement prior to renewal.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "duration of this agreement is an initial term of 12 months",
        "normalized": "12 months",
        "source_quote": "The duration of this agreement is an initial term of 12 months starting June 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "This Agreement will automatically renew for successive 12-month periods unless canceled.",
        "normalized": "true (12 months)",
        "source_quote": "This Agreement will automatically renew for successive 12-month periods unless canceled.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 30 days",
        "normalized": 30,
        "source_quote": "Either party may cancel the retainer upon written notice of at least 30 days.",
        "page": 2,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": null,
        "normalized": "none found",
        "source_quote": null,
        "page": null,
        "confidence": 0.0,
        "status": "not_found",
        "review_reason": "Term not present in the contract clauses."
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "England and Wales",
        "normalized": "England and Wales",
        "source_quote": "This agreement is governed by the laws of England and Wales.",
        "page": 2,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": null,
        "normalized": "none found",
        "source_quote": null,
        "page": null,
        "confidence": 0.0,
        "status": "not_found",
        "review_reason": "Term not present in the contract clauses."
      }
    },
    "summary": {
      "verified_count": 6,
      "needs_review_count": 0,
      "not_found_count": 2,
      "total_fields": 8,
      "overall_confidence": 0.94,
      "processing_time_ms": 2.21,
      "estimated_cost_usd": 0.0,
      "tokens_used": 242
    },
    "negotiation_levers": [
      {
        "id": "lever-payment-terms",
        "field_name": "payment_terms",
        "title": "Optimize Working Capital (Payment Terms)",
        "current_term": "Net 30 days",
        "recommendation": "Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
        "rationale": "Current term is Net 30. Extending to Net 60 preserves cash flow and aligns with standard enterprise procurement benchmarks without disrupting supplier operations.",
        "impact": "high"
      },
      {
        "id": "lever-price-adjustment",
        "field_name": "price_adjustment",
        "title": "Formalize Renegotiation Triggers",
        "current_term": "Subject to renegotiation / mutual agreement",
        "recommendation": "Include minimum 90-day advance notice for price revisions and termination rights if agreement is not reached.",
        "rationale": "Vague renegotiation clauses create hold-up problems where the vendor requests an increase close to renewal when switching costs are highest.",
        "impact": "medium"
      },
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 30",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_05_MARKETING_AGENCY_MISSING_CAP - PAGE 1 OF 2\nGLOBAL MARKETING & CREATIVE SERVICES\nRETAINER\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nThis Agreement is made between Horizon Media UK Ltd ('Agency') and Vertex Global Retail ('Client').\nCLAUSE 1: ENGAGEMENT & SCOPE\n1.1 Retainer. Agency will deliver ongoing digital branding, omnichannel advertising campaigns, and creative\nassets.\n1.2 Term. The duration of this agreement is an initial term of 12 months starting June 1, 2024.\n1.3 Auto-Renewal. This Agreement will automatically renew for successive 12-month periods unless canceled.\n1.4 Volume. Client has not made any volume commitment or guaranteed project minimums under this retainer.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_05_MARKETING_AGENCY_MISSING_CAP - PAGE 2 OF 2\nCLAUSE 2: FINANCIAL PROVISIONS AND CANCELLATION\n2.1 Invoicing. Retainer invoices are submitted on the first day of each calendar month.\n2.2 Payment Terms. Client will pay all invoices under payment terms of Net 30 days from date of presentation.\n2.3 Price Adjustment. Retainer pricing is renegotiated annually by mutual agreement prior to renewal.\n2.4 Termination. Either party may cancel the retainer upon written notice of at least 30 days.\nCLAUSE 3: LEGAL TERMS\n3.1 Governing Law. This agreement is governed by the laws of England and Wales.\n3.2 Liability. [NOTE: Contract is silent regarding liability limitation; no liability cap clause is included in this\nagreement.]\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_06_conflicting_clauses_materials": {
    "contract_id": "synthetic_06_conflicting_clauses_materials",
    "filename": "synthetic_06_conflicting_clauses_materials.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 60 days",
        "normalized": 60,
        "source_quote": "Payment shall be completed under Net 60 days from bill of lading issuance.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "subject to renegotiation",
        "normalized": "renegotiable",
        "source_quote": "Commodity raw material prices are subject to renegotiation every six months based on\nfeedstocks.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "contract duration of 36 months",
        "normalized": "36 months",
        "source_quote": "The contract duration of 36 months begins May 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The contract shall not automatically renew and terminates upon expiration.",
        "normalized": "false",
        "source_quote": "The contract shall not automatically renew and terminates upon expiration.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 90 days",
        "normalized": 90,
        "source_quote": "Either party may cancel with written notice of at least 90 days.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "conflicting clauses ($500k cap vs unlimited breach)",
        "normalized": "uncapped",
        "source_quote": "Notwithstanding any provision to the contrary in Section 3.1, Seller liability is\nunlimited and uncapped liability applies for breach of delivery or product recalls.",
        "page": 3,
        "confidence": 0.62,
        "status": "needs_review",
        "review_reason": "Low model confidence (0.62 < 0.75 threshold)."
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Texas",
        "normalized": "Texas",
        "source_quote": "This agreement is governed by the laws of the State of Texas.",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "250 metric tons of material per calendar month",
        "normalized": "250 metric tons of material per calendar month",
        "source_quote": "Purchaser commits to purchase at least 250 metric tons of material per calendar\nmonth.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 7,
      "needs_review_count": 1,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.89,
      "processing_time_ms": 2.41,
      "estimated_cost_usd": 0.0,
      "tokens_used": 276
    },
    "negotiation_levers": [
      {
        "id": "lever-price-adjustment",
        "field_name": "price_adjustment",
        "title": "Formalize Renegotiation Triggers",
        "current_term": "Subject to renegotiation / mutual agreement",
        "recommendation": "Include minimum 90-day advance notice for price revisions and termination rights if agreement is not reached.",
        "rationale": "Vague renegotiation clauses create hold-up problems where the vendor requests an increase close to renewal when switching costs are highest.",
        "impact": "medium"
      },
      {
        "id": "lever-liability-cap",
        "field_name": "liability_cap",
        "title": "Institute Aggregate Liability Ceiling",
        "current_term": "conflicting clauses ($500k cap vs unlimited breach)",
        "recommendation": "Cap aggregate vendor and buyer liability at 12 months' trailing fees paid or fixed $1M ceiling.",
        "rationale": "Uncapped liability or ambiguous limits represent an unquantified balance sheet risk during audits and vendor security incidents.",
        "impact": "high"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_06_CONFLICTING_CLAUSES_MATERIALS - PAGE 1 OF 3\nRAW MATERIALS & INDUSTRIAL CHEMICALS MASTER\nSUPPLY\nSYNTHETIC BENCHMARK - CONFLICTING CLAUSE TEST CASE\nBetween PetroChem Solvents LLC ('Seller') and Polymer Fabrication Corp ('Purchaser').\nARTICLE 1: SUPPLY SCOPE & DURATION\n1.1 Products. Seller agrees to supply industrial grade toluene and ethanol derivatives.\n1.2 Term. The contract duration of 36 months begins May 1, 2024.\n1.3 Non-Renewal. The contract shall not automatically renew and terminates upon expiration.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_06_CONFLICTING_CLAUSES_MATERIALS - PAGE 2 OF 3\nARTICLE 2: COMMERCIAL PURCHASE OBLIGATIONS\n2.1 Volume Commitment. Purchaser commits to purchase at least 250 metric tons of material per calendar\nmonth.\n2.2 Payment Terms. Payment shall be completed under Net 60 days from bill of lading issuance.\n2.3 Price Adjustment. Commodity raw material prices are subject to renegotiation every six months based on\nfeedstocks.\nARTICLE 3: STANDARD LIABILITY CEILING\n3.1 Standard Liability. Seller aggregate liability shall not exceed $500,000 USD for any product defect claims.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_06_CONFLICTING_CLAUSES_MATERIALS - PAGE 3 OF 3\nARTICLE 4: TERMINATION PROCEDURE\n4.1 Termination. Either party may cancel with written notice of at least 90 days.\nARTICLE 5: SPECIAL INDEMNITY & GOVERNING JURISDICTION\n5.1 Conflicting Liability Term. Notwithstanding any provision to the contrary in Section 3.1, Seller liability is\nunlimited and uncapped liability applies for breach of delivery or product recalls.\n5.2 Governing Law. This agreement is governed by the laws of the State of Texas.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_07_annex_hidden_facilities": {
    "contract_id": "synthetic_07_annex_hidden_facilities",
    "filename": "synthetic_07_annex_hidden_facilities.pdf",
    "num_pages": 4,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 45 calendar days",
        "normalized": 45,
        "source_quote": "All maintenance fees are subject to payment terms of Net 45 calendar days after\ninvoice approval.",
        "page": 4,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "firm and fixed",
        "normalized": "fixed",
        "source_quote": "Facility hourly labor rates are firm and fixed for the entire 3-year term.",
        "page": 4,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 36 months",
        "normalized": "36 months",
        "source_quote": "The initial term of this Agreement shall be 36 months from execution date.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The contract will automatically renew for successive 12-month periods.",
        "normalized": "true (12 months)",
        "source_quote": "The contract will automatically renew for successive 12-month periods.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 60 days",
        "normalized": 60,
        "source_quote": "Either party may terminate with written notice of at least 60 days.",
        "page": 2,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$750,000 USD",
        "normalized": "750,000 USD",
        "source_quote": "Total liability under this agreement shall not exceed $750,000 USD.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Illinois",
        "normalized": "Illinois",
        "source_quote": "This agreement is governed by the laws of the State of Illinois.",
        "page": 2,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "$350,000 USD per contract year",
        "normalized": "$350,000 USD per contract year",
        "source_quote": "Owner commits to a minimum spend of $350,000 USD per contract year for\ncorporate campus maintenance.",
        "page": 4,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.86,
      "estimated_cost_usd": 0.0,
      "tokens_used": 324
    },
    "negotiation_levers": [
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 60",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      },
      {
        "id": "lever-governing-law",
        "field_name": "governing_law",
        "title": "Jurisdiction Harmonization",
        "current_term": "Illinois",
        "recommendation": "Harmonize governing law to buyer's standard operating jurisdiction.",
        "rationale": "Foreign or distant jurisdictions dramatically increase dispute resolution expenses and require local counsel retention.",
        "impact": "low"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_07_ANNEX_HIDDEN_FACILITIES - PAGE 1 OF 4\nINTEGRATED FACILITIES MANAGEMENT MASTER\nSERVICES\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nEntered into by Vanguard Facility Services LLC ('Supplier') and Omnicorp Global ('Owner').\nSECTION 1: CORE OPERATIONAL OBLIGATIONS\n1.1 Scope. Supplier provides building janitorial, HVAC preventative maintenance, and physical security.\n1.2 Contract Term. The initial term of this Agreement shall be 36 months from execution date.\n1.3 Auto-Renewal. The contract will automatically renew for successive 12-month periods.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_07_ANNEX_HIDDEN_FACILITIES - PAGE 2 OF 4\nSECTION 2: TERMINATION AND GENERAL PROVISIONS\n2.1 Termination. Either party may terminate with written notice of at least 60 days.\n2.2 Governing Law. This agreement is governed by the laws of the State of Illinois.\n2.3 Liability Cap. Total liability under this agreement shall not exceed $750,000 USD.\n2.4 Annex Precedence. Specific financial terms and operational commitments are set forth in Annex A.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_07_ANNEX_HIDDEN_FACILITIES - PAGE 3 OF 4\nSECTION 3: SERVICE LEVEL EXPECTATIONS\n3.1 Response Time. Emergency HVAC repair calls must be answered within 2 hours.\n3.2 Escalation Matrix. Tier 1 and Tier 2 management notification procedures.\n3.3 Environmental Compliance. Compliance with state emissions regulations.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      },
      {
        "page_number": 4,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_07_ANNEX_HIDDEN_FACILITIES - PAGE 4 OF 4\nANNEX A: FINANCIAL SCHEDULE & COMMERCIAL\nMATTERS\nSCHEDULE A.1 - PAYMENT AND SPEND COMMITMENTS\nA.1 Invoicing and Terms. All maintenance fees are subject to payment terms of Net 45 calendar days after\ninvoice approval.\nA.2 Price Adjustment. Facility hourly labor rates are firm and fixed for the entire 3-year term.\nA.3 Volume Commitment. Owner commits to a minimum spend of $350,000 USD per contract year for\ncorporate campus maintenance.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 4\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_08_consulting_msa_no_volume": {
    "contract_id": "synthetic_08_consulting_msa_no_volume",
    "filename": "synthetic_08_consulting_msa_no_volume.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "within thirty (30) days",
        "normalized": 30,
        "source_quote": "Invoices shall be paid within thirty (30) days from the invoice issuance date.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "firm and fixed",
        "normalized": "fixed",
        "source_quote": "Professional fees are firm and fixed for the 24 months initial term.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "duration of this agreement is 24 months",
        "normalized": "24 months",
        "source_quote": "The duration of this agreement is 24 months commencing July 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "1.3 Non-Renewing.",
        "normalized": "false",
        "source_quote": "1.3 Non-Renewing.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 30 days",
        "normalized": 30,
        "source_quote": "Either party may terminate this agreement upon written notice of at least 30 days.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "fees paid in the preceding twelve months",
        "normalized": "fees paid in the preceding twelve months",
        "source_quote": "Aggregate liability arising from any SOW shall not exceed fees paid in the preceding twelve\nmonths.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Massachusetts",
        "normalized": "Massachusetts",
        "source_quote": "This Agreement shall be governed by the laws of the Commonwealth of Massachusetts.",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": null,
        "normalized": "none found",
        "source_quote": null,
        "page": null,
        "confidence": 0.0,
        "status": "not_found",
        "review_reason": "Term not present in the contract clauses."
      }
    },
    "summary": {
      "verified_count": 7,
      "needs_review_count": 0,
      "not_found_count": 1,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.28,
      "estimated_cost_usd": 0.0,
      "tokens_used": 261
    },
    "negotiation_levers": [
      {
        "id": "lever-payment-terms",
        "field_name": "payment_terms",
        "title": "Optimize Working Capital (Payment Terms)",
        "current_term": "Net 30 days",
        "recommendation": "Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
        "rationale": "Current term is Net 30. Extending to Net 60 preserves cash flow and aligns with standard enterprise procurement benchmarks without disrupting supplier operations.",
        "impact": "high"
      },
      {
        "id": "lever-governing-law",
        "field_name": "governing_law",
        "title": "Jurisdiction Harmonization",
        "current_term": "Massachusetts",
        "recommendation": "Harmonize governing law to buyer's standard operating jurisdiction.",
        "rationale": "Foreign or distant jurisdictions dramatically increase dispute resolution expenses and require local counsel retention.",
        "impact": "low"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_08_CONSULTING_MSA_NO_VOLUME - PAGE 1 OF 3\nMASTER SERVICES AGREEMENT FOR STRATEGIC\nCONSULTING\nSYNTHETIC BENCHMARK SPECIFICATION - CLAUSELENS\nBy and between Beacon Advisory Partners LLC ('Consultant') and Highland BioMed Corp ('Client').\nARTICLE 1: SERVICES & WORK ORDERS\n1.1 Statements of Work. Consultant shall perform management consulting services pursuant to executed\nSOWs.\n1.2 Term. The duration of this agreement is 24 months commencing July 1, 2024.\n1.3 Non-Renewing. This Agreement shall not automatically renew and expires automatically at the end of the\nterm.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_08_CONSULTING_MSA_NO_VOLUME - PAGE 2 OF 3\nARTICLE 2: COMPENSATION & INVOICES\n2.1 Rates. Professional hourly rates are set forth in Exhibit 1.\n2.2 Payment Terms. Invoices shall be paid within thirty (30) days from the invoice issuance date.\n2.3 Price Adjustment. Professional fees are firm and fixed for the 24 months initial term.\n2.4 No Minimum Commitment. Client makes no volume commitment or promise of work volume under this\nAgreement.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_08_CONSULTING_MSA_NO_VOLUME - PAGE 3 OF 3\nARTICLE 3: TERMINATION AND LIABILITY\n3.1 Termination. Either party may terminate this agreement upon written notice of at least 30 days.\n3.2 Liability Cap. Aggregate liability arising from any SOW shall not exceed fees paid in the preceding twelve\nmonths.\n3.3 Governing Law. This Agreement shall be governed by the laws of the Commonwealth of Massachusetts.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_09_telecom_bandwidth_sla": {
    "contract_id": "synthetic_09_telecom_bandwidth_sla",
    "filename": "synthetic_09_telecom_bandwidth_sla.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 30 days",
        "normalized": 30,
        "source_quote": "Customer will remit payment under Net 30 days terms from invoice dispatch.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "index-linked",
        "normalized": "index-linked",
        "source_quote": "After the first 12 months, circuit MRC rates are index-linked to the Producer Price Index\n(PPI).",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 36 months",
        "normalized": "36 months",
        "source_quote": "The initial term of this Agreement shall be 36 months starting August 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The contract will automatically renew for consecutive 12-month periods.",
        "normalized": "true (12 months)",
        "source_quote": "The contract will automatically renew for consecutive 12-month periods.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 90 days",
        "normalized": 90,
        "source_quote": "Disconnection for convenience requires written notice of at least 90 days prior to\neffective date.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$3,000,000 USD",
        "normalized": "3,000,000 USD",
        "source_quote": "Carrier's total aggregate liability for circuit interruption shall not exceed $3,000,000 USD.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Washington",
        "normalized": "Washington",
        "source_quote": "This agreement is governed by the laws of the State of Washington.",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "10 Gbps dedicated continuous throughput",
        "normalized": "10 Gbps dedicated continuous throughput",
        "source_quote": "Customer commits to purchase at least 10 Gbps dedicated continuous throughput\nacross the network.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.28,
      "estimated_cost_usd": 0.0,
      "tokens_used": 243
    },
    "negotiation_levers": [
      {
        "id": "lever-payment-terms",
        "field_name": "payment_terms",
        "title": "Optimize Working Capital (Payment Terms)",
        "current_term": "Net 30 days",
        "recommendation": "Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
        "rationale": "Current term is Net 30. Extending to Net 60 preserves cash flow and aligns with standard enterprise procurement benchmarks without disrupting supplier operations.",
        "impact": "high"
      },
      {
        "id": "lever-price-adjustment",
        "field_name": "price_adjustment",
        "title": "Cap Index-Linked Price Escalations",
        "current_term": "Index-linked price adjustment",
        "recommendation": "Add an annual collar/cap (e.g., lower of CPI or 3.0% maximum per annum).",
        "rationale": "Uncapped index-linked adjustments expose the organisation to runaway inflationary budget creep. A defined annual ceiling establishes budgetary predictability.",
        "impact": "high"
      },
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 90",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_09_TELECOM_BANDWIDTH_SLA - PAGE 1 OF 3\nENTERPRISE DEDICATED FIBER TRANSPORT\nAGREEMENT\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nBetween Pacific Optical Networks Corp ('Carrier') and Cascade Data Systems ('Customer').\nSECTION 1: NETWORK INFRASTRUCTURE\n1.1 Bandwidth Transit. Carrier provides dedicated optical Ethernet transport connecting primary data centers.\n1.2 Contract Term. The initial term of this Agreement shall be 36 months starting August 1, 2024.\n1.3 Auto-Renewal. The contract will automatically renew for consecutive 12-month periods.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_09_TELECOM_BANDWIDTH_SLA - PAGE 2 OF 3\nSECTION 2: CAPACITY COMMITMENT & CHARGES\n2.1 Volume Commitment. Customer commits to purchase at least 10 Gbps dedicated continuous throughput\nacross the network.\n2.2 Payment Terms. Customer will remit payment under Net 30 days terms from invoice dispatch.\n2.3 Price Adjustment. After the first 12 months, circuit MRC rates are index-linked to the Producer Price Index\n(PPI).\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_09_TELECOM_BANDWIDTH_SLA - PAGE 3 OF 3\nSECTION 3: DISCONNECTION AND INDEMNITY\n3.1 Termination Notice. Disconnection for convenience requires written notice of at least 90 days prior to\neffective date.\n3.2 Liability Cap. Carrier's total aggregate liability for circuit interruption shall not exceed $3,000,000 USD.\n3.3 Governing Law. This agreement is governed by the laws of the State of Washington.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_10_software_license_uncapped": {
    "contract_id": "synthetic_10_software_license_uncapped",
    "filename": "synthetic_10_software_license_uncapped.pdf",
    "num_pages": 4,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 60 days",
        "normalized": 60,
        "source_quote": "Payment shall be completed under Net 60 days from invoice generation.",
        "page": 3,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "subject to mutual agreement",
        "normalized": "renegotiable",
        "source_quote": "Annual maintenance fees are subject to mutual agreement and renegotiated annually.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 60 months",
        "normalized": "60 months",
        "source_quote": "The initial term of this Agreement shall be 60 months starting September 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The maintenance tier will automatically renew for successive 12-month periods.",
        "normalized": "true (12 months)",
        "source_quote": "The maintenance tier will automatically renew for successive 12-month periods.",
        "page": 2,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 120 days",
        "normalized": 120,
        "source_quote": "Either party may terminate maintenance upon written notice of at least 120 days.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "unlimited",
        "normalized": "uncapped",
        "source_quote": "Licensor agrees that aggregate liability is unlimited and uncapped liability applies for security\nbreaches or ledger loss.",
        "page": 4,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "New York",
        "normalized": "New York",
        "source_quote": "This Agreement is governed by the laws of the State of New York.",
        "page": 4,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": null,
        "normalized": "none found",
        "source_quote": null,
        "page": null,
        "confidence": 0.0,
        "status": "not_found",
        "review_reason": "Term not present in the contract clauses."
      }
    },
    "summary": {
      "verified_count": 7,
      "needs_review_count": 0,
      "not_found_count": 1,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.34,
      "estimated_cost_usd": 0.0,
      "tokens_used": 266
    },
    "negotiation_levers": [
      {
        "id": "lever-price-adjustment",
        "field_name": "price_adjustment",
        "title": "Formalize Renegotiation Triggers",
        "current_term": "Subject to renegotiation / mutual agreement",
        "recommendation": "Include minimum 90-day advance notice for price revisions and termination rights if agreement is not reached.",
        "rationale": "Vague renegotiation clauses create hold-up problems where the vendor requests an increase close to renewal when switching costs are highest.",
        "impact": "medium"
      },
      {
        "id": "lever-liability-cap",
        "field_name": "liability_cap",
        "title": "Institute Aggregate Liability Ceiling",
        "current_term": "unlimited",
        "recommendation": "Cap aggregate vendor and buyer liability at 12 months' trailing fees paid or fixed $1M ceiling.",
        "rationale": "Uncapped liability or ambiguous limits represent an unquantified balance sheet risk during audits and vendor security incidents.",
        "impact": "high"
      },
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 120",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_10_SOFTWARE_LICENSE_UNCAPPED - PAGE 1 OF 4\nCORE BANKING LEDGER SOFTWARE LICENSE\nAGREEMENT\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nBy and between FinCore Software Solutions Inc ('Licensor') and Metropolitan Union Bank ('Licensee').\nSECTION 1: GRANT OF LICENSE\n1.1 License. Licensor grants Licensee a perpetual enterprise core banking engine license.\n1.2 Contract Term. The initial term of this Agreement shall be 60 months starting September 1, 2024.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_10_SOFTWARE_LICENSE_UNCAPPED - PAGE 2 OF 4\nSECTION 2: ESCROW AND RENEWAL\n2.1 Auto-Renewal. The maintenance tier will automatically renew for successive 12-month periods.\n2.2 Volume. No volume commitment is required under this site-wide deployment model.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_10_SOFTWARE_LICENSE_UNCAPPED - PAGE 3 OF 4\nSECTION 3: FEES & ESCALATION\n3.1 Payment Terms. Payment shall be completed under Net 60 days from invoice generation.\n3.2 Price Adjustment. Annual maintenance fees are subject to mutual agreement and renegotiated annually.\n3.3 Termination. Either party may terminate maintenance upon written notice of at least 120 days.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      },
      {
        "page_number": 4,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_10_SOFTWARE_LICENSE_UNCAPPED - PAGE 4 OF 4\nSECTION 4: UNLIMITED LIABILITY & JURISDICTION\n4.1 Liability Cap. Licensor agrees that aggregate liability is unlimited and uncapped liability applies for security\nbreaches or ledger loss.\n4.2 Governing Law. This Agreement is governed by the laws of the State of New York.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 4\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_11_catering_hospitality_short_term": {
    "contract_id": "synthetic_11_catering_hospitality_short_term",
    "filename": "synthetic_11_catering_hospitality_short_term.pdf",
    "num_pages": 2,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "within 14 days",
        "normalized": 14,
        "source_quote": "Caterer invoices weekly, and all invoices shall be paid within 14 days of receipt.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": "firm and fixed",
        "normalized": "fixed",
        "source_quote": "Menu pricing is firm and fixed for the entire 6-month term with no price increases.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 6 months",
        "normalized": "6 months",
        "source_quote": "The initial term of this Agreement shall be 6 months commencing October 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "This contract shall not automatically renew and terminates upon conclusion of the 6-month term.",
        "normalized": "false",
        "source_quote": "This contract shall not automatically renew and terminates upon conclusion of the 6-month\nterm.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 15 days",
        "normalized": 15,
        "source_quote": "Host may cancel event services upon written notice of at least 15 days.",
        "page": 2,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$100,000 USD",
        "normalized": "100,000 USD",
        "source_quote": "Caterer's aggregate liability shall not exceed $100,000 USD for any food safety or property\nclaims.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Colorado",
        "normalized": "Colorado",
        "source_quote": "This agreement is governed by the laws of the State of Colorado.",
        "page": 2,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "500 meal covers per week",
        "normalized": "500 meal covers per week",
        "source_quote": "Host guarantees a minimum volume commitment of 500 meal covers per week.",
        "page": 1,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 8,
      "needs_review_count": 0,
      "not_found_count": 0,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.07,
      "estimated_cost_usd": 0.0,
      "tokens_used": 224
    },
    "negotiation_levers": [
      {
        "id": "lever-payment-terms",
        "field_name": "payment_terms",
        "title": "Optimize Working Capital (Payment Terms)",
        "current_term": "Net 14 days",
        "recommendation": "Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
        "rationale": "Current term is Net 14. Extending to Net 60 preserves cash flow and aligns with standard enterprise procurement benchmarks without disrupting supplier operations.",
        "impact": "high"
      },
      {
        "id": "lever-governing-law",
        "field_name": "governing_law",
        "title": "Jurisdiction Harmonization",
        "current_term": "Colorado",
        "recommendation": "Harmonize governing law to buyer's standard operating jurisdiction.",
        "rationale": "Foreign or distant jurisdictions dramatically increase dispute resolution expenses and require local counsel retention.",
        "impact": "low"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_11_CATERING_HOSPITALITY_SHORT_TERM - PAGE 1 OF 2\nCORPORATE CATERING SERVICES AGREEMENT\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nEntered into by Alpine Gourmet Catering LLC ('Caterer') and Summit Tech Campus ('Host').\nSECTION 1: CATERING SERVICES & DURATION\n1.1 Services. Caterer shall operate the executive dining hall and daily luncheon stations.\n1.2 Contract Term. The initial term of this Agreement shall be 6 months commencing October 1, 2024.\n1.3 Non-Renewal. This contract shall not automatically renew and terminates upon conclusion of the 6-month\nterm.\n1.4 Volume Commitment. Host guarantees a minimum volume commitment of 500 meal covers per week.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_11_CATERING_HOSPITALITY_SHORT_TERM - PAGE 2 OF 2\nSECTION 2: REMITTANCE, ESCALATION & DISMISSAL\n2.1 Payment Terms. Caterer invoices weekly, and all invoices shall be paid within 14 days of receipt.\n2.2 Price Adjustment. Menu pricing is firm and fixed for the entire 6-month term with no price increases.\n2.3 Termination Notice. Host may cancel event services upon written notice of at least 15 days.\n2.4 Liability Cap. Caterer's aggregate liability shall not exceed $100,000 USD for any food safety or property\nclaims.\n2.5 Governing Law. This agreement is governed by the laws of the State of Colorado.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      }
    ],
    "demo_mode": true
  },
  "synthetic_12_security_services_missing_adjustment": {
    "contract_id": "synthetic_12_security_services_missing_adjustment",
    "filename": "synthetic_12_security_services_missing_adjustment.pdf",
    "num_pages": 3,
    "fields": {
      "payment_terms": {
        "field_name": "payment_terms",
        "value": "Net 30 days",
        "normalized": 30,
        "source_quote": "Client will settle all charges under payment terms of Net 30 days from invoice receipt.",
        "page": 2,
        "confidence": 0.95,
        "status": "verified",
        "review_reason": null
      },
      "price_adjustment": {
        "field_name": "price_adjustment",
        "value": null,
        "normalized": "none found",
        "source_quote": null,
        "page": null,
        "confidence": 0.0,
        "status": "not_found",
        "review_reason": "Term not present in the contract clauses."
      },
      "contract_term": {
        "field_name": "contract_term",
        "value": "initial term of this Agreement shall be 24 months",
        "normalized": "24 months",
        "source_quote": "The initial term of this Agreement shall be 24 months beginning November 1, 2024.",
        "page": 1,
        "confidence": 0.94,
        "status": "verified",
        "review_reason": null
      },
      "auto_renewal": {
        "field_name": "auto_renewal",
        "value": "The contract will automatically renew for successive 12-month periods.",
        "normalized": "true (12 months)",
        "source_quote": "The contract will automatically renew for successive 12-month periods.",
        "page": 1,
        "confidence": 0.91,
        "status": "verified",
        "review_reason": null
      },
      "termination_notice": {
        "field_name": "termination_notice",
        "value": "written notice of at least 45 days",
        "normalized": 45,
        "source_quote": "Either party may terminate this agreement upon written notice of at least 45 days.",
        "page": 3,
        "confidence": 0.93,
        "status": "verified",
        "review_reason": null
      },
      "liability_cap": {
        "field_name": "liability_cap",
        "value": "$2,000,000 USD",
        "normalized": "2,000,000 USD",
        "source_quote": "Aggregate liability under this contract shall not exceed $2,000,000 USD.",
        "page": 3,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      },
      "governing_law": {
        "field_name": "governing_law",
        "value": "Georgia",
        "normalized": "Georgia",
        "source_quote": "This agreement is governed by the laws of the State of Georgia.",
        "page": 3,
        "confidence": 0.96,
        "status": "verified",
        "review_reason": null
      },
      "volume_commitment": {
        "field_name": "volume_commitment",
        "value": "1,200 patrol hours per month",
        "normalized": "1,200 patrol hours per month",
        "source_quote": "Client agrees to a minimum volume commitment of 1,200 patrol hours per month.",
        "page": 2,
        "confidence": 0.92,
        "status": "verified",
        "review_reason": null
      }
    },
    "summary": {
      "verified_count": 7,
      "needs_review_count": 0,
      "not_found_count": 1,
      "total_fields": 8,
      "overall_confidence": 0.93,
      "processing_time_ms": 2.25,
      "estimated_cost_usd": 0.0,
      "tokens_used": 246
    },
    "negotiation_levers": [
      {
        "id": "lever-payment-terms",
        "field_name": "payment_terms",
        "title": "Optimize Working Capital (Payment Terms)",
        "current_term": "Net 30 days",
        "recommendation": "Negotiate Net 60 or Net 90 payment terms with 1.5% prompt payment discount.",
        "rationale": "Current term is Net 30. Extending to Net 60 preserves cash flow and aligns with standard enterprise procurement benchmarks without disrupting supplier operations.",
        "impact": "high"
      },
      {
        "id": "lever-auto-renewal",
        "field_name": "auto_renewal",
        "title": "Auto-Renewal Trap Mitigation",
        "current_term": "Auto-renews; Termination notice: 45",
        "recommendation": "Require explicit affirmative notice before renewal, or expand termination opt-out window to 60 days.",
        "rationale": "Evergreen auto-renewal clauses lock procurement teams into obsolete pricing and unused licenses if missed during quarterly contract reviews.",
        "impact": "medium"
      }
    ],
    "pages": [
      {
        "page_number": 1,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_12_SECURITY_SERVICES_MISSING_ADJUSTMENT - PAGE 1 OF 3\nON-SITE PHYSICAL SECURITY SERVICES AGREEMENT\nCONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK\nBy and between Sentinel Protective Services Corp ('Contractor') and Logistics Hub Georgia LLC ('Client').\nSECTION 1: GUARDING SCHEDULE & DURATION\n1.1 Guarding. Contractor shall staff 24/7 security gatehouses and mobile perimeter patrols.\n1.2 Contract Term. The initial term of this Agreement shall be 24 months beginning November 1, 2024.\n1.3 Auto-Renewal. The contract will automatically renew for successive 12-month periods.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 1\n"
      },
      {
        "page_number": 2,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_12_SECURITY_SERVICES_MISSING_ADJUSTMENT - PAGE 2 OF 3\nSECTION 2: BILLING AND VOLUME COMMITMENTS\n2.1 Volume Commitment. Client agrees to a minimum volume commitment of 1,200 patrol hours per month.\n2.2 Payment Terms. Client will settle all charges under payment terms of Net 30 days from invoice receipt.\n2.3 Price Adjustment. [NOTE: The agreement contains no price adjustment or price escalation clause; fees\nremain as scheduled.]\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 2\n"
      },
      {
        "page_number": 3,
        "text": "CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - SYNTHETIC_12_SECURITY_SERVICES_MISSING_ADJUSTMENT - PAGE 3 OF 3\nSECTION 3: LIABILITY, TERMINATION & JURISDICTION\n3.1 Termination Notice. Either party may terminate this agreement upon written notice of at least 45 days.\n3.2 Liability Cap. Aggregate liability under this contract shall not exceed $2,000,000 USD.\n3.3 Governing Law. This agreement is governed by the laws of the State of Georgia.\nClauseLens Synthetic Supplier Contract \u2022 Not legal advice \u2022 Page 3\n"
      }
    ],
    "demo_mode": true
  }
};
