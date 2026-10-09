'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Play,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ChevronDown
} from 'lucide-react';

interface AttackVariant {
  type: string;
  attack_question: string;
  expected_answer?: string;
  severity?: string;
}

export default function AdversarialWorkspace() {
  const [attackTypes, setAttackTypes] = useState<string[]>([
    'paraphrase',
    'typo',
    'prompt_injection',
    'context_poisoning',
  ]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [seedQuestion, setSeedQuestion] = useState(
    'What are the core latency guarantees of the hybrid retrieval pipeline?'
  );
  const [expectedAnswer, setExpectedAnswer] = useState(
    'Sub-50ms p95 retrieval latency across 100k chunk indices.'
  );
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<AttackVariant[] | null>(null);

  const availableAttacks = [
    { id: 'prompt_injection', label: 'Prompt Injection', desc: 'System override and directive hijacking' },
    { id: 'context_poisoning', label: 'Context Poisoning', desc: 'Injected adversarial distractor facts' },
    { id: 'instruction_conflict', label: 'Instruction Conflict', desc: 'Contradictory user vs doc instructions' },
    { id: 'retrieval_manipulation', label: 'Retrieval Manipulation', desc: 'BM25 keyword stuffing & frequency skew' },
    { id: 'paraphrase', label: 'Semantic Paraphrase', desc: 'Syntactic rephrasing and vocabulary shift' },
    { id: 'typo', label: 'Typographical Jitter', desc: 'OCR & spelling perturbation noise' },
  ];

  const toggleAttack = (id: string) => {
    setAttackTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRunTest = async () => {
    setRunning(true);
    setResults(null);
    try {
      const res = await fetch('/api/attacks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: seedQuestion,
          expected_answer: expectedAnswer,
          attack_types: attackTypes,
          severity: severity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
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
          <div className="w-6 h-6 rounded-lg bg-[#FF6B7A]/15 border border-[#FF6B7A]/30 flex items-center justify-center text-[#FF6B7A]">
            <ShieldAlert size={14} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Adversarial Testing</h1>
        </div>
        <p className="text-[12px] text-[#A7A2B8] mt-1">
          Stress-test pipeline robustness with automated red-teaming perturbations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Config Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Attack Configuration</h2>

            {/* Attack Types Checkboxes */}
            <div>
              <label className="text-[11px] font-medium text-[#8E88A3] uppercase tracking-wider block mb-2">
                Attack Vectors ({attackTypes.length} selected)
              </label>
              <div className="space-y-2">
                {availableAttacks.map((att) => {
                  const active = attackTypes.includes(att.id);
                  return (
                    <div
                      key={att.id}
                      onClick={() => toggleAttack(att.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        active
                          ? 'bg-[#9B7CFF]/15 border-[#9B7CFF]/40 text-white'
                          : 'bg-white/[0.02] border-white/[0.04] text-[#A7A2B8] hover:border-white/[0.08]'
                      }`}
                    >
                      <div>
                        <div className="text-[12px] font-semibold">{att.label}</div>
                        <div className="text-[10px] text-[#8E88A3]">{att.desc}</div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          active
                            ? 'bg-[#9B7CFF] border-[#9B7CFF] text-white'
                            : 'border-white/[0.2] bg-transparent'
                        }`}
                      >
                        {active && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Severity Picker */}
            <div>
              <label className="text-[11px] font-medium text-[#8E88A3] uppercase tracking-wider block mb-2">
                Perturbation Severity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`py-1.5 rounded-lg capitalize text-[11px] font-medium border transition-colors ${
                      severity === sev
                        ? sev === 'critical'
                          ? 'bg-[#FF6B7A]/20 border-[#FF6B7A]/50 text-[#FF6B7A]'
                          : 'bg-[#9B7CFF]/20 border-[#9B7CFF]/50 text-[#C5A8FF]'
                        : 'bg-white/[0.03] border-white/[0.06] text-[#A7A2B8] hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Seed Query */}
            <div>
              <label className="text-[11px] font-medium text-[#8E88A3] uppercase tracking-wider block mb-1.5">
                Seed Test Query
              </label>
              <input
                type="text"
                value={seedQuestion}
                onChange={(e) => setSeedQuestion(e.target.value)}
                className="w-full bg-white/[0.03] text-white text-[12px] rounded-xl px-3 py-2 border border-white/[0.08] focus:outline-none focus:border-[#9B7CFF]/50"
              />
            </div>

            <button
              onClick={handleRunTest}
              disabled={running || attackTypes.length === 0}
              className="btn-glow-primary w-full justify-center disabled:opacity-50"
            >
              <Play size={14} className="fill-white" />
              <span>{running ? 'Executing Attack Vectors...' : 'Run Adversarial Test'}</span>
            </button>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <Crosshair size={15} className="text-[#FF6B7A]" />
                  <h2 className="text-sm font-semibold text-white">Adversarial Evaluation Results</h2>
                </div>
                {results && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#72E6A5]/15 text-[#72E6A5] border border-[#72E6A5]/30">
                    {results.length} Variants Generated
                  </span>
                )}
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-[#A7A2B8] uppercase">Attack Success Rate</span>
                  <div className="text-lg font-bold text-[#FF6B7A] mt-0.5">14.2%</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-[#A7A2B8] uppercase">Robustness Score</span>
                  <div className="text-lg font-bold text-[#72E6A5] mt-0.5">85.8%</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-[#A7A2B8] uppercase">Failures Detected</span>
                  <div className="text-lg font-bold text-white mt-0.5">2</div>
                </div>
              </div>

              {!results ? (
                <div className="py-16 text-center text-xs text-[#8E88A3]">
                  Configure your attack vector on the left and click "Run Adversarial Test".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] text-[12px] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FF6B7A]/15 text-[#FF6B7A] border border-[#FF6B7A]/30">
                          {r.type}
                        </span>
                        <span className="text-[10.5px] text-[#A7A2B8]">Severity: {severity}</span>
                      </div>
                      <p className="text-white font-medium">"{r.attack_question}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
