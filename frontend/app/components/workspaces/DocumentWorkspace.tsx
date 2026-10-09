'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  ArrowRight,
  Eye,
  X,
  FileCode,
  Copy,
  Check
} from 'lucide-react';

import { DocumentItem } from '../../types';

interface ChunkItem {
  id: number;
  chunk_index: number;
  page_number: number;
  text: string;
}

interface DocumentWorkspaceProps {
  documents: DocumentItem[];
  onRefresh: () => void;
}

export default function DocumentWorkspace({ documents, onRefresh }: DocumentWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [chunks, setChunks] = useState<ChunkItem[]>([]);
  const [loadingChunks, setLoadingChunks] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await res.json();
      setUploadStatus({
        success: true,
        msg: `Uploaded "${file.name}" successfully (${data.chunk_count} chunks extracted)`,
      });
      onRefresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadStatus({ success: false, msg: errorMessage });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInspectChunks = async (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setLoadingChunks(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/chunks`);
      if (res.ok) {
        const data = await res.json();
        setChunks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChunks(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#9B7CFF]/15 border border-[#9B7CFF]/30 flex items-center justify-center text-[#C5A8FF]">
              <FileText size={14} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Document Lab</h1>
          </div>
          <p className="text-[12px] text-[#A7A2B8] mt-1">
            Manage the knowledge base and chunk index powering your RAG pipeline.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-glow-primary shrink-0"
        >
          <Upload size={14} />
          <span>{uploading ? 'Processing File...' : 'Upload Document'}</span>
        </button>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="glass-panel p-6 border-dashed border-white/[0.15] hover:border-[#9B7CFF]/50 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleUpload}
          accept=".pdf,.txt,.md,.csv"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-2xl bg-[#9B7CFF]/15 border border-[#9B7CFF]/30 group-hover:bg-[#9B7CFF]/25 flex items-center justify-center text-[#C5A8FF] mb-3 transition-colors shadow-[0_0_20px_rgba(155,124,255,0.2)]">
          <Upload size={22} />
        </div>
        <div className="text-sm font-semibold text-white mb-1">
          {uploading ? 'Parsing and chunking document...' : 'Upload Knowledge Documents'}
        </div>
        <p className="text-[11.5px] text-[#A7A2B8] max-w-sm mb-3">
          Drag and drop PDF, TXT, MD, or CSV (Max 10MB). Automatically extracted with recursive page-aware chunking.
        </p>
        <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-[12px] font-medium border border-white/[0.08] transition-colors">
          Choose Files
        </span>

        {uploadStatus && (
          <div
            className={`mt-4 px-3.5 py-1.5 rounded-lg text-[11.5px] font-medium ${
              uploadStatus.success
                ? 'bg-[#72E6A5]/15 border border-[#72E6A5]/30 text-[#72E6A5]'
                : 'bg-[#FF6B7A]/15 border border-[#FF6B7A]/30 text-[#FF6B7A]'
            }`}
          >
            {uploadStatus.msg}
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database size={15} className="text-[#9B7CFF]" />
            <h2 className="text-sm font-semibold text-white">Indexed Knowledge Documents</h2>
          </div>
          <span className="text-[11px] text-[#A7A2B8] font-mono">
            Total: {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-10 text-[#8E88A3] text-xs">
            <p>No documents indexed yet.</p>
            <p className="text-[11px] text-[#686276] mt-1">Upload a PDF or TXT above to begin evaluation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-[#8E88A3] font-medium text-[11px] uppercase tracking-wider">
                  <th className="pb-2.5 pl-2">Name</th>
                  <th className="pb-2.5">Type</th>
                  <th className="pb-2.5">Size</th>
                  <th className="pb-2.5">Chunks</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pl-2 font-medium text-white flex items-center gap-2">
                      <FileText size={15} className="text-[#9B7CFF] shrink-0" />
                      <span className="truncate max-w-xs">{doc.name}</span>
                    </td>
                    <td className="py-3 text-[#A7A2B8] font-mono text-[11px]">
                      {doc.file_type || 'PDF'}
                    </td>
                    <td className="py-3 text-[#A7A2B8] font-mono text-[11px]">
                      {doc.size_bytes ? `${Math.round(doc.size_bytes / 1024)} KB` : '--'}
                    </td>
                    <td className="py-3 text-[#C5A8FF] font-medium">
                      {doc.chunk_count || '--'} chunks
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#72E6A5]/15 text-[#72E6A5] border border-[#72E6A5]/30">
                        <CheckCircle2 size={10} />
                        {doc.status || 'Processed'}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => handleInspectChunks(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#9B7CFF]/20 text-[#C5A8FF] hover:text-white border border-white/[0.08] text-[11px] transition-colors"
                      >
                        <Eye size={12} />
                        <span>Inspect Chunks</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chunk Inspector Drawer / Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] glass-panel border border-[#9B7CFF]/30 p-5 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode size={16} className="text-[#9B7CFF]" />
                  <span>Chunk Inspector: {selectedDoc.name}</span>
                </h3>
                <span className="text-[11px] text-[#A7A2B8]">
                  {chunks.length} chunks extracted
                </span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#A7A2B8] hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingChunks ? (
                <div className="py-12 text-center text-xs text-[#A7A2B8]">Loading chunks...</div>
              ) : chunks.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#8E88A3]">No chunks found for this document.</div>
              ) : (
                chunks.map((chk) => (
                  <div
                    key={chk.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#9B7CFF]/30 text-[12px] space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10.5px] text-[#8E88A3]">
                      <span className="font-mono text-[#C5A8FF]">
                        Chunk #{chk.chunk_index + 1} • Page {chk.page_number}
                      </span>
                      <button
                        onClick={() => copyToClipboard(chk.text, chk.id)}
                        className="flex items-center gap-1 text-[#A7A2B8] hover:text-white transition-colors"
                      >
                        {copiedId === chk.id ? (
                          <>
                            <Check size={11} className="text-[#72E6A5]" />
                            <span className="text-[#72E6A5]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[#F5F3FF] leading-relaxed whitespace-pre-wrap font-sans">
                      {chk.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
