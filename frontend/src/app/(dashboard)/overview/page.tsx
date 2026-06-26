"use client";

import React from 'react';

export default function OverviewPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">City Overview Dashboard</h1>
          <p className="text-body-md text-on-surface-variant">Real-time metropolitan performance analytics for Bengaluru Cluster.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface border border-outline-variant/30 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
            <span className="font-mono-label text-on-surface">LIVE: 14:32:05</span>
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            Export PDF
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-primary-fixed-dim/20 border border-primary/20 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <div className="flex-1">
          <h4 className="font-label-md text-primary uppercase tracking-wider">AI Predictive Insight</h4>
          <p className="text-body-md font-semibold text-on-surface">
            Traffic at <span className="text-primary underline decoration-dotted">Silk Board</span> expected to surge 12% in next 2 hours. <span className="text-on-surface-variant font-normal">Recommend activating peak-hour signal sync on ORR.</span>
          </p>
        </div>
        <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary-container/80 transition-all">TAKE ACTION</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20 group hover:shadow-md transition-shadow">
          <p className="text-on-surface-variant font-label-md mb-2">Population</p>
          <h3 className="text-headline-sm font-bold text-on-surface">13.6M</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            <span className="material-symbols-outlined text-[18px]">trending_up</span>
            <span className="text-[11px] font-bold">+1.8% YoY</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Traffic Index</p>
          <div className="flex items-center gap-2">
            <h3 className="text-headline-sm font-bold text-error">High</h3>
            <div className="px-2 py-0.5 bg-error-container text-on-error-container rounded text-[10px] font-bold">CRITICAL</div>
          </div>
          <div className="mt-4 w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="w-[88%] h-full bg-error"></div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Energy Demand</p>
          <h3 className="text-headline-sm font-bold text-on-surface">+4.2%</h3>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span className="text-[11px] font-medium">8.4 GWh / Day</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Water Reserves</p>
          <h3 className="text-headline-sm font-bold text-error">Critical</h3>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">water_drop</span>
            <span className="text-[11px] font-medium">18% Capacity</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">CO2 Emissions</p>
          <h3 className="text-headline-sm font-bold text-on-surface">2.4t</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            <span className="material-symbols-outlined text-[18px]">trending_down</span>
            <span className="text-[11px] font-bold">-0.5% Mtd</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Jobs Index</p>
          <h3 className="text-headline-sm font-bold text-on-surface">114.2</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-[11px] font-bold">High Growth</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">GDP Growth</p>
          <h3 className="text-headline-sm font-bold text-primary">8.4%</h3>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span className="text-[11px] font-medium">Metropolitan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <div>
              <h3 className="font-headline-sm text-on-surface">Real-Time Traffic Congestion</h3>
              <p className="text-body-sm text-on-surface-variant">Heatmap visualization of average transit speeds.</p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-primary">Map View</button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Satellite</button>
            </div>
          </div>
          <div className="flex-1 min-h-[400px] relative">
            <div className="w-full h-full bg-cover bg-center absolute inset-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWuypSYZ0QS6VzvQZ1E8WSG55OxBmGREGk-oBeUM_rJxPG3eZLWtOEyUTOOD7vH085OC7wd1GGSzCSRWFUZvPnGROa6_kA1gQJrqnG41E2VtmCysv3OZtXIm5oqxnlQZsgMMPTwR14APu6GTogfweayrZ80dpFeE-IfqJ-wFrPkoS3KEDYkQDzseKukhFvMzi5T9hnZearqdJFnYGFEj-kiUnDjSBSl82piBBrOj2lNhvuvr3-P7FdeBkM99Ks6SG8Ando-12H-_Y')" }}></div>
            <div className="absolute bottom-6 right-6 flex flex-col gap-3">
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/40">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Avg Speed City-wide</p>
                <p className="text-xl font-bold text-on-surface">18 km/h</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/40">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Active Incidents</p>
                <p className="text-xl font-bold text-error">12 Major</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex-1">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-headline-sm text-on-surface">Energy Demand</h3>
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </div>
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
              <div className="w-full h-full relative flex items-end gap-1">
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[40%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[55%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[70%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%]"></div>
                <div className="flex-1 bg-primary rounded-t-sm h-[85%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[40%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
