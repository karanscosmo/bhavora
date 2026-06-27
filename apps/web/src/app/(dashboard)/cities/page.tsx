"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useMapStore, useUIStore, useCityDataStore, useSimulationStore } from '@/stores';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Seeded coordinates for layers not in geojson
const EV_STATIONS = [
  { name: 'Hope Farm EV Hub', coordinates: [77.7499, 12.9698], chargerCount: 12, capacity: '250 kW' },
  { name: 'Koramangala 80ft Rd Fast Charger', coordinates: [77.6245, 12.9352], chargerCount: 8, capacity: '150 kW' },
  { name: 'Manyata Tech Park Charging Stn', coordinates: [77.5913, 13.0358], chargerCount: 16, capacity: '350 kW' },
  { name: 'Indiranagar Metro Station Charger', coordinates: [77.6412, 12.9784], chargerCount: 6, capacity: '50 kW' },
  { name: 'Electronic City Phase 1 Charger', coordinates: [77.6729, 12.8501], chargerCount: 24, capacity: '500 kW' },
];

const BUS_DEPOTS = [
  { name: 'Majestic BMTC Depot 1', coordinates: [77.5726, 12.9776], fleetSize: 220, fleetType: 'Mixed Electric/Diesel' },
  { name: 'Koramangala Depot 4', coordinates: [77.6186, 12.9176], fleetSize: 140, fleetType: '100% Electric Fleet' },
  { name: 'Indiranagar Bus Station Depot', coordinates: [77.6385, 12.9719], fleetSize: 95, fleetType: 'Diesel' },
  { name: 'Whitefield TTMC Depot', coordinates: [77.7342, 12.9611], fleetSize: 180, fleetType: 'Electric Hub' },
  { name: 'Hebbal Depot 9', coordinates: [77.5962, 13.0298], fleetSize: 160, fleetType: 'Mixed' },
];

const TECH_PARKS = [
  { name: 'International Tech Park Bangalore (ITPL)', coordinates: [77.7358, 12.9862], employees: '45,000+', area: '69 acres' },
  { name: 'Manyata Embassy Business Park', coordinates: [77.6231, 13.0452], employees: '110,000+', area: '110 acres' },
  { name: 'Bagmane Tech Park', coordinates: [77.6596, 12.9806], employees: '35,000+', area: '42 acres' },
  { name: 'Embassy TechVillage (ORR)', coordinates: [77.6898, 12.9304], employees: '80,000+', area: '84 acres' },
  { name: 'Electronic City Tech Campus 1', coordinates: [77.6698, 12.8452], employees: '95,000+', area: '120 acres' },
];

const INDUSTRIAL_ZONES = [
  { name: 'Peenya Industrial Area Phase 1', coordinates: [77.5256, 13.0298], units: '1,200+', primary: 'Manufacturing' },
  { name: 'Bommasandra Industrial Area', coordinates: [77.6835, 12.8122], units: '850+', primary: 'Automotive & Pharma' },
  { name: 'Hoodi Industrial Complex', coordinates: [77.7126, 12.9912], units: '450+', primary: 'Light Electronics' },
];

const FLOOD_ZONES = [
  { name: 'Bellandur Lake Catchment Area', coordinates: [77.6513, 12.9372], severity: 'Critical Risk', elevation: '868m' },
  { name: 'Varthur Overflow Basin', coordinates: [77.7212, 12.9498], severity: 'Major Risk', elevation: '865m' },
  { name: 'Koramangala Valley storm drain', coordinates: [77.6212, 12.9412], severity: 'Moderate Risk', elevation: '870m' },
];

const METRO_ROUTES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.5913, 13.0358], // Hebbal
          [77.6412, 12.9784], // Indiranagar
          [77.6245, 12.9352], // Koramangala
          [77.6729, 12.8501]  // Electronic City
        ]
      },
      properties: { name: 'Purple/Green Connect' }
    }
  ]
};

