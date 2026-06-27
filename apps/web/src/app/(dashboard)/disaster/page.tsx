"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertTriangle, Clock, Map, Users, Truck, AlertCircle, Droplets, Flame, Zap, Navigation } from 'lucide-react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type Incident = {
  id: string;
  type: string;
  location: string;
  time: string;
  status: string;
  severity: 'Critical' | 'High' | 'Medium';
  coords: [number, number];
  radius: number;
  icon: any;
  resources: { type: string, count: number }[];
  impact: string;
};

const INCIDENTS: Incident[] = [
  { id: 'INC-BBMP-9021', type: 'Severe Flood Warning', location: 'Bellandur Catchment', time: '10 mins ago', status: 'Active', severity: 'Critical', coords: [77.6713, 12.9298], radius: 1200, icon: Droplets, resources: [{ type: 'NDRF Teams', count: 4 }, { type: 'Evac Buses', count: 12 }], impact: '14,250 residents affected' },
  { id: 'INC-BESCOM-441', type: 'Power Grid Failure', location: 'Whitefield Zone 4', time: '1 hr ago', status: 'Responding', severity: 'High', coords: [77.7499, 12.9698], radius: 800, icon: Zap, resources: [{ type: 'BESCOM Repair Crews', count: 6 }], impact: '45 IT Parks on backup power' },
  { id: 'INC-BTP-882', type: 'Traffic Gridlock', location: 'Silk Board Junction', time: '2 hrs ago', status: 'Active', severity: 'Medium', coords: [77.6225, 12.9176], radius: 600, icon: Navigation, resources: [{ type: 'Traffic Police Units', count: 8 }], impact: '4.5km traffic backup' },
  { id: 'INC-KSFRS-110', type: 'Industrial Fire', location: 'Peenya Industrial Area', time: '15 mins ago', status: 'Active', severity: 'Critical', coords: [77.5147, 13.0285], radius: 400, icon: Flame, resources: [{ type: 'Fire Engines', count: 12 }, { type: 'Ambulances', count: 3 }], impact: 'Air quality hazard' }
];

export default function DisasterPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.5946, 12.9716],
      zoom: 11,
      pitch: 40
    });

    map.current.on('load', () => {
      // Add a source for incident radius
      map.current?.addSource('incident-radius', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.current?.addLayer({
        id: 'incident-radius-fill',
        type: 'circle',
        source: 'incident-radius',
        paint: {
          'circle-radius': ['get', 'radius'],
          'circle-color': '#EF4444',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#EF4444'
        }
      });
      
      // Add markers for incidents
      INCIDENTS.forEach(inc => {
        const el = document.createElement('div');
        el.className = `w-4 h-4 rounded-full border-2 border-white shadow-lg ${
          inc.severity === 'Critical' ? 'bg-[#EF4444] animate-pulse' : 
          inc.severity === 'High' ? 'bg-[#F59E0B]' : 'bg-[#3B82F6]'
        }`;
        
        el.addEventListener('click', () => {
          setSelectedIncident(inc);
        });

        if (map.current) {
          new mapboxgl.Marker(el)
            .setLngLat(inc.coords)
            .addTo(map.current);
        }
      });
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (selectedIncident && map.current && map.current.isStyleLoaded()) {
      map.current.flyTo({
        center: selectedIncident.coords,
        zoom: 14.5,
        duration: 2000,
        pitch: 60
      });

      // Update the radius source
      const source = map.current.getSource('incident-radius') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: { type: 'Point', coordinates: selectedIncident.coords },
            properties: { radius: selectedIncident.radius / 10 } // Simplified radius scaling
          }]
        });
      }
    }
  }, [selectedIncident]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-base)]">
      
      {/* LEFT: Incident Queue */}
      <div className="w-[340px] flex-shrink-0 bg-white border-r border-[var(--border-subtle)] flex flex-col z-10">
        <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">EOC Live Feed</h1>
          <p className="text-xs text-[var(--text-secondary)]">BBMP Emergency Operations Center</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INCIDENTS.map(inc => {
            const isSelected = selectedIncident?.id === inc.id;
            const Icon = inc.icon;
            return (
              <div 
                key={inc.id} 
                onClick={() => setSelectedIncident(inc)}
                className={`card p-4 cursor-pointer transition-all ${isSelected ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary-bg)] shadow-md' : 'hover:border-[var(--border-strong)]'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${inc.severity === 'Critical' ? 'bg-[#FEE2E2] text-[#EF4444]' : inc.severity === 'High' ? 'bg-[#FEF3C7] text-[#F59E0B]' : 'bg-[#EFF6FF] text-[#3B82F6]'}`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold font-mono text-[var(--text-primary)]">{inc.id}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
                    <Clock size={10} /> {inc.time}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{inc.type}</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-3">{inc.location}</p>
                <div className="flex gap-2">
                  <span className={`badge ${inc.status === 'Active' ? 'badge-danger' : 'badge-warning'}`}>
                    {inc.status}
                  </span>
                  <span className="badge badge-neutral">
                    {inc.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER: Live Map */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        {/* Map Overlays */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-[var(--border-subtle)] p-2 rounded-lg shadow-sm flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-danger)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-danger)] animate-pulse"></span>
            DEFCON 3 STATUS
          </div>
          <div className="h-4 w-px bg-[var(--border-subtle)]"></div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-muted)]">Live Dispatch Network</div>
        </div>
      </div>

      {/* RIGHT: Incident Details */}
      <div className="w-[360px] flex-shrink-0 bg-white border-l border-[var(--border-subtle)] flex flex-col z-10">
        {selectedIncident ? (
          <>
            <div className={`h-2 w-full ${selectedIncident.severity === 'Critical' ? 'bg-[#EF4444]' : selectedIncident.severity === 'High' ? 'bg-[#F59E0B]' : 'bg-[#3B82F6]'}`}></div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">Incident Profile</span>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{selectedIncident.type}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{selectedIncident.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="card p-4 bg-[var(--bg-surface-2)] border-none">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Impact</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{selectedIncident.impact}</span>
                </div>
                <div className="card p-4 bg-[var(--bg-surface-2)] border-none">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Radius</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] font-mono">{selectedIncident.radius}m</span>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 block">Dispatched Resources</span>
                <div className="space-y-3">
                  {selectedIncident.resources.map((res, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-[var(--border-subtle)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Truck size={14} className="text-[var(--text-muted)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{res.type}</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-[var(--accent-primary)]">{res.count} Units</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 block">Command Actions</span>
                <div className="space-y-2">
                  <button className="w-full btn btn-primary flex justify-between items-center">
                    Escalate to State Command
                    <AlertTriangle size={14} />
                  </button>
                  <button className="w-full btn btn-secondary flex justify-between items-center">
                    Broadcast Evacuation SMS
                    <Users size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center mb-4">
              <Map size={24} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">No Incident Selected</h3>
            <p className="text-xs text-[var(--text-secondary)]">Select an active incident from the queue to view full command center details and dispatch resources.</p>
          </div>
        )}
      </div>

    </div>
  );
}
