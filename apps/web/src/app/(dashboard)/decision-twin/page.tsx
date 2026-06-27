"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useSimulationStore, useUIStore, useScenarioStore, useAppStore } from '@/stores';
import { PolicyInput, CascadeNode } from '@/lib/simulation';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid,
} from 'recharts';

// ===== PRESET BUTTONS =====
const PRESETS = [
  { label: 'Low', value: 20 },
  { label: 'Med', value: 50 },
  { label: 'High', value: 80 },
];

// ===== EXPLAIN PANEL =====
const EXPLAIN_CONTENT: Record<string, { methodology: string; formula: string; confidence: number; whyMatters: string }> = {
  metroExpansion: {
    methodology: 'Transport Demand Model (4-step)',
    formula: 't = t₀ × (1 + 0.15 × (V/C)⁴) — BPR Traffic Function',
    confidence: 0.87,
    whyMatters: 'Bengaluru has the 5th worst traffic globally, with avg commute times exceeding 50 min. Metro decongestion directly improves economic productivity and air quality.',
  },
  evAdoptionRate: {
    methodology: 'Carbon Emission Model (IPCC Tier 2)',
    formula: 'CO₂ = VKT × EF × (1 − EV_share) — IPCC Guidelines 2006',
    confidence: 0.91,
    whyMatters: 'Transport accounts for 43% of Bengaluru\'s CO₂. EV adoption is Karnataka\'s primary strategy for achieving 30% EV penetration by 2030 (Karnataka EV Policy 2022).',
  },
  roadCapacity: {
    methodology: 'BPR Traffic Assignment Function',
    formula: 't = t₀ × (1 + α × (V/C)^β), α = 0.15, β = 4',
    confidence: 0.87,
    whyMatters: 'Road capacity improvements can reduce congestion but may induce demand (Downs-Thomson paradox). Optimal investment balances road widening with transit alternatives.',
  },
  renewableShare: {
    methodology: 'Energy Grid Model (Load Duration Curve)',
    formula: 'EF_grid = Σ(EF_i × share_i) — CEA Karnataka 2023: 0.82 kgCO₂/kWh',
    confidence: 0.89,
    whyMatters: 'Karnataka aims for 50% renewable by 2030. Each 10% grid decarbonization cascades across buildings, industry, and transport (via EV charging).',
  },
  waterInfrastructure: {
    methodology: 'IWA Water Balance Model',
    formula: 'NRW = (Supply − Billed) / Supply — Bengaluru leakage: 40%',
    confidence: 0.84,
    whyMatters: 'Bengaluru\'s 40% water leakage is among India\'s highest. Fixing leaks costs 5× less than new supply projects and directly reduces water stress.',
  },
  greenSpaceAllocation: {
    methodology: 'Urban Heat Island + AQI Regression',
    formula: 'ΔT = −0.4°C per 10% green cover increase (Oke 1982)',
    confidence: 0.82,
    whyMatters: 'Bengaluru has only 11% green cover vs WHO\'s 30% recommendation. Green spaces sequester carbon, lower urban temps by up to 4°C, and improve mental health.',
  },
  industrialZoning: {
    methodology: 'Land Use + Solow-Swan Economic Model',
    formula: 'Y = A × K^α × L^(1−α), α = 0.35',
    confidence: 0.78,
    whyMatters: 'Industrial zoning above 50% boosts GDP but compounds pollution and traffic. Bengaluru must balance its IT services-led economy with sustainable industrial growth.',
  },
};

const panelVariants: Variants = {
  hidden: { x: 320, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 24, stiffness: 200 } },
  exit: { x: 320, opacity: 0, transition: { duration: 0.15 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' as const },
  }),
};

