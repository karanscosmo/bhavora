"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SavedScenario {
  id: string;
  name: string;
  creator: string;
  date: string;
  version: string;
  inputs: {
    evAdoption: number;
    popGrowth: number;
    indExpansion: number;
    metroExpansion: number;
    renewableGrowth: number;
    climateEvent: string;
    disasterEvent: string;
  };
  metrics: {
    energyDemand: number;
    carbonEmissions: number;
    trafficCongestion: number;
    waterDemand: number;
    jobsCreated: number;
    infrastructureStress: number;
  };
}

export default function ScenariosPage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<any | null>(null);

  // Preset Configurations
  const presets: SavedScenario[] = [
    {
      id: "preset-ev-2035",
      name: "EV Revolution 2035",
      creator: "Bugs2Bucks Plan",
      date: "2026-06-26 18:20",
      version: "v3.0.4",
      inputs: { evAdoption: 80, popGrowth: 12, indExpansion: 4, metroExpansion: 2, renewableGrowth: 60, climateEvent: "None", disasterEvent: "None" },
      metrics: { energyDemand: 24.2, carbonEmissions: -18.4, trafficCongestion: -12.2, waterDemand: 4.8, jobsCreated: 14.0, infrastructureStress: 68.0 }
    },
    {
      id: "preset-tech-boom",
      name: "North Corridor Tech Boom",
      creator: "BBMP Dev Cluster",
      date: "2026-06-25 10:14",
      version: "v2.8.1",
      inputs: { evAdoption: 30, popGrowth: 25, indExpansion: 12, metroExpansion: 4, renewableGrowth: 35, climateEvent: "None", disasterEvent: "None" },
      metrics: { energyDemand: 38.5, carbonEmissions: 22.0, trafficCongestion: 18.2, waterDemand: 18.6, jobsCreated: 32.4, infrastructureStress: 84.5 }
    },
    {
      id: "preset-extreme-monsoon",
      name: "Extreme Monsoon Resilience",
      creator: "Urban Disaster Cell",
      date: "2026-06-24 16:45",
      version: "v3.0.0",
      inputs: { evAdoption: 45, popGrowth: 12, indExpansion: 4, metroExpansion: 2, renewableGrowth: 25, climateEvent: "100-Year Flood", disasterEvent: "Substation Failure" },
      metrics: { energyDemand: 14.8, carbonEmissions: -4.2, trafficCongestion: 32.5, waterDemand: 6.2, jobsCreated: 8.5, infrastructureStress: 92.2 }
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bhavoraCustomScenarios');
      if (stored) {
        setScenarios([...presets, ...JSON.parse(stored)]);
      } else {
        setScenarios(presets);
      }
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleLoad = (scenario: SavedScenario) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('simulationResults', JSON.stringify({
        metrics: scenario.metrics,
        recommendations: [
          `Loaded from scenario profile: ${scenario.name}. Confidence score fits historical validation standards.`,
          "Substation grid stability margins are monitored.",
        ],
        timeline: [
          { year: 2025, energy: 4.2, traffic: 100 },
          { year: 2035, energy: 4.2 + (scenario.metrics.energyDemand * 0.1), traffic: 100 + (scenario.metrics.trafficCongestion * 0.1) }
        ]
      }));
    }
    router.push('/simulation-results');
  };

  const handleCompare = () => {
    if (selectedIds.length !== 2) return;
    const item1 = scenarios.find(x => x.id === selectedIds[0]);
    const item2 = scenarios.find(x => x.id === selectedIds[1]);
    if (!item1 || !item2) return;

    setCompareResult({
      name1: item1.name,
      name2: item2.name,
      diffs: [
        { label: "Energy Impact", val1: `${item1.metrics.energyDemand}%`, val2: `${item2.metrics.energyDemand}%` },
        { label: "CO2 Emissions", val1: `${item1.metrics.carbonEmissions}%`, val2: `${item2.metrics.carbonEmissions}%` },
        { label: "Traffic Index", val1: `${item1.metrics.trafficCongestion}%`, val2: `${item2.metrics.trafficCongestion}%` },
        { label: "Urban Stress Score", val1: `${item1.metrics.infrastructureStress}/100`, val2: `${item2.metrics.infrastructureStress}/100` }
      ]
    });
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
            <span>Scenario Management</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Saved Profiles</span>
          </nav>
          <h1 className="font-display-sm text-display-sm text-on-surface">Scenario Library</h1>
          <p className="text-on-surface-variant font-body-md max-w-xl">
            Save, load, and run comparative stress tests between configured policy simulations.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            disabled={selectedIds.length !== 2}
            onClick={handleCompare}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:scale-100 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">compare</span>
            Compare Selected ({selectedIds.length}/2)
          </button>
        </div>
      </div>

      {/* Comparisons Alert Details */}
      {compareResult && (
        <div className="bg-primary-fixed/20 border border-primary/20 rounded-3xl p-6 relative animate-scale-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary text-base flex items-center gap-2">
              <span className="material-symbols-outlined">analytics</span>
              Comparative Variance Summary
            </h3>
            <button 
              onClick={() => setCompareResult(null)}
              className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold underline"
            >
              Clear Comparison
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {compareResult.diffs.map((d: any) => (
              <div key={d.label} className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10 text-center">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">{d.label}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="border-r border-outline-variant/20 pr-1">
                    <p className="text-gray-400 font-medium truncate" title={compareResult.name1}>{compareResult.name1}</p>
                    <p className="font-bold text-on-surface mt-1">{d.val1}</p>
                  </div>
                  <div className="pl-1">
                    <p className="text-primary font-medium truncate" title={compareResult.name2}>{compareResult.name2}</p>
                    <p className="font-bold text-primary mt-1">{d.val2}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenario List */}
      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((scen, i) => {
          const isSelected = selectedIds.includes(scen.id);
          return (
            <div 
              key={scen.id}
              className={`bg-white/80 backdrop-blur-xl border rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 shadow-sm ${
                isSelected ? 'border-primary ring-2 ring-primary/10' : 'border-outline-variant/30 hover:shadow-md'
              }`}
              style={{ animation: `fade-slide-in 0.4s ease-out ${i * 100}ms both` }}
            >
              {/* Checkbox and Details */}
              <div className="flex items-center gap-4 flex-1">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => handleSelect(scen.id)}
                  className="w-4.5 h-4.5 text-primary border-outline-variant/50 rounded cursor-pointer accent-primary focus:ring-0"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-on-surface text-base">{scen.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">account_circle</span> {scen.creator}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {scen.date}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">history</span> Engine {scen.version}</span>
                  </div>
                </div>
              </div>

              {/* Slider variables values overview */}
              <div className="flex flex-wrap gap-2 py-2 md:py-0">
                <span className="px-2.5 py-1 bg-surface-container rounded-lg text-[10px] font-mono text-on-surface-variant font-medium">EV: {scen.inputs.evAdoption}%</span>
                <span className="px-2.5 py-1 bg-surface-container rounded-lg text-[10px] font-mono text-on-surface-variant font-medium">Pop: +{scen.inputs.popGrowth}%</span>
                <span className="px-2.5 py-1 bg-surface-container rounded-lg text-[10px] font-mono text-on-surface-variant font-medium">Grid Mix: {scen.inputs.renewableGrowth}%</span>
              </div>

              {/* Load Action Button */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t border-outline-variant/10 pt-4 md:border-t-0 md:pt-0">
                <button 
                  onClick={() => handleLoad(scen)}
                  className="w-full md:w-auto px-4 py-2 border border-outline-variant/40 hover:bg-surface-container hover:border-outline-variant/80 rounded-xl text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">file_open</span>
                  Load Results
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Version Logs / Timeline */}
      <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-on-surface text-base mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">history_toggle_off</span>
          Engine Execution History
        </h3>
        <div className="relative border-l border-outline-variant/30 pl-6 ml-4 space-y-6 text-xs text-on-surface-variant font-medium">
          <div className="relative">
            <span className="absolute -left-[30px] top-0 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-on-surface font-bold">Scenario EV Revolution 2035 run successfully</p>
                <p className="text-[10px] mt-0.5">Parameters: EV Adoption 80%, Renewables 60%</p>
              </div>
              <span className="text-[10px] font-mono">Today, 18:20</span>
            </div>
          </div>
          <div className="relative">
            <span className="absolute -left-[30px] top-0 w-3 h-3 bg-outline-variant border-2 border-white rounded-full"></span>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-on-surface">Zoning strategy query executed</p>
                <p className="text-[10px] mt-0.5">District: Hebbal Corridor</p>
              </div>
              <span className="text-[10px] font-mono">Yesterday, 10:14</span>
            </div>
          </div>
          <div className="relative">
            <span className="absolute -left-[30px] top-0 w-3 h-3 bg-outline-variant border-2 border-white rounded-full"></span>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-on-surface">Flood simulation sync failed (Network Timeout)</p>
                <p className="text-[10px] mt-0.5 text-error">Resolved with localized fallback execution weights</p>
              </div>
              <span className="text-[10px] font-mono">Yesterday, 09:42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
