"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useCityDataStore, useUIStore, useDisasterStore } from '@/stores';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ShieldAlert, Zap, TrendingUp, TrendingDown, Layers, MapPin, CheckCircle2, Activity, ShieldCheck, ThermometerSun, Droplets, Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StartDemoButton } from '@/components/demo/StartDemoButton';

const TakeActionDrawer = dynamic(() => import('@/components/ui/TakeActionDrawer').then(m => ({ default: m.TakeActionDrawer })), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function OverviewPage() {
  const cityData = useCityDataStore();
  const { openTakeAction, openBhavishyavani } = useUIStore();
  const disasters = useDisasterStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const metrics = cityData.metrics;
  const history = cityData.historicalData;

  const trendData = history.traffic.map((t, i) => ({
    time: `${i}:00`,
    Traffic: t,
    AQI: history.aqi[i],
    Energy: history.energy[i]
  }));

  useEffect(() => {
    let map: MapboxMap | null = null;
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ['pk.eyJ1IjoibWFwYm94', 'IiwiYSI6ImNpejY4M29iNDAwMGl2Z2w4', 'Z2ZrdzcwcmMifQ.L_zuuwNGjwBDoGGRQo8gHg'].join('');
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
      className="flex flex-col h-full bg-[var(--bg-base)] overflow-y-auto"
      variants={containerVariants} initial="hidden" animate="visible"
    >
      <div className="p-6 max-w-screen-2xl mx-auto w-full space-y-6">
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Executive Command Center</h1>
            <p className="text-sm text-[var(--text-secondary)]">Bengaluru Urban Unified Dashboard</p>
          </div>
          <div className="flex gap-3 items-center">
            <StartDemoButton variant="hero" />
            <button data-demo="summon-bhavishyavani" onClick={() => openBhavishyavani('executive')} className="btn btn-secondary flex items-center gap-2">
              <Brain size={16} className="text-[#2563EB]" /> Bhavishyavani
            </button>
            <button onClick={openTakeAction} className="btn-danger flex items-center gap-2">
              <ShieldAlert size={16} /> {metrics.activeIncidents} Alerts
            </button>
          </div>
        </div>

        {/* TOP: Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <motion.div variants={itemVariants} data-demo="metric-city-health" className="card p-4 border-l-4 border-[#10B981]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">City Health</div>
            <div className="text-2xl font-bold text-[#10B981]">{metrics.cityHealthScore}/100</div>
          </motion.div>
          <motion.div variants={itemVariants} data-demo="metric-aqi" className="card p-4 border-l-4 border-[#F59E0B]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">AQI</div>
            <div className="text-2xl font-bold text-[#F59E0B]">{metrics.aqi}</div>
          </motion.div>
          <motion.div variants={itemVariants} data-demo="metric-traffic" className="card p-4 border-l-4 border-[#EF4444]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Traffic</div>
            <div className="text-2xl font-bold text-[#EF4444]">{metrics.congestionIndex}%</div>
          </motion.div>
          <motion.div variants={itemVariants} data-demo="metric-grid" className="card p-4 border-l-4 border-[#F59E0B]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Grid Load</div>
            <div className="text-2xl font-bold text-[#F59E0B]">{metrics.gridLoad.toFixed(1)}GW</div>
          </motion.div>
          <motion.div variants={itemVariants} className="card p-4 border-l-4 border-[#2563EB]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Water Capacity</div>
            <div className="text-2xl font-bold text-[#2563EB]">78%</div>
          </motion.div>
          <motion.div variants={itemVariants} className="card p-4 border-l-4 border-[#EF4444]">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Incidents</div>
            <div className="text-2xl font-bold text-[#EF4444]">{metrics.activeIncidents}</div>
          </motion.div>
        </div>

        {/* CENTER: Main Map */}
        <motion.div variants={itemVariants} data-demo="main-map" className="card p-2 h-[500px] relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2">
              <Layers size={14} className="text-[#2563EB]" /> Live Telemetry
            </div>
          </div>
          <div className="flex-1 w-full h-full relative rounded-lg overflow-hidden border border-[var(--border-subtle)]">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface-2)] z-10">
                <span className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">Loading Digital Twin...</span>
              </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </motion.div>

        {/* BOTTOM: Trends & Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          
          <motion.div variants={itemVariants} className="card p-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[#2563EB]"/> 24h Traffic & Environmental Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                    labelStyle={{ color: 'var(--text-muted)', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="Traffic" stroke="#EF4444" fillOpacity={1} fill="url(#colorTraffic)" />
                  <Area type="monotone" dataKey="AQI" stroke="#F59E0B" fillOpacity={1} fill="url(#colorAQI)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Zap size={16} className="text-[#2563EB]"/> Infrastructure Load Profile
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={[3.5, 4.5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                    labelStyle={{ color: 'var(--text-muted)', fontSize: '12px' }}
                  />
                  <Area type="step" dataKey="Energy" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

      </div>
      <TakeActionDrawer />
    </motion.div>
  );
}
