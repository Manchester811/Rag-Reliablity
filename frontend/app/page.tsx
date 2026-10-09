'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppShell from './components/shell/AppShell';
import { TabType } from './components/shell/Sidebar';

import HeroSection from './components/dashboard/HeroSection';
import SummaryMetrics from './components/dashboard/SummaryMetrics';
import ReliabilityOverview from './components/dashboard/ReliabilityOverview';
import KeyMetrics from './components/dashboard/KeyMetrics';
import DocumentLabMini from './components/dashboard/DocumentLabMini';
import RAGPlaygroundMini from './components/dashboard/RAGPlaygroundMini';

import DocumentWorkspace from './components/workspaces/DocumentWorkspace';
import PlaygroundWorkspace from './components/workspaces/PlaygroundWorkspace';
import ExperimentWorkspace from './components/workspaces/ExperimentWorkspace';
import FailureWorkspace from './components/workspaces/FailureWorkspace';
import AdversarialWorkspace from './components/workspaces/AdversarialWorkspace';
import OptimizerWorkspace from './components/workspaces/OptimizerWorkspace';
import SelfImprovementWorkspace from './components/workspaces/SelfImprovementWorkspace';

import { DocumentItem, DashboardStats } from './types';

const API = '/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: dash, refetch: refetchDash } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch(`${API}/dashboard`);
      if (!res.ok) {
        return { overall_score: 0, experiments: 0, tests: 0, failures: 0, critical_failures: 0 };
      }
      return res.json();
    },
  });

  const { data: documents = [], refetch: refetchDocs } = useQuery<DocumentItem[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await fetch(`${API}/documents`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch(`${API}/health`);
      if (!res.ok) return { status: 'down' };
      return res.json();
    },
  });

  const backendOnline = health?.status === 'ok';

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      systemHealth={{
        frontend: true,
        backend: backendOnline,
        database: true,
        ragEngine: true,
        llmProvider: true,
      }}
    >
      {activeTab === 'dashboard' && (
        <div className="space-y-6 px-2 sm:px-4 md:px-6">
          <HeroSection
            onRunExperiment={() => setActiveTab('experiments')}
            onUploadDocument={() => setActiveTab('document-lab')}
          />

          <SummaryMetrics />

          <ReliabilityOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DocumentLabMini
              documents={documents}
              onUploadSuccess={refetchDocs}
              onViewAll={() => setActiveTab('document-lab')}
            />
            <RAGPlaygroundMini
              documents={documents}
              onGoToFullPlayground={() => setActiveTab('rag-playground')}
            />
          </div>

          <KeyMetrics />
        </div>
      )}

      {activeTab === 'document-lab' && (
        <DocumentWorkspace documents={documents} onRefresh={refetchDocs} />
      )}

      {activeTab === 'rag-playground' && (
        <PlaygroundWorkspace documents={documents} />
      )}

      {activeTab === 'experiments' && (
        <ExperimentWorkspace onRefreshStats={refetchDash} />
      )}

      {activeTab === 'failures' && (
        <FailureWorkspace />
      )}

      {activeTab === 'adversarial' && (
        <AdversarialWorkspace />
      )}

      {activeTab === 'auto-optimizer' && (
        <OptimizerWorkspace />
      )}

      {activeTab === 'self-improvement' && (
        <SelfImprovementWorkspace />
      )}
    </AppShell>
  );
}