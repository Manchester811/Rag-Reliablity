'use client';

import React, { useState } from 'react';
import Sidebar, { TabType } from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pageTitle?: string;
  systemHealth?: {
    frontend?: boolean;
    backend?: boolean;
    database?: boolean;
    ragEngine?: boolean;
    llmProvider?: boolean;
  };
}

const PAGE_TITLES: Record<TabType, string> = {
  dashboard: 'Dashboard',
  'document-lab': 'Document Lab',
  'rag-playground': 'RAG Playground',
  experiments: 'Experiments',
  failures: 'Failures',
  adversarial: 'Adversarial Testing',
  'auto-optimizer': 'Auto-Optimizer',
  'self-improvement': 'Self-Improvement',
};

export default function AppShell({
  children,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  pageTitle,
  systemHealth,
}: AppShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const title = pageTitle ?? PAGE_TITLES[activeTab] ?? 'Dashboard';
  const backendOnline = systemHealth?.backend ?? true;
  const systemStatus: 'online' | 'offline' | 'degraded' = backendOnline ? 'online' : 'offline';

  return (
    <div className="app-shell-container">
      <div className="app-shell">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          systemHealth={systemHealth}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden bg-transparent">
          <TopBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            pageTitle={title}
            systemStatus={systemStatus}
            onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-6 space-y-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}