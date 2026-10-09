'use client';

import React from 'react';
import { Sparkles, Lightbulb, MoreHorizontal, TrendingUp } from 'lucide-react';

interface InsightPanelProps {
  data?: {
    improvement?: number;
    message?: string;
    suggestion?: string;
  };
}

export default function InsightPanel({ data }: InsightPanelProps) {
  const hasData = data && (data.improvement || data.message);
  
  return (
    <div className="card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#A78BFA]">
            <Sparkles size={12} />
          </div>
          <h2 className="text-[14px] font-semibold text-[#F5F5F7]">AI Insight</h2>
        </div>
        <button className="text-[#71717A] hover:text-[#F5F5F7] transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <TrendingUp size={28} className="text-[#71717A] mb-3" />
          <p className="text-[13px] text-[#71717A] mb-1">No insights yet</p>
          <p className="text-[11px] text-[#52525B]">Run benchmarks to see AI-generated insights</p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center text-[#22C55E] shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-xl font-semibold text-[#F5F5F7] flex items-baseline gap-1">
                <span>↑ {data.improvement || 0}%</span>
              </div>
              <p className="text-[12px] text-[#A1A1AA] leading-snug mt-1">
                {data.message || 'Reliability improved this week.'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-white/[0.05] flex items-start gap-2.5">
            <Lightbulb size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#A1A1AA] leading-tight">
              {data.suggestion || 'Run more benchmarks to get personalized insights.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}