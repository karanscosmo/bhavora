"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCityDataStore, useSimulationStore, useUIStore, useAppStore, useDisasterStore } from '@/stores';
import { generateSeededMetrics } from '@/lib/simulation';
import { exportToPDF } from '@/lib/exportUtils';
import { TakeActionDrawer } from '@/components/ui/TakeActionDrawer';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ===== ALERT TICKER =====
const ALERT_ITEMS = [
  { type: 'critical', msg: '⚠ Grid overload — Electronic City Substation #11 — 4.1 GW peak demand', time: 'Now' },
  { type: 'warning', msg: '↑ Congestion +34% — Silk Board Corridor — Speed: 8 km/h', time: '3m ago' },
  { type: 'warning', msg: '↑ AQI 168 — Whitefield Industrial Zone — PM2.5 elevated', time: '7m ago' },
  { type: 'info', msg: '✓ Metro Line 3 Phase 1 on schedule — Nagawara to Gottigere', time: '15m ago' },
  { type: 'info', msg: '✓ Cauvery Stage 5 pumping resumed — +120 MLD capacity added', time: '22m ago' },
  { type: 'critical', msg: '⚠ Bellandur waterlogging detected — 3,200 residents affected', time: '28m ago' },
];

function AlertTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(5,10,20,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        width: '80px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'live-pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#EF4444' }}>Alerts</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          animation: paused ? 'none' : 'ticker-scroll 30s linear infinite',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}>
          {[...ALERT_ITEMS, ...ALERT_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontSize: '11px',
              color: item.type === 'critical' ? '#EF4444' : item.type === 'warning' ? '#F59E0B' : 'rgba(255,255,255,0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}>
              {item.msg}
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>{item.time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== KPI SPARKLINE =====
function Sparkline({ data, color = '#00D4FF' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 28, w = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="2.5" fill={color} />
    </svg>
  );
}

// ===== KPI CARD =====
interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaColor?: string;
  status?: 'green' | 'amber' | 'red';
  sparkData?: number[];
  sparkColor?: string;
}

function KPICard({ label, value, unit, delta, deltaColor, status = 'green', sparkData, sparkColor }: KPICardProps) {
  return (
    <div className="glass-card" style={{ padding: '14px 16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: status === 'green' ? '#10B981' : status === 'amber' ? '#F59E0B' : '#EF4444',
          boxShadow: `0 0 6px ${status === 'green' ? 'rgba(16,185,129,0.5)' : status === 'amber' ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}`,
          flexShrink: 0,
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, color: '#00D4FF', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{unit}</span>}
      </div>
      {delta && (
        <span style={{ fontSize: '10px', color: deltaColor || 'rgba(255,255,255,0.4)' }}>{delta}</span>
      )}
      {sparkData && <Sparkline data={sparkData} color={sparkColor || '#00D4FF'} />}
    </div>
  );
}

// ===== AI FEED ITEM =====
function AIFeedItem({ time, category, text, onView }: { time: string; category: string; text: string; onView: () => void }) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'rgba(0,212,255,0.08)',
        border: '1px solid rgba(0,212,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
      }}>🧠</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{category}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{time}</span>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{text}</p>
        <button onClick={onView} style={{ background: 'none', border: 'none', color: '#00D4FF', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: '4px 0 0', display: 'flex', alignItems: 'center', gap: '3px' }}>
          View analysis →
        </button>
      </div>
    </div>
  );
}

