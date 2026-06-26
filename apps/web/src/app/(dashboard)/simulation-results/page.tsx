"use client";
import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Car, ChevronRight, Cloud, Download, Droplet, Leaf, Shield, TrendingUp, TrendingDown, Zap } from 'lucide-react';


export default function SimulationResultsPage() {
  const store = useSimulationStore();
  const results = store;
  
  // Advanced Score Calculations
  const sustainabilityScore = Math.min(10, Math.max(0, (10 - (results?.metrics?.carbonEmissions || 0) * 0.1 - (results?.metrics?.energyDemand || 0) * 0.05))).toFixed(1);
  const resilienceScore = Math.min(10, Math.max(0, (10 - ((results?.metrics?.infrastructureStress || 68) - 68) * 0.1 - (results?.metrics?.waterDemand || 0) * 0.1))).toFixed(1);
  const economicScore = Math.min(10, Math.max(0, (7 + (results?.metrics?.jobsCreated || 0) * 0.1))).toFixed(1);
  
  const recScore = ((parseFloat(sustainabilityScore) + parseFloat(resilienceScore) + parseFloat(economicScore)) / 3).toFixed(1);

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto animate-fade-in" id="simulation-results-content">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
            <span>Simulations</span>
            <ChevronRight />
            <span className="text-primary font-bold">Results</span>
          </nav>
          <h1 className="font-display-sm text-display-sm text-on-surface">Simulation Analysis</h1>
          <p className="text-on-surface-variant font-body-md max-w-xl">Comprehensive impact assessment of the Scenario Simulation vs Baseline Urban Density.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl px-6 py-4 flex flex-col items-center">
            <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Rec. Score</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display-sm text-display-sm text-primary">{recScore}</span>
              <span className="text-on-surface-variant font-body-sm">/ 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-surface-container p-2 rounded-lg">
              <Car />
            </div>
            <span className={`${(results?.metrics?.trafficCongestion || -10) > 0 ? 'text-error' : 'text-tertiary'} font-bold flex items-center`}>
              {(results?.metrics?.trafficCongestion || -10) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(results?.metrics?.trafficCongestion || -10)}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-label-md">Traffic Impact</p>
            <h3 className="text-headline-sm font-bold">{results?.metrics?.trafficCongestion > 0 ? '+' : ''}{results?.metrics?.trafficCongestion || -10}% Congestion</h3>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-surface-container p-2 rounded-lg">
              <Zap />
            </div>
            <span className={`${(results?.metrics?.energyDemand || 24) > 0 ? 'text-error' : 'text-tertiary'} font-bold flex items-center`}>
              {(results?.metrics?.energyDemand || 24) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(results?.metrics?.energyDemand || 24)}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-label-md">Energy Impact</p>
            <h3 className="text-headline-sm font-bold">{results?.metrics?.energyDemand > 0 ? '+' : ''}{results?.metrics?.energyDemand || 24}% Load</h3>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-surface-container p-2 rounded-lg">
              <Droplet />
            </div>
            <span className={`${(results?.metrics?.waterDemand || 4) > 0 ? 'text-error' : 'text-tertiary'} font-bold flex items-center`}>
              {(results?.metrics?.waterDemand || 4) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(results?.metrics?.waterDemand || 4)}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-label-md">Water Impact</p>
            <h3 className="text-headline-sm font-bold">{results?.metrics?.waterDemand > 0 ? '+' : ''}{results?.metrics?.waterDemand || 4}% Demand</h3>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-surface-container p-2 rounded-lg">
              <Cloud />
            </div>
            <span className={`${(results?.metrics?.carbonEmissions || -18) > 0 ? 'text-error' : 'text-tertiary'} font-bold flex items-center`}>
              {(results?.metrics?.carbonEmissions || -18) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(results?.metrics?.carbonEmissions || -18)}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-on-surface-variant text-label-md">Carbon Impact</p>
            <h3 className="text-headline-sm font-bold">{results?.metrics?.carbonEmissions > 0 ? '+' : ''}{results?.metrics?.carbonEmissions || -18}% Emissions</h3>
          </div>
        </div>
      </div>

      {/* Advanced Scores Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface">Sustainability Score</h3>
            <Leaf />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-emerald-500">{sustainabilityScore}</span>
            <span className="text-on-surface-variant font-bold mb-1">/ 10</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">Based on carbon footprint reduction and renewable energy grid integration.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface">Resilience Score</h3>
            <Shield />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-primary">{resilienceScore}</span>
            <span className="text-on-surface-variant font-bold mb-1">/ 10</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">Based on infrastructure stress margins, water reserves, and disaster readiness.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface">Economic Score</h3>
            <TrendingUp />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-amber-500">{economicScore}</span>
            <span className="text-on-surface-variant font-bold mb-1">/ 10</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">Based on job creation, industrial expansion, and metro throughput increase.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-sm text-on-surface">Baseline Scenario</h3>
            <span className="bg-surface-container px-3 py-1 rounded-full text-label-md text-on-surface-variant">Current (2025)</span>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden bg-surface-variant/20 border border-outline-variant/30">
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjJqA2zqyjwS3nX5WpOsgGzm-Z3FtlRp-Sq4BiHABV4AfXuq0w9swBBhNoF_yjmmwWBDNlXsSEbD90U3X59uhEKXgn5uGqZa_ZDXkGbFo6rWFwN_X1rbwK54xhENNFLdcA4qM_thrw--s1eqIyxlfRsH37ID_E669achFMgh_adt7Ji1iy9kI_A2mUNrZ7vTgeacuxl7MqqLq9LUc60zHai_mCDsCWIFDV3Yzp1wZtFtZnMeVUkDpzXzukVvOBLqy4emO3aeShEXc')" }}></div>
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span className="text-label-md text-on-surface">Congestion Peak</span>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-sm text-on-surface">Post-Simulation</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-md font-bold">Optimized</span>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden bg-surface-variant/20 border border-outline-variant/30">
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCECrqMCWrozB7nT_o7yxC7JP9ndVCum8yE5ST3mKEM9ChxJVs8wYMeHGUS-tvpAVW8GLYsVW3hDRoQRL-IZb_OpN35FWiVWAfBtORqNdIOGKVSZ7YwobswJISJQLWQlbbE-KMp9H0bEc71BatDY7wn-2ou37vSwcs9WOGgdJtohrnICL7JE5NR3orluKPDEw3L1Vq3tuMXgky_vNboaWOpeUI86eyrG5S0474Vbmm7P3qwWQjq_2lCQA5wm6CWqyNwAKWQF_8yjb0')" }}></div>
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary"></div>
              <span className="text-label-md text-on-surface">Optimized Flow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 shadow-sm rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-headline-sm text-on-surface">Impact Detailed Summary</h3>
            <p className="text-on-surface-variant text-body-sm">Granular breakdown of simulation variances and risk assessment.</p>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold hover:underline">
            <Download />
            Export Dataset
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-left">
                <th className="pb-4 px-4 text-label-md text-on-surface-variant uppercase tracking-widest">Parameter</th>
                <th className="pb-4 px-4 text-label-md text-on-surface-variant uppercase tracking-widest">Baseline</th>
                <th className="pb-4 px-4 text-label-md text-on-surface-variant uppercase tracking-widest">Simulated</th>
                <th className="pb-4 px-4 text-label-md text-on-surface-variant uppercase tracking-widest">Variance</th>
                <th className="pb-4 px-4 text-label-md text-on-surface-variant uppercase tracking-widest">Risk Level</th>
              </tr>
            </thead>
            <tbody className="text-body-md">
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-5 px-4 font-semibold text-on-surface">Transit Throughput</td>
                <td className="py-5 px-4">12,400 p/h</td>
                <td className="py-5 px-4">15,800 p/h</td>
                <td className="py-5 px-4 text-tertiary font-bold">+27.4%</td>
                <td className="py-5 px-4"><span className="bg-tertiary/10 text-tertiary px-2 py-1 rounded text-label-md font-bold">LOW</span></td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-5 px-4 font-semibold text-on-surface">Grid Stress Index</td>
                <td className="py-5 px-4">64.2</td>
                <td className="py-5 px-4">79.5</td>
                <td className="py-5 px-4 text-error font-bold">+23.8%</td>
                <td className="py-5 px-4"><span className="bg-error-container text-on-error-container px-2 py-1 rounded text-label-md font-bold">CRITICAL</span></td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-5 px-4 font-semibold text-on-surface">Public Space Ratio</td>
                <td className="py-5 px-4">14%</td>
                <td className="py-5 px-4">22%</td>
                <td className="py-5 px-4 text-tertiary font-bold">+8.0%</td>
                <td className="py-5 px-4"><span className="bg-tertiary/10 text-tertiary px-2 py-1 rounded text-label-md font-bold">LOW</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