function ExplainPanel({ sliderKey, onClose }: { sliderKey: keyof PolicyInput; onClose: () => void }) {
  const info = EXPLAIN_CONTENT[sliderKey];
  if (!info) return null;
  const confPct = Math.round(info.confidence * 100);
  const interval = Math.round((1 - info.confidence) * 100);
  const confTier = info.confidence >= 0.85 ? 'High' : info.confidence >= 0.65 ? 'Medium' : 'Low';

  return (
    <motion.div
      variants={panelVariants} initial="hidden" animate="visible" exit="exit"
      style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 320,
        background: 'var(--bg-surface-1)', borderLeft: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xl)', zIndex: 50, display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Explainability</span>
        <button onClick={onClose} style={{ background: 'var(--bg-surface-2)', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ✕
        </button>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div className="micro-label" style={{ marginBottom: '6px' }}>Model Reference</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{info.methodology}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-2)', padding: '8px 12px', borderRadius: '8px' }}>
            {info.formula}
          </div>
        </div>

        <div>
          <div className="micro-label" style={{ marginBottom: '8px' }}>Confidence Interval</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="stat-value" style={{ fontSize: '28px', color: info.confidence >= 0.85 ? 'var(--accent-teal)' : info.confidence >= 0.65 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>
              {confPct}%
            </span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{confTier} Confidence</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>±{interval}% margin of error</div>
            </div>
          </div>
          <div style={{ marginTop: '12px', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${confPct}%`, background: info.confidence >= 0.85 ? 'var(--accent-teal)' : info.confidence >= 0.65 ? 'var(--accent-amber)' : 'var(--accent-red)', borderRadius: '2px', transition: 'width 300ms ease' }} />
          </div>
        </div>

        <div style={{ background: 'var(--accent-navy-light)', borderRadius: '12px', padding: '16px' }}>
          <div className="micro-label" style={{ color: 'var(--accent-navy)', marginBottom: '8px' }}>Why This Matters</div>
          <div style={{ fontSize: '13px', color: 'var(--accent-navy-mid)', lineHeight: 1.6 }}>{info.whyMatters}</div>
        </div>

        <div>
          <div className="micro-label" style={{ marginBottom: '8px' }}>Data Sources</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-teal)', flexShrink: 0 }} />
              CEA Karnataka Grid Emission Factor 2023
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-teal)', flexShrink: 0 }} />
              Bengaluru Smart City Dashboard (Live)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-teal)', flexShrink: 0 }} />
              Karnataka State Pollution Control Board
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== SLIDER COMPONENT =====
function PolicySlider({
  label, description, tooltip, value, onChange, icon, onExplain,
}: {
  label: string; description: string; tooltip: string;
  value: number; onChange: (v: number) => void; icon: string; onExplain: () => void;
}) {
  const percentage = value;
  const trackGradient = `linear-gradient(90deg, var(--accent-red) 0%, var(--accent-amber) 33%, var(--accent-teal) 66%, var(--accent-teal) 100%)`;
  const segmentColor = percentage > 66 ? 'var(--accent-teal)' : percentage > 33 ? 'var(--accent-amber)' : 'var(--accent-red)';

  const impactDirection = percentage > 55 ? 'positive' : percentage < 45 ? 'negative' : 'neutral';
  const impactLabel = impactDirection === 'positive' ? 'Beneficial' : impactDirection === 'negative' ? 'Caution' : 'Neutral';
  const impactColor = impactDirection === 'positive' ? 'var(--accent-teal)' : impactDirection === 'negative' ? 'var(--accent-red)' : 'var(--text-muted)';

  return (
    <motion.div
      layout
      style={{ padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          <button
            onClick={onExplain}
            style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}
            title="Explain methodology"
          >?</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="data-value" style={{ fontSize: '14px', fontWeight: 700, color: segmentColor }}>{value}%</span>
          <button
            onClick={() => onChange(0)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', padding: '2px' }}
            title="Reset to baseline"
          >↺</button>
        </div>
      </div>

      {/* Impact preview badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
          background: impactDirection === 'positive' ? 'var(--accent-teal-light)' : impactDirection === 'negative' ? 'var(--accent-red-light)' : 'var(--bg-surface-2)',
          color: impactColor, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <span style={{ fontSize: '8px' }}>{impactDirection === 'positive' ? '▲' : impactDirection === 'negative' ? '▼' : '◆'}</span>
          {impactLabel}
        </span>
        <div style={{ flex: 1, height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden', maxWidth: '80px' }}>
          <div style={{
            height: '100%', width: `${Math.abs(value - 50) * 2}%`, maxWidth: '100%',
            background: impactColor, borderRadius: '2px', transition: 'width 200ms ease',
            marginLeft: value > 50 ? '0' : 'auto',
          }} />
        </div>
      </div>

      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>{description}</div>

      {/* Track */}
      <div style={{ position: 'relative', height: '28px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }} />
        <div style={{ position: 'absolute', left: 0, width: `${value}%`, height: '6px', background: trackGradient, borderRadius: '3px', transition: 'width 120ms ease', opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: `${value}%`, width: '2px', height: '6px', background: segmentColor, borderRadius: '1px', transition: 'left 120ms ease', transform: 'translateX(-1px)' }} />
        <input
          type="range" min={0} max={100} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'relative', width: '100%', appearance: 'none', background: 'transparent', cursor: 'pointer', height: '28px', zIndex: 1 }}
        />
      </div>

      {/* Preset buttons */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => onChange(p.value)}
            style={{
              flex: 1, padding: '3px 0', fontSize: '10px', fontWeight: 700,
              background: value === p.value ? segmentColor : 'var(--bg-surface-2)',
              color: value === p.value ? '#fff' : 'var(--text-muted)',
              border: value === p.value ? 'none' : '1px solid var(--border-subtle)',
              borderRadius: '5px', cursor: 'pointer', transition: 'all 120ms ease',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}
          >{p.label}</button>
        ))}
      </div>
    </motion.div>
  );
}

// ===== METRIC DELTA CARD =====
function MetricDelta({ label, before, after, delta, unit, confidence }: {
  label: string; before: number; after: number; delta: number; unit: string; confidence: number;
}) {
  const isGood = unit === '%congestion' ? delta < 0 : unit === 'ktCO2/yr' ? delta < 0 : unit === 'AQI' ? delta < 0 : delta > 0;
  const deltaColor = isGood ? 'var(--accent-teal)' : 'var(--accent-red)';
  const deltaArrow = delta > 0 ? '▲' : '▼';
  const confidenceTier = confidence >= 0.85 ? 'High' : confidence >= 0.65 ? 'Medium' : 'Low';
  const confColor = confidence >= 0.85 ? 'var(--accent-teal)' : confidence >= 0.65 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const pctChange = before !== 0 ? ((delta / before) * 100) : 0;

  return (
    <motion.div
      layout
      className="glass-card"
      style={{ padding: '16px', overflow: 'hidden' }}
    >
      <div className="micro-label" style={{ marginBottom: '10px' }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
        {/* Before */}
        <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-surface-2)', borderRadius: '10px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 500 }}>Before</div>
          <div className="data-value" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
            {typeof before === 'number' ? before.toFixed(before < 10 ? 1 : 0) : before}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <motion.span
            key={String(delta)}
            initial={{ opacity: 0, y: delta > 0 ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '13px', color: deltaColor, fontWeight: 700 }}
          >
            {deltaArrow}
          </motion.span>
        </div>

        {/* After */}
        <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-surface-2)', borderRadius: '10px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 500 }}>After</div>
          <motion.div
            key={String(after)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="data-value"
            style={{ fontSize: '18px', color: 'var(--accent-navy)' }}
          >
            {typeof after === 'number' ? after.toFixed(after < 10 ? 1 : 0) : after}
          </motion.div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</div>
        </div>
      </div>

      {/* Delta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '6px 8px', background: isGood ? 'rgba(0, 98, 66, 0.04)' : 'rgba(186, 26, 26, 0.04)', borderRadius: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: deltaColor }}>
          {delta > 0 ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(delta < 10 ? 1 : 0) : delta} {unit}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: deltaColor }}>
          {pctChange > 0 ? '+' : ''}{pctChange.toFixed(1)}%
        </span>
        <span style={{ fontSize: '10px', color: confColor, fontWeight: 600 }}>
          {Math.round(confidence * 100)}% · {confidenceTier}
        </span>
      </div>
    </motion.div>
  );
}

// ===== CASCADE NODE =====
function CascadeNodeView({ node, depth = 0 }: { node: CascadeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const color = node.type === 'improvement' ? 'var(--accent-teal)' : node.type === 'deterioration' ? 'var(--accent-red)' : 'var(--text-muted)';
  const bgColor = node.type === 'improvement' ? 'rgba(0, 98, 66, 0.08)' : node.type === 'deterioration' ? 'rgba(186, 26, 26, 0.08)' : 'var(--bg-surface-2)';
  const arrowIcon = node.type === 'improvement' ? '▲' : node.type === 'deterioration' ? '▼' : '◆';
  const severityLabel = node.confidence >= 0.85 ? 'High' : node.confidence >= 0.65 ? 'Med' : 'Low';
  const severityColor = node.confidence >= 0.85 ? 'var(--accent-teal)' : node.confidence >= 0.65 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const absDelta = Math.abs(node.delta);

  const barWidth = Math.min(100, absDelta * 2);
  const barColor = node.type === 'improvement' ? 'var(--accent-teal)' : node.type === 'deterioration' ? 'var(--accent-red)' : 'var(--border-normal)';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: depth * 0.04 }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        {/* Connecting line area */}
        {depth > 0 && (
          <div style={{ width: '24px', flexShrink: 0, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '2px', background: 'var(--border-subtle)', position: 'absolute', top: 0, bottom: 0 }} />
            <div style={{
              width: '10px', height: '2px', background: color, position: 'absolute', top: '18px', left: '50%',
              borderRadius: '1px',
            }} />
            <div style={{
              width: '6px', height: '6px', borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}`,
              position: 'absolute', top: '16px', left: '60%', transform: 'rotate(-45deg)',
            }} />
          </div>
        )}

        <div style={{ flex: 1, marginLeft: depth > 0 ? 0 : 0, minWidth: 0 }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 8px', textAlign: 'left', borderRadius: '8px',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = bgColor)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Toggle icon */}
            <span style={{ fontSize: '8px', color: 'var(--text-muted)', width: '10px', flexShrink: 0, transition: 'transform 150ms ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              {node.children.length > 0 ? '▶' : ''}
            </span>

            {/* Type badge */}
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px',
              background: bgColor, color, border: `1px solid ${color}40`,
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '3px',
            }}>
              <span style={{ fontSize: '8px' }}>{arrowIcon}</span>
              {node.type === 'improvement' ? 'Improve' : node.type === 'deterioration' ? 'Worsen' : 'Neutral'}
            </span>

            {/* Label */}
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {node.label}
            </span>

            {/* Impact bar */}
            <div style={{ width: '48px', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ width: `${barWidth}%`, height: '100%', background: barColor, borderRadius: '2px', transition: 'width 200ms ease' }} />
            </div>

            {/* Severity badge */}
            <span style={{
              fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px',
              background: severityColor + '18', color: severityColor, flexShrink: 0,
              letterSpacing: '0.03em',
            }}>
              {severityLabel}
            </span>

            {/* Confidence */}
            <span className="data-value" style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0, minWidth: '36px', textAlign: 'right' }}>
              {Math.round(node.confidence * 100)}%
            </span>
          </button>

          <AnimatePresence>
            {open && node.children.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {node.children.map(child => (
                  <CascadeNodeView key={child.id} node={child} depth={depth + 1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ===== SAVE SCENARIO MODAL =====
function SaveScenarioModal({ onClose }: { onClose: () => void }) {
  const { saveScenario } = useScenarioStore();
  const { addNotification } = useAppStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('transport, 2035');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    saveScenario(name, description, tags.split(',').map(t => t.trim()).filter(Boolean), '');
    addNotification({ title: 'Scenario Saved', message: `"${name}" saved to Scenario Vault`, severity: 'success' });
    setSaving(false);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
      <div className="animate-scale-in" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
        padding: '24px', width: '420px', zIndex: 301, boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Save Scenario</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Commit current policy configuration to the Scenario Vault</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="micro-label" style={{ display: 'block', marginBottom: '8px' }}>Scenario Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Metro 2035 Expansion" className="input-dark" style={{ width: '100%' }} />
          </div>
          <div>
            <label className="micro-label" style={{ display: 'block', marginBottom: '8px' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Brief description of this policy scenario..." className="input-dark" style={{ width: '100%', resize: 'none' }} />
          </div>
          <div>
            <label className="micro-label" style={{ display: 'block', marginBottom: '8px' }}>Tags (comma-separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="input-dark" style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '10px 16px' }}>Cancel</button>
          <button onClick={handleSave} disabled={!name.trim() || saving} className="btn-primary" style={{ padding: '10px 20px', opacity: !name.trim() || saving ? 0.5 : 1 }}>
            {saving ? 'Saving...' : 'Save to Vault'}
          </button>
        </div>
      </div>
    </>
  );
}

// ===== CUSTOM TIMELINE TOOLTIP =====
function TimelineTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: number }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface-1)', border: '1px solid var(--border-normal)',
      borderRadius: '12px', padding: '12px 16px', boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>{entry.name === 'city_health' ? 'City Health Score' : entry.name}</span>
          <span className="data-value" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.value}/100</span>
        </div>
      ))}
    </div>
  );
}

