import { ExtractionResult, SampleContractMeta, EvaluationReport } from './types';
import { MOCK_SAMPLES, MOCK_RESULTS, MOCK_EVALUATION_REPORT } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function getSampleContracts(): Promise<SampleContractMeta[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/samples`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }
  }
  return MOCK_SAMPLES;
}

export async function getSampleResult(contractId: string): Promise<ExtractionResult> {
  // Check exact match or prefix match in pre-rendered results
  let match = MOCK_RESULTS[contractId];
  if (!match) {
    const entry = Object.entries(MOCK_RESULTS).find(
      ([key]) => key === contractId || key.startsWith(contractId + '_') || contractId.startsWith(key + '_')
    );
    if (entry) {
      match = entry[1];
    }
  }

  if (match) {
    return JSON.parse(JSON.stringify(match));
  }

  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/samples/${contractId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }
  }

  throw new Error(`Sample contract ${contractId} not found.`);
}

export async function extractContractFile(file: File): Promise<ExtractionResult> {
  if (!API_BASE_URL) {
    throw new Error('Upload runs on the local backend. This demo uses 18 pre-evaluated contracts.');
  }

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
}

export async function getEvaluationReport(): Promise<EvaluationReport> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/eval`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }
  }
  return MOCK_EVALUATION_REPORT;
}
