"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useCityDataStore, useSimulationStore, useUIStore, useAppStore, useDisasterStore } from '@/stores';
import { generateSeededMetrics } from '@/lib/simulation';
import { exportToPDF } from '@/lib/exportUtils';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const TakeActionDrawer = dynamic(() => import('@/components/ui/TakeActionDrawer').then(m => ({ default: m.TakeActionDrawer })), { ssr: false });

// ===== Animation Variants =====
const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  }
};

const staggerFast = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  }
};

// ===== ALERT TICKER =====
const ALERT_ITEMS = [
  { type: 'critical', msg: '⚠ Grid overload — Electronic City Substation #11 — 4.1 GW peak demand', time: 'Now' },
  { type: 'warning', msg: '↑ Congestion +34% — Silk Board Corridor — Speed: 8 km/h', time: '3m ago' },
  { type: 'warning', msg: '↑ AQI 168 — Whitefield Industrial Zone — PM2.5 elevated', time: '7m ago' },
  { type: 'info', msg: '✓ Metro Line 3 Phase 1 on schedule — Nagawara to Gottigere', time: '15m ago' },
  { type: 'info', msg: '✓ Cauvery Stage 5 pumping resumed — +120 MLD capacity added', time: '22m ago' },
  { type: 'critical', msg: '⚠ Bellandur waterlogging detected — 3,200 residents affected', time: '28m ago' },
];

const severityDot: Record<string, string> = {
  critical: '#ba1a1a',
  warning: '#D97706',
  info: '#006242',
};

function AlertTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', overflow: 'hidden', marginBottom: '16px' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ flexShrink: 0, paddingRight: '20px', borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'live-pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-red)' }}>Live Alerts</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', marginLeft: '20px' }}>
        <div style={{
          display: 'flex', gap: '48px',
          animation: paused ? 'none' : 'ticker-scroll 40s linear infinite',
          whiteSpace: 'nowrap'
        }}>
          {[...ALERT_ITEMS, ...ALERT_ITEMS].map((item, i) => (
            <span key={i} style={{
              fontSize: '12px',
              color: item.type === 'critical' ? 'var(--accent-red)' : item.type === 'warning' ? 'var(--accent-amber)' : 'var(--text-secondary)',
              display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: severityDot[item.type] || 'var(--text-muted)', flexShrink: 0 }} />
              {item.msg}
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{item.time}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ===== KPI METRIC (Pulse Bar) =====
function LiveMetric({ label, value, unit, status, trend, index = 0 }: { label: string, value: string|number, unit: string, status: 'good'|'warn'|'crit', trend?: string, index?: number }) {
  const color = status === 'good' ? 'var(--accent-teal)' : status === 'warn' ? 'var(--accent-amber)' : 'var(--accent-red)';
  const isGood = status === 'good';
  const trendDir = trend?.startsWith('↑') ? '↑' : trend?.startsWith('↓') ? '↓' : '—';
  const sparkWidth = 48;

  return (
    <motion.div
      variants={staggerFast}
      custom={index}
      className="glass-card"
      style={{ display: 'flex', flexDirection: 'column', padding: '12px 20px', minWidth: '150px', gap: '4px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
        <span className="micro-label">{label}</span>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%', background: color,
          animation: status === 'crit' ? 'live-pulse 1.2s ease-in-out infinite' : 'none',
          flexShrink: 0
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span className="data-value" style={{ fontSize: '26px', fontWeight: 700, color, lineHeight: 1.1 }}>{value}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{unit}</span>
        {trend && (
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: trendDir === '↑' ? 'var(--accent-red)' : trendDir === '↓' ? 'var(--accent-teal)' : 'var(--text-muted)',
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '2px'
          }}>
            {trendDir === '↑' ? '↑' : trendDir === '↓' ? '↓' : '→'} {trend.replace(/^[↑↓]\s*/, '')}
          </span>
        )}
      </div>
      {/* Sparkline micro bar */}
      <div style={{ marginTop: '6px', height: '3px', borderRadius: '2px', background: 'var(--border-subtle)', overflow: 'hidden', width: '100%' }}>
        <div style={{
          width: `${typeof value === 'number' ? Math.min(Number(value), 100) : 50}%`,
          height: '100%', background: color, borderRadius: '2px',
          transition: 'width 0.6s ease-out'
        }} />
      </div>
    </motion.div>
  );
}

// ===== AI FEED ITEM =====
const categoryColors: Record<string, string> = {
  'Power Grid': '#ba1a1a',
  'Transport': '#D97706',
  'Water': '#004ac6',
  'Air Quality': '#006242',
};
const categoryBadge: Record<string, string> = {
  'Power Grid': 'badge-red',
  'Transport': 'badge-amber',
  'Water': 'badge-violet',
  'Air Quality': 'badge-green',
};

function AIFeedItem({ time, category, text, confidence }: { time: string; category: string; text: string; confidence: number }) {
  const accentColor = categoryColors[category] || 'var(--accent-navy)';
  return (
    <motion.div variants={staggerFast} style={{
      padding: '16px 16px 16px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', gap: '12px',
      background: 'var(--bg-surface-1)',
      transition: 'background 150ms ease',
      cursor: 'pointer',
      borderLeft: `3px solid ${accentColor}`,
      position: 'relative'
    }} className="hover:bg-[var(--bg-surface-2)]">
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: 'var(--accent-navy-light)', border: '1px solid rgba(0,74,198,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color: 'var(--accent-navy)', fontSize: '16px'
      }}>🧠</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span className={categoryBadge[category] || 'badge-gray'} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{category}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, margin: '4px 0 8px' }}>{text}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
            background: confidence >= 90 ? 'var(--accent-teal-light)' : confidence >= 75 ? 'var(--accent-amber-light)' : 'var(--accent-red-light)',
            color: confidence >= 90 ? 'var(--accent-teal)' : confidence >= 75 ? 'var(--accent-amber)' : 'var(--accent-red)',
            letterSpacing: '0.04em'
          }}>
            {confidence}% CONFIDENCE
          </div>
          <div style={{ flex: 1, height: '3px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden', maxWidth: '80px' }}>
            <div style={{ width: `${confidence}%`, height: '100%', background: accentColor, borderRadius: '2px' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== RADIAL HEALTH GAUGE =====
const SUB_METRICS = [
  { label: 'Transport', value: 62, color: 'var(--accent-amber)' },
  { label: 'Environment', value: 78, color: 'var(--accent-teal)' },
  { label: 'Infrastructure', value: 71, color: '#004ac6' },
];

function RadialGauge({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? 'var(--accent-teal)' : value >= 55 ? 'var(--accent-amber)' : 'var(--accent-red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="10" />
          <circle cx="70" cy="70" r="42" fill="none" stroke={color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="data-value" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
          <span className="micro-label" style={{ marginTop: '2px' }}>Score</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {SUB_METRICS.map(m => (
          <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.label}</span>
              <span className="data-value" style={{ fontSize: '11px', fontWeight: 700, color: m.color }}>{m.value}%</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: '2px', transition: 'width 0.8s ease-out' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== FILTER CHIPS =====
const FILTERS = ['All', 'Critical', 'Warnings', 'Info'] as const;

export default function OverviewPage() {
  const cityData = useCityDataStore();
  const sim = useSimulationStore();
  const { openTakeAction, isTakeActionOpen } = useUIStore();
  const disasters = useDisasterStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'traffic' | 'incidents'>('traffic');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const metrics = cityData.metrics;

  // Mapbox Init
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
        zoom: 11,
        pitch: 45,
        bearing: -17.6,
        attributionControl: false,
      });
      mapRef.current = map;

      map.on('load', () => {
        if (!map) return;
        setMapLoaded(true);

        // Mapbox 3D buildings (Stitch style)
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
                  'heatmap-intensity': 1,
                  'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
                    0, 'rgba(0,0,0,0)', 0.2, 'rgba(0,74,198,0.2)', 0.6, 'rgba(0,74,198,0.5)', 1, 'rgba(0,74,198,0.8)'
                  ],
                  'heatmap-radius': 30,
                  'heatmap-opacity': 0.6,
                },
              });
            }
          }).catch(() => {});

        disasters.activeIncidents.forEach(incident => {
          const el = document.createElement('div');
          el.style.cssText = `
            width:20px;height:20px;border-radius:50%;
            background:rgba(186,26,26,0.8);border:2px solid #ffffff;
            box-shadow: 0 0 12px rgba(186,26,26,0.6);
            cursor:pointer;
          `;
          new mapboxgl.Marker(el)
            .setLngLat(incident.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`
              <div style="font-family:Inter,sans-serif;padding:8px;">
                <div style="font-size:10px;color:#ba1a1a;font-weight:700;text-transform:uppercase;">Active Incident</div>
                <div style="font-size:13px;font-weight:700;margin:4px 0;">${incident.name}</div>
              </div>
            `))
            .addTo(map!);
        });
      });
    });

    return () => { if (map) map.remove(); };
  }, []);

  return (
    <motion.div
      className="page-shell page-container"
      style={{ padding: 'var(--spacing-3)', gap: 'var(--spacing-3)', overflow: 'hidden', background: 'var(--bg-surface-2)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Live Pulse Bar - Hero Layer */}
      <motion.div variants={itemVariants} className="glass-card" style={{
        display: 'flex', alignItems: 'center', padding: '20px 0', borderRadius: '20px', background: 'var(--bg-surface-1)',
        boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}>
        <div style={{ padding: '0 28px', borderRight: '1px solid var(--border-subtle)', minWidth: '200px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Urban Command</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-teal)', animation: 'live-pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-teal)', letterSpacing: '0.02em' }}>System Active — Bengaluru Urban</span>
          </div>
        </div>

        <motion.div style={{ display: 'flex', flex: 1, gap: '4px' }} variants={containerVariants}>
          <LiveMetric label="Traffic Congestion" value={metrics.congestionIndex} unit="%" status={metrics.congestionIndex > 75 ? 'crit' : metrics.congestionIndex > 55 ? 'warn' : 'good'} trend="↑ 4% vs yday" index={0} />
          <LiveMetric label="Air Quality (AQI)" value={metrics.aqi} unit="" status={metrics.aqi > 150 ? 'crit' : metrics.aqi > 100 ? 'warn' : 'good'} trend="↓ 8 pts vs wk" index={1} />
          <LiveMetric label="Power Grid Load" value={metrics.gridLoad.toFixed(1)} unit="GW" status="warn" trend="Stable (4.8 GW cap)" index={2} />
          <LiveMetric label="Water Demand Gap" value={350} unit="MLD" status="crit" trend="Critical shortage" index={3} />
        </motion.div>

        <div style={{ flexShrink: 0, padding: '0 28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={openTakeAction} className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '12px', background: 'var(--accent-red)', boxShadow: '0 4px 12px rgba(186,26,26,0.25)' }}>
            ⚠ Resolve {metrics.activeIncidents} Alerts
          </button>
        </div>
      </motion.div>

      {/* Alert Ticker */}
      <AlertTicker />

      {/* Main Split Content */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flex: 1, gap: 'var(--spacing-3)', overflow: 'hidden', minHeight: 0 }}>

        {/* 75% Map Centerpiece */}
        <motion.div variants={itemVariants} style={{
          flex: '7.5', position: 'relative', borderRadius: '20px', overflow: 'hidden', padding: 0,
          boxShadow: '0 0 0 1px rgba(0,74,198,0.15), 0 8px 32px rgba(0,74,198,0.08)',
          background: 'var(--bg-surface-2)'
        }}>
          {!mapLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, background: 'var(--bg-surface-2)' }}>
              <span className="micro-label">Loading Simulation Map...</span>
            </div>
          )}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '20px' }} />

          {/* Map Overlays */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, display: 'flex', gap: '8px' }}>
            <button className="glass" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-navy)', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>Traffic Density</button>
            <button className="glass" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>Public Transit</button>
            <button className="glass" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>Utilities Grid</button>
          </div>

          {/* Glass overlay with real-time stats */}
          <div className="glass" style={{
            position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: 10,
            padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '24px',
            borderTop: '1px solid rgba(255,255,255,0.5)',
            backdropFilter: 'blur(20px)',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-navy)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-teal)', animation: 'live-pulse 2s ease-in-out infinite' }} />
              City Pulse
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Sectors: <strong style={{ color: 'var(--text-primary)' }}>14/16</strong></span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Response Time: <strong style={{ color: 'var(--accent-teal)' }}>2.4s</strong></span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Network Status: <strong style={{ color: 'var(--accent-teal)' }}>Operational</strong></span>
          </div>
        </motion.div>

        {/* 25% Intelligence Feed */}
        <motion.div variants={itemVariants} style={{ flex: '2.5', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', overflowY: 'auto', minHeight: 0 }} className="hide-scrollbar">

          {/* City Health Gauge */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>City Health Score</h3>
            <RadialGauge value={metrics.cityHealthScore} />
            <p style={{
              fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: 1.6,
              padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: '8px', width: '100%'
            }}>
              Operating at a moderate efficiency level. Transportation bottlenecks remain the primary drag on overall performance.
            </p>
          </motion.div>

          {/* Recommendation Engine Snippet - Mission Briefing */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '20px', borderTop: '3px solid var(--accent-navy)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,74,198,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="micro-label" style={{ color: 'var(--accent-navy)', fontSize: '9px' }}>Recommended Action</span>
              <span style={{
                fontSize: '11px', fontWeight: 700, color: '#FFFFFF',
                background: 'var(--accent-teal)', padding: '2px 10px', borderRadius: '6px',
                letterSpacing: '0.02em'
              }}>94% Success Probability</span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Activate ORR Traffic Sync</h4>
            <p style={{
              fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6,
              padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: '8px'
            }}>
              Synchronizing 12 major intersections along the Outer Ring Road corridor will alleviate localized congestion by 18%.
            </p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={openTakeAction}>Execute Protocol</button>
          </motion.div>

          {/* Live Intelligence Feed */}
          <motion.div variants={itemVariants} className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(180deg, var(--bg-surface-1) 0%, rgba(239,244,255,0.4) 100%)' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Live Intelligence</h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '14px',
                      border: 'none', cursor: 'pointer',
                      background: activeFilter === f ? 'var(--accent-navy)' : 'var(--bg-surface-3)',
                      color: activeFilter === f ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 120ms ease',
                      letterSpacing: '0.02em'
                    }}
                  >{f}</button>
                ))}
              </div>
            </div>
            <motion.div style={{ flex: 1, overflowY: 'auto' }} variants={containerVariants}>
              <AIFeedItem
                time="Just now" category="Power Grid" confidence={92}
                text="Electronic City Substation #11 approaching critical load. Recommend load-shedding protocol in adjacent non-critical sectors."
              />
              <AIFeedItem
                time="14m ago" category="Transport" confidence={88}
                text="Metro Line 3 Phase 1 on schedule. Anticipate 4% modal shift from road to rail once fully operational."
              />
              <AIFeedItem
                time="32m ago" category="Water" confidence={96}
                text="Cauvery Stage 5 pumping stabilized. Supply gap narrowed by 120 MLD, improving eastern district pressure."
              />
              <AIFeedItem
                time="1h ago" category="Air Quality" confidence={81}
                text="Sustained PM2.5 elevation in Whitefield industrial cluster. Construction dust suppression highly recommended."
              />
            </motion.div>
          </motion.div>

        </motion.div>
      </motion.div>

      <TakeActionDrawer />
    </motion.div>
  );
}
