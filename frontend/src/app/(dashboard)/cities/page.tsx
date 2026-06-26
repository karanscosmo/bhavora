"use client";

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

interface District {
  id: string;
  name: string;
  population: string;
  traffic: number;
  energy: string;
  risk: string;
  x: string; // Left offset % for mock layout positioning
  y: string; // Top offset % for mock layout positioning
  status: 'High Risk' | 'Optimal' | 'Normal';
  statusColor: string;
  statusBg: string;
}

export default function CitiesPage() {
  const store = useSimulationStore();
  const { metrics, popGrowth } = store;

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    traffic: true,
    metro: true,
    water: false,
    power: false,
    ev: false,
    industrial: false
  });

  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Dynamically compute district details based on store state
  const rawDistricts = [
    { id: "whitefield", name: "Whitefield", basePop: 1.2, baseTraffic: 94, baseEnergy: "Stable", baseRisk: 8.4, x: "70%", y: "40%" },
    { id: "electronic_city", name: "Electronic City", basePop: 0.8, baseTraffic: 62, baseEnergy: "100% Health", baseRisk: 3.1, x: "60%", y: "72%" },
    { id: "indiranagar", name: "Indiranagar", basePop: 0.45, baseTraffic: 78, baseEnergy: "92% Health", baseRisk: 5.2, x: "45%", y: "45%" },
    { id: "hebbal", name: "Hebbal", basePop: 0.6, baseTraffic: 54, baseEnergy: "96% Health", baseRisk: 4.8, x: "42%", y: "22%" },
    { id: "koramangala", name: "Koramangala", basePop: 0.55, baseTraffic: 92, baseEnergy: "Critical Load", baseRisk: 7.9, x: "52%", y: "56%" }
  ];

  const districts: District[] = rawDistricts.map(d => {
    const population = (d.basePop * (1 + popGrowth / 100)).toFixed(2) + "M";
    const traffic = Math.min(100, Math.max(10, Math.round(d.baseTraffic + metrics.trafficCongestion)));
    
    let energy = d.baseEnergy;
    if (metrics.energyDemand > 15) {
      if (d.id === 'whitefield' || d.id === 'koramangala') energy = "Critical Load";
      else if (d.id === 'electronic_city') energy = "Peak Draw";
    }

    const calculatedRisk = Math.min(10, Math.max(0, d.baseRisk + (metrics.infrastructureStress - 68) * 0.05));
    const risk = calculatedRisk.toFixed(1) + "/10";

    let status: 'High Risk' | 'Optimal' | 'Normal' = 'Normal';
    let statusColor = "text-primary";
    let statusBg = "bg-primary-fixed/20";

    if (traffic > 85 || calculatedRisk > 7.5) {
      status = 'High Risk';
      statusColor = "text-error";
      statusBg = "bg-error-container";
    } else if (traffic < 65 && calculatedRisk < 5.0) {
      status = 'Optimal';
      statusColor = "text-tertiary";
      statusBg = "bg-tertiary-container";
    }

    return {
      id: d.id,
      name: d.name,
      population,
      traffic,
      energy,
      risk,
      x: d.x,
      y: d.y,
      status,
      statusColor,
      statusBg
    };
  });

  // If a district is selected, find its updated version
  const currentSelectedDistrict = selectedDistrict 
    ? districts.find(d => d.id === selectedDistrict.id) || selectedDistrict 
    : null;

  // Global City Index Values
  const cityHealthIndex = Math.min(100, Math.max(0, Math.round(100 - metrics.infrastructureStress + 36)));
  const urbanResilience = Math.min(100, Math.max(0, Math.round(100 - metrics.infrastructureStress * 0.4)));
  const carbonDeltaStr = (metrics.carbonEmissions > 0 ? "+" : "") + metrics.carbonEmissions + "%";

  return (
    <div className="absolute inset-0 overflow-hidden flex select-none animate-fade-in">
      {/* Interactive Map (Left Panel) */}
      <div className="flex-1 relative bg-[#e5eeff] overflow-hidden">
        {/* Map Grid and Base Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 opacity-60 mix-blend-multiply" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }}
        />

        {/* Layer Graphical Filters */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {activeLayers.traffic && (
            <div className="absolute inset-0 bg-red-500/5 mix-blend-color-burn transition-all">
              <svg className="w-full h-full">
                <path d="M 100 200 L 400 350 L 700 320" fill="none" stroke="#ba1a1a" strokeWidth="4" strokeDasharray="8 6" className="animate-pulse" />
                <path d="M 300 500 L 500 560 L 600 700" fill="none" stroke="#ba1a1a" strokeWidth="3" className="animate-pulse" />
              </svg>
            </div>
          )}
          {activeLayers.metro && (
            <div className="absolute inset-0 transition-all">
              <svg className="w-full h-full">
                <path d="M 200 150 Q 420 380 600 720" fill="none" stroke="#004ac6" strokeWidth="4" />
                <path d="M 420 380 L 700 400" fill="none" stroke="#004ac6" strokeWidth="3" strokeDasharray="5" />
              </svg>
            </div>
          )}
          {activeLayers.water && (
            <div className="absolute inset-0 transition-all">
              <svg className="w-full h-full">
                <circle cx="450" cy="450" r="120" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '30s' }} />
                <circle cx="450" cy="450" r="180" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="6 12" className="animate-spin" style={{ animationDuration: '45s' }} />
              </svg>
            </div>
          )}
          {activeLayers.power && (
            <div className="absolute inset-0 transition-all">
              <svg className="w-full h-full">
                <line x1="70%" y1="40%" x2="52%" y2="56%" stroke="#d97706" strokeWidth="2" strokeDasharray="5" />
                <line x1="60%" y1="72%" x2="52%" y2="56%" stroke="#d97706" strokeWidth="2" />
                <line x1="45%" y1="45%" x2="52%" y2="56%" stroke="#d97706" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>

        {/* District Markers */}
        {districts.map(d => (
          <div 
            key={d.id} 
            className="absolute z-20 group"
            style={{ left: d.x, top: d.y }}
          >
            <div 
              onClick={() => setSelectedDistrict(selectedDistrict?.id === d.id ? null : d)}
              className={`w-6 h-6 rounded-full border-2 bg-white/40 flex items-center justify-center cursor-pointer hover:scale-125 transition-transform ${
                d.status === 'High Risk' ? 'border-error' : d.status === 'Optimal' ? 'border-tertiary' : 'border-primary'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${
                d.status === 'High Risk' ? 'bg-error animate-pulse' : d.status === 'Optimal' ? 'bg-tertiary' : 'bg-primary'
              }`} />
            </div>

            {/* Hover Tooltip (when not clicked) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white/90 backdrop-blur-xl border border-outline-variant/30 px-3 py-1.5 rounded-xl shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all whitespace-nowrap z-30">
              <span className="text-xs font-bold text-on-surface">{d.name}</span>
              <span className={`text-[10px] ml-2 font-mono ${d.statusColor}`}>{d.status}</span>
            </div>
          </div>
        ))}

        {/* District Details Floating Overlay (When Clicked) */}
        {currentSelectedDistrict && (
          <div className="absolute top-24 left-6 w-72 bg-white/95 backdrop-blur-xl border border-outline-variant/30 p-5 rounded-2xl shadow-2xl z-30 animate-scale-in">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-headline-sm text-on-surface">{currentSelectedDistrict.name}</h4>
              <span className={`px-2.5 py-0.5 ${currentSelectedDistrict.statusBg} ${currentSelectedDistrict.statusColor} text-[10px] font-bold rounded-full uppercase`}>
                {currentSelectedDistrict.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Population</p>
                <p className="text-sm font-bold text-on-surface">{currentSelectedDistrict.population}</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Traffic Load</p>
                <p className={`text-sm font-bold ${currentSelectedDistrict.traffic > 80 ? 'text-error' : 'text-on-surface'}`}>{currentSelectedDistrict.traffic}%</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Energy Grid</p>
                <p className="text-sm font-bold text-on-surface">{currentSelectedDistrict.energy}</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-semibold uppercase">Risk Score</p>
                <p className="text-sm font-bold text-on-surface">{currentSelectedDistrict.risk}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedDistrict(null)}
              className="mt-4 w-full bg-surface-container hover:bg-surface-container-high py-2 rounded-lg text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        )}

        {/* Bottom Left HUD (City Health Index) */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-4">
          <div className="bg-white/90 backdrop-blur-xl border border-outline-variant/30 p-4 rounded-2xl shadow-xl w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span></span>
                <span className="text-xs font-bold text-on-surface">City Health Index</span>
              </div>
              <span className="text-mono-label bg-surface-container text-primary font-bold px-2 py-0.5 rounded text-[11px]">{cityHealthIndex}/100</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-on-surface-variant">Urban Resilience</span>
                  <span className="text-on-surface font-bold">{urbanResilience}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-[1s]" style={{ width: `${urbanResilience}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-on-surface-variant">Carbon Footprint Change</span>
                  <span className={`font-bold ${metrics.carbonEmissions > 0 ? 'text-error' : 'text-emerald-600'}`}>{carbonDeltaStr}</span>
                </div>
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${metrics.carbonEmissions > 0 ? 'bg-error' : 'bg-emerald-500'} transition-all duration-[1s]`} style={{ width: `${Math.min(100, Math.max(10, Math.round(50 + metrics.carbonEmissions * 2)))}%` }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl border border-outline-variant/10 text-[10px]">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">trending_up</span>
                  <span>Projected growth in Hebbal Corridor</span>
                </div>
                <span className="font-bold text-primary">+{popGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Mini controls */}
          <div className="flex gap-2">
            {['add', 'remove', 'explore'].map(btn => (
              <button key={btn} className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white active:scale-95 shadow-md">
                <span className="material-symbols-outlined text-on-surface-variant">{btn}</span>
              </button>
            ))}
            <button className="px-4 h-10 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl flex items-center gap-2 hover:bg-white active:scale-95 shadow-md">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">layers</span>
              <span className="text-xs font-semibold text-on-surface-variant">3D Layer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layer Controls Panel (Right Panel) */}
      <div className="w-80 bg-white/95 border-l border-outline-variant/20 h-full shadow-2xl z-20 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-on-surface text-lg">Layer Controls</h3>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] cursor-help">info</span>
        </div>

        <div className="space-y-3 flex-1">
          {[
            { id: 'traffic', name: 'Traffic Congestion', icon: 'traffic', color: 'text-error', bg: 'bg-error-container/40' },
            { id: 'metro', name: 'Metro Connectivity', icon: 'subway', color: 'text-primary', bg: 'bg-primary-fixed/20' },
            { id: 'water', name: 'Water Distribution', icon: 'water_drop', color: 'text-blue-600', bg: 'bg-blue-50' },
            { id: 'power', name: 'Power Grid Load', icon: 'bolt', color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'ev', name: 'EV Charging Network', icon: 'ev_station', color: 'text-violet-600', bg: 'bg-violet-50' },
            { id: 'industrial', name: 'Industrial Zones', icon: 'factory', color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map(layer => (
            <div 
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className="flex items-center justify-between p-3.5 hover:bg-surface-container rounded-xl cursor-pointer group transition-colors border border-outline-variant/10"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${layer.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <span className={`material-symbols-outlined ${layer.color} text-[18px]`}>{layer.icon}</span>
                </div>
                <span className="text-[13px] font-medium text-on-surface">{layer.name}</span>
              </div>
              <div className={`w-9 h-5 rounded-full relative p-0.5 transition-colors duration-200 ${activeLayers[layer.id] ? 'bg-primary' : 'bg-outline-variant'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${activeLayers[layer.id] ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-outline-variant/30 mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Active Feeds</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-surface-container text-primary text-[9px] font-bold rounded-lg uppercase tracking-wider">Sensor Mesh v2</span>
            <span className="px-2.5 py-1 bg-surface-container text-primary text-[9px] font-bold rounded-lg uppercase tracking-wider">GIS Layer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
