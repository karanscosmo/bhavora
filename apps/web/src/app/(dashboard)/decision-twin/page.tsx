"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore, useUIStore, useScenarioStore, useAppStore } from '@/stores';
import { PolicyInput, CascadeNode } from '@/lib/simulation';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';

// ===== SLIDER COMPONENT =====
function PolicySlider({
  label, description, tooltip, value, onChange, icon,
}: {
  label: string; description: string; tooltip: string;
  value: number; onChange: (v: number) => void; icon: string;
}) {
  const [showTip, setShowTip] = useState(false);

  const percentage = value;
  const trackColor = percentage > 66 ? '#10B981' : percentage > 33 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{icon}</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{label}</span>
          <button
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >?</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: trackColor }}>{value}%</span>
          <button
            onClick={() => onChange(0)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '10px' }}
            title="Reset to baseline"
          >↺</button>
        </div>
      </div>
      {showTip && (
        <div style={{
          padding: '8px 10px', background: '#162040', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px',
          fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', lineHeight: 1.5,
        }}>
          {tooltip}
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>{description}</div>
      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', left: 0, width: `${value}%`, height: '4px', background: `linear-gradient(90deg, ${trackColor}60, ${trackColor})`, borderRadius: '2px', transition: 'width 150ms ease' }} />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'relative',
            width: '100%',
            appearance: 'none',
            background: 'transparent',
            cursor: 'pointer',
            height: '20px',
          }}
        />
      </div>
    </div>
  );
}

// ===== METRIC DELTA CARD =====
function MetricDelta({ label, before, after, delta, unit, confidence }: {
  label: string; before: number; after: number; delta: number; unit: string; confidence: number;
}) {
  const isGood = unit === '%congestion' ? delta < 0 : unit === 'ktCO2/yr' ? delta < 0 : unit === 'AQI' ? delta < 0 : delta > 0;
  const deltaColor = isGood ? '#10B981' : '#EF4444';
  const confidenceTier = confidence >= 0.85 ? 'High' : confidence >= 0.65 ? 'Medium' : 'Low';
  const confColor = confidence >= 0.85 ? '#10B981' : confidence >= 0.65 ? '#F59E0B' : '#EF4444';

  return (
    <div className="glass-card" style={{ padding: '14px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label} — Before</div>
        <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{typeof before === 'number' ? before.toFixed(before < 10 ? 1 : 0) : before} <span style={{ fontSize: '10px', fontWeight: 400 }}>{unit}</span></div>
      </div>
      <div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>After</div>
        <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#00D4FF' }}>{typeof after === 'number' ? after.toFixed(after < 10 ? 1 : 0) : after} <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>{unit}</span></div>
      </div>
      <div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Delta</div>
        <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, color: deltaColor }}>
          {delta > 0 ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(delta < 10 ? 1 : 0) : delta}
        </div>
        <div style={{ fontSize: '9px', color: confColor, marginTop: '2px' }}>
          {Math.round(confidence * 100)}% · {confidenceTier}
        </div>
      </div>
    </div>
  );
}

