"""
Generates frontend/lib/mockData.ts containing:
- MOCK_SAMPLES metadata
- MOCK_EXTRACTION_RESULTS for all 12 contracts
- MOCK_EVALUATION_REPORT
This allows zero-latency instant demo mode, offline operation, and seamless fallback.
"""
import os
import sys
import json
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.pipeline.runner import run_extraction_pipeline

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data"))
CONTRACTS_DIR = os.path.join(DATA_DIR, "contracts")
GROUND_TRUTH_DIR = os.path.join(DATA_DIR, "ground_truth")
EVAL_RESULTS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../eval/results/latest.json"))
FRONTEND_MOCK_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/lib/mockData.ts"))

async def generate():
    with open(EVAL_RESULTS_FILE, "r", encoding="utf-8") as f:
        eval_report = json.load(f)

    gt_files = sorted([f for f in os.listdir(GROUND_TRUTH_DIR) if f.endswith(".json")])
    samples_list = []
    results_map = {}

    for fname in gt_files:
        gt_path = os.path.join(GROUND_TRUTH_DIR, fname)
        with open(gt_path, "r", encoding="utf-8") as f:
            gt_data = json.load(f)

        contract_id = gt_data["id"]
        pdf_filename = gt_data["filename"]
        pdf_path = os.path.join(CONTRACTS_DIR, pdf_filename)
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()

        res = await run_extraction_pipeline(pdf_bytes, pdf_filename, contract_id)
        res_dict = res.model_dump()
        res_dict["demo_mode"] = True
        results_map[contract_id] = res_dict

        v_count = res.summary.verified_count
        nr_count = res.summary.needs_review_count
        nf_count = res.summary.not_found_count

        samples_list.append({
            "id": contract_id,
            "name": gt_data["title"],
            "description": gt_data["description"],
            "category": gt_data["category"],
            "filename": pdf_filename,
            "num_pages": gt_data["num_pages"],
            "tags": gt_data.get("tags", []),
            "verified_count": v_count,
            "needs_review_count": nr_count,
            "not_found_count": nf_count
        })

    ts_content = f"""import {{ SampleContractMeta, ExtractionResult, EvaluationReport }} from './types';

export const MOCK_EVALUATION_REPORT: EvaluationReport = {json.dumps(eval_report, indent=2)};

export const MOCK_SAMPLES: SampleContractMeta[] = {json.dumps(samples_list, indent=2)};

export const MOCK_RESULTS: Record<string, ExtractionResult> = {json.dumps(results_map, indent=2)};
"""

    os.makedirs(os.path.dirname(FRONTEND_MOCK_FILE), exist_ok=True)
    with open(FRONTEND_MOCK_FILE, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Generated {FRONTEND_MOCK_FILE} with {len(samples_list)} contracts and evaluation report.")

if __name__ == "__main__":
    asyncio.run(generate())
