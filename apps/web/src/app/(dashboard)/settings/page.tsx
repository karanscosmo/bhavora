"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/stores';
import { ChevronRight, BarChart2, Bell, Shield, Save } from 'lucide-react';
import Link from 'next/link';

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
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-64px)] overflow-y-auto bg-[var(--bg-base)]">
      
      {/* Header */}
      <div className="mb-8">
        <nav className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>System Config</span>
          <ChevronRight size={12} />
          <span className="text-[#2563EB]">Preferences</span>
        </nav>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">System Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Configure model parameters, dashboard preferences, and alert thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Simulation & Calibration Settings */}
        <div className="card p-6 lg:col-span-2 space-y-8">
          <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3 flex items-center gap-2">
            <BarChart2 size={16} className="text-[#2563EB]" />
            Simulation Engine Calibration
          </h3>

          <div className="space-y-6">
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-[var(--text-primary)] mb-2">
                <span>Model Confidence Cutoff</span>
                <span className="text-[#2563EB] font-mono">{confidence}%</span>
              </div>
              <input
                type="range" min="80" max="98" step="2" value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-2">Ignore calculations yielding statistical accuracy scores beneath this limit.</p>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between text-sm font-semibold text-[var(--text-primary)] mb-2">
                <span>Default Timeline Horizon</span>
                <span className="text-[#2563EB] font-mono">{horizon} years</span>
              </div>
              <input
                type="range" min="5" max="30" step="5" value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-2">Standard projection interval displayed across scenario results.</p>
            </div>

            {/* Selects */}
            <div className="border-t border-[var(--border-subtle)] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">GIS Database Source</label>
                <select className="input w-full text-sm">
                  <option>Bangalore Open GIS Node (Primary)</option>
                  <option>Karnataka Land Records Database</option>
                  <option>Active Production Mode</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Auto-calibration Interval</label>
                <select className="input w-full text-sm">
                  <option>Every 24 Hours</option>
                  <option>Every 7 Days</option>
                  <option>Manual Sync Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notifications & Toggles */}
        <div className="space-y-6">
          
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3 flex items-center gap-2 mb-4">
              <Bell size={16} className="text-[#F59E0B]" />
              Alert Preferences
            </h3>

            <div className="space-y-3">
              {[
                { key: 'trafficAlerts', name: 'Traffic Congestion', desc: 'Notify when index > 80%' },
                { key: 'gridAlerts', name: 'Grid Peak Overloads', desc: 'Notify when capacity stress > 90%' },
                { key: 'weeklyDigest', name: 'Weekly Strategy Digest', desc: 'Send compiled PDF chapters' },
                { key: 'disasterAlerts', name: 'Disaster Warning Triggers', desc: 'Evacuation notifications' },
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => toggleNotification(item.key as any)}
                  className="flex justify-between items-center p-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-2)] cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{item.desc}</div>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${
                    (notifications as any)[item.key] ? 'bg-[#2563EB]' : 'bg-[var(--bg-surface-3)]'
                  }`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                      (notifications as any)[item.key] ? 'left-[18px]' : 'left-0.5'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 border-l-4 border-l-[#EF4444]">
            <h3 className="text-sm font-bold text-[#EF4444] mb-2 flex items-center gap-2">
              <Shield size={16} />
              Danger Zone
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Reset all system preferences and calibration weights to factory defaults.
            </p>
            <button className="btn w-full btn-danger text-xs font-semibold">
              Factory Reset System
            </button>
          </div>

          <button
            onClick={handleSave}
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-md"
          >
            <Save size={16} />
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
