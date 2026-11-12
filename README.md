# ClauseLens: Contract Terms You Can Verify

ClauseLens is an open-source commercial contract intelligence system that automatically extracts 8 high-stakes commercial terms from supplier PDF agreements, including payment terms, liability caps, price adjustments, volume commitments, and auto-renewals. Every extraction is backed by an automated code-level RapidFuzz grounding check against the exact cited page, capping ungrounded confidence at ≤ 0.40 and routing discrepancies to an actionable human review queue with transparent evaluation benchmarks.

---

## Visual Walkthrough & Key Interfaces

### 1. Home Document Selector & 20-Second Trust Demo (`/`)

```
+-------------------------------------------------------------------------------------------------------------+
| [Shield] ClauseLens v1.0         Extractor         Evaluation Benchmark       [• Demo Mode Ready]   [/eval] |
+-------------------------------------------------------------------------------------------------------------+
| Drop your supplier contract PDF here                                                                        |
| [ Select PDF File ]                                                                                         |
|                                                                                                             |
| [🚀 20s Trust Demo] Conflicting Clauses: See red "Needs Review" flag, confidence <= 40%, and 1-click verify |
| [Launch Demo ->]                                                                                            |
|                                                                                                             |
| SAMPLE EVALUATION DATASET (18 Synthetic Contracts)                                                          |
| +------------------------------------+ +------------------------------------+ +---------------------------+ |
| | Master IT Managed Services         | | Heavy Machinery Lease              | | Chemical Drums Offtake    | |
| | IT & Software • 3 Pages            | | Heavy Equipment • 3 Pages          | | Manufacturing • 3 Pages   | |
| | [8 Verified] [0 Review]            | | [7 Verified] [0 Review]            | | [5 Verified] [0 Review]   | |
| +------------------------------------+ +------------------------------------+ +---------------------------+ |
+-------------------------------------------------------------------------------------------------------------+
```

### 2. Document Reader & Trust Layer with Needs Review Flag (`/results/synthetic_06_conflicting_clauses_materials`)

```
+-------------------------------------------------------------------------------------------------------------+
| [<- Back] synthetic_06_conflicting_clauses_materials.pdf  [Verified: 7/8]  [Needs Review: 1]  [6.15ms]  [$0]|
+-----------------------------------------------------+-------------------------------------------------------+
| DOCUMENT VIEWER (Page 3 of 3)                       | EXTRACTED COMMERCIAL TERMS                            |
|                                                     |                                                       |
| SECTION 5: SPECIAL PROVISIONS & OVERRIDES           | [Liability Cap]                     [Needs Review ⚠]  |
|                                                     | Normalized: uncapped                      Conf: 38%   |
| 5.1 Breach Liability Override.                      | [====================>................]               |
| >>Notwithstanding any provision to the contrary in  | ----------------------------------------------------- |
| Section 3.1, Seller liability is unlimited and      | [!] Human Review Flag: Conflicting clauses across p2  |
| uncapped liability applies for breach of delivery   |     and p3 ($500,000 USD cap vs unlimited breach).    |
| or product recalls.<<                               | Exact Quote (Page 3):                                 |
|                                                     | "Notwithstanding any provision to the contrary in...  |
|                                                     | Citation: Page 3 (Grounding Verified: 1.00 Exact)     |
|                                                     |                                                       |
|                                                     | [ ✓ Approve Term ]     [ ✎ Correct / Edit Value ]     |
|                                                     |                                                       |
|                                                     | [Commercial Negotiation Levers]                       |
|                                                     | • High Risk: Uncapped breach liability detected       |
+-----------------------------------------------------+-------------------------------------------------------+
```

### 3. Evaluation & Verification Benchmark Dashboard (`/eval`)

```
+-------------------------------------------------------------------------------------------------------------+
| Evaluation Benchmark • 18 Synthetic Contracts • Real Measured Execution                                     |
| "Synthetic contracts, 18 documents. Results show the pipeline end to end, not that extraction is solved."  |
+-------------------------------------------------------------------------------------------------------------+
| [ Accuracy ]    [ Grounding ]   [ NF Precision ]   [ NF Recall ]   [ Review Rate ]  [ Latency ]  [ Cost ]   |
|    86.8%            99.1%            33.3%            100.0%             0.7%         6.15 ms    $0.00000   |
+-------------------------------------------------------------------------------------------------------------+
| PIPELINE COMPARISON                                                                                         |
| Engine                       Accuracy  Grounding  NF Prec  NF Recall  Review  Latency  Cost/Doc  Status     |
| Deterministic Baseline (Off)    86.8%      99.1%    33.3%     100.0%    0.7%   6.15ms  $0.00000  Evaluated  |
| LLM Pipeline (Gemini/OpenAI)        —          —        —          —       —        —         —  not run*   |
| *No API key configured in environment. Deterministic baseline evaluated across all 18 documents.            |
+-------------------------------------------------------------------------------------------------------------+
| WHERE IT FAILS (Top Real Misses by Severity)                                                                |
| • synthetic_13 (liability_cap): Expected 'uncapped for gross negligence', got '250,000 EUR' (override miss) |
| • synthetic_16 (volume_commitment): Expected range '4,000 to 6,000', got 'none found' (word/range format)   |
| • synthetic_15 (governing_law): Expected 'Germany', got 'none found' (split-clause & London court clash)    |
| • synthetic_17 (auto_renewal): Expected 'conditional opt-in', got 'none found' (conditional carve-out)      |
+-------------------------------------------------------------------------------------------------------------+
```

