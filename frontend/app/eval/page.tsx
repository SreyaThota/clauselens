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
  Sparkles,
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
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
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
    rawName: key,
    accuracy: m.accuracy,
    grounding: m.grounding_rate,
    review: m.review_rate,
    nfPrecision: m.not_found_precision,
    nfRecall: m.not_found_recall
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Evaluation Benchmark
              </span>
              <span className="text-xs text-slate-400">• Updated {new Date(report.timestamp).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Evaluation & Verification Benchmark
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Honest evaluation metrics across all {report.total_contracts} synthetic supplier contracts, verified by RapidFuzz code-level grounding.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <Cpu className="h-4 w-4 text-indigo-600 shrink-0" />
              <span className="text-slate-500 font-medium">Model:</span>
              <span className="font-mono text-slate-900 text-[11px] truncate max-w-xs">{report.model_used}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Real execution measurement • No mock values
            </span>
          </div>
        </div>

        {/* Top Metric Stat Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Accuracy</span>
              <Sparkles className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{report.overall_accuracy}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Ground truth match</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Grounding Rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">{report.grounding_rate}%</div>
            <p className="text-[11px] text-slate-400 mt-1">RapidFuzz ratio ≥ 0.90</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Not-Found Precision</span>
              <Search className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-700">{report.not_found_precision}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              TP / (TP + FP)
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Not-Found Recall</span>
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-700">{report.not_found_recall}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              TP / (TP + FN)
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Review Rate</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-700">{report.review_rate}%</div>
            <p className="text-[11px] text-slate-400 mt-1">Confidence &lt; 0.75</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Avg. Latency</span>
              <Clock className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{report.avg_latency_ms} <span className="text-xs font-normal text-slate-500">ms</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Measured execution</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-600">Avg. Cost</span>
              <Coins className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">${report.avg_cost_usd.toFixed(5)}</div>
            <p className="text-[11px] text-slate-400 mt-1">Token consumption</p>
          </div>
        </div>

        {/* Per-Field Accuracy Chart (Recharts) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Per-Field Accuracy & Grounding Rate (%)</h2>
              <p className="text-xs text-slate-500">
                Evaluation agreement against ground truth across all 12 benchmark contracts
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-indigo-600" />
                <span>Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-emerald-500" />
                <span>Grounding Rate</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                <Bar dataKey="accuracy" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Accuracy" />
                <Bar dataKey="grounding" fill="#10b981" radius={[4, 4, 0, 0]} name="Grounding Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Detailed Field Performance Breakdown</h3>
            <span className="text-xs text-slate-500 font-medium">12 contracts • 96 field evaluations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Field Name</th>
                  <th className="px-6 py-3">Accuracy</th>
                  <th className="px-6 py-3">Grounding Rate</th>
                  <th className="px-6 py-3">Not-Found Precision</th>
                  <th className="px-6 py-3">Not-Found Recall</th>
                  <th className="px-6 py-3">Review Rate</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Object.entries(report.per_field_metrics).map(([key, m]) => (
                  <tr key={key} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900 font-mono text-[11px]">
                      {key}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {m.accuracy}%
                    </td>
                    <td className="px-6 py-3.5 text-emerald-700 font-medium">
                      {m.grounding_rate}%
                    </td>
                    <td className="px-6 py-3.5 text-blue-700 font-medium">
                      {m.not_found_precision}%
                    </td>
                    <td className="px-6 py-3.5 text-indigo-700 font-medium">
                      {m.not_found_recall}%
                    </td>
                    <td className="px-6 py-3.5">
                      {m.review_rate > 0 ? (
                        <span className="text-amber-700 font-bold">{m.review_rate}%</span>
                      ) : (
                        <span className="text-slate-400">0.0%</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      {m.accuracy >= 95 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Production Ready
                        </span>
                      ) : m.accuracy >= 80 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          High Accuracy
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Under Refinement
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Known Failure Cases Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Documented Edge Cases & Failure Modes</h2>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Actual documented failure cases and edge conditions derived from the evaluation dataset.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.failure_cases.map((fc) => (
              <div
                key={fc.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {fc.id}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {fc.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 font-mono mb-2 truncate" title={fc.contract_name}>
                    {fc.contract_name}
                  </h3>

                  <div className="text-xs space-y-1.5 mb-3">
                    <div>
                      <span className="text-slate-400 font-medium">Field: </span>
                      <span className="font-semibold text-slate-800 font-mono">{fc.field_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Expected: </span>
                      <span className="text-slate-700 italic">{fc.expected}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Extracted: </span>
                      <span className="text-slate-900 font-semibold">{fc.extracted}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3">
                    {fc.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px]">
                  <span className="font-bold text-indigo-900">System Handling: </span>
                  <span className="text-slate-600">{fc.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">ClauseLens Evaluation Suite</p>
          <p className="mt-1 text-slate-400">
            Automated synthetic ground truth benchmark with RapidFuzz verification.
          </p>
        </div>
      </footer>
    </div>
  );
}
