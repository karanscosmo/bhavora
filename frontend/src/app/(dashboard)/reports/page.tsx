"use client";

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function ReportsPage() {
  const store = useSimulationStore();
  const { metrics, evAdoption, popGrowth, renewableGrowth, metroExpansion, indExpansion, climateEvent, disasterEvent } = store;
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 1500);
  };

  // Dynamic calculations for report indices
  const trafficIndexValue = Math.min(100, Math.max(10, Math.round(78 + metrics.trafficCongestion)));
  const trafficDeltaLabel = metrics.trafficCongestion > 0 
    ? `↑ ${metrics.trafficCongestion.toFixed(1)}%` 
    : `↓ ${Math.abs(metrics.trafficCongestion).toFixed(1)}%`;
  const energyIndexValue = Math.min(100, Math.max(10, Math.round(65 + metrics.energyDemand)));
  const energyDeltaLabel = metrics.energyDemand > 0 
    ? `↑ ${metrics.energyDemand.toFixed(1)}%` 
    : `↓ ${Math.abs(metrics.energyDemand).toFixed(1)}%`;
  const energyLoadGw = (4.2 * (1 + metrics.energyDemand / 100)).toFixed(1);

  // Dynamic SVG path calculations for population curve
  const y1 = Math.min(220, Math.max(20, 180 - popGrowth * 1.5));
  const y2 = Math.min(220, Math.max(20, 140 - popGrowth * 3.0));
  const y3 = Math.min(220, Math.max(20, 80 - popGrowth * 4.5));
  const y4 = Math.min(220, Math.max(20, 40 - popGrowth * 6.0));
  const svgPath = `M0 220 L200 ${y1} L400 ${y2} L600 ${y3} L800 ${y4}`;
  const areaGradientPath = `${svgPath} L800 220 Z`;

  const popGrowthEst2030 = (13.6 * (1 + popGrowth * 0.01)).toFixed(1);

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
            <span>Analysis</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">Infrastructure Forecasts</span>
          </nav>
          <h1 className="font-display-sm text-display-sm tracking-tight text-on-surface">Predictive Infrastructure Outlook</h1>
          <p className="text-on-surface-variant mt-1">Projecting 15-year urban evolution patterns for the Bengaluru Metropolitan Area.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-outline-variant/30 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span className="text-sm font-semibold">Share Analysis</span>
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="text-sm font-semibold">Export Report</span>
          </button>
        </div>
      </div>

      {/* Bento Grid of Forecasts */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Predictive Curve: Population & Housing */}
        <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-6 rounded-2xl shadow-sm group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Population Growth Trajectory</h2>
              <p className="text-on-surface-variant text-body-sm">Aggregated demographic forecast (2024 - 2035)</p>
            </div>
            <div className="flex bg-surface-container rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-bold bg-white rounded shadow-sm text-primary">Logarithmic</button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant">Linear</button>
            </div>
          </div>
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240">
              {/* Grid Lines */}
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="40" y2="40"></line>
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="100" y2="100"></line>
              <line stroke="#E2E8F0" strokeDasharray="4" x1="0" x2="800" y1="160" y2="160"></line>
              <line stroke="#E2E8F0" strokeWidth="2" x1="0" x2="800" y1="220" y2="220"></line>
              {/* Area Gradient */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#004ac6" stopOpacity="0.1"></stop>
                  <stop offset="100%" stopColor="#004ac6" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d={areaGradientPath} fill="url(#areaGradient)" className="transition-all duration-1000"></path>
              {/* Main Curve */}
              <path d={svgPath} fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" className="transition-all duration-1000"></path>
              {/* Forecast Points */}
              <circle cx="200" cy={y1} fill="#004ac6" r="6" stroke="white" strokeWidth="2" className="transition-all hover:r-8 duration-1000"></circle>
              <circle cx="400" cy={y2} fill="#004ac6" r="6" stroke="white" strokeWidth="2" className="transition-all hover:r-8 duration-1000"></circle>
              <circle cx="600" cy={y3} fill="#004ac6" r="6" stroke="white" strokeWidth="2" className="transition-all hover:r-8 duration-1000"></circle>
              <circle cx="800" cy={y4} fill="#004ac6" r="6" stroke="white" strokeWidth="2" className="transition-all hover:r-8 duration-1000"></circle>
              {/* Year Labels */}
              <text fill="#64748b" fontSize="10" fontWeight="600" x="0" y="240">2024 (Now)</text>
              <text fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle" x="200" y="240">2026</text>
              <text fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle" x="400" y="240">2028</text>
              <text fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle" x="600" y="240">2030</text>
              <text fill="#64748b" fontSize="10" fontWeight="600" textAnchor="end" x="800" y="240">2035</text>
            </svg>
            <div className="absolute top-10 left-[75%] bg-[#213145] text-white px-3 py-2 rounded-lg text-xs shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="font-bold mb-1">Target: 2030</div>
              <div className="flex justify-between gap-4">
                <span className="text-white/80">Population:</span>
                <span className="font-mono-label font-bold text-white">{popGrowthEst2030}M (+{popGrowth}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Cards - Side */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Traffic Intensity Forecast */}
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-6 rounded-2xl shadow-sm border-l-4 border-l-error">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Traffic Congestion Index</h3>
                <p className="text-headline-sm font-bold text-on-surface mt-1">{trafficIndexValue}<span className={`text-sm font-medium ml-2 ${metrics.trafficCongestion > 0 ? 'text-error' : 'text-emerald-600'}`}>{trafficDeltaLabel}</span></p>
              </div>
              <span className="material-symbols-outlined text-error">traffic</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-error h-1.5 rounded-full transition-all duration-[1s]" style={{ width: `${trafficIndexValue}%` }}></div>
            </div>
            <p className="text-body-sm text-on-surface-variant italic">Peak bottlenecks observed in East/South corridors with current transit load profiles.</p>
          </div>

          {/* Energy Grid Load Forecast */}
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 p-6 rounded-2xl shadow-sm border-l-4 border-l-secondary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Grid Load (Forecasted)</h3>
                <p className="text-headline-sm font-bold text-on-surface mt-1">{energyLoadGw} GW<span className={`text-sm font-medium ml-2 ${metrics.energyDemand > 0 ? 'text-error' : 'text-emerald-600'}`}>{energyDeltaLabel}</span></p>
              </div>
              <span className="material-symbols-outlined text-secondary">bolt</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full transition-all duration-[1s]" style={{ width: `${energyIndexValue}%` }}></div>
            </div>
            <p className="text-body-sm text-on-surface-variant italic">Demand surges require additional solar/grid capacity allocation before 2030.</p>
          </div>
        </div>

        {/* Report Preview Section */}
        <div className="col-span-12 bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
          {/* Sidebar: Report Chapters */}
          <div className="w-full md:w-80 bg-surface-container-low border-r border-outline-variant/30 p-6 flex flex-col">
            <h3 className="font-headline-sm text-on-surface mb-6">Report Contents</h3>
            <div className="space-y-1 flex-1 overflow-y-auto">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white shadow-sm border border-primary/20 text-primary font-semibold flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">article</span>
                Executive Summary
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/50 transition-colors text-on-surface-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                Demographic Shifts
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/50 transition-colors text-on-surface-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">commute</span>
                Mobility Infrastructure
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/50 transition-colors text-on-surface-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">eco</span>
                Sustainability Matrix
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/50 transition-colors text-on-surface-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">policy</span>
                Policy Framework 2035
              </button>
            </div>
            <div className="pt-6 border-t border-outline-variant/30 mt-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">security</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Verified Data</p>
                  <p className="text-on-surface-variant">Authored by AI Catalyst v4.2</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content Area */}
          <div className="flex-1 bg-white p-8 overflow-y-auto relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-[120px] font-black -rotate-45">BHAVORA</span>
            </div>
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <div className="border-b border-outline-variant/30 pb-8">
                <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Confidential Strategy Document</p>
                <h2 className="text-display-sm font-bold text-on-surface">Executive Summary: Bengaluru 2035</h2>
                <p className="text-on-surface-variant">Published Date: October 24, 2024 | Document ID: BHV-INF-2024-X89</p>
              </div>

              <section className="space-y-4">
                <h4 className="font-headline-sm text-on-surface">1.0 Primary Forecast Hypothesis</h4>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  Based on target inputs (EV={evAdoption}%, Population Growth=+{popGrowth}%, Renewables Grid Mix={renewableGrowth}%, Metro Expansion={metroExpansion} lines), our predictive modeling indicates a significant shift in urban density. By 2035, the infrastructure stress index is projected to reach <span className="font-bold text-primary">{metrics.infrastructureStress}/100</span>. Additional zoning modifications must be scheduled.
                </p>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <p className="text-xs font-bold text-on-surface-variant mb-1">IMPACT SCORE</p>
                  <p className={`text-2xl font-bold ${metrics.infrastructureStress > 75 ? 'text-error' : 'text-primary'}`}>
                    {metrics.infrastructureStress > 75 ? 'High Criticality' : 'Manageable Stress'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-2">Requires immediate budgetary reallocation.</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <p className="text-xs font-bold text-on-surface-variant mb-1">PROBABILITY</p>
                  <p className="text-2xl font-bold text-secondary">92.4% Accuracy</p>
                  <p className="text-xs text-on-surface-variant mt-2">Based on current real-estate absorption rates.</p>
                </div>
              </div>

              <section className="space-y-4">
                <h4 className="font-headline-sm text-on-surface">2.0 Strategic Policy Recommendations</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <p className="text-on-surface-variant">
                      <span className="font-bold text-on-surface">Grid Capacity Planning:</span> 
                      {metrics.energyDemand > 15 
                        ? "Energy demand surges. Add 11 new power substations near North Bengaluru corridors." 
                        : "Grid stable. Align localized storage capacity in industrial expansion sectors."}
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <p className="text-on-surface-variant">
                      <span className="font-bold text-on-surface">Water Security Mandates:</span> 
                      {metrics.waterDemand > 10
                        ? "Water stress is critical. Accelerate Cauvery Stage V phase allocations immediately."
                        : "Reserves within threshold margins. Focus water reclamation networks on new housing complexes."}
                    </p>
                  </li>
                </ul>
              </section>

              {(climateEvent !== "None" || disasterEvent !== "None") && (
                <div className="bg-error-container text-on-error-container p-6 rounded-2xl border border-error/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-error">warning</span>
                    <h5 className="font-bold text-error">Active Hazard Annex</h5>
                  </div>
                  <p className="text-sm">
                    Simulated under emergency conditions: Climate Hazard [<strong>{climateEvent}</strong>] and Grid Alert [<strong>{disasterEvent}</strong>]. Stress vectors indicate elevated operational vulnerability near central junctions.
                  </p>
                </div>
              )}

              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <h5 className="font-bold text-primary">Analyst&apos;s Note</h5>
                </div>
                <p className="text-sm text-on-primary-container/80">
                  The simulation assumes a steady-state GDP growth pattern. If industrial park expansions exceed {indExpansion} zones, recalculation is mandatory.
                </p>
              </div>

              <div className="flex items-center justify-center pt-8 border-t border-outline-variant/30">
                <p className="text-xs text-on-surface-variant">© 2024 BHAVORA Systems. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Export Toast */}
      {isExporting && (
        <div className="fixed bottom-8 right-28 bg-[#213145] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <span className="material-symbols-outlined text-secondary">check_circle</span>
          <span className="text-sm font-medium">Exporting PDF... This might take a moment.</span>
        </div>
      )}
    </div>
  );
}