---

## Results

Evaluation conducted against **18 hand-written, frozen synthetic contracts** (144 evaluated fields) in `data/ground_truth/*.json`. Each ground truth record contains a cryptographic SHA256 integrity checksum. Results are copied directly from `eval/results/latest.json`.

*Model Under Test: Deterministic rule-based baseline (offline mode, no API key)*

| Field Name | Extraction Accuracy | Grounding Rate | Not-Found Precision | Not-Found Recall | Review Rate |
|---|---|---|---|---|---|
| `payment_terms` | **100.0%** | 100.0% | 100.0% | 100.0% | 0.0% |
| `price_adjustment` | **100.0%** | 100.0% | 100.0% | 100.0% | 0.0% |
| `contract_term` | **72.2%** | 100.0% | 0.0% | 100.0% | 0.0% |
| `auto_renewal` | **88.9%** | 100.0% | 33.3% | 100.0% | 0.0% |
| `termination_notice` | **83.3%** | 100.0% | 0.0% | 100.0% | 0.0% |
| `liability_cap` | **83.3%** | 92.9% | 50.0% | 100.0% | 5.6% |
| `governing_law` | **77.8%** | 100.0% | 0.0% | 100.0% | 0.0% |
| `volume_commitment` | **88.9%** | 100.0% | 66.7% | 100.0% | 0.0% |
| **Overall Dataset** | **86.8%** | **99.1%** | **33.3%** | **100.0%** | **0.7%** |

### Execution Metrics
- **Total Evaluated Contracts:** 18 documents (144 commercial fields)
- **Overall Normalization Accuracy:** 86.8%
- **Verbatim Grounding Rate:** 99.1% (RapidFuzz ratio ≥ 0.90 against cited page)
- **Not-Found Precision:** 33.3% ($TP / [TP + FP]$)
- **Not-Found Recall:** 100.0% ($TP / [TP + FN]$)
- **Human Review Flag Rate:** 0.7% (confidence < 0.75 or grounding mismatch)
- **Average Measured Latency:** 6.15 ms per document
- **Average Cost:** $0.00000 USD (offline execution)
- **Real-LLM Step 4:** Skipped because neither `GEMINI_API_KEY` nor `OPENAI_API_KEY` is configured in the environment.

---

## Limitations

> **"Synthetic contracts, 18 documents. Results show the pipeline end to end, not that extraction is solved."**

1. **Deterministic Rule-Based Baseline:** The primary evaluation engine relies on pattern matching, regex heuristics, and AST normalization. While fast (6.15 ms) and free ($0.00), it lacks hierarchical legal reasoning to resolve clause precedence across multiple sections.
2. **Synthetic Data Boundaries:** While contracts 13 to 18 introduce contradictory overrides, annex schedules, split syntax, verbal numbers, and sparse documents, synthetic contracts cannot fully replicate the OCR degradation, scan artifacts, margin stamps, and idiosyncratic drafting of arbitrary real-world vendor contracts.
3. **Where It Fails (Top Real Benchmark Misses):**
   - **Contradictory Liability Cap Override (`synthetic_13`):** Section 4.1 specifies a 250,000 EUR cap, but Section 8.4 on page 3 states liability for gross negligence is uncapped. The baseline extracted `250,000 EUR`, ignoring the override clause.
   - **Verbal Volume & Range (`synthetic_16`):** The volume commitment is phrased in words (*"five thousand units"*) with an operational batch range (*"between 4.000 and 6.000"*). The baseline digit pattern failed to parse both.
   - **Split Governing Law & Separate Forum (`synthetic_15`):** The governing law clause is broken across two sentences (*"governed by. It is expressly agreed that the governing law shall be the laws of Germany"*), while the jurisdiction clause selects the High Court in London, England. The split syntax was missed.
   - **Conditional Auto-Renewal (`synthetic_17`):** The clause renews automatically unless 90 days notice is given, *except* in the first term where affirmative opt-in is required. The baseline extractor collapsed the conditional exception into not found.
   - **Informal & Sparse Letter Agreement (`synthetic_18`):** Unnumbered letter agreement structure missed standard section-based cues, resulting in omissions for duration and notice.

---

## Run It

Run ClauseLens in 3 commands:

```bash
# 1. Install frontend and backend dependencies
npm install --prefix frontend && python -m venv backend/venv && backend/venv/bin/pip install -r backend/requirements.txt

# 2. Run the evaluation benchmark across all 18 contracts
backend/venv/bin/python eval/run_eval.py

# 3. Start development servers (FastAPI backend + Next.js frontend)
backend/venv/bin/python -m uvicorn backend.app.main:app --port 8000 & npm run dev --prefix frontend
```

*(On Windows PowerShell, use `backend\venv\Scripts\pip install -r backend\requirements.txt` and `backend\venv\Scripts\python eval\run_eval.py`)*

### Offline Demo Mode
ClauseLens works completely offline out of the box with zero external API dependencies. All 18 benchmark contracts and evaluation reports are pre-compiled into `frontend/lib/mockData.ts`. Set `DEMO_MODE=true` or leave API keys unset to run instant zero-latency demonstrations. To benchmark against live models, export `GEMINI_API_KEY` or `OPENAI_API_KEY`.
