"""
Generates 12 realistic synthetic supplier contracts as PDFs using ReportLab,
and saves the corresponding ground truth JSON files in data/ground_truth/.
All documents are clearly marked as synthetic in file names and contents.
"""
import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, HRFlowable

OUTPUT_PDF_DIR = os.path.join(os.path.dirname(__file__), "contracts")
OUTPUT_GT_DIR = os.path.join(os.path.dirname(__file__), "ground_truth")

os.makedirs(OUTPUT_PDF_DIR, exist_ok=True)
os.makedirs(OUTPUT_GT_DIR, exist_ok=True)

CONTRACT_SPECS = [
    {
        "id": "synthetic_01_it_services_standard",
        "title": "Master IT Managed Services Agreement",
        "filename": "synthetic_01_it_services_standard.pdf",
        "category": "IT & Software",
        "description": "Standard multi-year IT infrastructure and managed services contract with fixed pricing and Delaware governing law.",
        "tags": ["standard", "IT", "fixed-price"],
        "pages_content": [
            [
                ("MASTER IT MANAGED SERVICES AGREEMENT", "title"),
                ("CONFIDENTIAL & SYNTHETIC - CLAUSELENS BENCHMARK DATASET", "subtitle"),
                ("This Master Services Agreement ('Agreement') is entered into as of January 15, 2024, by and between Apex Cloud Infrastructure LLC ('Supplier') and Nexus Enterprise Systems Inc. ('Customer').", "body"),
                ("SECTION 1: APPOINTMENT AND SCOPE OF SERVICES", "h2"),
                ("1.1 Services. Supplier shall provide Customer with enterprise cloud management, NOC monitoring, and server infrastructure support as described in Schedule A.", "body"),
                ("1.2 Standard of Performance. All Services shall be rendered in a professional, workmanlike manner meeting 99.95% monthly uptime service levels.", "body"),
                ("SECTION 2: TERM AND COMMENCEMENT", "h2"),
                ("2.1 Contract Term. The initial term of this Agreement shall be 36 months, commencing on February 1, 2024 and ending on January 31, 2027.", "body"),
                ("2.2 Auto-Renewal. This Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal.", "body"),
            ],
            [
                ("SECTION 3: FEES, INVOICING, AND PAYMENT", "h2"),
                ("3.1 Invoices. Supplier shall invoice Customer monthly in advance for standard recurring infrastructure fees.", "body"),
                ("3.2 Payment Terms. Customer shall satisfy all undisputed invoices under payment terms of Net 30 days from the invoice date.", "body"),
                ("3.3 Price Adjustment. The recurring subscription fees are firm and fixed for the initial term of thirty-six (36) months with no adjustment.", "body"),
                ("SECTION 4: TERMINATION AND NOTICE", "h2"),
                ("4.1 Termination for Convenience. Either party may terminate this Agreement without cause upon providing written notice of at least 60 days.", "body"),
                ("4.2 Termination for Cause. Either party may terminate immediately upon material breach if such breach remains uncured for 30 calendar days.", "body"),
            ],
            [
                ("SECTION 5: COMMITMENT AND LIABILITIES", "h2"),
                ("5.1 Volume Commitment. Customer guarantees a minimum annual volume commitment of 100 enterprise server nodes throughout each contract year.", "body"),
                ("5.2 Liability Cap. Except for gross negligence or willful misconduct, each party's aggregate liability shall not exceed $1,000,000 USD under this Agreement.", "body"),
                ("SECTION 6: GOVERNING LAW AND DISPUTE RESOLUTION", "h2"),
                ("6.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles.", "body"),
                ("6.2 Jurisdiction. The parties submit to the exclusive jurisdiction of the state and federal courts located in New Castle County, Delaware.", "body"),
                ("IN WITNESS WHEREOF, the authorized representatives have executed this Agreement.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 30 days", "normalized": 30, "quote": "Customer shall satisfy all undisputed invoices under payment terms of Net 30 days from the invoice date.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "firm and fixed", "normalized": "fixed", "quote": "The recurring subscription fees are firm and fixed for the initial term of thirty-six (36) months with no adjustment.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "36 months", "normalized": "36 months", "quote": "The initial term of this Agreement shall be 36 months, commencing on February 1, 2024 and ending on January 31, 2027.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "successive 12-month periods", "normalized": "true (12 months)", "quote": "This Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "60 days", "normalized": 60, "quote": "Either party may terminate this Agreement without cause upon providing written notice of at least 60 days.", "page": 2, "status": "verified"},
            "liability_cap": {"raw": "$1,000,000 USD", "normalized": "$1,000,000 USD", "quote": "Except for gross negligence or willful misconduct, each party's aggregate liability shall not exceed $1,000,000 USD under this Agreement.", "page": 3, "status": "verified"},
            "governing_law": {"raw": "State of Delaware", "normalized": "Delaware", "quote": "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of laws principles.", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": "100 enterprise server nodes", "normalized": "100 enterprise server nodes", "quote": "Customer guarantees a minimum annual volume commitment of 100 enterprise server nodes throughout each contract year.", "page": 3, "status": "verified"}
        }
    },
    {
        "id": "synthetic_02_cloud_saas_index_linked",
        "title": "Enterprise Cloud SaaS Subscription Agreement",
        "filename": "synthetic_02_cloud_saas_index_linked.pdf",
        "category": "SaaS",
        "description": "Cloud software subscription with index-linked price adjustments, 90 days termination notice, and New York governing law.",
        "tags": ["index-linked", "SaaS", "high-liability"],
        "pages_content": [
            [
                ("ENTERPRISE CLOUD SAAS SUBSCRIPTION AGREEMENT", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("This Enterprise Software-as-a-Service Agreement is entered into by Stratos Platform Corp. ('Vendor') and Meridian Global Financial ('Subscriber').", "body"),
                ("ARTICLE 1: SUBSCRIPTION GRANT", "h2"),
                ("1.1 License. Vendor grants Subscriber a non-exclusive subscription to access the hosted multi-tenant analytics platform.", "body"),
                ("1.2 Term. This subscription has an initial term of 24 months commencing on March 1, 2024.", "body"),
                ("1.3 Auto-Renewal. The subscription shall automatically renew for consecutive 12-month periods unless terminated in accordance with Section 4.", "body"),
            ],
            [
                ("ARTICLE 2: COMMODITY PRICING AND PAYMENT", "h2"),
                ("2.1 Billing. Subscriber shall pay subscription fees annually in advance.", "body"),
                ("2.2 Payment Terms. Invoices shall be paid within sixty (60) days of receipt by Subscriber's accounts payable department.", "body"),
                ("2.3 Price Adjustment. After the first year, annual subscription charges are subject to an index-linked adjustment pegged to the Consumer Price Index (CPI), capped at 5% annually.", "body"),
                ("ARTICLE 3: COMMERCIAL COMMITMENTS", "h2"),
                ("3.1 Volume Commitment. Subscriber agrees to maintain a minimum spend of $120,000 USD per contract year across all operational subsidiaries.", "body"),
            ],
            [
                ("ARTICLE 4: TERMINATION PROCEDURE", "h2"),
                ("4.1 Termination for Convenience. Either party may elect non-renewal or termination upon ninety (90) days prior written notice before the expiration of the current term.", "body"),
                ("ARTICLE 5: LIABILITY RESTRICTIONS AND GOVERNANCE", "h2"),
                ("5.1 Liability Cap. The total aggregate liability of either party for all claims arising out of this Agreement shall not exceed $2,500,000 USD.", "body"),
                ("5.2 Governing Law. This Agreement is governed by the laws of the State of New York, excluding its conflicts of law rules.", "body"),
                ("The parties have executed this Agreement on the date first written above.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "sixty (60) days", "normalized": 60, "quote": "Invoices shall be paid within sixty (60) days of receipt by Subscriber's accounts payable department.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "Consumer Price Index (CPI)", "normalized": "index-linked", "quote": "After the first year, annual subscription charges are subject to an index-linked adjustment pegged to the Consumer Price Index (CPI), capped at 5% annually.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "24 months", "normalized": "24 months", "quote": "This subscription has an initial term of 24 months commencing on March 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "consecutive 12-month periods", "normalized": "true (12 months)", "quote": "The subscription shall automatically renew for consecutive 12-month periods unless terminated in accordance with Section 4.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "ninety (90) days", "normalized": 90, "quote": "Either party may elect non-renewal or termination upon ninety (90) days prior written notice before the expiration of the current term.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "$2,500,000 USD", "normalized": "$2,500,000 USD", "quote": "The total aggregate liability of either party for all claims arising out of this Agreement shall not exceed $2,500,000 USD.", "page": 3, "status": "verified"},
            "governing_law": {"raw": "State of New York", "normalized": "New York", "quote": "This Agreement is governed by the laws of the State of New York, excluding its conflicts of law rules.", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": "$120,000 USD per contract year", "normalized": "$120,000 USD per contract year", "quote": "Subscriber agrees to maintain a minimum spend of $120,000 USD per contract year across all operational subsidiaries.", "page": 2, "status": "verified"}
        }
    },
    {
        "id": "synthetic_03_german_logistics_freight",
        "title": "Cross-Border Logistics Framework Agreement (German-style phrasing)",
        "filename": "synthetic_03_german_logistics_freight.pdf",
        "category": "Logistics",
        "description": "Logistics agreement featuring German commercial phrasing ('Zahlungsziel 45 Tage', Verbraucherpreisindex, German law).",
        "tags": ["German", "multilingual", "logistics"],
        "pages_content": [
            [
                ("CROSS-BORDER FREIGHT & LOGISTICS FRAMEWORK AGREEMENT", "title"),
                ("SYNTHETISCHER MUSTERVERTRAG - CLAUSELENS BENCHMARK", "subtitle"),
                ("Between Rhein-Spedition Logistik GmbH ('Spediteur') and EuroTrade Distribution BV ('Auftraggeber').", "body"),
                ("PARAGRAPH 1: LEISTUNGSUMFANG (SCOPE OF FREIGHT SERVICES)", "h2"),
                ("1.1 Freight Services. The Spediteur will provide pan-European road freight and cold-chain cargo forwarding.", "body"),
                ("1.2 Contract Term. Der Vertrag hat eine initial term of 36 months effective from April 1, 2024.", "body"),
                ("1.3 Auto-Renewal. The contract shall not automatically renew and terminates automatically upon term expiry.", "body"),
            ],
            [
                ("PARAGRAPH 2: ZAHLUNGSBEDINGUNGEN UND PREISANPASSUNG", "h2"),
                ("2.1 Payment Terms. Rechnungen unterliegen einem Zahlungsziel 45 Tage nach Rechnungseingang without deduction.", "body"),
                ("2.2 Price Adjustment. Die Frachttarife sind index-linked and adjusted annually based on the German Verbraucherpreisindex inflation metric.", "body"),
                ("2.3 Volume Commitment. Der Auftraggeber commits to purchase at least 5,000 standard freight pallets per calendar year.", "body"),
            ],
            [
                ("PARAGRAPH 3: KÜNDIGUNG UND HAFTUNG (TERMINATION & LIABILITY)", "h2"),
                ("3.1 Termination Notice. Ordentliche Kündigung is permitted upon written notice of at least 30 days.", "body"),
                ("3.2 Liability Cap. The total aggregate liability shall not exceed 500,000 EUR under all freight orders.", "body"),
                ("3.3 Governing Law. This contract is governed by and construed under the laws of Germany (Bundesrepublik Deutschland).", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Zahlungsziel 45 Tage", "normalized": 45, "quote": "Rechnungen unterliegen einem Zahlungsziel 45 Tage nach Rechnungseingang without deduction.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "Verbraucherpreisindex", "normalized": "index-linked", "quote": "Die Frachttarife sind index-linked and adjusted annually based on the German Verbraucherpreisindex inflation metric.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "36 months", "normalized": "36 months", "quote": "Der Vertrag hat eine initial term of 36 months effective from April 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "shall not automatically renew", "normalized": "false", "quote": "The contract shall not automatically renew and terminates automatically upon term expiry.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "30 days", "normalized": 30, "quote": "Ordentliche Kündigung is permitted upon written notice of at least 30 days.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "500,000 EUR", "normalized": "500,000 EUR", "quote": "The total aggregate liability shall not exceed 500,000 EUR under all freight orders.", "page": 3, "status": "verified"},
            "governing_law": {"raw": "Germany", "normalized": "Germany", "quote": "This contract is governed by and construed under the laws of Germany (Bundesrepublik Deutschland).", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": "5,000 standard freight pallets", "normalized": "5,000 standard freight pallets", "quote": "Der Auftraggeber commits to purchase at least 5,000 standard freight pallets per calendar year.", "page": 2, "status": "verified"}
        }
    },
    {
        "id": "synthetic_04_hardware_procurement_volume",
        "title": "Hardware & Component Supply Master Agreement",
        "filename": "synthetic_04_hardware_procurement_volume.pdf",
        "category": "Hardware",
        "description": "Multi-page manufacturing and hardware procurement contract with firm fixed pricing and high volume commitment.",
        "tags": ["hardware", "procurement", "volume-heavy"],
        "pages_content": [
            [
                ("MASTER HARDWARE PROCUREMENT & COMPONENT SUPPLY AGREEMENT", "title"),
                ("CONFIDENTIAL SYNTHETIC BENCHMARK SPECIFICATION", "subtitle"),
                ("Entered into by MicroSilicon Components Inc. ('Supplier') and Quantum Computing Devices Corp. ('Buyer').", "body"),
                ("SECTION 1: SUPPLY SPECIFICATIONS", "h2"),
                ("1.1 Products. Supplier will manufacture custom ASIC accelerator boards according to Buyer specifications.", "body"),
                ("1.2 Contract Term. The initial term of this Agreement shall be 48 months from the Effective Date.", "body"),
            ],
            [
                ("SECTION 2: DELIVERY AND VOLUME QUOTA", "h2"),
                ("2.1 Volume Commitment. Buyer guarantees a minimum volume commitment of 10,000 accelerator units per calendar year.", "body"),
                ("2.2 Shortfall Penalty. Buyer agrees to pay an idle production fee of $45 per unit shortfall.", "body"),
            ],
            [
                ("SECTION 3: PRICING AND PAYMENTS", "h2"),
                ("3.1 Invoicing. Supplier will invoice upon successful Bill of Lading generation.", "body"),
                ("3.2 Payment Terms. Payment shall be due under payment terms of Net 45 calendar days after receipt of goods.", "body"),
                ("3.3 Price Adjustment. Unit prices are firm and fixed for the entire 48-month duration with no price increases.", "body"),
                ("3.4 Auto-Renewal. This Agreement shall not automatically renew upon expiration of the initial term.", "body"),
            ],
            [
                ("SECTION 4: REMEDIES AND GOVERNANCE", "h2"),
                ("4.1 Termination. Either party may terminate for convenience upon written notice of at least 60 days.", "body"),
                ("4.2 Liability Cap. Each party's total aggregate liability under this agreement shall not exceed $5,000,000 USD.", "body"),
                ("4.3 Governing Law. This Agreement shall be governed by the laws of the State of California, without regard to conflicts principles.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 45 calendar days", "normalized": 45, "quote": "Payment shall be due under payment terms of Net 45 calendar days after receipt of goods.", "page": 3, "status": "verified"},
            "price_adjustment": {"raw": "firm and fixed", "normalized": "fixed", "quote": "Unit prices are firm and fixed for the entire 48-month duration with no price increases.", "page": 3, "status": "verified"},
            "contract_term": {"raw": "48 months", "normalized": "48 months", "quote": "The initial term of this Agreement shall be 48 months from the Effective Date.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "shall not automatically renew", "normalized": "false", "quote": "This Agreement shall not automatically renew upon expiration of the initial term.", "page": 3, "status": "verified"},
            "termination_notice": {"raw": "60 days", "normalized": 60, "quote": "Either party may terminate for convenience upon written notice of at least 60 days.", "page": 4, "status": "verified"},
            "liability_cap": {"raw": "$5,000,000 USD", "normalized": "$5,000,000 USD", "quote": "Each party's total aggregate liability under this agreement shall not exceed $5,000,000 USD.", "page": 4, "status": "verified"},
            "governing_law": {"raw": "State of California", "normalized": "California", "quote": "This Agreement shall be governed by the laws of the State of California, without regard to conflicts principles.", "page": 4, "status": "verified"},
            "volume_commitment": {"raw": "10,000 accelerator units per calendar year", "normalized": "10,000 accelerator units per calendar year", "quote": "Buyer guarantees a minimum volume commitment of 10,000 accelerator units per calendar year.", "page": 2, "status": "verified"}
        }
    },
    {
        "id": "synthetic_05_marketing_agency_missing_cap",
        "title": "Creative Services & Marketing Retainer Agreement (Missing Liability Cap)",
        "filename": "synthetic_05_marketing_agency_missing_cap.pdf",
        "category": "Marketing",
        "description": "Short marketing retainer where the liability cap is completely omitted/silent and prices are renegotiable.",
        "tags": ["missing-field", "silent-cap", "renegotiable"],
        "pages_content": [
            [
                ("GLOBAL MARKETING & CREATIVE SERVICES RETAINER", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("This Agreement is made between Horizon Media UK Ltd ('Agency') and Vertex Global Retail ('Client').", "body"),
                ("CLAUSE 1: ENGAGEMENT & SCOPE", "h2"),
                ("1.1 Retainer. Agency will deliver ongoing digital branding, omnichannel advertising campaigns, and creative assets.", "body"),
                ("1.2 Term. The duration of this agreement is an initial term of 12 months starting June 1, 2024.", "body"),
                ("1.3 Auto-Renewal. This Agreement will automatically renew for successive 12-month periods unless canceled.", "body"),
                ("1.4 Volume. Client has not made any volume commitment or guaranteed project minimums under this retainer.", "body"),
            ],
            [
                ("CLAUSE 2: FINANCIAL PROVISIONS AND CANCELLATION", "h2"),
                ("2.1 Invoicing. Retainer invoices are submitted on the first day of each calendar month.", "body"),
                ("2.2 Payment Terms. Client will pay all invoices under payment terms of Net 30 days from date of presentation.", "body"),
                ("2.3 Price Adjustment. Retainer pricing is renegotiated annually by mutual agreement prior to renewal.", "body"),
                ("2.4 Termination. Either party may cancel the retainer upon written notice of at least 30 days.", "body"),
                ("CLAUSE 3: LEGAL TERMS", "h2"),
                ("3.1 Governing Law. This agreement is governed by the laws of England and Wales.", "body"),
                ("3.2 Liability. [NOTE: Contract is silent regarding liability limitation; no liability cap clause is included in this agreement.]", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 30 days", "normalized": 30, "quote": "Client will pay all invoices under payment terms of Net 30 days from date of presentation.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "renegotiated annually by mutual agreement", "normalized": "renegotiable", "quote": "Retainer pricing is renegotiated annually by mutual agreement prior to renewal.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "12 months", "normalized": "12 months", "quote": "The duration of this agreement is an initial term of 12 months starting June 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "successive 12-month periods", "normalized": "true (12 months)", "quote": "This Agreement will automatically renew for successive 12-month periods unless canceled.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "30 days", "normalized": 30, "quote": "Either party may cancel the retainer upon written notice of at least 30 days.", "page": 2, "status": "verified"},
            "liability_cap": {"raw": None, "normalized": "none found", "quote": None, "page": None, "status": "not_found"},
            "governing_law": {"raw": "England and Wales", "normalized": "England and Wales", "quote": "This agreement is governed by the laws of England and Wales.", "page": 2, "status": "verified"},
            "volume_commitment": {"raw": None, "normalized": "none found", "quote": "Client has not made any volume commitment or guaranteed project minimums under this retainer.", "page": 1, "status": "not_found"}
        }
    },
    {
        "id": "synthetic_06_conflicting_clauses_materials",
        "title": "Raw Materials Supply Contract (Conflicting Liability Clauses)",
        "filename": "synthetic_06_conflicting_clauses_materials.pdf",
        "category": "Manufacturing",
        "description": "Chemical supply agreement with deliberately conflicting liability clauses between Section 5 and Section 9.",
        "tags": ["conflict", "conflicting-clauses", "needs-review"],
        "pages_content": [
            [
                ("RAW MATERIALS & INDUSTRIAL CHEMICALS MASTER SUPPLY", "title"),
                ("SYNTHETIC BENCHMARK - CONFLICTING CLAUSE TEST CASE", "subtitle"),
                ("Between PetroChem Solvents LLC ('Seller') and Polymer Fabrication Corp ('Purchaser').", "body"),
                ("ARTICLE 1: SUPPLY SCOPE & DURATION", "h2"),
                ("1.1 Products. Seller agrees to supply industrial grade toluene and ethanol derivatives.", "body"),
                ("1.2 Term. The contract duration of 36 months begins May 1, 2024.", "body"),
                ("1.3 Non-Renewal. The contract shall not automatically renew and terminates upon expiration.", "body"),
            ],
            [
                ("ARTICLE 2: COMMERCIAL PURCHASE OBLIGATIONS", "h2"),
                ("2.1 Volume Commitment. Purchaser commits to purchase at least 250 metric tons of material per calendar month.", "body"),
                ("2.2 Payment Terms. Payment shall be completed under Net 60 days from bill of lading issuance.", "body"),
                ("2.3 Price Adjustment. Commodity raw material prices are subject to renegotiation every six months based on feedstocks.", "body"),
                ("ARTICLE 3: STANDARD LIABILITY CEILING", "h2"),
                ("3.1 Standard Liability. Seller aggregate liability shall not exceed $500,000 USD for any product defect claims.", "body"),
            ],
            [
                ("ARTICLE 4: TERMINATION PROCEDURE", "h2"),
                ("4.1 Termination. Either party may cancel with written notice of at least 90 days.", "body"),
                ("ARTICLE 5: SPECIAL INDEMNITY & GOVERNING JURISDICTION", "h2"),
                ("5.1 Conflicting Liability Term. Notwithstanding any provision to the contrary in Section 3.1, Seller liability is unlimited and uncapped liability applies for breach of delivery or product recalls.", "body"),
                ("5.2 Governing Law. This agreement is governed by the laws of the State of Texas.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 60 days", "normalized": 60, "quote": "Payment shall be completed under Net 60 days from bill of lading issuance.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "subject to renegotiation", "normalized": "renegotiable", "quote": "Commodity raw material prices are subject to renegotiation every six months based on feedstocks.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "36 months", "normalized": "36 months", "quote": "The contract duration of 36 months begins May 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "shall not automatically renew", "normalized": "false", "quote": "The contract shall not automatically renew and terminates upon expiration.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "90 days", "normalized": 90, "quote": "Either party may cancel with written notice of at least 90 days.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "conflicting: $500,000 USD vs unlimited", "normalized": "uncapped", "quote": "Notwithstanding any provision to the contrary in Section 3.1, Seller liability is unlimited and uncapped liability applies for breach of delivery or product recalls.", "page": 3, "status": "needs_review"},
            "governing_law": {"raw": "State of Texas", "normalized": "Texas", "quote": "This agreement is governed by the laws of the State of Texas.", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": "250 metric tons of material per calendar month", "normalized": "250 metric tons of material per calendar month", "quote": "Purchaser commits to purchase at least 250 metric tons of material per calendar month.", "page": 2, "status": "verified"}
        }
    },
    {
        "id": "synthetic_07_annex_hidden_facilities",
        "title": "Integrated Facilities Management Agreement (Terms in Annex)",
        "filename": "synthetic_07_annex_hidden_facilities.pdf",
        "category": "Facilities",
        "description": "Facilities maintenance agreement where key commercial payment and commitment terms are located in Annex Schedule A.",
        "tags": ["annex", "hidden-terms", "facilities"],
        "pages_content": [
            [
                ("INTEGRATED FACILITIES MANAGEMENT MASTER SERVICES", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("Entered into by Vanguard Facility Services LLC ('Supplier') and Omnicorp Global ('Owner').", "body"),
                ("SECTION 1: CORE OPERATIONAL OBLIGATIONS", "h2"),
                ("1.1 Scope. Supplier provides building janitorial, HVAC preventative maintenance, and physical security.", "body"),
                ("1.2 Contract Term. The initial term of this Agreement shall be 36 months from execution date.", "body"),
                ("1.3 Auto-Renewal. The contract will automatically renew for successive 12-month periods.", "body"),
            ],
            [
                ("SECTION 2: TERMINATION AND GENERAL PROVISIONS", "h2"),
                ("2.1 Termination. Either party may terminate with written notice of at least 60 days.", "body"),
                ("2.2 Governing Law. This agreement is governed by the laws of the State of Illinois.", "body"),
                ("2.3 Liability Cap. Total liability under this agreement shall not exceed $750,000 USD.", "body"),
                ("2.4 Annex Precedence. Specific financial terms and operational commitments are set forth in Annex A.", "body"),
            ],
            [
                ("SECTION 3: SERVICE LEVEL EXPECTATIONS", "h2"),
                ("3.1 Response Time. Emergency HVAC repair calls must be answered within 2 hours.", "body"),
                ("3.2 Escalation Matrix. Tier 1 and Tier 2 management notification procedures.", "body"),
                ("3.3 Environmental Compliance. Compliance with state emissions regulations.", "body"),
            ],
            [
                ("ANNEX A: FINANCIAL SCHEDULE & COMMERCIAL MATTERS", "title"),
                ("SCHEDULE A.1 - PAYMENT AND SPEND COMMITMENTS", "h2"),
                ("A.1 Invoicing and Terms. All maintenance fees are subject to payment terms of Net 45 calendar days after invoice approval.", "body"),
                ("A.2 Price Adjustment. Facility hourly labor rates are firm and fixed for the entire 3-year term.", "body"),
                ("A.3 Volume Commitment. Owner commits to a minimum spend of $350,000 USD per contract year for corporate campus maintenance.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 45 calendar days", "normalized": 45, "quote": "All maintenance fees are subject to payment terms of Net 45 calendar days after invoice approval.", "page": 4, "status": "verified"},
            "price_adjustment": {"raw": "firm and fixed", "normalized": "fixed", "quote": "Facility hourly labor rates are firm and fixed for the entire 3-year term.", "page": 4, "status": "verified"},
            "contract_term": {"raw": "36 months", "normalized": "36 months", "quote": "The initial term of this Agreement shall be 36 months from execution date.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "successive 12-month periods", "normalized": "true (12 months)", "quote": "The contract will automatically renew for successive 12-month periods.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "60 days", "normalized": 60, "quote": "Either party may terminate with written notice of at least 60 days.", "page": 2, "status": "verified"},
            "liability_cap": {"raw": "$750,000 USD", "normalized": "$750,000 USD", "quote": "Total liability under this agreement shall not exceed $750,000 USD.", "page": 2, "status": "verified"},
            "governing_law": {"raw": "State of Illinois", "normalized": "Illinois", "quote": "This agreement is governed by the laws of the State of Illinois.", "page": 2, "status": "verified"},
            "volume_commitment": {"raw": "$350,000 USD per contract year", "normalized": "$350,000 USD per contract year", "quote": "Owner commits to a minimum spend of $350,000 USD per contract year for corporate campus maintenance.", "page": 4, "status": "verified"}
        }
    },
    {
        "id": "synthetic_08_consulting_msa_no_volume",
        "title": "Strategic Consulting Master Services Agreement (No Volume Commitment)",
        "filename": "synthetic_08_consulting_msa_no_volume.pdf",
        "category": "Consulting",
        "description": "Consulting engagement without volume commitment, capped at trailing 12 months fees, Massachusetts law.",
        "tags": ["consulting", "no-volume", "fees-paid-cap"],
        "pages_content": [
            [
                ("MASTER SERVICES AGREEMENT FOR STRATEGIC CONSULTING", "title"),
                ("SYNTHETIC BENCHMARK SPECIFICATION - CLAUSELENS", "subtitle"),
                ("By and between Beacon Advisory Partners LLC ('Consultant') and Highland BioMed Corp ('Client').", "body"),
                ("ARTICLE 1: SERVICES & WORK ORDERS", "h2"),
                ("1.1 Statements of Work. Consultant shall perform management consulting services pursuant to executed SOWs.", "body"),
                ("1.2 Term. The duration of this agreement is 24 months commencing July 1, 2024.", "body"),
                ("1.3 Non-Renewing. This Agreement shall not automatically renew and expires automatically at the end of the term.", "body"),
            ],
            [
                ("ARTICLE 2: COMPENSATION & INVOICES", "h2"),
                ("2.1 Rates. Professional hourly rates are set forth in Exhibit 1.", "body"),
                ("2.2 Payment Terms. Invoices shall be paid within thirty (30) days from the invoice issuance date.", "body"),
                ("2.3 Price Adjustment. Professional fees are firm and fixed for the 24 months initial term.", "body"),
                ("2.4 No Minimum Commitment. Client makes no volume commitment or promise of work volume under this Agreement.", "body"),
            ],
            [
                ("ARTICLE 3: TERMINATION AND LIABILITY", "h2"),
                ("3.1 Termination. Either party may terminate this agreement upon written notice of at least 30 days.", "body"),
                ("3.2 Liability Cap. Aggregate liability arising from any SOW shall not exceed fees paid in the preceding twelve months.", "body"),
                ("3.3 Governing Law. This Agreement shall be governed by the laws of the Commonwealth of Massachusetts.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "thirty (30) days", "normalized": 30, "quote": "Invoices shall be paid within thirty (30) days from the invoice issuance date.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "firm and fixed", "normalized": "fixed", "quote": "Professional fees are firm and fixed for the 24 months initial term.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "24 months", "normalized": "24 months", "quote": "The duration of this agreement is 24 months commencing July 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "shall not automatically renew", "normalized": "false", "quote": "This Agreement shall not automatically renew and expires automatically at the end of the term.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "30 days", "normalized": 30, "quote": "Either party may terminate this agreement upon written notice of at least 30 days.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "fees paid in the preceding twelve months", "normalized": "fees paid in the preceding twelve months", "quote": "Aggregate liability arising from any SOW shall not exceed fees paid in the preceding twelve months.", "page": 3, "status": "verified"},
            "governing_law": {"raw": "Commonwealth of Massachusetts", "normalized": "Massachusetts", "quote": "This Agreement shall be governed by the laws of the Commonwealth of Massachusetts.", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": None, "normalized": "none found", "quote": "Client makes no volume commitment or promise of work volume under this Agreement.", "page": 2, "status": "not_found"}
        }
    },
    {
        "id": "synthetic_09_telecom_bandwidth_sla",
        "title": "Enterprise Dedicated Bandwidth & Fiber Agreement",
        "filename": "synthetic_09_telecom_bandwidth_sla.pdf",
        "category": "Telecom",
        "description": "Telecom transport agreement with index-linked adjustments, 90 days termination notice, Washington law.",
        "tags": ["telecom", "index-linked", "SLA"],
        "pages_content": [
            [
                ("ENTERPRISE DEDICATED FIBER TRANSPORT AGREEMENT", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("Between Pacific Optical Networks Corp ('Carrier') and Cascade Data Systems ('Customer').", "body"),
                ("SECTION 1: NETWORK INFRASTRUCTURE", "h2"),
                ("1.1 Bandwidth Transit. Carrier provides dedicated optical Ethernet transport connecting primary data centers.", "body"),
                ("1.2 Contract Term. The initial term of this Agreement shall be 36 months starting August 1, 2024.", "body"),
                ("1.3 Auto-Renewal. The contract will automatically renew for consecutive 12-month periods.", "body"),
            ],
            [
                ("SECTION 2: CAPACITY COMMITMENT & CHARGES", "h2"),
                ("2.1 Volume Commitment. Customer commits to purchase at least 10 Gbps dedicated continuous throughput across the network.", "body"),
                ("2.2 Payment Terms. Customer will remit payment under Net 30 days terms from invoice dispatch.", "body"),
                ("2.3 Price Adjustment. After the first 12 months, circuit MRC rates are index-linked to the Producer Price Index (PPI).", "body"),
            ],
            [
                ("SECTION 3: DISCONNECTION AND INDEMNITY", "h2"),
                ("3.1 Termination Notice. Disconnection for convenience requires written notice of at least 90 days prior to effective date.", "body"),
                ("3.2 Liability Cap. Carrier's total aggregate liability for circuit interruption shall not exceed $3,000,000 USD.", "body"),
                ("3.3 Governing Law. This agreement is governed by the laws of the State of Washington.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 30 days", "normalized": 30, "quote": "Customer will remit payment under Net 30 days terms from invoice dispatch.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "Producer Price Index (PPI)", "normalized": "index-linked", "quote": "After the first 12 months, circuit MRC rates are index-linked to the Producer Price Index (PPI).", "page": 2, "status": "verified"},
            "contract_term": {"raw": "36 months", "normalized": "36 months", "quote": "The initial term of this Agreement shall be 36 months starting August 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "consecutive 12-month periods", "normalized": "true (12 months)", "quote": "The contract will automatically renew for consecutive 12-month periods.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "90 days", "normalized": 90, "quote": "Disconnection for convenience requires written notice of at least 90 days prior to effective date.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "$3,000,000 USD", "normalized": "$3,000,000 USD", "quote": "Carrier's total aggregate liability for circuit interruption shall not exceed $3,000,000 USD.", "page": 3, "status": "verified"},
            "governing_law": {"raw": "State of Washington", "normalized": "Washington", "quote": "This agreement is governed by the laws of the State of Washington.", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": "10 Gbps dedicated continuous throughput", "normalized": "10 Gbps dedicated continuous throughput", "quote": "Customer commits to purchase at least 10 Gbps dedicated continuous throughput across the network.", "page": 2, "status": "verified"}
        }
    },
    {
        "id": "synthetic_10_software_license_uncapped",
        "title": "Core Banking Software License (Uncapped Liability)",
        "filename": "synthetic_10_software_license_uncapped.pdf",
        "category": "Banking Software",
        "description": "Enterprise software license with an explicit uncapped liability clause and 120 days termination notice.",
        "tags": ["software", "uncapped", "banking"],
        "pages_content": [
            [
                ("CORE BANKING LEDGER SOFTWARE LICENSE AGREEMENT", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("By and between FinCore Software Solutions Inc ('Licensor') and Metropolitan Union Bank ('Licensee').", "body"),
                ("SECTION 1: GRANT OF LICENSE", "h2"),
                ("1.1 License. Licensor grants Licensee a perpetual enterprise core banking engine license.", "body"),
                ("1.2 Contract Term. The initial term of this Agreement shall be 60 months starting September 1, 2024.", "body"),
            ],
            [
                ("SECTION 2: ESCROW AND RENEWAL", "h2"),
                ("2.1 Auto-Renewal. The maintenance tier will automatically renew for successive 12-month periods.", "body"),
                ("2.2 Volume. No volume commitment is required under this site-wide deployment model.", "body"),
            ],
            [
                ("SECTION 3: FEES & ESCALATION", "h2"),
                ("3.1 Payment Terms. Payment shall be completed under Net 60 days from invoice generation.", "body"),
                ("3.2 Price Adjustment. Annual maintenance fees are subject to mutual agreement and renegotiated annually.", "body"),
                ("3.3 Termination. Either party may terminate maintenance upon written notice of at least 120 days.", "body"),
            ],
            [
                ("SECTION 4: UNLIMITED LIABILITY & JURISDICTION", "h2"),
                ("4.1 Liability Cap. Licensor agrees that aggregate liability is unlimited and uncapped liability applies for security breaches or ledger loss.", "body"),
                ("4.2 Governing Law. This Agreement is governed by the laws of the State of New York.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 60 days", "normalized": 60, "quote": "Payment shall be completed under Net 60 days from invoice generation.", "page": 3, "status": "verified"},
            "price_adjustment": {"raw": "renegotiated annually", "normalized": "renegotiable", "quote": "Annual maintenance fees are subject to mutual agreement and renegotiated annually.", "page": 3, "status": "verified"},
            "contract_term": {"raw": "60 months", "normalized": "60 months", "quote": "The initial term of this Agreement shall be 60 months starting September 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "successive 12-month periods", "normalized": "true (12 months)", "quote": "The maintenance tier will automatically renew for successive 12-month periods.", "page": 2, "status": "verified"},
            "termination_notice": {"raw": "120 days", "normalized": 120, "quote": "Either party may terminate maintenance upon written notice of at least 120 days.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "uncapped liability", "normalized": "uncapped", "quote": "Licensor agrees that aggregate liability is unlimited and uncapped liability applies for security breaches or ledger loss.", "page": 4, "status": "verified"},
            "governing_law": {"raw": "State of New York", "normalized": "New York", "quote": "This Agreement is governed by the laws of the State of New York.", "page": 4, "status": "verified"},
            "volume_commitment": {"raw": None, "normalized": "none found", "quote": "No volume commitment is required under this site-wide deployment model.", "page": 2, "status": "not_found"}
        }
    },
    {
        "id": "synthetic_11_catering_hospitality_short_term",
        "title": "Corporate Catering & Food Services (Short Term, Net 14)",
        "filename": "synthetic_11_catering_hospitality_short_term.pdf",
        "category": "Hospitality",
        "description": "Short-term food services contract with Net 14 payment terms, Colorado governing law, and 15 days termination notice.",
        "tags": ["short-term", "catering", "net-14"],
        "pages_content": [
            [
                ("CORPORATE CATERING SERVICES AGREEMENT", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("Entered into by Alpine Gourmet Catering LLC ('Caterer') and Summit Tech Campus ('Host').", "body"),
                ("SECTION 1: CATERING SERVICES & DURATION", "h2"),
                ("1.1 Services. Caterer shall operate the executive dining hall and daily luncheon stations.", "body"),
                ("1.2 Contract Term. The initial term of this Agreement shall be 6 months commencing October 1, 2024.", "body"),
                ("1.3 Non-Renewal. This contract shall not automatically renew and terminates upon conclusion of the 6-month term.", "body"),
                ("1.4 Volume Commitment. Host guarantees a minimum volume commitment of 500 meal covers per week.", "body"),
            ],
            [
                ("SECTION 2: REMITTANCE, ESCALATION & DISMISSAL", "h2"),
                ("2.1 Payment Terms. Caterer invoices weekly, and all invoices shall be paid within 14 days of receipt.", "body"),
                ("2.2 Price Adjustment. Menu pricing is firm and fixed for the entire 6-month term with no price increases.", "body"),
                ("2.3 Termination Notice. Host may cancel event services upon written notice of at least 15 days.", "body"),
                ("2.4 Liability Cap. Caterer's aggregate liability shall not exceed $100,000 USD for any food safety or property claims.", "body"),
                ("2.5 Governing Law. This agreement is governed by the laws of the State of Colorado.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "14 days", "normalized": 14, "quote": "Caterer invoices weekly, and all invoices shall be paid within 14 days of receipt.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": "firm and fixed", "normalized": "fixed", "quote": "Menu pricing is firm and fixed for the entire 6-month term with no price increases.", "page": 2, "status": "verified"},
            "contract_term": {"raw": "6 months", "normalized": "6 months", "quote": "The initial term of this Agreement shall be 6 months commencing October 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "shall not automatically renew", "normalized": "false", "quote": "This contract shall not automatically renew and terminates upon conclusion of the 6-month term.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "15 days", "normalized": 15, "quote": "Host may cancel event services upon written notice of at least 15 days.", "page": 2, "status": "verified"},
            "liability_cap": {"raw": "$100,000 USD", "normalized": "$100,000 USD", "quote": "Caterer's aggregate liability shall not exceed $100,000 USD for any food safety or property claims.", "page": 2, "status": "verified"},
            "governing_law": {"raw": "State of Colorado", "normalized": "Colorado", "quote": "This agreement is governed by the laws of the State of Colorado.", "page": 2, "status": "verified"},
            "volume_commitment": {"raw": "500 meal covers per week", "normalized": "500 meal covers per week", "quote": "Host guarantees a minimum volume commitment of 500 meal covers per week.", "page": 1, "status": "verified"}
        }
    },
    {
        "id": "synthetic_12_security_services_missing_adjustment",
        "title": "On-Site Physical Security Services (Missing Price Adjustment Clause)",
        "filename": "synthetic_12_security_services_missing_adjustment.pdf",
        "category": "Security",
        "description": "Security guarding agreement that is silent on price adjustment, with Georgia governing law and 45 days termination notice.",
        "tags": ["security", "silent-adjustment", "services"],
        "pages_content": [
            [
                ("ON-SITE PHYSICAL SECURITY SERVICES AGREEMENT", "title"),
                ("CONFIDENTIAL SYNTHETIC CONTRACT - CLAUSELENS BENCHMARK", "subtitle"),
                ("By and between Sentinel Protective Services Corp ('Contractor') and Logistics Hub Georgia LLC ('Client').", "body"),
                ("SECTION 1: GUARDING SCHEDULE & DURATION", "h2"),
                ("1.1 Guarding. Contractor shall staff 24/7 security gatehouses and mobile perimeter patrols.", "body"),
                ("1.2 Contract Term. The initial term of this Agreement shall be 24 months beginning November 1, 2024.", "body"),
                ("1.3 Auto-Renewal. The contract will automatically renew for successive 12-month periods.", "body"),
            ],
            [
                ("SECTION 2: BILLING AND VOLUME COMMITMENTS", "h2"),
                ("2.1 Volume Commitment. Client agrees to a minimum volume commitment of 1,200 patrol hours per month.", "body"),
                ("2.2 Payment Terms. Client will settle all charges under payment terms of Net 30 days from invoice receipt.", "body"),
                ("2.3 Price Adjustment. [NOTE: The agreement contains no price adjustment or price escalation clause; fees remain as scheduled.]", "body"),
            ],
            [
                ("SECTION 3: LIABILITY, TERMINATION & JURISDICTION", "h2"),
                ("3.1 Termination Notice. Either party may terminate this agreement upon written notice of at least 45 days.", "body"),
                ("3.2 Liability Cap. Aggregate liability under this contract shall not exceed $2,000,000 USD.", "body"),
                ("3.3 Governing Law. This agreement is governed by the laws of the State of Georgia.", "body"),
            ]
        ],
        "ground_truth": {
            "payment_terms": {"raw": "Net 30 days", "normalized": 30, "quote": "Client will settle all charges under payment terms of Net 30 days from invoice receipt.", "page": 2, "status": "verified"},
            "price_adjustment": {"raw": None, "normalized": "none found", "quote": None, "page": None, "status": "not_found"},
            "contract_term": {"raw": "24 months", "normalized": "24 months", "quote": "The initial term of this Agreement shall be 24 months beginning November 1, 2024.", "page": 1, "status": "verified"},
            "auto_renewal": {"raw": "successive 12-month periods", "normalized": "true (12 months)", "quote": "The contract will automatically renew for successive 12-month periods.", "page": 1, "status": "verified"},
            "termination_notice": {"raw": "45 days", "normalized": 45, "quote": "Either party may terminate this agreement upon written notice of at least 45 days.", "page": 3, "status": "verified"},
            "liability_cap": {"raw": "$2,000,000 USD", "normalized": "$2,000,000 USD", "quote": "Aggregate liability under this contract shall not exceed $2,000,000 USD.", "page": 3, "status": "verified"},
            "governing_law": {"raw": "State of Georgia", "normalized": "Georgia", "quote": "This agreement is governed by the laws of the State of Georgia.", "page": 3, "status": "verified"},
            "volume_commitment": {"raw": "1,200 patrol hours per month", "normalized": "1,200 patrol hours per month", "quote": "Client agrees to a minimum volume commitment of 1,200 patrol hours per month.", "page": 2, "status": "verified"}
        }
    }
]

def build_pdf(spec: dict, filepath: str):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        "ContractTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1e1b4b"),
        alignment=0,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        "ContractSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#4338ca"),
        spaceAfter=14
    )
    
    h2_style = ParagraphStyle(
        "ContractH2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#312e81"),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        "ContractBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=8
    )

    story = []
    num_pages = len(spec["pages_content"])
    
    for page_idx, page_items in enumerate(spec["pages_content"]):
        # Add synthetic badge header
        header_text = f"CLAUSELENS SYNTHETIC CONTRACT BENCHMARK - {spec['id'].upper()} - PAGE {page_idx + 1} OF {num_pages}"
        story.append(Paragraph(f"<font size='7' color='#6b7280'><b>{header_text}</b></font>", body_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e5e7eb"), spaceAfter=10))
        
        for text, style_key in page_items:
            if style_key == "title":
                story.append(Paragraph(text, title_style))
            elif style_key == "subtitle":
                story.append(Paragraph(text, subtitle_style))
            elif style_key == "h2":
                story.append(Paragraph(text, h2_style))
            else:
                story.append(Paragraph(text, body_style))
                
        # Footer
        story.append(Spacer(1, 15))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e5e7eb"), spaceBefore=10, spaceAfter=6))
        story.append(Paragraph(f"<font size='7' color='#9ca3af'>ClauseLens Synthetic Supplier Contract • Not legal advice • Page {page_idx + 1}</font>", body_style))
        
        if page_idx < num_pages - 1:
            story.append(PageBreak())

    doc.build(story)

def main():
    print(f"Generating {len(CONTRACT_SPECS)} synthetic contracts...")
    for spec in CONTRACT_SPECS:
        pdf_path = os.path.join(OUTPUT_PDF_DIR, spec["filename"])
        gt_path = os.path.join(OUTPUT_GT_DIR, f"{spec['id']}.json")
        
        # Build PDF
        build_pdf(spec, pdf_path)
        print(f"Generated PDF: {pdf_path}")
        
        # Save Ground Truth
        gt_data = {
            "id": spec["id"],
            "title": spec["title"],
            "filename": spec["filename"],
            "category": spec["category"],
            "description": spec["description"],
            "tags": spec["tags"],
            "num_pages": len(spec["pages_content"]),
            "ground_truth": spec["ground_truth"]
        }
        with open(gt_path, "w", encoding="utf-8") as f:
            json.dump(gt_data, f, indent=2, ensure_ascii=False)
        print(f"Saved Ground Truth: {gt_path}")
        
    print("Done generating all 12 synthetic contracts!")

if __name__ == "__main__":
    main()
