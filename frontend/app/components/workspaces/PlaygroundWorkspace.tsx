'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Zap,
  ShieldAlert,
  ChevronDown,
  Layers,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Send
} from 'lucide-react';

import { DocumentItem } from '../../types';

interface PlaygroundWorkspaceProps {
  documents: DocumentItem[];
}

export default function PlaygroundWorkspace({ documents }: PlaygroundWorkspaceProps) {
  const [selectedDocId, setSelectedDocId] = useState<number>(documents?.[0]?.id || 1);
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(5);
  const [retrievalMode, setRetrievalMode] = useState<'hybrid' | 'production'>('hybrid');
  const [loading, setLoading] = useState(false);
  const [attackLoading, setAttackLoading] = useState(false);

  const [response, setResponse] = useState<{
    answer: string;
    sources: { chunk_id: number; page: number; score: number; text: string }[];
    generation_mode?: string;
    reranker_used?: boolean;
    error?: string;
  } | null>(null);

  const [attacks, setAttacks] = useState<{ type: string; attack_question: string }[] | null>(null);

  const presetQuestions = [
    'What is the primary contribution of this work?',
    'What are the key architectural decisions described?',
    'What failure modes or limitations are acknowledged?',
    'How does the system evaluate reliability and grounding?',
  ];

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    const endpoint = retrievalMode === 'production' ? '/api/rag/production-ask' : '/api/rag/ask';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: selectedDocId,
          question: question.trim(),
          top_k: topK,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Query failed');
      }

      const data = await res.json();
      setResponse({
        answer: data.answer,
        sources: data.sources || [],
        generation_mode: data.generation_mode,
        reranker_used: data.reranker_used,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error executing query';
      setResponse({
        answer: '',
        sources: [],
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAttacks = async () => {
    if (!question.trim()) return;
    setAttackLoading(true);
    try {
      const res = await fetch('/api/rag/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: selectedDocId,
          question: question.trim(),
          top_k: topK,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttacks(data.attacks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAttackLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#9B7CFF]/15 border border-[#9B7CFF]/30 flex items-center justify-center text-[#C5A8FF]">
              <MessageSquare size={14} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">RAG Playground</h1>
          </div>
          <p className="text-[12px] text-[#A7A2B8] mt-1">
            Interactive research instrument to test queries against indexed knowledge.
          </p>
        </div>

        {/* Document Selector Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(Number(e.target.value))}
              className="appearance-none bg-[#151128] text-white text-[12px] rounded-xl pl-3.5 pr-8 py-2 border border-white/[0.1] focus:outline-none focus:border-[#9B7CFF]/50 cursor-pointer min-w-[200px]"
            >
              {documents && documents.length > 0 ? (
                documents.map((d, i) => (
                  <option key={d.id ?? i} value={d.id ?? 1} className="bg-[#151128] text-white">
                    {d.name}
                  </option>
                ))
              ) : (
                <option value={1} className="bg-[#151128] text-white">
                  research_paper.pdf
                </option>
              )}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7A2B8] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Query Configuration</h2>

            {/* Presets */}
            <div>
              <label className="text-[11px] font-medium text-[#8E88A3] uppercase tracking-wider block mb-2">
                Suggested Research Questions
              </label>
              <div className="flex flex-col gap-1.5">
                {presetQuestions.map((pq) => (
                  <button
                    key={pq}
                    onClick={() => setQuestion(pq)}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-[11px] text-[#A7A2B8] hover:text-white transition-colors"
                  >
                    "{pq}"
                  </button>
                ))}
              </div>
            </div>

            {/* Controls: Top-K & Mode */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
              <div>
                <label className="text-[11px] font-medium text-[#8E88A3] block mb-1">
                  Top-K: <span className="text-white font-mono">{topK}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full accent-[#9B7CFF] bg-white/[0.1] h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#8E88A3] block mb-1">
                  Retriever Mode
                </label>
                <select
                  value={retrievalMode}
                  onChange={(e) => setRetrievalMode(e.target.value as 'hybrid' | 'production')}
                  className="w-full bg-white/[0.04] text-white text-[11px] rounded-lg px-2.5 py-1.5 border border-white/[0.08]"
                >
                  <option value="hybrid" className="bg-[#151128]">Hybrid (TF-IDF + Cosine)</option>
                  <option value="production" className="bg-[#151128]">Production Dense/BM25</option>
                </select>
              </div>
            </div>

            {/* Input Text Area */}
            <div>
              <label className="text-[11px] font-medium text-[#8E88A3] uppercase tracking-wider block mb-2">
                Ask Question
              </label>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-3 focus-within:border-[#9B7CFF]/50 focus-within:bg-[#161228]/50 transition-all">
                <textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a technical question about your indexed knowledge..."
                  className="w-full bg-transparent text-[#F5F3FF] placeholder-[#686276] text-[12.5px] resize-none focus:outline-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] text-[#8E88A3]">
                  <span>{question.length}/1000 characters</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="btn-glow-primary flex-1 justify-center disabled:opacity-50"
              >
                <Zap size={14} className="fill-white" />
                <span>{loading ? 'Synthesizing...' : 'Ask RAG Pipeline'}</span>
              </button>

              <button
                onClick={handleGenerateAttacks}
                disabled={attackLoading || !question.trim()}
                className="btn-glass-secondary shrink-0"
                title="Generate adversarial variations"
              >
                <ShieldAlert size={14} className="text-[#FF6B7A]" />
                <span>{attackLoading ? 'Perturbing...' : 'Attack Check'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Results Panel */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Answer Card */}
          <div className="glass-panel p-5 min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#9B7CFF]" />
                  <h2 className="text-sm font-semibold text-white">Synthesized Grounded Answer</h2>
                </div>
                {response && !response.error && (
                  <div className="flex items-center gap-2 text-[10.5px]">
                    <span className="px-2 py-0.5 rounded-full bg-[#9B7CFF]/15 text-[#C5A8FF] border border-[#9B7CFF]/30">
                      Mode: {response.generation_mode || 'local'}
                    </span>
                    {response.reranker_used && (
                      <span className="px-2 py-0.5 rounded-full bg-[#72E6A5]/15 text-[#72E6A5] border border-[#72E6A5]/30">
                        Reranker Active
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!response ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-[#8E88A3]">
                  <MessageSquare size={28} className="text-[#9B7CFF]/40 mb-2" />
                  <p className="text-sm font-medium text-white/80">No query executed yet</p>
                  <p className="text-xs text-[#686276] mt-1 max-w-sm">
                    Select a document, enter a prompt on the left, and click "Ask RAG Pipeline" to evaluate retrieval grounding.
                  </p>
                </div>
              ) : response.error ? (
                <div className="p-4 rounded-xl bg-[#FF6B7A]/10 border border-[#FF6B7A]/30 text-[#FF6B7A] text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{response.error}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[13px] text-white leading-relaxed whitespace-pre-wrap">
                    {response.answer}
                  </div>

                  {/* Retrieved Evidence Chunks */}
                  <div>
                    <h3 className="text-xs font-semibold text-[#A7A2B8] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <Layers size={13} className="text-[#9B7CFF]" />
                      <span>Retrieved Context ({response.sources.length} chunks)</span>
                    </h3>

                    <div className="space-y-2.5">
                      {response.sources.map((src, i) => (
                        <div
                          key={src.chunk_id || i}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#9B7CFF]/30 transition-colors text-[11.5px]"
                        >
                          <div className="flex items-center justify-between text-[#8E88A3] text-[10.5px] mb-1.5 font-mono">
                            <span>Page {src.page} • Chunk #{src.chunk_id}</span>
                            <span className="text-[#72E6A5] font-semibold">
                              Match: {(src.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-[#E0DCF0] leading-relaxed line-clamp-3">
                            {src.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Adversarial Variants check if active */}
          {attacks && attacks.length > 0 && (
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 text-[#FF6B7A] text-xs font-semibold mb-3">
                <ShieldAlert size={14} />
                <span>Adversarial Query Variants Generated ({attacks.length})</span>
              </div>
              <div className="space-y-2">
                {attacks.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11.5px] flex items-center justify-between"
                  >
                    <div>
                      <span className="px-1.5 py-0.5 rounded bg-[#FF6B7A]/15 text-[#FF6B7A] text-[9.5px] font-mono uppercase mr-2">
                        {att.type}
                      </span>
                      <span className="text-white/90">"{att.attack_question}"</span>
                    </div>
                    <button
                      onClick={() => setQuestion(att.attack_question)}
                      className="text-[10.5px] text-[#C5A8FF] hover:text-white px-2 py-0.5 rounded hover:bg-white/[0.05]"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
