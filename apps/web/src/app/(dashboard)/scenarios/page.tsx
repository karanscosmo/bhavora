"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useScenarioStore, useSimulationStore, useAppStore } from '@/stores';
import { exportToCSV } from '@/lib/exportUtils';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ScenariosPage() {
  const router = useRouter();
  const { scenarios, compareIds, toggleCompare, clearCompare, deleteScenario, archiveScenario, approveScenario, loadScenario } = useScenarioStore();
  const sim = useSimulationStore();
  const { addNotification } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios.filter(s => {
      // Tab filter
      if (activeTab === 'approved' && s.status !== 'approved') return false;
      if (activeTab === 'archived' && s.status !== 'archived') return false;
      if (activeTab === 'all' && s.status === 'archived') return false; // Hide archived from main list

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [scenarios, activeTab, searchQuery]);

  // Comparison logic details
  const comparedScenarios = useMemo(() => {
    return compareIds.map(id => scenarios.find(s => s.id === id)).filter(Boolean);
  }, [compareIds, scenarios]);

  const handleExportCSV = () => {
    if (scenarios.length === 0) {
      addNotification({ title: 'Export Failed', message: 'No scenarios available to export', severity: 'warning' });
      return;
    }
    const data = scenarios.map(s => ({
      ID: s.id,
      Name: s.name,
      Description: s.description,
      CreatedAt: s.createdAt,
      Status: s.status,
      MetroExpansion: s.policies.metroExpansion,
      EVAdoptionRate: s.policies.evAdoptionRate,
      RoadCapacity: s.policies.roadCapacity,
      RenewableShare: s.policies.renewableShare,
      WaterInfrastructure: s.policies.waterInfrastructure,
      GreenSpaceAllocation: s.policies.greenSpaceAllocation,
      IndustrialZoning: s.policies.industrialZoning,
      TrafficCongestionResult: s.results.traffic.after,
      CO2Result: s.results.co2.after,
      AQIResult: s.results.aqi.after,
      GDPResult: s.results.gdp.after,
      CityHealthResult: s.results.cityHealth.after,
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

  const handleApprove = (id: string, name: string) => {
    approveScenario(id);
    addNotification({ title: 'Scenario Approved', message: `"${name}" marked as approved strategy`, severity: 'success' });
  };

  const handleArchive = (id: string, name: string) => {
    archiveScenario(id);
    addNotification({ title: 'Scenario Archived', message: `"${name}" moved to archives`, severity: 'info' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete scenario "${name}"?`)) {
      deleteScenario(id);
      addNotification({ title: 'Scenario Deleted', message: `"${name}" removed from vault`, severity: 'info' });
    }
  };

  // Compare results charts helper
  const comparisonChartData = useMemo(() => {
    if (comparedScenarios.length === 0) return [];
    // Convert 2025 to 2050 timeline for compared scenarios into chart arrays
    const years = [2025, 2030, 2035, 2040, 2045, 2050];
    return years.map(yr => {
      const row: any = { year: yr };
      comparedScenarios.forEach((s: any) => {
        const state = s.timeline.find((t: any) => t.year === yr);
        row[s.name] = state ? state.city_health : 64;
      });
      return row;
    });
  }, [comparedScenarios]);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/overview')}>Command Center</span>
            {' / '}Scenario Vault
          </nav>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Scenario Vault</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
            Save, load, manage and compare policy scenarios computed by the Bhavora simulation engine.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportCSV} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '12px' }}>
            ⬇ Export Vault CSV
          </button>
          <button onClick={() => router.push('/decision-twin')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            ➕ Create New Scenario
          </button>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 14px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: 'All Scenarios' },
            { id: 'approved', label: 'Approved Strategies' },
            { id: 'archived', label: 'Archives' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                background: activeTab === t.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                color: activeTab === t.id ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                transition: 'all 120ms',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by name or tags..."
          className="input-dark"
          style={{ width: '220px', fontSize: '12px' }}
        />
      </div>

      {/* Main Content Layout (Left: Lists, Right: Multi-Comparison Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: compareIds.length > 0 ? '1fr 440px' : '1fr', gap: '16px', alignItems: 'start' }}>
        
        {/* Scenarios Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '12px' }}>
          {filteredScenarios.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📂</div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>No Scenarios Found</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>
                {searchQuery ? 'Try adjusting your search query' : 'Create and save your first simulation policy configuration'}
              </p>
              <button onClick={() => router.push('/decision-twin')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Go to Decision Twin
              </button>
            </div>
          ) : (
            filteredScenarios.map(s => {
              const isCompared = compareIds.includes(s.id);
              const confColor = s.results.confidence >= 0.85 ? '#10B981' : s.results.confidence >= 0.65 ? '#F59E0B' : '#EF4444';

              return (
                <div
                  key={s.id}
                  className="glass-card"
                  style={{
                    padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px',
                    borderColor: isCompared ? 'rgba(0, 212, 255, 0.4)' : undefined,
                    boxShadow: isCompared ? '0 0 8px rgba(0, 212, 255, 0.15)' : undefined,
                  }}
                >
                  {/* Status, tags & date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: s.status === 'approved' ? 'rgba(16,185,129,0.12)' : s.status === 'archived' ? 'rgba(255,255,255,0.06)' : 'rgba(0,212,255,0.08)',
                        color: s.status === 'approved' ? '#10B981' : s.status === 'archived' ? 'rgba(255,255,255,0.4)' : '#00D4FF',
                        border: `1px solid ${s.status === 'approved' ? 'rgba(16,185,129,0.2)' : s.status === 'archived' ? 'rgba(255,255,255,0.1)' : 'rgba(0,212,255,0.15)'}`
                      }}>
                        {s.status}
                      </span>
                      {s.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ padding: '2px 5px', borderRadius: '4px', fontSize: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(s.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{s.name}</h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>{s.description || 'No description provided'}</p>
                  </div>

                  {/* Metrics preview row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>City Health</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#00D4FF', marginTop: '2px' }}>{s.results.cityHealth.after}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CO2 Delta</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: s.results.co2.delta < 0 ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                        {s.results.co2.delta > 0 ? '+' : ''}{(s.results.co2.delta / 100).toFixed(0)}kt
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confidence</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: confColor, marginTop: '2px' }}>{Math.round(s.results.confidence * 100)}%</div>
                    </div>
                  </div>

                  {/* Vault Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleLoad(s.id)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '11px' }}>
                        ⚡ Load
                      </button>
                      <button
                        onClick={() => toggleCompare(s.id)}
                        style={{
                          padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                          background: isCompared ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
                          border: `1px solid ${isCompared ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                          color: isCompared ? '#00D4FF' : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        ⚖ Compare
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {s.status !== 'approved' && (
                        <button onClick={() => handleApprove(s.id, s.name)} className="btn-ghost" style={{ padding: '5px 8px', fontSize: '11px' }} title="Approve scenario">
                          ✓
                        </button>
                      )}
                      {s.status !== 'archived' && (
                        <button onClick={() => handleArchive(s.id, s.name)} className="btn-ghost" style={{ padding: '5px 8px', fontSize: '11px' }} title="Archive scenario">
                          🗄
                        </button>
                      )}
                      <button onClick={() => handleDelete(s.id, s.name)} className="btn-ghost" style={{ padding: '5px 8px', fontSize: '11px', color: '#EF4444' }} title="Delete scenario">
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Multi-Comparison Dashboard Panel */}
        {compareIds.length > 0 && (
          <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(10,22,40,0.9)', position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Comparative Assessment</h3>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Comparing {comparedScenarios.length} of max 3 profiles</span>
              </div>
              <button onClick={clearCompare} style={{ background: 'none', border: 'none', color: '#00D4FF', fontSize: '11px', cursor: 'pointer' }}>
                Clear comparison
              </button>
            </div>

            {/* Compared names */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {comparedScenarios.map((s, idx) => (
                <div key={s?.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === 0 ? '#00D4FF' : idx === 1 ? '#7C3AED' : '#10B981' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{s?.name}</span>
                </div>
              ))}
            </div>

            {/* Metrics Delta list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'City Health Index', key: 'cityHealth' },
                { label: 'Congestion Rate', key: 'traffic' },
                { label: 'Carbon Emissions', key: 'co2' },
                { label: 'Water Demand', key: 'water' },
                { label: 'GDP Growth', key: 'gdp' },
              ].map(m => (
                <div key={m.key} style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${comparedScenarios.length}, 1fr)`, gap: '8px' }}>
                    {comparedScenarios.map((s: any, idx) => (
                      <div key={s.id} style={{ lineHeight: 1 }}>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: idx === 0 ? '#00D4FF' : idx === 1 ? '#7C3AED' : '#10B981' }}>
                          {s.results[m.key].after}{s.results[m.key].unit}
                        </span>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                          Δ {s.results[m.key].delta > 0 ? '+' : ''}{s.results[m.key].delta}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Multi-Timeline Projection Chart */}
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>2025–2050 City Health Projection</div>
              <div style={{ height: '140px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                    <YAxis domain={[40, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                    {comparedScenarios.map((s, idx) => (
                      <Line
                        key={s?.id}
                        type="monotone"
                        dataKey={s?.name || ''}
                        stroke={idx === 0 ? '#00D4FF' : idx === 1 ? '#7C3AED' : '#10B981'}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
