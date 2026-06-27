"use client";

import React, { useState } from 'react';
import { BarChart2, Bell, ChevronRight } from 'lucide-react';


export default function SettingsPage() {
  const [confidence, setConfidence] = useState(95);
  const [horizon, setHorizon] = useState(15);
  const [notifications, setNotifications] = useState({
    trafficAlerts: true,
    gridAlerts: true,
    weeklyDigest: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
          <span>Identity Center</span>
          <ChevronRight />
          <span className="text-primary font-bold">Preferences</span>
        </nav>
        <h1 className="font-display-sm text-display-sm text-on-surface">System Settings</h1>
        <p className="text-on-surface-variant font-body-md max-w-xl">
          Configure model parameters, dashboard preferences, and alert thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simulation Settings */}
        <div className="lg:col-span-8 bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/10 pb-3 flex items-center gap-2">
            <BarChart2 />
            Simulation Engine Calibration
          </h3>

          <div className="space-y-6 text-xs">
            {/* Slider 1: Confidence Interval */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-on-surface-variant">Model Confidence Cutoff</span>
                <span className="text-primary font-mono">{confidence}%</span>
              </div>
              <input 
                type="range" min="80" max="99" value={confidence} 
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <p className="text-[10px] text-gray-400">Ignore calculations yielding statistical accuracy scores beneath this limit.</p>
            </div>

            {/* Slider 2: Forecasting Horizon */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-on-surface-variant">Default Timeline Horizon</span>
                <span className="text-primary font-mono">{horizon} years</span>
              </div>
              <input 
                type="range" min="5" max="30" value={horizon} 
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <p className="text-[10px] text-gray-400">Standard projection interval displayed across scenario results.</p>
            </div>

            <div className="pt-4 border-t border-outline-variant/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">GIS Database Source</p>
                <select className="w-full bg-surface-container border-none text-[12px] rounded-xl px-3 py-2 outline-none cursor-pointer">
                  <option>Bangalore Open GIS Node (Primary)</option>
                  <option>Karnataka Land Records Database</option>
                  <option>System Mock Simulation</option>
                </select>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Auto-calibration Interval</p>
                <select className="w-full bg-surface-container border-none text-[12px] rounded-xl px-3 py-2 outline-none cursor-pointer">
                  <option>Every 24 Hours</option>
                  <option>Every 7 Days</option>
                  <option>Manual Sync Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Toggles */}
        <div className="lg:col-span-4 bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/10 pb-3 mb-4 flex items-center gap-2">
              <Bell />
              Alert Preferences
            </h3>

            <div className="space-y-4">
              <div 
                onClick={() => toggleNotification('trafficAlerts')}
                className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold text-on-surface">Traffic Congestion</p>
                  <p className="text-[9px] text-on-surface-variant">Notify when index &gt; 80%</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full relative p-0.5 transition-colors ${notifications.trafficAlerts ? 'bg-primary' : 'bg-outline-variant'}`}>
                  <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${notifications.trafficAlerts ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>

              <div 
                onClick={() => toggleNotification('gridAlerts')}
                className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold text-on-surface">Grid Peak Overloads</p>
                  <p className="text-[9px] text-on-surface-variant">Notify when capacity stress &gt; 90%</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full relative p-0.5 transition-colors ${notifications.gridAlerts ? 'bg-primary' : 'bg-outline-variant'}`}>
                  <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${notifications.gridAlerts ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>

              <div 
                onClick={() => toggleNotification('weeklyDigest')}
                className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold text-on-surface">Weekly Strategy Digest</p>
                  <p className="text-[9px] text-on-surface-variant">Send compiled PDF chapters</p>
                </div>
                <div className={`w-8 h-4.5 rounded-full relative p-0.5 transition-colors ${notifications.weeklyDigest ? 'bg-primary' : 'bg-outline-variant'}`}>
                  <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${notifications.weeklyDigest ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 bg-primary text-white py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md">
            Save System Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
