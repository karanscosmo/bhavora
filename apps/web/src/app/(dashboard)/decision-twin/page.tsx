"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/stores';
import { Train, Zap, Route, Sun, Droplet, Leaf, Factory, HelpCircle, Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BlindSpotAlert } from '@/components/ui/BlindSpotAlert';
import { ConsequenceTree } from '@/components/ui/ConsequenceTree';


const SLIDER_ICON_MAP: Record<string, React.ReactNode> = {
  train: <Train size={18} />,
  zap: <Zap size={18} />,
  route: <Route size={18} />,
  sun: <Sun size={18} />,
  droplet: <Droplet size={18} />,
  leaf: <Leaf size={18} />,
  factory: <Factory size={18} />,
};

function PolicySlider({
  label, description, value, onChange, icon, 
}: {
  label: string; description: string;
  value: number; onChange: (v: number) => void; icon: string; 
}) {
  return (
    <div className="py-4 border-b border-[var(--border-subtle)] group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
            {SLIDER_ICON_MAP[icon] || <Activity size={16} />}
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-[var(--accent-primary)] font-mono">{value}%</span>
        </div>
      </div>

      <div className="relative h-6 flex items-center mt-2 group/slider">
        <div className="absolute inset-x-0 h-1.5 bg-[var(--bg-surface-3)] rounded-full" />
        <div className="absolute left-0 h-1.5 rounded-full bg-[var(--accent-primary)]" style={{ width: `${value}%` }} />
        <input
          type="range" min={0} max={100} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default function DecisionTwinPage() {
  const simStore = useSimulationStore();
  const { results, activePolicy } = simStore;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive) return;
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11,
        pitch: 45
      });

      map.current.on('load', () => {
        if (!map.current) return;
        map.current.addSource('infra-footprint', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.current.addLayer({
          id: 'infra-heatmap',
          type: 'heatmap',
          source: 'infra-footprint',
          paint: {
            'heatmap-weight': ['get', 'intensity'],
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(37, 99, 235, 0)',
              0.5, 'rgba(37, 99, 235, 0.5)',
              1, 'rgba(37, 99, 235, 1)'
            ],
            'heatmap-radius': 35,
            'heatmap-opacity': 0.7
          }
        });
        setMapLoaded(true);
      });
    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []);

  // Update map dynamically based on active policy / results
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Create variance based on overall investments and policy inputs
    const investment = activePolicy.metroExpansion + activePolicy.roadCapacity + activePolicy.waterInfrastructure;
    const zoning = activePolicy.industrialZoning + activePolicy.greenSpaceAllocation;
    const impactScale = (investment + zoning) / 100; // arbitrary scaling factor
    
    // Change color based on green ratio
    const greenRatio = (activePolicy.greenSpaceAllocation + activePolicy.renewableShare) / 200;
    map.current.setPaintProperty('infra-heatmap', 'heatmap-color', [
      'interpolate', ['linear'], ['heatmap-density'],
      0, greenRatio > 0.5 ? 'rgba(16, 185, 129, 0)' : 'rgba(37, 99, 235, 0)',
      0.5, greenRatio > 0.5 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(37, 99, 235, 0.5)',
      1, greenRatio > 0.5 ? 'rgba(16, 185, 129, 1)' : 'rgba(37, 99, 235, 1)'
    ]);

    const features = [];
    const center = [77.5946, 12.9716];
    const numPoints = Math.min(300, Math.max(50, Math.round(impactScale * 80)));
    
    // Seeded random for stable visualization during slider drags
    let s = Math.round(impactScale * 100) || 1;
    const random = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    
    for (let i = 0; i < numPoints; i++) {
      const r = random();
      const r2 = random();
      // Gaussian-ish distribution around center
      const radius = 0.15 * Math.sqrt(-2.0 * Math.log(Math.max(0.001, r)));
      const theta = 2.0 * Math.PI * r2;
      const lng = center[0] + radius * Math.cos(theta);
      const lat = center[1] + radius * Math.sin(theta) * 0.8; // squish latitude for perspective
      
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { intensity: 0.3 + random() * 0.7 }
      });
    }

    const source = map.current.getSource('infra-footprint');
    if (source) {
      (source as any).setData({ type: 'FeatureCollection', features });
    }
  }, [activePolicy, mapLoaded]);

  // Derived miniature chart data from deterministic results
  // Converting to percentage variance to baseline so they render on the same axis scale visibly
  const chartData = [
    { name: 'Emissions', value: (Math.abs(results.co2.delta) / results.co2.before) * 100, color: results.co2.delta < 0 ? '#10B981' : '#EF4444' },
    { name: 'Congestion', value: (Math.abs(results.traffic.delta) / results.traffic.before) * 100, color: results.traffic.delta < 0 ? '#10B981' : '#EF4444' },
    { name: 'GDP', value: (Math.abs(results.gdp.delta) / results.gdp.before) * 100, color: results.gdp.delta > 0 ? '#10B981' : '#EF4444' },
  ];

  // Pseudo-economics calculation for UI
  const totalInvestment = Object.values(activePolicy).reduce((a, b) => (a as number) + (b as number), 0);
  const pseudoCapex = totalInvestment * 12.5;
  const pseudoOpex = (activePolicy.metroExpansion * 0.4 + activePolicy.renewableShare * 0.5) * 8.2;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-base)]">
      
      {/* LEFT: Policy Sliders */}
      <div className="w-[380px] flex-shrink-0 bg-white border-r border-[var(--border-subtle)] flex flex-col z-10 shadow-lg">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Decision Twin</h1>
          <p className="text-sm text-[var(--text-secondary)]">Adjust policy levers to simulate multi-domain urban impacts in real-time.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <PolicySlider label="Metro Network Expansion" description="Allocate budget to accelerate Phase 3 & 4." value={activePolicy.metroExpansion} onChange={v => simStore.setPolicy({metroExpansion: v})} icon="train" />
          <PolicySlider label="EV Adoption Subsidy" description="Subsidize electric two-wheelers and commercial fleets." value={activePolicy.evAdoptionRate} onChange={v => simStore.setPolicy({evAdoptionRate: v})} icon="zap" />
          <PolicySlider label="Road Capacity Expansion" description="Widen arterial roads and build grade separators." value={activePolicy.roadCapacity} onChange={v => simStore.setPolicy({roadCapacity: v})} icon="route" />
          <PolicySlider label="Renewable Grid Mix" description="Mandate solar/wind generation quotas." value={activePolicy.renewableShare} onChange={v => simStore.setPolicy({renewableShare: v})} icon="sun" />
          <PolicySlider label="Water Infrastructure" description="Pipeline overhaul and rainwater harvesting." value={activePolicy.waterInfrastructure} onChange={v => simStore.setPolicy({waterInfrastructure: v})} icon="droplet" />
          <PolicySlider label="Green Space Allocation" description="Convert unused land into public parks." value={activePolicy.greenSpaceAllocation} onChange={v => simStore.setPolicy({greenSpaceAllocation: v})} icon="leaf" />
          <PolicySlider label="Industrial Zoning" description="Expand SEZs and manufacturing clusters." value={activePolicy.industrialZoning} onChange={v => simStore.setPolicy({industrialZoning: v})} icon="factory" />
        </div>
      </div>

      {/* CENTER: Live Map Visualizer */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%', minHeight: '400px' }} />
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-[var(--border-subtle)] p-4 rounded-xl shadow-lg w-[280px]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <HelpCircle size={16} className="text-[#2563EB]" />
            Live Context Map
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Adjusting levers animates structural changes across Bengaluru's footprint.
          </p>
        </div>
      </div>

      {/* RIGHT: Predicted Outcomes & Consequences */}
      <div className="w-[420px] flex-shrink-0 bg-[var(--bg-base)] border-l border-[var(--border-subtle)] flex flex-col z-10 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Urban Consequence Engine</h2>
          <p className="text-xs text-[var(--text-secondary)]">Primary, Secondary & Tertiary Forecasts</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          <BlindSpotAlert blindSpots={results.blindSpots} />

          <ConsequenceTree nodes={results.cascadingEffects} />

          <div className="pt-6 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 block">Systemic Variance Overview</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <Link href="/simulation-results" className="btn btn-primary w-full flex items-center justify-center gap-2">
            Generate Whitepaper
            <DollarSign size={16} />
          </Link>
        </div>
      </div>

    </div>
  );
}