// ===== CASCADE NODE =====
function CascadeNodeView({ node, depth = 0 }: { node: CascadeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const color = node.type === 'improvement' ? '#10B981' : node.type === 'deterioration' ? '#EF4444' : 'rgba(255,255,255,0.4)';

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '5px 0', textAlign: 'left',
        }}
      >
        {node.children.length > 0 && (
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', width: '12px', flexShrink: 0 }}>
            {open ? '▼' : '▶'}
          </span>
        )}
        {node.children.length === 0 && <span style={{ width: '12px', flexShrink: 0 }} />}
        <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', padding: '1px 5px', borderRadius: '3px', background: `${color}15`, color, border: `1px solid ${color}30`, flexShrink: 0 }}>
          {node.type === 'improvement' ? '▲' : node.type === 'deterioration' ? '▼' : '●'}
        </span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{node.label}</span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginLeft: 'auto' }}>
          {Math.round(node.confidence * 100)}%
        </span>
      </button>
      {open && node.children.length > 0 && (
        <div style={{ borderLeft: `1px solid rgba(255,255,255,0.06)`, marginLeft: '5px', paddingLeft: '8px' }}>
          {node.children.map(child => (
            <CascadeNodeView key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
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
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '12px',
        padding: '24px', width: '420px', zIndex: 301, boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'scale-in 0.16s ease-out',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Save Scenario</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Save current policy configuration to Scenario Vault</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Scenario Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Metro 2035 Expansion" className="input-dark" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Brief description of this policy scenario..." className="input-dark" style={{ width: '100%', resize: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Tags (comma-separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="input-dark" style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Cancel</button>
          <button onClick={handleSave} disabled={!name.trim() || saving} className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px', opacity: !name.trim() || saving ? 0.5 : 1 }}>
            {saving ? 'Saving...' : 'Save to Vault'}
          </button>
        </div>
      </div>
    </>
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
  const { loadScenario, scenarios } = useScenarioStore();
  const [activeTab, setActiveTab] = useState<'sliders' | 'compare' | 'timeline'>('sliders');
  const [showCascade, setShowCascade] = useState(true);

  // Timeline chart data
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

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
      {/* ===== LEFT PANEL — Policy Sliders ===== */}
      <div style={{
        width: '380px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(5,10,20,0.5)',
      }}>
        {/* Panel Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Policy Levers</div>
            {isComputing && (
              <span style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 600, animation: 'fade-in 0.3s ease-out' }}>
                ● Computing...
              </span>
            )}
          </div>
          {activeScenarioName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active:</span>
              <span style={{ padding: '2px 8px', borderRadius: '20px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', fontSize: '11px', color: '#00D4FF', fontWeight: 600 }}>
                {activeScenarioName}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => openSaveScenario()}
              className="btn-primary"
              style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
            >
              💾 Save Scenario
            </button>
            <Link href="/scenarios" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ padding: '7px 12px', fontSize: '12px' }}>
                📁 Load
              </button>
            </Link>
          </div>
        </div>

        {/* Sliders */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {SLIDERS.map(slider => (
            <PolicySlider
              key={slider.key}
              label={slider.label}
              description={slider.description}
              tooltip={slider.tooltip}
              icon={slider.icon}
              value={activePolicy[slider.key]}
              onChange={v => setPolicy({ [slider.key]: v })}
            />
          ))}
        </div>

        {/* Confidence footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Simulation Confidence</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#10B981', fontWeight: 700 }}>{Math.round(results.confidence * 100)}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${results.confidence * 100}%`, background: '#10B981', borderRadius: '2px' }} />
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px', lineHeight: 1.4 }}>
            7 models: BPR · IPCC Tier 2 · IWA · Logistic · Solow-Swan · Load Curve · AQI Composite
          </div>
        </div>
      </div>

      {/* ===== CENTER/RIGHT — Results ===== */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
              <Link href="/overview" style={{ color: 'inherit', textDecoration: 'none' }}>Command Center</Link>
              {' / '}Decision Twin
            </nav>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Decision Twin Simulator</h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
              Adjust policy levers and see mathematically computed impacts across 7 urban models
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/simulation-results">
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                View Full Results →
              </button>
            </Link>
          </div>
        </div>

        {/* Before / After / Delta Grid */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Impact Matrix — Before / After / Δ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <MetricDelta label="Traffic Congestion" before={results.traffic.before} after={results.traffic.after} delta={results.traffic.delta} unit="%congestion" confidence={results.traffic.confidence} />
            <MetricDelta label="CO₂ Emissions" before={results.co2.before} after={results.co2.after} delta={results.co2.delta} unit="ktCO2/yr" confidence={results.co2.confidence} />
            <MetricDelta label="Air Quality" before={results.aqi.before} after={results.aqi.after} delta={results.aqi.delta} unit="AQI" confidence={results.aqi.confidence} />
            <MetricDelta label="Water Demand" before={results.water.before} after={results.water.after} delta={results.water.delta} unit="MLD" confidence={results.water.confidence} />
            <MetricDelta label="GDP Growth" before={results.gdp.before} after={results.gdp.after} delta={results.gdp.delta} unit="%growth" confidence={results.gdp.confidence} />
            <MetricDelta label="Transit Share" before={results.modalSplit.before} after={results.modalSplit.after} delta={results.modalSplit.delta} unit="%transit" confidence={results.modalSplit.confidence} />
            <MetricDelta label="City Health Score" before={results.cityHealth.before} after={results.cityHealth.after} delta={results.cityHealth.delta} unit="/100" confidence={results.cityHealth.confidence} />
          </div>
        </div>

        {/* Cascading Effects + Radar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
          {/* Cascade Tree */}
          <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Cascading Effects Analysis</div>
              <button
                onClick={() => setShowCascade(o => !o)}
                style={{ background: 'none', border: 'none', color: '#00D4FF', fontSize: '11px', cursor: 'pointer' }}
              >
                {showCascade ? 'Collapse' : 'Expand'}
              </button>
            </div>
            {showCascade && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {results.cascadingEffects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                    Adjust policy sliders to see cascading effects
                  </div>
                ) : (
                  results.cascadingEffects.map(node => (
                    <CascadeNodeView key={node.id} node={node} depth={0} />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Radar Chart */}
          <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Urban Performance Radar</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.12} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline projection */}
        <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>2025–2050 City Health Projection</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Timeline Projection Engine · Annual steps · Policy-adjusted</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={timelineChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                formatter={(v) => [`${v}/100`, 'City Health']}
              />
              <Area type="monotone" dataKey="city_health" stroke="#00D4FF" strokeWidth={2} fill="url(#healthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Methodology */}
        <div style={{ padding: '12px 16px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Models Applied</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {results.methodology.map(m => (
              <span key={m} style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {isSaveScenarioOpen && <SaveScenarioModal onClose={closeSaveScenario} />}
    </div>
  );
}
