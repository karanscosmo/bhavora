"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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

// ===== CONFIG =====
const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  'Energy Infrastructure': { icon: '\u26A1', color: '#F59E0B' },
  'Transport Optimization': { icon: '\uD83D\uDE87', color: '#00D4FF' },
  'Water Sustainability': { icon: '\uD83D\uDCA7', color: '#3B82F6' },
  'Air Quality': { icon: '\uD83C\uDF2C\uFE0F', color: '#10B981' },
  'Urban Mobility': { icon: '\uD83C\uDFD9\uFE0F', color: '#7C3AED' },
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  'under-review': 'Under Review',
  actioned: 'Actioned',
  dismissed: 'Dismissed',
};

const SOURCE_ICONS: Record<string, string> = {
  'Energy Grid Model': '\u26A1',
  'BESCOM Reports': '\uD83D\uDCCA',
  'BBMP Permit DB': '\uD83D\uDEE1\uFE0F',
  'BPR Traffic Model': '\uD83D\uDE97',
  'BMTC Route Data': '\uD83D\uDE8C',
  'OSM Traffic Layer': '\uD83D\uDDFA\uFE0F',
  'IWA Water Balance Model': '\uD83D\uDCA7',
  'BWSSB Data': '\uD83D\uDCCB',
  'Groundwater Authority Reports': '\uD83D\uDD0D',
  'AQI Composite Model': '\uD83C\uDF2C\uFE0F',
  'CPCB AQI Data': '\uD83D\uDD0D',
  'Bhavora Environmental Monitoring': '\uD83D\uDEE0\uFE0F',
  'Modal Split Logit Model': '\uD83D\uDE89',
  'BMRCL Ridership Data': '\uD83D\uDCC8',
};

function getSourceIcon(source: string): string {
  return SOURCE_ICONS[source] || '\uD83D\uDCC4';
}

// ===== MINI COMPONENTS =====
function ConfidenceGauge({ value }: { value: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 85 ? '#10B981' : value >= 65 ? '#F59E0B' : '#EF4444';
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 18 18)" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="18" y="20" textAnchor="middle" fill={color} fontSize="9" fontWeight="800">{value}%</text>
    </svg>
  );
}

function TrendArrow({ text, color }: { text: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: color || 'rgba(239,68,68,0.7)', lineHeight: 1.3 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 2L10 6H7V10H5V6H2L6 2Z" fill={color || '#EF4444'} opacity="0.7" />
      </svg>
      {text}
    </div>
  );
}

function EvidenceBadge({ count }: { count: number }) {
  return (
    <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L6.5 3.5L9 4L7 6.5L7.5 9.5L5 8L2.5 9.5L3 6.5L1 4L3.5 3.5L5 1Z" fill="#00D4FF" opacity="0.6" /></svg>
      {count}
    </span>
  );
}

// ===== EXPLAINABILITY PANEL =====
function ExplainPanel({ insight, onClose }: { insight: typeof INSIGHTS[0]; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px',
          background: '#0A1628', borderLeft: '1px solid rgba(0,212,255,0.15)',
          zIndex: 301, display: 'flex', flexDirection: 'column',
          boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
        }}
      >
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
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${insight.confidence}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: insight.confidence >= 85 ? '#10B981' : '#F59E0B', borderRadius: '4px' }}
              />
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
      </motion.div>
    </>
  );
}

// ===== ACTION PLAN MODAL =====
function ActionPlanModal({ insight, onClose }: { insight: typeof INSIGHTS[0]; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: '#0A1628', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '14px',
          padding: '24px', width: '560px', maxHeight: '80vh', overflowY: 'auto', zIndex: 301,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
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
      </motion.div>
    </>
  );
}

