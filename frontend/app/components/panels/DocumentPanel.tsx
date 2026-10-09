import React from 'react';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const docs = [
  { name: 'research_paper.pdf', pages: 12, status: 'Processed', updated: '2h ago', icon: CheckCircle },
  { name: 'company_docs.pdf', pages: 8, status: 'Processed', updated: '1d ago', icon: CheckCircle },
  { name: 'technical_manual.pdf', pages: 24, status: 'Processing', updated: '3h ago', icon: Clock },
];

export function DocumentPanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Document Lab</div>
          <div className="panel-subtitle">Manage the knowledge base powering RAG</div>
        </div>
        <button className="btn btn-primary btn-sm">Upload Document</button>
      </div>

      <div className="upload-area mb-4">
        <div className="upload-icon"><Upload size={32} strokeWidth={1} /></div>
        <div className="upload-text">Drag and drop PDF, TXT, DOCX</div>
        <div className="upload-hint">Maximum 50 MB • Auto-chunking with page awareness</div>
      </div>

      <div className="document-list">
        {docs.map((d) => (
          <div key={d.name} className="document-item">
            <div className="document-icon"><d.icon size={16} /></div>
            <div className="document-info">
              <div className="document-name">{d.name}</div>
              <div className="document-meta">{d.pages} pages • {d.updated}</div>
            </div>
            <span className={`badge ${d.status === 'Processing' ? 'badge-warning' : 'badge-success'}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}