// ===== MAIN DECISION TWIN PAGE =====
const SLIDERS: { key: keyof PolicyInput; label: string; description: string; tooltip: string; icon: string }[] = [
  { key: 'metroExpansion', label: 'Metro Network Expansion', description: 'Feeds Transport Demand Model (4-step)', tooltip: 'Increasing by 10% reduces transport CO₂ by ~2.8 ktCO₂/yr based on BPR traffic function. Modal split shifts +4% toward transit per 20% increment.', icon: '🚇' },
  { key: 'evAdoptionRate', label: 'EV Adoption Rate', description: 'Feeds Carbon Emission Model (IPCC Tier 2)', tooltip: 'Each 10% EV adoption reduces transport CO₂ by ~1.5 ktCO₂/yr. Effect compounds with renewable grid share.', icon: '⚡' },
  { key: 'roadCapacity', label: 'Road Capacity Investment', description: 'Feeds BPR Traffic Assignment Function', tooltip: 'BPR function: t = t₀ × (1 + 0.15 × (V/C)⁴). Each 20% road investment shifts V/C ratio down by ~0.12.', icon: '🛣' },
  { key: 'renewableShare', label: 'Renewable Energy Share', description: 'Feeds Energy Grid Model (Load Duration Curve)', tooltip: 'Karnataka grid EF: 0.82 kgCO₂/kWh (CEA 2023). Each 10% renewable increase reduces grid CO₂ intensity by ~0.075 kgCO₂/kWh.', icon: '☀' },
  { key: 'waterInfrastructure', label: 'Water Infrastructure Upgrade', description: 'Feeds IWA Water Balance Model', tooltip: 'Bengaluru leakage rate: 40% of supply. Each 10% infrastructure investment reduces leakage by 3%, adding ~60 MLD effective supply.', icon: '💧' },
  { key: 'greenSpaceAllocation', label: 'Green Space Allocation', description: 'Feeds AQI + Temperature models', tooltip: 'Green spaces sequester ~500 kt CO₂/yr per 100% allocation. Also reduces urban heat island effect, lowering peak energy demand.', icon: '🌿' },
  { key: 'industrialZoning', label: 'Industrial Zoning Intensity', description: 'Feeds Land Use + Solow-Swan Economic Model', tooltip: 'Solow-Swan: Y = A × K^α × L^(1-α). Industrial zoning above 50% increases GDP growth but adds CO₂ and worsens AQI.', icon: '🏭' },
];

