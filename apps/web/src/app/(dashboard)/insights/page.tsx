"use client";

import React, { useState } from 'react';
import { Brain, AlertTriangle, Lightbulb, FileText, ChevronRight, CheckCircle2, TrendingDown, Target, Building2, MapPin } from 'lucide-react';

type Brief = {
  id: string;
  title: string;
  type: 'Risk' | 'Opportunity' | 'Optimization';
  confidence: number;
  districts: string[];
  summary: string;
  roi: string;
  evidence: string[];
  recommendation: string;
  riskIfIgnored: string;
};

const INSIGHTS: Brief[] = [
  {
    id: 'INT-992-A',
    title: 'Impending Water Deficit in Bellandur Tech Corridor',
    type: 'Risk',
    confidence: 94,
    districts: ['Bellandur', 'Whitefield', 'Marathahalli'],
    summary: 'Analysis of recent commercial zoning approvals alongside current BWSSB supply metrics indicates a 22% water supply deficit by Q3 2026 if infrastructure is not preemptively upgraded.',
    roi: '-₹450 Cr/yr (Lost GDP due to operational halts)',
    evidence: [
      'BWSSB Q2 Supply Data: 45 MLD deficit baseline.',
      'Approved Commercial Zoning: +2M sqft expected by 2026.',
      'Groundwater depletion rate: 1.2m/year drop in local aquifers.'
    ],
    recommendation: 'Mandate zero-liquid-discharge (ZLD) systems for all new tech parks and allocate ₹120 Cr CapEx for tertiary treatment plant expansion at Bellandur Lake.',
    riskIfIgnored: 'Severe water rationing leading to IT park operational disruption and corporate relocation.'
  },
  {
    id: 'INT-404-B',
    title: 'Optimal EV Charging Hub Locations via Traffic Density',
    type: 'Opportunity',
    confidence: 88,
    districts: ['Electronic City', 'Silk Board', 'Hebbal'],
    summary: 'Traffic assignment models cross-referenced with BESCOM sub-station load capacities reveal 4 optimal locations for fast-charging hubs that minimize grid stress while maximizing accessibility.',
    roi: '₹12 Cr/yr (New Revenue) + 40ktCO₂ reduction',
    evidence: [
      'BTP Traffic Density: Peak EV passing rate > 400/hr.',
      'BESCOM Grid Capacity: >2MW surplus off-peak at these nodes.',
    ],
    recommendation: 'Initiate public-private partnership (PPP) tenders for 500kW fast-charging plazas at the 4 identified junctions.',
    riskIfIgnored: 'Unregulated localized charging will overload residential transformers, leading to micro-blackouts.'
  }
];

export default function InsightsPage() {
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-64px)] overflow-y-auto bg-[var(--bg-base)]">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <Brain className="text-[#2563EB]" /> AI Intelligence Briefs
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Automated pattern recognition and predictive risk analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INSIGHTS.map((brief) => (
          <div key={brief.id} className="card p-6 flex flex-col justify-between hover:border-[#2563EB] transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`badge ${brief.type === 'Risk' ? 'badge-danger' : 'badge-success'}`}>
                  {brief.type}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{brief.id}</span>
              </div>
              
              <h2 className="text-lg font-bold text-[var(--text-primary)] leading-tight mb-2">{brief.title}</h2>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">{brief.summary}</p>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-[var(--text-muted)] mb-6">
                <div className="flex items-center gap-1">
                  <Target size={14} className={brief.confidence > 90 ? 'text-[#10B981]' : 'text-[#F59E0B]'} />
                  {brief.confidence}% Confidence
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {brief.districts.length} Districts
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedBrief(brief)}
              className="w-full btn btn-secondary flex items-center justify-between group"
            >
              View Intel Brief
              <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Brief Modal */}
      {selectedBrief && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setSelectedBrief(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[var(--border-subtle)] z-50 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Intelligence Brief • {selectedBrief.id}</div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedBrief.title}</h2>
              </div>
              <button onClick={() => setSelectedBrief(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              
              <section>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">Executive Summary</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selectedBrief.summary}</p>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 bg-[var(--bg-surface-2)] border-none">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Algorithmic Confidence</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold font-mono ${selectedBrief.confidence > 90 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>{selectedBrief.confidence}%</span>
                    <span className="text-xs text-[var(--text-secondary)]">Validated by 3 models</span>
                  </div>
                </div>
                <div className="card p-4 bg-[var(--bg-surface-2)] border-none">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Financial Impact / ROI</span>
                  <span className="text-lg font-bold font-mono text-[var(--text-primary)]">{selectedBrief.roi}</span>
                </div>
              </div>

              <section>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Evidence Sources</h3>
                <ul className="space-y-2">
                  {selectedBrief.evidence.map((ev, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                      {ev}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-4 bg-[#EFF6FF] border border-[#2563EB]/20 rounded-xl">
                <h3 className="text-sm font-bold text-[#1D4ED8] mb-2 flex items-center gap-2">
                  <Lightbulb size={16} /> Policy Recommendation
                </h3>
                <p className="text-sm text-[#1E3A8A]">{selectedBrief.recommendation}</p>
              </section>

              <section className="p-4 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-xl">
                <h3 className="text-sm font-bold text-[#B91C1C] mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> Risk If Ignored
                </h3>
                <p className="text-sm text-[#991B1B]">{selectedBrief.riskIfIgnored}</p>
              </section>

            </div>

            <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setSelectedBrief(null)}>Close</button>
              <button className="btn btn-primary flex items-center gap-2">Send to Command Center <ChevronRight size={16}/></button>
            </div>
            
          </div>
        </>
      )}

    </div>
  );
}
