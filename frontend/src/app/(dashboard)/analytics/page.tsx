"use client";

import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, BarChart, Bar
} from 'recharts';

export default function AnalyticsPage() {
  const store = useSimulationStore();

  const popGrowth = store.popGrowth;
  const metrics = store.metrics;

  // 1. Demographic shifts data (Reacts to popGrowth)
  const demographicData = [
    { year: '2025', Baseline: 13.6, Simulated: 13.6 },
    { year: '2027', Baseline: 14.1, Simulated: Number((14.1 * (1 + (popGrowth * 0.005))).toFixed(1)) },
    { year: '2030', Baseline: 14.8, Simulated: Number((14.8 * (1 + (popGrowth * 0.01))).toFixed(1)) },
    { year: '2032', Baseline: 15.3, Simulated: Number((15.3 * (1 + (popGrowth * 0.015))).toFixed(1)) },
    { year: '2035', Baseline: 16.2, Simulated: Number((16.2 * (1 + (popGrowth * 0.02))).toFixed(1)) }
  ];

  // 2. Energy Load Peak curves (Reacts to energyDemand)
  const energyLoadData = [
    { hour: '00:00', Baseline: 2.1, Simulated: Number((2.1 * (1 + metrics.energyDemand / 100)).toFixed(1)) },
    { hour: '04:00', Baseline: 1.8, Simulated: Number((1.8 * (1 + metrics.energyDemand / 100)).toFixed(1)) },
    { hour: '08:00', Baseline: 3.5, Simulated: Number((3.5 * (1 + metrics.energyDemand / 100)).toFixed(1)) },
    { hour: '12:00', Baseline: 4.2, Simulated: Number((4.2 * (1 + metrics.energyDemand / 100)).toFixed(1)) },
    { hour: '16:00', Baseline: 3.8, Simulated: Number((3.8 * (1 + metrics.energyDemand / 100)).toFixed(1)) },
    { hour: '20:00', Baseline: 4.5, Simulated: Number((4.5 * (1 + metrics.energyDemand / 100)).toFixed(1)) },
    { hour: '23:00', Baseline: 2.8, Simulated: Number((2.8 * (1 + metrics.energyDemand / 100)).toFixed(1)) }
  ];

  // 3. Traffic Congestion comparison across districts (Reacts to trafficCongestion)
  const trafficData = [
    { district: 'Whitefield', Baseline: 94, Simulated: Math.max(10, Math.round(94 + metrics.trafficCongestion)) },
    { district: 'ECity', Baseline: 62, Simulated: Math.max(10, Math.round(62 + metrics.trafficCongestion)) },
    { district: 'Koramangala', Baseline: 92, Simulated: Math.max(10, Math.round(92 + metrics.trafficCongestion)) },
    { district: 'Hebbal', Baseline: 65, Simulated: Math.max(10, Math.round(65 + metrics.trafficCongestion)) },
    { district: 'Indiranagar', Baseline: 88, Simulated: Math.max(10, Math.round(88 + metrics.trafficCongestion)) }
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
