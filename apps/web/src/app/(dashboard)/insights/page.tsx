"use client";

import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ArrowRight, Calendar, CheckCircle, Database, Droplet, Filter, History, Info, Link, Plug, Rss, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';


export default function InsightsPage() {
  const store = useSimulationStore();
  const { metrics, popGrowth, recommendations } = store;

  // Compute dynamic stats
  const powerRad = (12.4 * (1 + metrics.energyDemand / 100)).toFixed(1);
  const powerGrowth = (28.5 * (1 + popGrowth / 100)).toFixed(1);
  const powerCapex = Math.round(840 * (1 + metrics.energyDemand / 200));

  const waterDemandIncrease = Math.max(1, Math.round(12 * (1 + metrics.waterDemand / 100)));
  const waterProgress = Math.min(100, Math.max(10, Math.round(88 + metrics.waterDemand)));

  const trafficMitigationText = metrics.trafficCongestion < 0 
    ? `Reduces ORR congestion by ${Math.abs(metrics.trafficCongestion).toFixed(1)}%` 
    : `Increases ORR congestion by ${metrics.trafficCongestion.toFixed(1)}%`;

  return (
    <div className="max-w-[1440px] mx-auto p-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-mono-label mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            LIVE INTELLIGENCE FEED
          </div>
          <h2 className="font-display-sm text-display-sm text-on-surface tracking-tight">Governance Insights</h2>
          <p className="text-on-surface-variant text-body-lg">Predictive analytics for urban infrastructure expansion and optimization.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-4 py-2 rounded-lg font-label-md text-on-surface-variant border border-outline-variant/30 flex items-center gap-2 cursor-pointer">
            <Filter /> Filter
          </button>
          <button className="bg-surface-container-high px-4 py-2 rounded-lg font-label-md text-on-surface-variant border border-outline-variant/30 flex items-center gap-2 cursor-pointer">
            <Calendar /> 2024 - 2028
          </button>
        </div>
      </div>

      {/* Bento Grid of Intelligence Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Card 1: Power Infrastructure */}
        <div className="col-span-12 lg:col-span-8 group">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Plug />
                </div>
                <div>
                  <p className="font-mono-label text-primary">STRATEGIC INFRASTRUCTURE</p>
                  <h3 className="font-headline-sm">Power Grid Expansion</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold text-headline-sm">94.2%</div>
                <div className="font-label-md text-on-surface-variant uppercase text-[10px]">Confidence Score</div>
              </div>
            </div>
            <div className="flex-1 space-y-6 relative z-10">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                <p className="text-headline-lg font-display-sm text-on-surface leading-tight">
                  {metrics.energyDemand > 15 ? (
                    <span>North Bengaluru requires <span className="text-primary underline decoration-2 underline-offset-4">11 new substations</span> before 2028.</span>
                  ) : (
                    <span>North Bengaluru will require <span className="text-primary underline decoration-2 underline-offset-4">4 new substations</span> by 2026.</span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
                  <p className="font-label-md text-on-surface-variant mb-1">Impact Radius</p>
                  <p className="font-bold text-headline-sm">{powerRad} KM</p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
                  <p className="font-label-md text-on-surface-variant mb-1">Growth Index</p>
                  <p className="font-bold text-headline-sm">+{powerGrowth}%</p>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
                  <p className="font-label-md text-on-surface-variant mb-1">Est. CapEx</p>
                  <p className="font-bold text-headline-sm">₹{powerCapex} Cr</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-between relative z-10">
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-body-sm cursor-pointer">
                  <Link /> Source Data
                </button>
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-body-sm cursor-pointer">
                  <History /> History
                </button>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer">
                Take Action <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Water Demand */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-secondary shadow-sm hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <Droplet />
              </div>
              <div>
                <p className="font-mono-label text-secondary">RESOURCE ALLOCATION</p>
                <h3 className="font-headline-sm">Water Resources</h3>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-body-lg text-on-surface-variant mb-4">
                Water demand expected to rise <span className="text-secondary font-bold">{waterDemandIncrease}%</span> in eastern districts over the next 18 months.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">Supply Threshold</span>
                  <span className={`font-mono-label ${waterProgress > 80 ? 'text-error font-bold' : 'text-primary'}`}>
                    {waterProgress > 80 ? `CRITICAL (${waterProgress}%)` : `STABLE (${waterProgress}%)`}
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full transition-all duration-[1s]" style={{ width: `${waterProgress}%` }}></div>
                </div>
              </div>
              <div className="bg-surface-container/50 p-4 rounded-xl border border-outline-variant/30 mb-6">
                <p className="text-body-sm font-medium text-on-surface mb-2">Recommended Mitigation:</p>
                <ul className="space-y-2">
                  <li className="flex gap-2 text-body-sm text-on-surface-variant font-semibold">
                    <CheckCircle className="text-secondary text-[16px]" />
                    {metrics.waterDemand > 10 ? "Accelerate Cauvery Stage V phase" : "STP Pipeline diversion"}
                  </li>
                  <li className="flex gap-2 text-body-sm text-on-surface-variant font-semibold">
                    <CheckCircle className="text-secondary text-[16px]" />
                    Smart meter deployment
                  </li>
                </ul>
              </div>
            </div>
            <button className="w-full border-2 border-secondary text-secondary py-2.5 rounded-lg font-bold hover:bg-secondary/5 transition-all cursor-pointer">
              Review Supply Plan
            </button>
          </div>
        </div>

        {/* Card 3: Transportation Map Simulation */}
        <div className="col-span-12 lg:col-span-6 h-[400px]">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl h-full flex flex-col overflow-hidden relative shadow-sm hover:-translate-y-1 transition-all">
            <div className="absolute inset-0 bg-[#e5eeff]">
              <div className="w-full h-full bg-cover bg-center opacity-60 mix-blend-multiply" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1_8vkxn7sDewDywUgyCtlEuQdzmI1xkpmTFW_9ztYwWjrUKGyqtfnj3fZDPfzVnZUvdkVmlwY1fE9vwvbSaoVMu_2PV6nA8X5oh9B-5xEH2wHw9CfuOT0QpKBeHtQP4kVt78qnbi2NXO9kY8hDACNS8W8oBMiirvjiR942FPiHlBB2ExmkbhfSRfJhuF_4jiYBZrP_xIGnxJ718qr1Z7XVwOr5hCZyqAft43z4wvQOUDUCqgCzDkyUG_m2nma2KZjA7xTYVx7Fs8')" }}></div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-outline-variant/30 shadow-sm">
                  <p className="font-mono-label text-primary uppercase text-[10px] mb-1">PROPOSED METRO LINE 3</p>
                  <p className="font-bold text-headline-sm">Phase 2 Simulation</p>
                </div>
              </div>
            </div>
            <div className="mt-auto bg-white/90 backdrop-blur-xl p-6 border-t border-outline-variant/30 z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-headline-sm font-display-sm text-on-surface">
                    {trafficMitigationText}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">Based on AI mobility simulations with 1.2M daily datapoints.</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">L3</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-[10px] font-bold">ORR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Detailed Insight Card (Bento Slot) */}
        <div className="col-span-12 lg:col-span-6 grid grid-rows-2 gap-6">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border-b-4 border-b-primary">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <TrendingUp />
                <div>
                  <h4 className="font-bold text-body-lg">Demographic Shift</h4>
                  <p className="text-body-sm text-on-surface-variant">In-migration trend analysis</p>
                </div>
              </div>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-mono-label font-bold">UPDATED 2M AGO</span>
            </div>
            <p className="text-body-md text-on-surface-variant italic">&ldquo;Current zoning laws in SE Bengaluru are insufficient for predicted 2027 residential density under +{popGrowth}% growth scenario.&rdquo;</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database />
                <span className="text-body-sm font-medium">Census API + Mobile Pings</span>
              </div>
              <button className="text-primary font-bold text-body-sm hover:underline cursor-pointer">Re-zone Scenarios</button>
            </div>
          </div>

          <div className="bg-[#213145] rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-sm hover:-translate-y-1 transition-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="font-mono-label text-primary-fixed-dim text-[10px] uppercase opacity-80">Engine Performance</p>
                <h4 className="font-headline-sm">Decision Engine V5</h4>
              </div>
              <div className="bg-primary text-white p-2 rounded-lg">
                <Sparkles />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-sm opacity-80">Simulation Accuracy</span>
                <span className="font-mono-label">0.992</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#b4c5ff] h-full" style={{ width: '99%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic recommendations from the active simulation runs */}
      {recommendations.length > 0 && (
        <div className="mt-8 bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-on-surface text-base mb-4 flex items-center gap-2">
            <Rss />
            Active Simulation Recommendations Briefs
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3.5 bg-primary/5 rounded-xl border border-primary/10 text-xs font-semibold text-primary leading-relaxed flex items-start gap-2 animate-scale-in">
                <Info />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-12 flex flex-wrap items-center justify-between border-t border-outline-variant/30 pt-8 gap-6">
        <div className="flex gap-12 flex-wrap">
          <div>
            <p className="text-on-surface-variant font-label-md">DECISIONS PENDING</p>
            <p className="text-headline-sm font-bold">14</p>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">ACTIVE SIMULATIONS</p>
            <p className="text-headline-sm font-bold">03</p>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">AI TRUST RATING</p>
            <div className="flex items-center gap-1">
              <Star />
              <p className="text-headline-sm font-bold">A+</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="text-body-sm font-medium">Bhavora Node: BNG-01 Online</span>
        </div>
      </div>
    </div>
  );
}
