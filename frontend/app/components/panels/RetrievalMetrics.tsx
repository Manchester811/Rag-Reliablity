import React from 'react';
import { ProgressRing } from '../metrics/ProgressRing';

export function RetrievalMetrics() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Retrieval Quality</div>
          <div className="panel-subtitle">Hybrid retrieval evaluation metrics</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ProgressRing value={92} label="Retrieval Quality" size="sm" />
        <ProgressRing value={88} label="Faithfulness" size="sm" />
        <ProgressRing value={94} label="Answer Relevance" size="sm" />
        <ProgressRing value={89} label="Context Precision" size="sm" />
      </div>
    </div>
  );
}