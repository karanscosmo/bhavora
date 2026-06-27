"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/stores';
import { Train, Zap, Route, Sun, Droplet, Leaf, Factory, HelpCircle, Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';



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
      map.current?.addSource('infrastructure', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }, properties: { type: 'metro' } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6225, 12.9176] }, properties: { type: 'road' } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6410, 12.9590] }, properties: { type: 'water' } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5147, 13.0285] }, properties: { type: 'industrial' } },
          ]
        }
      });

      map.current?.addLayer({
        id: 'infra-points',
        type: 'circle',
        source: 'infrastructure',
        paint: {
          'circle-radius': 10,
          'circle-color': '#2563EB',
          'circle-opacity': 0.6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });
    });

    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const layerId = 'infra-points';
    if (map.current.getLayer(layerId)) {
      const totalInvestment = Object.values(activePolicy).reduce((a, b) => (a as number) + (b as number), 0);
      const baseRadius = 10 + (totalInvestment / 70);
      
      map.current.setPaintProperty(layerId, 'circle-radius', baseRadius);
      
      const greenIntensity = activePolicy.renewableShare;
      map.current.setPaintProperty(layerId, 'circle-color', 
        greenIntensity > 50 ? '#10B981' : '#2563EB'
      );
    }
  }, [activePolicy]);

  // Derived miniature chart data from deterministic results
  const chartData = [
    { name: 'Emissions', value: Math.abs(results.co2.delta), color: results.co2.delta < 0 ? '#10B981' : '#EF4444' },
    { name: 'Congestion', value: Math.abs(results.traffic.delta), color: results.traffic.delta < 0 ? '#10B981' : '#EF4444' },
    { name: 'GDP', value: Math.abs(results.gdp.delta), color: results.gdp.delta > 0 ? '#10B981' : '#EF4444' },
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

      {/* RIGHT: Predicted Outcomes */}
      <div className="w-[380px] flex-shrink-0 bg-white border-l border-[var(--border-subtle)] flex flex-col z-10 shadow-lg">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Predicted Outcomes</h2>
          <p className="text-xs text-[var(--text-secondary)]">Horizon: 2030</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 bg-[var(--bg-surface-2)] border-none">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Budget</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">₹{(pseudoCapex / 100).toFixed(1)}k Cr</span>
            </div>
            <div className="card p-4 bg-[var(--bg-surface-2)] border-none">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">OpEx Savings</span>
              <span className="text-lg font-bold text-[#10B981]">₹{(pseudoOpex / 10).toFixed(1)}k Cr</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 block">Impact Variance (%)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 block">Key Indicators</h3>
            <div className="flex justify-between items-center p-3 border border-[var(--border-subtle)] rounded-lg">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Air Quality</span>
              <div className="flex items-center gap-2">
                {results.aqi.delta < 0 ? <TrendingDown size={14} className="text-[#10B981]" /> : <TrendingUp size={14} className="text-[#EF4444]" />}
                <span className={`text-sm font-bold ${results.aqi.delta < 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{results.aqi.delta > 0 ? '+' : ''}{results.aqi.delta.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border border-[var(--border-subtle)] rounded-lg">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Job Creation</span>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#10B981]" />
                <span className="text-sm font-bold text-[#10B981]">+{(results.gdp.delta * 12).toFixed(1)}k</span>
              </div>
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

