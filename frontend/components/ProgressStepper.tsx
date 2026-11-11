'use client';

import React from 'react';
import { Check, Loader2, FileSearch, BrainCircuit, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ProgressStepperProps {
  currentStep: number; // 1 to 4
  statusText?: string;
}

const STEPS = [
  { step: 1, label: 'PyMuPDF Parsing', desc: 'Page text & coordinates', icon: FileSearch },
  { step: 2, label: 'LLM Extraction', desc: 'Structured JSON schema', icon: BrainCircuit },
  { step: 3, label: 'Trust Layer', desc: 'RapidFuzz fuzzy grounding', icon: ShieldCheck },
  { step: 4, label: 'Ready', desc: 'Normalized & verified', icon: CheckCircle2 },
];

export default function ProgressStepper({ currentStep, statusText }: ProgressStepperProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pipeline Extraction Progress</h3>
          <p className="text-xs text-slate-500">
            {statusText || 'Executing multi-stage extraction and code-level verification...'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Step {Math.min(currentStep, 4)} of 4
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {STEPS.map((s) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              className={`p-3 rounded-lg border transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : isCurrent
                  ? 'border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-200'
                  : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`h-7 w-7 rounded-md flex items-center justify-center ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400">0{s.step}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{s.label}</h4>
              <p className="text-[11px] text-slate-500">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