export default function CitiesPage() {
  const { layers, toggleLayer, layerOpacity, setLayerOpacity, activeBasemap, setBasemap } = useMapStore();
  const { selectedMapAsset, setSelectedMapAsset } = useUIStore();
  const cityData = useCityDataStore();
  const sim = useSimulationStore();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeAssetDetails, setActiveAssetDetails] = useState<any | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);

  // Filter map layers based on Zustand state
  const isLayerEnabled = (id: string) => layers.find(l => l.id === id)?.enabled || false;

  // Clear existing markers helper
  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  };

  // Re-sync markers when layer states change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    // Clear dynamic overlay markers
    clearMarkers();

    // Import mapbox dynamically to create HTML element markers
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;

      // 1. EV STATIONS
      if (isLayerEnabled('ev-stations')) {
        EV_STATIONS.forEach(ev => {
          const el = document.createElement('div');
          el.className = 'map-marker ev-marker';
          el.style.cssText = 'width: 14px; height: 14px; border-radius: 50%; background: #3B82F6; border: 2px solid #fff; cursor: pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(ev.name);
            setActiveAssetDetails({ type: 'EV Station', ...ev });
          });
          const marker = new mapboxgl.Marker(el).setLngLat(ev.coordinates as [number, number]).addTo(map);
          markersRef.current.push(marker);
        });
      }

      // 2. BUS DEPOTS
      if (isLayerEnabled('bus-depots')) {
        BUS_DEPOTS.forEach(depot => {
          const el = document.createElement('div');
          el.className = 'map-marker bus-marker';
          el.style.cssText = 'width: 15px; height: 15px; border-radius: 4px; background: #8B5CF6; border: 2px solid #fff; cursor: pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(depot.name);
            setActiveAssetDetails({ type: 'Bus Depot', ...depot });
          });
          const marker = new mapboxgl.Marker(el).setLngLat(depot.coordinates as [number, number]).addTo(map);
          markersRef.current.push(marker);
        });
      }

      // 3. TECH PARKS
      if (isLayerEnabled('tech-parks')) {
        TECH_PARKS.forEach(park => {
          const el = document.createElement('div');
          el.className = 'map-marker park-marker';
          el.style.cssText = 'width: 16px; height: 16px; transform: rotate(45deg); background: #10B981; border: 2px solid #fff; cursor: pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(park.name);
            setActiveAssetDetails({ type: 'Tech Park', ...park });
          });
          const marker = new mapboxgl.Marker(el).setLngLat(park.coordinates as [number, number]).addTo(map);
          markersRef.current.push(marker);
        });
      }

      // 4. INDUSTRIAL ZONES
      if (isLayerEnabled('industrial')) {
        INDUSTRIAL_ZONES.forEach(ind => {
          const el = document.createElement('div');
          el.className = 'map-marker industrial-marker';
          el.style.cssText = 'width: 16px; height: 16px; background: #F59E0B; border: 2px solid #fff; cursor: pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(ind.name);
            setActiveAssetDetails({ type: 'Industrial Zone', ...ind });
          });
          const marker = new mapboxgl.Marker(el).setLngLat(ind.coordinates as [number, number]).addTo(map);
          markersRef.current.push(marker);
        });
      }

      // 5. FLOOD ZONES
      if (isLayerEnabled('flood-zones')) {
        FLOOD_ZONES.forEach(flood => {
          const el = document.createElement('div');
          el.className = 'map-marker flood-marker';
          el.style.cssText = 'width: 20px; height: 20px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); border: 2px solid #EF4444; animation: live-pulse 2s infinite; cursor: pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(flood.name);
            setActiveAssetDetails({ type: 'Flood Risk Zone', ...flood });
          });
          const marker = new mapboxgl.Marker(el).setLngLat(flood.coordinates as [number, number]).addTo(map);
          markersRef.current.push(marker);
        });
      }
    });

    // 6. METRO STATIONS / ROUTES Layer Visibility
    if (map.getLayer('layer-metro-stations')) {
      map.setLayoutProperty('layer-metro-stations', 'visibility', isLayerEnabled('metro-stations') ? 'visible' : 'none');
    }
    if (map.getLayer('layer-metro-routes')) {
      map.setLayoutProperty('layer-metro-routes', 'visibility', isLayerEnabled('metro-routes') ? 'visible' : 'none');
    }
    if (map.getLayer('layer-hospitals')) {
      map.setLayoutProperty('layer-hospitals', 'visibility', isLayerEnabled('hospitals') ? 'visible' : 'none');
    }
    if (map.getLayer('layer-lakes')) {
      map.setLayoutProperty('layer-lakes', 'visibility', isLayerEnabled('lakes') ? 'visible' : 'none');
    }
    if (map.getLayer('layer-substations')) {
      map.setLayoutProperty('layer-substations', 'visibility', isLayerEnabled('substations') ? 'visible' : 'none');
    }

  }, [layers, mapLoaded]);

  // Handle Opacity Changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const opacityValue = layerOpacity / 100;

    const layersToAdjust = ['layer-metro-stations', 'layer-metro-routes', 'layer-hospitals', 'layer-lakes', 'layer-substations'];
    layersToAdjust.forEach(l => {
      const layerObj = map.getLayer(l);
      if (layerObj) {
        const type = layerObj.type;
        if (type === 'circle') map.setPaintProperty(l, 'circle-opacity', opacityValue);
        if (type === 'line') map.setPaintProperty(l, 'line-opacity', opacityValue);
      }
    });
  }, [layerOpacity, mapLoaded]);

  // Handle Basemap Swapping
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const styleUrl = activeBasemap === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11';
    
    // Changing map style triggers 'load' again, requiring full layer initialization
    setMapLoaded(false);
    map.setStyle(styleUrl);
    
    const onStyleLoad = () => {
      initializeGeoJsonLayers(map);
      setMapLoaded(true);
    };

    map.once('style.load', onStyleLoad);
  }, [activeBasemap]);

  // Map Initialization & GeoJSON Layers Setup
  const initializeGeoJsonLayers = (map: MapboxMap) => {
    // A. METRO ROUTES
    if (!map.getSource('metro-routes-src')) {
      map.addSource('metro-routes-src', { type: 'geojson', data: METRO_ROUTES_GEOJSON as any });
      map.addLayer({
        id: 'layer-metro-routes',
        type: 'line',
        source: 'metro-routes-src',
        paint: {
          'line-color': '#7C3AED',
          'line-width': 4,
          'line-opacity': layerOpacity / 100,
        }
      });
    }

    // B. METRO STATIONS
    if (!map.getSource('metro-stations-src')) {
      map.addSource('metro-stations-src', { type: 'geojson', data: '/data/metro_stations.geojson' });
      map.addLayer({
        id: 'layer-metro-stations',
        type: 'circle',
        source: 'metro-stations-src',
        paint: {
          'circle-radius': 6,
          'circle-color': '#00D4FF',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-opacity': layerOpacity / 100,
        }
      });

      map.on('click', 'layer-metro-stations', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties || {};
          setSelectedMapAsset(props.name || 'Metro Station');
          setActiveAssetDetails({
            type: 'Metro Station',
            name: props.name || 'BMRCL Station',
            coordinates: e.features[0].geometry.type === 'Point' ? (e.features[0].geometry as any).coordinates : null,
            line: props.line || 'Purple Line',
            status: 'Operational',
            ridership: 'Daily average 12k pax',
          });
        }
      });
    }

    // C. HOSPITALS
    if (!map.getSource('hospitals-src')) {
      map.addSource('hospitals-src', { type: 'geojson', data: '/data/hospitals.geojson' });
      map.addLayer({
        id: 'layer-hospitals',
        type: 'circle',
        source: 'hospitals-src',
        paint: {
          'circle-radius': 5,
          'circle-color': '#EF4444',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1,
          'circle-opacity': layerOpacity / 100,
        }
      });

      map.on('click', 'layer-hospitals', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties || {};
          setSelectedMapAsset(props.name || 'Hospital');
          setActiveAssetDetails({
            type: 'Hospital',
            name: props.name || 'BBMP Health Center',
            coordinates: e.features[0].geometry.type === 'Point' ? (e.features[0].geometry as any).coordinates : null,
            beds: props.beds || '80-120 beds capacity',
            traumaCare: props.amenity === 'hospital' ? 'Level 2 Trauma' : 'Primary Care Unit',
          });
        }
      });
    }

    // D. LAKES & RESERVOIRS
    if (!map.getSource('lakes-src')) {
      map.addSource('lakes-src', { type: 'geojson', data: '/data/lakes.geojson' });
      map.addLayer({
        id: 'layer-lakes',
        type: 'circle',
        source: 'lakes-src',
        paint: {
          'circle-radius': 8,
          'circle-color': '#3B82F6',
          'circle-opacity': (layerOpacity / 100) * 0.7,
        }
      });

      map.on('click', 'layer-lakes', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties || {};
          setSelectedMapAsset(props.name || 'Lake');
          setActiveAssetDetails({
            type: 'Lake / Reservoir',
            name: props.name || 'Bengaluru Lake Catchment',
            coordinates: e.features[0].geometry.type === 'Point' ? (e.features[0].geometry as any).coordinates : null,
            quality: 'PH 7.4 (Good)',
            volume: 'Storage capability: 120 MLD equivalent',
          });
        }
      });
    }

    // E. SUBSTATIONS
    if (!map.getSource('substations-src')) {
      map.addSource('substations-src', { type: 'geojson', data: '/data/substations.geojson' });
      map.addLayer({
        id: 'layer-substations',
        type: 'circle',
        source: 'substations-src',
        paint: {
          'circle-radius': 6,
          'circle-color': '#F59E0B',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-opacity': layerOpacity / 100,
        }
      });

      map.on('click', 'layer-substations', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties || {};
          setSelectedMapAsset(props.name || 'Substation');
          setActiveAssetDetails({
            type: 'Power Substation',
            name: props.name || 'BESCOM Substation Node',
            coordinates: e.features[0].geometry.type === 'Point' ? (e.features[0].geometry as any).coordinates : null,
            load: '82% Nominal Load',
            capacity: props.rating || '66/11 kV Sub-transmission',
          });
        }
      });
    }
  };

  // Base map container initializer
  useEffect(() => {
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      if (!mapContainerRef.current) return;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: activeBasemap === 'satellite' ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11,
        pitch: 35,
        attributionControl: false
      });

      mapRef.current = map;

      map.on('load', () => {
        initializeGeoJsonLayers(map);
        setMapLoaded(true);
      });
    });

    return () => {
      clearMarkers();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Selected telemetry chart fake data
  const telemetryData = useMemo(() => [
    { name: '08:00', load: 45, usage: 52 },
    { name: '12:00', load: 78, usage: 84 },
    { name: '16:00', load: 91, usage: 76 },
    { name: '20:00', load: 83, usage: 89 },
    { name: '00:00', load: 50, usage: 45 },
  ], []);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
      
      {/* ===== LAYER MANAGER & BASEMAPS (LEFT SIDEBAR) ===== */}
      <div style={{
        width: '320px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(5,10,20,0.95)',
        zIndex: 5
      }}>
        {/* Layer Manager Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Layer Manager</h2>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
            Bengaluru GIS Data & Infrastructure Layers
          </p>
        </div>

        {/* Layer checkboxes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {layers.map(layer => (
            <label
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                background: layer.enabled ? 'rgba(0, 212, 255, 0.04)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${layer.enabled ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255,255,255,0.04)'}`,
                cursor: 'pointer',
                transition: 'all 120ms',
              }}
              className="hover:bg-[rgba(255,255,255,0.03)]"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={layer.enabled}
                  onChange={() => toggleLayer(layer.id)}
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '4px',
                    accentColor: '#00D4FF',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '16px' }}>{layer.icon}</span>
                <span style={{ fontSize: '13px', color: layer.enabled ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {layer.name}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                [{layer.count}]
              </span>
            </label>
          ))}
        </div>

        {/* Map Styling Settings (Bottom) */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Opacity Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
              <span>LAYER OPACITY</span>
              <span style={{ fontFamily: 'monospace' }}>{layerOpacity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={layerOpacity}
              onChange={(e) => setLayerOpacity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00D4FF', cursor: 'pointer' }}
            />
          </div>

          {/* Basemap Toggle */}
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Base Map Style
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setBasemap('dark')}
                style={{
                  flex: 1, padding: '6px 12px', borderRadius: '4px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  background: activeBasemap === 'dark' ? '#00D4FF' : 'transparent',
                  color: activeBasemap === 'dark' ? '#050A14' : 'rgba(255,255,255,0.5)',
                  transition: 'all 120ms'
                }}
              >
                Dark Map
              </button>
              <button
                onClick={() => setBasemap('satellite')}
                style={{
                  flex: 1, padding: '6px 12px', borderRadius: '4px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  background: activeBasemap === 'satellite' ? '#00D4FF' : 'transparent',
                  color: activeBasemap === 'satellite' ? '#050A14' : 'rgba(255,255,255,0.5)',
                  transition: 'all 120ms'
                }}
              >
                Satellite Imagery
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== INTERACTIVE MAP DISPLAY (CENTER) ===== */}
      <div style={{ flex: 1, position: 'relative' }}>
        {!mapLoaded && (
          <div style={{
            position: 'absolute', inset: 0, background: '#050A14', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px'
          }}>
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              Loading geospatial city twin layers...
            </span>
          </div>
        )}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* ===== ASSET INFO & TELEMETRY PANEL (RIGHT SIDEBAR) ===== */}
      {selectedMapAsset && activeAssetDetails && (
        <div style={{
          width: '360px',
          flexShrink: 0,
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(5,10,20,0.95)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
          boxShadow: '-8px 0 24px rgba(0,0,0,0.25)',
          animation: 'slide-right 0.2s ease-out',
        }}>
          {/* Panel Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00D4FF',
                padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)'
              }}>
                {activeAssetDetails.type}
              </span>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '8px 0 0', lineHeight: 1.3 }}>
                {activeAssetDetails.name}
              </h2>
            </div>
            <button
              onClick={() => setSelectedMapAsset(null)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          {/* Details & Telemetry */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Meta Specifications */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {Object.keys(activeAssetDetails).filter(k => !['type', 'name', 'coordinates'].includes(k)).map(key => (
                <div key={key} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{key}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>{activeAssetDetails[key]}</div>
                </div>
              ))}
            </div>

            {/* Coordinates */}
            {activeAssetDetails.coordinates && (
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>Coordinates</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  Lat: {activeAssetDetails.coordinates[1].toFixed(5)}, Lng: {activeAssetDetails.coordinates[0].toFixed(5)}
                </span>
              </div>
            )}

            {/* Telemetry charts */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>Telemetry & Health Metrics</h3>
              <div style={{ height: '140px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetryData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '4px', fontSize: '10px' }} />
                    <Line type="monotone" dataKey="load" stroke="#00D4FF" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="usage" stroke="#7C3AED" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', justifyContent: 'center' }}>
                <span style={{ fontSize: '9px', color: '#00D4FF' }}>● Grid Load (%)</span>
                <span style={{ fontSize: '9px', color: '#7C3AED' }}>● Demand Volume (GWh)</span>
              </div>
            </div>

            {/* AI Assessment recommendation */}
            <div style={{ padding: '14px', background: 'rgba(0, 212, 255, 0.03)', border: '1px solid rgba(0, 212, 255, 0.12)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#00D4FF', fontWeight: 700 }}>
                <span>🤖</span>
                <span>AI OPTIMIZATION NOTE</span>
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: '6px 0 0' }}>
                Active load profile indicates peak capacity thresholds within nominal margins. Scheduled routine maintenance forecast: Q3 2026.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
