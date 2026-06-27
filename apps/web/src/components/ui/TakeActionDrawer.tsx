"use client";

import React, { useState } from 'react';
import { useSimulationStore, useUIStore, useScenarioStore, useAppStore } from '@/stores';

const INTERVENTIONS = [
  {
    priority: 'P1',
    priorityColor: '#EF4444',
    title: 'Emergency Substation Load Balancing',
    rationale: 'Substation #11 at 87% capacity — blackout risk in Q3 2025',
    impact: '↓ 23% grid stress in NE zone within 48h',
    confidence: 91,
    icon: '⚡',
    agentId: 'infrastructure',
  },
  {
    priority: 'P1',
    priorityColor: '#EF4444',
    title: 'Silk Board Signal Optimization',
    rationale: 'Corridor at 34% above baseline congestion — speed: 8 km/h',
    impact: '↓ 12% congestion, +4 min/veh avg speed improvement',
    confidence: 87,
    icon: '🚦',
    agentId: 'urban',
  },
  {
    priority: 'P2',
    priorityColor: '#F59E0B',
    title: 'Bellandur Water Emergency Protocol',
    rationale: 'Groundwater at −2.3m since Jan; 350 MLD gap by 2027',
    impact: 'Prevent water stress escalation for 280,000 residents',
    confidence: 84,
    icon: '💧',
    agentId: 'sustainability',
  },
  {
    priority: 'P2',
    priorityColor: '#F59E0B',
    title: 'Whitefield AQI Abatement Program',
    rationale: 'Industrial zone PM2.5 168 AQI — above safe threshold',
    impact: '↓ 18 AQI pts within 2 weeks of enforcement',
    confidence: 79,
    icon: '🌫',
    agentId: 'sustainability',
  },
  {
    priority: 'P3',
    priorityColor: '#10B981',
    title: 'Purple Line Frequency Increase',
    rationale: 'Hebbal–Nagawara at 112% planned capacity — overcrowding',
    impact: '↓ 8% average wait time, +11% ridership capacity',
    confidence: 93,
    icon: '🚇',
    agentId: 'urban',
  },
];

export function TakeActionDrawer() {
  const { isTakeActionOpen, closeTakeAction, openAgentHub } = useUIStore();
  const { results } = useSimulationStore();
  const { saveScenario } = useScenarioStore();
  const { addNotification } = useAppStore();

  const [activatedIds, setActivatedIds] = useState<Set<number>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  const handleActivate = async (index: number, title: string) => {
    setLoadingIds(prev => new Set([...prev, index]));
    await new Promise(r => setTimeout(r, 1500));
    setLoadingIds(prev => { const n = new Set(prev); n.delete(index); return n; });
    setActivatedIds(prev => new Set([...prev, index]));
    addNotification({ title: 'Protocol Activated', message: `"${title}" — Response teams notified`, severity: 'success' });
  };

  if (!isTakeActionOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeTakeAction}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, backdropFilter: 'blur(4px)' }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '440px',
        background: 'var(--bg-surface-1)',
        borderLeft: '1px solid var(--border-subtle)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slide-right 0.2s ease-out',
        boxShadow: '-8px 0 32px rgba(15,23,42,0.06)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>AI Recommended Interventions</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Based on current city metrics · Confidence-ranked
            </div>
          </div>
          <button
            onClick={closeTakeAction}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}
          >×</button>
        </div>

        {/* Context */}
        <div style={{ padding: '12px 24px', background: 'var(--accent-blue-light)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current Simulation Context</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent-blue)' }}>Traffic Δ{results.traffic.delta}%</span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent-teal)' }}>CO₂ Δ{results.co2.delta > 0 ? '+' : ''}{(results.co2.delta / 100).toFixed(0)}kt</span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent-amber)' }}>AQI Δ{results.aqi.delta}</span>
          </div>
        </div>

        {/* Interventions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {INTERVENTIONS.map((item, i) => {
            const isActivated = activatedIds.has(i);
            const isLoading = loadingIds.has(i);

            return (
              <div
                key={i}
                style={{
                  padding: '14px',
                  background: isActivated ? 'var(--accent-teal-light)' : 'var(--bg-surface-2)',
                  border: `1px solid ${isActivated ? 'rgba(13,148,136,0.3)' : 'var(--border-subtle)'}`,
                  borderRadius: '10px',
                  transition: 'all 200ms',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{
                      padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em',
                      background: `${item.priorityColor}18`, color: item.priorityColor, border: `1px solid ${item.priorityColor}30`,
                    }}>{item.priority}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '40px', height: '4px', background: 'var(--bg-surface-3)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.confidence}%`, background: item.confidence >= 85 ? 'var(--accent-teal)' : 'var(--accent-amber)', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.confidence}%</span>
                  </div>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: 1.4 }}>{item.rationale}</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 500, marginBottom: '10px' }}>{item.impact}</div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {isActivated ? (
                    <span style={{ padding: '5px 10px', background: 'var(--accent-teal-light)', border: '1px solid var(--accent-teal)', borderRadius: '5px', fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 600 }}>
                      ✓ Activated
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActivate(i, item.title)}
                      disabled={isLoading}
                      style={{
                        padding: '5px 12px', background: 'var(--accent-blue-light)', border: '1px solid var(--border-normal)',
                        borderRadius: '5px', fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      {isLoading ? '...' : 'Activate'}
                    </button>
                  )}
                  <button
                    onClick={() => openAgentHub(item.agentId)}
                    style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border-normal)', borderRadius: '5px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    Ask Agent
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => saveScenario('Current Interventions', 'Auto-saved from Take Action drawer', ['dashboard', 'interventions'], '')}
            style={{
              width: '100%', padding: '10px', background: 'var(--accent-navy-light)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', color: 'var(--accent-navy)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Save as Scenario
          </button>
        </div>
      </div>
    </>
  );
}
