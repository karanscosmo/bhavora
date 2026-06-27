"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore, useUIStore } from '@/stores';
import { Brain, CheckCircle2, AlertTriangle, ShieldAlert, Zap, Navigation, Droplets, Wind, Share2, Download, Search, Filter, ShieldCheck, ChevronRight, X } from 'lucide-react';

const INSIGHTS = [
  {
    id: 'i1',
    category: 'Energy Infrastructure',
    icon: Zap,
    title: 'Eastern Zone Grid Reinforcement Required by Q3 2025',
    summary: 'Substation #11 (Electronic City) is at 87% capacity. Based on 18-month demand trend and 3 pending industrial permits, overload is projected by Q3 2025.',
    evidence: ['Demand growth: +28% since Jan 2024', 'Substation #7 last maintenance: 8 months ago', 'Population growth NE corridor: +18% (2yr)'],
    sources: ['Energy Grid Model', 'BESCOM Reports', 'BBMP Permit DB'],
    impact: 'Risk of blackout for 14,000 households — ₹230 Cr economic exposure',
    confidence: 92,
    status: 'new',
    methodology: ['Energy Grid Model (IEC 60038)', 'Load Duration Curve'],
    ifNotActed: ['Blackout risk in NE zone by Q3 2027', '14,000 households affected'],
  },
  {
    id: 'i2',
    category: 'Transport Optimization',
    icon: Navigation,
    title: 'Silk Board Signal Optimization — Immediate ROI Opportunity',
    summary: 'Adaptive signal timing at 6 key junctions on Silk Board corridor can reduce average vehicle delay by 4 minutes and cut intersection-level congestion by 22%.',
    evidence: ['Current average speed: 8 km/h', '3 of 6 target signals using fixed timing', 'Peak hour volume: 4,200 PCU/hr'],
    sources: ['BPR Traffic Model', 'BMTC Route Data', 'OSM Traffic Layer'],
    impact: '↓ 22% congestion at 6 junctions, saving 4 min/vehicle',
    confidence: 87,
    status: 'new',
    methodology: ['BPR Traffic Function (TRB 1965)', 'Modal Split Logit Model'],
    ifNotActed: ['Congestion spreads to adjacent roads within 6 months'],
  },
  {
    id: 'i3',
    category: 'Water Sustainability',
    icon: Droplets,
    title: 'Bellandur Groundwater Emergency Protocol Required',
    summary: 'Groundwater levels in Bellandur catchment have fallen 2.3m since January 2025. At current depletion rate, eastern Bengaluru deficit will reach 470 MLD by 2027.',
    evidence: ['Groundwater depletion: 2.3m since Jan 2025', '78% of Electronic City dependent on groundwater'],
    sources: ['IWA Water Balance Model', 'BWSSB Data'],
    impact: 'Without intervention: 280,000 residents face water scarcity risk by 2027',
    confidence: 84,
    status: 'under-review',
    methodology: ['IWA Water Balance Methodology', 'Population Growth Model'],
    ifNotActed: ['Water scarcity for 280,000 residents', 'Accelerated illegal borewells'],
  },
  {
    id: 'i4',
    category: 'Air Quality',
    icon: Wind,
    title: 'Whitefield Industrial Dust Suppression — 12-Point AQI Improvement',
    summary: 'Implementing mandatory water curtain and dust suppression at 4 active construction sites and 2 industrial compounds in Whitefield can reduce PM2.5 by 18 µg/m³.',
    evidence: ['Current Whitefield AQI: 168 (Unhealthy)', 'Construction activity +34% YoY', 'Air quality monitoring: 3 stations in red zone'],
    sources: ['AQI Composite Model', 'CPCB AQI Data'],
    impact: '↓ 18 AQI pts for 2.1L Whitefield residents within 2 weeks',
    confidence: 79,
    status: 'actioned',
    methodology: ['AQI Composite Model', 'IPCC Tier 2 Emission Methodology'],
    ifNotActed: ['AQI exceeds 200 threshold by July 2025'],
  },
];

const STATUS_LABELS: Record<string, string> = {
  new: 'Live Intel',
  'under-review': 'Under Review',
  actioned: 'Actioned',
  dismissed: 'Dismissed',
};

