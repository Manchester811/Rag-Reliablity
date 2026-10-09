import React from 'react';
import { Activity, Server, Database, Cpu, HardDrive, Zap } from 'lucide-react';

export function SystemStatus() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">System Status</div>
      </div>
      <div className="system-status">
        <div className="status-row">
          <span className="status-name"><Activity size={12} className="inline mr-2" />Frontend</span>
          <span className="status-value"><span className="status-dot status-dot-success" /> Running</span>
        </div>
        <div className="status-row">
          <span className="status-name"><Server size={12} className="inline mr-2" />Backend</span>
          <span className="status-value"><span className="status-dot status-dot-success" /> Running</span>
        </div>
        <div className="status-row">
          <span className="status-name"><Database size={12} className="inline mr-2" />Database</span>
          <span className="status-value"><span className="status-dot status-dot-success" /> Connected</span>
        </div>
        <div className="status-row">
          <span className="status-name"><Zap size={12} className="inline mr-2" />RAG Engine</span>
          <span className="status-value"><span className="status-dot status-dot-lime" /> Ready</span>
        </div>
        <div className="status-row">
          <span className="status-name"><Cpu size={12} className="inline mr-2" />CPU Usage</span>
          <span className="status-value"><span className="text-text-secondary">23%</span></span>
        </div>
        <div className="status-row">
          <span className="status-name"><HardDrive size={12} className="inline mr-2" />Memory</span>
          <span className="status-value"><span className="text-text-secondary">1.2 GB</span></span>
        </div>
      </div>
    </div>
  );
}