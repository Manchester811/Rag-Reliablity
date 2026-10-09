import React, { useState } from 'react';
import { Search, FileText, MessageSquare, Zap, AlertCircle } from 'lucide-react';

const documents = [
  { id: 1, name: 'research_paper.pdf' },
  { id: 2, name: 'company_docs.pdf' },
  { id: 3, name: 'technical_manual.pdf' },
];

export function RAGPlayground() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ answer: string; sources: { text: string; score: number }[] } | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      const res = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: 1, question, top_k: 5 }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnswer(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">RAG Playground</div>
          <div className="panel-subtitle">Ask questions against your indexed knowledge</div>
        </div>
        <select className="select select-sm">
          {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <textarea
        className="playground-input"
        placeholder="Ask a question about your documents..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
      />

      <div className="flex justify-end mt-3">
        <button className="btn btn-primary" onClick={handleAsk}>
          <Zap size={14} /> Ask RAG
        </button>
      </div>

      {answer && (
        <div className="playground-results">
          <div className="result-card">
            <div className="result-section">
              <div className="result-label">Answer</div>
              <div className="result-text">{answer.answer}</div>
            </div>
          </div>
          {answer.sources && answer.sources.length > 0 && (
            <div className="result-card">
              <div className="result-section">
                <div className="result-label">Retrieved Context</div>
                {answer.sources.slice(0, 3).map((s, i) => (
                  <div key={i} className="text-[12px] text-text-secondary mt-2 p-2 bg-bg-elevated rounded">
                    {s.text.slice(0, 200)}...
                    <span className="ml-2 text-accent-lime text-[10px]">{(s.score * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}