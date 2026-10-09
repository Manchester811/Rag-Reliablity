'use client';

import React from 'react';
import { Search, Moon, Bell, Menu } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pageTitle?: string;
  systemStatus?: 'online' | 'offline' | 'degraded';
  onToggleMobileSidebar?: () => void;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  pageTitle = 'Dashboard',
  systemStatus = 'online',
  onToggleMobileSidebar,
}: TopBarProps) {
  return (
    <header className="h-12 border-b border-[rgba(255,255,255,0.08)] px-4 md:px-6 flex items-center justify-between gap-4 bg-[#0D0D12] relative z-10 shrink-0">
      <div className="flex items-center gap-4">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.04)] transition-colors shrink-0"
            title="Open menu"
          >
            <Menu size={18} />
          </button>
        )}
        <h1 className="text-[15px] font-semibold text-[#F5F5F7] tracking-tight">
          {pageTitle}
        </h1>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#71717A]">
          <span className={`w-1.5 h-1.5 rounded-full ${
            systemStatus === 'online' ? 'bg-[#22C55E]' : systemStatus === 'degraded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
          }`} />
          <span>● System Operational</span>
        </div>
      </div>

      <div className="relative flex-1 max-w-lg">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search documents, experiments, failures..."
          className="input-field pl-10 pr-10 py-2 rounded-lg"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono text-[#71717A]">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          title="Theme"
        >
          <Moon size={15} />
        </button>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.04)] transition-colors relative"
          title="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.08)] cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] text-white flex items-center justify-center text-[11px] font-semibold">
            RJ
          </div>
          <span className="text-[13px] font-medium text-[#F5F5F7] group-hover:text-[#A78BFA] transition-colors hidden md:inline">
            Rishabh Jain
          </span>
        </div>
      </div>
    </header>
  );
}