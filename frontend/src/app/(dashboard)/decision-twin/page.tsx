"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function DecisionTwinPage() {
  const router = useRouter();
  const store = useSimulationStore();

  // Inputs
  const [evAdoption, setEvAdoption] = useState(store.evAdoption);
  const [popGrowth, setPopGrowth] = useState(store.popGrowth);
  const [indExpansion, setIndExpansion] = useState(store.indExpansion);
  const [metroExpansion, setMetroExpansion] = useState(store.metroExpansion);
  const [renewableGrowth, setRenewableGrowth] = useState(store.renewableGrowth);
  const [climateEvent, setClimateEvent] = useState(store.climateEvent);
  const [disasterEvent, setDisasterEvent] = useState(store.disasterEvent);

  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync state if store updates (e.g. loaded scenario or demo mode)
  useEffect(() => {
    setEvAdoption(store.evAdoption);
    setPopGrowth(store.popGrowth);
    setIndExpansion(store.indExpansion);
    setMetroExpansion(store.metroExpansion);
    setRenewableGrowth(store.renewableGrowth);
    setClimateEvent(store.climateEvent);
    setDisasterEvent(store.disasterEvent);
  }, [
    store.evAdoption,
    store.popGrowth,
    store.indExpansion,
    store.metroExpansion,
    store.renewableGrowth,
    store.climateEvent,
    store.disasterEvent
  ]);

  const applyArchetype = (type: string) => {
    setActiveArchetype(type);
    if (type === 'climate') {
      setClimateEvent("100-Year Flood");
      setPopGrowth(8);
      setRenewableGrowth(15);
      setDisasterEvent("None");
    } else if (type === 'industrial') {
      setClimateEvent("None");
      setIndExpansion(12);
      setPopGrowth(20);
      setMetroExpansion(5);
      setDisasterEvent("None");
    } else if (type === 'green') {
      setClimateEvent("None");
      setEvAdoption(80);
      setRenewableGrowth(70);
      setMetroExpansion(6);
      setDisasterEvent("None");
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      // Formulate custom scenario name based on primary inputs
      const scenarioName = `Scenario-EV-${evAdoption}-Pop-${popGrowth}`;
      
      // Update store inputs first, then execute simulation
      store.setInputs({
        evAdoption,
        popGrowth,
        indExpansion,
        metroExpansion,
        renewableGrowth,
        climateEvent,
        disasterEvent
      });
      
      const results = await store.runSimulation({
        evAdoption,
        popGrowth,
        indExpansion,
        metroExpansion,
        renewableGrowth,
        climateEvent,
        disasterEvent,
        name: scenarioName
      });
      
      // Also update sessionStorage for absolute backwards-compatibility
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('simulationResults', JSON.stringify(results));
      }
      
      router.push('/simulation-results');
    } catch (e) {
      console.error("Simulation call failed", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const round = (val: number, decimals: number) => {
    return Number(Math.round(Number(val + 'e' + decimals)) + 'e-' + decimals);
  };

  return (
    <div className="absolute inset-0 flex overflow-hidden select-none animate-fade-in">
      {/* Map Section (Left) */}
      <section className="flex-1 relative bg-[#cbdbf5] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full grayscale opacity-40 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.2)_100%)] pointer-events-none" />
          
          {/* Animated Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 1000 1000">
            <path className="animate-pulse text-primary/30" d="M100,200 Q300,150 500,400 T900,300" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="450" cy="380" className="text-primary" fill="currentColor" r="8"></circle>
            <circle cx="520" cy="420" className="text-secondary" fill="currentColor" r="12"></circle>
            <circle cx="300" cy="500" className="text-error" fill="currentColor" r="6"></circle>
          </svg>
        </div>

        {/* Map HUD */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-outline-variant/30">
            <span className="flex h-3 w-3 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-mono-label text-on-surface text-xs font-bold">LIVE FEED: BENGALURU_DECISION_TWIN</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-white/80 backdrop-blur-xl p-2 rounded-lg hover:bg-white transition-all shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">layers</span>
            </button>
            <button className="bg-white/80 backdrop-blur-xl p-2 rounded-lg hover:bg-white transition-all shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">my_location</span>
            </button>
          </div>
        </div>

        {/* Dynamic Impact Gauges */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4 overflow-x-auto pb-2">
          <div className="bg-white/80 backdrop-blur-xl min-w-[200px] p-4 rounded-xl border-l-4 border-l-primary shadow-lg border border-outline-variant/30">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Grid Impact</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                +{((evAdoption * 0.15) + (popGrowth * 0.4)).toFixed(1)} GW
              </span>
              <span className="text-gray-400 text-[10px]">Peak load</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl min-w-[200px] p-4 rounded-xl border-l-4 border-l-secondary shadow-lg border border-outline-variant/30">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Carbon Reduction</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-secondary">
                -{Math.max(0, round((evAdoption * 0.4) + (renewableGrowth * 0.5) - (indExpansion * 0.8), 1))}%
              </span>
              <span className="text-gray-400 text-[10px]">Emissions delta</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl min-w-[200px] p-4 rounded-xl border-l-4 border-l-tertiary shadow-lg border border-outline-variant/30">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-1">Transit Throughput</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-tertiary">
                +{Math.max(0, round((metroExpansion * 12) + (evAdoption * 2), 1))}%
              </span>
              <span className="text-gray-400 text-[10px]">Passengers/hour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Panel (Right) */}
      <aside className="w-[440px] bg-white border-l border-outline-variant/30 flex flex-col shadow-2xl relative z-10">
        <div className="p-6 border-b border-outline-variant/20 bg-surface">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Decision Twin Settings</h1>
          <p className="text-on-surface-variant font-body-sm mt-1">Simulate metropolitan development scenarios for Bengaluru Urban Dev.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {/* Preset Archetypes */}
          <div>
            <label className="font-label-md text-on-surface block mb-3 uppercase tracking-wider text-[11px] font-bold">Preset Archetypes</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'climate', name: 'Flood Risk', icon: 'flood' },
                { id: 'industrial', name: 'Tech Boom', icon: 'factory' },
                { id: 'green', name: 'EV Town', icon: 'energy_savings_leaf' }
              ].map(arch => (
                <button 
                  key={arch.id}
                  onClick={() => applyArchetype(arch.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    activeArchetype === arch.id 
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' 
                      : 'border-outline-variant/30 bg-surface-container-low hover:border-outline-variant/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] mb-1">{arch.icon}</span>
                  <span className="text-[10px] leading-tight font-semibold">{arch.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-outline-variant/20 my-2" />

          {/* Sliders */}
          <div className="space-y-5">
            <label className="font-label-md text-on-surface block uppercase tracking-wider text-[11px] font-bold">Variable Control Panel</label>
            
            {/* EV Adoption */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface-variant">EV Adoption Rate</span>
                <span className="text-primary font-mono">{evAdoption}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={evAdoption} 
                onChange={(e) => { setEvAdoption(Number(e.target.value)); setActiveArchetype(null); }}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>

            {/* Population Growth */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface-variant">Population Growth Target</span>
                <span className="text-primary font-mono">+{popGrowth}%</span>
              </div>
              <input 
                type="range" min="0" max="50" value={popGrowth} 
                onChange={(e) => { setPopGrowth(Number(e.target.value)); setActiveArchetype(null); }}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>

            {/* Industrial Expansion */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface-variant">Industrial Park Expansion</span>
                <span className="text-primary font-mono">{indExpansion} zones</span>
              </div>
              <input 
                type="range" min="0" max="20" value={indExpansion} 
                onChange={(e) => { setIndExpansion(Number(e.target.value)); setActiveArchetype(null); }}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>

            {/* Metro Expansion */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface-variant">Metro Network Extensions</span>
                <span className="text-primary font-mono">{metroExpansion} lines</span>
              </div>
              <input 
                type="range" min="0" max="10" value={metroExpansion} 
                onChange={(e) => { setMetroExpansion(Number(e.target.value)); setActiveArchetype(null); }}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>

            {/* Renewable Energy */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-on-surface-variant">Renewable Grid Mix</span>
                <span className="text-primary font-mono">{renewableGrowth}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={renewableGrowth} 
                onChange={(e) => { setRenewableGrowth(Number(e.target.value)); setActiveArchetype(null); }}
                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>
          </div>

          <div className="h-[1px] bg-outline-variant/20 my-2" />

          {/* Incident Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-label-md text-on-surface block uppercase tracking-wider text-[10px] font-bold mb-2">Climate Hazard</label>
              <select 
                value={climateEvent}
                onChange={(e) => { setClimateEvent(e.target.value); setActiveArchetype(null); }}
                className="w-full bg-surface-container border-none text-[12px] rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="None">None</option>
                <option value="100-Year Flood">100-Year Flood</option>
                <option value="Extreme Heatwave">Extreme Heatwave</option>
                <option value="Severe Drought">Severe Drought</option>
              </select>
            </div>
            <div>
              <label className="font-label-md text-on-surface block uppercase tracking-wider text-[10px] font-bold mb-2">Infrastructure Alert</label>
              <select 
                value={disasterEvent}
                onChange={(e) => { setDisasterEvent(e.target.value); setActiveArchetype(null); }}
                className="w-full bg-surface-container border-none text-[12px] rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="None">None</option>
                <option value="Substation Failure">Substation Failure</option>
                <option value="Water Pipeline Leak">Water Pipeline Leak</option>
                <option value="Grid Instability">Grid Instability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 border-t border-outline-variant/30 bg-surface">
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{isSimulating ? 'hourglass_top' : 'analytics'}</span>
            <span className="text-md">{isSimulating ? 'Computing Vitality Factors...' : 'Run Platform Simulation'}</span>
          </button>
          <p className="text-[10px] text-center text-on-surface-variant mt-3 font-semibold opacity-60">ESTIMATED RUN TIME: 2 SECONDS • REAL PUBLIC DATASETS</p>
        </div>
      </aside>
    </div>
  );
}
