import { ExtractionResult, SampleContractMeta, EvaluationReport } from './types';
import { MOCK_SAMPLES, MOCK_RESULTS, MOCK_EVALUATION_REPORT } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getSampleContracts(): Promise<SampleContractMeta[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/samples`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, using offline demo samples fallback:', err);
  }
  return MOCK_SAMPLES;
}

export async function getSampleResult(contractId: string): Promise<ExtractionResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/samples/${contractId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Backend unreachable for sample ${contractId}, using demo mode:`, err);
  }

  // Fallback to pre-cached results
  if (MOCK_RESULTS[contractId]) {
    // Return a clone to allow local edits
    return JSON.parse(JSON.stringify(MOCK_RESULTS[contractId]));
  }
  throw new Error(`Sample contract ${contractId} not found.`);
}

export async function extractContractFile(file: File): Promise<ExtractionResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/extract`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Extraction failed on server.');
  } catch (err: any) {
    console.warn('Backend extraction error:', err);
    throw new Error(err.message || 'Unable to connect to extraction server.');
  }
}

export async function getEvaluationReport(): Promise<EvaluationReport> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/eval`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable for eval, using latest cached eval metrics:', err);
  }
  return MOCK_EVALUATION_REPORT;
}

