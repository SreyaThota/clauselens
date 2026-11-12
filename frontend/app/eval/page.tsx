'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { EvaluationReport } from '../../lib/types';
import { getEvaluationReport } from '../../lib/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Coins,
  Search,
  AlertCircle,
  Cpu
} from 'lucide-react';

export default function EvalDashboardPage() {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getEvaluationReport()
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-[#0F172A]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-500">
          Loading evaluation metrics...
        </div>
      </div>
    );
  }

  // Format per-field metrics for Recharts
  const chartData = Object.entries(report.per_field_metrics).map(([key, m]) => ({
    name: key.replace('_', ' '),
    accuracy: m.accuracy,
    grounding: m.grounding_rate,
    review: m.review_rate,
    nfPrecision: m.not_found_precision,
    nfRecall: m.not_found_recall
  }));

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200">
                Evaluation Benchmark
              </span>
              <span className="text-xs text-slate-400">18 contracts • 144 fields</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Evaluation & Verification Benchmark
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Honest evaluation metrics across all 18 synthetic supplier contracts.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-slate-200 text-xs font-semibold">
              <Cpu className="h-4 w-4 text-[#0D9488] shrink-0" />
              <span className="text-slate-500 font-medium">Model:</span>
              <span className="font-mono text-[#0F172A] text-[11px] truncate max-w-xs">{report.model_used}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Deterministic rule-based baseline • No mock numbers
            </span>
          </div>
        </div>

        {/* Short Plain Note */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-[#0F172A]">Evaluation Scope: </span>
            <span>Synthetic contracts, 18 documents. Results show the pipeline end to end, not that extraction is solved.</span>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-[#F1F5F9] text-slate-700 border border-slate-200 shrink-0">
            18 Contracts • 144 Ground-Truth Fields
          </span>
        </div>

        {/* Top Stat Tiles from latest.json */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">Accuracy</div>
            <div className="text-2xl font-extrabold text-[#0D9488]">{report.overall_accuracy}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Ground truth</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">Grounding</div>
            <div className="text-2xl font-extrabold text-[#0D9488]">{report.grounding_rate}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Verbatim check</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">NF Precision</div>
            <div className="text-2xl font-extrabold text-[#0D9488]">{report.not_found_precision}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">TP / (TP + FP)</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">NF Recall</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{report.not_found_recall}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">TP / (TP + FN)</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">Review Rate</div>
            <div className="text-2xl font-extrabold text-[#D97706]">{report.review_rate}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Flagged review</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">Latency</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{report.avg_latency_ms} <span className="text-xs font-normal text-slate-500">ms</span></div>
            <p className="text-[11px] text-slate-400 mt-0.5">Execution speed</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-1">Avg Cost</div>
            <div className="text-2xl font-extrabold text-[#0D9488]">${report.avg_cost_usd.toFixed(5)}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Token cost</p>
          </div>
        </div>

        {/* WHERE IT FAILS SECTION (HIGH ON THE PAGE) */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-bold text-[#0F172A]">Where it fails</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Real misses from the 18-contract benchmark evaluation. Demonstrates where the deterministic baseline reaches its boundary.
            </p>
            <p className="text-xs text-slate-700 bg-white border border-slate-200 p-2.5 rounded-lg mt-2 font-medium">
              <span className="font-bold text-[#0F172A]">Suspicious Not-Found Rule: </span>
              When a field is extracted as &quot;none found&quot; but related commercial keywords exist in the contract text, the trust layer automatically sets status to &quot;needs_review&quot; (confidence ≤ 0.40) and cites the matching sentence and page.
            </p>
          </div>

          {/* Top 5 Real Misses Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A]">Top Real Misses by Severity (19 Total Misses)</span>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Unresolved Baseline Edge Cases
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F1F5F9] border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Contract ID</th>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Expected Ground Truth</th>
                    <th className="px-4 py-3">Extracted Value</th>
                    <th className="px-4 py-3">Root Cause Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {report.failure_cases.slice(0, 5).map((fc) => (
                    <tr key={fc.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#0F172A] text-[11px]">
                        {fc.contract_name.replace('.pdf', '')}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#0D9488]">
                        {fc.field_name}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F172A]">
                        {fc.expected}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 font-semibold">
                        {fc.extracted}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        <span className="font-bold text-[#0F172A]">{fc.category}: </span>
                        {fc.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Baseline vs LLM Pipeline Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Baseline vs. LLM Pipeline Comparison</h3>
              <p className="text-xs text-slate-500">Benchmark comparison on identical 18-contract ground-truth evaluation set</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 self-start sm:self-auto">
              Pipeline Comparison
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Extraction Engine</th>
                  <th className="px-6 py-3">Overall Accuracy</th>
                  <th className="px-6 py-3">Grounding Rate</th>
                  <th className="px-6 py-3">Not-Found Precision</th>
                  <th className="px-6 py-3">Not-Found Recall</th>
                  <th className="px-6 py-3">Review Rate</th>
                  <th className="px-6 py-3">Avg Latency</th>
                  <th className="px-6 py-3">Cost / Doc</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3.5">
                    <span className="font-bold text-[#0F172A] block">Deterministic Rule-Based Baseline</span>
                    <span className="text-[10px] text-slate-400">Offline Regex & AST Extractor</span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-[#0D9488]">{report.overall_accuracy}%</td>
                  <td className="px-6 py-3.5 font-semibold text-[#0D9488]">{report.grounding_rate}%</td>
                  <td className="px-6 py-3.5 font-semibold text-[#0D9488]">{report.not_found_precision}%</td>
                  <td className="px-6 py-3.5 font-semibold text-[#0F172A]">{report.not_found_recall}%</td>
                  <td className="px-6 py-3.5 font-semibold text-[#D97706]">{report.review_rate}%</td>
                  <td className="px-6 py-3.5 font-mono text-slate-800">{report.avg_latency_ms} ms</td>
                  <td className="px-6 py-3.5 font-mono text-slate-800">${report.avg_cost_usd.toFixed(5)}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0D9488] border border-teal-200">
                      Evaluated (18/18 docs)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition bg-slate-50/50">
                  <td className="px-6 py-3.5">
                    <span className="font-bold text-slate-600 block">LLM Pipeline</span>
                    <span className="text-[10px] text-slate-400">Google Gemini / OpenAI (Structured Output)</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono italic">—</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      not run (no API key configured)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Per-Field Performance Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A]">Detailed Field Performance Breakdown</h3>
            <span className="text-xs text-slate-500 font-medium">18 contracts • 144 field evaluations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Field Name</th>
                  <th className="px-6 py-3">Total Evaluated</th>
                  <th className="px-6 py-3">Correct Normalized</th>
                  <th className="px-6 py-3">Accuracy</th>
                  <th className="px-6 py-3">Grounding Rate</th>
                  <th className="px-6 py-3">NF Precision</th>
                  <th className="px-6 py-3">NF Recall</th>
                  <th className="px-6 py-3">Review Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Object.entries(report.per_field_metrics).map(([key, m]) => (
                  <tr key={key} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-mono font-semibold text-[#0F172A]">
                      {m.field_name}
                    </td>
                    <td className="px-6 py-3.5 font-medium">{m.total_samples}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-900">{m.correct_normalized}</td>
                    <td className="px-6 py-3.5 font-bold text-[#0D9488]">
                      {m.accuracy}%
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-[#0D9488]">
                      {m.grounding_rate}%
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {m.not_found_precision}%
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {m.not_found_recall}%
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {m.review_rate > 0 ? (
                        <span className="text-[#D97706] font-semibold">{m.review_rate}%</span>
                      ) : (
                        <span>0.0%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Per-Field Accuracy Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Per-Field Accuracy & Grounding Rate (%)</h2>
              <p className="text-xs text-slate-500">
                Evaluation agreement against ground truth across all 18 benchmark contracts
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-[#0F172A]" />
                <span>Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-[#0D9488]" />
                <span>Grounding Rate</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="accuracy" fill="#0F172A" radius={[4, 4, 0, 0]} name="Accuracy" />
                <Bar dataKey="grounding" fill="#0D9488" radius={[4, 4, 0, 0]} name="Grounding Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-medium text-[#0F172A]">ClauseLens Evaluation Suite</p>
          <p className="mt-1 text-slate-500">
            18 synthetic contracts, rule-based baseline.
          </p>
        </div>
      </footer>
    </div>
  );
}
