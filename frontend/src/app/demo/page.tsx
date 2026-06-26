"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function JudgeDemoPage() {
  const router = useRouter();
  const runSimulation = useSimulationStore(state => state.runSimulation);

  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto progression of steps for the 90 second walkthrough (approx 8 steps * 10 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    setTimeout(() => setProgress(0), 0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setStep(s => {
            if (s >= 8) {
              setIsPlaying(false);
              return 8;
            }
            return s + 1;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 100); // 10 seconds per step (100 * 100ms)
    return () => clearInterval(interval);
  }, [step, isPlaying]);

  // When step 3 runs, save simulation parameters globally so the entire platform updates
  useEffect(() => {
    if (step === 3) {
      // Commit the EV Revolution parameters to global Zustand state
      runSimulation({
        evAdoption: 80,
        popGrowth: 15,
        indExpansion: 5,
        metroExpansion: 3,
        renewableGrowth: 60,
        climateEvent: "None",
        disasterEvent: "None",
        name: "EV Revolution 2035 (Demo)"
      });
    }
  }, [step, runSimulation]);

  const handleNext = () => {
    setStep(s => Math.min(8, s + 1));
    setProgress(0);
  };

  const handlePrev = () => {
    setStep(s => Math.max(1, s - 1));
    setProgress(0);
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipDemo = () => {
    // Force commit demo state if skipped
    runSimulation({
      evAdoption: 80,
      popGrowth: 15,
      indExpansion: 5,
      metroExpansion: 3,
      renewableGrowth: 60,
      climateEvent: "None",
      disasterEvent: "None",
      name: "EV Revolution 2035 (Demo)"
    });
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col justify-between select-none">
      
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">B</div>
          <div>
            <span className="text-xl font-bold tracking-tight">BHAVORA</span>
            <span className="text-blue-400 text-xs ml-2 uppercase font-mono tracking-wider font-semibold">Judge Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePause}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-white/80">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button 
            onClick={skipDemo}
            className="px-4 py-2 border border-white/15 text-white/70 hover:bg-white/5 rounded-xl text-xs font-semibold"
          >
            Skip Walkthrough
          </button>
        </div>
      </header>

      {/* Main Sandbox Frame */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Side: Mock Screen Render Area */}
        <div className="flex-1 p-6 flex items-center justify-center border-b border-white/5 lg:border-b-0 lg:border-r lg:border-white/5 bg-[#0d1323]">
          
          {/* STEP 1: CITIES TWIN BASELINE */}
          {step === 1 && (
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-6 shadow-2xl relative border border-outline-variant/20 animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-base">Bengaluru Digital Twin — Baseline (2025)</h3>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold">GIS BASE LAYER</span>
              </div>
              <div className="h-64 rounded-2xl overflow-hidden bg-[#cbdbf5] relative mb-4">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }} />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow">
                  <span className="w-2 h-2 rounded-full bg-error"></span>Avg Congestion: 78
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 font-bold uppercase">Population</p><p className="text-sm font-extrabold text-gray-900 mt-1">13.6M</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 font-bold uppercase">Energy Load</p><p className="text-sm font-extrabold text-gray-900 mt-1">4.2 GW</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 font-bold uppercase">Reserves</p><p className="text-sm font-extrabold text-gray-900 mt-1">18% Water</p></div>
              </div>
            </div>
          )}

          {/* STEP 2: DECISION TWIN CONFIGURATION */}
          {step === 2 && (
            <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl p-6 shadow-2xl relative border border-outline-variant/20 animate-scale-in">
              <h3 className="font-bold text-gray-800 text-base mb-5">Decision Twin Scenario Configuration</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700"><span>EV Adoption Rate</span><span className="text-primary animate-pulse">80%</span></div>
                  <div className="h-1 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-[80%] transition-all duration-[2s]" /></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700"><span>Population Growth</span><span className="text-primary animate-pulse">+15%</span></div>
                  <div className="h-1 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-[30%] transition-all duration-[2s]" /></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700"><span>Renewable Grid Mix</span><span className="text-primary animate-pulse">60%</span></div>
                  <div className="h-1 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-[60%] transition-all duration-[2s]" /></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700"><span>Metro Expansion</span><span className="text-primary animate-pulse">3 Lines</span></div>
                  <div className="h-1 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-[30%] transition-all duration-[2s]" /></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RUN SIMULATION ANIMATION */}
          {step === 3 && (
            <div className="w-full max-w-md text-center p-6 space-y-6 animate-scale-in">
              <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto animate-pulse">
                <span className="material-symbols-outlined text-4xl text-blue-400 animate-spin">neurology</span>
              </div>
              <h3 className="font-bold text-white text-lg">Computing Complex Cascades</h3>
              <div className="space-y-2 max-w-xs mx-auto text-xs text-white/60">
                <div className="flex justify-between"><span>Forecast Engine Matrix</span><span className="text-emerald-400">OK</span></div>
                <div className="flex justify-between"><span>Impact Stress Index</span><span className="text-emerald-400">OK</span></div>
                <div className="flex justify-between"><span>AI Recommendation Parser</span><span className="text-emerald-400">OK</span></div>
              </div>
            </div>
          )}

          {/* STEP 4: SIMULATION RESULTS */}
          {step === 4 && (
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-6 shadow-2xl relative border border-outline-variant/20 animate-scale-in">
              <h3 className="font-bold text-gray-800 text-base mb-6">Simulation Projections (2035)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/15">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Traffic Congestion</p>
                  <p className="text-xl font-extrabold text-primary mt-1">+18.0% delta</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/15">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Energy Grid Load</p>
                  <p className="text-xl font-extrabold text-primary mt-1">+15.0% load</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/15">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Water stress delta</p>
                  <p className="text-xl font-extrabold text-primary mt-1">+17.0% stress</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/15">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Carbon Footprint</p>
                  <p className="text-xl font-extrabold text-primary mt-1">-1.4% emissions</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: IMPACT ANALYSIS */}
          {step === 5 && (
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-6 shadow-2xl relative border border-outline-variant/20 animate-scale-in">
              <h3 className="font-bold text-gray-800 text-base mb-4">Impact Analysis: Before vs After</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Baseline speed</p>
                  <p className="text-sm font-semibold text-gray-700">18 km/h speed across Silk Board</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/15">
                  <p className="text-[11px] font-bold text-primary uppercase mb-1">Simulated speed</p>
                  <p className="text-sm font-bold text-primary">15 km/h speed / +18% Congestion</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: AI INSIGHTS */}
          {step === 6 && (
            <div className="w-full max-w-md bg-[#131929] text-white rounded-3xl p-6 shadow-2xl relative border border-white/10 animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                <h3 className="font-bold text-white text-base">AI Planning Recommendations</h3>
              </div>
              <div className="space-y-3 text-xs text-white/70">
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                  <span className="font-bold text-primary-fixed-dim">NEW POWER GRID RECS:</span> North Bengaluru requires 11 substations by 2028.
                </div>
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                  <span className="font-bold text-primary-fixed-dim">NEW CHARGING HUBS:</span> Whitefield requires 18% additional capacity.
                </div>
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                  <span className="font-bold text-primary-fixed-dim">WATER MITIGATION:</span> Accelerate Cauvery Stage V water pipeline.
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REPORTS CHAPTER */}
          {step === 7 && (
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-8 shadow-2xl relative border border-outline-variant/20 animate-scale-in max-h-[380px] overflow-y-auto">
              <div className="border-b border-outline-variant/30 pb-4 mb-4">
                <p className="text-primary font-bold uppercase text-[10px] tracking-widest">Confidential Strategy Document</p>
                <h2 className="text-lg font-bold text-gray-900">Executive Report: Bengaluru 2035</h2>
              </div>
              <div className="space-y-3 text-xs text-gray-500 leading-relaxed">
                <h4 className="font-bold text-gray-800">1.0 Scenario EV Revolution Summary</h4>
                <p>Based on inputs EV=80%, Population Growth=+15%, and Renewable Grid Mix=60%, the Bangalore infrastructure stress factor rises from 68/100 to 82/100. This report outlines critical capex suggestions.</p>
              </div>
            </div>
          )}

          {/* STEP 8: END SCREEN SCORES */}
          {step === 8 && (
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-scale-in">
              <h3 className="font-bold text-gray-800 text-lg">Bengaluru 2035 Strategy Rating</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl font-extrabold text-primary">8.4</div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Rec. Score</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl font-extrabold text-secondary">78%</div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Resilience Score</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl font-extrabold text-tertiary">82%</div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Readiness Score</div>
                </div>
              </div>
              <button 
                onClick={skipDemo}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-transform"
              >
                Go to Platform Overview →
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Demo Controller Instructions */}
        <div className="w-full lg:w-96 p-8 flex flex-col justify-between bg-white/5 backdrop-blur-md relative z-10 border-t border-white/5 lg:border-t-0">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-3 font-mono">
              <span>DEMO STAGE</span>
              <span>{step} of 8</span>
            </div>
            
            {/* Step Content */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                {step === 1 && "Cities Twin Map Inspection"}
                {step === 2 && "Configure Target Parameters"}
                {step === 3 && "Run Multi-Sector Simulation"}
                {step === 4 && "Analyze Forecast Outputs"}
                {step === 5 && "Before vs After Variations"}
                {step === 6 && "Deploy AI Planning Recommendations"}
                {step === 7 && "Compile Executive Reports"}
                {step === 8 && "Final Score Metrics"}
              </h2>
              
              <p className="text-xs text-white/50 leading-relaxed">
                {step === 1 && "In Stage 1, the digital twin registers baseline metrics across the city's districts: a population count of 13.6M, grid load of 4.2 GW, and water reserves capacity of 18%."}
                {step === 2 && "In Stage 2, the scenario builder configures variables: accelerating electric vehicle penetration to 80%, population to +15%, and metro expansion to 3 lines."}
                {step === 3 && "In Stage 3, the deterministic simulation engine processes parameters, evaluating grid stresses and demographic shifts."}
                {step === 4 && "In Stage 4, outputs render: congestion increases 18%, grid demand rises 15%, water stress hits 17%, while carbon output drops 1.4%."}
                {step === 5 && "In Stage 5, planners inspect side-by-side speed variations and grid capacity stresses."}
                {step === 6 && "In Stage 6, anomalies automatically trigger strategies: building 11 power substations and charging hubs."}
                {step === 7 && "In Stage 7, report templates generate strategy chapters outlining zoning adjustments."}
                {step === 8 && "The simulation outputs a Recommendation Score of 8.4/10 and City Resilience level of 78%."}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 space-y-4">
            {/* Steps line */}
            <div className="flex justify-between items-center gap-1.5 h-1">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    i + 1 === step ? 'bg-blue-500 relative' : i + 1 < step ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                >
                  {i + 1 === step && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all"
                      style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              <button 
                onClick={handlePrev}
                disabled={step === 1}
                className="flex-1 py-3 border border-white/15 text-xs font-semibold rounded-xl disabled:opacity-30 hover:bg-white/5 active:scale-95 transition-all text-center"
              >
                Previous Step
              </button>
              <button 
                onClick={handleNext}
                disabled={step === 8}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl disabled:opacity-30 active:scale-95 transition-all text-center"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Steps line footer style bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 relative z-20"></div>
    </div>
  );
}
