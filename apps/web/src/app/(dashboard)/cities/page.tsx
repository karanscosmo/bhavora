"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMapStore, useUIStore } from '@/stores';
import type { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers, MapPin, Minimize2, Maximize2, Crosshair, ChevronDown, ChevronRight, Bus, Activity, Zap, Hospital } from 'lucide-react';

const METRO_STATIONS = [
  { name: 'Baiyappanahalli Metro', coordinates: [77.6525, 12.9907] },
  { name: 'Indiranagar Metro', coordinates: [77.6412, 12.9784] },
  { name: 'MG Road Metro', coordinates: [77.6010, 12.9755] },
  { name: 'Majestic Interchange', coordinates: [77.5726, 12.9756] },
  { name: 'Mysore Road Metro', coordinates: [77.5298, 12.9485] },
];

const HOSPITALS = [
  { name: 'Manipal Hospital', coordinates: [77.6405, 12.9591] },
  { name: 'Apollo Hospitals', coordinates: [77.5960, 12.8950] },
  { name: 'Fortis Hospital', coordinates: [77.5962, 12.8932] },
];

export default function CitiesPage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'metro-lines': true,
    'bus-network': false,
    'flood-zones': false,
    'power-grid': true,
    'hospitals': false
  });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  useEffect(() => {
    let map: MapboxMap | null = null;
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      if (!mapContainerRef.current) return;

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11.5,
        pitch: 45,
        bearing: -17.6,
        attributionControl: false,
      });
      mapRef.current = map;

      map.on('load', () => {
        if (!map) return;
        setMapLoaded(true);

        // Metro Lines Source
        map.addSource('metro-routes', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: METRO_STATIONS.map(s => s.coordinates)
            }
          }
        });

        // Metro Lines Layer
        map.addLayer({
          id: 'metro-lines-layer',
          type: 'line',
          source: 'metro-routes',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#6D28D9', 'line-width': 4 }
        });

        // Metro Stations Layer (Standard Circle)
        map.addSource('metro-stations-src', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: METRO_STATIONS.map(s => ({
              type: 'Feature',
              properties: { name: s.name },
              geometry: { type: 'Point', coordinates: s.coordinates }
            }))
          }
        });

        map.addLayer({
          id: 'metro-stations-layer',
          type: 'circle',
          source: 'metro-stations-src',
          paint: {
            'circle-radius': 5,
            'circle-color': '#FFFFFF',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#6D28D9'
          }
        });

        // Hospitals Layer
        map.addSource('hospitals-src', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: HOSPITALS.map(h => ({
              type: 'Feature',
              properties: { name: h.name },
              geometry: { type: 'Point', coordinates: h.coordinates }
            }))
          }
        });

        map.addLayer({
          id: 'hospitals-layer',
          type: 'circle',
          source: 'hospitals-src',
          paint: {
            'circle-radius': 6,
            'circle-color': '#DC2626',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
          }
        });

        // Add 3D buildings
        if (map.getSource('composite')) {
          map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': {
              'fill-extrusion-color': '#e2e8f0',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6
            }
          });
        }
      });
    });

    return () => { if (map) map.remove(); };
  }, []);

  // Effect to toggle mapbox layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer('metro-lines-layer')) {
      map.setLayoutProperty('metro-lines-layer', 'visibility', activeLayers['metro-lines'] ? 'visible' : 'none');
    }
    if (map.getLayer('metro-stations-layer')) {
      map.setLayoutProperty('metro-stations-layer', 'visibility', activeLayers['metro-lines'] ? 'visible' : 'none');
    }
    if (map.getLayer('hospitals-layer')) {
      map.setLayoutProperty('hospitals-layer', 'visibility', activeLayers['hospitals'] ? 'visible' : 'none');
    }
  }, [activeLayers, mapLoaded]);

  const layerConfigs = [
    { id: 'metro-lines', label: 'Metro Line Network', icon: <MapPin size={14} /> },
    { id: 'bus-network', label: 'Bus Network Hubs', icon: <Bus size={14} /> },
    { id: 'power-grid', label: 'Power Grid Load', icon: <Zap size={14} /> },
    { id: 'hospitals', label: 'Hospital Capacities', icon: <Hospital size={14} /> },
    { id: 'flood-zones', label: 'Flood Risk Zones', icon: <Activity size={14} /> },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-base)]">
      
      {/* LEFT SIDEBAR: LAYER CONTROL */}
      <div className="w-[300px] border-r border-[var(--border-subtle)] bg-[var(--bg-surface-1)] flex flex-col z-10 shadow-sm relative">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[var(--accent-primary)]" />
            <h2 className="font-bold text-[var(--text-primary)]">GIS Overlays</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Infrastructure Layers</div>
          
          <div className="flex flex-col gap-3">
            {layerConfigs.map(layer => (
              <div key={layer.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
                <div className="flex items-center gap-3">
                  <div className="text-[var(--text-secondary)]">{layer.icon}</div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{layer.label}</span>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch"
                  checked={activeLayers[layer.id]}
                  onChange={() => toggleLayer(layer.id)}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-[var(--accent-primary-bg)] border border-[var(--accent-primary)]">
            <h4 className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-2">Layer Diagnostics</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Real-time telemetry active. Geospatial data syncing from 240+ municipal nodes. 
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: MAP */}
      <div className="flex-1 relative bg-[var(--bg-surface-3)]">
        <div ref={mapContainerRef} className="absolute inset-0" />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface-2)] z-50">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full" />
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button className="w-8 h-8 bg-white border border-[var(--border-subtle)] rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm">
            <Crosshair size={16} />
          </button>
          <button className="w-8 h-8 bg-white border border-[var(--border-subtle)] rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
