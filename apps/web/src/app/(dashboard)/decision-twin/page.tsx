"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/stores';
import { Train, Zap, Route, Sun, Droplet, Leaf, Factory, HelpCircle, Activity } from 'lucide-react';
import Link from 'next/link';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

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
  const percentage = value;
  const segmentColor = 'var(--accent-primary)';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.5946, 12.9716],
      zoom: 11,
      pitch: 45
    });

    map.current.on('load', () => {
      // Base infrastructure points
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

    return () => map.current?.remove();
  }, []);

  // React to slider changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const layerId = 'infra-points';
    if (map.current.getLayer(layerId)) {
      // Just a simple visual reaction: increase radius based on the sum of inputs
      const totalInvestment = Object.values(simStore.activePolicy).reduce((a, b) => (a as number) + (b as number), 0);
      const baseRadius = 10 + (totalInvestment / 70); // Max ~20
      
      map.current.setPaintProperty(layerId, 'circle-radius', baseRadius);
      
      // Change color based on renewable energy investment
      const greenIntensity = simStore.activePolicy.renewableShare;
      map.current.setPaintProperty(layerId, 'circle-color', 
        greenIntensity > 50 ? '#10B981' : '#2563EB'
      );
    }
  }, [simStore.activePolicy]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-base)]">
      
      {/* LEFT: Policy Sliders */}
      <div className="w-[420px] flex-shrink-0 bg-white border-r border-[var(--border-subtle)] flex flex-col z-10">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Decision Twin</h1>
          <p className="text-sm text-[var(--text-secondary)]">Adjust policy levers to simulate multi-domain urban impacts in real-time.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <PolicySlider label="Metro Network Expansion" description="Allocate budget to accelerate Phase 3 & 4." value={simStore.activePolicy.metroExpansion} onChange={v => simStore.setPolicy({metroExpansion: v})} icon="train" />
          <PolicySlider label="EV Adoption Subsidy" description="Subsidize electric two-wheelers and commercial fleets." value={simStore.activePolicy.evAdoptionRate} onChange={v => simStore.setPolicy({evAdoptionRate: v})} icon="zap" />
          <PolicySlider label="Road Capacity Expansion" description="Widen arterial roads and build grade separators." value={simStore.activePolicy.roadCapacity} onChange={v => simStore.setPolicy({roadCapacity: v})} icon="route" />
          <PolicySlider label="Renewable Grid Mix" description="Mandate solar/wind generation quotas." value={simStore.activePolicy.renewableShare} onChange={v => simStore.setPolicy({renewableShare: v})} icon="sun" />
          <PolicySlider label="Water Infrastructure" description="Pipeline overhaul and rainwater harvesting." value={simStore.activePolicy.waterInfrastructure} onChange={v => simStore.setPolicy({waterInfrastructure: v})} icon="droplet" />
          <PolicySlider label="Green Space Allocation" description="Convert unused land into public parks." value={simStore.activePolicy.greenSpaceAllocation} onChange={v => simStore.setPolicy({greenSpaceAllocation: v})} icon="leaf" />
          <PolicySlider label="Industrial Zoning" description="Expand SEZs and manufacturing clusters." value={simStore.activePolicy.industrialZoning} onChange={v => simStore.setPolicy({industrialZoning: v})} icon="factory" />
        </div>

        <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <Link href="/simulation-results" className="btn btn-primary w-full flex items-center justify-center gap-2">
            Run Deterministic Simulation
            <Activity size={16} />
          </Link>
        </div>
      </div>

      {/* RIGHT: Live Map Visualizer */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-[var(--border-subtle)] p-4 rounded-xl shadow-lg w-[280px]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <HelpCircle size={16} className="text-[var(--accent-primary)]" />
            Live Context Map
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            As you adjust policy sliders on the left, this map visually demonstrates the spatial growth and impact spread across Bengaluru's infrastructure nodes.
          </p>
        </div>
      </div>

    </div>
  );
}
