"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarioStore, useSimulationStore, useAppStore } from '@/stores';
import { exportToCSV } from '@/lib/exportUtils';
import {
  GitCommit, GitBranch, GitMerge, FileArchive, Search, Plus, Filter, Play, CheckCircle2,
  Trash2, Archive, Download, Clock, User, ChevronRight, Activity, Zap, Droplets, BookOpen
} from 'lucide-react';
import type { Scenario } from '@/stores';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

export default function ScenariosPage() {
  const router = useRouter();
  const {
    scenarios, compareIds, toggleCompare, clearCompare,
    deleteScenario, archiveScenario, approveScenario, loadScenario,
  } = useScenarioStore();
  const { addNotification } = useAppStore();

  const [activeTab, setActiveTab] = useState<'main' | 'archives' | 'approved'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const filteredScenarios = useMemo(() => {
    let list = scenarios.filter(s => {
      if (activeTab === 'approved' && s.status !== 'approved') return false;
      if (activeTab === 'archives' && s.status !== 'archived') return false;
      if (activeTab === 'main' && s.status === 'archived') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q)
          || s.description.toLowerCase().includes(q)
          || s.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [scenarios, activeTab, searchQuery]);

  const handleLoad = (id: string) => {
    loadScenario(id);
    addNotification({ title: 'Branch Checked Out', message: 'Scenario policy loaded into Decision Twin.', severity: 'success' });
    router.push('/decision-twin');
  };

  const getMetricIcon = (key: string) => {
    if (key.includes('metro') || key.includes('road')) return <Zap size={14} className="text-[var(--accent-teal)]"/>;
    if (key.includes('water')) return <Droplets size={14} className="text-[var(--accent-blue)]"/>;
    return <Activity size={14} className="text-[var(--slate-500)]"/>;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-50)] text-[var(--slate-800)]">
      
      {/* LEFT: Repository Sidebar */}
      <div className="w-[280px] border-r border-[var(--slate-200)] bg-white flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="p-4 border-b border-[var(--slate-200)]">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-[var(--slate-600)]" />
            <h2 className="text-sm font-bold text-[var(--slate-900)]">Scenario Repository</h2>
          </div>
          <button 
            onClick={() => router.push('/decision-twin')}
            className="w-full flex items-center justify-center gap-2 bg-[var(--accent-navy)] hover:bg-[var(--accent-navy)]/90 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} /> New Branch
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 mb-2">
            <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest px-2 mb-1">Views</div>
            <button 
              onClick={() => setActiveTab('main')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'main' ? 'bg-[var(--slate-100)] text-[var(--slate-900)]' : 'text-[var(--slate-600)] hover:bg-[var(--slate-50)]'
              }`}
            >
              <GitBranch size={14} /> Active Branches
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'approved' ? 'bg-[var(--slate-100)] text-[var(--slate-900)]' : 'text-[var(--slate-600)] hover:bg-[var(--slate-50)]'
              }`}
            >
              <CheckCircle2 size={14} /> Approved Mainlines
            </button>
            <button 
              onClick={() => setActiveTab('archives')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'archives' ? 'bg-[var(--slate-100)] text-[var(--slate-900)]' : 'text-[var(--slate-600)] hover:bg-[var(--slate-50)]'
              }`}
            >
              <Archive size={14} /> Archives
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Git History View */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-[var(--slate-200)] px-6 py-4 bg-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--slate-600)] mb-1">
              <span className="text-[var(--accent-blue)]">bhavora-os</span> 
              <span className="text-[var(--slate-400)]">/</span> 
              <span>scenarios</span>
            </div>
            <h1 className="text-lg font-bold text-[var(--slate-900)] flex items-center gap-2">
              <GitCommit size={18} className="text-[var(--slate-400)]" /> Commit History
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate-400)]" />
              <input 
                placeholder="Search branches or commits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-3 py-1.5 text-xs border border-[var(--slate-200)] rounded-md focus:outline-none focus:border-[var(--accent-blue)] transition-colors bg-[var(--slate-50)]"
              />
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--slate-50)]">
          <div className="max-w-[900px] mx-auto bg-white border border-[var(--slate-200)] rounded-xl shadow-sm overflow-hidden">
            
            <div className="px-4 py-3 bg-[var(--slate-100)] border-b border-[var(--slate-200)] flex justify-between items-center text-xs font-semibold text-[var(--slate-600)]">
              <div className="flex items-center gap-4">
                <GitBranch size={16} /> 
                {filteredScenarios.length} Commits
              </div>
              <div className="flex gap-4">
                <span className="w-32">Status</span>
                <span className="w-24 text-right">Impact Score</span>
                <span className="w-16 text-right">Actions</span>
              </div>
            </div>

            <div className="divide-y divide-[var(--slate-200)]">
              {filteredScenarios.length === 0 ? (
                <div className="p-12 text-center text-[var(--slate-500)] flex flex-col items-center justify-center">
                  <FileArchive size={32} className="mb-4 text-[var(--slate-300)]" />
                  <p className="text-sm font-semibold">No commits found.</p>
                  <p className="text-xs">Create a new branch in the Decision Twin to save a scenario.</p>
                </div>
              ) : (
                filteredScenarios.map((s, idx) => {
                  const isExpanded = selectedScenario?.id === s.id;
                  const commitHash = s.id.substring(0, 7);
                  
                  return (
                    <div key={s.id} className="transition-colors hover:bg-[var(--slate-50)]">
                      {/* Commit Row Header */}
                      <div 
                        onClick={() => setSelectedScenario(isExpanded ? null : s)}
                        className="px-4 py-3 flex items-start gap-4 cursor-pointer"
                      >
                        <div className="pt-1">
                          <GitCommit size={16} className={s.status === 'approved' ? 'text-[var(--accent-teal)]' : 'text-[var(--slate-400)]'} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-[var(--slate-900)] truncate">{s.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[var(--slate-100)] border border-[var(--slate-200)] text-[10px] font-mono font-bold text-[var(--slate-500)]">
                              {commitHash}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-[var(--slate-500)]">
                            <span className="flex items-center gap-1 font-medium"><User size={12}/> {s.tags[0] || 'System User'}</span>
                            <span>committed {timeAgo(s.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="w-32 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${s.status === 'approved' ? 'bg-[var(--accent-teal)]' : s.status === 'archived' ? 'bg-[var(--slate-400)]' : 'bg-[var(--accent-blue)]'}`} />
                            <span className="text-xs font-semibold text-[var(--slate-700)] capitalize">{s.status === 'simulated' ? 'Draft' : s.status}</span>
                          </div>
                          <div className="w-24 text-right">
                            <span className={`text-xs font-bold font-mono px-2 py-1 rounded bg-[var(--slate-100)] border border-[var(--slate-200)] ${s.results.cityHealth.delta >= 0 ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-red)]'}`}>
                              {s.results.cityHealth.delta > 0 ? '+' : ''}{s.results.cityHealth.delta.toFixed(1)}
                            </span>
                          </div>
                          <div className="w-16 flex justify-end gap-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleLoad(s.id); }}
                              className="p-1.5 rounded-md hover:bg-white border border-transparent hover:border-[var(--slate-300)] text-[var(--slate-500)] hover:text-[var(--accent-navy)] transition-all shadow-sm"
                              title="Checkout branch"
                            >
                              <Play size={14} />
                            </button>
                            <button className="p-1.5 rounded-md text-[var(--slate-400)] hover:text-[var(--slate-800)] transition-colors">
                              <ChevronRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Commit Diff Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white border-t border-[var(--slate-100)]"
                          >
                            <div className="p-5 pl-12 flex gap-6">
                              
                              {/* Left: Policy Changes (Diffs) */}
                              <div className="flex-1">
                                <h4 className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-3 border-b border-[var(--slate-200)] pb-1">Policy Diffs</h4>
                                <div className="space-y-2">
                                  {Object.entries(s.policies).filter(([_, v]) => v > 0).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-3 text-xs bg-[var(--accent-teal)]/5 border border-[var(--accent-teal)]/20 px-3 py-1.5 rounded-md font-mono">
                                      <span className="text-[var(--accent-teal)] font-bold">+</span>
                                      <span className="text-[var(--slate-700)] flex-1">{k.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</span>
                                      <span className="font-bold text-[var(--accent-teal)]">{v}%</span>
                                    </div>
                                  ))}
                                  {Object.values(s.policies).filter(v => v > 0).length === 0 && (
                                    <div className="text-xs text-[var(--slate-500)] italic">No policy modifications in this commit.</div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Output Impacts */}
                              <div className="w-[300px] shrink-0 border-l border-[var(--slate-200)] pl-6">
                                <h4 className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-3 border-b border-[var(--slate-200)] pb-1">Impact Outputs</h4>
                                <div className="space-y-3">
                                  {[
                                    { label: 'City Health', val: s.results.cityHealth.after, del: s.results.cityHealth.delta, inv: false },
                                    { label: 'Carbon Eq', val: s.results.co2.after, del: s.results.co2.delta, inv: true },
                                    { label: 'Traffic Vol', val: s.results.traffic.after, del: s.results.traffic.delta, inv: true },
                                  ].map(m => {
                                    const isGood = m.inv ? m.del < 0 : m.del > 0;
                                    return (
                                      <div key={m.label} className="flex justify-between items-center text-xs">
                                        <span className="text-[var(--slate-600)] font-semibold">{m.label}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-[var(--slate-900)] font-mono">{m.val}</span>
                                          <span className={`font-bold font-mono ${isGood ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-red)]'}`}>
                                            ({m.del > 0 ? '+' : ''}{m.del})
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="mt-6 pt-4 border-t border-[var(--slate-200)] flex gap-2">
                                  {s.status !== 'approved' && (
                                    <button 
                                      onClick={() => { approveScenario(s.id); addNotification({ title: 'Merged', message: 'Scenario approved into mainline', severity: 'success' }); }}
                                      className="flex-1 flex items-center justify-center gap-1 bg-[var(--slate-900)] hover:bg-[var(--slate-800)] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 rounded transition-colors"
                                    >
                                      <GitMerge size={12}/> Merge Approval
                                    </button>
                                  )}
                                  {s.status !== 'archived' && (
                                    <button 
                                      onClick={() => { archiveScenario(s.id); addNotification({ title: 'Archived', message: 'Scenario archived', severity: 'info' }); }}
                                      className="px-3 bg-[var(--slate-100)] hover:bg-[var(--slate-200)] text-[var(--slate-600)] rounded transition-colors"
                                      title="Archive"
                                    >
                                      <Archive size={14}/>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
