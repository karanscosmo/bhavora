"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, useUIStore } from '@/stores';

// ===== INSIGHT DATA =====
const INSIGHTS = [
  {
    id: 'i1',
    category: 'Energy Infrastructure',
    categoryColor: '#F59E0B',
    title: 'Eastern Zone Grid Reinforcement Required by Q3 2025',
    summary: 'Substation #11 (Electronic City) is at 87% capacity. Based on 18-month demand trend and 3 pending industrial permits in adjacent zone, overload is projected by Q3 2025.',
    evidence: ['Demand growth: +28% since Jan 2024', 'Substation #7 last maintenance: 8 months ago', '3 industrial permits pending in adjacent zone', 'Population growth NE corridor: +18% (2yr)'],
    sources: ['Energy Grid Model', 'BESCOM Reports', 'BBMP Permit DB'],
    impact: 'Risk of blackout for 14,000 households in NE zone — ₹230 Cr economic exposure',
    confidence: 92,
    status: 'new',
    methodology: ['Energy Grid Model (IEC 60038)', 'Load Duration Curve', 'Population Growth Model (Logistic)'],
    ifNotActed: ['Blackout risk in NE zone by Q3 2027', '14,000 households affected', '₹230 Cr economic loss estimate'],
  },
  {
    id: 'i2',
    category: 'Transport Optimization',
    categoryColor: '#00D4FF',
    title: 'Silk Board Signal Optimization — Immediate ROI Opportunity',
    summary: 'Adaptive signal timing at 6 key junctions on Silk Board corridor can reduce average vehicle delay by 4 minutes and cut intersection-level congestion by 22%.',
    evidence: ['Current average speed: 8 km/h (34% below baseline)', '3 of 6 target signals using fixed timing', 'Peak hour volume: 4,200 PCU/hr vs 3,800 design capacity', 'BBMP signal upgrade budget approved Q2 2025'],
    sources: ['BPR Traffic Model', 'BMTC Route Data', 'OSM Traffic Layer'],
    impact: '↓ 22% congestion at 6 junctions, saving 4 min/vehicle × 45,000 daily commuters',
    confidence: 87,
    status: 'new',
    methodology: ['BPR Traffic Function (TRB 1965)', 'Modal Split Logit Model'],
    ifNotActed: ['Congestion spreads to adjacent roads within 6 months', 'Air quality worsens further in corridor'],
  },
  {
    id: 'i3',
    category: 'Water Sustainability',
    categoryColor: '#3B82F6',
    title: 'Bellandur Groundwater Emergency Protocol Required',
    summary: 'Groundwater levels in Bellandur catchment have fallen 2.3m since January 2025. At current depletion rate, the eastern Bengaluru water deficit will reach 470 MLD by 2027.',
    evidence: ['Groundwater depletion: 2.3m since Jan 2025', 'Current deficit: 350 MLD', '78% of Electronic City dependent on groundwater', 'Cauvery Stage 5 delayed by 6 months (BWSSB report)'],
    sources: ['IWA Water Balance Model', 'BWSSB Data', 'Groundwater Authority Reports'],
    impact: 'Without intervention: 280,000 residents face water scarcity risk by 2027',
    confidence: 84,
    status: 'under-review',
    methodology: ['IWA Water Balance Methodology', 'Population Growth Model (Logistic)'],
    ifNotActed: ['Water scarcity for 280,000 residents', 'Accelerated illegal borewells — subsidence risk', 'Industrial output reduction in Electronic City'],
  },
  {
    id: 'i4',
    category: 'Air Quality',
    categoryColor: '#10B981',
    title: 'Whitefield Industrial Dust Suppression — 12-Point AQI Improvement Opportunity',
    summary: 'Implementing mandatory water curtain and dust suppression at 4 active construction sites and 2 industrial compounds in Whitefield can reduce PM2.5 by an estimated 18 µg/m³.',
    evidence: ['Current Whitefield AQI: 168 (Unhealthy)', 'Construction activity +34% YoY', 'Wind vector analysis shows SE drift carrying dust to residential zones', 'Air quality monitoring: 3 stations in red zone'],
    sources: ['AQI Composite Model', 'CPCB AQI Data', 'Bhavora Environmental Monitoring'],
    impact: '↓ 18 AQI pts for 2.1L Whitefield residents within 2 weeks of enforcement',
    confidence: 79,
    status: 'actioned',
    methodology: ['AQI Composite Model', 'IPCC Tier 2 Emission Methodology'],
    ifNotActed: ['AQI exceeds 200 threshold by July 2025', 'Health advisory for sensitive groups required'],
  },
  {
    id: 'i5',
    category: 'Urban Mobility',
    categoryColor: '#7C3AED',
    title: 'Purple Line Frequency Increase — Overcrowding at 112% Capacity',
    summary: 'The Nagawara–Gottigere Purple Line is operating at 112% of planned passenger capacity. Adding 2 additional trains during peak hours will reduce overcrowding to 85%.',
    evidence: ['Current occupancy: 112% planned capacity', 'Ridership growth: +8% week-over-week', 'Platform dwell time: 45s vs 28s design', '3 additional trains available in BMRCL depot inventory'],
    sources: ['Modal Split Logit Model', 'BMRCL Ridership Data', 'BPR Traffic Function'],
    impact: '↓ 8% average wait time, relief for 180,000 daily Purple Line commuters',
    confidence: 93,
    status: 'new',
    methodology: ['Transport Demand Model (4-step)', 'Modal Split Logit Model'],
    ifNotActed: ['Safety incidents increase — overcrowding threshold breached', 'Commuters revert to private transport, worsening congestion'],
  },
];

