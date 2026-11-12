'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import SummaryBar from '../../../components/SummaryBar';
import PdfTextViewer from '../../../components/PdfTextViewer';
import FieldCard from '../../../components/FieldCard';
import NegotiationLeversPanel from '../../../components/NegotiationLeversPanel';
import { ExtractionResult, ExtractedField } from '../../../lib/types';
import { getSampleResult } from '../../../lib/api';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MinusCircle
} from 'lucide-react';

interface ResultsClientProps {
  contractId: string;
}

export default function ResultsClient({ contractId }: ResultsClientProps) {
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('liability_cap');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'needs_review' | 'not_found'>('all');

  useEffect(() => {
    if (!contractId) return;

    // Check if uploaded contract stored in sessionStorage
    if (contractId.startsWith('upload_')) {
      const stored = sessionStorage.getItem(contractId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setResult(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }

    setLoading(true);
    getSampleResult(contractId)
      .then((data) => {
        setResult(data);
        // Default to a needs_review field if one exists
        const reviewField = Object.entries(data.fields).find(([_, f]) => f.status === 'needs_review');
        if (reviewField) {
          setSelectedFieldKey(reviewField[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load extraction results.');
        setLoading(false);
      });
  }, [contractId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <Loader2 className="h-8 w-8 text-[#0D9488] animate-spin" />
          <h3 className="text-base font-bold text-[#0F172A]">Loading extraction result...</h3>
          <p className="text-xs text-slate-500">Checking grounding verification and field confidence</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">Document Result Unavailable</h3>
          <p className="text-xs text-slate-600">{error || 'Could not locate document extraction data.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0D9488] text-white text-xs font-semibold hover:bg-teal-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contract Picker
          </Link>
        </div>
      </div>
    );
  }

  // Handle local in-place update (Approve/Edit)
  const handleUpdateField = (updated: ExtractedField) => {
    const updatedFields = { ...result.fields, [updated.field_name]: updated };

    const verified = Object.values(updatedFields).filter((f) => f.status === 'verified').length;
    const needsReview = Object.values(updatedFields).filter((f) => f.status === 'needs_review').length;
    const notFound = Object.values(updatedFields).filter((f) => f.status === 'not_found').length;

    setResult({
      ...result,
      fields: updatedFields,
      summary: {
        ...result.summary,
        verified_count: verified,
        needs_review_count: needsReview,
        not_found_count: notFound
      }
    });
  };

  const selectedField = result.fields[selectedFieldKey];
  const fieldList = Object.entries(result.fields);

  const filteredFieldList = fieldList.filter(([_, f]) => {
    if (statusFilter === 'all') return true;
    return f.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-[#0F172A]">
      <Navbar />

      <SummaryBar
        summary={result.summary}
        filename={result.filename}
        result={result}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
          {/* Left Column: Interactive PDF Viewer & Citation Highlighter */}
          <div className="lg:col-span-7 h-full">
            <PdfTextViewer
              pages={result.pages}
              filename={result.filename}
              contractId={result.contract_id}
              selectedQuote={selectedField?.source_quote}
              selectedPage={selectedField?.page}
            />
          </div>

          {/* Right Column: Extracted Field Cards & Negotiation Levers */}
          <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto pr-1 space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    statusFilter === 'all'
                      ? 'bg-[#0F172A] text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({fieldList.length})
                </button>
                <button
                  onClick={() => setStatusFilter('verified')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    statusFilter === 'verified'
                      ? 'bg-[#0D9488] text-white'
                      : 'text-[#0D9488] hover:bg-teal-50'
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Verified ({result.summary.verified_count})
                </button>
                <button
                  onClick={() => setStatusFilter('needs_review')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    statusFilter === 'needs_review'
                      ? 'bg-[#D97706] text-white'
                      : 'text-[#D97706] hover:bg-amber-50'
                  }`}
                >
                  <AlertTriangle className="h-3 w-3" />
                  Review ({result.summary.needs_review_count})
                </button>
                <button
                  onClick={() => setStatusFilter('not_found')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    statusFilter === 'not_found'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MinusCircle className="h-3 w-3" />
                  None ({result.summary.not_found_count})
                </button>
              </div>
            </div>

            {/* Extracted Fields List */}
            <div className="space-y-3 flex-1">
              {filteredFieldList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                  No fields match the selected filter.
                </div>
              ) : (
                filteredFieldList.map(([key, field]) => (
                  <FieldCard
                    key={key}
                    field={field}
                    isSelected={selectedFieldKey === key}
                    onSelect={() => setSelectedFieldKey(key)}
                    onUpdateField={handleUpdateField}
                  />
                ))
              )}
            </div>

            {/* Negotiation Levers Panel */}
            <div className="pt-2">
              <NegotiationLeversPanel levers={result.negotiation_levers} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
