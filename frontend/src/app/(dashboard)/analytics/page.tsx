"use client";

import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, BarChart, Bar
} from 'recharts';

export default function AnalyticsPage() {
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('simulationResults');
      if (stored) {
        setResults(JSON.parse(stored));
      } else {
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

  // 1. Demographic shifts data
  const demographicData = [
    { year: '2025', Baseline: 13.6, Simulated: 13.6 },
    { year: '2027', Baseline: 14.1, Simulated: 14.3 },
    { year: '2030', Baseline: 14.8, Simulated: 15.2 },
    { year: '2032', Baseline: 15.3, Simulated: 16.0 },
    { year: '2035', Baseline: 16.2, Simulated: 17.4 }
  ];

  // 2. Energy Load Peak curves
  const energyLoadData = [
    { hour: '00:00', Baseline: 2.1, Simulated: 2.4 },
    { hour: '04:00', Baseline: 1.8, Simulated: 2.0 },
    { hour: '08:00', Baseline: 3.5, Simulated: 4.2 },
    { hour: '12:00', Baseline: 4.2, Simulated: 5.6 },
    { hour: '16:00', Baseline: 3.8, Simulated: 4.9 },
    { hour: '20:00', Baseline: 4.5, Simulated: 6.2 },
    { hour: '23:00', Baseline: 2.8, Simulated: 3.4 }
  ];

  // 3. Traffic Congestion comparison across districts
  const trafficData = [
    { district: 'Whitefield', Baseline: 94, Simulated: Math.max(10, 94 + (results?.metrics?.trafficCongestion || -12)) },
    { district: 'ECity', Baseline: 62, Simulated: Math.max(10, 62 + (results?.metrics?.trafficCongestion || -12)) },
    { district: 'Koramangala', Baseline: 92, Simulated: Math.max(10, 92 + (results?.metrics?.trafficCongestion || -12)) },
    { district: 'Hebbal', Baseline: 65, Simulated: Math.max(10, 65 + (results?.metrics?.trafficCongestion || -12)) },
    { district: 'Indiranagar', Baseline: 88, Simulated: Math.max(10, 88 + (results?.metrics?.trafficCongestion || -12)) }
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
          <span>Analytics Suite</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">Performance Telemetry</span>
        </nav>
        <h1 className="font-display-sm text-display-sm text-on-surface">Statistical Analytics</h1>
        <p className="text-on-surface-variant font-body-md max-w-xl">
          Deep-dive forecasting and telemetry reports of demographic shifts, energy load curves, and transit throughputs.
        </p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Population Growth Curve */}
        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-on-surface text-base">Demographic Shifts</h3>
            <p className="text-xs text-on-surface-variant">Bangalore population trajectory (Millions)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demographicData}>
                <defs>
                  <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004ac6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#004ac6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Baseline" stroke="#94a3b8" fillOpacity={1} fill="url(#colorBase)" strokeWidth={2} />
                <Area type="monotone" dataKey="Simulated" stroke="#004ac6" fillOpacity={1} fill="url(#colorSim)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Power Load Grid */}
        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-on-surface text-base">Peak Grid Load</h3>
            <p className="text-xs text-on-surface-variant">Simulated energy draw comparisons (GW)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Baseline" stroke="#94a3b8" strokeWidth={2} />
                <Line type="monotone" dataKey="Simulated" stroke="#d97706" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Traffic Congestion Deltas */}
        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-bold text-on-surface text-base">District Transit Latency</h3>
            <p className="text-xs text-on-surface-variant">Congestion Index comparisons (Scale 0-100)</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Simulated" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