// ===== INSIGHT CARD =====
function InsightCard({
  insight, isSelected, onSelect, onAction, onReview, onExplore, onWhy, onDismiss,
}: {
  insight: typeof INSIGHTS[0];
  isSelected: boolean;
  onSelect: () => void;
  onAction: () => void;
  onReview: () => void;
  onExplore: () => void;
  onWhy: () => void;
  onDismiss?: () => void;
}) {
  const confColor = insight.confidence >= 85 ? '#10B981' : insight.confidence >= 65 ? '#F59E0B' : '#EF4444';
  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    new: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', text: '#00D4FF' },
    'under-review': { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#F59E0B' },
    actioned: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10B981' },
    dismissed: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.4)' },
  };
  const sc = statusColors[insight.status] || statusColors.new;
  const cat = CATEGORY_CONFIG[insight.category] || { icon: '\uD83D\uDCCA', color: insight.categoryColor };
  const severityBorder = insight.confidence >= 85 ? '#10B981' : insight.confidence >= 65 ? '#F59E0B' : insight.categoryColor;
  const severityWidth = insight.confidence >= 85 ? '3px' : '2px';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280, mass: 0.8 }}
      onClick={onSelect}
      className="glass-card"
      style={{
        padding: '16px', borderRadius: '12px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        borderColor: isSelected ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.6)',
        boxShadow: isSelected ? '0 0 0 1px rgba(0,212,255,0.12), 0 8px 24px rgba(0,212,255,0.06)' : undefined,
      }}
    >
      {/* Severity left border */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%', width: severityWidth,
        background: severityBorder, borderRadius: '0 2px 2px 0',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: `${insight.categoryColor}12`, color: insight.categoryColor, border: `1px solid ${insight.categoryColor}30`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {cat.icon} {insight.category}
          </span>
          <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            {STATUS_LABELS[insight.status] || insight.status.replace('-', ' ')}
          </span>
          {insight.status === 'new' && (
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D4FF', animation: 'live-pulse 2s ease-in-out infinite' }} />
          )}
          <EvidenceBadge count={insight.evidence.length} />
        </div>
        <ConfidenceGauge value={insight.confidence} />
      </div>

      {/* Title */}
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.4, paddingLeft: '8px' }}>{insight.title}</div>

      {/* Summary */}
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '10px', paddingLeft: '8px' }}>
        {insight.summary.substring(0, 140)}...
      </div>

      {/* Sources row */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '8px' }}>
        {insight.sources.map(s => (
          <span key={s} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            {getSourceIcon(s)} {s}
          </span>
        ))}
      </div>

      {/* Impact */}
      <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 500, marginBottom: '8px', paddingLeft: '8px' }}>{insight.impact}</div>

      {/* If not acted mini indicator */}
      {insight.ifNotActed.length > 0 && (
        <div style={{ paddingLeft: '8px', marginBottom: '10px' }}>
          <TrendArrow text={insight.ifNotActed[0]} color="#EF4444" />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', paddingLeft: '8px' }} onClick={e => e.stopPropagation()}>
        <button onClick={onAction} className="btn-primary" style={{ padding: '5px 11px', fontSize: '11px' }}>Take Action</button>
        <button onClick={onReview} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px' }}>Review Plan</button>
        <button onClick={onExplore} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px' }}>Explore Source</button>
        <button onClick={onWhy} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px' }}>Explain</button>
        {onDismiss && (
          <button onClick={onDismiss} className="btn-ghost" style={{ padding: '5px 11px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.08)' }}>Dismiss</button>
        )}
      </div>
    </motion.div>
  );
}

