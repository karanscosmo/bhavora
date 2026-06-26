
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import type { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface District {
  id: string;
  name: string;
  population: string;
  traffic: number;
  energy: string;
  risk: string;
  status: 'High Risk' | 'Optimal' | 'Normal';
  statusColor: string;
  statusBg: string;
  lng: number;
  lat: number;
}

// Define Bengaluru coordinate points for district overlays
const rawDistricts = [
  { id: "whitefield", name: "Whitefield", basePop: 1.2, baseTraffic: 94, baseEnergy: "Stable", baseRisk: 8.4, lng: 77.7499, lat: 12.9698 },
  { id: "electronic_city", name: "Electronic City", basePop: 0.8, baseTraffic: 62, baseEnergy: "100% Health", baseRisk: 3.1, lng: 77.6729, lat: 12.8501 },
  { id: "indiranagar", name: "Indiranagar", basePop: 0.45, baseTraffic: 78, baseEnergy: "92% Health", baseRisk: 5.2, lng: 77.6412, lat: 12.9784 },
  { id: "hebbal", name: "Hebbal", basePop: 0.6, baseTraffic: 54, baseEnergy: "96% Health", baseRisk: 4.8, lng: 77.5913, lat: 13.0358 },
  { id: "koramangala", name: "Koramangala", basePop: 0.55, baseTraffic: 92, baseEnergy: "Critical Load", baseRisk: 7.9, lng: 77.6245, lat: 12.9352 }
];

export default function CitiesPage() {
  const store = useSimulationStore();
  const { metrics, popGrowth } = store;

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    traffic: true,
    metro: true,
    water: false,
    power: false,
    ev: false,
    industrial: false
  });

  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => {
      const next = { ...prev, [layer]: !prev[layer] };
      // Dynamically toggle mapbox layers visibility if loaded
      if (mapRef.current) {
        const map = mapRef.current;
        const layerId = `layer-${layer}`;
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', next[layer] ? 'visible' : 'none');
        }
      }
      return next;
    });
  };

  // Dynamic calculations based on global Zustand store
  const districts: District[] = React.useMemo(() => {
    return rawDistricts.map(d => {
      const population = (d.basePop * (1 + popGrowth / 100)).toFixed(2) + "M";
      const traffic = Math.min(100, Math.max(10, Math.round(d.baseTraffic + metrics.trafficCongestion)));

      let energy = d.baseEnergy;
      if (metrics.energyDemand > 15) {
        if (d.id === 'whitefield' || d.id === 'koramangala') energy = "Critical Load";
        else if (d.id === 'electronic_city') energy = "Peak Draw";
      }

      const calculatedRisk = Math.min(10, Math.max(0, d.baseRisk + (metrics.infrastructureStress - 68) * 0.05));
      const risk = calculatedRisk.toFixed(1) + "/10";

      let status: 'High Risk' | 'Optimal' | 'Normal' = 'Normal';
      let statusColor = "text-primary";
      let statusBg = "bg-primary-fixed/20";

      if (traffic > 85 || calculatedRisk > 7.5) {
        status = 'High Risk';
        statusColor = "text-error";
        statusBg = "bg-error-container";
      } else if (traffic < 65 && calculatedRisk < 5.0) {
        status = 'Optimal';
        statusColor = "text-tertiary";
        statusBg = "bg-tertiary-container";
      }

      return {
        id: d.id,
        name: d.name,
        population,
        traffic,
        energy,
        risk,
        status,
        statusColor,
        statusBg,
        lng: d.lng,
        lat: d.lat
      };
    });
  }, [popGrowth, metrics]);

  const cityHealthIndex = Math.min(100, Math.max(0, Math.round(100 - metrics.infrastructureStress + 36)));
  const urbanResilience = Math.min(100, Math.max(0, Math.round(100 - metrics.infrastructureStress * 0.4)));
  const carbonDeltaStr = (metrics.carbonEmissions > 0 ? "+" : "") + metrics.carbonEmissions + "%";

  // Check for search-initiated district selections
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedDistrictId');
      if (stored) {
        const found = districts.find(d => d.id === stored);
        if (found) {
          setTimeout(() => {
            setSelectedDistrict(found);
          }, 0);
          sessionStorage.removeItem('selectedDistrictId');
          // Fly map to district if loaded
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [found.lng, found.lat], zoom: 13, speed: 1.2 });
          }
        }
      }
    }
  }, [districts]);

  // Client-Side Mapbox Initializer
  useEffect(() => {
    let map: MapboxMap | null = null;

    import('mapbox-gl').then((mapboxglModule) => {
      const mapboxgl = mapboxglModule.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      if (!mapContainerRef.current) return;

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [77.5946, 12.9716],
        zoom: 11,
        pitch: 45,
        attributionControl: false
      });

      mapRef.current = map;

      map.on('load', () => {
        setMapLoaded(true);

        if (!map) return;

        // 1. Traffic Congestion Heatmap (Red/Orange points)
        map.addSource('traffic-heat', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6245, 12.9352] }, properties: { intensity: 9 } }, // Koramangala
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6412, 12.9784] }, properties: { intensity: 7 } }, // Indiranagar
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5913, 13.0358] }, properties: { intensity: 6 } }, // Hebbal
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6186, 12.9176] }, properties: { intensity: 10 } }, // Silk Board
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.7499, 12.9698] }, properties: { intensity: 8 } }, // Whitefield
            ]
          }
        });

        map.addLayer({
          id: 'layer-traffic',
          type: 'heatmap',
          source: 'traffic-heat',
          layout: { visibility: 'visible' },
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 10, 1],
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(0,0,0,0)',
              0.2, 'rgba(255,200,0,0.5)',
              0.5, 'rgba(255,100,0,0.8)',
              1, 'rgba(255,0,0,1)'
            ],
            'heatmap-radius': 40,
            'heatmap-opacity': 0.8
          }
        });

        // 2. Metro Lines (Blue corridors)
        map.addSource('metro-lines', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [77.5913, 13.0358], // Hebbal
                    [77.5946, 12.9716], // Majestic/Center
                    [77.6245, 12.9352], // Koramangala
                    [77.6729, 12.8501]  // ECity
                  ]
                }
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [77.5000, 12.9716], // West
                    [77.5946, 12.9716], // Majestic
                    [77.6412, 12.9784], // Indiranagar
                    [77.7499, 12.9698]  // Whitefield
                  ]
                }
              }
            ]
          }
        });

        map.addLayer({
          id: 'layer-metro',
          type: 'line',
          source: 'metro-lines',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': '#004ac6',
            'line-width': 6,
            'line-opacity': 0.7,
            'line-dasharray': [2, 1]
          }
        });

        // 3. Water Distribution (Cyan polygon fills)
        map.addSource('water-reservoirs', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [77.6697, 12.9256], [77.6750, 12.9200], [77.6800, 12.9300], [77.6697, 12.9256] // Bellandur Lake area approx
                  ]]
                }
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [77.5800, 13.0500], [77.5900, 13.0450], [77.5950, 13.0550], [77.5800, 13.0500] // Hebbal Lake area approx
                  ]]
                }
              }
            ]
          }
        });

        map.addLayer({
          id: 'layer-water',
          type: 'fill',
          source: 'water-reservoirs',
          layout: { visibility: 'none' },
          paint: {
            'fill-color': '#0ea5e9',
            'fill-opacity': 0.5
          }
        });

        // 4. Power Grid Substation Nodes (Amber circles)
        map.addSource('power-grid', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.65, 12.95] }, properties: {} },
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.70, 12.98] }, properties: {} },
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.60, 12.90] }, properties: {} },
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.55, 13.00] }, properties: {} }
            ]
          }
        });

        map.addLayer({
          id: 'layer-power',
          type: 'circle',
          source: 'power-grid',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': 15,
            'circle-color': '#f59e0b',
            'circle-opacity': 0.6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#d97706'
          }
        });

        // 5. EV Charging Network (Violet points)
        map.addSource('ev-network', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: Array.from({ length: 30 }).map(() => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                // Randomly scatter points around center
                coordinates: [77.5946 + (Math.random() - 0.5) * 0.2, 12.9716 + (Math.random() - 0.5) * 0.2]
              },
              properties: {}
            }))
          }
        });

        map.addLayer({
          id: 'layer-ev',
          type: 'circle',
          source: 'ev-network',
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': 6,
            'circle-color': '#7c3aed',
            'circle-opacity': 0.8
          }
        });

        // 6. Industrial Zones (Purple areas)
        map.addSource('industrial-zones', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [77.65, 12.83], [77.69, 12.83], [77.69, 12.87], [77.65, 12.87], [77.65, 12.83] // ECity approx area
                  ]]
                }
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [77.48, 13.01], [77.52, 13.01], [77.52, 13.05], [77.48, 13.05], [77.48, 13.01] // Peenya approx area
                  ]]
                }
              }
            ]
          }
        });

        map.addLayer({
          id: 'layer-industrial',
          type: 'fill',
          source: 'industrial-zones',
          layout: { visibility: 'none' },
          paint: {
            'fill-color': '#9333ea',
            'fill-opacity': 0.4
          }
        });
      });
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Update District Custom HTML Markers inside Mapbox
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    import('mapbox-gl').then((mapboxglModule) => {
      const mapboxgl = mapboxglModule.default;
      const map = mapRef.current;
      if (!map) return;

      districts.forEach(d => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 rounded-full border-2 bg-white/50 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-125 shadow-lg';
        el.style.borderColor = d.status === 'High Risk' ? '#ba1a1a' : d.status === 'Optimal' ? '#10b981' : '#004ac6';

        const child = document.createElement('div');
        child.className = `w-2.5 h-2.5 rounded-full ${d.status === 'High Risk' ? 'bg-error animate-pulse' : d.status === 'Optimal' ? 'bg-tertiary' : 'bg-primary'}`;
        el.appendChild(child);

        el.addEventListener('click', () => {
          setSelectedDistrict(d);
          map.flyTo({ center: [d.lng, d.lat], zoom: 12.5 });
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([d.lng, d.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, districts]);

  return (
    <div className="absolute inset-0 overflow-hidden flex select-none animate-fade-in">
      {/* Interactive Map (Left Panel) */}
      <div className="flex-1 relative bg-[#e5eeff] overflow-hidden">
        {/* Real Interactive Mapbox Container */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

        {/* District Details Floating Overlay (When Clicked) */}
        {selectedDistrict && (
          <div className="absolute top-24 left-6 w-72 bg-white/95 backdrop-blur-xl border border-outline-variant/30 p-5 rounded-2xl shadow-2xl z-30 animate-scale-in">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-headline-sm text-on-surface">{selectedDistrict.name}</h4>
              <span className={`px-2.5 py-0.5 ${selectedDistrict.statusBg} ${selectedDistrict.statusColor} text-[10px] font-bold rounded-full uppercase`}>
                {selectedDistrict.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Population</p>
                <p className="text-sm font-bold text-on-surface">{selectedDistrict.population}</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Traffic Load</p>
                <p className={`text-sm font-bold ${selectedDistrict.traffic > 80 ? 'text-error' : 'text-on-surface'}`}>{selectedDistrict.traffic}%</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Energy Grid</p>
                <p className="text-sm font-bold text-on-surface">{selectedDistrict.energy}</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Risk Score</p>
                <p className="text-sm font-bold text-on-surface">{selectedDistrict.risk}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDistrict(null)}
              className="mt-4 w-full bg-surface-container hover:bg-surface-container-high py-2 rounded-lg text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        )}

        {/* Bottom Left HUD (City Health Index) */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-4">
          <div className="bg-white/90 backdrop-blur-xl border border-outline-variant/30 p-4 rounded-2xl shadow-xl w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span></span>
                <span className="text-xs font-bold text-on-surface">City Health Index</span>
              </div>
              <span className="text-mono-label bg-surface-container text-primary font-bold px-2 py-0.5 rounded text-[11px]">{cityHealthIndex}/100</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-on-surface-variant">Urban Resilience</span>
                  <span className="text-on-surface font-bold">{urbanResilience}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-[1s]" style={{ width: `${urbanResilience}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-on-surface-variant">Carbon Footprint Change</span>
                  <span className={`font-bold ${metrics.carbonEmissions > 0 ? 'text-error' : 'text-emerald-600'}`}>{carbonDeltaStr}</span>
                </div>
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${metrics.carbonEmissions > 0 ? 'bg-error' : 'bg-emerald-500'} transition-all duration-[1s]`} style={{ width: `${Math.min(100, Math.max(10, Math.round(50 + metrics.carbonEmissions * 2)))}%` }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl border border-outline-variant/10 text-[10px]">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">trending_up</span>
                  <span>Projected growth in Hebbal Corridor</span>
                </div>
                <span className="font-bold text-primary">+{popGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Mini controls */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (mapRef.current) mapRef.current.zoomIn();
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white active:scale-95 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant">add</span>
            </button>
            <button
              onClick={() => {
                if (mapRef.current) mapRef.current.zoomOut();
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white active:scale-95 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant">remove</span>
            </button>
            <button
              onClick={() => {
                if (mapRef.current) mapRef.current.flyTo({ center: [77.5946, 12.9716], zoom: 11, pitch: 45 });
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white active:scale-95 shadow-md cursor-pointer"
              title="Recenter"
            >
              <span className="material-symbols-outlined text-on-surface-variant">my_location</span>
            </button>
            <button
              onClick={() => {
                if (mapRef.current) {
                  const currentPitch = mapRef.current.getPitch();
                  mapRef.current.setPitch(currentPitch === 0 ? 45 : 0);
                }
              }}
              className="px-4 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl flex items-center gap-2 hover:bg-white active:scale-95 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">layers</span>
              <span className="text-xs font-semibold text-on-surface-variant">Toggle 3D</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layer Controls Panel (Right Panel) */}
      <div className="w-80 bg-white/95 border-l border-outline-variant/20 h-full shadow-2xl z-20 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-on-surface text-lg">Layer Controls</h3>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] cursor-help">info</span>
        </div>

        <div className="space-y-3 flex-1">
          {[
            { id: 'traffic', name: 'Traffic Congestion', icon: 'traffic', color: 'text-error', bg: 'bg-error-container/40' },
            { id: 'metro', name: 'Metro Connectivity', icon: 'subway', color: 'text-primary', bg: 'bg-primary-fixed/20' },
            { id: 'water', name: 'Water Distribution', icon: 'water_drop', color: 'text-blue-600', bg: 'bg-blue-50' },
            { id: 'power', name: 'Power Grid Load', icon: 'bolt', color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'ev', name: 'EV Charging Network', icon: 'ev_station', color: 'text-violet-600', bg: 'bg-violet-50' },
            { id: 'industrial', name: 'Industrial Zones', icon: 'factory', color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map(layer => (
            <div
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className="flex items-center justify-between p-3.5 hover:bg-surface-container rounded-xl cursor-pointer group transition-colors border border-outline-variant/10"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${layer.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <span className={`material-symbols-outlined ${layer.color} text-[18px]`}>{layer.icon}</span>
                </div>
                <span className="text-[13px] font-medium text-on-surface">{layer.name}</span>
              </div>
              <div className={`w-9 h-5 rounded-full relative p-0.5 transition-colors duration-200 ${activeLayers[layer.id] ? 'bg-primary' : 'bg-outline-variant'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${activeLayers[layer.id] ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-outline-variant/30 mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Active Feeds</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-surface-container text-primary text-[9px] font-bold rounded-lg uppercase tracking-wider">Sensor Mesh v2</span>
            <span className="px-2.5 py-1 bg-surface-container text-primary text-[9px] font-bold rounded-lg uppercase tracking-wider">GIS Layer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
