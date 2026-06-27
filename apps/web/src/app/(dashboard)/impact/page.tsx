"use client";

import React, { useMemo, useState } from 'react';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { ChevronRight } from 'lucide-react';

export default function ImpactPage() {
  const { results, activePolicy } = useSimulationStore();
  const cityData = useCityDataStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 1. Dynamic District Rankings calculation
  const districtRankings = useMemo(() => {
    const districts = [
      { name: 'Whitefield', baseCong: 94, baseStress: 82, baseWater: 90 },
      { name: 'Electronic City', baseCong: 62, baseStress: 68, baseWater: 78 },
      { name: 'Koramangala', baseCong: 92, baseStress: 76, baseWater: 70 },
      { name: 'Hebbal', baseCong: 65, baseStress: 58, baseWater: 52 },
      { name: 'Indiranagar', baseCong: 88, baseStress: 62, baseWater: 48 },
    ];

    const trafficFactor = results.traffic.delta / 67;
    const waterFactor = results.water.delta / 1800;
    const energyFactor = results.energy.delta / 18500;

    return districts.map(d => {
      const currentCong = Math.round(Math.min(100, Math.max(10, d.baseCong * (1 + trafficFactor))));
      const currentWater = Math.round(Math.min(100, Math.max(10, d.baseWater * (1 + waterFactor))));
      const currentStress = Math.round(Math.min(100, Math.max(10, d.baseStress * (1 + energyFactor))));
      const compositeScore = Math.round((currentCong + currentWater + currentStress) / 3);

      return {
        name: d.name,
        congestion: currentCong,
        waterStress: currentWater,
        energyStress: currentStress,
        score: compositeScore,
        status: compositeScore > 75 ? 'Critical' : compositeScore > 55 ? 'Vulnerable' : 'Stable'
      };
    }).sort((a, b) => b.score - a.score); // Highest vulnerability rank first
  }, [results]);

  // 2. SVG-based Interactive Sankey Diagram representing policy flow
  const policyFlowWidths = useMemo(() => {
    return {
      metroToTraffic: Math.max(2, (activePolicy.metroExpansion / 100) * 45),
      roadToTraffic: Math.max(2, (activePolicy.roadCapacity / 100) * 35),
      evToCarbon: Math.max(2, (activePolicy.evAdoptionRate / 100) * 40),
      renewToEnergy: Math.max(2, (activePolicy.renewableShare / 100) * 50),
      waterToResource: Math.max(2, (activePolicy.waterInfrastructure / 100) * 40),
      trafficToCarbon: Math.max(2, Math.abs(results.traffic.delta) * 1.5),
      energyToCarbon: Math.max(2, (results.energy.after / 10000) * 12),
      carbonToHealth: Math.max(2, (100 - results.aqi.after) * 0.4),
      trafficToHealth: Math.max(2, (100 - results.traffic.after) * 0.4),
    };
  }, [activePolicy, results]);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span>Impact Analysis</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: '#00D4FF', fontWeight: 600 }}>Urban Cascades</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Impact Cascades Matrix</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Evaluate cascading feedback loops, policy flow networks, and district vulnerability indices.
        </p>
      </div>

      {/* Main Analysis Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: '16px', alignItems: 'start' }}>
        
        {/* Left Side: Sankey and Force-Link Graphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Sankey Flow Card */}
          <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Policy Impact Sankey Flow</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>
              Tracks volumetric policy inputs flow to output metrics and overall city index.
            </p>

            {/* SVG Sankey Diagram */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px' }}>
              <svg viewBox="0 0 600 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                {/* Node Columns */}
                {/* Col 1: Policies */}
                <rect x="10" y="10" width="12" height="30" fill="#7C3AED" rx="2" />
                <text x="30" y="28" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Metro Expansion</text>

                <rect x="10" y="55" width="12" height="30" fill="#3B82F6" rx="2" />
                <text x="30" y="73" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Road Capacity</text>

                <rect x="10" y="100" width="12" height="30" fill="#EF4444" rx="2" />
                <text x="30" y="118" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">EV Fleet Rate</text>

                <rect x="10" y="145" width="12" height="30" fill="#F59E0B" rx="2" />
                <text x="30" y="163" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Renewables</text>

                <rect x="10" y="190" width="12" height="30" fill="#10B981" rx="2" />
                <text x="30" y="208" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Water Network</text>

                {/* Col 2: Intermediate indicators */}
                <rect x="250" y="20" width="12" height="50" fill="#00D4FF" rx="2" />
                <text x="272" y="48" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Traffic Vol</text>

                <rect x="250" y="90" width="12" height="50" fill="#8B5CF6" rx="2" />
                <text x="272" y="118" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Carbon Level</text>

                <rect x="250" y="160" width="12" height="50" fill="#38BDF8" rx="2" />
                <text x="272" y="188" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="600">Resource Load</text>

                {/* Col 3: Outflow Health index */}
                <rect x="500" y="80" width="12" height="70" fill="#10B981" rx="2" />
                <text x="522" y="120" fill="#10B981" fontSize="11" fontWeight="700">City Health</text>

                {/* Flow lines (Bezier Curves) */}
                {/* Metro -> Traffic */}
                <path d="M 22 25 C 130 25, 130 35, 250 35" fill="none" stroke="rgba(124,90,237,0.15)" strokeWidth={policyFlowWidths.metroToTraffic} />
                {/* Road -> Traffic */}
                <path d="M 22 70 C 130 70, 130 55, 250 55" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth={policyFlowWidths.roadToTraffic} />
                {/* EV -> Carbon */}
                <path d="M 22 115 C 130 115, 130 100, 250 100" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth={policyFlowWidths.evToCarbon} />
                {/* Renewables -> Carbon */}
                <path d="M 22 160 C 130 160, 130 115, 250 115" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth={policyFlowWidths.renewToEnergy} />
                {/* Water -> Resource */}
                <path d="M 22 205 C 130 205, 130 185, 250 185" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth={policyFlowWidths.waterToResource} />

                {/* Traffic -> Health */}
                <path d="M 262 45 C 380 45, 380 95, 500 95" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth={policyFlowWidths.trafficToHealth} />
                {/* Carbon -> Health */}
                <path d="M 262 115 C 380 115, 380 115, 500 115" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth={policyFlowWidths.energyToCarbon} />
                {/* Resource -> Health */}
                <path d="M 262 185 C 380 185, 380 135, 500 135" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth={policyFlowWidths.carbonToHealth} />
              </svg>
            </div>
          </div>

          {/* Network Connection Loop Card */}
          <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Feedback Loop Network</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>
              Interconnected system variables showing positive/negative feedback links. Click on nodes to isolate relations.
            </p>

            {/* SVG Force-Directed graph look */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px' }}>
              <svg viewBox="0 0 600 220" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                {/* Connections (Links) */}
                <line x1="100" y1="110" x2="220" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="100" y1="110" x2="220" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="220" y1="60" x2="380" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="220" y1="160" x2="380" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="380" y1="60" x2="500" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="380" y1="160" x2="500" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="220" y1="60" x2="220" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="380" y1="60" x2="380" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Nodes (Circles) */}
                <circle cx="100" cy="110" r="24" fill="#0A1628" stroke="#00D4FF" strokeWidth="2.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedNode('population')} />
                <text x="100" y="113" fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle" pointerEvents="none">Population</text>

                <circle cx="220" cy="60" r="20" fill="#0A1628" stroke="#7C3AED" strokeWidth="2" style={{ cursor: 'pointer' }} onClick={() => setSelectedNode('traffic')} />
                <text x="220" y="63" fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle" pointerEvents="none">Traffic</text>

                <circle cx="220" cy="160" r="20" fill="#0A1628" stroke="#3B82F6" strokeWidth="2" style={{ cursor: 'pointer' }} onClick={() => setSelectedNode('energy')} />
                <text x="220" y="163" fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle" pointerEvents="none">Energy</text>

                <circle cx="380" cy="60" r="20" fill="#0A1628" stroke="#EF4444" strokeWidth="2" style={{ cursor: 'pointer' }} onClick={() => setSelectedNode('co2')} />
                <text x="380" y="63" fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle" pointerEvents="none">Emissions</text>

                <circle cx="380" cy="160" r="20" fill="#0A1628" stroke="#F59E0B" strokeWidth="2" style={{ cursor: 'pointer' }} onClick={() => setSelectedNode('water')} />
                <text x="380" y="163" fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle" pointerEvents="none">Water</text>

                <circle cx="500" cy="110" r="24" fill="#0A1628" stroke="#10B981" strokeWidth="2.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedNode('gdp')} />
                <text x="500" y="113" fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle" pointerEvents="none">Economy</text>
              </svg>
            </div>

            {selectedNode && (
              <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                  Active isolate: <strong style={{ color: '#00D4FF', textTransform: 'capitalize' }}>{selectedNode}</strong> Loop Specs
                </span>
                <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#00D4FF', fontSize: '11px', cursor: 'pointer' }}>Reset</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: District rankings vulnerabilities */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>District Vulnerability Rankings</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
              Ranked by composite index: Traffic congestion + grid load + water drawdown.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {districtRankings.map((d, index) => {
              const statusColor = d.status === 'Critical' ? '#EF4444' : d.status === 'Vulnerable' ? '#F59E0B' : '#10B981';
              return (
                <div key={d.name} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>#{index + 1}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Vulnerability progress index bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                    <span>Vulnerability Index</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{d.score}/100</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${d.score}%`, background: statusColor, borderRadius: '2px' }} />
                  </div>

                  {/* Sub metrics breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
                    <div>Traffic: <strong style={{ color: '#fff' }}>{d.congestion}%</strong></div>
                    <div>Water: <strong style={{ color: '#fff' }}>{d.waterStress}%</strong></div>
                    <div>Grid: <strong style={{ color: '#fff' }}>{d.energyStress}%</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
