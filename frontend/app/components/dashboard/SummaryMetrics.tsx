'use client';

import React from 'react';
import { ShieldCheck, FlaskConical, FileCheck, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const API = '/api';

export default function SummaryMetrics() {
  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch(`${API}/dashboard`);
      if (!res.ok) {
        return { overall_score: 0, experiments: 0, tests: 0, failures: 0 };
      }
      return res.json();
    },
  });

  const score = dash?.overall_score ?? 0;
  const experiments = dash?.experiments ?? 0;
  const tests = dash?.tests ?? 0;
  const failures = dash?.failures ?? 0;

  const hasAnyData = score > 0 || experiments > 0 || tests > 0 || failures > 0;

  const cards = [
    { label: 'Reliability Score', value: score > 0 ? `${score}/100` : '0/100', icon: ShieldCheck, color: score > 0 ? '#22C55E' : '#71717A', empty: 'No benchmark data yet' },
    { label: 'Experiments', value: experiments > 0 ? String(experiments) : '0', icon: FlaskConical, color: '#8B5CF6', empty: 'No experiments yet' },
    { label: 'Test Cases', value: tests > 0 ? String(tests) : '0', icon: FileCheck, color: '#A78BFA', empty: 'No test cases yet' },
    { label: 'Failures', value: failures > 0 ? String(failures) : '0', icon: AlertTriangle, color: failures > 0 ? '#EF4444' : '#22C55E', empty: failures > 0 ? 'Needs attention' : 'All tests passing' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const displayValue = hasAnyData ? c.value : c.empty === 'No benchmark data yet' ? '0/100' : c.value;
        const emptyText = hasAnyData ? c.empty : undefined;
        return (
          <div key={c.label} className="kpi-card">
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#A1A1AA]">
              <Icon size={14} className={c.color} />
              <span>{c.label}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="kpi-value text-[#F5F5F7]">{displayValue}</span>
            </div>
            {emptyText && <p className="text-[10px] text-[#71717A] mt-1">{emptyText}</p>}
          </div>
        );
      })}
    </div>
  );
}