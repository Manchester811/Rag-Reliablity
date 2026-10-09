'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ReliabilityDataPoint {
  date: string;
  reliability: number;
  success: number;
  failure: number;
}

export default function ReliabilityOverview() {
  const [timeframe, setTimeframe] = useState('7D');
  const [data, setData] = useState<ReliabilityDataPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (tf: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reliability/history?timeframe=${tf}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setError('Unable to load data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(timeframe);
  }, [timeframe]);

  const hasData = data && data.length > 0;

  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-[14px] font-semibold text-[#F5F5F7] tracking-tight">Reliability Overview</h2>
          <p className="text-[12px] text-[#71717A] mt-0.5">System performance over time</p>
        </div>
        <div className="tabs" role="tablist">
          {['7D', '30D', '90D'].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={timeframe === t}
              onClick={() => setTimeframe(t)}
              className={`tab ${timeframe === t ? 'active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-[220px] flex items-center justify-center">
          <div className="skeleton w-full max-w-md h-4 rounded" />
        </div>
      ) : error ? (
        <div className="empty-state h-[220px] text-center">
          <div className="text-[#EF4444] mb-2">⚠</div>
          <p className="text-[#A1A1AA]">{error}</p>
        </div>
      ) : !hasData ? (
        <div className="empty-state h-[220px]">
          <div className="empty-state-icon">
            <BarChart3 size={20} />
          </div>
          <div className="empty-state-title">No reliability data yet</div>
          <div className="empty-state-description">
            Run an experiment to begin tracking performance.
          </div>
        </div>
      ) : (
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data!} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="relGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="succGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} dy={6} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fill: '#71717A', fontSize: 10 }} axisLine={false} tickLine={false} dx={-4} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0B0B10] border border-white/[0.1] rounded-lg p-3 text-[11px]">
                      <div className="text-[#A1A1AA] font-medium mb-2">{label}</div>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}:
                          </span>
                          <span className="font-semibold text-[#F5F5F7]">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }} />
              <Area type="monotone" dataKey="reliability" stroke="#8B5CF6" strokeWidth={2} fill="url(#relGrad)" dot={false} activeDot={{ r: 4, fill: '#FFFFFF', stroke: '#8B5CF6', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="success" stroke="#22C55E" strokeWidth={1.5} fill="url(#succGrad)" dot={false} />
              <Area type="monotone" dataKey="failure" stroke="#EF4444" strokeWidth={1.5} fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}