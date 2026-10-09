import React from 'react';
import { FlaskConical, ShieldAlert, Wrench, Sparkles } from 'lucide-react';

const actions = [
  { title: 'Run Experiment', desc: 'Test a new retrieval configuration', icon: FlaskConical },
  { title: 'Adversarial Testing', desc: 'Generate adversarial queries', icon: ShieldAlert },
  { title: 'Auto-Optimizer', desc: 'Optimize retrieval parameters', icon: Wrench },
  { title: 'Self-Improvement', desc: 'Run conservative repair loop', icon: Sparkles },
];

export function QuickActions() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Quick Actions</div>
      </div>
      <div className="quick-actions">
        {actions.map(a => (
          <a key={a.title} href="#" className="quick-action">
            <div className="quick-action-icon">
              <a.icon size={16} strokeWidth={1.5} />
            </div>
            <div className="quick-action-content">
              <div className="quick-action-title">{a.title}</div>
              <div className="quick-action-desc">{a.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}