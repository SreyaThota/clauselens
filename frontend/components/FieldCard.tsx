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
      review_reason: 'Approved by reviewer'
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
      review_reason: 'Manually edited and verified'
    });
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-[#0D9488] border border-teal-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#0D9488]" />
          Verified
        </span>
      );
    }
    if (isNeedsReview) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#D97706] border border-amber-300">
          <AlertTriangle className="h-3.5 w-3.5 text-[#D97706]" />
          Needs Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <MinusCircle className="h-3.5 w-3.5 text-slate-400" />
        Not Found
      </span>
    );
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl border p-4 transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-[#0D9488] ring-2 ring-teal-100'
          : isNeedsReview
          ? 'border-amber-300 bg-amber-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">{meta.label}</h4>
          <p className="text-[11px] text-slate-500">{meta.desc}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Extracted Value Display / Edit */}
      <div className="mt-2 mb-3">
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="p-1.5 rounded-md bg-[#0D9488] text-white hover:bg-teal-700 transition"
              title="Save"
            >
              <Save className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              title="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${
                isNotFound ? 'text-slate-400 italic' : 'text-[#0F172A]'
              }`}
            >
              {field.normalized !== null && field.normalized !== undefined
                ? String(field.normalized)
                : 'none found'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Confidence:</span>
              <span
                className={`font-semibold ${
                  isNeedsReview
                    ? 'text-[#D97706]'
                    : isVerified
                    ? 'text-[#0D9488]'
                    : 'text-slate-500'
                }`}
              >
                {Math.round(field.confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Review Alert if Needs Review */}
      {isNeedsReview && field.review_reason && (
        <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-[#0F172A]">
          <div className="flex items-center gap-1.5 font-bold text-[#D97706] mb-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Reason for review</span>
          </div>
          <p className="text-slate-700">{field.review_reason}</p>
        </div>
      )}

      {/* Quote / Citation */}
      {field.source_quote && (
        <div className="p-2.5 rounded-lg bg-[#F1F5F9] border border-slate-200 text-xs text-slate-700 mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
              <FileSearch className="h-3.5 w-3.5 text-[#0D9488]" />
              Page {field.page || 1} Quote:
            </span>
            <span className="text-[10px] text-slate-500">
              Grounding: {Math.round((field.grounding_ratio || 1.0) * 100)}%
            </span>
          </div>
          <p className="italic font-serif text-[#0F172A] line-clamp-2">
            &quot;{field.source_quote}&quot;
          </p>
        </div>
      )}

      {/* Actions: Approve / Edit */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-xs text-slate-500 hover:text-[#0F172A] flex items-center gap-1"
        >
          {expanded ? (
            <>
              Less details <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              More details <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition"
            >
              <Edit2 className="h-3 w-3" />
              Correct
            </button>
          )}
          {isNeedsReview && (
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-[#0D9488] text-white hover:bg-teal-700 transition"
            >
              <Check className="h-3 w-3" />
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
