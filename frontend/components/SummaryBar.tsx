'use client';

import React from 'react';
import Link from 'next/link';
import { ExtractionSummary, ExtractionResult } from '../lib/types';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  Clock,
  Download
} from 'lucide-react';

interface SummaryBarProps {
  summary: ExtractionSummary;
  filename: string;
  result: ExtractionResult;
}

export default function SummaryBar({ summary, filename, result }: SummaryBarProps) {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${filename.replace('.pdf', '')}_extracted_terms.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back Link & Document Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition"
            title="Contract picker"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A] truncate max-w-xs sm:max-w-md">
                {filename}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Demo
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {result.num_pages} {result.num_pages === 1 ? 'Page' : 'Pages'} • Verbatim grounding checked
            </p>
          </div>
        </div>

        {/* Center: Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-[#0D9488] text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
            <span>Verified:</span>
            <span className="font-bold">
              {summary.verified_count} / {summary.total_fields}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              summary.needs_review_count > 0
                ? 'bg-amber-50 border border-amber-300 text-[#D97706]'
                : 'bg-slate-100 border border-slate-200 text-slate-600'
            }`}
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                summary.needs_review_count > 0 ? 'text-[#D97706]' : 'text-slate-400'
              }`}
            />
            <span>Needs Review:</span>
            <span className="font-bold">{summary.needs_review_count}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <MinusCircle className="h-4 w-4 text-slate-400" />
            <span>Not Found:</span>
            <span className="font-bold text-[#0F172A]">{summary.not_found_count}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{summary.processing_time_ms} ms</span>
          </div>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 text-xs font-medium transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}
