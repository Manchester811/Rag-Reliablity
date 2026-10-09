'use client';

import React, { useState } from 'react';
import { MessageSquare, Zap, AlertCircle, Sparkles } from 'lucide-react';
import { DocumentItem } from '../../types';

interface PlaygroundMiniProps {
  documents: DocumentItem[];
  onGoToFullPlayground?: () => void;
}

export default function RAGPlaygroundMini({ documents, onGoToFullPlayground }: PlaygroundMiniProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<{ answer: string; sources?: { text: string; score: number }[]; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const hasDocs = documents && documents.length > 0;

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), top_k: 3 }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setResponse({ answer: data.answer, sources: data.sources });
    } catch {
      setResponse({ answer: '', error: 'Query failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#A78BFA]">
          <MessageSquare size={12} />
        </div>
        <h2 className="text-[14px] font-semibold text-[#F5F5F7]">RAG Playground</h2>
      </div>
      <p className="text-[12px] text-[#71717A] mb-4">Query your indexed documents.</p>

      <div className="rounded-lg bg-[#0D0D12] border border-white/[0.08] p-3 mb-3">
        <textarea
          rows={2}
          value={question}
          onChange={e => setQuestion(e.target.value.slice(0, 1000))}
          placeholder="Ask a question about your documents..."
          className="w-full bg-transparent text-[#F5F5F7] placeholder-[#71717A] text-[13px] resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
          <span className="text-[10px] text-[#52525B]">{question.length}/1000</span>
          <button onClick={handleAsk} disabled={loading || !question.trim()} className="btn-primary !py-1.5 !px-3 !text-[12px]">
            <Zap size={12} /> <span>{loading ? 'Asking...' : 'Ask RAG'}</span>
          </button>
        </div>
      </div>

      {response && (
        <div className="rounded-lg bg-[#0D0D12] border border-white/[0.08] p-3 text-[12px]">
          {response.error ? (
            <div className="flex items-center gap-2 text-[#EF4444]"><AlertCircle size={14}/><span>{response.error}</span></div>
          ) : (
            <>
              <div className="text-[11px] uppercase tracking-wider text-[#A78BFA] font-semibold flex items-center gap-1.5 mb-2"><Sparkles size={11}/>Answer</div>
              <p className="text-[#A1A1AA] leading-relaxed">{response.answer}</p>
            </>
          )}
        </div>
      )}

      {!hasDocs && (
        <div className="mt-3 p-3 rounded-lg bg-[#0D0D12] border border-dashed border-white/[0.08] text-center">
          <p className="text-[12px] text-[#71717A]">No documents indexed. Upload documents first.</p>
          {onGoToFullPlayground && <button onClick={onGoToFullPlayground} className="btn-secondary text-[11px] mt-2">Open Playground</button>}
        </div>
      )}
    </div>
  );
}