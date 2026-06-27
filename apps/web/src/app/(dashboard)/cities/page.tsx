"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useMapStore, useUIStore, useCityDataStore, useSimulationStore } from '@/stores';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const LEGEND_ITEMS = [
  { color: 'var(--accent-navy)', shape: 'circle' as const, label: 'EV Charging Stations' },
  { color: 'var(--accent-teal)', shape: 'diamond' as const, label: 'Tech Parks' },
  { color: 'var(--accent-amber)', shape: 'diamond' as const, label: 'Bus Depots' },
  { color: 'var(--accent-violet)', shape: 'square' as const, label: 'Industrial Zones' },
  { color: 'var(--accent-red)', shape: 'circle' as const, label: 'Flood Risk Zones' },
];

type TabType = 'layers' | 'legend';

export default function CitiesPage() {
  const { layers, toggleLayer, layerOpacity, setLayerOpacity, activeBasemap, setBasemap } = useMapStore();
  const { selectedMapAsset, setSelectedMapAsset } = useUIStore();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeAssetDetails, setActiveAssetDetails] = useState<any | null>(null);
  const [layerSearch, setLayerSearch] = useState('');
  const [panelTab, setPanelTab] = useState<TabType>('layers');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Transport: true, Utilities: true, Environment: true, Economic: true, Emergency: true,
  });
  const [cursorCoords, setCursorCoords] = useState({ lng: 77.5946, lat: 12.9716 });
  const [currentZoom, setCurrentZoom] = useState(11.5);
  const [assetLoading, setAssetLoading] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);

  const isLayerEnabled = (id: string) => layers.find(l => l.id === id)?.enabled || false;

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    if (selectedMapAsset) {
      setAssetLoading(true);
      const timer = setTimeout(() => setAssetLoading(false), 350);
      return () => clearTimeout(timer);
    }
  }, [selectedMapAsset]);

  useEffect(() => {
    let map: MapboxMap | null = null;
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      if (!mapContainerRef.current) return;

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: activeBasemap === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : activeBasemap === 'satellite' ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11.5,
        pitch: 50,
        bearing: -17.6,
        attributionControl: false,
      });
      mapRef.current = map;

      map.on('load', () => {
        if (!map) return;
        setMapLoaded(true);

        if (map.getSource('composite')) {
          map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': {
              'fill-extrusion-color': '#ffffff',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.8
            }
          });
        }

        map.on('mousemove', (e) => {
          setCursorCoords({ lng: Number(e.lngLat.lng.toFixed(4)), lat: Number(e.lngLat.lat.toFixed(4)) });
        });
        map.on('zoom', () => {
          if (mapRef.current) setCurrentZoom(Number(mapRef.current.getZoom().toFixed(1)));
        });
      });
    });

    return () => { if (map) map.remove(); };
  }, [activeBasemap]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;
    clearMarkers();

    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;

      if (isLayerEnabled('ev-stations')) {
        EV_STATIONS.forEach(ev => {
          const el = document.createElement('div');
          el.style.cssText = 'width:12px;height:12px;border-radius:50%;background:var(--accent-navy);border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);cursor:pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(ev.name);
            setActiveAssetDetails({ type: 'EV Station', ...ev });
          });
          markersRef.current.push(new mapboxgl.Marker(el).setLngLat(ev.coordinates as [number, number]).addTo(map));
        });
      }

      if (isLayerEnabled('tech-parks')) {
        TECH_PARKS.forEach(park => {
          const el = document.createElement('div');
          el.style.cssText = 'width:14px;height:14px;transform:rotate(45deg);background:var(--accent-teal);border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);cursor:pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(park.name);
            setActiveAssetDetails({ type: 'Tech Park', ...park });
          });
          markersRef.current.push(new mapboxgl.Marker(el).setLngLat(park.coordinates as [number, number]).addTo(map));
        });
      }

      if (isLayerEnabled('flood-zones')) {
        FLOOD_ZONES.forEach(flood => {
          const el = document.createElement('div');
          el.style.cssText = 'width:16px;height:16px;border-radius:50%;background:rgba(186,26,26,0.5);border:2px solid var(--accent-red);animation:live-pulse 2s infinite;cursor:pointer;';
          el.addEventListener('click', () => {
            setSelectedMapAsset(flood.name);
            setActiveAssetDetails({ type: 'Flood Risk Zone', ...flood });
          });
          markersRef.current.push(new mapboxgl.Marker(el).setLngLat(flood.coordinates as [number, number]).addTo(map));
        });
      }
    });

  }, [layers, mapLoaded]);

  const telemetryData = useMemo(() => [
    { name: '08:00', load: 45, usage: 52 },
    { name: '12:00', load: 78, usage: 84 },
    { name: '16:00', load: 91, usage: 76 },
    { name: '20:00', load: 83, usage: 89 },
    { name: '00:00', load: 50, usage: 45 },
  ], []);

  const filteredLayers = layers.filter(l => l.name.toLowerCase().includes(layerSearch.toLowerCase()));
  const groupedLayers = {
    Transport: filteredLayers.filter(l => ['metro-stations', 'metro-routes', 'bus-depots', 'ev-stations'].includes(l.id)),
    Utilities: filteredLayers.filter(l => ['substations', 'water-supply'].includes(l.id)),
    Environment: filteredLayers.filter(l => ['lakes', 'flood-zones'].includes(l.id)),
    Economic: filteredLayers.filter(l => ['tech-parks', 'industrial'].includes(l.id)),
    Emergency: filteredLayers.filter(l => ['hospitals'].includes(l.id)),
  };

  const activeLayerCount = layers.filter(l => l.enabled).length;

  const getNearbyAssets = useCallback(() => {
    if (!activeAssetDetails?.coordinates) return [];
    const coords = activeAssetDetails.coordinates;
    const allAssets = [
      ...EV_STATIONS.map(a => ({ ...a, type: 'EV Station' })),
      ...BUS_DEPOTS.map(a => ({ ...a, type: 'Bus Depot' })),
      ...TECH_PARKS.map(a => ({ ...a, type: 'Tech Park' })),
      ...INDUSTRIAL_ZONES.map(a => ({ ...a, type: 'Industrial Zone' })),
      ...FLOOD_ZONES.map(a => ({ ...a, type: 'Flood Zone' })),
    ].filter(a => a.name !== activeAssetDetails.name);

    return allAssets
      .map(a => ({
        ...a,
        distance: Math.sqrt(
          Math.pow((a.coordinates[0] - coords[0]) * 111320 * Math.cos(coords[1] * Math.PI / 180), 2) +
          Math.pow((a.coordinates[1] - coords[1]) * 111320, 2)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [activeAssetDetails]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

      <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {!mapLoaded && (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-base)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="micro-label">Loading ArcGIS Engine...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="map-container" style={{ width: '100%', height: '100%' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="glass-card"
        style={{ position: 'absolute', top: 24, left: 24, width: '300px', maxHeight: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 20 }}
      >
        <div style={{ display: 'flex', padding: '12px 12px 0', gap: '4px' }}>
          {(['layers', 'legend'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setPanelTab(tab)}
              style={{
                flex: 1,
                padding: '7px 12px',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                background: panelTab === tab ? 'var(--accent-navy)' : 'transparent',
                color: panelTab === tab ? '#fff' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textTransform: 'capitalize',
                letterSpacing: '0.04em',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {panelTab === 'layers' ? (
          <>
            <div style={{ padding: '12px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <input
                type="text"
                placeholder="Search layers..."
                value={layerSearch}
                onChange={e => setLayerSearch(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }} className="hide-scrollbar">
              {Object.entries(groupedLayers).map(([groupName, groupLayers]) => (
                groupLayers.length > 0 && (
                  <motion.div key={groupName} layout style={{ marginBottom: '6px' }}>
                    <button
                      onClick={() => setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '8px 4px 4px', border: 'none', background: 'none', cursor: 'pointer',
                        color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      <span>{groupName} Layers</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>{groupLayers.length}</span>
                        <motion.span
                          animate={{ rotate: expandedGroups[groupName] ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}
                        >
                          ▼
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedGroups[groupName] && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}
                          >
                            {groupLayers.map((layer) => (
                              <motion.div key={layer.id} variants={itemVariants} layout>
                                <label
                                  style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '7px 10px', borderRadius: '10px',
                                    background: layer.enabled ? 'var(--accent-navy-light)' : 'var(--bg-surface-2)',
                                    border: `1px solid ${layer.enabled ? 'var(--border-accent)' : 'transparent'}`,
                                    cursor: 'pointer', transition: 'all 150ms ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', minWidth: 0 }}>
                                    <span style={{ fontSize: '13px', flexShrink: 0 }}>{layer.icon}</span>
                                    <span style={{ fontSize: '12px', fontWeight: layer.enabled ? 600 : 400, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {layer.name}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{layer.count}</span>
                                    <button
                                      onClick={(e) => { e.preventDefault(); toggleLayer(layer.id); }}
                                      style={{
                                        width: '32px', height: '18px', borderRadius: '9px',
                                        background: layer.enabled ? 'var(--accent-navy)' : 'var(--border-subtle)',
                                        position: 'relative', border: 'none', cursor: 'pointer',
                                        transition: 'background 200ms ease', flexShrink: 0, padding: 0,
                                      }}
                                      aria-label={`Toggle ${layer.name}`}
                                    >
                                      <div style={{
                                        width: '14px', height: '14px', borderRadius: '50%',
                                        background: '#fff', position: 'absolute', top: '2px',
                                        left: layer.enabled ? '16px' : '2px',
                                        transition: 'left 200ms ease',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                      }} />
                                    </button>
                                  </div>
                                </label>
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              ))}
            </div>

            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="micro-label" style={{ fontSize: '9px' }}>Layer Opacity</span>
                <span className="data-value" style={{ fontSize: '10px', fontWeight: 600 }}>{Math.round(layerOpacity)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={layerOpacity}
                onChange={e => setLayerOpacity(Number(e.target.value))}
                style={{ width: '100%', height: '4px', accentColor: 'var(--accent-navy)', cursor: 'pointer' }}
              />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="hide-scrollbar">
            <span className="micro-label" style={{ display: 'block', marginBottom: '14px' }}>Map Legend</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {LEGEND_ITEMS.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '12px', height: item.shape === 'diamond' ? '12px' : '12px',
                    borderRadius: item.shape === 'circle' ? '50%' : item.shape === 'diamond' ? '2px' : '3px',
                    background: item.color,
                    transform: item.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.1 }}
        className="glass-card"
        style={{
          position: 'absolute', bottom: 80, left: 24,
          padding: '8px', display: 'flex', gap: '4px', zIndex: 20,
        }}
      >
        {([
          { id: 'light', label: 'Light', color: '#f8f9ff' },
          { id: 'dark', label: 'Dark', color: '#1a1a2e' },
          { id: 'satellite', label: 'Sat', color: '#2d4a3e' },
        ] as { id: 'dark' | 'satellite'; label: string; color: string }[]).map(b => (
          <button
            key={b.id}
            onClick={() => setBasemap(b.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: '10px',
              border: `1.5px solid ${activeBasemap === b.id ? 'var(--accent-navy)' : 'transparent'}`,
              background: activeBasemap === b.id ? 'var(--accent-navy-light)' : 'var(--bg-surface-2)',
              cursor: 'pointer', transition: 'all 150ms ease', fontSize: '11px',
              fontWeight: activeBasemap === b.id ? 600 : 400,
              color: 'var(--text-primary)',
            }}
          >
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: b.color, border: '1px solid var(--border-subtle)',
              flexShrink: 0,
            }} />
            {b.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
        className="glass"
        style={{
          position: 'absolute', top: 24,
          right: selectedMapAsset ? 448 : 24,
          display: 'flex', flexDirection: 'column', gap: '2px',
          padding: '6px', borderRadius: '14px', zIndex: 20,
          transition: 'right 300ms ease',
        }}
      >
        <button
          onClick={() => mapRef.current?.zoomIn()}
          style={{
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', borderRadius: '10px', cursor: 'pointer',
            color: 'var(--text-primary)', fontSize: '20px', fontWeight: 500,
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          title="Zoom in"
        >
          +
        </button>
        <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />
        <button
          onClick={() => mapRef.current?.zoomOut()}
          style={{
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', borderRadius: '10px', cursor: 'pointer',
            color: 'var(--text-primary)', fontSize: '20px', fontWeight: 500,
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          title="Zoom out"
        >
          −
        </button>
        <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />
        <button
          onClick={() => mapRef.current?.flyTo({ bearing: 0, pitch: 0 })}
          style={{
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', borderRadius: '10px', cursor: 'pointer',
            color: 'var(--text-primary)', fontSize: '16px',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          title="Reset bearing"
        >
          🧭
        </button>
        <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />
        <button
          onClick={toggleFullscreen}
          style={{
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', background: 'transparent', borderRadius: '10px', cursor: 'pointer',
            color: 'var(--text-primary)', fontSize: '16px',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface-3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          title="Toggle fullscreen"
        >
          ⛶
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 26 }}
        className="glass"
        style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          padding: '7px 20px', borderRadius: '12px', zIndex: 20,
          display: 'flex', alignItems: 'center', gap: '16px',
          fontSize: '11px', color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
        }}
      >
        <div className="data-value" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Lat:</span>
          <span>{cursorCoords.lat}</span>
        </div>
        <div className="data-value" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Lng:</span>
          <span>{cursorCoords.lng}</span>
        </div>
        <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
        <div className="data-value" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Zoom:</span>
          <span>{currentZoom}</span>
        </div>
        <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Layers:</span>
          <span className="data-value" style={{ fontWeight: 600, color: activeLayerCount > 0 ? 'var(--accent-navy)' : 'var(--text-muted)' }}>{activeLayerCount}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedMapAsset && activeAssetDetails && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-card"
            style={{ position: 'absolute', top: 24, right: 24, bottom: 24, width: '400px', display: 'flex', flexDirection: 'column', zIndex: 20, overflow: 'hidden' }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="micro-label" style={{ color: 'var(--accent-navy)' }}>{activeAssetDetails.type}</span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>{activeAssetDetails.name}</h2>
              </div>
              <button onClick={() => setSelectedMapAsset(null)} style={{ background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="hide-scrollbar">

              {assetLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
                  <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                  <div className="skeleton" style={{ height: '11px', width: '40%' }} />
                  <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: '12px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                  <div className="skeleton" style={{ height: '100px', width: '100%', borderRadius: '12px' }} />
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {Object.keys(activeAssetDetails).filter(k => !['type', 'name', 'coordinates'].includes(k)).map(key => (
                      <div key={key}>
                        <div className="micro-label">{key}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{activeAssetDetails[key]}</div>
                      </div>
                    ))}
                  </div>

                  <hr className="divider" />

                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Operational Telemetry</h3>
                    <div style={{ height: '220px', padding: '16px', background: 'var(--bg-surface-2)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={telemetryData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Line type="monotone" dataKey="load" stroke="var(--accent-navy)" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="usage" stroke="var(--accent-teal)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <hr className="divider" />

                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Nearby Assets</h3>
                    {getNearbyAssets().length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {getNearbyAssets().map(asset => (
                          <button
                            key={asset.name}
                            onClick={() => {
                              setSelectedMapAsset(asset.name);
                              setActiveAssetDetails(asset);
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '10px 12px', borderRadius: '10px',
                              background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)',
                              cursor: 'pointer', transition: 'all 150ms ease', width: '100%',
                              textAlign: 'left',
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</div>
                              <div className="micro-label" style={{ marginTop: '2px' }}>{asset.type}</div>
                            </div>
                            <div className="data-value" style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>
                              {asset.distance < 1000 ? `${Math.round(asset.distance)}m` : `${(asset.distance / 1000).toFixed(1)}km`}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', background: 'var(--bg-surface-2)', borderRadius: '10px' }}>
                        No nearby assets found
                      </div>
                    )}
                  </div>

                  <hr className="divider" />

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, var(--accent-navy-light), rgba(219,225,255,0.5))',
                      borderRadius: '16px',
                      border: '1px solid var(--border-accent)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: 'var(--accent-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px',
                      }}>🤖</span>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-navy)' }}>AI Optimization Analysis</span>
                        <div className="live-dot" style={{ fontSize: '10px', color: 'var(--accent-teal)', fontWeight: 600 }}>Live</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                      Asset is performing within nominal parameters. Predictive modeling suggests a 14% increase in utilization during Q3 due to regional zoning changes.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                      {[
                        { label: 'Efficiency', value: '94%', color: 'var(--accent-teal)' },
                        { label: 'Uptime', value: '99.8%', color: 'var(--accent-teal)' },
                        { label: 'Predicted Load', value: '+14%', color: 'var(--accent-amber)' },
                        { label: 'Risk Score', value: 'Low', color: 'var(--accent-teal)' },
                      ].map(metric => (
                        <div key={metric.label} style={{
                          padding: '10px', borderRadius: '10px',
                          background: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.8)',
                        }}>
                          <div className="micro-label" style={{ marginBottom: '4px' }}>{metric.label}</div>
                          <div className="data-value" style={{ fontSize: '18px', fontWeight: 700, color: metric.color }}>{metric.value}</div>
                        </div>
                      ))}
                    </div>

                    <button className="btn-primary" style={{ width: '100%', fontSize: '13px', fontWeight: 600 }}>
                      <span>Generate Drilldown Report</span>
                      <span style={{ fontSize: '14px' }}>→</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