// ===== MAIN PAGE =====
export default function InsightsPage() {
  const router = useRouter();
  const { addNotification } = useAppStore();
  const { openTakeAction, openAgentHub, openSaveScenario } = useUIStore();

  const [selectedInsight, setSelectedInsight] = useState<string | null>('i1');
  const [explainInsightId, setExplainInsightId] = useState<string | null>(null);
  const [reviewInsightId, setReviewInsightId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [minConfidence, setMinConfidence] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(INSIGHTS.map(i => i.category))];
  const statuses = ['new', 'under-review', 'actioned', 'dismissed'];

  const tabs = [
    { id: 'all', label: 'All', icon: '\uD83D\uDCCA' },
    { id: 'critical', label: 'Critical', icon: '\uD83D\uDD25' },
    { id: 'under-review', label: 'Under Review', icon: '\uD83D\uDD0D' },
    { id: 'actioned', label: 'Actioned', icon: '\u2705' },
  ];

  const filtered = useMemo(() => {
    return INSIGHTS.filter(i => {
      if (activeTab === 'critical' && i.confidence < 85) return false;
      if (activeTab === 'under-review' && i.status !== 'under-review') return false;
      if (activeTab === 'actioned' && i.status !== 'actioned') return false;
      if (categoryFilter.length > 0 && !categoryFilter.includes(i.category)) return false;
      if (statusFilter.length > 0 && !statusFilter.includes(i.status)) return false;
      if (i.confidence < minConfidence) return false;
      if (searchQ && !i.title.toLowerCase().includes(searchQ.toLowerCase()) && !i.summary.toLowerCase().includes(searchQ.toLowerCase())) return false;
      return true;
    });
  }, [activeTab, categoryFilter, statusFilter, minConfidence, searchQ]);

  const selected = INSIGHTS.find(i => i.id === selectedInsight);
  const explainInsight = INSIGHTS.find(i => i.id === explainInsightId);
  const reviewInsight = INSIGHTS.find(i => i.id === reviewInsightId);

  const cat = selected ? CATEGORY_CONFIG[selected.category] : null;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* ===== LEFT — Insights Feed ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)', minWidth: 0 }}>

        {/* Tabs */}
        <div style={{ padding: '12px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,10,20,0.5)' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCategoryFilter([]); setStatusFilter([]); setMinConfidence(0); }}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: activeTab === tab.id ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: activeTab === tab.id ? '#00D4FF' : 'rgba(255,255,255,0.45)',
                  transition: 'all 150ms ease',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <span>{tab.icon}</span> {tab.label}
                {tab.id === 'all' && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{INSIGHTS.length}</span>}
                {tab.id === 'critical' && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{INSIGHTS.filter(i => i.confidence >= 85).length}</span>}
                {tab.id === 'under-review' && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{INSIGHTS.filter(i => i.status === 'under-review').length}</span>}
                {tab.id === 'actioned' && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{INSIGHTS.filter(i => i.status === 'actioned').length}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,10,20,0.5)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '140px', maxWidth: '220px' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.3 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search insights..."
              className="input-dark"
              style={{ width: '100%', paddingLeft: '30px', fontSize: '12px' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(o => !o)}
            style={{
              padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              background: showFilters ? 'rgba(0,212,255,0.1)' : 'transparent',
              border: `1px solid ${showFilters ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
              color: showFilters ? '#00D4FF' : 'rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2H11M3 6H9M5 10H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            Filters
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{filtered.length} insight{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Expanded filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(5,10,20,0.3)' }}
            >
              <div style={{ padding: '10px 20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Status filter chips */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginRight: '4px' }}>Status</span>
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                      style={{
                        padding: '3px 9px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                        background: statusFilter.includes(s) ? 'rgba(0,212,255,0.12)' : 'transparent',
                        border: `1px solid ${statusFilter.includes(s) ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        color: statusFilter.includes(s) ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {STATUS_LABELS[s] || s}
                    </button>
                  ))}
                </div>

                {/* Category filter chips */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginRight: '4px' }}>Category</span>
                  {categories.map(c => {
                    const cc = CATEGORY_CONFIG[c];
                    return (
                      <button
                        key={c}
                        onClick={() => setCategoryFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                        style={{
                          padding: '3px 9px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                          background: categoryFilter.includes(c) ? `${cc.color}18` : 'transparent',
                          border: `1px solid ${categoryFilter.includes(c) ? `${cc.color}40` : 'rgba(255,255,255,0.1)'}`,
                          color: categoryFilter.includes(c) ? cc.color : 'rgba(255,255,255,0.5)',
                          display: 'flex', alignItems: 'center', gap: '3px',
                        }}
                      >
                        {cc.icon} {c}
                      </button>
                    );
                  })}
                </div>

                {/* Confidence slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Min Confidence</span>
                  <input type="range" min={0} max={90} step={10} value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))} style={{ width: '80px', accentColor: '#00D4FF' }} />
                  <span style={{ fontSize: '10px', color: '#00D4FF', fontFamily: 'monospace', fontWeight: 700, minWidth: '24px' }}>{minConfidence}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>\uD83D\uDD0D</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No insights match your filters</div>
                <button onClick={() => { setActiveTab('all'); setCategoryFilter([]); setStatusFilter([]); setMinConfidence(0); setSearchQ(''); }} style={{ marginTop: '12px', padding: '7px 14px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '6px', color: '#00D4FF', fontSize: '12px', cursor: 'pointer' }}>Reset Filters</button>
              </motion.div>
            ) : (
              filtered.map(insight => (
                <InsightCard
                  key={insight.id}
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
                  onDismiss={() => {
                    addNotification({ title: 'Insight Dismissed', message: `"${insight.title}" has been dismissed`, severity: 'info' });
                  }}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== RIGHT — Detail Panel ===== */}
      <motion.div
        layout
        style={{ width: '380px', flexShrink: 0, overflowY: 'auto', padding: '0', background: 'rgba(5,10,20,0.3)' }}
      >
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
            >
              {/* Header section */}
              <div className="glass-card" style={{ padding: '20px', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{cat?.icon || '\uD83D\uDCCA'}</span>
                  <span style={{ fontSize: '11px', color: selected.categoryColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selected.category}</span>
                  <span style={{
                    marginLeft: 'auto', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    background: selected.status === 'new' ? 'rgba(0,212,255,0.1)' : selected.status === 'under-review' ? 'rgba(245,158,11,0.1)' : selected.status === 'actioned' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                    color: selected.status === 'new' ? '#00D4FF' : selected.status === 'under-review' ? '#F59E0B' : selected.status === 'actioned' ? '#10B981' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${selected.status === 'new' ? 'rgba(0,212,255,0.2)' : selected.status === 'under-review' ? 'rgba(245,158,11,0.2)' : selected.status === 'actioned' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {STATUS_LABELS[selected.status] || selected.status.replace('-', ' ')}
                  </span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: '8px' }}>{selected.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{selected.summary}</div>
              </div>

              <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Evidence list */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" /><path d="M4 6L5.5 7.5L8 4.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Evidence ({selected.evidence.length})
                  </div>
                  {selected.evidence.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ display: 'flex', gap: '8px', marginBottom: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <span style={{ color: '#10B981', fontWeight: 700, fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                      <div>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{e}</span>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getSourceIcon(selected.sources[i % selected.sources.length])} {selected.sources[i % selected.sources.length]}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Impact */}
                <div style={{ padding: '12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#10B981" strokeWidth="1.2" /><path d="M6 3.5V6.5M6 8V8.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    Expected Impact
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{selected.impact}</div>
                </div>

                {/* Methodology citation */}
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2H10V4L8 6L10 8V10H2V8L4 6L2 4V2Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                    Methodology
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {selected.methodology.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 700 }}>{i + 1}.</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'monospace' }}>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* If not acted */}
                <div style={{ padding: '12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10H1L6 1Z" stroke="#EF4444" strokeWidth="1.2" strokeLinejoin="round" /><path d="M6 4.5V6.5M6 8V8.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    If NOT acted upon:
                  </div>
                  {selected.ifNotActed.map((r, i) => (
                    <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '3px', paddingLeft: '14px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#EF4444', opacity: 0.5 }}>→</span>
                      {r}
                    </div>
                  ))}
                </div>

                {/* Confidence breakdown */}
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ConfidenceGauge value={selected.confidence} />
                    <span>Confidence Score</span>
                    <span style={{ marginLeft: 'auto', color: selected.confidence >= 85 ? '#10B981' : '#F59E0B', fontSize: '13px' }}>{selected.confidence}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.confidence}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                      style={{ height: '100%', background: selected.confidence >= 85 ? '#10B981' : selected.confidence >= 65 ? '#F59E0B' : '#EF4444', borderRadius: '3px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 700, color: '#10B981' }}>{Math.min(selected.evidence.length * 22, 100)}%</div>
                      <div>Data Quality</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 700, color: '#00D4FF' }}>{Math.min(selected.methodology.length * 40, 100)}%</div>
                      <div>Model Fit</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 700, color: '#7C3AED' }}>{Math.min(selected.sources.length * 30, 100)}%</div>
                      <div>Source Coverage</div>
                    </div>
                  </div>
                </div>

                {/* Explain This section */}
                <div className="glass-card" style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,212,255,0.03)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#00D4FF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#00D4FF" strokeWidth="1.2" /><path d="M7 4V7.5M7 9.5V10" stroke="#00D4FF" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    Explain This Insight
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>\uD83D\uDCCA</span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>Key Drivers</div>
                        <div>{selected.evidence.slice(0, 2).map((e, i) => <span key={i} style={{ display: 'block', fontSize: '11px', lineHeight: 1.5, color: 'rgba(255,255,255,0.55)' }}>• {e.substring(0, 60)}</span>)}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>\uD83D\uDEE0\uFE0F</span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>Data Sources</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {selected.sources.map(s => (
                            <span key={s} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.12)', color: '#00D4FF' }}>
                              {getSourceIcon(s)} {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>\uD83D\uDD0D</span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>Similar Past Insights</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                          {INSIGHTS.filter(i => i.category === selected.category && i.id !== selected.id).slice(0, 2).map(i => (
                            <div key={i.id} style={{ marginBottom: '2px', cursor: 'pointer', color: '#00D4FF' }} onClick={() => setSelectedInsight(i.id)}>→ {i.title.substring(0, 50)}...</div>
                          ))}
                          {INSIGHTS.filter(i => i.category === selected.category && i.id !== selected.id).length === 0 && <span>No similar past insights</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>\uD83C\uDFAF</span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>Confidence Drivers</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
                          {selected.confidence >= 85 ? 'Strong multi-source corroboration and high data quality.' :
                           selected.confidence >= 70 ? 'Multiple data sources aligned, with moderate variance in projections.' :
                           'Limited data points, requiring additional validation.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Workflows */}
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Action Workflows</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button
                      onClick={() => router.push('/decision-twin')}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', width: '100%' }}
                    >
                      <span style={{ fontSize: '14px', marginRight: '8px' }}>\uD83E\uDDE0</span>
                      Open in Decision Twin
                    </button>
                    <button
                      onClick={() => router.push('/cities')}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', width: '100%' }}
                    >
                      <span style={{ fontSize: '14px', marginRight: '8px' }}>\uD83D\uDDFA\uFE0F</span>
                      View on Map
                    </button>
                    <button
                      onClick={() => router.push('/reports')}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', width: '100%' }}
                    >
                      <span style={{ fontSize: '14px', marginRight: '8px' }}>\uD83D\uDCC4</span>
                      Generate Report
                    </button>
                    <button
                      onClick={() => openSaveScenario()}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', width: '100%' }}
                    >
                      <span style={{ fontSize: '14px', marginRight: '8px' }}>\uD83C\uDF31</span>
                      Create Scenario
                    </button>
                  </div>
                </div>

                {/* Main action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', marginBottom: '20px' }}>
                  <button onClick={() => { openTakeAction(); }} className="btn-primary" style={{ padding: '10px', fontSize: '13px', width: '100%', justifyContent: 'center' }}>
                    <span>\u26A1</span> Take Action
                  </button>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setReviewInsightId(selected.id)} className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: '12px', justifyContent: 'center' }}>
                      \uD83D\uDCCB Review Full Plan
                    </button>
                    <button onClick={() => setExplainInsightId(selected.id)} className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: '12px', justifyContent: 'center' }}>
                      \uD83E\uDDE0 Why This?
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '64px 24px', color: 'rgba(255,255,255,0.3)' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>\uD83E\uDDE0</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Select an insight</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>View full details, evidence, and recommended actions</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlays */}
      <AnimatePresence>
        {explainInsight && <ExplainPanel key="explain" insight={explainInsight} onClose={() => setExplainInsightId(null)} />}
        {reviewInsight && <ActionPlanModal key="action-plan" insight={reviewInsight} onClose={() => setReviewInsightId(null)} />}
      </AnimatePresence>
    </div>
  );
}
