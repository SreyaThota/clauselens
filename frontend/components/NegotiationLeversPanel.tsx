'use client';

import React from 'react';
import { NegotiationLever } from '../lib/types';
import { Lightbulb, TrendingUp, Info } from 'lucide-react';

interface NegotiationLeversPanelProps {
  levers: NegotiationLever[];
}

export default function NegotiationLeversPanel({ levers }: NegotiationLeversPanelProps) {
  if (!levers || levers.length === 0) {
    return null;
  }

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#0D9488] border border-teal-200">
            High Impact
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Medium Impact
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-[#0D9488]">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Commercial Negotiation Levers</h3>
            <p className="text-xs text-slate-500">
              Commercial guidance derived from verified clauses
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Info className="h-3.5 w-3.5" />
          Heuristic guidance
        </span>
      </div>

      <div className="space-y-3 mt-4">
        {levers.map((lever) => (
          <div
            key={lever.id}
            className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#0D9488]" />
                {lever.title}
              </span>
              {getImpactBadge(lever.impact)}
            </div>

            <div className="text-xs mb-2">
              <span className="text-slate-500 font-medium">Current Term: </span>
              <span className="font-semibold text-[#0F172A]">{lever.current_term}</span>
            </div>

            <div className="text-xs text-slate-700 font-medium bg-white p-2.5 rounded border border-slate-200 mb-1.5">
              <span className="font-bold text-[#0F172A]">Action: </span>
              {lever.recommendation}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              Why: {lever.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
