"use client";

import React, { useState } from 'react';
import { useSimulationStore, useUIStore } from '@/stores';
import { Train, Zap, Route, Sun, Droplet, Leaf, Factory, Activity, Map as MapIcon, Database, ShieldAlert, HeartPulse, Gauge, Wind, CloudFog, PlugZap, Waves, Sparkles } from 'lucide-react';
import { ConsequenceTree } from '@/components/ui/ConsequenceTree';
import { SafetyImpactForecast } from '@/components/ui/SafetyImpactForecast';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CityMapTwin = dynamic(() => import('@/components/ui/CityMapTwin').then(m => m.CityMapTwin), { 
  ssr: false, 
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--slate-900)] text-white">
      <Loader2 className="animate-spin mb-4" size={32} />
      <div className="text-sm font-bold tracking-widest uppercase">Loading Bengaluru Digital Twin...</div>
    </div>
  ) 
});

function LiveTelemetryFeed() {
  const [telemetry, setTelemetry] = useState<string>('System initializing...');

  React.useEffect(() => {
    const feeds = [
      'Substation 4 (Electronic City): 92% Load [WARNING]',
      'Metro Line Purple: Punctuality 94%',
      'ORR Traffic Velocity: 14 km/h',
      'PM2.5 Sensor (Whitefield): 142 AQI',
      'Water Reservoir Level (Bellandur): 43%',
      'Grid Stability Index: 0.88'
    ];
    let i = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
      setTelemetry(`[LIVE ${timeStr}] ${feeds[i % feeds.length]}`);
      i++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex bg-black/80 rounded-md border border-[var(--border-subtle)] overflow-hidden items-center px-3 h-8 w-[320px]">
       <Activity size={12} className="text-green-400 mr-2 animate-pulse shrink-0" />
       <div className="text-[10px] font-mono text-green-400 truncate">{telemetry}</div>
    </div>
  );
}

function AIPolicyAdvisor({ policy }: { policy: any }) {
  const [insight, setInsight] = useState('Analyzing current strategy...');
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => {
      let message = '';
      if (policy.metroExpansion > 60 && policy.roadCapacity < 40) {
        message = 'Aggressive transit expansion detected. Expect massive long-term carbon reduction, but short-term construction delays will spike congestion on ORR.';
      } else if (policy.evAdoptionRate > 60 && policy.renewableShare < 30) {
        message = 'WARNING: High EV adoption without corresponding grid capacity upgrades will lead to severe brownouts in South zones. Recommend boosting Renewable Grid investment.';
      } else if (policy.industrialZoning > 50 && policy.waterInfrastructure < 40) {
        message = 'Industrial expansion exceeds current water supply limits. Whitefield and Peenya risk severe water stress. Increase Water Infra budget immediately.';
      } else {
        message = 'Balanced approach detected. Steady GDP growth expected, though climate targets may lag behind 2035 Paris Agreement goals. Consider pushing greener policies.';
      }
      setInsight(message);
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [policy]);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
      <div className="p-3 border-b border-indigo-500/20 bg-indigo-950/50 flex items-center gap-2">
        <Sparkles size={14} className="text-indigo-400" />
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Bhavishyavani AI Advisor</h2>
      </div>
      <div className="p-4 relative min-h-[90px]">
        {isTyping && (
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-75" />
            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-150" />
          </div>
        )}
        <p className={`text-xs text-indigo-100 leading-relaxed font-mono transition-opacity duration-300 ${isTyping ? 'opacity-50' : 'opacity-100'}`}>
          {insight}
        </p>
      </div>
    </div>
  );
}


const SLIDER_ICON_MAP: Record<string, React.ReactNode> = {
  train: <Train size={16} />,
  zap: <Zap size={16} />,
  route: <Route size={16} />,
  sun: <Sun size={16} />,
  droplet: <Droplet size={16} />,
  leaf: <Leaf size={16} />,
  factory: <Factory size={16} />,
};

