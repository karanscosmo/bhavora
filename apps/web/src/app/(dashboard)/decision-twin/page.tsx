"use client";

import React, { useState } from 'react';
import { useSimulationStore } from '@/stores';
import { Train, Zap, Route, Sun, Droplet, Leaf, Factory, Activity, CheckCircle2, AlertTriangle, Play, Map as MapIcon, Database, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { BlindSpotAlert } from '@/components/ui/BlindSpotAlert';
import { ConsequenceTree } from '@/components/ui/ConsequenceTree';
import { CityMapTwin } from '@/components/ui/CityMapTwin';
import Link from 'next/link';

const SLIDER_ICON_MAP: Record<string, React.ReactNode> = {
  train: <Train size={18} />,
  zap: <Zap size={18} />,
  route: <Route size={18} />,
  sun: <Sun size={18} />,
  droplet: <Droplet size={18} />,
  leaf: <Leaf size={18} />,
  factory: <Factory size={18} />,
};

function PolicySlider({
  label, description, value, onChange, icon, 
}: {
  label: string; description: string;
  value: number; onChange: (v: number) => void; icon: string; 
}) {
  return (
    <div className="py-4 border-b border-[var(--border-subtle)] group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
            {SLIDER_ICON_MAP[icon] || <Activity size={16} />}
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight max-w-[200px]">{description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-[var(--accent-primary)] font-mono">{value}%</span>
        </div>
      </div>

      <div className="relative h-6 flex items-center mt-2 group/slider">
        <div className="absolute inset-x-0 h-1.5 bg-[var(--bg-surface-3)] rounded-full" />
        <div className="absolute left-0 h-1.5 rounded-full bg-[var(--accent-primary)]" style={{ width: `${value}%` }} />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute h-4 w-4 bg-white border-2 border-[var(--accent-primary)] rounded-full shadow-md pointer-events-none transition-transform group-hover/slider:scale-110" 
          style={{ left: `calc(${value}% - 8px)` }} 
        />
      </div>
    </div>
  );
}

export default function DecisionTwinPage() {
  const store = useSimulationStore();
  const { activePolicy, setPolicy, results, isComputing } = store;
  const [year, setYear] = useState(2025);

  const formatDelta = (val: number, unit: string) => {
    if (val === 0) return 'No Change';
    const sign = val > 0 ? '+' : '';
    return `${sign}${val} ${unit}`;
  };

  const getDeltaColor = (val: number, inverseGood = false) => {
    if (val === 0) return 'text-[var(--text-secondary)]';
    const isGood = inverseGood ? val < 0 : val > 0;
    return isGood ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-1">
            <Activity size={28} className="text-[var(--accent-primary)]" />
            Decision Twin
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Simulate urban policies and observe spatial cascading consequences.</p>
        </div>
        <div className="flex gap-4 items-center bg-[var(--bg-surface-2)] p-2 rounded-lg border border-[var(--border-subtle)]">
           <div className="px-3 py-1 flex items-center gap-2">
            <Database size={14} className="text-[var(--text-muted)]"/>
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">Confidence: {(results.confidence * 100).toFixed(0)}%</span>
           </div>
           <Link href="/war-room" className="btn btn-secondary py-1.5 px-3 text-xs">Save Scenario</Link>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
        
        {/* LEFT PANEL: POLICY CONTROLS */}
        <div className="lg:col-span-3 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
            <h2 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Play size={16} className={isComputing ? 'text-[#2563EB] animate-pulse' : 'text-[var(--accent-primary)]'} /> Policy Engine
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <PolicySlider
              label="Metro Expansion" description="Accelerate Phase 3 & 4 alignment."
              value={activePolicy.metroExpansion} onChange={(v) => setPolicy({ metroExpansion: v })}
              icon="train"
            />
            <PolicySlider
              label="EV Adoption Subsidy" description="Incentivize commercial EV transition."
              value={activePolicy.evAdoptionRate} onChange={(v) => setPolicy({ evAdoptionRate: v })}
              icon="zap"
            />
            <PolicySlider
              label="Road Capacity Boost" description="Widening & grade separators."
              value={activePolicy.roadCapacity} onChange={(v) => setPolicy({ roadCapacity: v })}
              icon="route"
            />
            <PolicySlider
              label="Grid Renewable %" description="Mandate solar/wind PPAs."
              value={activePolicy.renewableShare} onChange={(v) => setPolicy({ renewableShare: v })}
              icon="sun"
            />
            <PolicySlider
              label="Water Infrastructure" description="STP & Pipeline leakage reduction."
              value={activePolicy.waterInfrastructure} onChange={(v) => setPolicy({ waterInfrastructure: v })}
              icon="droplet"
            />
            <PolicySlider
              label="Industrial Zoning" description="Expand tech parks & manufacturing."
              value={activePolicy.industrialZoning} onChange={(v) => setPolicy({ industrialZoning: v })}
              icon="factory"
            />
          </div>
        </div>

        {/* CENTER PANEL: LIVE DIGITAL TWIN */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex-1 relative rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-sm bg-[var(--slate-900)]">
             <CityMapTwin year={year} />
             {/* Map Overlays */}
             <div className="absolute top-4 left-4 bg-[var(--slate-900)]/80 backdrop-blur border border-[var(--slate-700)] rounded p-3 text-white">
                <div className="text-[10px] font-bold tracking-widest uppercase mb-1">Spatial Impact Engine</div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-[10px] text-gray-400">Congestion</div>
                    <div className="text-sm font-bold text-green-400">{results.traffic.delta < 0 ? '' : '+'}{results.traffic.delta}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Carbon</div>
                    <div className="text-sm font-bold text-green-400">{results.co2.delta < 0 ? '' : '+'}{(results.co2.delta / 1000).toFixed(1)} mtCO₂</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">City Health</div>
                    <div className="text-sm font-bold text-blue-400">{results.cityHealth.after}/100</div>
                  </div>
                </div>
             </div>
             
             {/* Temporal Slider embedded in map */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--slate-900)]/90 backdrop-blur border border-[var(--slate-700)] rounded-xl px-6 py-4 w-[80%] max-w-[500px] flex items-center gap-6 shadow-2xl">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[var(--slate-400)] font-bold uppercase tracking-wider mb-1">Projection</span>
                  <span className="font-mono font-bold text-xl text-white">{year}</span>
                </div>
                <div className="flex-1 relative flex items-center">
                  <input 
                    type="range" min={2025} max={2050} step={1} value={year} 
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full h-1 bg-[var(--slate-700)] rounded-full appearance-none outline-none accent-[#3B82F6]"
                  />
                </div>
             </div>
          </div>
          
          {/* BOTTOM FORECAST PANEL */}
          <div className="h-40 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm p-4 overflow-x-auto flex gap-4">
            {results.districts.map(d => (
              <div key={d.id} className="min-w-[180px] p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex flex-col justify-between">
                 <div>
                   <h4 className="font-bold text-sm text-[var(--text-primary)]">{d.name}</h4>
                   <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Impact Score</div>
                 </div>
                 <div className="flex items-end justify-between mt-2">
                   <span className={`text-2xl font-black ${d.impactScore > 60 ? 'text-[var(--accent-primary)]' : 'text-[var(--slate-500)]'}`}>
                     {d.impactScore}
                   </span>
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                     d.investmentPriority === 'High' ? 'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]' :
                     d.investmentPriority === 'Medium' ? 'bg-[var(--accent-warning)]/10 text-[var(--accent-warning)]' :
                     'bg-[var(--slate-200)] text-[var(--slate-600)]'
                   }`}>
                     {d.investmentPriority}
                   </span>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: CASCADING CONSEQUENCES */}
        <div className="lg:col-span-3 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col overflow-hidden">
           <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex items-center justify-between">
            <h2 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Activity size={16} className="text-[var(--accent-warning)]" /> Cascading Impact
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* Blind Spots */}
            {results.blindSpots.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Model Blind Spots</h3>
                <BlindSpotAlert blindSpots={results.blindSpots} />
              </div>
            )}
            
            {/* Interactive Graph (Tree) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Consequence Graph</h3>
              {results.cascadingEffects.length > 0 ? (
                <ConsequenceTree nodes={results.cascadingEffects} />
              ) : (
                <div className="text-sm text-[var(--text-secondary)] italic text-center py-8">
                  Adjust policies to generate cascading consequence graphs.
                </div>
              )}
            </div>
            
            {/* Model Confidence */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
               <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Engine Modules</h3>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs">
                   <span className="text-[var(--text-secondary)]">Transport (BPR)</span>
                   <span className="font-mono text-[var(--text-primary)] font-bold">87% Conf.</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-[var(--text-secondary)]">Energy (LDC)</span>
                   <span className="font-mono text-[var(--text-primary)] font-bold">89% Conf.</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span className="text-[var(--text-secondary)]">Water (IWA)</span>
                   <span className="font-mono text-[var(--text-primary)] font-bold">84% Conf.</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