// ===== EXPLAINABILITY PANEL =====
function ExplainPanel({ insight, onClose }: { insight: typeof INSIGHTS[0]; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px',
        background: '#0A1628', borderLeft: '1px solid rgba(0,212,255,0.15)',
        zIndex: 301, display: 'flex', flexDirection: 'column',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.5)', animation: 'slide-right 0.2s ease-out',
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>WHY IS BHAVORA RECOMMENDING THIS?</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{insight.title}</div>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Evidence Base */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Evidence Base</div>
            {insight.evidence.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#10B981', flexShrink: 0, fontWeight: 700 }}>✓</span>
                <div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{e}</span>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
                    Source: {insight.sources[i % insight.sources.length]} · Confidence {insight.confidence - i * 2}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Methodology</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {insight.methodology.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i > 0 && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>+</span>}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Overall Confidence: {insight.confidence}%</div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${insight.confidence}%`, background: insight.confidence >= 85 ? '#10B981' : '#F59E0B', borderRadius: '4px' }} />
            </div>
            <div style={{ fontSize: '10px', color: insight.confidence >= 85 ? '#10B981' : '#F59E0B', marginTop: '4px', fontWeight: 600 }}>
              {insight.confidence >= 85 ? 'High Confidence' : 'Medium Confidence'}
            </div>
          </div>

          {/* If not acted */}
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF4444', marginBottom: '8px' }}>If NOT acted upon:</div>
            {insight.ifNotActed.map((r, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>→ {r}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
          <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>Take Action</button>
          <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '12px' }}>Download Evidence Pack</button>
        </div>
      </div>
    </>
  );
}

// ===== ACTION PLAN MODAL =====
function ActionPlanModal({ insight, onClose }: { insight: typeof INSIGHTS[0]; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: '#0A1628', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '14px',
        padding: '24px', width: '560px', maxHeight: '80vh', overflowY: 'auto', zIndex: 301,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)', animation: 'scale-in 0.16s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Action Plan</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{insight.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Objective</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{insight.summary}</div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Action Steps</div>
            {['Immediately: Commission infrastructure assessment report', 'Week 1: Engage department heads — BESCOM/BBMP/BWSSB', 'Week 2: Tender & procurement initiation', 'Month 2: Ground works commence', 'Month 4-6: Commissioning and system validation'].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', fontSize: '10px', fontWeight: 700, color: '#00D4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Expected Impact</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{insight.impact}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>Activate Plan</button>
          <button className="btn-ghost" style={{ padding: '10px 16px', fontSize: '13px' }}>Export PDF</button>
        </div>
      </div>
    </>
  );
}

// ===== INSIGHT CARD =====
function InsightCard({
  insight, isSelected, onSelect, onAction, onReview, onExplore, onWhy,
}: {
  insight: typeof INSIGHTS[0];
  isSelected: boolean;
  onSelect: () => void;
  onAction: () => void;
  onReview: () => void;
  onExplore: () => void;
  onWhy: () => void;
}) {
  const confColor = insight.confidence >= 85 ? '#10B981' : insight.confidence >= 65 ? '#F59E0B' : '#EF4444';
  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    new: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', text: '#00D4FF' },
    'under-review': { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#F59E0B' },
    actioned: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10B981' },
    dismissed: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.4)' },
  };
  const sc = statusColors[insight.status] || statusColors.new;

  return (
    <div
      onClick={onSelect}
      className="glass-card"
      style={{
        padding: '16px', borderRadius: '12px', cursor: 'pointer',
        borderColor: isSelected ? 'rgba(0,212,255,0.2)' : undefined,
        boxShadow: isSelected ? '0 0 0 1px rgba(0,212,255,0.1)' : undefined,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: `${insight.categoryColor}12`, color: insight.categoryColor, border: `1px solid ${insight.categoryColor}30` }}>
            {insight.category}
          </span>
          <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            {insight.status.replace('-', ' ')}
          </span>
        </div>
        {/* Confidence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${insight.confidence}%`, background: confColor, borderRadius: '2px' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: confColor, fontWeight: 700 }}>{insight.confidence}%</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.4 }}>{insight.title}</div>

      {/* Summary */}
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '10px' }}>
        {insight.summary.substring(0, 140)}...
      </div>

      {/* Sources */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {insight.sources.map(s => (
          <span key={s} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>{s}</span>
        ))}
      </div>

      {/* Impact */}
      <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500, marginBottom: '12px' }}>{insight.impact}</div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
        <button onClick={onAction} className="btn-primary" style={{ padding: '5px 11px', fontSize: '11px' }}>Take Action</button>
        <button onClick={onReview} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px' }}>Review Plan</button>
        <button onClick={onExplore} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px' }}>Explore Source</button>
        <button onClick={onWhy} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px' }}>Why? 🧠</button>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