function InsightCard({
  insight, isSelected, onSelect, onAction
}: {
  insight: typeof INSIGHTS[0]; isSelected: boolean; onSelect: () => void; onAction: () => void;
}) {
  const Icon = insight.icon;
  const isHighConfidence = insight.confidence >= 85;
  const confidenceColor = isHighConfidence ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-amber)]';
  
  return (
    <div 
      onClick={onSelect}
      className={`bg-white border rounded-xl p-5 cursor-pointer transition-all ${
        isSelected 
          ? 'border-[var(--accent-blue)] shadow-md ring-1 ring-[var(--accent-blue)]' 
          : 'border-[var(--slate-200)] shadow-sm hover:border-[var(--slate-300)]'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--slate-50)] text-[var(--slate-600)] border border-[var(--slate-200)]">
            <Icon size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest">{insight.category}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                insight.status === 'new' ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]' :
                insight.status === 'under-review' ? 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]' :
                'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]'
              }`}>
                {STATUS_LABELS[insight.status]}
              </span>
              {insight.status === 'new' && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent-red)] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" /> New
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${confidenceColor}`}>{insight.confidence}%</div>
          <div className="text-[9px] font-bold text-[var(--slate-400)] uppercase tracking-widest mt-0.5">Confidence</div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-[var(--slate-900)] leading-snug mb-2">{insight.title}</h3>
      <p className="text-xs text-[var(--slate-600)] leading-relaxed mb-4 line-clamp-2">{insight.summary}</p>

      <div className="bg-[var(--slate-50)] rounded-lg p-3 border border-[var(--slate-100)] mb-4">
        <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1">Projected Impact</div>
        <div className="text-xs font-semibold text-[var(--accent-teal)]">{insight.impact}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {insight.sources.map((s, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-white border border-[var(--slate-200)] flex items-center justify-center text-[8px] font-bold text-[var(--slate-500)] shadow-sm" title={s}>
              {s.substring(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onAction(); }}
          className="px-4 py-1.5 bg-[var(--slate-900)] hover:bg-[var(--slate-800)] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          View Intel Brief
        </button>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { addNotification } = useAppStore();
  const [selectedInsightId, setSelectedInsightId] = useState<string>('i1');
  const [searchQ, setSearchQ] = useState('');
  
  const selectedInsight = INSIGHTS.find(i => i.id === selectedInsightId)!;
  const SelectedIcon = selectedInsight.icon;
  const isHighConfidence = selectedInsight.confidence >= 85;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-50)] text-[var(--slate-800)]">
      
      {/* Left Column: Feed */}
      <div className="w-[420px] bg-white border-r border-[var(--slate-200)] flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-[var(--slate-200)] bg-[var(--slate-50)] shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--slate-900)] text-white flex items-center justify-center">
              <Brain size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest">AI Intelligence</h1>
              <div className="text-[10px] text-[var(--slate-500)] font-semibold mt-0.5">Live Predictive Briefs</div>
            </div>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate-400)]" />
            <input 
              placeholder="Search intelligence briefs..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[var(--slate-200)] rounded-lg text-xs focus:outline-none focus:border-[var(--accent-blue)] transition-colors shadow-sm"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[var(--slate-50)]">
          {INSIGHTS.map(insight => (
            <InsightCard 
              key={insight.id} 
              insight={insight} 
              isSelected={selectedInsightId === insight.id}
              onSelect={() => setSelectedInsightId(insight.id)}
              onAction={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Detail Brief */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[800px] mx-auto">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[var(--accent-blue)]" /> Official Intel Brief
                </span>
                <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-widest border-l border-[var(--slate-200)] pl-3">
                  ID: {selectedInsight.id.toUpperCase()}-2026
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--slate-900)] leading-tight">{selectedInsight.title}</h1>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-[var(--slate-200)] rounded-lg text-[var(--slate-600)] hover:bg-[var(--slate-50)] transition-colors">
                <Share2 size={16} />
              </button>
              <button className="p-2 bg-white border border-[var(--slate-200)] rounded-lg text-[var(--slate-600)] hover:bg-[var(--slate-50)] transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-[var(--slate-200)] rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-[var(--slate-200)] bg-[var(--slate-50)] flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-white border border-[var(--slate-200)] shadow-sm ${isHighConfidence ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-amber)]'}`}>
                <SelectedIcon size={24} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1">Executive Summary</div>
                <p className="text-sm text-[var(--slate-700)] leading-relaxed">{selectedInsight.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[var(--slate-200)] border-b border-[var(--slate-200)]">
              <div className="p-6">
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-3">Model Confidence</div>
                <div className="flex items-end gap-3">
                  <div className={`text-4xl font-bold ${isHighConfidence ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-amber)]'} leading-none`}>
                    {selectedInsight.confidence}%
                  </div>
                  <div className="text-xs font-bold text-[var(--slate-500)] uppercase mb-1">
                    {isHighConfidence ? 'High Certainty' : 'Moderate Variance'}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-3">Projected Impact Value</div>
                <div className="text-sm font-bold text-[var(--accent-teal)] leading-snug">{selectedInsight.impact}</div>
              </div>
            </div>

            <div className="p-6">
              <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Evidence & Indicators</div>
              <ul className="space-y-3">
                {selectedInsight.evidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[var(--accent-teal)] shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--slate-700)]">{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-[var(--slate-200)] rounded-2xl shadow-sm p-6">
              <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Methodology Framework</div>
              <ul className="space-y-2">
                {selectedInsight.methodology.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[var(--slate-600)] bg-[var(--slate-50)] px-3 py-2 rounded-lg border border-[var(--slate-100)] font-mono">
                    <span className="text-[var(--accent-blue)] font-bold">{i+1}.</span> {m}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white border border-[var(--slate-200)] rounded-2xl shadow-sm p-6">
              <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Data Sources</div>
              <div className="flex flex-wrap gap-2">
                {selectedInsight.sources.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-lg text-xs font-semibold text-[var(--slate-600)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {selectedInsight.ifNotActed.length > 0 && (
            <div className="bg-[var(--accent-red)]/5 border border-[var(--accent-red)]/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--accent-red)] uppercase tracking-widest mb-3">
                <AlertTriangle size={14} /> Critical: If Not Acted Upon
              </div>
              <ul className="space-y-2">
                {selectedInsight.ifNotActed.map((n, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[var(--accent-red)] font-bold">→</span>
                    <span className="text-sm text-[var(--slate-800)] font-medium">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button className="px-6 py-2.5 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-sm font-bold text-[var(--slate-700)] rounded-lg transition-colors">
              Dismiss Brief
            </button>
            <button 
              onClick={() => {
                addNotification({ title: 'Task Created', message: 'Insight escalated to action queue', severity: 'success' });
              }}
              className="px-6 py-2.5 bg-[var(--slate-900)] hover:bg-[var(--slate-800)] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              Take Action
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
