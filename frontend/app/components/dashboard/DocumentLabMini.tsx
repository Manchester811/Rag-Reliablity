'use client';

import React from 'react';
import { FileText, Upload, ArrowRight } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentLabMiniProps {
  documents: DocumentItem[];
  onUploadSuccess?: () => void;
  onViewAll?: () => void;
}

export default function DocumentLabMini({ documents, onUploadSuccess, onViewAll }: DocumentLabMiniProps) {
  const hasDocuments = documents && documents.length > 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[#A78BFA]">
            <FileText size={12} />
          </div>
          <h2 className="text-[14px] font-semibold text-[#F5F5F7]">Document Lab</h2>
        </div>
        {onViewAll && (
          <button onClick={onViewAll} className="text-[12px] font-medium text-[#8B5CF6] hover:text-[#A78BFA] flex items-center gap-1 transition-colors">
            <span>View All</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      <p className="text-[12px] text-[#A1A1AA] mb-4">Upload and inspect your knowledge corpus.</p>

      <div className="flex items-center gap-3 mb-4">
        <button className="btn-primary !py-2 !px-3 !text-[12px]">Upload Document</button>
        <span className="text-[12px] text-[#71717A]">{hasDocuments ? `${documents.length} documents` : '0 documents'}</span>
      </div>

      <div className="border-t border-white/[0.06] pt-3">
        <div className="text-[11px] font-medium text-[#71717A] uppercase tracking-wider mb-2">Recent</div>
        {hasDocuments ? (
          <div className="space-y-2">
            {documents.slice(0, 3).map((doc, idx) => (
              <div key={doc.name + idx} className="flex items-center justify-between py-1.5">
                <span className="text-[13px] text-[#A1A1AA] truncate">{doc.name}</span>
                <span className="text-[11px] text-[#71717A]">{doc.pages || doc.chunk_count || 0} chunks</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-[#71717A]">No documents indexed. Upload to get started.</p>
        )}
      </div>
    </div>
  );
}