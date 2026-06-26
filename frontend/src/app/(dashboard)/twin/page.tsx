"use client";

import React, { useState } from 'react';

export default function TwinPage() {
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    traffic: true,
    metro: false,
    water: false,
    power: false,
    ev: false,
    industrial: false
  });

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-screen Mapbox-style placeholder */}
      <div className="absolute inset-0 z-0 bg-[#e5eeff]">
        <div 
          className="w-full h-full bg-cover bg-center transition-opacity duration-700" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }}
        />
      </div>

      {/* District Markers & Hover Cards */}
      {/* Whitefield */}
      <div className="absolute top-[40%] left-[70%] group z-10">
        <div className="w-6 h-6 bg-primary/40 border-2 border-primary rounded-full flex items-center justify-center animate-pulse cursor-pointer hover:scale-125 transition-transform">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-headline-sm text-on-surface">Whitefield</h4>
            <span className="px-2 py-0.5 bg-error-container text-error text-xs font-bold rounded">High Risk</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant">Population</p>
              <p className="text-body-md font-bold text-on-surface">1.2M</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Traffic Load</p>
              <p className="text-body-md font-bold text-error">94%</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Energy Health</p>
              <p className="text-body-md font-bold text-on-surface">Stable</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Risk Score</p>
              <p className="text-body-md font-bold text-on-surface">8.4/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Electronic City */}
      <div className="absolute top-[75%] left-[60%] group z-10">
        <div className="w-6 h-6 bg-tertiary/40 border-2 border-tertiary rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
          <div className="w-2 h-2 bg-tertiary rounded-full"></div>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-headline-sm text-on-surface">Electronic City</h4>
            <span className="px-2 py-0.5 bg-tertiary/20 text-tertiary text-xs font-bold rounded">Optimal</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant">Population</p>
              <p className="text-body-md font-bold text-on-surface">0.8M</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Traffic Load</p>
              <p className="text-body-md font-bold text-on-surface">62%</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Energy Health</p>
              <p className="text-body-md font-bold text-tertiary">100%</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Risk Score</p>
              <p className="text-body-md font-bold text-on-surface">3.1/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Controls Panel */}
      <div className="absolute top-6 right-6 w-72 bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-5 rounded-2xl shadow-xl z-20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-on-surface">Layer Controls</span>
          <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer">info</span>
        </div>
        <div className="space-y-3">
          {[
            { id: 'traffic', name: 'Traffic Congestion', icon: 'traffic', color: 'primary' },
            { id: 'metro', name: 'Metro Connectivity', icon: 'subway', color: 'secondary' },
            { id: 'water', name: 'Water Distribution', icon: 'water_drop', color: 'blue-600' },
            { id: 'power', name: 'Power Grid', icon: 'bolt', color: 'amber-600' },
            { id: 'ev', name: 'EV Network', icon: 'ev_station', color: 'tertiary' },
            { id: 'industrial', name: 'Industrial Zones', icon: 'factory', color: 'on-surface' }
          ].map(layer => (
            <div 
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className="flex items-center justify-between p-2 hover:bg-surface-container-high/50 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded bg-${layer.color === 'on-surface' ? 'primary' : layer.color}/10 flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-${layer.color} text-[20px]`}>{layer.icon}</span>
                </div>
                <span className="text-body-sm font-medium">{layer.name}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative p-0.5 transition-colors ${activeLayers[layer.id] ? 'bg-primary' : 'bg-outline-variant'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${activeLayers[layer.id] ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Visualization</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded uppercase">Real-time Data</span>
            <span className="px-2 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded uppercase">Sensor Mesh</span>
          </div>
        </div>
      </div>

      {/* Floating Analytics Panel */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-4 z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-4 rounded-2xl shadow-xl w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              <span className="text-body-sm font-bold text-on-surface">City Health Index</span>
            </div>
            <span className="text-mono-label bg-surface-container px-2 py-1 rounded">68/100</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface-variant">Urban Resilience</span>
                <span className="text-on-surface font-bold">72%</span>
              </div>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface-variant">Carbon Footprint</span>
                <span className="text-on-surface font-bold">+12%</span>
              </div>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-error" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                <span className="text-[10px] font-medium text-on-surface-variant">Projected growth in Hebbal</span>
              </div>
              <span className="text-[10px] font-bold text-primary">+4.2%</span>
            </div>
          </div>
        </div>
        
        {/* Mini Map Controls */}
        <div className="flex gap-2">
          {['add', 'remove', 'explore'].map(icon => (
            <button key={icon} className="w-10 h-10 bg-white/80 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white active:scale-95 transition-all shadow-md">
              <span className="material-symbols-outlined text-on-surface">{icon}</span>
            </button>
          ))}
          <button className="px-4 h-10 bg-white/80 backdrop-blur-xl rounded-xl flex items-center gap-2 hover:bg-white active:scale-95 transition-all shadow-md">
            <span className="material-symbols-outlined text-on-surface text-sm">layers</span>
            <span className="text-body-sm font-medium">3D View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
