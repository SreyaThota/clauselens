'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PageText } from '../lib/types';
import { FileText, Search, ChevronLeft, ChevronRight, ExternalLink, Copy, Check } from 'lucide-react';

interface PdfTextViewerProps {
  pages: PageText[];
  filename: string;
  contractId: string;
  selectedQuote?: string | null;
  selectedPage?: number | null;
}

export default function PdfTextViewer({
  pages,
  filename,
  contractId,
  selectedQuote,
  selectedPage
}: PdfTextViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  // Jump to page if user clicked a field on another page
  useEffect(() => {
    if (selectedPage && selectedPage >= 1 && selectedPage <= pages.length) {
      setCurrentPage(selectedPage);
    }
  }, [selectedPage]);

  // Scroll to highlighted text when quote changes
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedQuote, currentPage]);

  const activePageObj = pages.find((p) => p.page_number === currentPage) || pages[0];

  const handleCopy = () => {
    if (activePageObj) {
      navigator.clipboard.writeText(activePageObj.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to render page text with the selected quote highlighted
  const renderHighlightedContent = (text: string, quote?: string | null) => {
    if (!quote || !quote.trim()) {
      return <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm">{text}</div>;
    }

    const cleanQuote = quote.trim();
    const cleanLower = cleanQuote.toLowerCase();
    const textLower = text.toLowerCase();
    const idx = textLower.indexOf(cleanLower);

    if (idx === -1) {
      // If exact substring isn't found due to minor whitespace, try matching first 25 chars
      const prefix = cleanQuote.slice(0, Math.min(25, cleanQuote.length)).toLowerCase();
      const pIdx = textLower.indexOf(prefix);
      if (pIdx !== -1) {
        const before = text.slice(0, pIdx);
        const match = text.slice(pIdx, pIdx + cleanQuote.length);
        const after = text.slice(pIdx + cleanQuote.length);
        return (
          <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm">
            {before}
            <mark
              ref={highlightRef}
              className="bg-indigo-100 text-indigo-950 font-medium px-1 py-0.5 rounded border border-indigo-300 ring-2 ring-indigo-400"
            >
              {match}
            </mark>
            {after}
          </div>
        );
      }
      return <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm">{text}</div>;
    }

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + cleanQuote.length);
    const after = text.slice(idx + cleanQuote.length);

    return (
      <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm">
        {before}
        <mark
          ref={highlightRef}
          className="bg-indigo-100 text-indigo-950 font-medium px-1.5 py-0.5 rounded border border-indigo-300 ring-2 ring-indigo-400 shadow-sm"
        >
          {match}
        </mark>
        {after}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Document Top Bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-900 truncate" title={filename}>
            {filename}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
            {pages.length} {pages.length === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition"
            title="Copy page text"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Page'}</span>
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {pages.map((p) => {
            const isSelected = p.page_number === currentPage;
            const hasQuote = selectedPage === p.page_number;
            return (
              <button
                key={p.page_number}
                onClick={() => setCurrentPage(p.page_number)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition relative ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Page {p.page_number}
                {hasQuote && !isSelected && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            {currentPage} / {pages.length}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(pages.length, prev + 1))}
            disabled={currentPage >= pages.length}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected Quote Banner */}
      {selectedQuote && (
        <div className="bg-indigo-50/90 border-b border-indigo-200 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="font-semibold text-indigo-900">Locating Citation:</span>
            <span className="text-indigo-700 truncate italic">&quot;{selectedQuote}&quot;</span>
          </div>
          <span className="font-bold text-indigo-800 text-[11px] shrink-0 ml-2">
            Page {selectedPage || currentPage}
          </span>
        </div>
      )}

      {/* Document Page Content (Rendered Paper) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-slate-300 p-8 min-h-[500px]">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-b border-slate-100 pb-2 mb-6">
            <span>CLAUSELENS VERIFIED DOCUMENT READER</span>
            <span>PAGE {currentPage} OF {pages.length}</span>
          </div>

          {activePageObj ? (
            renderHighlightedContent(
              activePageObj.text,
              selectedPage === currentPage ? selectedQuote : null
            )
          ) : (
            <div className="text-center text-slate-400 py-12">No page text available.</div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
            <span>ClauseLens Grounding Verification • RapidFuzz ratio ≥ 0.90</span>
            <span>Page {currentPage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

