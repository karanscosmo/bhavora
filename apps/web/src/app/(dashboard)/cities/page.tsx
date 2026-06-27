"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useMapStore, useUIStore } from '@/stores';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers, MapPin, Maximize, Navigation, Minus, Plus, Search, ChevronDown, ChevronUp, CheckCircle2, ShieldAlert } from 'lucide-react';

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
  { color: 'var(--accent-navy)', shape: 'circle', label: 'EV Charging Stations' },
  { color: 'var(--accent-teal)', shape: 'diamond', label: 'Tech Parks' },
  { color: 'var(--accent-amber)', shape: 'diamond', label: 'Bus Depots' },
  { color: 'var(--accent-violet)', shape: 'square', label: 'Industrial Zones' },
  { color: 'var(--accent-red)', shape: 'circle', label: 'Flood Risk Zones', animated: true },
  { color: 'rgba(0,0,0,0.1)', shape: 'building', label: '3D Extruded Buildings' },
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
              'fill-extrusion-color': '#f8f9ff',
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
          el.style.cssText = 'width:14px;height:14px;border-radius:50%;background:var(--accent-navy);border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;';
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
          el.style.cssText = 'width:16px;height:16px;transform:rotate(45deg);background:var(--accent-teal);border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;';
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
          el.style.cssText = 'width:20px;height:20px;border-radius:50%;background:rgba(186,26,26,0.6);border:2px solid var(--accent-red);animation:live-pulse 2s infinite;cursor:pointer;';
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

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-50)]">
      
      {/* Mapbox Container */}
      <div className="absolute inset-0 z-0">
        {!mapLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--slate-100)]">
            <span className="text-[var(--slate-500)] text-sm font-bold uppercase tracking-widest animate-pulse">Loading City Twin Engine...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Main Control Panel (Left) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 w-[320px] max-h-[calc(100vh-140px)] bg-white/95 backdrop-blur-xl border border-[var(--slate-200)] rounded-2xl shadow-xl z-20 flex flex-col overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex bg-[var(--slate-100)] p-1.5 gap-1 border-b border-[var(--slate-200)] shrink-0">
          {(['layers', 'legend'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setPanelTab(tab)}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                panelTab === tab ? 'bg-white text-[var(--slate-900)] shadow-sm' : 'text-[var(--slate-500)] hover:text-[var(--slate-800)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {panelTab === 'layers' ? (
          <>
            <div className="p-3 border-b border-[var(--slate-200)] shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate-400)]" />
                <input
                  type="text"
                  placeholder="Search layers..."
                  value={layerSearch}
                  onChange={e => setLayerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-lg text-sm text-[var(--slate-800)] placeholder-[var(--slate-400)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {Object.entries(groupedLayers).map(([groupName, groupLayers]) => (
                groupLayers.length > 0 && (
                  <div key={groupName} className="mb-4 last:mb-0">
                    <button
                      onClick={() => setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))}
                      className="flex items-center justify-between w-full pb-2 mb-2 border-b border-[var(--slate-200)] group"
                    >
                      <span className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest group-hover:text-[var(--slate-800)] transition-colors">
                        {groupName} Layers
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--slate-400)]">{groupLayers.length}</span>
                        {expandedGroups[groupName] ? <ChevronUp size={12} className="text-[var(--slate-400)]" /> : <ChevronDown size={12} className="text-[var(--slate-400)]" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedGroups[groupName] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col gap-2 overflow-hidden"
                        >
                          {groupLayers.map(layer => (
                            <label key={layer.id} className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                              layer.enabled ? 'bg-[var(--accent-blue)]/5 border-[var(--accent-blue)]/30' : 'bg-transparent border-transparent hover:bg-[var(--slate-50)]'
                            }`}>
                              <div className="flex items-center gap-3">
                                <span className="text-base">{layer.icon}</span>
                                <span className={`text-sm ${layer.enabled ? 'font-bold text-[var(--accent-blue)]' : 'font-medium text-[var(--slate-700)]'}`}>
                                  {layer.name}
                                </span>
                              </div>
                              <div className={`w-9 h-5 rounded-full relative transition-colors ${layer.enabled ? 'bg-[var(--accent-blue)]' : 'bg-[var(--slate-300)]'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${layer.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                              </div>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              ))}
            </div>
            
            {/* Opacity slider */}
            <div className="p-4 bg-[var(--slate-50)] border-t border-[var(--slate-200)] shrink-0">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-[var(--slate-600)] uppercase tracking-wider">Layer Opacity</span>
                 <span className="text-xs font-bold text-[var(--accent-blue)]">{Math.round(layerOpacity)}%</span>
               </div>
               <input
                 type="range" min="0" max="100" step="1"
                 value={layerOpacity} onChange={e => setLayerOpacity(Number(e.target.value))}
                 className="w-full accent-[var(--accent-blue)]"
               />
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <h3 className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Symbology</h3>
            <div className="flex flex-col gap-4">
              {LEGEND_ITEMS.map(item => (
                <div key={item.label} className="flex items-center gap-4 p-2 rounded-lg hover:bg-[var(--slate-50)] transition-colors">
                  <div className="w-8 flex justify-center shrink-0">
                    {item.shape === 'building' ? (
                      <div className="w-5 h-5 bg-[var(--slate-200)] border border-[var(--slate-300)] shadow-inner transform -skew-y-6" />
                    ) : (
                      <div className={`
                        ${item.shape === 'circle' ? 'w-4 h-4 rounded-full' : item.shape === 'diamond' ? 'w-3.5 h-3.5 rotate-45' : 'w-4 h-4 rounded-sm'}
                        ${item.animated ? 'animate-pulse' : ''}
                      `} style={{ background: item.color, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--slate-700)]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Map Tools Floating (Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 right-6 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-[var(--slate-200)] shadow-lg z-20"
      >
        <button onClick={() => mapRef.current?.zoomIn()} className="w-10 h-10 flex items-center justify-center text-[var(--slate-600)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 rounded-lg transition-colors">
          <Plus size={20} />
        </button>
        <div className="h-px w-full bg-[var(--slate-200)]" />
        <button onClick={() => mapRef.current?.zoomOut()} className="w-10 h-10 flex items-center justify-center text-[var(--slate-600)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 rounded-lg transition-colors">
          <Minus size={20} />
        </button>
        <div className="h-px w-full bg-[var(--slate-200)]" />
        <button onClick={() => mapRef.current?.flyTo({ bearing: 0, pitch: 0 })} className="w-10 h-10 flex items-center justify-center text-[var(--slate-600)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 rounded-lg transition-colors" title="Reset North">
          <Navigation size={18} />
        </button>
        <div className="h-px w-full bg-[var(--slate-200)]" />
        <button onClick={toggleFullscreen} className="w-10 h-10 flex items-center justify-center text-[var(--slate-600)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 rounded-lg transition-colors" title="Fullscreen">
          <Maximize size={18} />
        </button>
      </motion.div>

      {/* Status Bar (Bottom Center) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[var(--slate-200)] shadow-lg z-20"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase">Lat</span>
          <span className="text-xs font-bold text-[var(--slate-800)]">{cursorCoords.lat}</span>
        </div>
        <div className="w-px h-4 bg-[var(--slate-300)]" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase">Lng</span>
          <span className="text-xs font-bold text-[var(--slate-800)]">{cursorCoords.lng}</span>
        </div>
        <div className="w-px h-4 bg-[var(--slate-300)]" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase">Zoom</span>
          <span className="text-xs font-bold text-[var(--slate-800)]">{currentZoom}</span>
        </div>
        <div className="w-px h-4 bg-[var(--slate-300)]" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase">Active Layers</span>
          <span className="text-xs font-bold text-[var(--accent-blue)]">{activeLayerCount}</span>
        </div>
      </motion.div>

      {/* Basemap Switcher (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 left-6 flex bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-[var(--slate-200)] shadow-lg z-20"
      >
        {([
          { id: 'light', label: 'Light', preview: '#f8f9ff' },
          { id: 'dark', label: 'Dark', preview: '#1a1a2e' },
          { id: 'satellite', label: 'Sat', preview: '#2d4a3e' },
        ] as const).map(b => (
          <button
            key={b.id}
            onClick={() => setBasemap(b.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeBasemap === b.id ? 'bg-[var(--accent-blue)] text-white' : 'text-[var(--slate-600)] hover:bg-[var(--slate-100)]'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full border border-white/50`} style={{ background: b.preview }} />
            {b.label}
          </button>
        ))}
      </motion.div>

      {/* Asset Inspection Panel */}
      <AnimatePresence>
        {selectedMapAsset && activeAssetDetails && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
            className="absolute top-6 right-[88px] bottom-6 w-[420px] bg-white border border-[var(--slate-200)] shadow-2xl rounded-2xl z-30 flex flex-col overflow-hidden"
          >
            <div className="bg-[var(--slate-50)] p-5 border-b border-[var(--slate-200)] flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[var(--accent-blue)] uppercase tracking-widest">{activeAssetDetails.type}</span>
                <h2 className="text-xl font-bold text-[var(--slate-900)] mt-1">{activeAssetDetails.name}</h2>
              </div>
              <button onClick={() => setSelectedMapAsset(null)} className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--slate-200)] rounded-full text-[var(--slate-500)] hover:text-[var(--accent-red)] hover:border-[var(--accent-red)] transition-colors">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {assetLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-[var(--slate-200)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--slate-200)] rounded w-1/2" />
                  <div className="h-40 bg-[var(--slate-200)] rounded-xl w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(activeAssetDetails).filter(k => !['type', 'name', 'coordinates'].includes(k)).map(key => (
                      <div key={key} className="bg-[var(--slate-50)] border border-[var(--slate-100)] p-3 rounded-xl">
                        <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-wider">{key}</div>
                        <div className="text-sm font-bold text-[var(--slate-900)] mt-1">{activeAssetDetails[key]}</div>
                      </div>
                    ))}
                  </div>

                  {/* Telemetry Chart */}
                  <div>
                    <h3 className="text-xs font-bold text-[var(--slate-800)] uppercase tracking-widest mb-3">Live Telemetry</h3>
                    <div className="h-[200px] bg-white border border-[var(--slate-200)] rounded-xl p-4 shadow-sm">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={telemetryData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fill: 'var(--slate-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: 'var(--slate-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--slate-200)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="load" stroke="var(--accent-navy)" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="usage" stroke="var(--accent-teal)" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-[var(--slate-900)] p-5 rounded-xl text-white shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-blue)]/20 blur-2xl rounded-full" />
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={16} className="text-[var(--accent-teal)]" />
                      <span className="text-xs font-bold text-[var(--accent-teal)] uppercase tracking-widest">Asset Optimal</span>
                    </div>
                    <p className="text-sm text-[var(--slate-300)] leading-relaxed mb-4">
                      Current operation is within expected nominal boundaries. Predictive maintenance not required for next 14 days.
                    </p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/10">
                      Download Report
                    </button>
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
