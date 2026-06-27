"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useCityDataStore, useUIStore, useDisasterStore } from '@/stores';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShieldAlert, Zap, TrendingUp, TrendingDown, Layers, MapPin, CheckCircle2, Activity, ShieldCheck, ThermometerSun, Droplets, Brain } from 'lucide-react';

const TakeActionDrawer = dynamic(() => import('@/components/ui/TakeActionDrawer').then(m => ({ default: m.TakeActionDrawer })), { ssr: false });

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: springTransition }
};

// ===== INCIDENT STREAM =====
const ALERT_ITEMS = [
  { type: 'critical', msg: 'Grid overload — Electronic City Substation #11', val: '4.1 GW peak', time: 'Now' },
  { type: 'warning', msg: 'Congestion +34% — Silk Board Corridor', val: '8 km/h', time: '3m ago' },
  { type: 'warning', msg: 'AQI 168 — Whitefield Industrial Zone', val: 'PM2.5 elev', time: '7m ago' },
  { type: 'info', msg: 'Metro Line 3 Phase 1 on schedule', val: 'On Track', time: '15m ago' },
  { type: 'info', msg: 'Cauvery Stage 5 pumping resumed', val: '+120 MLD', time: '22m ago' },
];

function IncidentStream() {
  return (
    <div className="bg-white border border-[var(--slate-200)] rounded-xl flex flex-col overflow-hidden shadow-sm h-full">
      <div className="bg-[var(--slate-50)] border-b border-[var(--slate-200)] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-[var(--accent-red)]" />
          <span className="text-xs font-bold text-[var(--slate-700)] uppercase tracking-wider">Live Incident Stream</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse" />
          <span className="text-[10px] font-bold text-[var(--accent-red)] uppercase">Live</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {ALERT_ITEMS.map((item, i) => (
          <div key={i} className={`p-3 rounded-lg border-l-4 ${item.type === 'critical' ? 'border-[var(--accent-red)] bg-[var(--accent-red)]/5' : item.type === 'warning' ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)]/5' : 'border-[var(--accent-blue)] bg-[var(--slate-50)]'} flex flex-col gap-1`}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[var(--slate-800)] leading-tight">{item.msg}</span>
              <span className="text-[9px] text-[var(--slate-500)] whitespace-nowrap ml-2">{item.time}</span>
            </div>
            <span className={`text-[10px] font-semibold ${item.type === 'critical' ? 'text-[var(--accent-red)]' : item.type === 'warning' ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-blue)]'}`}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== SYSTEM STATUS BOARDS =====
function SystemStatusBoard({ metrics }: { metrics: any }) {
  return (
    <div className="bg-white border border-[var(--slate-200)] rounded-xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={14} className="text-[var(--accent-blue)]" />
        <span className="text-xs font-bold text-[var(--slate-700)] uppercase tracking-wider">System Status Boards</span>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1">
        
        {/* Traffic Status */}
        <div className="p-3 rounded-lg border border-[var(--slate-200)] bg-[var(--slate-50)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-[var(--slate-500)] uppercase">Transport</span>
            <TrendingUp size={12} className="text-[var(--accent-amber)]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--slate-900)]">{metrics.congestionIndex}%</div>
            <div className="text-[10px] text-[var(--slate-500)] mt-1">Congestion (Elevated)</div>
          </div>
        </div>

        {/* Energy Status */}
        <div className="p-3 rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-[var(--accent-red)] uppercase">Grid Load</span>
            <Zap size={12} className="text-[var(--accent-red)]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--accent-red)]">{metrics.gridLoad.toFixed(1)} GW</div>
            <div className="text-[10px] text-[var(--accent-red)] mt-1">Peak Demand Warning</div>
          </div>
        </div>

        {/* Environment Status */}
        <div className="p-3 rounded-lg border border-[var(--slate-200)] bg-[var(--slate-50)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-[var(--slate-500)] uppercase">Air Quality</span>
            <ThermometerSun size={12} className="text-[var(--accent-amber)]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--slate-900)]">{metrics.aqi}</div>
            <div className="text-[10px] text-[var(--slate-500)] mt-1">AQI (Moderate)</div>
          </div>
        </div>

        {/* Water Status */}
        <div className="p-3 rounded-lg border border-[var(--accent-teal)]/30 bg-[var(--accent-teal)]/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-[var(--accent-teal)] uppercase">Water Supply</span>
            <Droplets size={12} className="text-[var(--accent-teal)]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--accent-teal)]">Nominal</div>
            <div className="text-[10px] text-[var(--accent-teal)] mt-1">Reservoirs at 78%</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
export default function OverviewPage() {
  const cityData = useCityDataStore();
  const { openTakeAction } = useUIStore();
  const disasters = useDisasterStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const metrics = cityData.metrics;

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
        zoom: 12,
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
              'fill-extrusion-color': '#f1f5f9',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.8
            }
          });
        }
      });
    });

    return () => { if (map) map.remove(); };
  }, []);

  return (
    <motion.div
      className="flex flex-col h-full bg-[var(--slate-100)] p-4 overflow-hidden"
      variants={containerVariants} initial="hidden" animate="visible"
    >
      
      {/* Top Header Bar */}
      <motion.div variants={itemVariants} className="bg-white border border-[var(--slate-200)] rounded-xl p-4 flex justify-between items-center mb-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-[var(--slate-900)] text-white p-2.5 rounded-lg shadow-md">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--slate-900)] leading-tight tracking-tight">Urban Command Center</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse" />
              <span className="text-[11px] font-semibold text-[var(--slate-500)] uppercase tracking-wider">System Active — Bengaluru Urban</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right border-r border-[var(--slate-200)] pr-4">
            <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1">Overall Health</div>
            <div className="text-2xl font-bold text-[var(--accent-teal)] leading-none">{metrics.cityHealthScore}/100</div>
          </div>
          <button onClick={openTakeAction} className="btn-danger shadow-md px-6 py-2.5">
            Resolve {metrics.activeIncidents} Active Alerts
          </button>
        </div>
      </motion.div>

      {/* Main Split: 60% Map / 40% Intel */}
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* 60% MAP CONTAINER */}
        <motion.div variants={itemVariants} className="flex-[6] bg-white border border-[var(--slate-200)] rounded-xl relative overflow-hidden shadow-sm flex flex-col">
          
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md border border-[var(--slate-200)] text-[var(--slate-700)] text-xs font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2">
              <Layers size={14} className="text-[var(--accent-blue)]" /> Map Layers
            </div>
          </div>

          <div className="flex-1 w-full h-full relative">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--slate-50)] z-10">
                <span className="text-[var(--slate-500)] text-xs font-semibold uppercase tracking-wider">Loading Infrastructure Map...</span>
              </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          <div className="bg-white border-t border-[var(--slate-200)] p-3 flex justify-between items-center">
            <div className="flex gap-4 text-xs font-semibold text-[var(--slate-600)]">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--accent-blue)]" /> Tracked Assets: 42,109</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[var(--accent-teal)]" /> Sensor Network: 99.8% Uptime</span>
            </div>
            <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Live GIS Feed</span>
          </div>

        </motion.div>

        {/* 40% INTELLIGENCE PANELS */}
        <motion.div variants={itemVariants} className="flex-[4] flex flex-col gap-4 min-h-0 overflow-y-auto hide-scrollbar">
          
          {/* Status Boards */}
          <div className="shrink-0 h-48">
            <SystemStatusBoard metrics={metrics} />
          </div>

          {/* Infrastructure Alerts Stream */}
          <div className="flex-1 min-h-[300px]">
            <IncidentStream />
          </div>

          {/* AI Intelligence Widget */}
          <div className="shrink-0 bg-[var(--slate-900)] text-white rounded-xl p-5 shadow-lg border border-[var(--slate-800)] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--accent-blue)]/20 blur-2xl rounded-full" />
            <div className="flex justify-between items-start mb-3">
              <div className="text-[10px] font-bold text-[var(--accent-blue-light)] uppercase tracking-widest flex items-center gap-2">
                <Brain size={12} /> Proactive AI Insight
              </div>
              <span className="bg-[var(--accent-teal)]/20 text-[var(--accent-teal)] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">92% Confidence</span>
            </div>
            <h3 className="text-sm font-bold mb-2">Automated Rerouting Recommended</h3>
            <p className="text-xs text-[var(--slate-300)] mb-4 leading-relaxed">
              Anomaly detected in traffic patterns at Silk Board. Immediate signal cycle sync will prevent gridlock.
            </p>
            <button onClick={openTakeAction} className="w-full py-2 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
              Execute Protocol
            </button>
          </div>

        </motion.div>

      </div>
      <TakeActionDrawer />
    </motion.div>
  );
}
