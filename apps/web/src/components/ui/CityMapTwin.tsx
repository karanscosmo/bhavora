"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/stores';
import { BENGALURU_METRO_GEOJSON } from '@/lib/gis/data';
import { Layers } from 'lucide-react';

const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11'
};

const BENGALURU_CENTER = [77.5946, 12.9716] as [number, number];
const YEARS = [2025, 2030, 2035, 2040, 2045, 2050];

export function CityMapTwin({ year, setYear, interactive = true }: { year: number, setYear?: (y: number) => void, interactive?: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const store = useSimulationStore();
  const { activePolicy } = store;

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    metro: true,
    ev: true,
    water: true,
    roads: true,
    parks: true
  });

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive) return;
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ['pk.eyJ1IjoibWFwYm94', 'IiwiYSI6ImNpejY4M29iNDAwMGl2Z2w4', 'Z2ZrdzcwcmMifQ.L_zuuwNGjwBDoGGRQo8gHg'].join('');

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: MAP_STYLES.dark,
        center: BENGALURU_CENTER,
        zoom: 11.5,
        pitch: 55,
        bearing: -17.6,
        antialias: true,
        interactive: interactive
      });

      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      }

      map.current.on('load', () => {
        if (!map.current) return;

        // Metro Base
        map.current.addSource('metro-lines', { type: 'geojson', data: BENGALURU_METRO_GEOJSON });
        map.current.addLayer({
          id: 'metro-purple', type: 'line', source: 'metro-lines',
          filter: ['==', ['get', 'line'], 'Purple'],
          paint: { 'line-color': '#9333ea', 'line-width': 4, 'line-opacity': 0.9 }
        });
        map.current.addLayer({
          id: 'metro-green', type: 'line', source: 'metro-lines',
          filter: ['==', ['get', 'line'], 'Green'],
          paint: { 'line-color': '#16a34a', 'line-width': 4, 'line-opacity': 0.9 }
        });
      });
    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []);

  // Sync Layers with Policy & Time
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    const m = map.current;

    // METRO EXPANSION (Blue/Yellow Lines)
    const showFutureMetro = activeLayers.metro && (year >= 2026 || activePolicy.metroExpansion > 40);
    if (showFutureMetro && !m.getSource('metro-future')) {
      m.addSource('metro-future', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: { name: 'Blue Line' }, geometry: { type: 'LineString', coordinates: [[77.641, 12.959], [77.674, 12.934], [77.708, 13.198]] } },
            { type: 'Feature', properties: { name: 'Yellow Line' }, geometry: { type: 'LineString', coordinates: [[77.58, 12.915], [77.62, 12.916], [77.668, 12.845]] } }
          ]
        }
      });
      m.addLayer({
        id: 'metro-future-layer', type: 'line', source: 'metro-future',
        paint: {
          'line-color': ['match', ['get', 'name'], 'Blue Line', '#3B82F6', 'Yellow Line', '#EAB308', '#ffffff'],
          'line-width': 4, 'line-dasharray': [2, 2], 'line-opacity': 0.9
        }
      });
    } else if (!showFutureMetro && m.getLayer('metro-future-layer')) {
      m.removeLayer('metro-future-layer'); m.removeSource('metro-future');
    }

    // EV CHARGING
    const showEV = activeLayers.ev && activePolicy.evAdoptionRate > 20;
    if (showEV && !m.getSource('ev-chargers')) {
      m.addSource('ev-chargers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: Array.from({ length: 80 }).map(() => ({
            type: 'Feature', properties: {},
            geometry: { type: 'Point', coordinates: [BENGALURU_CENTER[0] + (Math.random() - 0.5) * 0.3, BENGALURU_CENTER[1] + (Math.random() - 0.5) * 0.3] }
          }))
        }
      });
      m.addLayer({
        id: 'ev-chargers-layer', type: 'circle', source: 'ev-chargers',
        paint: { 'circle-radius': 4, 'circle-color': '#10B981', 'circle-stroke-width': 1, 'circle-stroke-color': '#ffffff' }
      });
    } else if (!showEV && m.getLayer('ev-chargers-layer')) {
      m.removeLayer('ev-chargers-layer'); m.removeSource('ev-chargers');
    }

    // WATER INFRASTRUCTURE
    const showWater = activeLayers.water && activePolicy.waterInfrastructure > 30;
    if (showWater && !m.getSource('water-pipes')) {
      m.addSource('water-pipes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[77.5, 13.0], [77.6, 12.9], [77.7, 12.8]] } },
            { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[77.55, 12.85], [77.65, 12.95], [77.75, 13.05]] } }
          ]
        }
      });
      m.addLayer({
        id: 'water-pipes-layer', type: 'line', source: 'water-pipes',
        paint: { 'line-color': '#06b6d4', 'line-width': 6, 'line-opacity': 0.6, 'line-blur': 4 }
      });
    } else if (!showWater && m.getLayer('water-pipes-layer')) {
      m.removeLayer('water-pipes-layer'); m.removeSource('water-pipes');
    }

    // ROAD CAPACITY
    const showRoads = activeLayers.roads && activePolicy.roadCapacity > 45;
    if (showRoads && !m.getSource('road-corridors')) {
      m.addSource('road-corridors', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[77.52, 13.02], [77.59, 12.97], [77.68, 12.92]] } }
          ]
        }
      });
      m.addLayer({
        id: 'road-corridors-layer', type: 'line', source: 'road-corridors',
        paint: { 'line-color': '#f97316', 'line-width': 8, 'line-opacity': 0.4, 'line-blur': 2 }
      });
    } else if (!showRoads && m.getLayer('road-corridors-layer')) {
      m.removeLayer('road-corridors-layer'); m.removeSource('road-corridors');
    }

    // GREEN SPACE
    const showParks = activeLayers.parks && activePolicy.greenSpaceAllocation > 25;
    if (showParks && !m.getSource('green-parks')) {
      m.addSource('green-parks', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: Array.from({ length: 20 }).map(() => ({
            type: 'Feature', properties: {},
            geometry: { type: 'Point', coordinates: [BENGALURU_CENTER[0] + (Math.random() - 0.5) * 0.2, BENGALURU_CENTER[1] + (Math.random() - 0.5) * 0.2] }
          }))
        }
      });
      m.addLayer({
        id: 'green-parks-layer', type: 'circle', source: 'green-parks',
        paint: { 'circle-radius': 15, 'circle-color': '#84cc16', 'circle-blur': 1, 'circle-opacity': 0.3 }
      });
    } else if (!showParks && m.getLayer('green-parks-layer')) {
      m.removeLayer('green-parks-layer'); m.removeSource('green-parks');
    }

  }, [year, activePolicy, activeLayers]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[var(--slate-900)] overflow-hidden rounded-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Layers Control */}
      <div className="absolute top-4 right-4 bg-[var(--slate-900)]/90 backdrop-blur border border-[var(--slate-700)] rounded-xl p-3 text-white shadow-2xl z-10 w-48">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-3 text-gray-300">
          <Layers size={14} /> Map Layers
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-400 transition-colors">
            <input type="checkbox" checked={activeLayers.metro} onChange={() => toggleLayer('metro')} className="accent-blue-500 rounded bg-slate-800 border-slate-600" />
            Transit Networks
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-400 transition-colors">
            <input type="checkbox" checked={activeLayers.ev} onChange={() => toggleLayer('ev')} className="accent-green-500 rounded bg-slate-800 border-slate-600" />
            EV Microgrids
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-400 transition-colors">
            <input type="checkbox" checked={activeLayers.water} onChange={() => toggleLayer('water')} className="accent-cyan-500 rounded bg-slate-800 border-slate-600" />
            Water Infrastructure
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-400 transition-colors">
            <input type="checkbox" checked={activeLayers.roads} onChange={() => toggleLayer('roads')} className="accent-orange-500 rounded bg-slate-800 border-slate-600" />
            Arterial Corridors
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-gray-400 transition-colors">
            <input type="checkbox" checked={activeLayers.parks} onChange={() => toggleLayer('parks')} className="accent-lime-500 rounded bg-slate-800 border-slate-600" />
            Urban Green Spaces
          </label>
        </div>
      </div>

      {/* Embedded Timeline Engine */}
      {setYear && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--slate-900)]/95 backdrop-blur-md border border-[var(--slate-700)] rounded-full px-8 py-3 shadow-2xl z-10 flex items-center gap-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Timeline</div>
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`relative px-3 py-1 text-sm font-bold font-mono transition-all duration-300 rounded-full ${
                year === y 
                  ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
