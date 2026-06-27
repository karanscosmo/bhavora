"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarioStore, useSimulationStore, useAppStore } from '@/stores';
import {
  GitBranch, Search, Plus, Play, CheckCircle2,
  Archive, FolderSync, Activity, Zap, Droplets, BookOpen, User, ArrowRight,
  BarChart2, FileText, Download, Sparkles, X, ShieldAlert, TrendingUp, AlertTriangle, Car, Wind
} from 'lucide-react';
import type { Scenario } from '@/stores';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  if (hrs < 24) return `${hrs} hours ago`;
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

export default function ScenariosPage() {
  const router = useRouter();
  const {
    scenarios, compareIds, toggleCompare, clearCompare,
    archiveScenario, approveScenario, loadScenario, saveScenario
  } = useScenarioStore();
  const { addNotification } = useAppStore();

  const [activeTab, setActiveTab] = useState<'main' | 'archives' | 'approved'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredScenarios = useMemo(() => {
    let list = scenarios.filter(s => {
      if (activeTab === 'approved' && s.status !== 'approved') return false;
      if (activeTab === 'archives' && s.status !== 'archived') return false;
      if (activeTab === 'main' && s.status === 'archived') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q)
          || s.description.toLowerCase().includes(q)
          || (s.tags || []).some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [scenarios, activeTab, searchQuery]);

  const handleLoad = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    loadScenario(id);
    addNotification({ title: 'Scenario Loaded', message: 'Scenario policy loaded into Decision Twin.', severity: 'success' });
    router.push('/decision-twin');
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    addNotification({ title: 'Bhavishyavani AI', message: 'Synthesizing optimal policy framework...', severity: 'info' });
    
    setTimeout(() => {
      saveScenario({
        name: 'Carbon-Neutral Bengaluru 2045',
        description: 'AI-generated strategy maximizing metro expansion and renewable grids to hit net-zero targets.',
        category: 'Environment',
        targetYear: 2045,
        priority: 'High',
        tags: ['AI Generated', 'Net-Zero'],
        mapState: {}
      });
      setIsGenerating(false);
      addNotification({ title: 'Scenario Generated', message: 'Carbon-Neutral Bengaluru 2045 added to War Room.', severity: 'success' });
    }, 2500);
  };

  const comparedScenarios = useMemo(() => scenarios.filter(s => compareIds.includes(s.id)), [scenarios, compareIds]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-50)] text-[var(--slate-800)]">
      
      {/* LEFT: Repository Sidebar */}
      <div className="w-[280px] border-r border-[var(--slate-200)] bg-white flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="p-4 border-b border-[var(--slate-200)]">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-[var(--slate-600)]" />
            <h2 className="text-sm font-bold text-[var(--slate-900)]">Policy Scenarios</h2>
          </div>
          <button 
            onClick={() => router.push('/decision-twin')}
            className="w-full flex items-center justify-center gap-2 bg-[var(--slate-900)] hover:bg-[var(--slate-800)] text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm mb-2"
          >
            <Plus size={14} /> New Scenario
          </button>
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] text-xs font-bold py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isGenerating ? <Activity className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Generate with AI
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
              <GitBranch size={14} /> Active Scenarios
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'approved' ? 'bg-[var(--slate-100)] text-[var(--slate-900)]' : 'text-[var(--slate-600)] hover:bg-[var(--slate-50)]'
              }`}
            >
              <CheckCircle2 size={14} /> Approved Strategies
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
          
          {compareIds.length > 0 && (
            <div className="px-3 mt-6">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest px-2 mb-2 flex justify-between">
                Compare Mode
                <button onClick={clearCompare} className="hover:underline">Clear</button>
              </div>
              <div className="px-2 space-y-1">
                {comparedScenarios.map(s => (
                  <div key={s.id} className="text-[11px] font-medium bg-[#2563EB]/10 text-[#1D4ED8] px-2 py-1 rounded truncate flex justify-between items-center">
                    {s.name}
                    <button onClick={() => toggleCompare(s.id)}><X size={10} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Main Content Area */}
      <div className="flex-1 flex flex-col bg-[var(--slate-50)] overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-[var(--slate-200)] px-6 py-4 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
              <FolderSync size={24} className="text-[#2563EB]" />
              Policy War Room
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">Evaluate competing futures before spending billions on real-world infrastructure.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate-400)]" />
              <input 
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-3 py-1.5 text-xs border border-[var(--slate-200)] rounded-md focus:outline-none focus:border-[#2563EB] transition-colors bg-[var(--slate-50)]"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          
          {compareIds.length > 1 ? (
            /* COMPARISON DASHBOARD */
            <div className="max-w-[1200px] mx-auto space-y-6">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-[var(--slate-900)] flex items-center gap-2">
                  <BarChart2 className="text-[#2563EB]" /> Scenario Comparison
                </h2>
                <button onClick={clearCompare} className="text-sm text-[var(--slate-500)] hover:text-[#2563EB]">Exit Comparison</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparedScenarios.map(s => (
                  <div key={s.id} className="bg-white rounded-xl shadow-sm border border-[var(--slate-200)] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-[var(--slate-100)] bg-[var(--slate-50)]">
                      <h3 className="font-bold text-lg text-[var(--slate-900)] mb-1 truncate">{s.name}</h3>
                      <div className="text-xs text-[var(--slate-500)]">Target: {s.targetYear || 2035} • {s.category || 'Strategy'}</div>
                    </div>
                    
                    <div className="p-4 space-y-4 flex-1">
                       <div className="flex justify-between items-center py-2 border-b border-[var(--slate-100)]">
                         <span className="text-sm text-[var(--slate-600)] flex items-center gap-2"><Car size={14}/> Traffic Delay</span>
                         <span className={`font-bold font-mono ${s.results.traffic.delta < 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                           {s.results.traffic.delta}%
                         </span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-[var(--slate-100)]">
                         <span className="text-sm text-[var(--slate-600)] flex items-center gap-2"><Zap size={14}/> Power Load</span>
                         <span className={`font-bold font-mono ${s.results.energy.delta < 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                           {s.results.energy.delta > 0 ? '+' : ''}{s.results.energy.delta}%
                         </span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-[var(--slate-100)]">
                         <span className="text-sm text-[var(--slate-600)] flex items-center gap-2"><Droplets size={14}/> Water Demand</span>
                         <span className={`font-bold font-mono ${s.results.water.delta < 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                           {s.results.water.delta > 0 ? '+' : ''}{s.results.water.delta}%
                         </span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-[var(--slate-100)]">
                         <span className="text-sm text-[var(--slate-600)] flex items-center gap-2"><Wind size={14}/> Carbon (CO₂)</span>
                         <span className={`font-bold font-mono ${s.results.co2.delta < 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                           {s.results.co2.delta > 0 ? '+' : ''}{s.results.co2.delta}%
                         </span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-[var(--slate-100)]">
                         <span className="text-sm text-[var(--slate-600)] flex items-center gap-2"><TrendingUp size={14}/> GDP Impact</span>
                         <span className={`font-bold font-mono text-[#10B981]`}>
                           +{(Math.random() * 5 + 3).toFixed(1)}%
                         </span>
                       </div>
                    </div>
                    
                    <div className="p-4 bg-[var(--slate-50)] border-t border-[var(--slate-200)]">
                      <button onClick={(e) => handleLoad(s.id, e)} className="w-full btn btn-primary py-2 text-sm">Load Scenario</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* SCENARIO CARDS GRID */
            <div className="max-w-[1200px] mx-auto">
              
              {filteredScenarios.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-[var(--slate-400)]">
                  <Archive size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-bold">No Scenarios Found</p>
                  <p className="text-sm">Create a new scenario or ask AI to generate one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredScenarios.map(s => {
                    const isSelected = selectedScenario?.id === s.id;
                    const confidence = s.results.confidence ? Math.round(s.results.confidence * 100) : 85 + Math.floor(Math.random() * 10);
                    const impactScore = Math.round(s.results.cityHealth.after);
                    const isComparing = compareIds.includes(s.id);
                    
                    return (
                      <motion.div 
                        layoutId={`card-${s.id}`}
                        key={s.id} 
                        className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer flex flex-col ${
                          isSelected ? 'ring-2 ring-[#2563EB] border-[#2563EB] shadow-md' : 'border-[var(--slate-200)] hover:border-[var(--slate-300)] hover:shadow-md'
                        }`}
                        onClick={() => setSelectedScenario(isSelected ? null : s)}
                      >
                        {/* Card Header */}
                        <div className="p-5 border-b border-[var(--slate-100)] flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`w-2 h-2 rounded-full ${s.status === 'approved' ? 'bg-[#10B981]' : s.status === 'archived' ? 'bg-[var(--slate-400)]' : 'bg-[#F59E0B]'}`} />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--slate-500)]">{s.status === 'simulated' ? 'Active' : s.status}</span>
                            </div>
                            <h3 className="font-bold text-[var(--slate-900)] text-lg leading-tight mb-1">{s.name}</h3>
                            <div className="text-xs text-[var(--slate-500)] flex items-center gap-1">
                              <User size={12}/> Saved {timeAgo(s.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-[var(--slate-400)] uppercase font-bold tracking-wider mb-0.5">Impact</span>
                            <span className={`text-2xl font-black ${impactScore > 65 ? 'text-[#10B981]' : impactScore > 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                              {impactScore}
                            </span>
                          </div>
                        </div>

                        {/* Card Body - Always Visible */}
                        <div className="p-5 flex-1">
                          <p className="text-sm text-[var(--slate-600)] line-clamp-2 mb-4">{s.description || 'No description provided.'}</p>
                          
                          <div className="flex items-center justify-between text-xs font-mono mb-4 bg-[var(--slate-50)] p-2 rounded">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-[var(--slate-500)] font-sans uppercase">Target</span>
                              <span className="font-bold text-[var(--slate-700)]">{s.targetYear || 2035}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-[var(--slate-500)] font-sans uppercase">Confidence</span>
                              <span className="font-bold text-[var(--slate-700)]">{confidence}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-[var(--slate-500)] font-sans uppercase">Category</span>
                              <span className="font-bold text-[var(--slate-700)]">{s.category || 'General'}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(s.tags || []).slice(0, 3).map(t => (
                              <span key={t} className="px-2 py-1 bg-[#2563EB]/5 text-[#2563EB] rounded text-[10px] font-semibold border border-[#2563EB]/20">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 border-t border-[var(--slate-100)] flex gap-2">
                          <button 
                            onClick={(e) => handleLoad(s.id, e)}
                            className="flex-1 bg-[var(--slate-900)] hover:bg-[var(--slate-800)] text-white text-xs font-bold py-2 rounded transition-colors flex justify-center items-center gap-1.5"
                          >
                            <Play size={12}/> Load
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleCompare(s.id); }}
                            className={`px-3 py-2 text-xs font-bold rounded border transition-colors ${
                              isComparing ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white border-[var(--slate-200)] text-[var(--slate-600)] hover:bg-[var(--slate-50)]'
                            }`}
                          >
                            {isComparing ? 'Comparing' : 'Compare'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* EXECUTIVE DECISION SUPPORT MODAL (Bottom Sheet style) */}
          <AnimatePresence>
            {selectedScenario && compareIds.length <= 1 && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-[var(--slate-200)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 flex"
                style={{ height: '320px' }}
              >
                <button 
                  onClick={() => setSelectedScenario(null)}
                  className="absolute top-4 right-4 text-[var(--slate-400)] hover:text-[var(--slate-800)] p-1 bg-[var(--slate-100)] rounded-full"
                >
                  <X size={16} />
                </button>
                
                <div className="w-1/3 p-8 border-r border-[var(--slate-200)] overflow-y-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={18} className="text-[#2563EB]" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--slate-500)]">Executive Decision Support</h2>
                  </div>
                  <h3 className="text-2xl font-black text-[var(--slate-900)] mb-4">{selectedScenario.name}</h3>
                  
                  <div className="bg-[#10B981]/10 border border-[#10B981]/20 p-4 rounded-xl mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[#047857]">Recommended?</span>
                      <span className="px-2 py-0.5 bg-[#10B981] text-white text-xs font-black rounded uppercase">YES</span>
                    </div>
                    <p className="text-xs text-[#065F46] leading-relaxed">
                      This strategy provides the highest ROI for congestion reduction while meeting 2035 carbon targets. Immediate action required on Metro Phase 3 funding.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-3 border border-[var(--slate-200)] rounded-lg hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors group">
                      <FileText size={20} className="text-[var(--slate-400)] group-hover:text-[#2563EB] mb-2" />
                      <span className="text-xs font-bold text-[var(--slate-600)] group-hover:text-[#2563EB]">Executive Brief</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 border border-[var(--slate-200)] rounded-lg hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors group">
                      <Download size={20} className="text-[var(--slate-400)] group-hover:text-[#2563EB] mb-2" />
                      <span className="text-xs font-bold text-[var(--slate-600)] group-hover:text-[#2563EB]">Export PDF</span>
                    </button>
                  </div>
                </div>

                <div className="w-2/3 p-8 bg-[var(--slate-50)] grid grid-cols-2 gap-8 overflow-y-auto">
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--slate-500)] flex items-center gap-2 mb-4">
                      <CheckCircle2 size={14} className="text-[#10B981]" /> Expected Benefits
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                        <span className="text-[#10B981] font-bold mt-0.5">+</span>
                        Reduces overall network congestion by {Math.abs(selectedScenario.results.traffic.delta)}% during peak hours.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                        <span className="text-[#10B981] font-bold mt-0.5">+</span>
                        Drops carbon emissions below the critical 2030 threshold.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                        <span className="text-[#10B981] font-bold mt-0.5">+</span>
                        Boosts GDP throughput in major IT corridors (Whitefield, ORR).
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--slate-500)] flex items-center gap-2 mb-4">
                      <AlertTriangle size={14} className="text-[#EF4444]" /> Potential Risks
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                        <span className="text-[#EF4444] font-bold mt-0.5">-</span>
                        Grid load increases significantly due to EV adoption targets; substations in South zone at risk.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                        <span className="text-[#EF4444] font-bold mt-0.5">-</span>
                        Short-term construction disruption reduces local mobility scores.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-[var(--slate-700)]">
                        <span className="text-[#EF4444] font-bold mt-0.5">-</span>
                        Requires 14% budget reallocation from secondary road maintenance.
                      </li>
                    </ul>
                  </div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
