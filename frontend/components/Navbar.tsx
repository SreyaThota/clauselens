'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, BarChart2, FileText, Sparkles } from 'lucide-react';

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:pl-4 sm:border-l border-slate-200">
      <Link
        href="/"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
          pathname === '/' || pathname.startsWith('/results')
            ? 'bg-slate-100 text-indigo-600'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span>Extractor</span>
      </Link>
      <Link
        href="/eval"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
          pathname === '/eval'
            ? 'bg-slate-100 text-indigo-600'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <BarChart2 className="h-4 w-4 shrink-0 text-indigo-600" />
        <span className="hidden sm:inline">Evaluation Benchmark</span>
        <span className="sm:hidden font-bold text-indigo-600">Eval</span>
      </Link>
    </nav>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">ClauseLens</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v1.0
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
          <div className="hidden xs:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Demo Mode Ready</span>
            <span className="sm:hidden">Demo</span>
          </div>
          <Link
            href="/eval"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Eval Dashboard</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
