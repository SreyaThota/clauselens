'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PageText } from '../lib/types';
import { FileText, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

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
      return <div className="whitespace-pre-wrap font-serif text-[#0F172A] leading-relaxed text-xs sm:text-sm">{text}</div>;
    }

    const cleanQuote = quote.trim();
    const cleanLower = cleanQuote.toLowerCase();
    const textLower = text.toLowerCase();
    const idx = textLower.indexOf(cleanLower);

    if (idx === -1) {
      const prefix = cleanQuote.slice(0, Math.min(25, cleanQuote.length)).toLowerCase();
      const pIdx = textLower.indexOf(prefix);
      if (pIdx !== -1) {
        const before = text.slice(0, pIdx);
        const match = text.slice(pIdx, pIdx + cleanQuote.length);
        const after = text.slice(pIdx + cleanQuote.length);
        return (
          <div className="whitespace-pre-wrap font-serif text-[#0F172A] leading-relaxed text-xs sm:text-sm">
            {before}
            <mark
              ref={highlightRef}
              className="bg-teal-100 text-teal-950 font-medium px-1 py-0.5 rounded border border-teal-300 ring-2 ring-[#0D9488]"
            >
              {match}
            </mark>
            {after}
          </div>
        );
      }
      return <div className="whitespace-pre-wrap font-serif text-[#0F172A] leading-relaxed text-xs sm:text-sm">{text}</div>;
    }

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + cleanQuote.length);
    const after = text.slice(idx + cleanQuote.length);

    return (
      <div className="whitespace-pre-wrap font-serif text-[#0F172A] leading-relaxed text-xs sm:text-sm">
        {before}
        <mark
          ref={highlightRef}
          className="bg-teal-100 text-teal-950 font-medium px-1.5 py-0.5 rounded border border-teal-300 ring-2 ring-[#0D9488]"
        >
          {match}
        </mark>
        {after}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Document Toolbar */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#0D9488]" />
          <span className="text-xs font-bold text-[#0F172A] truncate max-w-[200px] sm:max-w-xs">
            {filename}
          </span>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded text-slate-500 hover:text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-semibold px-2 text-[#0F172A]">
              Page {currentPage} of {pages.length}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
              disabled={currentPage >= pages.length}
              className="p-1 rounded text-slate-500 hover:text-[#0F172A] disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition"
            title="Copy Page Text"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#0D9488]" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Page Content Display */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {activePageObj ? (
          renderHighlightedContent(activePageObj.text, selectedQuote)
        ) : (
          <div className="text-center text-xs text-slate-400 py-12">
            No page text available.
          </div>
        )}
      </div>

      {/* Footer info strip */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
        <span>Extracted via PyMuPDF</span>
        {selectedQuote ? (
          <span className="text-[#0D9488] font-semibold">Active Citation Highlighted</span>
        ) : (
          <span>Click any field to view citation</span>
        )}
      </div>
    </div>
  );
}
