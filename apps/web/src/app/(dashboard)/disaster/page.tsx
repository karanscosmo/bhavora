"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisasterStore, useAppStore, useUIStore } from '@/stores';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Waves, Flame, Zap, Hospital, Activity, Factory, Ambulance, Truck, HardHat, Camera } from 'lucide-react';

const PROTOCOL_ICON_MAP: Record<string, React.ReactNode> = {
  waves: <Waves size={16} />,
  flame: <Flame size={16} />,
  zap: <Zap size={16} />,
  hospital: <Hospital size={16} />,
  activity: <Activity size={16} />,
  factory: <Factory size={16} />
};

const RESOURCE_ICON_MAP: Record<string, React.ReactNode> = {
  ambulance: <Ambulance size={16} />,
  truck: <Truck size={16} />,
  'hard-hat': <HardHat size={16} />,
  camera: <Camera size={16} />,
  zap: <Zap size={16} />,
  hospital: <Hospital size={16} />
};

const PROTOCOLS = [
  { id: 'flood', name: 'Flood Response', icon: 'waves', color: '#3B82F6', description: 'Activate BBMP drainage, deploy pumps, issue evacuation orders' },
  { id: 'fire', name: 'Fire Evacuation', icon: 'flame', color: '#EF4444', description: 'KFES dispatch, civilian evacuation, traffic diversion' },
  { id: 'power', name: 'Power Outage Response', icon: 'zap', color: '#F59E0B', description: 'BESCOM emergency, load redistribution, backup activation' },
  { id: 'medical', name: 'Mass Medical Emergency', icon: 'hospital', color: '#10B981', description: '108 dispatch, hospital alerts, field triage setup' },
  { id: 'earthquake', name: 'Earthquake Response', icon: 'activity', color: '#7C3AED', description: 'NDRF activation, structural assessment, rescue coordination' },
  { id: 'industrial', name: 'Industrial Accident', icon: 'factory', color: '#F97316', description: 'HAZMAT team, evacuation radius, media coordination' },
];

