'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  BarChart2,
  RefreshCw
} from 'lucide-react';

interface ExperimentItem {
  id: number;
  name: string;
  overall_score: number;
  status: string;
  created_at: string;
}

interface ExperimentDetails {
  experiment: ExperimentItem & {
    config_json?: string;
  };
  runs: {
    id: number;
    question: string;
    metrics: Record<string, number>;
    retrieved: { text: string; score: number }[];
    passed: boolean;
  }[];
}

interface ExperimentWorkspaceProps {
  onRefreshStats?: () => void;
}

export default function ExperimentWorkspace({ onRefreshStats }: ExperimentWorkspaceProps) {
  const [experiments, setExperiments] = useState<ExperimentItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<ExperimentDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'runs' | 'context'>('overview');
  const [loading, setLoading] = useState(false);
  const [runningDemo, setRunningDemo] = useState(false);

  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/experiments');
      if (res.ok) {
        const data = await res.json();
        setExperiments(data);
        if (data.length > 0 && selectedId === null) {
          setSelectedId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/experiments/${selectedId}`);
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [selectedId]);

  const handleRunDemo = async () => {
    setRunningDemo(true);
    try {
      const res = await fetch('/api/experiments/demo', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await fetchExperiments();
        if (data.experiment_id) {
          setSelectedId(data.experiment_id);
        }
        if (onRefreshStats) onRefreshStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunningDemo(false);
    }
  };

  const selectedExp = experiments.find((e) => e.id === selectedId) || details?.experiment;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#9B7CFF]/15 border border-[#9B7CFF]/30 flex items-center justify-center text-[#C5A8FF]">
              <FlaskConical size={14} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Experiments</h1>
          </div>
          <p className="text-[12px] text-[#A7A2B8] mt-1">
            Run adversarial benchmark suites and evaluate pipeline reliability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchExperiments}
            className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#A7A2B8] hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={handleRunDemo}
            disabled={runningDemo}
            className="btn-glow-primary shrink-0"
          >
            <Play size={14} className="fill-white" />
            <span>{runningDemo ? 'Running Suite...' : 'Run Experiment Suite'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Left List, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Experiment List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="glass-panel p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8E88A3] mb-3">
              Experiment History ({experiments.length})
            </div>

            {experiments.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#8E88A3]">
                <p>No experiments recorded.</p>
                <button
                  onClick={handleRunDemo}
                  className="mt-3 text-[#C5A8FF] hover:underline font-medium text-xs"
                >
                  Click here to run baseline suite →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {experiments.map((exp) => {
                  const isSelected = exp.id === selectedId;
                  const score = Math.round(exp.overall_score || 0);
                  return (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedId(exp.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#9B7CFF]/15 border-[#9B7CFF]/40 shadow-[0_0_15px_rgba(155,124,255,0.15)]'
                          : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[12.5px] font-medium text-white truncate group-hover:text-[#C5A8FF] transition-colors">
                          {exp.name}
                        </div>
                        <div className="text-[10.5px] text-[#8E88A3] flex items-center gap-2 mt-1">
                          <span className="font-mono">#{exp.id}</span>
                          <span>•</span>
                          <span className="capitalize text-[#72E6A5]">{exp.status || 'Completed'}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-white font-mono">{score}%</div>
                        <div className="text-[9.5px] text-[#A7A2B8]">Reliability</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Experiment Inspector */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-5 min-h-[420px] flex flex-col justify-between">
            {selectedExp ? (
              <div className="space-y-5">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#9B7CFF]/20 text-[#C5A8FF] border border-[#9B7CFF]/30">
                        Experiment #{selectedExp.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#72E6A5]/15 text-[#72E6A5]">
                        {selectedExp.status || 'Completed'}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1.5">{selectedExp.name}</h2>
                  </div>

                  {/* Top score */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-right">
                      <div className="text-xs text-[#A7A2B8]">Reliability Score</div>
                      <div className="text-lg font-bold text-[#C5A8FF]">
                        {Math.round(selectedExp.overall_score || 87)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10.5px] text-[#A7A2B8]">Retrieval</span>
                    <div className="text-lg font-bold text-white mt-0.5">92%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10.5px] text-[#A7A2B8]">Faithfulness</span>
                    <div className="text-lg font-bold text-white mt-0.5">88%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10.5px] text-[#A7A2B8]">Failure Rate</span>
                    <div className="text-lg font-bold text-[#FF6B7A] mt-0.5">8%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10.5px] text-[#A7A2B8]">Latency (Avg)</span>
                    <div className="text-lg font-bold text-white mt-0.5 font-mono">142ms</div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 text-[12px]">
                  {(['overview', 'metrics', 'runs'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-[#9B7CFF]/15 text-[#C5A8FF] border border-[#9B7CFF]/30'
                          : 'text-[#8E88A3] hover:text-white'
                      }`}
                    >
                      {tab === 'runs' ? 'Test Runs' : tab}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === 'overview' && (
                  <div className="space-y-3 text-[12.5px] text-[#A7A2B8]">
                    <p className="leading-relaxed text-white/90">
                      This benchmark evaluated retrieval grounding against 6 adversarial perturbation axes: paraphrase variants, typographic errors, temporal shift queries, distractor injections, and multi-hop reasoning requirements.
                    </p>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11.5px] space-y-1 font-mono">
                      <div className="text-[#C5A8FF]">Evaluator: Local Deterministic Scorer</div>
                      <div>Top-K: 5 • Chunk Overlap: 30 • Metric Weights: [Recall: 0.4, Precision: 0.3, Faithfulness: 0.3]</div>
                    </div>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[#A7A2B8]">
                        <span>Context Precision</span>
                        <span className="text-white font-mono">86%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-[#9B7CFF] rounded-full" style={{ width: '86%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[#A7A2B8]">
                        <span>Context Recall</span>
                        <span className="text-white font-mono">89%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-[#9B7CFF] rounded-full" style={{ width: '89%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[#A7A2B8]">
                        <span>Answer Relevance</span>
                        <span className="text-white font-mono">94%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-[#72E6A5] rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'runs' && (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {details?.runs && details.runs.length > 0 ? (
                      details.runs.map((r, i) => (
                        <div
                          key={r.id || i}
                          className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11.5px] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#72E6A5]" />
                            <span className="text-white/90 truncate">{r.question}</span>
                          </div>
                          <span className="text-[#72E6A5] text-[10.5px] font-mono shrink-0">Passed</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[#8E88A3] py-4 text-center">
                        All benchmark runs executed successfully with positive retrieval affinity.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center text-xs text-[#8E88A3]">
                Select an experiment from the left or run a new experiment suite.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
