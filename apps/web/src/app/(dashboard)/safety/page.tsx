"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShieldAlert, Activity, AlertTriangle, Car, Siren } from 'lucide-react';
import { TrafficRuleSimulator } from '@/components/safety/TrafficRuleSimulator';

export default function SafetyIntelligencePage() {
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
          data: generateMockAccidents()
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
        
        setMapLoaded(true);
      });
    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []);

  function generateMockAccidents() {
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
      
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { severity: 0.2 + random() * 0.8 } // 0.2 to 1.0 severity
      });
    }
    return { type: 'FeatureCollection', features } as any;
  }

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
