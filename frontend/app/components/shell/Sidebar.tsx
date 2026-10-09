'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FlaskConical,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  Sparkles,
  Settings,
  Layers,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'document-lab'
  | 'rag-playground'
  | 'experiments'
  | 'failures'
  | 'adversarial'
  | 'auto-optimizer'
  | 'self-improvement';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  systemHealth?: {
    frontend?: boolean;
    backend?: boolean;
    database?: boolean;
    ragEngine?: boolean;
    llmProvider?: boolean;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navSections = [
  {
    title: 'WORKSPACE',
    items: [
      { id: 'dashboard' as TabType, label: 'Overview', icon: LayoutDashboard },
      { id: 'document-lab' as TabType, label: 'Documents', icon: FileText },
      { id: 'rag-playground' as TabType, label: 'RAG Playground', icon: MessageSquare },
    ]
  },
  {
    title: 'EVALUATION',
    items: [
      { id: 'experiments' as TabType, label: 'Experiments', icon: FlaskConical },
      { id: 'failures' as TabType, label: 'Failures', icon: AlertTriangle },
      { id: 'adversarial' as TabType, label: 'Adversarial Testing', icon: ShieldAlert },
    ]
  },
  {
    title: 'OPTIMIZATION',
    items: [
      { id: 'auto-optimizer' as TabType, label: 'Auto-Optimizer', icon: Wrench },
      { id: 'self-improvement' as TabType, label: 'Self-Improvement', icon: Sparkles },
    ]
  },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  systemHealth,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const backendOnline = systemHealth?.backend ?? true;

  const handleSelect = (id: TabType) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`sidebar fixed inset-y-0 left-0 md:static z-30 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0 shadow-[0_0_40px_rgba(0,0,0,0.8)]' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.25)] flex items-center justify-center">
              <Layers size={16} className="text-[#A78BFA]" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#F5F5F7] tracking-tight">
                RAG
              </div>
              <div className="text-[11px] text-[#71717A]">
                RELIABILITY LAB
              </div>
            </div>
            <span className="ml-auto text-[10px] text-[#71717A] font-medium bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded">
              v1.0
            </span>
          </div>

          <nav className="flex flex-col gap-5">
            {navSections.map((section) => (
              <div key={section.title}>
                <div className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </div>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={isActive ? 2 : 1.75}
                          className={isActive ? 'text-[#A78BFA]' : 'text-[#71717A]'}
                        />
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r bg-[#8B5CF6]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/[0.07] flex flex-col gap-4">
          <div className="px-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#71717A] uppercase tracking-wide mb-3">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
              System Status
            </div>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Frontend</span>
                <span className="flex items-center gap-1.5 text-[#22C55E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Backend</span>
                <span className={`flex items-center gap-1.5 ${backendOnline ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                  {backendOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Database</span>
                <span className="flex items-center gap-1.5 text-[#22C55E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">RAG Engine</span>
                <span className="flex items-center gap-1.5 text-[#22C55E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Ready
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">LLM Provider</span>
                <span className="flex items-center gap-1.5 text-[#22C55E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Ready
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('auto-optimizer')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.04)] transition-colors mx-1"
          >
            <Settings size={16} className="text-[#71717A]" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}