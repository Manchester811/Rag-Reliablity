import React from 'react';

interface ProgressRingProps {
  value: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressRing({ value, label, size = 'md' }: ProgressRingProps) {
  const sizes = { sm: 60, md: 80, lg: 100 };
  const s = sizes[size];
  const radius = (s - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="progress-ring" style={{ width: s, height: s }}>
        <svg width={s} height={s} className="progress-ring-circle">
          <circle className="progress-ring-bg" cx={s/2} cy={s/2} r={radius} />
          <circle
            className="progress-ring-progress"
            cx={s/2}
            cy={s/2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ stroke: value >= 90 ? '#B8E43F' : value >= 70 ? '#4ADE80' : value >= 50 ? '#FACC15' : '#F87171' }}
          />
        </svg>
        <span className="progress-ring-text" style={{ fontSize: size === 'sm' ? 12 : size === 'lg' ? 20 : 14 }}>{value}%</span>
      </div>
      <span className="text-[11px] text-text-muted font-medium">{label}</span>
    </div>
  );
}