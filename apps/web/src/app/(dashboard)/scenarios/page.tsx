"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useScenarioStore, useSimulationStore, useAppStore, useUIStore } from '@/stores';
import { exportToCSV } from '@/lib/exportUtils';
import {
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import type { Scenario } from '@/stores';

// ─── Helpers ───────────────────────────────────────────────────────────
const statusConfig = {
  draft:     { label: 'Draft',     color: 'var(--text-muted)', bg: 'var(--bg-surface-3)' },
  simulated: { label: 'Active',    color: 'var(--accent-teal)', bg: 'var(--accent-teal-light)' },
  approved:  { label: 'Approved',  color: 'var(--accent-navy)', bg: 'var(--accent-navy-light)' },
  archived:  { label: 'Archived',  color: 'var(--text-secondary)', bg: 'var(--bg-surface-3)' },
} as const;

type ViewMode = 'card' | 'list' | 'timeline';
type SortMode = 'newest' | 'oldest' | 'impact';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function deltaStr(delta: number, unit: string, greenDown = false) {
  const sign = delta > 0 ? '+' : '';
  const isGood = greenDown ? delta < 0 : delta > 0;
  return { text: `${sign}${delta.toFixed(1)}${unit}`, isGood };
}

// ─── Component ─────────────────────────────────────────────────────────
export default function ScenariosPage() {
  const router = useRouter();
  const {
    scenarios, compareIds, toggleCompare, clearCompare,
    deleteScenario, archiveScenario, approveScenario, loadScenario,
  } = useScenarioStore();
  const sim = useSimulationStore();
  const { addNotification } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [archivesOpen, setArchivesOpen] = useState(false);

  // ── Filtered & sorted ──────────────────────────────────────────────
  const filteredScenarios = useMemo(() => {
    let list = scenarios.filter(s => {
      if (activeTab === 'approved' && s.status !== 'approved') return false;
      if (activeTab === 'archived' && s.status !== 'archived') return false;
      if (activeTab === 'all' && s.status === 'archived') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q)
          || s.description.toLowerCase().includes(q)
          || s.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
    if (sortMode === 'newest') list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortMode === 'oldest') list = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (sortMode === 'impact') list = [...list].sort((a, b) => b.results.cityHealth.delta - a.results.cityHealth.delta);
    return list;
  }, [scenarios, activeTab, searchQuery, sortMode]);

  const compareScenarios = useMemo(() =>
    compareIds.map(id => scenarios.find(s => s.id === id)).filter(Boolean) as Scenario[],
    [compareIds, scenarios],
  );

  // ── Handlers ────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (scenarios.length === 0) {
      addNotification({ title: 'Export Failed', message: 'No scenarios available to export', severity: 'warning' });
      return;
    }
    const data = scenarios.map(s => ({
      ID: s.id, Name: s.name, Description: s.description, CreatedAt: s.createdAt, Status: s.status,
      MetroExpansion: s.policies.metroExpansion, EVAdoptionRate: s.policies.evAdoptionRate, RoadCapacity: s.policies.roadCapacity,
      RenewableShare: s.policies.renewableShare, WaterInfrastructure: s.policies.waterInfrastructure, GreenSpaceAllocation: s.policies.greenSpaceAllocation,
      IndustrialZoning: s.policies.industrialZoning,
      TrafficCongestionResult: s.results.traffic.after, CO2Result: s.results.co2.after, AQIResult: s.results.aqi.after,
      GDPResult: s.results.gdp.after, CityHealthResult: s.results.cityHealth.after,
    }));
    try {
      exportToCSV(data, `Bhavora_Scenarios_${new Date().toISOString().split('T')[0]}.csv`);
      addNotification({ title: 'Export Complete', message: 'Scenario Vault CSV downloaded successfully', severity: 'success' });
    } catch {
      addNotification({ title: 'Export Failed', message: 'Could not write CSV file', severity: 'critical' });
    }
  };

  const handleLoad = (id: string) => {
    loadScenario(id);
    addNotification({ title: 'Scenario Loaded', message: 'Policy settings applied to Decision Twin', severity: 'success' });
    router.push('/decision-twin');
  };

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Radar data for comparison ───────────────────────────────────────
  const comparisonRadarData = useMemo(() => {
    if (compareScenarios.length < 2) return [];
    const metrics = [
      { key: 'cityHealth',   label: 'City Health',   better: 'high' },
      { key: 'gdp',          label: 'GDP Growth',    better: 'high' },
      { key: 'modalSplit',   label: 'Transit %',     better: 'high' },
      { key: 'co2',          label: 'CO₂ (inverted)',better: 'low'  },
      { key: 'traffic',      label: 'Traffic (inv)', better: 'low'  },
    ];
    const COLORS = ['#004ac6', '#006242', '#D97706', '#7C3AED'];
    return metrics.map((m, mi) => {
      const point: any = { metric: m.label };
      compareScenarios.forEach((sc, si) => {
        const raw = (sc.results as any)[m.key]?.after ?? 50;
        const maxVal = 100;
        point[sc.name] = m.better === 'low' ? maxVal - raw : raw;
        point[`${sc.name}_color`] = COLORS[si % COLORS.length];
      });
      return point;
    });
  }, [compareScenarios]);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', position: 'relative', overflow: 'hidden', background: 'var(--bg-surface-2)' }}>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 48px', overflowY: 'auto' }} className="hide-scrollbar">

        {/* ═══ Header ═══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Mission Planning Center
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Design, compare, and deploy urban policy scenarios
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {compareIds.length > 0 && (
              <button onClick={clearCompare} className="btn-ghost" style={{ fontSize: '12px', padding: '6px 14px' }}>
                Clear Compare ({compareIds.length})
              </button>
            )}
            <button onClick={handleExportCSV} className="btn-ghost">Export CSV</button>
            <button onClick={() => router.push('/decision-twin')} className="btn-primary">New Scenario</button>
          </div>
        </div>

        {/* ═══ Toolbar ═══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { id: 'all',      label: 'All Scenarios' },
              { id: 'approved', label: 'Approved' },
              { id: 'archived', label: 'Archives' },
            ].map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id as any); setArchivesOpen(false); }}
                style={{
                  background: 'none', border: 'none', padding: '0 0 4px 0',
                  fontSize: '14px', fontWeight: activeTab === t.id ? 600 : 400,
                  color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer', borderBottom: activeTab === t.id ? '2px solid var(--accent-navy)' : '2px solid transparent',
                  transition: 'all 150ms',
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Sort */}
            <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}
              style={{
                background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px',
                padding: '6px 10px', fontSize: '12px', color: 'var(--text-secondary)', outline: 'none',
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="impact">Highest Impact</option>
            </select>

            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              {(['card', 'list', 'timeline'] as ViewMode[]).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  style={{
                    background: viewMode === mode ? 'var(--accent-navy-light)' : 'transparent',
                    border: 'none', padding: '6px 12px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: viewMode === mode ? 600 : 400,
                    color: viewMode === mode ? 'var(--accent-navy)' : 'var(--text-muted)',
                    transition: 'all 120ms',
                  }}
                >{mode === 'card' ? '▣ Cards' : mode === 'list' ? '☰ List' : '◷ Timeline'}</button>
              ))}
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 12px', width: '200px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '6px' }}>⌕</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter scenarios..."
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* ═══ Comparison Panel ═══ */}
        <AnimatePresence>
          {compareScenarios.length >= 2 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden', marginBottom: '20px' }}
            >
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Scenario Comparison</h3>
                  <button onClick={clearCompare} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>Clear</button>
                </div>

                {/* Radar overlay */}
                {comparisonRadarData.length > 0 && (
                  <div style={{ height: '220px', marginBottom: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={comparisonRadarData}>
                        <PolarGrid stroke="var(--border-subtle)" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                        <PolarRadiusAxis tick={false} axisLine={false} />
                        {compareScenarios.map((sc, si) => {
                          const colors = ['#004ac6', '#006242', '#D97706', '#7C3AED'];
                          return <Radar key={sc.id} dataKey={sc.name} name={sc.name} stroke={colors[si]} fill={colors[si]} fillOpacity={0.08} strokeWidth={2} />;
                        })}
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Side-by-side metric cards */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareScenarios.length}, 1fr)`, gap: '12px' }}>
                  {compareScenarios.map(sc => (
                    <div key={sc.id} style={{ padding: '12px', background: 'var(--bg-surface-2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{sc.name}</div>
                      {[
                        { label: 'City Health', key: 'cityHealth', unit: 'pts' },
                        { label: 'CO₂',          key: 'co2',        unit: 'kt'  },
                        { label: 'Traffic',      key: 'traffic',    unit: '%'   },
                        { label: 'GDP Growth',   key: 'gdp',        unit: '%'   },
                      ].map(m => {
                        const v = (sc.results as any)[m.key];
                        return (
                          <div key={m.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                            <span className="data-value" style={{ fontWeight: 600, color: v.delta > 0 ? 'var(--accent-teal)' : v.delta < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                              {v.delta > 0 ? '+' : ''}{v.delta.toFixed(1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Winner indicators */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Best City Health', key: 'cityHealth', higher: true },
                    { label: 'Lowest CO₂',        key: 'co2',        higher: false },
                    { label: 'Best GDP',          key: 'gdp',        higher: true },
                  ].map(m => {
                    const best = compareScenarios.reduce((a, b) => {
                      const va = (a.results as any)[m.key]?.delta ?? 0;
                      const vb = (b.results as any)[m.key]?.delta ?? 0;
                      return m.higher ? (va > vb ? a : b) : (va < vb ? a : b);
                    });
                    return (
                      <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-1)', borderRadius: '8px', padding: '6px 12px', border: '1px solid var(--accent-amber-light)' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent-amber)', letterSpacing: '0.05em' }}>🏆</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{m.label}:</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{best.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Empty State ═══ */}
        {filteredScenarios.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}
          >
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--accent-navy-light), var(--accent-teal-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', marginBottom: '20px',
              boxShadow: '0 8px 24px rgba(0,74,198,0.1)',
            }}>
              🎯
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              No Missions Yet
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center', margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Your mission planning center is empty. Create a new scenario in the Decision Twin to start designing, comparing, and deploying urban policy missions.
            </p>
            <button onClick={() => router.push('/decision-twin')} className="btn-primary" style={{ padding: '10px 24px' }}>
              + Launch New Mission
            </button>
          </motion.div>
        )}

        {/* ═══ Card View ═══ */}
        {filteredScenarios.length > 0 && viewMode === 'card' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filteredScenarios.map((s, idx) => {
              const st = statusConfig[s.status];
              const isComparing = compareIds.includes(s.id);
              const isExpanded = expandedCards.has(s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={`glass-card ${isComparing ? 'card-elevated' : ''}`}
                  style={{
                    padding: '20px', cursor: 'default', position: 'relative',
                    border: isComparing ? '2px solid var(--accent-navy)' : undefined,
                  }}
                >
                  {/* Status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: st.bg, color: st.color,
                    }}>
                      {s.status === 'simulated' && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.color, animation: 'live-pulse 2s ease-in-out infinite' }} />
                      )}
                      {st.label}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleCompare(s.id); }}
                        style={{
                          background: isComparing ? 'var(--accent-navy-light)' : 'var(--bg-surface-2)',
                          border: 'none', borderRadius: '8px', width: '30px', height: '30px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', fontSize: '14px', color: isComparing ? 'var(--accent-navy)' : 'var(--text-muted)',
                          transition: 'all 120ms',
                        }}
                        title="Compare">⇌</button>
                      <button onClick={(e) => { e.stopPropagation(); handleLoad(s.id); }}
                        style={{
                          background: 'var(--bg-surface-2)', border: 'none', borderRadius: '8px',
                          width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)', transition: 'all 120ms',
                        }}
                        title="Load in Decision Twin">▶</button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedScenario(s); }}
                        style={{
                          background: 'var(--bg-surface-2)', border: 'none', borderRadius: '8px',
                          width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)', transition: 'all 120ms',
                        }}
                        title="Details">⋯</button>
                    </div>
                  </div>

                  {/* Name & description */}
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {s.description || 'No description'}
                  </p>

                  {/* 3 Mini KPIs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { label: 'Health', value: s.results.cityHealth.after, delta: s.results.cityHealth.delta, unit: '' },
                      { label: 'CO₂',    value: s.results.co2.after,        delta: s.results.co2.delta,        unit: 'kt' },
                      { label: 'Traffic',value: s.results.traffic.after,    delta: s.results.traffic.delta,    unit: '%' },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--bg-surface-2)', borderRadius: '10px' }}>
                        <div className="micro-label" style={{ marginBottom: '2px' }}>{m.label}</div>
                        <div className="data-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {m.value?.toFixed(0) ?? '—'}
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: m.delta > 0 ? 'var(--accent-teal)' : m.delta < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                          {m.delta > 0 ? '↑' : m.delta < 0 ? '↓' : '―'} {Math.abs(m.delta).toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {s.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="badge-gray" style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>
                        {tag}
                      </span>
                    ))}
                    {s.tags.length > 4 && (
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '2px 4px' }}>
                        +{s.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Date & actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {formatDate(s.createdAt)}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {s.status !== 'archived' ? (
                        <button onClick={(e) => { e.stopPropagation(); archiveScenario(s.id); addNotification({ title: 'Archived', message: `${s.name} moved to archives`, severity: 'info' }); }}
                          style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px' }}
                        >Archive</button>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); approveScenario(s.id); }}
                          style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--accent-navy)', cursor: 'pointer', padding: '2px 6px' }}
                        >Restore</button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); toggleExpand(s.id); }}
                        style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--accent-navy)', cursor: 'pointer', padding: '2px 6px' }}
                      >{isExpanded ? '▲ Impact' : '▼ Impact'}</button>
                    </div>
                  </div>

                  {/* Expandable Impact Summary */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-surface-2)', borderRadius: '10px' }}>
                          <div className="micro-label" style={{ marginBottom: '8px' }}>Impact Deltas</div>
                          {[
                            { label: 'Traffic', key: 'traffic', better: 'down' },
                            { label: 'CO₂ Emissions', key: 'co2', better: 'down' },
                            { label: 'Air Quality (AQI)', key: 'aqi', better: 'down' },
                            { label: 'GDP Growth', key: 'gdp', better: 'up' },
                            { label: 'City Health', key: 'cityHealth', better: 'up' },
                            { label: 'Transit Mode', key: 'modalSplit', better: 'up' },
                          ].map(m => {
                            const v = (s.results as any)[m.key];
                            if (!v) return null;
                            const isGood = m.better === 'up' ? v.delta > 0 : v.delta < 0;
                            return (
                              <div key={m.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                                <span className="data-value" style={{ fontWeight: 600, color: isGood ? 'var(--accent-teal)' : v.delta === 0 ? 'var(--text-muted)' : 'var(--accent-red)' }}>
                                  {v.delta > 0 ? '+' : ''}{v.delta.toFixed(1)}{v.unit ? ` ${v.unit}` : ''}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ═══ List View (original table) ═══ */}
        {filteredScenarios.length > 0 && viewMode === 'list' && (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
              <span className="micro-label">Name</span>
              <span className="micro-label">Status</span>
              <span className="micro-label">Impact (Score)</span>
              <span className="micro-label">CO₂ Delta</span>
              <span className="micro-label">Tags</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredScenarios.map(s => {
                const isApproved = s.status === 'approved';
                const deltaScore = s.results.cityHealth.delta;
                const deltaColor = deltaScore > 0 ? 'var(--accent-teal)' : deltaScore < 0 ? 'var(--accent-red)' : 'var(--text-muted)';
                const co2Delta = s.results.co2.delta;
                const co2Color = co2Delta < 0 ? 'var(--accent-teal)' : co2Delta > 0 ? 'var(--accent-red)' : 'var(--text-muted)';
                return (
                  <div key={s.id} onClick={() => setSelectedScenario(s)} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', alignItems: 'center',
                    padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                    border: selectedScenario?.id === s.id ? '1px solid var(--border-accent)' : '1px solid transparent',
                    transition: 'all 150ms',
                  }} className="hover:bg-[var(--bg-surface-1)]">
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>📄 {s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {formatDate(s.createdAt)}
                      </div>
                    </div>
                    <div>
                      <span style={{
                        padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                        background: isApproved ? 'var(--accent-teal-light)' : 'var(--bg-surface-3)',
                        color: isApproved ? 'var(--accent-teal)' : 'var(--text-secondary)'
                      }}>
                        {isApproved ? 'Approved' : s.status === 'archived' ? 'Archived' : 'Draft'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: deltaColor }}>
                        {deltaScore > 0 ? '+' : ''}{deltaScore.toFixed(1)} pts
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: co2Color }}>
                        {co2Delta > 0 ? '+' : ''}{co2Delta.toFixed(1)} ktCO₂
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {s.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ padding: '2px 8px', background: 'var(--bg-surface-3)', borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {tag}
                        </span>
                      ))}
                      {s.tags.length > 3 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{s.tags.length - 3}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ Timeline View ═══ */}
        {filteredScenarios.length > 0 && viewMode === 'timeline' && (
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '15px', top: '0', bottom: '0', width: '2px', background: 'var(--border-subtle)' }} />
            {[...filteredScenarios].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((s, idx) => {
              const st = statusConfig[s.status];
              const year = new Date(s.createdAt).getFullYear();
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  style={{ position: 'relative', marginBottom: '16px', paddingLeft: '24px' }}
                >
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '-25px', top: '16px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: st.color, border: '2px solid var(--bg-surface-2)',
                    boxShadow: s.status === 'simulated' ? `0 0 0 4px ${st.bg}` : undefined,
                  }} />
                  {/* Content card */}
                  <div className="glass-card" style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => setSelectedScenario(s)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {formatDate(s.createdAt)} · {st.label}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div className="micro-label">Health</div>
                          <div className="data-value" style={{ fontSize: '16px', fontWeight: 700, color: s.results.cityHealth.delta > 0 ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                            {s.results.cityHealth.delta > 0 ? '+' : ''}{s.results.cityHealth.delta.toFixed(1)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="micro-label">CO₂</div>
                          <div className="data-value" style={{ fontSize: '16px', fontWeight: 700, color: s.results.co2.delta < 0 ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                            {s.results.co2.delta > 0 ? '+' : ''}{s.results.co2.delta.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ═══ Archived Section (collapsed) ═══ */}
        {activeTab === 'all' && scenarios.filter(s => s.status === 'archived').length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <button onClick={() => setArchivesOpen(!archivesOpen)}
              style={{
                background: 'var(--bg-surface-3)', border: 'none', borderRadius: '12px',
                padding: '10px 16px', cursor: 'pointer', width: '100%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)',
              }}
            >
              <span>📦 Archived Scenarios ({scenarios.filter(s => s.status === 'archived').length})</span>
              <span style={{ transform: archivesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>▼</span>
            </button>
            <AnimatePresence>
              {archivesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {scenarios.filter(s => s.status === 'archived').map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-surface-1)', borderRadius: '10px', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{formatDate(s.createdAt)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => { approveScenario(s.id); addNotification({ title: 'Restored', message: `${s.name} restored from archive`, severity: 'success' }); }}
                            style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', color: 'var(--accent-navy)' }}
                          >Restore</button>
                          <button onClick={() => { deleteScenario(s.id); addNotification({ title: 'Deleted', message: `${s.name} permanently deleted`, severity: 'warning' }); }}
                            style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', color: 'var(--accent-red)' }}
                          >Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ═══ Slide-over Drawer ═══ */}
      <AnimatePresence>
        {selectedScenario && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: '480px', flexShrink: 0, background: 'var(--bg-surface-1)',
              borderLeft: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)',
              display: 'flex', flexDirection: 'column', zIndex: 50,
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{selectedScenario.name}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedScenario.tags.map(t => <span key={t} className="micro-label" style={{ background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>)}
                </div>
              </div>
              <button onClick={() => setSelectedScenario(null)} style={{ background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                {selectedScenario.description || 'No description provided.'}
              </p>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Policy Inputs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {Object.entries(selectedScenario.policies).map(([k, v]) => (
                    <div key={k} style={{ padding: '12px', background: 'var(--bg-surface-2)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div className="micro-label">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="data-value" style={{ fontSize: '16px', color: 'var(--accent-navy)', marginTop: '4px' }}>{v}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Timeline Projection</h3>
                <div style={{ height: '200px', background: 'var(--bg-surface-2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedScenario.timeline.filter((_, i) => i % 5 === 0 || i === 25)} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="city_health" stroke="var(--accent-teal)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
              <button onClick={() => { approveScenario(selectedScenario.id); setSelectedScenario({ ...selectedScenario, status: 'approved' }); }} className="btn-secondary" style={{ flex: 1 }}>
                {selectedScenario.status === 'approved' ? 'Approved ✓' : 'Approve'}
              </button>
              <button onClick={() => handleLoad(selectedScenario.id)} className="btn-primary" style={{ flex: 2 }}>
                Load in Decision Twin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
