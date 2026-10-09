import React from 'react';
import {
  LayoutDashboard, FileText, Search, FlaskConical, AlertTriangle,
  ShieldAlert, Wrench, Sparkles, Activity, Settings, User
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Document Lab', icon: FileText },
  { label: 'RAG Playground', icon: Search },
  { label: 'Experiments', icon: FlaskConical },
  { label: 'Failures', icon: AlertTriangle },
  { label: 'Adversarial', icon: ShieldAlert },
  { label: 'Optimizer', icon: Wrench },
  { label: 'Self-Improve', icon: Sparkles },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="p-3 flex justify-center">
          <div className="w-8 h-8 rounded-lg bg-accent-lime flex items-center justify-center text-[10px] font-black text-bg-primary tracking-tight">
            RAG
          </div>
        </div>
        <nav className="sidebar-nav mt-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              title={item.label}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span className="sidebar-label text-[11px] font-medium text-text-secondary">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto p-3 flex flex-col gap-1 border-t border-border-subtle">
          <a href="#" className="sidebar-item" title="Status">
            <Activity size={18} strokeWidth={1.5} />
            <span className="sidebar-label text-[11px] font-medium text-text-secondary">Status</span>
          </a>
          <a href="#" className="sidebar-item" title="Settings">
            <Settings size={18} strokeWidth={1.5} />
            <span className="sidebar-label text-[11px] font-medium text-text-secondary">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-lime shadow-[0_0_8px_rgba(184,227,63,0.5)]" />
            <span className="text-xs font-medium text-text-secondary tracking-tight">RAG Reliability Lab v1.0</span>
          </div>
          <div className="search-container">
            <div className="search-icon"><Search size={14} /></div>
            <input
              type="text"
              placeholder="Search documents, experiments, failures..."
              className="search-input"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="status-dot status-dot-success" title="Online" />
            <div className="h-7 w-7 rounded-full bg-accent-lime-muted flex items-center justify-center text-[10px] font-bold text-accent-lime">AS</div>
          </div>
        </header>

        <section className="dashboard">
          {children}
        </section>
      </main>
    </div>
  );
}
