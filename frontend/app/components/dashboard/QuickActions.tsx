'use client';

import React from 'react';
import { Zap, FlaskConical, ShieldAlert, Wrench, Sparkles, ArrowRight } from 'lucide-react';
import { TabType } from '../shell/Sidebar';

interface QuickActionsProps {
  onNavigate: (tab: TabType) => void;
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions = [
    {
      tab: 'experiments' as TabType,
      title: 'Run Experiment',
      desc: 'Test system performance',
      icon: FlaskConical,
      color: 'text-[#A78BFA]',
      bgColor: 'bg-[rgba(139,92,246,0.1)]',
      borderColor: 'border-[rgba(139,92,246,0.2)]',
    },
    {
      tab: 'adversarial' as TabType,
      title: 'Adversarial Testing',
      desc: 'Stress-test robustness',
      icon: ShieldAlert,
      color: 'text-[#EF4444]',
      bgColor: 'bg-[rgba(239,68,68,0.1)]',
      borderColor: 'border-[rgba(239,68,68,0.2)]',
    },
    {
      tab: 'auto-optimizer' as TabType,
      title: 'Auto-Optimizer',
      desc: 'Improve parameters',
      icon: Wrench,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[rgba(245,158,11,0.1)]',
      borderColor: 'border-[rgba(245,158,11,0.2)]',
    },
    {
      tab: 'self-improvement' as TabType,
      title: 'Self-Improvement',
      desc: 'Learn from failures',
      icon: Sparkles,
      color: 'text-[#22C55E]',
      bgColor: 'bg-[rgba(34,197,94,0.1)]',
      borderColor: 'border-[rgba(34,197,94,0.2)]',
    },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#A78BFA]">
          <Zap size={12} />
        </div>
        <h2 className="text-[14px] font-semibold text-[#F5F5F7]">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={() => onNavigate(act.tab)}
              className="text-left p-3 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] border border-white/[0.05] hover:border-[rgba(139,92,246,0.3)] transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg ${act.bgColor} border ${act.borderColor} flex items-center justify-center ${act.color}`}>
                  <Icon size={13} />
                </div>
                <ArrowRight size={12} className="text-[#71717A] mt-1" />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-[#F5F5F7] mb-0.5">{act.title}</div>
                <div className="text-[10px] text-[#71717A]">{act.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}