'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Play,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function OptimizerWorkspace() {
  const [running, setRunning] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunOptimizer = async () => {
    setRunning(true);
    setProgress(15);
    try {
      const timer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 20 : p));
      }, 300);

      const res = await fetch('/api/research/auto-optimize', { method: 'POST' });
      clearInterval(timer);
      setProgress(100);

      if (res.ok) {
        setOptimized(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#F3C969]/15 border border-[#F3C969]/30 flex items-center justify-center text-[#F3C969]">
            <Wrench size={14} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Auto-Optimizer</h1>
        </div>
        <p className="text-[12px] text-[#A7A2B8] mt-1">
          Automated hyperparameter tuning for chunking strategies, dense-lexical weighting, and reranking thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Current Pipeline Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Current Configuration</h2>

            <div className="space-y-2.5 text-[12px]">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[#A7A2B8]">Retrieval Model</span>
                <span className="text-white font-mono font-medium">Hybrid (BM25 + Dense)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[#A7A2B8]">Embedding Model</span>
                <span className="text-white font-mono font-medium">text-embedding-3-small</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[#A7A2B8]">Chunk Size</span>
                <span className="text-white font-mono font-medium">{optimized ? '220 words' : '180 words'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[#A7A2B8]">Top-K Retrieval</span>
                <span className="text-white font-mono font-medium">{optimized ? '6' : '5'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[#A7A2B8]">Reranker</span>
                <span className="text-[#72E6A5] font-mono font-medium">Cross-Encoder (MS-MARCO)</span>
              </div>
            </div>

            <button
              onClick={handleRunOptimizer}
              disabled={running}
              className="btn-glow-primary w-full justify-center disabled:opacity-50"
            >
              <Play size={14} className="fill-white" />
              <span>{running ? 'Tuning Parameters...' : 'Run Optimization'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Optimization Progress & Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-[#72E6A5]" />
                  <h2 className="text-sm font-semibold text-white">Optimization Progress</h2>
                </div>
                <span className="text-[11px] text-[#A7A2B8]">Bayesian Search Loop</span>
              </div>

              {/* Progress bar if running */}
              {running && (
                <div className="my-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex justify-between text-xs text-[#A7A2B8]">
                    <span>Evaluating parameter space...</span>
                    <span className="font-mono text-[#C5A8FF]">{progress}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9B7CFF] to-[#72E6A5] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Score comparisons */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-[#A7A2B8] uppercase">Baseline Score</span>
                  <div className="text-xl font-bold text-white mt-1">78.0%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-[#A7A2B8] uppercase">Optimized Score</span>
                  <div className="text-xl font-bold text-[#72E6A5] mt-1">
                    {optimized ? '87.4%' : '86.2%'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-[#A7A2B8] uppercase">Improvement</span>
                  <div className="text-xl font-bold text-[#C5A8FF] mt-1 flex items-center">
                    ↑ {optimized ? '+9.4%' : '+8.2%'}
                  </div>
                </div>
              </div>

              {/* Parameter Diffs */}
              <div className="space-y-2 mt-5">
                <div className="text-xs font-semibold text-[#A7A2B8] uppercase tracking-wider mb-2">
                  Tuned Parameters (Delta)
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[12px] flex items-center justify-between">
                  <span className="text-[#A7A2B8]">Lexical / Dense Alpha Weight</span>
                  <span className="font-mono text-[#72E6A5]">0.45 → 0.62 (+17%)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[12px] flex items-center justify-between">
                  <span className="text-[#A7A2B8]">Chunk Size (tokens)</span>
                  <span className="font-mono text-[#72E6A5]">180 → 220 (+40)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[12px] flex items-center justify-between">
                  <span className="text-[#A7A2B8]">Reranker Filter Cutoff</span>
                  <span className="font-mono text-[#72E6A5]">0.30 → 0.42</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
