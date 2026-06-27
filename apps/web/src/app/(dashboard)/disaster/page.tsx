"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisasterStore, useAppStore, useUIStore } from '@/stores';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const PROTOCOLS = [
  { id: 'flood', name: 'Flood Response', icon: '🌊', color: '#3B82F6', description: 'Activate BBMP drainage, deploy pumps, issue evacuation orders' },
  { id: 'fire', name: 'Fire Evacuation', icon: '🔥', color: '#EF4444', description: 'KFES dispatch, civilian evacuation, traffic diversion' },
  { id: 'power', name: 'Power Outage Response', icon: '⚡', color: '#F59E0B', description: 'BESCOM emergency, load redistribution, backup activation' },
  { id: 'medical', name: 'Mass Medical Emergency', icon: '🏥', color: '#10B981', description: '108 dispatch, hospital alerts, field triage setup' },
  { id: 'earthquake', name: 'Earthquake Response', icon: '🌍', color: '#7C3AED', description: 'NDRF activation, structural assessment, rescue coordination' },
  { id: 'industrial', name: 'Industrial Accident', icon: '🏭', color: '#F97316', description: 'HAZMAT team, evacuation radius, media coordination' },
];

function ProtocolModal({ onClose, onActivate }: { onClose: () => void; onActivate: (protocol: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true);
    await new Promise(r => setTimeout(r, 2000));
    onActivate(selected);
    setActivating(false);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 300, backdropFilter: 'none' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'var(--bg-surface-1)', border: '1px solid var(--border-normal)', borderRadius: '14px',
        padding: '24px', width: '520px', zIndex: 301, boxShadow: '0 8px 32px rgba(15,23,42,0.08)',
        animation: 'scale-in 0.16s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Execute Emergency Protocol</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>Select and confirm response protocol for active incident</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {PROTOCOLS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${selected === p.id ? p.color : 'var(--border-normal)'}`,
                background: selected === p.id ? `${p.color}12` : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>{p.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: selected === p.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{p.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>{p.description}</div>
            </button>
          ))}
        </div>

        {selected && (
          <div style={{ padding: '12px', background: 'var(--accent-red-light)', border: '1px solid var(--accent-red)', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: 700, marginBottom: '4px' }}>⚠ Confirmation Required</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Activating <strong style={{ color: 'var(--text-primary)' }}>{PROTOCOLS.find(pr => pr.id === selected)?.name}</strong> will:
              <br />• Dispatch emergency teams and notify authorities
              <br />• Activate traffic diversion systems
              <br />• Send public alert notifications
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Cancel</button>
          <button
            onClick={handleActivate}
            disabled={!selected || activating}
            style={{
              padding: '8px 20px', background: 'var(--accent-red)', border: 'none',
              borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: 700,
              cursor: selected && !activating ? 'pointer' : 'not-allowed',
              opacity: selected && !activating ? 1 : 0.5,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {activating ? (
              <><span style={{ animation: 'live-pulse 1s infinite' }}>●</span> Activating...</>
            ) : '⚡ Execute Protocol'}
          </button>
        </div>
      </div>
    </>
  );
}

function ResourceDrawer({ onClose }: { onClose: () => void }) {
  const { addNotification } = useAppStore();
  const RESOURCES = [
    { name: 'BBMP Drainage Team A', status: 'Standby', count: '12 personnel', icon: '🔧' },
    { name: 'KFES Unit 3 & 7', status: 'Dispatched', count: '6 trucks', icon: '🚒' },
    { name: '108 Ambulance Cluster', status: 'On-route', count: '8 units', icon: '🚑' },
    { name: 'NDRF Team Bengaluru', status: 'Standby', count: '40 personnel', icon: '🪖' },
    { name: 'BESCOM Rapid Response', status: 'Active', count: '4 teams', icon: '⚡' },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '380px',
        background: '#0A1628', borderLeft: '1px solid rgba(0,212,255,0.12)',
        zIndex: 301, display: 'flex', flexDirection: 'column', animation: 'slide-right 0.2s ease-out',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Resource Deployment</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {RESOURCES.map((r, i) => (
            <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{r.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{r.name}</span>
                </div>
                <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                  background: r.status === 'Active' || r.status === 'On-route' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                  color: r.status === 'Active' || r.status === 'On-route' ? '#10B981' : '#F59E0B',
                  border: `1px solid ${r.status === 'Active' || r.status === 'On-route' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                }}>
                  {r.status}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{r.count}</div>
              <button
                onClick={() => { addNotification({ title: 'Resource Deployed', message: `${r.name} deployed to incident zone`, severity: 'success' }); }}
                style={{ padding: '4px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '4px', fontSize: '11px', color: '#00D4FF', fontWeight: 600, cursor: 'pointer' }}
              >
                Deploy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
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

  const selectedIncident = disaster.activeIncidents.find(i => i.id === disaster.selectedIncidentId);

  useEffect(() => {
    let map: MapboxMap | null = null;
    import('mapbox-gl').then(m => {
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      if (!mapRef.current) return;
      map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11,
        pitch: 25,
        attributionControl: false,
      });
      mapInstanceRef.current = map;
      map.on('load', () => {
        if (!map) return;
        setMapLoaded(true);
        disaster.activeIncidents.forEach(incident => {
          const el = document.createElement('div');
          el.style.cssText = `width:20px;height:20px;border-radius:50%;background:rgba(239,68,68,0.9);border:2px solid #fff;cursor:pointer;box-shadow:0 0 0 0 rgba(239,68,68,0.4);animation:live-pulse 1.5s ease-in-out infinite;`;
          el.addEventListener('click', () => disaster.selectIncident(incident.id));
          new mapboxgl.Marker(el)
            .setLngLat(incident.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 14, closeButton: false })
              .setHTML(`<div style="background:#0A1628;color:#fff;padding:10px;border-radius:8px;font-family:Inter,sans-serif;min-width:180px;border:1px solid rgba(239,68,68,0.3)"><div style="font-size:10px;color:#EF4444;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">ACTIVE</div><div style="font-size:13px;font-weight:600">${incident.name}</div><div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:3px">${incident.location}</div></div>`))
            .addTo(map!);
        });
      });
    });
    return () => { if (map) map.remove(); };
  }, []);

  const handleNotifyAuthorities = async () => {
    setNotifyLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setNotifyLoading(false);
    setNotifyDone(true);
    addNotification({ title: 'Authorities Notified', message: 'BBMP, BESCOM, KSRP, and 108 have been alerted', severity: 'success' });
    setTimeout(() => setNotifyDone(false), 4000);
  };

  const handleEvacuate = () => {
    addNotification({ title: 'Evacuation Alert Issued', message: 'Zone 4 evacuation orders sent via BBMP notification system', severity: 'warning' });
  };

  const handleRequestSupport = () => {
    openAgentHub('disaster');
    addNotification({ title: 'Support Request', message: 'Disaster Response Agent activated — describe support needed', severity: 'info' });
  };

  const handleEndIncident = (id: string) => {
    disaster.endIncident(id);
    setEndConfirm(null);
    addNotification({ title: 'Incident Closed', message: 'Incident archived and response timeline exported', severity: 'success' });
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
      {/* ===== LEFT — Incident List ===== */}
      <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: 'rgba(5,10,20,0.5)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Incident Command</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}>
              {disaster.activeIncidents.filter(i => i.status === 'active').length} Active
            </span>
            <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
              {disaster.activeIncidents.filter(i => i.status === 'resolved').length} Resolved
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {disaster.activeIncidents.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>No Active Incidents</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>All systems nominal. City operating normally.</div>
            </div>
          ) : (
            disaster.activeIncidents.map(incident => (
              <button
                key={incident.id}
                onClick={() => disaster.selectIncident(incident.id)}
                style={{
                  width: '100%', padding: '12px', marginBottom: '4px', borderRadius: '8px',
                  background: disaster.selectedIncidentId === incident.id ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${disaster.selectedIncidentId === incident.id ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.05)'}`,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 120ms',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                    {incident.type === 'power' ? '⚡' : incident.type === 'flood' ? '🌊' : '🚨'} {incident.name}
                  </span>
                  <span style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: 700,
                    background: incident.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: incident.severity === 'critical' ? '#EF4444' : '#F59E0B',
                    border: `1px solid ${incident.severity === 'critical' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  }}>
                    {incident.severity.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{incident.location}</div>
                {incident.affectedCount && (
                  <div style={{ fontSize: '10px', color: '#F59E0B', marginTop: '3px' }}>
                    ⚠ {incident.affectedCount.toLocaleString()} affected
                  </div>
                )}
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '3px' }}>
                  {Math.round((Date.now() - incident.startedAt.getTime()) / 60000)}m ago
                </div>
              </button>
            ))
          )}
        </div>

        {/* Quick actions */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={handleNotifyAuthorities}
            disabled={notifyLoading || notifyDone}
            style={{
              width: '100%', padding: '9px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              background: notifyDone ? 'rgba(16,185,129,0.15)' : 'rgba(0,212,255,0.1)',
              border: `1px solid ${notifyDone ? 'rgba(16,185,129,0.3)' : 'rgba(0,212,255,0.25)'}`,
              color: notifyDone ? '#10B981' : '#00D4FF',
              opacity: notifyLoading ? 0.6 : 1,
            }}
          >
            {notifyDone ? '✓ Authorities Notified' : notifyLoading ? 'Notifying...' : '📡 Notify Authorities'}
          </button>
          <button
            onClick={() => setShowResourceDrawer(true)}
            style={{ width: '100%', padding: '9px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}
          >
            🚒 Deploy Resources
          </button>
          <button
            onClick={handleEvacuate}
            style={{ width: '100%', padding: '9px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}
          >
            🚨 Evacuate Zone
          </button>
        </div>
      </div>

      {/* ===== CENTER — Map ===== */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Map controls bar */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(5,10,20,0.7)' }}>
          <button
            onClick={() => setShowProtocolModal(true)}
            style={{
              padding: '7px 16px', background: 'var(--accent-red-light)',
              border: '1px solid var(--accent-red)', borderRadius: '6px', color: 'var(--accent-red)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              animation: disaster.activeProtocol ? 'none' : 'glow-pulse 2s ease-in-out infinite',
            }}
          >
            ⚡ Execute Protocol
          </button>
          {disaster.activeProtocol && (
            <span style={{ padding: '4px 10px', background: 'var(--accent-red-light)', border: '1px solid var(--accent-red)', borderRadius: '20px', fontSize: '11px', color: 'var(--accent-red)', fontWeight: 700 }}>
              ● ACTIVE — {disaster.activeProtocol.toUpperCase()}
            </span>
          )}
          <button
            onClick={handleRequestSupport}
            style={{ padding: '7px 14px', background: 'transparent', border: '1px solid var(--border-normal)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}
          >
            🆘 Request Support
          </button>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          {!mapLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', zIndex: 5 }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺</div>
                Loading incident map...
              </div>
            </div>
          )}
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* ===== RIGHT — Response Panel ===== */}
      <div style={{ width: '320px', flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface-2)' }}>
        {/* Selected Incident Detail */}
        {selectedIncident ? (
          <>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                {selectedIncident.status === 'active' ? '● Active Incident' : '✓ Resolved'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedIncident.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedIncident.location}</div>
              {selectedIncident.affectedCount && (
                <div style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: 600, marginTop: '8px' }}>
                  ⚠ {selectedIncident.affectedCount.toLocaleString()} residents affected
                </div>
              )}
              <button
                onClick={() => setEndConfirm(selectedIncident.id)}
                style={{ marginTop: '10px', padding: '6px 12px', background: 'var(--accent-red-light)', border: '1px solid var(--accent-red)', borderRadius: '5px', color: 'var(--accent-red)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                End Incident
              </button>
            </div>

            {/* Response Timeline */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Response Timeline</div>
              {disaster.responseTimeline.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '11px' }}>
                  Execute a protocol to generate response timeline
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  <div style={{ position: 'absolute', left: '7px', top: '12px', bottom: '12px', width: '1px', background: 'var(--border-subtle)' }} />
                  {disaster.responseTimeline.map((step, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: '16px' }}>
                      <div style={{
                        position: 'absolute', left: '-20px', top: '2px',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: step.status === 'done' ? 'var(--accent-teal)' : step.status === 'active' ? 'var(--accent-amber)' : 'var(--text-disabled)',
                        border: step.status === 'active' ? '2px solid var(--accent-amber)' : 'none',
                        animation: step.status === 'active' ? 'live-pulse 1.5s ease-in-out infinite' : 'none',
                      }} />
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{step.time}</div>
                      <div style={{ fontSize: '12px', color: step.status === 'done' ? 'var(--text-primary)' : step.status === 'active' ? 'var(--accent-amber)' : 'var(--text-disabled)' }}>
                        {step.action}
                      </div>
                      {step.status === 'done' && <div style={{ fontSize: '10px', color: 'var(--accent-teal)', marginTop: '2px' }}>✓ Complete</div>}
                      {step.status === 'active' && <div style={{ fontSize: '10px', color: 'var(--accent-amber)', marginTop: '2px' }}>→ In Progress</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👈</div>
              <div style={{ fontSize: '12px' }}>Select an incident to view details</div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProtocolModal && (
        <ProtocolModal
          onClose={() => setShowProtocolModal(false)}
          onActivate={(protocol) => {
            disaster.activateProtocol(protocol);
            addNotification({ title: 'Protocol Activated', message: `${protocol.toUpperCase()} response protocol activated — teams notified`, severity: 'success' });
          }}
        />
      )}

      {showResourceDrawer && <ResourceDrawer onClose={() => setShowResourceDrawer(false)} />}

      {/* End Incident Confirmation */}
      {endConfirm && (
        <>
          <div onClick={() => setEndConfirm(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 300 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: 'var(--bg-surface-1)', border: '1px solid var(--border-normal)', borderRadius: '12px',
            padding: '24px', width: '360px', zIndex: 301, boxShadow: '0 8px 32px rgba(15,23,42,0.08)',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>End Incident?</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              This will archive the incident and export the response timeline to Reports. This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEndConfirm(null)} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Cancel</button>
              <button onClick={() => handleEndIncident(endConfirm)} style={{ padding: '8px 16px', background: 'var(--accent-red)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                End Incident
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