// ===== MAIN DASHBOARD PAGE =====
export default function OverviewPage() {
  const cityData = useCityDataStore();
  const sim = useSimulationStore();
  const { openTakeAction, isTakeActionOpen } = useUIStore();
  const { addNotification } = useAppStore();
  const disasters = useDisasterStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [exporting, setExporting] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'incidents' | 'resources'>('traffic');

  // Seeded historical data
  const hist = useMemo(() => ({
    traffic: generateSeededMetrics(101, 24, 67, 12),
    aqi: generateSeededMetrics(102, 24, 142, 20),
    energy: generateSeededMetrics(103, 24, 4.1, 0.4),
    water: generateSeededMetrics(104, 24, 1800, 80),
    health: generateSeededMetrics(105, 24, 64, 5),
    metro: generateSeededMetrics(106, 24, 91, 4),
  }), []);

  const chartData = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      Traffic: hist.traffic[i],
      AQI: hist.aqi[i],
      Energy: hist.energy[i],
    })), [hist]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Mapbox
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
        zoom: 10.5,
        pitch: 35,
        attributionControl: false,
      });
      mapRef.current = map;

      map.on('load', () => {
        if (!map) return;
        setMapLoaded(true);

        // Metro stations heatmap (real OSM data approximation)
        fetch('/data/metro_stations.geojson')
          .then(r => r.json())
          .then(data => {
            if (!map) return;
            if (!map.getSource('metro-heat')) {
              map.addSource('metro-heat', { type: 'geojson', data });
              map.addLayer({
                id: 'metro-heat-layer',
                type: 'heatmap',
                source: 'metro-heat',
                maxzoom: 15,
                paint: {
                  'heatmap-intensity': 1.2,
                  'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
                    0, 'rgba(0,0,0,0)',
                    0.2, 'rgba(0,212,255,0.3)',
                    0.6, 'rgba(124,58,237,0.7)',
                    1, 'rgba(0,212,255,0.9)',
                  ],
                  'heatmap-radius': 28,
                  'heatmap-opacity': 0.75,
                },
              });
              map.addLayer({
                id: 'metro-points',
                type: 'circle',
                source: 'metro-heat',
                minzoom: 12,
                paint: {
                  'circle-radius': 5,
                  'circle-color': '#00D4FF',
                  'circle-stroke-width': 1.5,
                  'circle-stroke-color': '#fff',
                },
              });
            }
          })
          .catch(() => {
            // If GeoJSON not found, add seeded incident markers
            if (!map) return;
          });

        // Active incidents — pulsing markers
        disasters.activeIncidents.forEach(incident => {
          const el = document.createElement('div');
          el.style.cssText = `
            width:18px;height:18px;border-radius:50%;
            background:rgba(239,68,68,0.8);border:2px solid #EF4444;
            animation:live-pulse 1.5s ease-in-out infinite;
            cursor:pointer;
          `;
          new mapboxgl.Marker(el)
            .setLngLat(incident.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`
              <div style="background:#0A1628;border:1px solid rgba(239,68,68,0.4);border-radius:8px;padding:10px;min-width:200px;font-family:Inter,sans-serif;">
                <div style="font-size:10px;color:#EF4444;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">ACTIVE INCIDENT</div>
                <div style="font-size:13px;color:#fff;font-weight:600;margin-bottom:4px">${incident.name}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5)">${incident.location}</div>
                ${incident.affectedCount ? `<div style="font-size:11px;color:#F59E0B;margin-top:6px">⚠ ${incident.affectedCount.toLocaleString()} affected</div>` : ''}
              </div>
            `))
            .addTo(map!);
        });
      });
    });

    return () => { if (map) map.remove(); };
  }, []);

  const metrics = cityData.metrics;
  const cityHealth = metrics.cityHealthScore;
  const healthColor = cityHealth >= 75 ? '#10B981' : cityHealth >= 55 ? '#F59E0B' : '#EF4444';
  const healthLabel = cityHealth >= 75 ? 'Good' : cityHealth >= 55 ? 'Moderate' : 'At Risk';

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPDF('command-center-content', `Bhavora_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
      addNotification({ title: 'Report Exported', message: 'Dashboard PDF saved successfully', severity: 'success' });
    } catch {
      addNotification({ title: 'Export Failed', message: 'Could not generate PDF — try again', severity: 'critical' });
    }
    setExporting(false);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Alert Ticker */}
      <AlertTicker />

      <div id="command-center-content" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1600px', margin: '0 auto' }}>

        {/* ===== HERO STATUS BAR ===== */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card"
          style={{ padding: '16px 24px', borderRadius: '12px', background: 'rgba(10,22,40,0.85)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {/* Left: City name + live */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  Bengaluru Urban Intelligence Center
                </span>
                <span className="live-dot" style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{currentTime} IST</div>
            </div>

            {/* Center: Key metrics */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'City Health', value: `${cityHealth}/100`, color: healthColor, sublabel: healthLabel },
                { label: 'AQI', value: metrics.aqi, color: metrics.aqi > 150 ? '#EF4444' : metrics.aqi > 100 ? '#F59E0B' : '#10B981', sublabel: metrics.aqi > 150 ? 'Unhealthy' : metrics.aqi > 100 ? 'Moderate' : 'Good' },
                { label: 'Traffic', value: `${metrics.congestionIndex}%`, color: metrics.congestionIndex > 75 ? '#EF4444' : metrics.congestionIndex > 55 ? '#F59E0B' : '#10B981', sublabel: metrics.congestionIndex > 75 ? 'Heavy' : 'Moderate' },
                { label: 'Grid Load', value: `${metrics.gridLoad.toFixed(1)} GW`, color: metrics.gridLoad > 4.5 ? '#EF4444' : '#00D4FF', sublabel: 'Stable' },
                { label: 'Water', value: `${metrics.waterDemand.toLocaleString()} MLD`, color: '#00D4FF', sublabel: 'Stress' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>{m.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{m.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={openTakeAction}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(245,158,11,0.15))',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '8px',
                  color: '#F59E0B',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  animation: metrics.activeIncidents > 0 ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                }}
              >
                ⚠ {metrics.activeIncidents} Active Alerts
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                style={{
                  padding: '8px 14px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  opacity: exporting ? 0.5 : 1,
                }}
              >
                {exporting ? 'Exporting...' : '⬇ Export PDF'}
              </button>
            </div>
          </div>

          {/* Health bar */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>City Health Score</span>
              <span style={{ fontSize: '9px', color: healthColor, fontWeight: 600 }}>{healthLabel.toUpperCase()}</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${cityHealth}%`, background: `linear-gradient(90deg, ${healthColor}80, ${healthColor})`, borderRadius: '2px', transition: 'width 600ms ease' }} />
            </div>
          </div>
        </motion.div>

        {/* ===== MAP + KPI GRID ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', height: '460px' }}>
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
            style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
          >
            {!mapLoaded && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050A14', zIndex: 5 }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Loading Bengaluru map...</div>
                </div>
              </div>
            )}
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Map layer toggle */}
            <div style={{
              position: 'absolute', top: '12px', left: '12px', zIndex: 10,
              display: 'flex', gap: '4px',
            }}>
              {(['traffic', 'incidents', 'resources'] as const).map(layer => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  style={{
                    padding: '5px 10px', borderRadius: '20px',
                    background: activeLayer === layer ? 'rgba(0,212,255,0.9)' : 'rgba(5,10,20,0.85)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    color: activeLayer === layer ? '#050A14' : 'rgba(255,255,255,0.7)',
                    fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                    textTransform: 'capitalize', letterSpacing: '0.04em',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {layer}
                </button>
              ))}
            </div>

            {/* Timestamp */}
            <div style={{
              position: 'absolute', bottom: '12px', left: '12px', zIndex: 10,
              background: 'rgba(5,10,20,0.85)', borderRadius: '6px', padding: '5px 10px',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                Traffic data updated {Math.floor(Math.random() * 20 + 5)}s ago
              </span>
            </div>
          </motion.div>

          {/* KPI Panel */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <KPICard
              label="Congestion Index"
              value={metrics.congestionIndex}
              unit="%"
              delta={`↑ 4% vs yesterday`}
              deltaColor="#EF4444"
              status={metrics.congestionIndex > 75 ? 'red' : metrics.congestionIndex > 55 ? 'amber' : 'green'}
              sparkData={hist.traffic}
              sparkColor="#F59E0B"
            />
            <KPICard
              label="Air Quality (AQI)"
              value={metrics.aqi}
              delta={`↓ 8 pts vs last week`}
              deltaColor="#10B981"
              status={metrics.aqi > 150 ? 'red' : metrics.aqi > 100 ? 'amber' : 'green'}
              sparkData={hist.aqi}
              sparkColor="#7C3AED"
            />
            <KPICard
              label="Grid Load"
              value={metrics.gridLoad.toFixed(1)}
              unit=" GW"
              delta="Stable — 4.8 GW capacity"
              deltaColor="rgba(255,255,255,0.4)"
              status="amber"
              sparkData={hist.energy}
            />
            <KPICard
              label="Water Demand"
              value={metrics.waterDemand.toLocaleString()}
              unit=" MLD"
              delta="⚠ Gap: 350 MLD"
              deltaColor="#EF4444"
              status="red"
              sparkData={hist.water}
              sparkColor="#3B82F6"
            />
            <KPICard
              label="Metro Punctuality"
              value={metrics.metroPunctuality}
              unit="%"
              delta="↑ 2% vs last month"
              deltaColor="#10B981"
              status="green"
              sparkData={hist.metro}
              sparkColor="#10B981"
            />
            <KPICard
              label="Active Incidents"
              value={metrics.activeIncidents}
              delta={`${disasters.activeIncidents.filter(i => i.severity === 'critical').length} critical`}
              deltaColor="#EF4444"
              status={metrics.activeIncidents > 5 ? 'red' : metrics.activeIncidents > 2 ? 'amber' : 'green'}
            />
          </motion.div>
        </div>

        {/* ===== CHARTS + AI FEED ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px' }}>
          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ padding: '20px', borderRadius: '12px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>24h City Performance</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Traffic · AQI · Energy — seeded from city baseline</div>
              </div>
              <Link href="/analytics" style={{ fontSize: '11px', color: '#00D4FF', fontWeight: 600, textDecoration: 'none' }}>View Full Analytics →</Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                />
                <Line type="monotone" dataKey="Traffic" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="AQI" stroke="#7C3AED" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Energy" stroke="#00D4FF" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {[{ label: 'Traffic %', color: '#F59E0B' }, { label: 'AQI', color: '#7C3AED' }, { label: 'Energy GW', color: '#00D4FF' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '20px', height: '2px', background: l.color, borderRadius: '1px' }} />
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Intelligence Feed */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card"
            style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>AI Intelligence Feed</div>
              <Link href="/insights" style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 600, textDecoration: 'none' }}>All Insights →</Link>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '320px' }}>
              <AIFeedItem
                time="Just now"
                category="Energy · Critical"
                text="Substation #11 in Electronic City is at 87% capacity. Projected to exceed 95% by Q3 2025 if load growth continues at current rate. Recommend immediate inspection."
                onView={() => {}}
              />
              <AIFeedItem
                time="8m ago"
                category="Transport · Warning"
                text="Silk Board corridor showing 34% congestion increase. Signal optimization at 6 intersections could reduce average delay by 4 minutes per vehicle."
                onView={() => {}}
              />
              <AIFeedItem
                time="22m ago"
                category="Water · Alert"
                text="Bellandur catchment groundwater levels down 2.3m since January. Eastern Bengaluru water demand-supply gap projected to reach 470 MLD by 2027."
                onView={() => {}}
              />
              <AIFeedItem
                time="45m ago"
                category="Air Quality · Moderate"
                text="AQI improvement of 12 points logged after Outer Ring Road construction dust suppression measures activated. Continue protocol for 30-day sustained improvement."
                onView={() => {}}
              />
              <AIFeedItem
                time="1h ago"
                category="Infrastructure · Info"
                text="Metro ridership up 8% week-over-week. Hebbal–Nagawara corridor operating at 112% planned capacity. Recommend frequency increase on Purple Line."
                onView={() => {}}
              />
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={openTakeAction}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.08))',
                  border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: '8px',
                  color: '#00D4FF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                ⚡ View AI Interventions ({metrics.activeIncidents + 3} recommended)
              </button>
            </div>
          </motion.div>
        </div>

        {/* ===== QUICK NAV ===== */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}
        >
          {[
            { icon: '🏙', name: 'City Twin', sub: '10 GIS layers', href: '/cities', color: '#00D4FF' },
            { icon: '⚙', name: 'Decision Twin', sub: `${sim.activeScenarioName || 'No active scenario'}`, href: '/decision-twin', color: '#7C3AED' },
            { icon: '⚠', name: 'Disaster Command', sub: `${metrics.activeIncidents} active`, href: '/disaster', color: '#EF4444' },
            { icon: '🧠', name: 'AI Insights', sub: '12 new insights', href: '/insights', color: '#10B981' },
            { icon: '📊', name: 'Analytics Suite', sub: '6 chart types', href: '/analytics', color: '#F59E0B' },
          ].map(card => (
            <Link key={card.name} href={card.href} style={{ textDecoration: 'none' }}>
              <div
                className="glass-card"
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{card.icon}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{card.name}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{card.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Take Action Drawer */}
      <TakeActionDrawer />
    </div>
  );
}