function CompactSlider({
  label, value, onChange, icon, 
}: {
  label: string;
  value: number; onChange: (v: number) => void; icon: string; 
}) {
  return (
    <div className="flex flex-col py-2.5 border-b border-[var(--border-subtle)] group">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <div className="text-[var(--text-secondary)]">
            {SLIDER_ICON_MAP[icon] || <Activity size={16} />}
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-sm font-bold text-[var(--accent-primary)] font-mono">{value}%</span>
      </div>
      <div className="relative h-4 flex items-center group/slider w-full cursor-pointer">
        <div className="absolute inset-x-0 h-1 bg-[var(--bg-surface-3)] rounded-full" />
        <div className="absolute left-0 h-1 rounded-full bg-[var(--accent-primary)]" style={{ width: `${value}%` }} />
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute h-3 w-3 bg-white border-2 border-[var(--accent-primary)] rounded-full shadow-sm pointer-events-none transition-transform group-hover/slider:scale-125" 
          style={{ left: `calc(${value}% - 6px)` }} 
        />
      </div>
    </div>
  );
}

function TopScoreCard({ label, value, unit, icon: Icon, colorClass }: { label: string, value: number|string, unit: string, icon: any, colorClass: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border border-white/10 bg-[var(--slate-800)]/50 backdrop-blur-sm ${colorClass}`}>
       <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
         <Icon size={14} /> {label}
       </div>
       <div className="font-mono font-black text-2xl tracking-tight">
         {value} <span className="text-[10px] font-sans opacity-70 uppercase tracking-widest ml-1">{unit}</span>
       </div>
    </div>
  );
}

export default function DecisionTwinPage() {
  const store = useSimulationStore();
  const { activePolicy, setPolicy, results, isComputing } = store;
  const { openSaveScenario } = useUIStore();
  const [year, setYear] = useState(2025);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col p-4 md:p-4 lg:p-6 overflow-hidden max-h-screen">
      
      {/* HEADER & TOP SCORES */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-1">
              <Activity size={24} className="text-[var(--accent-primary)]" />
              Urban Digital Twin
            </h1>
          </div>
          <div className="flex gap-4 items-center">
             <LiveTelemetryFeed />
             <div className="flex gap-4 items-center bg-[var(--bg-surface-2)] p-1.5 rounded-lg border border-[var(--border-subtle)]">
               <div className="px-3 py-1 flex items-center gap-2">
                <Database size={14} className="text-[var(--text-muted)]"/>
                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">Model Confidence: {(results.confidence * 100).toFixed(0)}%</span>
               </div>
               <button onClick={openSaveScenario} className="btn btn-primary py-1.5 px-4 text-xs">Save Scenario</button>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
           <TopScoreCard label="City Health" value={results.cityHealth.after} unit="/ 100" icon={HeartPulse} colorClass="text-blue-400 border-blue-400/30 bg-blue-400/5" />
           <TopScoreCard label="Congestion" value={results.traffic.after} unit="%" icon={Gauge} colorClass={results.traffic.after > 70 ? 'text-red-400 border-red-400/30 bg-red-400/5' : 'text-orange-400 border-orange-400/30 bg-orange-400/5'} />
           <TopScoreCard label="AQI" value={results.aqi.after} unit="PM2.5" icon={Wind} colorClass={results.aqi.after > 150 ? 'text-red-400 border-red-400/30 bg-red-400/5' : 'text-green-400 border-green-400/30 bg-green-400/5'} />
           <TopScoreCard label="Emissions" value={(results.co2.after / 1000).toFixed(1)} unit="mtCO₂/yr" icon={CloudFog} colorClass="text-gray-400 border-gray-400/30 bg-gray-400/5" />
           <TopScoreCard label="Grid Load" value={(results.energy.after / 1000).toFixed(1)} unit="TWh" icon={PlugZap} colorClass="text-yellow-400 border-yellow-400/30 bg-yellow-400/5" />
           <TopScoreCard label="Water Stress" value={((results.water.after / 1450) * 100).toFixed(0)} unit="%" icon={Waves} colorClass="text-cyan-400 border-cyan-400/30 bg-cyan-400/5" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* LEFT PANEL: POLICY CONTROLS */}
        <div className="lg:col-span-2 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
              <Activity size={14} className={isComputing ? 'text-[#2563EB] animate-pulse' : ''} /> Strategy Engine
            </h2>
          </div>
          <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            <CompactSlider label="Metro Expansion" value={activePolicy.metroExpansion} onChange={(v) => setPolicy({ metroExpansion: v })} icon="train" />
            <CompactSlider label="EV Adoption" value={activePolicy.evAdoptionRate} onChange={(v) => setPolicy({ evAdoptionRate: v })} icon="zap" />
            <CompactSlider label="Road Capacity" value={activePolicy.roadCapacity} onChange={(v) => setPolicy({ roadCapacity: v })} icon="route" />
            <CompactSlider label="Renewable Grid" value={activePolicy.renewableShare} onChange={(v) => setPolicy({ renewableShare: v })} icon="sun" />
            <CompactSlider label="Water Infra" value={activePolicy.waterInfrastructure} onChange={(v) => setPolicy({ waterInfrastructure: v })} icon="droplet" />
            <CompactSlider label="Green Space" value={activePolicy.greenSpaceAllocation} onChange={(v) => setPolicy({ greenSpaceAllocation: v })} icon="leaf" />
            <CompactSlider label="Industrial Zone" value={activePolicy.industrialZoning} onChange={(v) => setPolicy({ industrialZoning: v })} icon="factory" />
          </div>
        </div>

        {/* CENTER PANEL: LIVE DIGITAL TWIN & DISTRICTS */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
          
          {/* Main Map */}
          <div className="flex-1 relative rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-sm bg-[var(--slate-900)]">
             <CityMapTwin year={year} setYear={setYear} />
          </div>
          
          {/* District Impact System */}
          <div className="h-44 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
            <div className="p-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex justify-between items-center">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">District Forecasts</h3>
            </div>
            <div className="flex-1 p-3 overflow-x-auto custom-scrollbar flex gap-3 bg-[var(--bg-base)]">
              {results.districts.map(d => {
                const isRed = d.investmentPriority === 'High';
                const isYellow = d.investmentPriority === 'Medium';
                const isGreen = d.investmentPriority === 'Low';
                return (
                  <div key={d.id} className={`min-w-[180px] p-3 rounded-lg border shadow-sm flex flex-col justify-between transition-all ${
                    isRed ? 'border-red-200 bg-red-50/30' : isYellow ? 'border-orange-200 bg-orange-50/30' : 'border-green-200 bg-green-50/30'
                  }`}>
                     <div className="flex justify-between items-start">
                       <h4 className="font-bold text-[13px] text-gray-800">{d.name}</h4>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Impact</span>
                          <span className={`text-lg font-black tracking-tight ${d.impactScore > 60 ? 'text-blue-600' : 'text-gray-700'}`}>{d.impactScore}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Risk</span>
                          <span className={`text-lg font-black tracking-tight ${d.riskScore > 60 ? 'text-red-600' : 'text-gray-700'}`}>{d.riskScore}</span>
                        </div>
                     </div>
                     
                     <div className="mt-2 w-full">
                       <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500 mb-1">
                         <span>Growth Score</span>
                         <span>{d.growthScore}/100</span>
                       </div>
                       <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${isRed ? 'bg-red-500' : isYellow ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${d.growthScore}%`}} />
                       </div>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INTELLIGENCE */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar">
          
          <AIPolicyAdvisor policy={activePolicy} />

          <div className="bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
             <SafetyImpactForecast safety={results.safety} />
          </div>

          <div className="bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0">
             <ConsequenceTree nodes={results.cascadingEffects} />
          </div>

        </div>
      </div>
    </div>
  );
}
