import React from 'react';
import { FlaskConical, FileText, AlertTriangle, ShieldAlert, Zap, CheckCircle } from 'lucide-react';

const activities = [
  { type: 'experiment', title: 'Experiment completed', meta: 'Hybrid retrieval test • 2 min ago', icon: FlaskConical },
  { type: 'document', title: 'New document processed', meta: 'research_paper.pdf • 15 min ago', icon: FileText },
  { type: 'failure', title: 'Failure detected', meta: 'Hallucination in answer • 32 min ago', icon: AlertTriangle },
  { type: 'attack', title: 'Adversarial test completed', meta: 'Prompt injection test • 1 hour ago', icon: ShieldAlert },
  { type: 'optimize', title: 'Auto-optimizer updated', meta: 'Improved retrieval parameters • 2 hours ago', icon: Zap },
];

export function ActivityFeed() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Recent Activity</div>
          <div className="panel-subtitle">Latest events across the system</div>
        </div>
      </div>
      <div className="activity-feed">
        {activities.map((item, i) => (
          <div key={i} className="activity-item">
            <div className="activity-icon">
              <item.icon size={14} strokeWidth={1.5} />
            </div>
            <div className="activity-content">
              <div className="activity-title">{item.title}</div>
              <div className="activity-meta">{item.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}