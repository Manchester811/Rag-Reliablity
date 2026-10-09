'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ResearchBannerProps {
  onLearnMore?: () => void;
}

export default function ResearchBanner({ onLearnMore }: ResearchBannerProps) {
  return (
    <div className="card p-4 flex items-center justify-between gap-3 bg-[rgba(139,92,246,0.03)] border border-[rgba(139,92,246,0.1)]">
      <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.15)] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
          <path d="M12 3c3.5 3 5 6 5 9s-1.5 6-5 9c-3.5-3-5-6-5-9s1.5-6 5-9z" />
          <circle cx="12" cy="12" r="2" fill="#8B5CF6" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[#F5F5F7]">
          Build reliable, factual RAG systems.
        </p>
      </div>

      <button
        onClick={onLearnMore}
        className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(139,92,246,0.15)] border border-white/[0.06] hover:border-[rgba(139,92,246,0.3)] text-[#A78BFA] flex items-center justify-center shrink-0 transition-all"
      >
        <ArrowRight size={13} />
      </button>
    </div>
  );
}