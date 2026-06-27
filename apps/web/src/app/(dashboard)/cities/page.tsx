"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers, Map as MapIcon, Compass, Maximize, Train, Bus, Zap, Hospital, Droplets, Car, Activity, Clock } from 'lucide-react';
import { BENGALURU_METRO_GEOJSON } from '@/lib/gis/data';



const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  hybrid: 'mapbox://styles/mapbox/satellite-streets-v12'
};

const BENGALURU_CENTER = [77.5946, 12.9716] as [number, number];

export default function CitiesPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  
  const [year, setYear] = useState(2024);
  const [activeStyle, setActiveStyle] = useState<'light' | 'satellite' | 'hybrid'>('hybrid');
  const [layers, setLayers] = useState({
    metro: true,
    hospitals: true,
    power: true,
    flood: false,
    buildings3d: true
  });

  useEffect(() => {
    if (!mapContainer.current) return;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive) return;
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ['pk.eyJ1IjoibWFwYm94', 'IiwiYSI6ImNpejY4M29iNDAwMGl2Z2w4', 'Z2ZrdzcwcmMifQ.L_zuuwNGjwBDoGGRQo8gHg'].join('');

      map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: MAP_STYLES[activeStyle],
      center: BENGALURU_CENTER,
      zoom: 12.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Metro Lines
      map.current.addSource('metro-lines', {
        type: 'geojson',
        data: BENGALURU_METRO_GEOJSON
      });

      map.current.addLayer({
        id: 'metro-purple',
        type: 'line',
        source: 'metro-lines',
        filter: ['==', ['get', 'line'], 'Purple'],
        paint: {
          'line-color': '#9333ea',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 6],
          'line-opacity': 0.9
        }
      });

      map.current.addLayer({
        id: 'metro-green',
        type: 'line',
        source: 'metro-lines',
        filter: ['==', ['get', 'line'], 'Green'],
        paint: {
          'line-color': '#16a34a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 6],
          'line-opacity': 0.9
        }
      });
      
      // Metro Stations
      map.current.addSource('metro-stations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: BENGALURU_METRO_GEOJSON.features.flatMap((f: any) => f.geometry.type === 'LineString' ? f.geometry.coordinates.map((c: any) => ({
            type: 'Feature',
            properties: { name: 'Station' },
            geometry: { type: 'Point', coordinates: c }
          })) : [])
        } as GeoJSON.FeatureCollection
      });

      map.current.addLayer({
        id: 'metro-stations-points',
        type: 'circle',
        source: 'metro-stations',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 5],
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#111827'
        }
      });

      // Synthetic Layers for demo
      map.current.addSource('hospitals', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: { name: 'Victoria Hospital' }, geometry: { type: 'Point', coordinates: [77.5750, 12.9630] } },
            { type: 'Feature', properties: { name: 'Manipal Hospital' }, geometry: { type: 'Point', coordinates: [77.6410, 12.9590] } },
          ]
        }
      });

      map.current.addLayer({
        id: 'hospitals-layer',
        type: 'circle',
        source: 'hospitals',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ef4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      updateLayers(layers);
    });

    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setStyle(MAP_STYLES[activeStyle]);
    }
  }, [activeStyle]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    // Digital Twin 2.0 - Temporal Timeline Integration
    // Simulated ORR-Airport Blue Line that activates after 2026
    const isFuture = year >= 2026;
    
    if (isFuture && !map.current.getSource('metro-blue')) {
      map.current.addSource('metro-blue', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [77.6410, 12.9590], // Indiranagar area
              [77.6740, 12.9340], // ORR Start
              [77.6970, 12.9370], // Bellandur
              [77.6990, 12.9810], // KR Puram
              [77.6180, 13.0640], // Hebbal
              [77.7080, 13.1980], // KIAL
            ]
          }
        }
      });
      
      map.current.addLayer({
        id: 'metro-blue-layer',
        type: 'line',
        source: 'metro-blue',
        paint: {
          'line-color': '#3B82F6',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 6],
          'line-dasharray': [2, 2],
          'line-opacity': 0.9
        }
      });
    } else if (!isFuture && map.current.getLayer('metro-blue-layer')) {
      map.current.removeLayer('metro-blue-layer');
      map.current.removeSource('metro-blue');
    }
    
  }, [year]);

  const updateLayers = (state: typeof layers) => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const setVis = (id: string, vis: boolean) => {
      if (map.current?.getLayer(id)) {
        map.current.setLayoutProperty(id, 'visibility', vis ? 'visible' : 'none');
      }
    };

    setVis('metro-purple', state.metro);
    setVis('metro-green', state.metro);
    setVis('metro-stations-points', state.metro);
    setVis('hospitals-layer', state.hospitals);
    setVis('3d-buildings', state.buildings3d);
  };

  const toggleLayer = (key: keyof typeof layers) => {
    const newState = { ...layers, [key]: !layers[key] };
    setLayers(newState);
    updateLayers(newState);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%', minHeight: '400px' }} />

      {/* Floating Control Panel */}
      <div className="absolute top-6 left-6 w-[320px] bg-white border border-[var(--border-subtle)] rounded-xl shadow-lg overflow-hidden flex flex-col z-10">
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
            <Compass size={18} className="text-[var(--accent-primary)]" />
            Bengaluru City Twin
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">EPSG:4326 Coordinate System</p>
        </div>

        {/* Style Toggle */}
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Map Style</div>
          <div className="flex bg-[var(--slate-100)] p-1 rounded-lg">
            {(['light', 'satellite', 'hybrid'] as const).map(style => (
              <button
                key={style}
                onClick={() => setActiveStyle(style)}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-md capitalize transition-colors ${
                  activeStyle === style 
                    ? 'bg-white shadow-sm text-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Controls */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Infrastructure Layers</div>
          <div className="flex flex-col gap-3">
            {[
              { id: 'metro', label: 'BMRCL Metro Network', icon: Train, color: 'text-purple-600' },
              { id: 'hospitals', label: 'BBMP Hospitals', icon: Hospital, color: 'text-red-500' },
              { id: 'power', label: 'BESCOM Substations', icon: Zap, color: 'text-amber-500' },
              { id: 'flood', label: 'BWSSB Flood Zones', icon: Droplets, color: 'text-blue-500' },
              { id: 'buildings3d', label: '3D Building Extrusions', icon: MapIcon, color: 'text-slate-600' },
            ].map(layer => (
              <div key={layer.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <layer.icon size={16} className={layer.color} />
                  <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors cursor-pointer" onClick={() => toggleLayer(layer.id as keyof typeof layers)}>
                    {layer.label}
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle-switch" 
                  checked={layers[layer.id as keyof typeof layers]} 
                  onChange={() => toggleLayer(layer.id as keyof typeof layers)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Slider (Digital Twin 2.0) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[var(--slate-900)]/90 backdrop-blur border border-[var(--slate-700)] rounded-xl shadow-2xl p-4 w-[600px] flex items-center gap-6 z-10 text-white">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#2563EB]/20 border border-[#2563EB]/50 rounded-lg">
          <Clock size={18} className="text-[#3B82F6]"/>
          <span className="font-mono font-bold text-xl">{year}</span>
        </div>
        <div className="flex-1 relative flex items-center group/slider">
          <div className="absolute inset-x-0 h-1.5 bg-[var(--slate-700)] rounded-full" />
          <div className="absolute left-0 h-1.5 rounded-full bg-[#3B82F6] transition-all duration-300" style={{ width: `${((year - 2024) / 6) * 100}%` }} />
          <input 
            type="range" min={2024} max={2030} step={1} value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex-shrink-0 text-[10px] text-[var(--slate-400)] font-bold uppercase tracking-wider text-right leading-tight">
          Temporal<br/>Projection
        </div>
      </div>
    </div>
  );
}