export default function DecisionTwinPage() {
  const { activePolicy, results, timeline, isComputing, setPolicy, activeScenarioName } = useSimulationStore();
  const { openSaveScenario, isSaveScenarioOpen, closeSaveScenario } = useUIStore();
  const [showCascade, setShowCascade] = useState(true);
  const [explainSlider, setExplainSlider] = useState<keyof PolicyInput | null>(null);

  const timelineChart = timeline.filter((_, i) => i % 5 === 0 || timeline[i].year === 2025 || timeline[i].year === 2050);

  const radarData = [
    { dimension: 'Mobility', value: Math.max(0, 100 - results.traffic.after) },
    { dimension: 'Environment', value: Math.max(0, 100 - results.aqi.after / 2) },
    { dimension: 'Energy', value: 70 },
    { dimension: 'Water', value: Math.max(0, 100 - (results.water.after / results.water.before * 50)) },
    { dimension: 'Economy', value: Math.min(100, 50 + results.gdp.after * 5) },
    { dimension: 'Safety', value: 72 },
    { dimension: 'Equity', value: 60 + (activePolicy.metroExpansion * 0.2) },
    { dimension: 'Climate', value: Math.max(0, 100 - (results.co2.after / results.co2.before * 80)) },
  ];

  // Derive scenario summary metrics
  const activePoliciesCount = Object.values(activePolicy).filter(v => v > 0).length;
  const avgImprovement = [
    -results.traffic.delta,
    -results.co2.delta / 100,
    -results.aqi.delta,
    results.gdp.delta,
  ];
  const avgDelta = avgImprovement.reduce((a, b) => a + b, 0) / avgImprovement.length;
  const summaryDirection = avgDelta > 0 ? 'positive' : avgDelta < 0 ? 'negative' : 'neutral';
  const summaryColor = summaryDirection === 'positive' ? 'var(--accent-teal)' : summaryDirection === 'negative' ? 'var(--accent-red)' : 'var(--text-muted)';

  // Key years for timeline annotations
  const milestoneYears = [
    { year: 2025, label: 'Baseline' },
    { year: 2030, label: 'Karnataka EV Target' },
    { year: 2040, label: 'Net-Zero Pathway' },
    { year: 2050, label: 'Horizon' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden', background: 'var(--bg-surface-2)' }}>

      {/* SCENARIO SUMMARY BAR */}
      <div className="glass-card" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', flexShrink: 0, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="micro-label" style={{ color: 'var(--text-muted)' }}>Scenario</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeScenarioName || 'Custom Configuration'}
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="micro-label" style={{ color: 'var(--text-muted)' }}>Policies</span>
            <span className="data-value" style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{activePoliciesCount}/7</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="micro-label" style={{ color: 'var(--text-muted)' }}>Confidence</span>
            <span className="data-value" style={{ fontSize: '13px', color: 'var(--accent-teal)', fontWeight: 600 }}>{Math.round(results.confidence * 100)}%</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="micro-label" style={{ color: 'var(--text-muted)' }}>Net Impact</span>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
              background: summaryDirection === 'positive' ? 'var(--accent-teal-light)' : summaryDirection === 'negative' ? 'var(--accent-red-light)' : 'var(--bg-surface-2)',
              color: summaryColor,
            }}>
              {summaryDirection === 'positive' ? '▲ Improving' : summaryDirection === 'negative' ? '▼ Declining' : '◆ Stable'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isComputing && (
            <span className="badge badge-live live-dot" style={{ fontSize: '10px' }}>COMPUTING</span>
          )}
          <button onClick={openSaveScenario} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>💾 Save</button>
          <Link href="/scenarios" style={{ textDecoration: 'none' }}>
            <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '12px' }}>📁 Load</button>
          </Link>
        </div>
      </div>

      {/* MAIN 2-COLUMN LAYOUT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT PANEL — Policy Sliders */}
        <div className="glass-card" style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)', borderRadius: 0, position: 'relative' }}>

          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Policy Controls</h2>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Adjust sliders to simulate policy impact</p>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="hide-scrollbar">
            {SLIDERS.map((slider, i) => (
              <motion.div key={slider.key} custom={i} variants={sectionVariants} initial="hidden" animate="visible">
                <PolicySlider
                  label={slider.label} description={slider.description} tooltip={slider.tooltip} icon={slider.icon}
                  value={activePolicy[slider.key]} onChange={v => setPolicy({ [slider.key]: v })}
                  onExplain={() => setExplainSlider(slider.key)}
                />
              </motion.div>
            ))}
          </div>

          {/* Explain Panel Overlay */}
          <AnimatePresence>
            {explainSlider && (
              <ExplainPanel sliderKey={explainSlider} onClose={() => setExplainSlider(null)} />
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL — Main Visualization Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }} className="hide-scrollbar">

          {/* Section: Impact Assessment */}
          <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Impact Assessment</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {results.methodology.slice(0, 3).map(m => (
                  <span key={m} className="badge badge-navy" style={{ fontSize: '9px' }}>{m.split('(')[0].trim()}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              <MetricDelta label="Traffic Congestion" before={results.traffic.before} after={results.traffic.after} delta={results.traffic.delta} unit="%congestion" confidence={results.traffic.confidence} />
              <MetricDelta label="CO₂ Emissions" before={results.co2.before} after={results.co2.after} delta={results.co2.delta} unit="ktCO2/yr" confidence={results.co2.confidence} />
              <MetricDelta label="Air Quality" before={results.aqi.before} after={results.aqi.after} delta={results.aqi.delta} unit="AQI" confidence={results.aqi.confidence} />
              <MetricDelta label="Water Demand Gap" before={results.water.before} after={results.water.after} delta={results.water.delta} unit="MLD" confidence={results.water.confidence} />
            </div>
          </motion.div>

          {/* Section: Timeline + Radar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Timeline Chart */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>2025–2050 City Health Projection</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {milestoneYears.filter(m => m.year <= 2050).map(m => (
                    <span key={m.year} style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-surface-2)' }}>
                      {m.year}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={timelineChart} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-navy)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--accent-navy)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.4} />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<TimelineTooltip />} />
                  {/* Year markers */}
                  {milestoneYears.map(m => (
                    <ReferenceLine
                      key={m.year}
                      x={m.year}
                      stroke="var(--border-subtle)"
                      strokeDasharray="4 4"
                      label={{
                        value: m.label,
                        position: 'insideTopRight',
                        fill: 'var(--text-muted)',
                        fontSize: 9,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                  <Area type="monotone" dataKey="city_health" stroke="var(--accent-navy)" strokeWidth={2} fill="url(#healthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar Chart */}
            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Performance Vector Analysis</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }} />
                  <Radar dataKey="value" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Section: Cascading Effects Tree */}
          <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Cascading Effects Network</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>How policies propagate through interconnected urban systems</p>
              </div>
              <button onClick={() => setShowCascade(o => !o)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }}>
                {showCascade ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-subtle)' }}>
              {showCascade && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {results.cascadingEffects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Adjust policy sliders on the left to initialize computation
                    </div>
                  ) : (
                    results.cascadingEffects.map((node, i) => (
                      <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <CascadeNodeView key={node.id} node={node} depth={0} />
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {isSaveScenarioOpen && <SaveScenarioModal onClose={closeSaveScenario} />}
    </div>
  );
}
