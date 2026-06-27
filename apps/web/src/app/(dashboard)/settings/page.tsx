"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/stores';
import { ChevronRight, BarChart2, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { addNotification } = useAppStore();
  const [confidence, setConfidence] = useState(90);
  const [horizon, setHorizon] = useState(15);
  const [notifications, setNotifications] = useState({
    trafficAlerts: true,
    gridAlerts: true,
    weeklyDigest: false,
    disasterAlerts: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    addNotification({ title: 'Preferences Saved', message: 'System configuration parameters updated successfully', severity: 'success' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span>Identity Center</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: '#00D4FF', fontWeight: 600 }}>Preferences</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>System Settings</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Configure model parameters, dashboard preferences, and alert thresholds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px', alignItems: 'start' }}>
        
        {/* Left: Simulation & Calibration Settings */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(10,22,40,0.85)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={16} style={{ color: '#00D4FF' }} />
            <span>Simulation Engine Calibration</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Slider 1: Confidence Interval */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                <span>Model Confidence Cutoff</span>
                <span style={{ color: '#00D4FF', fontFamily: 'monospace' }}>{confidence}%</span>
              </div>
              <input
                type="range" min="80" max="98" step="2" value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00D4FF', cursor: 'pointer' }}
              />
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Ignore calculations yielding statistical accuracy scores beneath this limit.</p>
            </div>

            {/* Slider 2: Forecasting Horizon */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                <span>Default Timeline Horizon</span>
                <span style={{ color: '#00D4FF', fontFamily: 'monospace' }}>{horizon} years</span>
              </div>
              <input
                type="range" min="5" max="30" step="5" value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00D4FF', cursor: 'pointer' }}
              />
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Standard projection interval displayed across scenario results.</p>
            </div>

            {/* Selects */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>GIS Database Source</label>
                <select className="input-dark" style={{ width: '100%', fontSize: '12px', cursor: 'pointer' }}>
                  <option>Bangalore Open GIS Node (Primary)</option>
                  <option>Karnataka Land Records Database</option>
                  <option>Active Production Mode</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Auto-calibration Interval</label>
                <select className="input-dark" style={{ width: '100%', fontSize: '12px', cursor: 'pointer' }}>
                  <option>Every 24 Hours</option>
                  <option>Every 7 Days</option>
                  <option>Manual Sync Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notifications & Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(10,22,40,0.85)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} style={{ color: '#F59E0B' }} />
              <span>Alert Preferences</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: 'trafficAlerts', name: 'Traffic Congestion', desc: 'Notify when index > 80%' },
                { key: 'gridAlerts', name: 'Grid Peak Overloads', desc: 'Notify when capacity stress > 90%' },
                { key: 'weeklyDigest', name: 'Weekly Strategy Digest', desc: 'Send compiled PDF chapters' },
                { key: 'disasterAlerts', name: 'Disaster Warning Triggers', desc: 'Evacuation notifications' },
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => toggleNotification(item.key as any)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)',
                    borderRadius: '8px', cursor: 'pointer', transition: 'all 120ms'
                  }}
                  className="hover:bg-[rgba(255,255,255,0.03)]"
                >
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <div style={{
                    width: '32px', height: '18px', borderRadius: '20px',
                    background: (notifications as any)[item.key] ? '#00D4FF' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 150ms',
                  }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '50%', background: '#0A1628',
                      position: 'absolute', top: '2px',
                      left: (notifications as any)[item.key] ? '16px' : '2px',
                      transition: 'left 150ms'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, #00D4FF, #0099CC)', color: '#050A14',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(0,212,255,0.2)'
            }}
          >
            <Save size={16} /> Save System Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
