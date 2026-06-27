"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShieldAlert, Activity, AlertTriangle, Car, Siren } from 'lucide-react';
import { TrafficRuleSimulator } from '@/components/safety/TrafficRuleSimulator';
import { useSimulationStore } from '@/stores';

export default function SafetyIntelligencePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { activeTrafficRule } = useSimulationStore();

  function generateMockAccidents(ruleId: string | null) {
    const features = [];
    const center = [77.5946, 12.9716];
    
    // Seed deterministic accident points around major corridors (ORR, Silk Board, etc)
    let s = 42;
    const random = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    
    for (let i = 0; i < 400; i++) {
      const radius = 0.12 * Math.sqrt(random());
      const theta = 2.0 * Math.PI * random();
      
      // Cluster heavily on certain angles (corridors)
      const angOffset = (Math.floor(random() * 4) * Math.PI) / 2;
      const lng = center[0] + radius * Math.cos(theta + angOffset);
      const lat = center[1] + radius * Math.sin(theta + angOffset) * 0.8;
      
      let baseSeverity = 0.2 + random() * 0.8; // 0.2 to 1.0 severity
      
      // Rule reductions
      if (ruleId === 'school-zones' && radius < 0.05) baseSeverity *= 0.3; // Near center (schools)
      else if (ruleId === 'odd-even') baseSeverity *= 0.6; // City wide reduction
      else if (ruleId === 'truck-ban' && (i % 3 === 0)) baseSeverity *= 0.2; // Heavy vehicle subset
      else if (ruleId === 'congestion-pricing' && radius < 0.06) baseSeverity *= 0.4; // CBD subset

      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { severity: baseSeverity }
      });
    }
    return { type: 'FeatureCollection', features } as any;
  }

  function generateDistricts() {
    return {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: { name: 'Whitefield', mobility: 42, walkability: 35 }, geometry: { type: 'Point', coordinates: [77.7499, 12.9698] } },
        { type: 'Feature', properties: { name: 'Electronic City', mobility: 55, walkability: 45 }, geometry: { type: 'Point', coordinates: [77.6688, 12.8452] } },
        { type: 'Feature', properties: { name: 'Koramangala', mobility: 78, walkability: 82 }, geometry: { type: 'Point', coordinates: [77.6208, 12.9352] } },
        { type: 'Feature', properties: { name: 'Indiranagar', mobility: 85, walkability: 88 }, geometry: { type: 'Point', coordinates: [77.6389, 12.9719] } },
        { type: 'Feature', properties: { name: 'Hebbal', mobility: 62, walkability: 50 }, geometry: { type: 'Point', coordinates: [77.5919, 13.0354] } }
      ]
    } as any;
  }

  useEffect(() => {
    if (!mapContainer.current) return;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive) return;
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11', // Use dark map for high contrast safety zones
        center: [77.5946, 12.9716],
        zoom: 11.5,
        pitch: 30
      });

      map.current.on('load', () => {
        if (!map.current) return;
        
        // Add seeded accident clusters
        map.current.addSource('accident-clusters', {
          type: 'geojson',
          data: generateMockAccidents(activeTrafficRule)
        });

        map.current.addLayer({
          id: 'accidents-heat',
          type: 'heatmap',
          source: 'accident-clusters',
          paint: {
            'heatmap-weight': ['get', 'severity'],
            'heatmap-intensity': 1.5,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(239, 68, 68, 0)',
              0.2, 'rgba(239, 68, 68, 0.4)',
              0.5, 'rgba(245, 158, 11, 0.8)',
              1, 'rgba(220, 38, 38, 1)'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 15, 15, 40],
            'heatmap-opacity': 0.8
          }
        });

        // Add Mobility Scores
        map.current.addSource('mobility-scores', {
          type: 'geojson',
          data: generateDistricts()
        });

        map.current.addLayer({
          id: 'mobility-circles',
          type: 'circle',
          source: 'mobility-scores',
          paint: {
            'circle-radius': 40,
            'circle-color': [
              'interpolate', ['linear'], ['get', 'mobility'],
              0, '#ef4444',
              50, '#f59e0b',
              100, '#10b981'
            ],
            'circle-opacity': 0.2,
            'circle-stroke-width': 2,
            'circle-stroke-color': [
              'interpolate', ['linear'], ['get', 'mobility'],
              0, '#ef4444',
              50, '#f59e0b',
              100, '#10b981'
            ],
          }
        });

        map.current.addLayer({
          id: 'mobility-labels',
          type: 'symbol',
          source: 'mobility-scores',
          layout: {
            'text-field': [
              'format',
              ['get', 'name'], { 'font-scale': 0.8, 'text-color': '#fff' },
              '\n', {},
              ['get', 'mobility'], { 'font-scale': 1.2, 'text-color': '#fff' },
              '/100', { 'font-scale': 0.8, 'text-color': '#aaa' }
            ],
            'text-size': 12,
            'text-justify': 'center'
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1
          }
        });
        
        setMapLoaded(true);
      });
    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []); // Initialize only once

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const source = map.current.getSource('accident-clusters') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(generateMockAccidents(activeTrafficRule));
    }
  }, [activeTrafficRule, mapLoaded]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-base)]">
      
      {/* LEFT: Rule Simulator */}
      <div className="w-[380px] flex-shrink-0 bg-white border-r border-[var(--border-subtle)] flex flex-col z-10 shadow-lg">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <ShieldAlert size={20} className="text-[#EF4444]" />
            Safety Intelligence
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Simulate the impact of traffic rules and identify urban safety blackspots.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <TrafficRuleSimulator />
        </div>
      </div>

      {/* CENTER: Safety Map */}
      <div className="flex-1 relative bg-[#1A1A1A]">
        <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
        
        {/* Map Overlay Legend */}
        <div className="absolute top-6 right-6 bg-[var(--slate-900)]/90 backdrop-blur border border-[var(--slate-700)] p-4 rounded-xl shadow-2xl w-[240px]">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
            <AlertTriangle size={14} className="text-[#F59E0B]" />
            Risk Heatmap
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
              <span className="text-xs text-[var(--slate-300)]">Fatal / High Risk</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <span className="text-xs text-[var(--slate-300)]">Moderate Collision Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Active Analytics */}
      <div className="w-[340px] flex-shrink-0 bg-[var(--slate-900)] border-l border-[var(--slate-700)] flex flex-col z-10 shadow-lg text-white">
        <div className="p-6 border-b border-[var(--slate-800)]">
          <h2 className="text-sm font-bold text-[var(--slate-200)] uppercase tracking-wider mb-1">Live Telemetry</h2>
          <p className="text-xs text-[var(--slate-400)]">City-wide incident monitoring</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          <div className="space-y-4">
            <div className="p-4 bg-[var(--slate-800)] border border-[var(--slate-700)] rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#EF4444]" />
              <span className="text-[10px] text-[var(--slate-400)] uppercase tracking-wider block mb-1">Critical Blackspots</span>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                24 <span className="text-xs font-normal text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full">+3 this month</span>
              </div>
            </div>
            
            <div className="p-4 bg-[var(--slate-800)] border border-[var(--slate-700)] rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#F59E0B]" />
              <span className="text-[10px] text-[var(--slate-400)] uppercase tracking-wider block mb-1">Avg Ambulance Reach</span>
              <div className="text-2xl font-bold text-white">
                14m 20s
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--slate-800)]">
            <h3 className="text-xs font-bold text-[var(--slate-400)] uppercase tracking-wider mb-4">Highest Risk Corridors</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[var(--slate-800)]/50 rounded border border-[var(--slate-700)]/50">
                <div className="flex items-center gap-3">
                  <Car size={14} className="text-[var(--slate-400)]" />
                  <span className="text-sm font-medium">Silk Board Jct</span>
                </div>
                <span className="text-xs font-bold text-[#EF4444]">High</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[var(--slate-800)]/50 rounded border border-[var(--slate-700)]/50">
                <div className="flex items-center gap-3">
                  <Siren size={14} className="text-[var(--slate-400)]" />
                  <span className="text-sm font-medium">K R Puram Bridge</span>
                </div>
                <span className="text-xs font-bold text-[#F59E0B]">Elevated</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
