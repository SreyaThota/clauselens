'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { SampleContractMeta } from '../lib/types';
import { getSampleContracts } from '../lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Search,
  UserCheck,
  UploadCloud,
  FileCheck2
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [samples, setSamples] = useState<SampleContractMeta[]>([]);

  useEffect(() => {
    getSampleContracts().then(setSamples).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Contract terms you can verify.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-snug">
            Extracts 8 commercial terms. Checks every one against the page it came from.
          </p>

          {/* Two Big Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/results/synthetic_06_conflicting_clauses_materials"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-[#0D9488] text-white hover:bg-teal-700 transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>Try the 20-second trust demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/eval"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-white text-[#0F172A] border border-slate-300 hover:bg-slate-100 transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>See the evaluation</span>
            </Link>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            18 synthetic contracts, rule-based baseline.
          </p>
        </div>

        {/* 3 Big Stat Tiles from latest.json */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accuracy
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#0D9488]">
              86.8%
            </div>
            <div className="text-xs text-slate-600 pt-1">
              Exact ground-truth match across 144 fields
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Grounding
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#0D9488]">
              100%
            </div>
            <div className="text-xs text-slate-600 pt-1">
              Verbatim source match on cited pages
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Flagged for review
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#D97706]">
              16.7%
            </div>
            <div className="text-xs text-slate-600 pt-1">
              Doubtful or suspicious extractions routed to humans
            </div>
          </div>
        </div>

        {/* 4-Step Process Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 text-center">
            How Verification Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F1F5F9] border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0F172A]">
                01
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">Upload PDF</h3>
              <p className="text-xs text-slate-600 leading-snug">
                Extract page text and structures locally.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F1F5F9] border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0F172A]">
                02
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">Extract 8 terms</h3>
              <p className="text-xs text-slate-600 leading-snug">
                Payment, cap, law, term, renewal, notice, price, volume.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F1F5F9] border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0F172A]">
                03
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">Verify against page</h3>
              <p className="text-xs text-slate-600 leading-snug">
                Fuzzy match verbatim source quote on cited page.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F1F5F9] border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0F172A]">
                04
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">Human review</h3>
              <p className="text-xs text-slate-600 leading-snug">
                Flag ungrounded or ambiguous clauses for approval.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <UploadCloud className="h-4 w-4 text-slate-400" />
            <span>Upload Mode</span>
          </div>
          <p className="text-sm font-medium text-[#0F172A]">
            Upload runs on the local backend. This demo uses 18 pre-evaluated contracts.
          </p>
          <p className="text-xs text-slate-500">
            Select any contract below to test the extraction and grounding pipeline.
          </p>
        </div>

        {/* Contract Picker (18 Samples) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Choose a Pre-Evaluated Contract
              </h2>
              <p className="text-xs text-slate-500">
                18 synthetic contracts with frozen ground truth.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200 self-start sm:self-auto">
              18 Contracts Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {samples.map((sample) => (
              <div
                key={sample.id}
                onClick={() => router.push(`/results/${sample.id}`)}
                className={`p-5 bg-white rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  sample.id === 'synthetic_06_conflicting_clauses_materials'
                    ? 'border-[#0D9488] ring-2 ring-teal-100'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">
                      {sample.category}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#F1F5F9] text-slate-600 font-medium">
                      {sample.num_pages} {sample.num_pages === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0F172A] mb-2">
                    {sample.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {sample.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[#0D9488] font-semibold text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      {sample.verified_count} Verified
                    </span>
                    {sample.needs_review_count > 0 && (
                      <span className="flex items-center gap-1 text-[#D97706] bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded font-bold text-[11px]">
                        <AlertTriangle className="h-3 w-3 text-[#D97706]" />
                        {sample.needs_review_count} Review
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 font-semibold text-[#0D9488]">
                    Inspect <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-medium text-[#0F172A]">ClauseLens • Contract terms you can verify</p>
          <p className="mt-1 text-slate-500">
            18 synthetic contracts, rule-based baseline.
          </p>
        </div>
      </footer>
    </div>
  );
}
