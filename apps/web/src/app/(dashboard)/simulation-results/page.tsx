"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { seededRand } from '@/lib/simulation';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Generating deterministic locations for heatmap
const generateDeterministicPoints = (seed: number, count: number, center: [number, number], radius: number) => {
  const rand = seededRand(seed);
  return Array.from({ length: count }, () => {
    const r = rand() * radius;
    const theta = rand() * 2 * Math.PI;
    return [
      center[0] + r * Math.cos(theta),
      center[1] + r * Math.sin(theta)
    ];
  });
};

export default function SimulationResultsPage() {
  const { results, activePolicy, activeScenarioName, timeline } = useSimulationStore();
  const cityData = useCityDataStore();
  
  const mapBeforeRef = useRef<HTMLDivElement>(null);
  const mapAfterRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'justification' | 'timeline'>('metrics');
  
  // Seeded points
  const beforePoints = useMemo(() => generateDeterministicPoints(12345, 120, [77.5946, 12.9716], 0.15), []);
  const afterPoints = useMemo(() => generateDeterministicPoints(67890, 60, [77.5946, 12.9716], 0.12), []);

  useEffect(() => {
    let map1: MapboxMap | null = null;
    let map2: MapboxMap | null = null;

    import('mapbox-gl').then((mapboxglModule) => {
      const mapboxgl = mapboxglModule.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      // Initialize Baseline (Before) Map
      if (mapBeforeRef.current) {
        map1 = new mapboxgl.Map({
          container: mapBeforeRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [77.5946, 12.9716],
          zoom: 10.5,
          pitch: 30,
          attributionControl: false
        });
        
        map1.on('load', () => {
          if (!map1) return;
          map1.addSource('traffic-heavy', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: beforePoints.map((coords, idx) => ({
                type: 'Feature',
                id: idx,
                geometry: { type: 'Point', coordinates: coords },
                properties: {}
              }))
            } as any
          });

          map1.addLayer({
            id: 'traffic-heavy-layer',
            type: 'heatmap',
            source: 'traffic-heavy',
            paint: {
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0,0,0,0)',
                0.5, 'rgba(239, 68, 68, 0.7)',
                1, 'rgba(239, 68, 68, 0.95)'
              ],
              'heatmap-radius': 22
            }
          });
        });
      }

      // Initialize Simulated (After) Map
      if (mapAfterRef.current) {
        map2 = new mapboxgl.Map({
          container: mapAfterRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [77.5946, 12.9716],
          zoom: 10.5,
          pitch: 30,
          attributionControl: false
        });
        
        map2.on('load', () => {
          if (!map2) return;
          map2.addSource('traffic-light', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: afterPoints.map((coords, idx) => ({
                type: 'Feature',
                id: idx,
                geometry: { type: 'Point', coordinates: coords },
                properties: {}
              }))
            } as any
          });

          map2.addLayer({
            id: 'traffic-light-layer',
            type: 'heatmap',
            source: 'traffic-light',
            paint: {
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0,0,0,0)',
                0.5, 'rgba(16, 185, 129, 0.6)',
                1, 'rgba(16, 185, 129, 0.9)'
              ],
              'heatmap-radius': 18
            }
          });
        });
      }

      setMapLoaded(true);
    });

    return () => {
      if (map1) map1.remove();
      if (map2) map2.remove();
    };
  }, [beforePoints, afterPoints]);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span style={{ cursor: 'pointer' }}>Simulations</span>
          {' / '}Simulation Analysis
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
          Simulation Analysis {activeScenarioName ? `— ${activeScenarioName}` : ''}
        </h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Comparative model visualization of current policy interventions vs the historical Bengaluru baseline density.
        </p>
      </div>

      {/* Main Split Maps Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', height: '360px' }}>
        
        {/* Baseline (Before) Map Card */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'rgba(5, 10, 20, 0.85)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>BASELINE</span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Dense Congestion Heatmap</div>
          </div>
          <div ref={mapBeforeRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Simulated (After) Map Card */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'rgba(5, 10, 20, 0.85)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(0,212,255,0.2)' }}>
            <span style={{ fontSize: '10px', color: '#00D4FF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SIMULATED</span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Alleviated Grid Pattern</div>
          </div>
          <div ref={mapAfterRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* Bottom Layout - Tabbed Analytics Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '16px' }}>
        
        {/* Left Side: Key Math Delta Indicators */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Key Indicators Impact</h3>
          {[
            { name: 'Traffic', before: results.traffic.before, after: results.traffic.after, delta: results.traffic.delta, unit: '%' },
            { name: 'AQI', before: results.aqi.before, after: results.aqi.after, delta: results.aqi.delta, unit: '' },
            { name: 'Water MLD', before: results.water.before, after: results.water.after, delta: results.water.delta, unit: '' },
            { name: 'GDP Growth', before: results.gdp.before, after: results.gdp.after, delta: results.gdp.delta, unit: '%' },
          ].map(ind => {
            const isGood = ind.name === 'GDP Growth' ? ind.delta > 0 : ind.delta < 0;
            return (
              <div key={ind.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{ind.name}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                    Baseline: {ind.before}{ind.unit}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#00D4FF' }}>{ind.after}{ind.unit}</div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: isGood ? '#10B981' : '#EF4444', marginTop: '2px' }}>
                    {ind.delta > 0 ? '+' : ''}{ind.delta}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Tabbed panel (Justification / Methodology vs Timeline details) */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Tab selector */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            {[
              { id: 'metrics', label: 'Detailed Summary' },
              { id: 'justification', label: 'Methodology & Justification' },
              { id: 'timeline', label: 'Timeline Projection' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  background: activeTab === tab.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                  transition: 'all 120ms',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div style={{ flex: 1 }}>
            {activeTab === 'metrics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                  Adjusting these policies has projected a Net City Health score of <strong style={{ color: '#00D4FF' }}>{results.cityHealth.after}/100</strong> (from {results.cityHealth.before}/100 baseline). The confidence factor matches standard simulation limits.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Active Policy Levers</span>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>Metro Network: {activePolicy.metroExpansion}%</span>
                      <span>EV Transition: {activePolicy.evAdoptionRate}%</span>
                      <span>Renewables: {activePolicy.renewableShare}%</span>
                    </div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Key Recommendations</span>
                    <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>✓ Expand hope farm metro corridor</span>
                      <span>✓ Deploy 50 charges in East zone</span>
                      <span>✓ Maintain Cauvery flow rate</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'justification' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                  This simulation utilizes standard, established mathematical equations based on urban design methodologies:
                </p>
                <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0 }}>
                  <li><strong>Bureau of Public Roads (BPR) traffic formula:</strong> Projects corridor-level delays using capacity and volume indices.</li>
                  <li><strong>IPCC Tier 2 Emission standards:</strong> Evaluates regional carbon values using fuel consumption ratios.</li>
                  <li><strong>Solow-Swan adapted GDP growth:</strong> Models infrastructure boosts to total factor productivity.</li>
                </ul>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Annual city growth projection (2025–2050)</span>
                </div>
                <div style={{ height: '120px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeline.filter((_, i) => i % 5 === 0 || timeline[i].year === 2050)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                      <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="population" stroke="#00D4FF" name="Population" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="city_health" stroke="#10B981" name="City Health" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
