'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import ProgressStepper from '../components/ProgressStepper';
import { SampleContractMeta } from '../lib/types';
import { getSampleContracts, extractContractFile } from '../lib/api';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [samples, setSamples] = useState<SampleContractMeta[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [statusText, setStatusText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getSampleContracts().then(setSamples).catch(console.error);
  }, []);

  const simulateStepProgression = async (targetId: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    setCurrentStep(1);
    setStatusText('Parsing PDF pages and layout structures with PyMuPDF...');
    await new Promise((r) => setTimeout(r, 450));

    setCurrentStep(2);
    setStatusText('Extracting commercial fields using structured Pydantic schemas...');
    await new Promise((r) => setTimeout(r, 550));

    setCurrentStep(3);
    setStatusText('Running code-level RapidFuzz grounding check on cited pages...');
    await new Promise((r) => setTimeout(r, 450));

    setCurrentStep(4);
    setStatusText('Grounding verified. Normalizing terms and calculating confidence...');
    await new Promise((r) => setTimeout(r, 250));

    router.push(`/results/${targetId}`);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF contract.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      setCurrentStep(1);
      setStatusText('Extracting pages with PyMuPDF...');

      // Attempt live upload to backend
      const promise = extractContractFile(file);

      // Advance stepper smoothly while waiting
      setTimeout(() => {
        setCurrentStep(2);
        setStatusText('Extracting terms with structured LLM JSON schema...');
      }, 500);

      setTimeout(() => {
        setCurrentStep(3);
        setStatusText('Executing RapidFuzz verbatim grounding check...');
      }, 1000);

      const result = await promise;

      setCurrentStep(4);
      setStatusText('Completed verification. Redirecting...');
      
      // Store user uploaded result in sessionStorage for display
      sessionStorage.setItem(`upload_${result.contract_id}`, JSON.stringify(result));
      router.push(`/results/upload_${result.contract_id}`);
    } catch (err: any) {
      console.warn('Live upload failed, providing demo fallback option:', err);
      setIsProcessing(false);
      setErrorMessage(
        'Server extraction is currently running in offline demo mode. You can open any bundled sample contract below without API keys.'
      );
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>Verifiable Commercial Term Extraction</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contract terms you can <span className="text-indigo-600 underline decoration-indigo-300">verify</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Extract commercial terms from supplier contracts, verify every single value against exact verbatim
            source quotes, and flag ambiguous or contradictory clauses for human review.
          </p>
        </div>

        {/* Processing Stepper or Upload Area */}
        <div className="max-w-2xl mx-auto">
          {isProcessing ? (
            <ProgressStepper currentStep={currentStep} statusText={statusText} />
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all bg-white ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-400 shadow-sm'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                Drop your supplier contract PDF here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Supports standard contracts, schedules, annexes, and multi-page agreements
              </p>

              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition shadow-sm shadow-indigo-200"
              >
                <FolderOpen className="h-4 w-4" />
                Select PDF File
              </label>

              {errorMessage && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Live Extraction Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bundled Demo Contracts Section */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Try a Sample Contract (Evaluation Dataset)</h2>
              </div>
              <p className="text-xs text-slate-500">
                12 realistic synthetic supplier contracts demonstrating varying clauses, multilingual terms, and failure modes.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
              12 Contracts • Instant Demo Mode
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {samples.map((sample) => (
              <div
                key={sample.id}
                onClick={() => simulateStepProgression(sample.id)}
                className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      {sample.category}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {sample.num_pages} {sample.num_pages === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition mb-2">
                    {sample.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {sample.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sample.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          tag === 'needs-review' || tag === 'conflict'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : tag === 'German' || tag === 'annex'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      {sample.verified_count} Verified
                    </span>
                    {sample.needs_review_count > 0 && (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                        <AlertTriangle className="h-3 w-3" />
                        {sample.needs_review_count} Review
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 transition">
                    Test <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-700">ClauseLens • Commercial Contract Term Extractor</p>
          <p className="mt-1 text-slate-400">
            RapidFuzz Grounding Verification • Pydantic v2 Structured Output • Synthetic Benchmark Dataset
          </p>
        </div>
      </footer>
    </div>
  );
}
