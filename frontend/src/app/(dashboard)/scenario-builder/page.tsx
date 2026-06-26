"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScenarioBuilderPage() {
  const router = useRouter();
  const [evAdoption, setEvAdoption] = useState(45);
  const [popGrowth, setPopGrowth] = useState(12);
  const [indParks, setIndParks] = useState(4);
  const [metroLines, setMetroLines] = useState(2);

  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/simulate' : 'http://localhost:8000/api/simulate';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ev_adoption_rate: evAdoption / 100,
          population_growth: popGrowth / 100,
          new_industrial_parks: indParks,
          new_metro_lines: metroLines,
          time_horizon_years: 11 // 2024 to 2035
        })
      });
      const data = await res.json();
      
      // Store in session storage to pass to results page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('simulationResults', JSON.stringify(data));
      }
      
      router.push('/simulation-results');
    } catch (e) {
      console.error(e);
      // Fallback
      router.push('/simulation-results');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Map Section (Left) */}
      <section className="flex-1 relative bg-[#cbdbf5] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full grayscale opacity-40 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.2)_100%)] pointer-events-none" />
          {/* Mock Map Data Layers */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 1000 1000">
            <path className="animate-pulse" d="M100,200 Q300,150 500,400 T900,300" fill="none" stroke="#004ac6" strokeWidth="4"></path>
            <circle cx="450" cy="380" fill="#004ac6" r="8"></circle>
            <circle cx="520" cy="420" fill="#4cd7f6" r="12"></circle>
            <circle cx="300" cy="500" fill="#ba1a1a" r="6"></circle>
          </svg>
        </div>

        {/* Map HUD */}
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <div className="bg-white/80 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-outline-variant/30">
            <span className="flex h-3 w-3 rounded-full bg-[#4edea3]"></span>
            <span className="font-mono-label text-on-surface">LIVE FEED: BENGALURU_CTR_01</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-white/80 backdrop-blur-xl p-2 rounded-lg hover:bg-white transition-all shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant">layers</span>
            </button>
            <button className="bg-white/80 backdrop-blur-xl p-2 rounded-lg hover:bg-white transition-all shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant">my_location</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4 overflow-x-auto pb-2">
          <div className="bg-white/80 backdrop-blur-xl min-w-[200px] p-4 rounded-xl border-l-4 border-l-primary shadow-lg border border-outline-variant/30 border-l-primary">
            <p className="text-on-surface-variant font-label-md mb-1">Projected Traffic</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display-sm text-headline-sm text-primary">14.2%</span>
              <span className="text-tertiary font-label-md">Decrease</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl min-w-[200px] p-4 rounded-xl border-l-4 border-l-secondary shadow-lg border border-outline-variant/30">
            <p className="text-on-surface-variant font-label-md mb-1">Energy Efficiency</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display-sm text-headline-sm text-secondary">+28%</span>
              <span className="text-on-surface-variant font-label-md">Peak</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl min-w-[200px] p-4 rounded-xl border-l-4 border-l-tertiary shadow-lg border border-outline-variant/30">
            <p className="text-on-surface-variant font-label-md mb-1">CO2 Footprint</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display-sm text-headline-sm text-tertiary">-12.4t</span>
              <span className="text-on-surface-variant font-label-md">Monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Panel (Right) */}
      <aside className="w-[420px] bg-white border-l border-outline-variant/30 flex flex-col shadow-2xl relative z-10">
        <div className="p-6 border-b border-outline-variant/20 bg-surface">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Scenario Builder</h1>
          <p className="text-on-surface-variant font-body-sm mt-1">Design and validate urban growth strategies through high-fidelity simulations.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          {/* Scenario Types */}
          <section>
            <label className="font-label-md text-on-surface block mb-4 uppercase tracking-wider">Scenario Archetype</label>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setActiveScenario('climate')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${activeScenario === 'climate' ? 'border-primary bg-primary-fixed/20' : 'border-transparent bg-surface-container hover:border-outline-variant'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined">flood</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Climate Event</h4>
                  <p className="text-on-surface-variant text-[12px]">Simulate 100-year flood levels and drainage resilience.</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveScenario('infrastructure')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${activeScenario === 'infrastructure' ? 'border-primary bg-primary-fixed/20' : 'border-transparent bg-surface-container hover:border-outline-variant'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">construction</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Infrastructure Expansion</h4>
                  <p className="text-on-surface-variant text-[12px]">Impact of new arterial roads and utility corridors.</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveScenario('water')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${activeScenario === 'water' ? 'border-primary bg-primary-fixed/20' : 'border-transparent bg-surface-container hover:border-outline-variant'}`}
              >
                <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Water Stress</h4>
                  <p className="text-on-surface-variant text-[12px]">Analyze aquifer depletion and supply chain shocks.</p>
                </div>
              </button>
            </div>
          </section>

          {/* Parameter Sliders */}
          <section className="space-y-6">
            <label className="font-label-md text-on-surface block uppercase tracking-wider">Variable Configuration</label>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-medium flex items-center gap-1.5">EV Adoption</span>
                <span className="font-mono-label text-primary">{evAdoption}%</span>
              </div>
              <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="100" min="0" type="range" value={evAdoption} onChange={(e) => setEvAdoption(Number(e.target.value))} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-medium flex items-center gap-1.5">Population Growth</span>
                <span className="font-mono-label text-primary">{popGrowth}%</span>
              </div>
              <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="50" min="0" type="range" value={popGrowth} onChange={(e) => setPopGrowth(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-medium flex items-center gap-1.5">New Industrial Parks</span>
                <span className="font-mono-label text-primary">{indParks}</span>
              </div>
              <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="20" min="0" type="range" value={indParks} onChange={(e) => setIndParks(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-medium flex items-center gap-1.5">New Metro Lines</span>
                <span className="font-mono-label text-primary">{metroLines}</span>
              </div>
              <input className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="10" min="0" type="range" value={metroLines} onChange={(e) => setMetroLines(Number(e.target.value))} />
            </div>
          </section>

          {/* Comparative Preview */}
          <section className="space-y-4">
            <label className="font-label-md text-on-surface block uppercase tracking-wider">Estimated Impact</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface border border-outline-variant/30 rounded-xl">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">Grid Load</p>
                <p className="text-headline-sm font-bold text-error">+{(indParks * 1.05).toFixed(1)}GW</p>
                <div className="w-full h-1 bg-surface-container rounded-full mt-2 overflow-hidden">
                  <div className="bg-error w-3/4 h-full"></div>
                </div>
              </div>
              <div className="p-3 bg-surface border border-outline-variant/30 rounded-xl">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">Public Transit</p>
                <p className="text-headline-sm font-bold text-tertiary">{82 + metroLines}%</p>
                <div className="w-full h-1 bg-surface-container rounded-full mt-2 overflow-hidden">
                  <div className="bg-tertiary w-[82%] h-full" style={{ width: `${Math.min(100, 82 + metroLines)}%` }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-outline-variant/30 bg-surface">
          <button 
            onClick={handleSimulate}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/30 group"
          >
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">analytics</span>
            <span className="text-lg">Run Simulation</span>
          </button>
          <p className="text-[10px] text-center text-on-surface-variant mt-4 font-medium opacity-60">ESTIMATED RUN TIME: 14 SECONDS • CREDITS: 1.2k</p>
        </div>
      </aside>
    </div>
  );
}
