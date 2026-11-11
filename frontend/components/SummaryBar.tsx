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
  Coins,
  Download,
  Share2
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
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back Link & Document Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Upload another contract"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {filename}
              </h2>
              {result.demo_mode && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Demo Contract
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {result.num_pages} {result.num_pages === 1 ? 'Page' : 'Pages'} Analyzed • Grounding check complete
            </p>
          </div>
        </div>

        {/* Center: Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Verified:</span>
            <span className="font-bold text-emerald-950">
              {summary.verified_count} / {summary.total_fields}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              summary.needs_review_count > 0
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-slate-50 border border-slate-200 text-slate-600'
            }`}
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                summary.needs_review_count > 0 ? 'text-amber-600' : 'text-slate-400'
              }`}
            />
            <span>Needs Review:</span>
            <span className="font-bold">{summary.needs_review_count}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
            <MinusCircle className="h-4 w-4 text-slate-400" />
            <span>Not Found:</span>
            <span className="font-bold text-slate-900">{summary.not_found_count}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{summary.processing_time_ms} ms</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs">
            <Coins className="h-3.5 w-3.5 text-slate-400" />
            <span>${summary.estimated_cost_usd.toFixed(5)}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
