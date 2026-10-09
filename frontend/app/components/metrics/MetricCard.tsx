import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  large?: boolean;
  progress?: number;
}

export function MetricCard({ label, value, trend, trendLabel, large, progress }: MetricCardProps) {
  return (
    <div className={`metric-card ${large ? 'metric-card-large' : ''}`}>
      <div className="metric-card-header">
        <span className="metric-label">{label}</span>
        {trend !== undefined && (
          <span className={`metric-trend ${trend >= 0 ? 'metric-trend-up' : 'metric-trend-down'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={`metric-value ${!large ? 'metric-value-sm' : ''}`}>{value}</div>
      {trendLabel && (
        <div className="caption mt-2">{trendLabel}</div>
      )}
      {progress !== undefined && (
        <div className="progress mt-4">
          <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}
    </div>
  );
}