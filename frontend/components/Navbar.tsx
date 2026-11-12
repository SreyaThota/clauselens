'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, BarChart2, FileText } from 'lucide-react';

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:pl-4 sm:border-l border-slate-200">
      <Link
        href="/"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
          pathname === '/' || pathname.startsWith('/results')
            ? 'bg-slate-100 text-[#0D9488]'
            : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
        }`}
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span>Extractor</span>
      </Link>
      <Link
        href="/eval"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
          pathname === '/eval'
            ? 'bg-slate-100 text-[#0D9488]'
            : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
        }`}
      >
        <BarChart2 className="h-4 w-4 shrink-0 text-[#0D9488]" />
        <span className="hidden sm:inline">Evaluation Benchmark</span>
        <span className="sm:hidden font-bold text-[#0D9488]">Eval</span>
      </Link>
    </nav>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-[#0D9488] flex items-center justify-center text-white transition hover:bg-teal-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">ClauseLens</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">Contract terms you can verify</p>
            </div>
          </Link>

          <Suspense fallback={<div className="w-32 h-8" />}>
            <NavLinks />
          </Suspense>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/results/synthetic_06_conflicting_clauses_materials"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0D9488] hover:bg-teal-700 transition"
          >
            <span>20s Trust Demo</span>
          </Link>
          <Link
            href="/eval"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F172A] bg-slate-100 border border-slate-200 hover:bg-slate-200 transition"
          >
            <span>Evaluation</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