export default function InsightsPage() {
  const { addNotification } = useAppStore();
  const { openTakeAction, openAgentHub } = useUIStore();

  const [selectedInsight, setSelectedInsight] = useState<string | null>('i1');
  const [explainInsightId, setExplainInsightId] = useState<string | null>(null);
  const [reviewInsightId, setReviewInsightId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [minConfidence, setMinConfidence] = useState(0);
  const [searchQ, setSearchQ] = useState('');

  const categories = [...new Set(INSIGHTS.map(i => i.category))];
  const statuses = ['new', 'under-review', 'actioned', 'dismissed'];

  const filtered = useMemo(() => {
    return INSIGHTS.filter(i => {
      if (categoryFilter.length > 0 && !categoryFilter.includes(i.category)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(i.status)) return false;
      if (i.confidence < minConfidence) return false;
      if (searchQ && !i.title.toLowerCase().includes(searchQ.toLowerCase()) && !i.summary.toLowerCase().includes(searchQ.toLowerCase())) return false;
      return true;
    });
  }, [categoryFilter, statusFilter, minConfidence, searchQ]);

  const selected = INSIGHTS.find(i => i.id === selectedInsight);
  const explainInsight = INSIGHTS.find(i => i.id === explainInsightId);
  const reviewInsight = INSIGHTS.find(i => i.id === reviewInsightId);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* ===== LEFT — Insights Feed ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Filter Bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,10,20,0.5)', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search insights..."
            className="input-dark"
            style={{ width: '180px' }}
          />
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                  background: statusFilter.includes(s) ? 'rgba(0,212,255,0.12)' : 'transparent',
                  border: `1px solid ${statusFilter.includes(s) ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: statusFilter.includes(s) ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                  textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Min Confidence</span>
            <input type="range" min={0} max={90} step={10} value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))} style={{ width: '80px' }} />
            <span style={{ fontSize: '10px', color: '#00D4FF', fontFamily: 'monospace' }}>{minConfidence}%</span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{filtered.length} insights</span>
        </div>

        {/* Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No insights match your filters</div>
              <button onClick={() => { setCategoryFilter([]); setStatusFilter([]); setMinConfidence(0); setSearchQ(''); }} style={{ marginTop: '12px', padding: '7px 14px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '6px', color: '#00D4FF', fontSize: '12px', cursor: 'pointer' }}>Reset Filters</button>
            </div>
          ) : (
            filtered.map(insight => (
              <motion.div key={insight.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <InsightCard
                  insight={insight}
                  isSelected={selectedInsight === insight.id}
                  onSelect={() => setSelectedInsight(insight.id)}
                  onAction={() => {
                    openTakeAction();
                    addNotification({ title: 'Action Initiated', message: `Intervention for "${insight.title}" added to queue`, severity: 'info', path: '/overview' });
                  }}
                  onReview={() => setReviewInsightId(insight.id)}
                  onExplore={() => {
                    openAgentHub('executive');
                    addNotification({ title: 'Source Explorer', message: `Viewing data sources for "${insight.title}"`, severity: 'info' });
                  }}
                  onWhy={() => setExplainInsightId(insight.id)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ===== RIGHT — Detail Panel ===== */}
      <div style={{ width: '360px', flexShrink: 0, overflowY: 'auto', padding: '20px', background: 'rgba(5,10,20,0.3)' }}>
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', color: selected.categoryColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{selected.category}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: '8px' }}>{selected.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{selected.summary}</div>
            </div>

            {/* Full evidence */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Evidence Base</div>
              {selected.evidence.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ color: '#10B981', fontWeight: 700, fontSize: '12px' }}>✓</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{e}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Expected Impact</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{selected.impact}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button onClick={() => { openTakeAction(); }} className="btn-primary" style={{ padding: '10px', fontSize: '13px' }}>⚡ Take Action</button>
              <button onClick={() => setReviewInsightId(selected.id)} className="btn-ghost" style={{ padding: '10px', fontSize: '13px' }}>📋 Review Full Plan</button>
              <button onClick={() => setExplainInsightId(selected.id)} className="btn-ghost" style={{ padding: '10px', fontSize: '13px' }}>🧠 Why This Recommendation?</button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧠</div>
            <div style={{ fontSize: '13px' }}>Select an insight to see full details</div>
          </div>
        )}
      </div>

      {/* Overlays */}
      {explainInsight && <ExplainPanel insight={explainInsight} onClose={() => setExplainInsightId(null)} />}
      {reviewInsight && <ActionPlanModal insight={reviewInsight} onClose={() => setReviewInsightId(null)} />}
    </div>
  );
}
