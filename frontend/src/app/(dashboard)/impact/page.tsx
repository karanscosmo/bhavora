"use client";

import React, { useEffect, useState } from 'react';

export default function ImpactPage() {
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('simulationResults');
      if (stored) {
        setResults(JSON.parse(stored));
      } else {
        // Default scenario: Green growth archetype fallback
        setResults({
          metrics: {
            energyDemand: 24,
            carbonEmissions: -18,
            trafficCongestion: -12,
            waterDemand: 4,
            jobsCreated: 14,
            infrastructureStress: 68
          }
        });
      }
    }
  }, []);

  const metrics = [
    {
      name: "Traffic Speed & Congestion",
      before: "18 km/h speed / High stress",
      after: `${results?.metrics?.trafficCongestion < 0 ? '24 km/h speed' : '16 km/h speed'} / ${Math.abs(results?.metrics?.trafficCongestion || 12)}% Delta`,
      progressBefore: 88,
      progressAfter: Math.max(10, 88 + (results?.metrics?.trafficCongestion || -12)),
      color: "bg-error",
      icon: "traffic",
      label: "Congestion Index"
    },
    {
      name: "Power Grid Peak Load",
      before: "4.2 GW Peak demand",
      after: `${(4.2 * (1 + (results?.metrics?.energyDemand || 24) / 100)).toFixed(1)} GW Peak / +${results?.metrics?.energyDemand || 24}% Load`,
      progressBefore: 50,
      progressAfter: Math.min(100, 50 + (results?.metrics?.energyDemand || 24)),
      color: "bg-amber-500",
      icon: "bolt",
      label: "Energy Capacity"
    },
    {
      name: "Carbon Footprint Delta",
      before: "2.4t CO2 emissions per capita",
      after: `${(2.4 * (1 + (results?.metrics?.carbonEmissions || -18) / 100)).toFixed(2)}t / ${results?.metrics?.carbonEmissions || -18}% Delta`,
      progressBefore: 75,
      progressAfter: Math.max(10, 75 + (results?.metrics?.carbonEmissions || -18)),
      color: "bg-emerald-500",
      icon: "co2",
      label: "Carbon Stress"
    },
    {
      name: "Water Reserve Capacities",
      before: "18% capacity / High stress",
      after: `${Math.max(2, 18 - (results?.metrics?.waterDemand || 4))}% capacity / +${results?.metrics?.waterDemand || 4}% stress`,
      progressBefore: 18,
      progressAfter: Math.max(2, 18 - (results?.metrics?.waterDemand || 4)),
      color: "bg-blue-500",
      icon: "water_drop",
      label: "Reserves Remaining"
    }
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
            <span>Impact Analysis</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Variance Comparison</span>
          </nav>
          <h1 className="font-display-sm text-display-sm text-on-surface">Urban Impact Matrix</h1>
          <p className="text-on-surface-variant font-body-md max-w-xl">
            Comparing Baseline Urban Health index (2025) vs Simulated outcome indicators.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <span className="material-symbols-outlined text-primary text-2xl">compare_arrows</span>
          <div>
            <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Simulated Index</div>
            <div className="text-lg font-extrabold text-on-surface">Bengaluru 2035</div>
          </div>
        </div>
      </div>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map((item, i) => (
          <div 
            key={item.name}
            className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            style={{ animation: `fade-slide-in 0.4s ease-out ${i * 100}ms both` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <h3 className="font-bold text-on-surface text-base">{item.name}</h3>
            </div>

            <div className="space-y-4">
              {/* Before */}
              <div className="p-3 bg-surface-container-low rounded-xl">
                <div className="flex justify-between items-center mb-1 text-[11px] font-semibold">
                  <span className="text-on-surface-variant">Baseline (2025)</span>
                  <span className="text-on-surface-variant font-mono">{item.progressBefore}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-outline-variant/80" style={{ width: `${item.progressBefore}%` }}></div>
                </div>
                <p className="text-xs text-on-surface-variant opacity-80">{item.before}</p>
              </div>

              {/* After */}
              <div className="p-3 bg-primary/5 rounded-xl border border-primary/15">
                <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                  <span className="text-primary">Simulated Prediction</span>
                  <span className="text-primary font-mono">{item.progressAfter}%</span>
                </div>
                <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden mb-1">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.progressAfter}%` }}></div>
                </div>
                <p className="text-xs text-primary font-semibold">{item.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Structural Comparisons Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
        <h3 className="font-headline-sm text-on-surface mb-6">Detailed Core Variances</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-left text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                <th className="pb-4 px-4">Indicator</th>
                <th className="pb-4 px-4">Baseline</th>
                <th className="pb-4 px-4">Simulated Target</th>
                <th className="pb-4 px-4">Calculated Change</th>
                <th className="pb-4 px-4">Severity Action</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-on-surface">
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-4">Public Transit Usage</td>
                <td className="py-4 px-4">12,400 pass/hr</td>
                <td className="py-4 px-4">15,800 pass/hr</td>
                <td className="py-4 px-4 text-tertiary">+27.4% flow</td>
                <td className="py-4 px-4"><span className="bg-tertiary/10 text-tertiary px-2 py-1 rounded text-[10px] font-bold uppercase">Optimal</span></td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-4">Aquifer Depletion Index</td>
                <td className="py-4 px-4">64.2 stress</td>
                <td className="py-4 px-4">79.5 stress</td>
                <td className="py-4 px-4 text-error">+{results?.metrics?.waterDemand || 4}% drawdown</td>
                <td className="py-4 px-4"><span className="bg-error-container text-error px-2 py-1 rounded text-[10px] font-bold uppercase">High Risk</span></td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-4">Energy Substation Reserve</td>
                <td className="py-4 px-4">18% reserve</td>
                <td className="py-4 px-4">6% reserve</td>
                <td className="py-4 px-4 text-error">-{results?.metrics?.energyDemand || 24}% margins</td>
                <td className="py-4 px-4"><span className="bg-error-container text-error px-2 py-1 rounded text-[10px] font-bold uppercase">Critical</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
