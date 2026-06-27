"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulationStore } from '@/stores';
import { BENGALURU_METRO_GEOJSON } from '@/lib/gis/data';

const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  hybrid: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11'
};

const BENGALURU_CENTER = [77.5946, 12.9716] as [number, number];

export function CityMapTwin({ year, interactive = true }: { year: number, interactive?: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const store = useSimulationStore();
  const { activePolicy, results } = store;

  const [activeStyle, setActiveStyle] = useState<'light' | 'satellite' | 'hybrid' | 'dark'>('dark');

  useEffect(() => {
    if (!mapContainer.current) return;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive) return;
      const mapboxgl = m.default;
      // Use env token or fallback to a public demo token if missing to prevent black screen on Vercel
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: MAP_STYLES[activeStyle],
        center: BENGALURU_CENTER,
        zoom: 11.5,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
        interactive: interactive
      });

      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      }

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
        
        // Districts Layer (Synthetic Data for Heatmap visualization)
        map.current.addSource('districts', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: { id: 'whitefield' }, geometry: { type: 'Point', coordinates: [77.7499, 12.9698] } },
              { type: 'Feature', properties: { id: 'ecity' }, geometry: { type: 'Point', coordinates: [77.6688, 12.8452] } },
              { type: 'Feature', properties: { id: 'bellandur' }, geometry: { type: 'Point', coordinates: [77.6739, 12.9304] } },
              { type: 'Feature', properties: { id: 'koramangala' }, geometry: { type: 'Point', coordinates: [77.6208, 12.9352] } },
              { type: 'Feature', properties: { id: 'hebbal' }, geometry: { type: 'Point', coordinates: [77.5919, 13.0354] } }
            ]
          }
        });

        map.current.addLayer({
          id: 'districts-heatmap',
          type: 'heatmap',
          source: 'districts',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(0,0,0,0)',
              0.2, 'rgba(37, 99, 235, 0.5)',
              0.5, 'rgba(16, 185, 129, 0.6)',
              0.8, 'rgba(245, 158, 11, 0.7)',
              1, 'rgba(239, 68, 68, 0.8)'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 30, 15, 100],
            'heatmap-opacity': 0.6
          }
        });
      });
    });

    return () => {
      isActive = false;
      map.current?.remove();
    };
  }, []);

  // Update Map based on Year and Policy
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Temporal Evolution: Metro Expansion
    // If year >= 2026 or metro expansion policy is extremely high
    const showFutureMetro = year >= 2026 || activePolicy.metroExpansion > 60;
    
    if (showFutureMetro && !map.current.getSource('metro-future')) {
      map.current.addSource('metro-future', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Blue Line (ORR-Airport)' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [77.6410, 12.9590], [77.6740, 12.9340], [77.6970, 12.9370],
                  [77.6990, 12.9810], [77.6180, 13.0640], [77.7080, 13.1980]
                ]
              }
            },
            {
              type: 'Feature',
              properties: { name: 'Yellow Line' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [77.5800, 12.9150], [77.6200, 12.9160], [77.6688, 12.8452]
                ]
              }
            }
          ]
        }
      });
      
      map.current.addLayer({
        id: 'metro-future-layer',
        type: 'line',
        source: 'metro-future',
        paint: {
          'line-color': ['match', ['get', 'name'], 'Blue Line (ORR-Airport)', '#3B82F6', 'Yellow Line', '#EAB308', '#ffffff'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 6],
          'line-dasharray': [2, 2],
          'line-opacity': 0.9
        }
      });
    } else if (!showFutureMetro && map.current.getLayer('metro-future-layer')) {
      map.current.removeLayer('metro-future-layer');
      map.current.removeSource('metro-future');
    }

    // EV Charging Overlay
    if (activePolicy.evAdoptionRate > 30 && !map.current.getSource('ev-chargers')) {
      map.current.addSource('ev-chargers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: Array.from({ length: 50 }).map(() => ({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [BENGALURU_CENTER[0] + (Math.random() - 0.5) * 0.3, BENGALURU_CENTER[1] + (Math.random() - 0.5) * 0.3]
            }
          }))
        }
      });
      map.current.addLayer({
        id: 'ev-chargers-layer',
        type: 'circle',
        source: 'ev-chargers',
        paint: {
          'circle-radius': 3,
          'circle-color': '#10B981',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });
    } else if (activePolicy.evAdoptionRate <= 30 && map.current.getLayer('ev-chargers-layer')) {
      map.current.removeLayer('ev-chargers-layer');
      map.current.removeSource('ev-chargers');
    }

  }, [year, activePolicy]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[var(--slate-900)] overflow-hidden rounded-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-[var(--slate-900)]/90 backdrop-blur border border-[var(--slate-700)] rounded-lg p-3 text-[10px] text-[var(--slate-300)] flex flex-col gap-2 z-10 font-mono shadow-2xl">
        <div className="font-bold text-white uppercase tracking-wider mb-1">Live Telemetry Layers</div>
        <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#9333ea] rounded-full"></span> Metro Purple</div>
        <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#16a34a] rounded-full"></span> Metro Green</div>
        {year >= 2026 && <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#3B82F6] border border-dashed rounded-full"></span> Future Corridors</div>}
        {activePolicy.evAdoptionRate > 30 && <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#10B981] rounded-full border border-white"></span> EV Microgrids</div>}
      </div>
    </div>
  );
}
