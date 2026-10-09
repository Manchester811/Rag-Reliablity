'use client';

import React from 'react';
import { Clock, ArrowRight, CheckCircle2, FileText, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  detail: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  onViewAll?: () => void;
}

export default function RecentActivity({ activities, onViewAll }: RecentActivityProps) {
  const hasData = activities && activities.length > 0;

  const defaultActivities: Activity[] = [
    {
      id: 1,
      title: 'No recent activity',
      detail: 'Run an experiment to get started',
      time: '--',
      icon: Clock,
      iconColor: 'text-[#71717A]',
      bgColor: 'bg-[rgba(255,255,255,0.03)]',
      borderColor: 'border-white/[0.04]',
    },
  ];

  const displayActivities = hasData ? activities! : defaultActivities;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#A78BFA]">
            <Clock size={12} />
          </div>
          <h2 className="text-[14px] font-semibold text-[#F5F5F7]">Recent Activity</h2>
        </div>

        {onViewAll && hasData && (
          <button
            onClick={onViewAll}
            className="text-[12px] font-medium text-[#8B5CF6] hover:text-[#A78BFA] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayActivities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-white/[0.04] hover:border-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg ${act.bgColor} border ${act.borderColor} flex items-center justify-center ${act.iconColor}`}>
                  <Icon size={13} />
                </div>
                <div className="truncate">
                  <div className="text-[12px] font-medium text-[#F5F5F7] truncate">{act.title}</div>
                  <div className="text-[10px] text-[#71717A] truncate">{act.detail}</div>
                </div>
              </div>
              <span className="text-[10px] text-[#52525B] shrink-0 ml-2 font-mono whitespace-nowrap">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}