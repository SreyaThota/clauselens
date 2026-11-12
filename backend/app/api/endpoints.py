from __future__ import annotations
import os
import json
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from ..pipeline.schemas import (
    ExtractionResult,
    SampleContractMeta,
    EvaluationReport
)
from ..pipeline.runner import run_extraction_pipeline
from ..pipeline.extractor import extract_text_from_pdf_file

router = APIRouter(prefix="/api")

CONTRACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/contracts"))
GROUND_TRUTH_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/ground_truth"))
EVAL_RESULTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../eval/results"))

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ClauseLens API",
        "version": "1.0.0",
        "demo_mode": os.getenv("DEMO_MODE", "false").lower() in ("true", "1")
    }

@router.post("/extract", response_model=ExtractionResult)
async def extract_contract_terms(file: UploadFile = File(...)):
    """
    Extracts commercial terms from an uploaded PDF contract.
    Executes: PDF parsing -> chunking -> LLM extraction -> Grounding check -> Normalization.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        contract_id = f"upload_{os.path.splitext(file.filename)[0]}"
        result = await run_extraction_pipeline(
            pdf_bytes=content,
            filename=file.filename,
            contract_id=contract_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.get("/samples", response_model=List[SampleContractMeta])
async def list_sample_contracts():
    """
    Returns list of bundled benchmark contracts for demo mode.
    """
    samples: List[SampleContractMeta] = []
    if not os.path.exists(GROUND_TRUTH_DIR):
        return samples

    for fname in sorted(os.listdir(GROUND_TRUTH_DIR)):
        if fname.endswith(".json"):
            gt_path = os.path.join(GROUND_TRUTH_DIR, fname)
            try:
                with open(gt_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    gt_fields = data.get("ground_truth", {})
                    v_count = sum(1 for f in gt_fields.values() if f.get("status") == "verified")
                    nr_count = sum(1 for f in gt_fields.values() if f.get("status") == "needs_review")
                    nf_count = sum(1 for f in gt_fields.values() if f.get("status") == "not_found")
                    
                    samples.append(SampleContractMeta(
                        id=data["id"],
                        name=data["title"],
                        description=data["description"],
                        category=data["category"],
                        filename=data["filename"],
                        num_pages=data["num_pages"],
                        tags=data.get("tags", []),
                        verified_count=v_count,
                        needs_review_count=nr_count,
                        not_found_count=nf_count
                    ))
            except Exception:
                continue

    return samples

@router.get("/samples/{contract_id}", response_model=ExtractionResult)
async def get_sample_contract_result(contract_id: str):
    """
    Returns the extraction result for a bundled sample contract.
    Loads cached or runs pipeline on the bundled PDF.
    """
    gt_file = os.path.join(GROUND_TRUTH_DIR, f"{contract_id}.json")
    if not os.path.exists(gt_file):
        raise HTTPException(status_code=404, detail="Sample contract not found.")

    with open(gt_file, "r", encoding="utf-8") as f:
        gt_data = json.load(f)

    pdf_filename = gt_data["filename"]
    pdf_path = os.path.join(CONTRACTS_DIR, pdf_filename)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Sample PDF file missing on disk.")

    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    result = await run_extraction_pipeline(
        pdf_bytes=pdf_bytes,
        filename=pdf_filename,
        contract_id=contract_id
    )
    return result

@router.get("/samples/{contract_id}/pdf")
async def get_sample_contract_pdf(contract_id: str):
    """
    Streams the raw PDF file for inline browser viewing.
    """
    gt_file = os.path.join(GROUND_TRUTH_DIR, f"{contract_id}.json")
    if not os.path.exists(gt_file):
        raise HTTPException(status_code=404, detail="Sample contract not found.")

    with open(gt_file, "r", encoding="utf-8") as f:
        gt_data = json.load(f)

    pdf_filename = gt_data["filename"]
    pdf_path = os.path.join(CONTRACTS_DIR, pdf_filename)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found.")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=pdf_filename
    )

@router.get("/eval", response_model=EvaluationReport)
async def get_evaluation_metrics():
    """
    Returns the latest evaluation report from eval/results/latest.json.
    """
    report_file = os.path.join(EVAL_RESULTS_DIR, "latest.json")
    if not os.path.exists(report_file):
        raise HTTPException(
            status_code=404,
            detail="Evaluation results have not been generated yet. Run python eval/run_eval.py first."
        )

    with open(report_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data

