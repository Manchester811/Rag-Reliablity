import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const chartData = [
  { day: 'Mon', reliability: 72, success: 68, failures: 12 },
  { day: 'Tue', reliability: 74, success: 70, failures: 10 },
  { day: 'Wed', reliability: 76, success: 72, failures: 9 },
  { day: 'Thu', reliability: 78, success: 74, failures: 7 },
  { day: 'Fri', reliability: 79, success: 76, failures: 6 },
  { day: 'Sat', reliability: 82, success: 78, failures: 5 },
  { day: 'Sun', reliability: 83, success: 79, failures: 4 },
];

export function ReliabilityChart() {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <div className="chart-title">Reliability Overview</div>
          <div className="chart-subtitle">System performance over the selected period.</div>
        </div>
        <select className="select select-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B8E43F" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#B8E43F" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <XAxis dataKey="day" tick={{ fill: '#5F635E', fontSize: 11 }} axisLine={{ stroke: '#202120' }} tickLine={false} />
          <YAxis tick={{ fill: '#5F635E', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
          <Tooltip
            contentStyle={{ background: '#151615', border: '1px solid #202120', borderRadius: 12, color: '#F2F2EE', fontSize: 13 }}
            itemStyle={{ color: '#F2F2EE' }}
          />
          <Area type="monotone" dataKey="reliability" stroke="#B8E43F" strokeWidth={2} fill="url(#colorRel)" name="Reliability" />
          <Line type="monotone" dataKey="success" stroke="#4ADE80" strokeWidth={1.5} dot={false} name="Success" />
          <Line type="monotone" dataKey="failures" stroke="#F87171" strokeWidth={1.5} dot={false} name="Failures" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}