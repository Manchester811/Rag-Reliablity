'use client';

import React from 'react';
import { Play, Upload, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onRunExperiment: () => void;
  onUploadDocument: () => void;
}

export default function HeroSection({ onRunExperiment, onUploadDocument }: HeroSectionProps) {
  return (
    <div className="rounded-xl bg-[#0D0D12] border border-white/[0.08] p-6 lg:p-7">
      <div className="max-w-2xl">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#F5F5F7] tracking-tight leading-[1.15] mb-3">
          Build reliable <span className="text-[#8B5CF6]">RAG</span> systems.
        </h1>
        <p className="text-[14px] text-[#A1A1AA] leading-relaxed mb-6 max-w-lg">
          Measure, diagnose and continuously improve your RAG pipeline.
        </p>
        <div className="flex gap-3">
          <button onClick={onRunExperiment} className="btn-primary">
            <Play size={14} className="fill-white" />
            <span>Run Experiment</span>
          </button>
          <button onClick={onUploadDocument} className="btn-secondary">
            <Upload size={14} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}