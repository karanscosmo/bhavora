"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { seededRand } from '@/lib/simulation';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FileText, Download, Share2, TrendingUp, TrendingDown, Minus, ArrowRight, Layers, Activity, Droplets, Wind, CheckCircle2 } from 'lucide-react';

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

function MetricCard({ title, before, after, delta, unit, icon: Icon, isPositiveGood = false }: {
  title: string; before: number; after: number; delta: number; unit: string; icon: any; isPositiveGood?: boolean;
}) {
  const isGood = isPositiveGood ? delta > 0 : delta < 0;
  const isNeutral = delta === 0;
  const color = isNeutral ? 'var(--slate-500)' : isGood ? 'var(--accent-teal)' : 'var(--accent-red)';
  const bgColor = isNeutral ? 'var(--slate-100)' : isGood ? 'var(--accent-teal-light)' : 'var(--accent-red-light)';
  const IconCmp = isNeutral ? Minus : isGood ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white border border-[var(--slate-200)] rounded-xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-[var(--slate-100)] rounded-lg text-[var(--slate-600)]">
          <Icon size={16} />
        </div>
        <div className="text-xs font-bold text-[var(--slate-600)] uppercase tracking-wider">{title}</div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-end gap-3">
          <div>
            <div className="text-[10px] text-[var(--slate-400)] uppercase font-semibold mb-0.5">Baseline</div>
            <div className="text-sm font-medium text-[var(--slate-500)]">{before}{unit}</div>
          </div>
          <ArrowRight size={14} className="text-[var(--slate-300)] mb-1" />
          <div>
            <div className="text-[10px] text-[var(--accent-blue)] uppercase font-bold mb-0.5">Simulated</div>
            <div className="text-2xl font-bold text-[var(--slate-900)] leading-none">{after}{unit}</div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ backgroundColor: bgColor, color }}>
            <IconCmp size={12} />
            <span className="text-xs font-bold">{delta > 0 ? '+' : ''}{delta}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

      if (mapBeforeRef.current) {
        map1 = new mapboxgl.Map({
          container: mapBeforeRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
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
              features: beforePoints.map((coords, idx) => ({ type: 'Feature', id: idx, geometry: { type: 'Point', coordinates: coords }, properties: {} }))
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
                0.5, 'rgba(217, 119, 6, 0.7)',
                1, 'rgba(220, 38, 38, 0.95)'
              ],
              'heatmap-radius': 22
            }
          });
        });
      }

      if (mapAfterRef.current) {
        map2 = new mapboxgl.Map({
          container: mapAfterRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
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
              features: afterPoints.map((coords, idx) => ({ type: 'Feature', id: idx, geometry: { type: 'Point', coordinates: coords }, properties: {} }))
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
                0.5, 'rgba(13, 148, 136, 0.6)',
                1, 'rgba(15, 118, 110, 0.9)'
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
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-50)]">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-[var(--slate-200)] px-8 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-0.5">Simulation Report</div>
            <h1 className="text-lg font-bold text-[var(--slate-900)]">
              {activeScenarioName || 'Impact Assessment Results'}
            </h1>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-sm font-bold text-[var(--slate-700)] rounded-lg transition-colors">
            <Share2 size={16} /> Share Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-navy)] hover:bg-[var(--accent-navy)]/90 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Executive Summary */}
          <div className="bg-white border border-[var(--slate-200)] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-wider mb-2">Executive Summary</h2>
              <p className="text-sm text-[var(--slate-600)] leading-relaxed">
                The simulated interventions project a net positive impact across the urban environment. 
                Based on established <strong>BPR Traffic Assignment</strong> and <strong>Solow-Swan Economic Models</strong>, 
                the city health score is expected to increase to <strong className="text-[var(--accent-blue)]">{results.cityHealth.after}/100</strong>. 
                Primary drivers for this improvement include targeted metro expansion and EV infrastructure deployment.
              </p>
            </div>
            <div className="flex gap-6 pl-8 border-l border-[var(--slate-200)]">
              <div>
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1">Model Confidence</div>
                <div className="text-3xl font-bold text-[var(--accent-teal)]">{Math.round(results.confidence * 100)}%</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1">Health Score</div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-[var(--slate-900)] leading-none">{results.cityHealth.after}</span>
                  <span className="text-sm font-bold text-[var(--accent-teal)] mb-1">+{results.cityHealth.after - results.cityHealth.before}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Traffic Congestion" before={results.traffic.before} after={results.traffic.after} delta={results.traffic.delta} unit="% Vol/Cap" icon={Activity} />
            <MetricCard title="CO₂ Emissions" before={results.co2.before} after={results.co2.after} delta={results.co2.delta} unit=" kt/yr" icon={Wind} />
            <MetricCard title="Air Quality Index" before={results.aqi.before} after={results.aqi.after} delta={results.aqi.delta} unit=" AQI" icon={Wind} />
            <MetricCard title="GDP Growth Vector" before={results.gdp.before} after={results.gdp.after} delta={results.gdp.delta} unit="%" icon={TrendingUp} isPositiveGood={true} />
          </div>

          {/* Spatial Comparison */}
          <div>
            <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers size={16} className="text-[var(--accent-blue)]" /> Spatial Impact Visualization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              
              <div className="relative bg-white border border-[var(--slate-200)] rounded-2xl overflow-hidden shadow-sm group">
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-[var(--slate-200)] shadow-sm">
                  <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest">Baseline Scenario</div>
                  <div className="text-sm font-bold text-[var(--slate-900)]">High Density Congestion</div>
                </div>
                <div ref={mapBeforeRef} className="w-full h-full" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--slate-300)] transition-colors pointer-events-none rounded-2xl" />
              </div>

              <div className="relative bg-white border border-[var(--slate-200)] rounded-2xl overflow-hidden shadow-sm group">
                <div className="absolute top-4 left-4 z-10 bg-[var(--accent-blue)]/5 backdrop-blur-md px-4 py-2 rounded-lg border border-[var(--accent-blue)]/20 shadow-sm">
                  <div className="text-[10px] font-bold text-[var(--accent-blue)] uppercase tracking-widest">Simulated Outcome</div>
                  <div className="text-sm font-bold text-[var(--slate-900)]">Alleviated Corridor Pressure</div>
                </div>
                <div ref={mapAfterRef} className="w-full h-full" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent-blue)] transition-colors pointer-events-none rounded-2xl" />
              </div>

            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="bg-white border border-[var(--slate-200)] rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex border-b border-[var(--slate-200)] bg-[var(--slate-50)]">
              {[
                { id: 'metrics', label: 'Policy Drivers' },
                { id: 'timeline', label: 'Long-term Projection' },
                { id: 'justification', label: 'Methodology' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-white text-[var(--accent-blue)] border-b-2 border-[var(--accent-blue)]' 
                      : 'text-[var(--slate-500)] hover:bg-[var(--slate-100)] border-b-2 border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Active Interventions</h3>
                    <div className="space-y-3">
                      {Object.entries(activePolicy).filter(([_, v]) => v > 0).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center p-3 bg-[var(--slate-50)] rounded-lg border border-[var(--slate-200)]">
                          <span className="text-sm font-medium text-[var(--slate-700)] capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-bold text-[var(--accent-blue)]">{v}% intensity</span>
                        </div>
                      ))}
                      {Object.values(activePolicy).filter(v => v > 0).length === 0 && (
                        <div className="text-sm text-[var(--slate-500)] p-4 text-center border border-dashed border-[var(--slate-300)] rounded-lg">
                          No active policy interventions in this run.
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Recommended Actions</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 p-3 bg-[var(--accent-teal)]/5 rounded-lg border border-[var(--accent-teal)]/20 text-sm text-[var(--slate-700)]">
                        <CheckCircle2 size={18} className="text-[var(--accent-teal)] shrink-0 mt-0.5" />
                        Prioritize Phase 3 Metro rollout in eastern tech corridors to maximize V/C ratio reduction.
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-[var(--accent-teal)]/5 rounded-lg border border-[var(--accent-teal)]/20 text-sm text-[var(--slate-700)]">
                        <CheckCircle2 size={18} className="text-[var(--accent-teal)] shrink-0 mt-0.5" />
                        Incentivize commercial fleet electrification to hit 30% EV target by 2030.
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-[var(--accent-amber)]/5 rounded-lg border border-[var(--accent-amber)]/20 text-sm text-[var(--slate-700)]">
                        <span className="text-[var(--accent-amber)] font-bold shrink-0 mt-0.5">!</span>
                        Monitor induced demand risks on outer ring road widenings.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h3 className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest mb-6">25-Year Projection (2025-2050)</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeline.filter((_, i) => i % 5 === 0 || timeline[i].year === 2050)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" />
                        <XAxis dataKey="year" tick={{ fill: 'var(--slate-500)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--slate-200)', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="population" stroke="var(--slate-400)" name="Pop Index" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="city_health" stroke="var(--accent-teal)" name="City Health" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'justification' && (
                <div className="max-w-3xl space-y-6 text-sm text-[var(--slate-700)] leading-relaxed">
                  <p>
                    This simulation utilizes standard, established mathematical equations based on modern urban design methodologies. The confidence intervals are derived from historical data variance in the Bengaluru metropolitan area.
                  </p>
                  
                  <div className="bg-[var(--slate-50)] p-4 rounded-lg border border-[var(--slate-200)]">
                    <h4 className="font-bold text-[var(--slate-900)] mb-2">Transport Demand Model (4-Step) & BPR</h4>
                    <p className="text-[var(--slate-600)] mb-2">Projects corridor-level delays using capacity and volume indices.</p>
                    <code className="text-xs text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-1 rounded">t = t₀ × (1 + 0.15 × (V/C)⁴)</code>
                  </div>
                  
                  <div className="bg-[var(--slate-50)] p-4 rounded-lg border border-[var(--slate-200)]">
                    <h4 className="font-bold text-[var(--slate-900)] mb-2">Carbon Emission Model (IPCC Tier 2)</h4>
                    <p className="text-[var(--slate-600)] mb-2">Evaluates regional carbon values using fuel consumption ratios and grid emission factors.</p>
                    <code className="text-xs text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-1 rounded">CO₂ = VKT × EF × (1 − EV_share)</code>
                  </div>
                  
                  <div className="bg-[var(--slate-50)] p-4 rounded-lg border border-[var(--slate-200)]">
                    <h4 className="font-bold text-[var(--slate-900)] mb-2">Solow-Swan Economic Growth Model</h4>
                    <p className="text-[var(--slate-600)] mb-2">Models infrastructure boosts to total factor productivity.</p>
                    <code className="text-xs text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-1 rounded">Y = A × K^α × L^(1−α)</code>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
