'use client';

import React from 'react';
import { Target } from 'lucide-react';

interface MetricItem {
  label: string;
  value: number;
}

interface KeyMetricsProps {
  metrics?: MetricItem[];
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  const hasData = metrics && metrics.length > 0;
  const defaultMetrics: MetricItem[] = [
    { label: 'Retrieval Quality', value: 0 },
    { label: 'Faithfulness', value: 0 },
    { label: 'Answer Relevance', value: 0 },
    { label: 'Context Precision', value: 0 },
    { label: 'Context Recall', value: 0 },
  ];
  const displayMetrics = hasData ? metrics! : defaultMetrics;

  const getColor = (v: number) => !hasData ? '#71717A' : v >= 80 ? '#22C55E' : v >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#A78BFA]">
          <Target size={12} />
        </div>
        <h2 className="text-[14px] font-semibold text-[#F5F5F7]">Key Metrics</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {displayMetrics.map((m) => (
          <div key={m.label} className="p-3 rounded-lg bg-[#0D0D12] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-[#71717A]">{m.label}</span>
              <span className="text-[13px] font-semibold text-[#F5F5F7]" style={{ color: getColor(m.value) }}>
                {hasData ? `${m.value}%` : '—'}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: hasData ? `${m.value}%` : 0, backgroundColor: getColor(m.value), transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {!hasData && <p className="text-[11px] text-[#71717A] text-center mt-3">No benchmark data yet. Run an experiment to see metrics.</p>}
    </div>
  );
}