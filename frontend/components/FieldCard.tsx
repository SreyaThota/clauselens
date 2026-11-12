'use client';

import React, { useState } from 'react';
import { ExtractedField } from '../lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Check,
  Edit2,
  Save,
  X
} from 'lucide-react';

interface FieldCardProps {
  field: ExtractedField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateField: (updated: ExtractedField) => void;
}

const FIELD_LABELS: Record<string, { label: string; desc: string }> = {
  payment_terms: { label: 'Payment Terms', desc: 'Net payment schedule in days' },
  price_adjustment: { label: 'Price Adjustment', desc: 'Fixed, index-linked, renegotiable' },
  contract_term: { label: 'Contract Term', desc: 'Agreement duration or dates' },
  auto_renewal: { label: 'Auto-Renewal', desc: 'Automatic extension clause' },
  termination_notice: { label: 'Termination Notice', desc: 'Required notice days for exit' },
  liability_cap: { label: 'Liability Cap', desc: 'Aggregate liability limit' },
  governing_law: { label: 'Governing Law', desc: 'Jurisdiction or governing state' },
  volume_commitment: { label: 'Volume Commitment', desc: 'Minimum quantity or spend' }
};

export default function FieldCard({ field, isSelected, onSelect, onUpdateField }: FieldCardProps) {
  const isVerified = field.status === 'verified';
  const isNeedsReview = field.status === 'needs_review';
  const isNotFound = field.status === 'not_found';

  const meta = FIELD_LABELS[field.field_name] || {
    label: field.field_name,
    desc: 'Contract commercial term'
  };

  const [expanded, setExpanded] = useState<boolean>(isSelected || isNeedsReview);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(String(field.normalized ?? ''));

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateField({
      ...field,
      status: 'verified',
      confidence: 1.0,
      review_reason: 'Approved by human reviewer'
    });
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateField({
      ...field,
      normalized: editValue,
      value: editValue,
      status: 'verified',
      confidence: 1.0,
      review_reason: 'Manually edited and verified by reviewer'
    });
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Verified
        </span>
      );
    }
    if (isNeedsReview) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
          Needs Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <MinusCircle className="h-3.5 w-3.5 text-slate-400" />
        Not Found
      </span>
    );
  };

  const getConfidenceBarColor = (score: number) => {
    if (score >= 0.85) return 'bg-emerald-500';
    if (score >= 0.70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div
      onClick={() => {
        onSelect();
        setExpanded(!expanded);
      }}
      className={`rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">{meta.label}</h4>
              {getStatusBadge()}
            </div>
            <p className="text-[11px] text-slate-500">{meta.desc}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Normalized & Raw Values Display */}
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
              Normalized Term
            </span>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="px-2 py-1 text-xs border border-indigo-300 rounded font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  title="Save"
                >
                  <Save className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                  className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                  title="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    isNotFound ? 'text-slate-400 italic' : 'text-slate-900'
                  }`}
                >
                  {field.normalized !== null ? String(field.normalized) : 'None found'}
                </span>
                {field.page && (
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                    Page {field.page}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Confidence Indicator */}
          {!isNotFound && (
            <div className="w-24 shrink-0 text-right">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                <span>Confidence</span>
                <span>{Math.round(field.confidence * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getConfidenceBarColor(field.confidence)}`}
                  style={{ width: `${Math.round(field.confidence * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Warning Callout for Needs Review */}
        {isNeedsReview && field.review_reason && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Human Review Flag: </span>
              <span>{field.review_reason}</span>
            </div>
          </div>
        )}

        {/* Expanded Source Quote & Review Actions */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-3">
            {field.source_quote ? (
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span className="flex items-center gap-1 text-slate-700">
                    <FileSearch className="h-3.5 w-3.5 text-indigo-600" />
                    Exact Source Quote (Page {field.page}):
                  </span>
                  <span className="text-emerald-700 font-medium">Grounding Verified (≥ 90%)</span>
                </div>
                <blockquote className="p-2.5 rounded-md bg-slate-50 border-l-2 border-indigo-500 text-slate-700 font-serif italic text-xs leading-relaxed">
                  &quot;{field.source_quote}&quot;
                </blockquote>
              </div>
            ) : (
              <p className="text-slate-400 italic">No source clause present in contract clauses.</p>
            )}

            {/* Action Buttons for Review */}
            {isNeedsReview && !isEditing && (
              <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve Term
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Correct / Edit Value
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