const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', color: '#EF4444', bg: 'rgba(239,68,68,0.2)', ribbon: 'linear-gradient(90deg, #EF4444, #DC2626)' },
  major: { label: 'MAJOR', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', ribbon: 'linear-gradient(90deg, #F59E0B, #D97706)' },
  minor: { label: 'MINOR', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', ribbon: 'linear-gradient(90deg, #3B82F6, #2563EB)' },
};

const INCIDENT_ICONS: Record<string, string> = {
  flood: '🌊', fire: '🔥', power: '⚡', medical: '🏥', earthquake: '🌍', industrial: '🏭', civil: '🚨',
};

const RESOURCE_CARDS = [
  { id: 'ambulance-1', type: 'Ambulance', icon: 'ambulance', status: 'En Route', eta: '4 min', capacity: 80, team: '108 Cluster A', color: '#10B981' },
  { id: 'fire-1', type: 'Fire Truck', icon: 'truck', status: 'On Site', eta: '0 min', capacity: 100, team: 'KFES Unit 3', color: '#EF4444' },
  { id: 'rescue-1', type: 'Rescue Team', icon: 'hard-hat', status: 'En Route', eta: '7 min', capacity: 60, team: 'NDRF Team BLR', color: '#F59E0B' },
  { id: 'drone-1', type: 'Drone', icon: 'camera', status: 'Available', eta: '—', capacity: 100, team: 'Surveillance Unit', color: '#7C3AED' },
  { id: 'ambulance-2', type: 'Ambulance', icon: 'ambulance', status: 'Available', eta: '—', capacity: 100, team: '108 Cluster B', color: '#10B981' },
  { id: 'fire-2', type: 'Fire Truck', icon: 'truck', status: 'En Route', eta: '11 min', capacity: 70, team: 'KFES Unit 7', color: '#EF4444' },
  { id: 'power-1', type: 'Power Crew', icon: 'zap', status: 'On Site', eta: '0 min', capacity: 90, team: 'BESCOM RR', color: '#3B82F6' },
  { id: 'medical-1', type: 'Medical Unit', icon: 'hospital', status: 'En Route', eta: '3 min', capacity: 50, team: 'Field Hospital A', color: '#10B981' },
];

const RESOURCE_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  'En Route': { bg: 'rgba(245,158,11,0.2)', color: '#F59E0B' },
  'On Site': { bg: 'rgba(16,185,129,0.2)', color: '#10B981' },
  'Available': { bg: 'rgba(59,130,246,0.2)', color: '#3B82F6' },
};

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(239,68,68,0.2)', color: '#EF4444', label: 'ACTIVE' },
  contained: { bg: 'rgba(245,158,11,0.2)', color: '#F59E0B', label: 'CONTAINED' },
  resolved: { bg: 'rgba(16,185,129,0.2)', color: '#10B981', label: 'RESOLVED' },
};

const INCIDENT_SVG_MARKERS: Record<string, string> = {
  flood: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#3B82F6" fill-opacity="0.3" stroke="#3B82F6" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#3B82F6"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">FL</text></svg>`,
  fire: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#EF4444" fill-opacity="0.3" stroke="#EF4444" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#EF4444"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">FI</text></svg>`,
  power: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#F59E0B" fill-opacity="0.3" stroke="#F59E0B" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#F59E0B"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">PW</text></svg>`,
  medical: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#10B981" fill-opacity="0.3" stroke="#10B981" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#10B981"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">MD</text></svg>`,
  earthquake: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#7C3AED" fill-opacity="0.3" stroke="#7C3AED" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#7C3AED"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">EQ</text></svg>`,
  industrial: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#F97316" fill-opacity="0.3" stroke="#F97316" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#F97316"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">IN</text></svg>`,
  default: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#EF4444" fill-opacity="0.3" stroke="#EF4444" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="#EF4444"/><text x="18" y="22" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">ER</text></svg>`,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

function StatusDashboard() {
  const disaster = useDisasterStore();
  const activeCount = disaster.activeIncidents.filter(i => i.status === 'active').length;
  const totalAffected = disaster.activeIncidents.reduce((s, i) => s + (i.affectedCount || 0), 0);
  const criticalCount = disaster.activeIncidents.filter(i => i.severity === 'critical').length;
  const majorCount = disaster.activeIncidents.filter(i => i.severity === 'major').length;

  const stats = [
    { label: 'Active Incidents', value: activeCount, sub: `${criticalCount} critical, ${majorCount} major`, color: '#EF4444' },
    { label: 'Resources Deployed', value: RESOURCE_CARDS.filter(r => r.status !== 'Available').length, sub: `${RESOURCE_CARDS.length} total units`, color: '#3B82F6' },
    { label: 'Response Time', value: '6m', sub: 'Avg. arrival', color: '#10B981' },
    { label: 'At-Risk Population', value: totalAffected.toLocaleString(), sub: 'Civilians affected', color: '#F59E0B' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '16px 20px' }}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            {stat.label}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color, fontFamily: '"JetBrains Mono", monospace', fontFeatureSettings: '"tnum" on', lineHeight: 1 }}>
            {stat.value}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{stat.sub}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProtocolModal({ onClose, onActivate }: { onClose: () => void; onActivate: (protocol: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true);
    await new Promise(r => setTimeout(r, 1500));
    onActivate(selected);
    setActivating(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: '#0B0D14', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '24px', width: '540px', zIndex: 301, boxShadow: '0 0 60px rgba(239,68,68,0.1)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444', letterSpacing: '-0.02em' }}>Execute Emergency Protocol</span>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginLeft: '34px' }}>Select response protocol for active incident</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '24px' }}
          >×</motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}
        >
          {PROTOCOLS.map(p => {
            const svg = INCIDENT_SVG_MARKERS[p.id] || INCIDENT_SVG_MARKERS.default;
            return (
              <motion.button
                key={p.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, borderColor: p.color }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(p.id)}
                style={{
                  padding: '16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                  border: `1px solid ${selected === p.id ? p.color : 'rgba(255,255,255,0.1)'}`,
                  background: selected === p.id ? `${p.color}15` : 'rgba(255,255,255,0.03)',
                  transition: 'all 150ms', position: 'relative', overflow: 'hidden',
                }}
              >
                {selected === p.id && (
                  <motion.div
                    layoutId="protocol-selected"
                    style={{
                      position: 'absolute', inset: 0, background: `${p.color}08`,
                      borderRadius: '12px',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span dangerouslySetInnerHTML={{ __html: svg }} style={{ width: 28, height: 28 }} />
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: p.color,
                    padding: '2px 6px', borderRadius: '4px', background: `${p.color}20`,
                    letterSpacing: '0.05em',
                  }}>
                    {p.id.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: selected === p.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', lineHeight: 1.4 }}>{p.description}</div>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confirmation Required
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  Activating <strong style={{ color: '#fff' }}>{PROTOCOLS.find(pr => pr.id === selected)?.name}</strong> will initiate city-wide emergency broadcasting and auto-deploy emergency response teams.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600 }}
          >Cancel</motion.button>
          <motion.button
            whileHover={selected && !activating ? { scale: 1.02 } : {}}
            whileTap={selected && !activating ? { scale: 0.98 } : {}}
            onClick={handleActivate}
            disabled={!selected || activating}
            style={{
              padding: '10px 24px', background: '#EF4444', border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '14px', fontWeight: 700,
              cursor: selected && !activating ? 'pointer' : 'not-allowed',
              opacity: selected && !activating ? 1 : 0.5,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {activating ? (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >● Activating...</motion.span>
            ) : '⚡ Execute Protocol'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ResourceDrawer({ onClose }: { onClose: () => void }) {
  const { addNotification } = useAppStore();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }}
      />
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: '440px',
          background: '#07090F', borderLeft: '1px solid rgba(255,255,255,0.08)',
          zIndex: 301, display: 'flex', flexDirection: 'column',
          boxShadow: '-24px 0 80px rgba(0,0,0,0.8)', color: '#fff',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🚒</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Resource Deployment</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '24px' }}
          >×</motion.button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {RESOURCE_CARDS.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
                style={{
                  padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: `${r.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px',
                    }}>{RESOURCE_ICON_MAP[r.icon] || r.icon}</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{r.type}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{r.team}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                    background: RESOURCE_STATUS_STYLES[r.status]?.bg || 'rgba(255,255,255,0.1)',
                    color: RESOURCE_STATUS_STYLES[r.status]?.color || 'rgba(255,255,255,0.5)',
                  }}>
                    {r.status}
                  </span>
                  <span style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                    background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                  }}>
                    ETA: {r.eta}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>
                    <span>Utilization</span>
                    <span>{r.capacity}%</span>
                  </div>
                  <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.capacity}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: '2px',
                        background: r.capacity > 80 ? '#EF4444' : r.capacity > 50 ? '#F59E0B' : '#10B981',
                      }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addNotification({ title: 'Resource Deployed', message: `${r.type} deployed`, severity: 'success' })}
                  style={{
                    width: '100%', padding: '6px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                    fontSize: '11px', color: '#fff', fontWeight: 600, cursor: 'pointer', marginTop: '2px',
                  }}
                >
                  Deploy Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function DisasterPage() {
  const disaster = useDisasterStore();
  const { addNotification } = useAppStore();
  const { openAgentHub } = useUIStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showResourceDrawer, setShowResourceDrawer] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyDone, setNotifyDone] = useState(false);
  const [endConfirm, setEndConfirm] = useState<string | null>(null);
  const [ts, setTs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setTs(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const selectedIncident = disaster.activeIncidents.find(i => i.id === disaster.selectedIncidentId);

  useEffect(() => {
    let map: MapboxMap | null = null;
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      if (!mapRef.current) return;
      map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [77.5946, 12.9716],
        zoom: 11.5,
        pitch: 45,
        attributionControl: false,
      });
      mapInstanceRef.current = map;
      map.on('load', () => {
        if (!map) return;
        setMapLoaded(true);

        if (map.getSource('composite')) {
          map.addLayer({
            'id': '3d-buildings-dark',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': {
              'fill-extrusion-color': '#111',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6,
            },
          });
        }

        disaster.activeIncidents.forEach(incident => {
          const el = document.createElement('div');
          const markerSvg = INCIDENT_SVG_MARKERS[incident.type] || INCIDENT_SVG_MARKERS.default;
          el.innerHTML = markerSvg;
          el.style.cssText = 'cursor:pointer;filter:drop-shadow(0 0 8px rgba(239,68,68,0.6))';
          el.addEventListener('click', () => disaster.selectIncident(incident.id));
          el.addEventListener('mouseenter', () => {
            el.style.filter = 'drop-shadow(0 0 16px rgba(239,68,68,0.9))';
            el.style.transform = 'scale(1.15)';
          });
          el.addEventListener('mouseleave', () => {
            el.style.filter = 'drop-shadow(0 0 8px rgba(239,68,68,0.6))';
            el.style.transform = 'scale(1)';
          });
          new mapboxgl.Marker({ element: el })
            .setLngLat(incident.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 16, closeButton: false })
              .setHTML(`<div style="background:#000;color:#fff;padding:12px;border-radius:8px;font-family:Inter,sans-serif;min-width:200px;border:1px solid rgba(239,68,68,0.4)"><div style="font-size:10px;color:#EF4444;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">ACTIVE INCIDENT</div><div style="font-size:14px;font-weight:700">${incident.name}</div><div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:4px">${incident.location}</div></div>`))
            .addTo(map!);
        });

        if (map.getSource('heat-source')) {
          map.removeLayer('heat-layer');
          map.removeSource('heat-source');
        }
      });

      map.on('idle', () => {
        if (!map) return;
        disaster.activeIncidents.forEach(incident => {
          const id = `heat-${incident.id}`;
          if (map?.getSource(id)) return;
          try {
            map?.addSource(id, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: incident.coordinates,
                },
              },
            });
            map?.addLayer({
              id,
              type: 'circle',
              source: id,
              paint: {
                'circle-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  10, 40,
                  15, 120,
                ],
                'circle-color': incident.severity === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.08)',
                'circle-blur': 1,
              },
            });
          } catch {}
        });
      });
    });
    return () => { if (map) map.remove(); };
  }, [disaster.activeIncidents]);

  const handleNotifyAuthorities = async () => {
    setNotifyLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setNotifyLoading(false);
    setNotifyDone(true);
    addNotification({ title: 'Authorities Notified', message: 'KSRP, BBMP, and BESCOM alerted.', severity: 'success' });
    setTimeout(() => setNotifyDone(false), 4000);
  };

  const handleEndIncident = (id: string) => {
    disaster.endIncident(id);
    setEndConfirm(null);
    addNotification({ title: 'Incident Closed', message: 'Incident archived successfully', severity: 'success' });
  };

  return (
    <div style={{
      display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden',
      background: '#050505', color: '#fff', position: 'relative', width: '100%',
    }}>
      {/* LEFT — Incident List */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        style={{ width: '360px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}
      >
        {/* Command Center Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(180deg, rgba(239,68,68,0.08) 0%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
              Operations Center
            </h2>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                background: disaster.activeIncidents.filter(i => i.status === 'active').length > 0
                  ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)',
                color: disaster.activeIncidents.filter(i => i.status === 'active').length > 0 ? '#EF4444' : '#10B981',
                border: `1px solid ${disaster.activeIncidents.filter(i => i.status === 'active').length > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
              }}
            >
              {disaster.activeIncidents.filter(i => i.status === 'active').length} ACTIVE
            </motion.span>
          </div>
        </div>

        {/* Status Dashboard */}
        <StatusDashboard />

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

        {/* Incident List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {disaster.activeIncidents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: '40px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>No Active Incidents</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>City operating at normal threat level.</div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {disaster.activeIncidents.map((incident) => {
                const sev = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.major;
                const isSelected = disaster.selectedIncidentId === incident.id;
                return (
                  <motion.div
                    key={incident.id}
                    variants={itemVariants}
                    layout
                    onClick={() => disaster.selectIncident(incident.id)}
                    style={{
                      borderRadius: '10px', cursor: 'pointer', overflow: 'hidden', position: 'relative',
                      background: isSelected ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 150ms',
                    }}
                  >
                    {/* Severity Ribbon */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      background: sev.ribbon,
                    }} />

                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            background: `${sev.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px',
                          }}>
                            {INCIDENT_ICONS[incident.type] || '🚨'}
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{incident.name}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{incident.location}</div>
                          </div>
                        </div>
                        <span style={{
                          padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                          background: sev.bg, color: sev.color, letterSpacing: '0.05em',
                        }}>
                          {incident.severity}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{
                            padding: '1px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700,
                            background: STATUS_BADGE[incident.status]?.bg || 'rgba(255,255,255,0.1)',
                            color: STATUS_BADGE[incident.status]?.color || 'rgba(255,255,255,0.5)',
                          }}>
                            {STATUS_BADGE[incident.status]?.label || incident.status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
                            {ts ? Math.round((ts - incident.startedAt.getTime()) / 60000) : 0}m ago
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              style={{ display: 'flex', gap: '4px' }}
                            >
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowResourceDrawer(true); }}
                                style={{
                                  padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
                                  background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                                  color: '#60A5FA', cursor: 'pointer', whiteSpace: 'nowrap',
                                }}
                              >Dispatch</button>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 600,
                                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer', whiteSpace: 'nowrap',
                                }}
                              >View Route</button>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {incident.affectedCount && (
                        <div style={{
                          marginTop: '8px', padding: '6px 8px', borderRadius: '4px',
                          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                          fontSize: '10px', color: '#F59E0B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                          <span>👥</span>
                          {incident.affectedCount.toLocaleString()} affected
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleNotifyAuthorities}
            disabled={notifyLoading || notifyDone}
            style={{
              width: '100%', padding: '11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              background: notifyDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${notifyDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: notifyDone ? '#10B981' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {notifyDone ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓ Authorities Notified</motion.span>
            ) : notifyLoading ? (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                Notifying...
              </motion.span>
            ) : '📡 Broadcast Alert'}
          </motion.button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowResourceDrawer(true)}
              style={{
                flex: 1, padding: '11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              🚒 Resources
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => {
                openAgentHub('disaster');
                addNotification({ title: 'AI Copilot Activated', message: 'Crisis response agent ready.', severity: 'info' });
              }}
              style={{
                flex: 1, padding: '11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              🤖 AI Copilot
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. CENTER — Map & HUD */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* HUD Overlay Top */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowProtocolModal(true)}
              style={{
                padding: '10px 20px', background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(239,68,68,0.5)', borderRadius: '8px', color: '#EF4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <motion.span
                animate={!disaster.activeProtocol ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >⚠</motion.span>
              INITIATE PROTOCOL
            </motion.button>
            {disaster.activeProtocol && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  padding: '10px 16px', background: 'rgba(239,68,68,0.9)', borderRadius: '8px',
                  fontSize: '12px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >●</motion.span>
                PROTOCOL ACTIVE
              </motion.div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            {/* Map Legend */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '10px 14px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center',
              }}
            >
              {[
                { type: 'critical', color: '#EF4444', label: 'Critical' },
                { type: 'major', color: '#F59E0B', label: 'Major' },
                { type: 'minor', color: '#3B82F6', label: 'Minor' },
              ].map(l => (
                <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                  {l.label}
                </div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { openAgentHub('disaster'); addNotification({ title: 'AI Copilot Activated', message: 'Crisis response agent ready.', severity: 'info' }); }}
              style={{
                padding: '10px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              🤖 AI Crisis Assistant
            </motion.button>
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <AnimatePresence>
            {!mapLoaded && (
              <motion.div
                initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', zIndex: 5 }}
              >
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block' }}
                  >⟳</motion.span>
                  INITIALIZING GEOSPATIAL ENGINE...
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* 3. RIGHT — Response Panel */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.1 }}
        style={{ width: '380px', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}
      >
        {selectedIncident ? (
          <>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(180deg, rgba(239,68,68,0.06) 0%, transparent 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}
                />
                <span style={{ fontSize: '10px', color: '#EF4444', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Feed</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', lineHeight: 1.3 }}>{selectedIncident.name}</h2>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{selectedIncident.location}</p>

              {selectedIncident.affectedCount && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '14px', padding: '10px 14px', background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px',
                    color: '#F59E0B', fontSize: '12px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span>⚠</span>
                  ESTIMATED IMPACT: {selectedIncident.affectedCount.toLocaleString()} civilians
                </motion.div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              <h3 style={{
                fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '20px',
                letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ width: '16px', height: '2px', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                Response Timeline
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)', display: 'inline-block' }} />
              </h3>

              {disaster.responseTimeline.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', padding: '32px 0' }}
                >
                  Awaiting protocol execution...
                </motion.div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {/* Vertical timeline line */}
                  <div style={{
                    position: 'absolute', left: '11px', top: '8px', bottom: '8px',
                    width: '2px', background: 'rgba(255,255,255,0.08)',
                  }} />

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {disaster.responseTimeline.map((step, i) => {
                      const isDone = step.status === 'done';
                      const isActive = step.status === 'active';
                                            const dotColor = isDone ? '#10B981' : isActive ? '#F59E0B' : 'rgba(255,255,255,0.15)';
                      const textColor = isDone ? 'rgba(255,255,255,0.8)' : isActive ? '#F59E0B' : 'rgba(255,255,255,0.3)';
                      const timeColor = isDone ? 'rgba(16,185,129,0.6)' : isActive ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.2)';

                      return (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          style={{ position: 'relative', marginBottom: '20px', paddingLeft: '32px' }}
                        >
                          {/* Timeline dot */}
                          <motion.div
                            initial={false}
                            animate={{
                              scale: isActive ? [1, 1.3, 1] : 1,
                              boxShadow: isActive
                                ? ['0 0 0 0 rgba(245,158,11,0.5)', '0 0 0 8px rgba(245,158,11,0)', '0 0 0 0 rgba(245,158,11,0.5)']
                                : 'none',
                            }}
                            transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                            style={{
                              position: 'absolute', left: '5px', top: '4px',
                              width: '14px', height: '14px', borderRadius: '50%',
                              background: dotColor,
                              border: `2px solid ${dotColor}`,
                              zIndex: 2,
                            }}
                          />

                          {/* Animated progress indicator for active items */}
                          {isActive && (
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              style={{
                                position: 'absolute', left: '0', right: '0', top: '0', bottom: '0',
                                background: 'linear-gradient(90deg, rgba(245,158,11,0.05), transparent)',
                                borderRadius: '8px', transformOrigin: 'left', zIndex: 0,
                              }}
                            />
                          )}

                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px',
                            }}>
                              <span style={{
                                fontSize: '10px', fontWeight: 600, color: timeColor,
                                fontFamily: '"JetBrains Mono", monospace',
                              }}>
                                {step.time}
                              </span>
                              <span style={{
                                fontSize: '8px', padding: '1px 5px', borderRadius: '3px',
                                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                background: isDone ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                                color: dotColor,
                              }}>
                                {isDone ? '✓' : isActive ? '●' : '○'} {step.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: textColor }}>
                              {isActive ? (
                                <motion.span
                                  animate={{ opacity: [1, 0.6, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {step.action}
                                </motion.span>
                              ) : step.action}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowProtocolModal(true)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444',
                  }}
                >
                  ⚡ Activate Protocol
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setEndConfirm(selectedIncident.id)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.7)',
                  }}
                >
                  Terminate
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}
          >
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontSize: '32px', marginBottom: '16px' }}
              >🗺️</motion.div>
              <div style={{ fontSize: '12px', letterSpacing: '0.08em' }}>SELECT INCIDENT TO VIEW TELEMETRY</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {showProtocolModal && (
        <ProtocolModal
          onClose={() => setShowProtocolModal(false)}
          onActivate={(protocol) => {
            disaster.activateProtocol(protocol);
            addNotification({ title: 'Protocol Activated', message: `Emergency protocol deployed`, severity: 'critical' });
          }}
        />
      )}

      {showResourceDrawer && <ResourceDrawer onClose={() => setShowResourceDrawer(false)} />}

      <AnimatePresence>
        {endConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEndConfirm(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                background: '#0B0D14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '24px', width: '380px', zIndex: 301, boxShadow: '0 24px 80px rgba(0,0,0,0.8)', color: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>⚠</span>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Terminate Incident?</div>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.5 }}>
                This will archive the incident and log the response timeline. Ensure all ground operations have concluded.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setEndConfirm(null)}
                  style={{ padding: '10px 16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 600 }}
                >Cancel</motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleEndIncident(endConfirm)}
                  style={{ padding: '10px 20px', background: '#EF4444', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Termination
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
