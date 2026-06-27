"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { ChevronRight, Download, Crosshair, Filter, Share2, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, BarChart, Bar, ComposedChart, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--slate-200)]">
      <div>
        <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--slate-500)] mt-1">{subtitle}</p>}
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-xs font-bold text-[var(--slate-700)] transition-colors">
          <Filter size={14} /> Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-xs font-bold text-[var(--slate-700)] transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>
    </div>
  );
}

function ChartContainer({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[var(--slate-200)] flex flex-col h-full shadow-sm">
      <div className="px-4 py-3 border-b border-[var(--slate-200)] bg-[var(--slate-50)]">
        <h3 className="text-xs font-bold text-[var(--slate-800)] uppercase tracking-widest">{title}</h3>
      </div>
      <div className="flex-1 p-4 min-h-[260px]">
        {children}
      </div>
      <div className="px-4 py-2 border-t border-[var(--slate-200)] bg-[var(--slate-50)] flex justify-between items-center text-[9px] font-mono text-[var(--slate-500)] uppercase tracking-widest">
        <span>Source: {source}</span>
        <span className="flex items-center gap-1 text-[var(--accent-blue)]"><Activity size={10} /> Live Telemetry</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[var(--slate-200)] p-3 shadow-md text-xs font-mono">
        <div className="font-bold text-[var(--slate-800)] mb-2 border-b border-[var(--slate-100)] pb-1">{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: entry.color }} />
            <span className="text-[var(--slate-500)]">{entry.name}:</span>
            <span className="font-bold text-[var(--slate-900)]">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Mini Sparkline Component
function Sparkline({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticsPage() {
  const { results, activePolicy, timeline } = useSimulationStore();
  const cityData = useCityDataStore();

  const demographicData = useMemo(() => {
    return timeline.filter((_, i) => i % 5 === 0 || timeline[i].year === 2050).map(t => ({
      year: String(t.year),
      Population: parseFloat((t.population / 1000000).toFixed(2)),
      Baseline: parseFloat((13.6 * Math.pow(1.021, t.year - 2025)).toFixed(2))
    }));
  }, [timeline]);

  const energyLoadData = useMemo(() => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:00'];
    const factors = [0.5, 0.45, 0.85, 1.0, 0.9, 1.08, 0.65];
    return hours.map((h, i) => {
      const base = 4.1 * factors[i];
      const simMultiplier = 1 + (results.energy.delta / 18500);
      return {
        hour: h,
        Baseline: parseFloat(base.toFixed(2)),
        Simulated: parseFloat((base * simMultiplier).toFixed(2))
      };
    });
  }, [results]);

  const trafficData = useMemo(() => {
    const districts = [
      { name: 'Whitefield', base: 94 },
      { name: 'Electronic City', base: 62 },
      { name: 'Koramangala', base: 92 },
      { name: 'Hebbal', base: 65 },
      { name: 'Indiranagar', base: 88 },
    ];
    const deltaScale = results.traffic.delta / 67;
    return districts.map(d => ({
      district: d.name,
      Baseline: d.base,
      Simulated: Math.max(10, Math.round(d.base * (1 + deltaScale)))
    }));
  }, [results]);

  const co2SectorData = useMemo(() => {
    const years = ['2025', '2030', '2035', '2040', '2045', '2050'];
    return years.map((yr, idx) => {
      const t = idx * 5;
      const state = timeline.find(item => item.year === 2025 + t) || timeline[timeline.length - 1];
      const transport = state.co2_ktyr * 0.43;
      const energy = state.co2_ktyr * 0.39;
      const industry = state.co2_ktyr * 0.18;
      return {
        year: yr,
        Transport: parseFloat((transport / 1000).toFixed(1)),
        Energy: parseFloat((energy / 1000).toFixed(1)),
        Industry: parseFloat((industry / 1000).toFixed(1)),
        Total: parseFloat((state.co2_ktyr / 1000).toFixed(1))
      };
    });
  }, [timeline]);

  const economicData = useMemo(() => {
    return timeline.filter((_, i) => i % 2 === 0).map(t => ({
      gdp: t.gdp_growth,
      health: t.city_health,
      year: t.year
    }));
  }, [timeline]);

  const radarData = useMemo(() => {
    const current = timeline[timeline.length - 1] || timeline[0];
    return [
      { factor: 'AQI', Current: 62, Projected: 48 },
      { factor: 'Transit', Current: Math.max(20, 100 - results.traffic.delta * 0.6), Projected: 72 },
      { factor: 'Grid', Current: Math.max(20, 100 - (results.energy.delta / 18500) * 50), Projected: 78 },
      { factor: 'Water', Current: current.water_stress ? Math.max(25, 100 - current.water_stress * 0.4) : 75, Projected: 65 },
      { factor: 'Ecology', Current: 48, Projected: 58 },
      { factor: 'Health', Current: Math.round(current.city_health * 10), Projected: 74 },
    ];
  }, [timeline, results]);

  const districtTableData = useMemo(() => {
    const districts = [
      { name: 'Whitefield', index: 94, trend: 'up' as const, sparkData: Array.from({length: 12}, () => ({v: 85 + Math.random()*15})) },
      { name: 'Koramangala', index: 92, trend: 'up' as const, sparkData: Array.from({length: 12}, () => ({v: 80 + Math.random()*15})) },
      { name: 'Indiranagar', index: 88, trend: 'down' as const, sparkData: Array.from({length: 12}, () => ({v: 95 - Math.random()*15})) },
      { name: 'Hebbal', index: 65, trend: 'down' as const, sparkData: Array.from({length: 12}, () => ({v: 75 - Math.random()*15})) },
      { name: 'Electronic City', index: 62, trend: 'up' as const, sparkData: Array.from({length: 12}, () => ({v: 50 + Math.random()*15})) },
    ];
    return districts;
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-100)] text-[var(--slate-800)]">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-[var(--slate-200)] px-8 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[var(--accent-navy)] text-white flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-0.5">Statistical Analytics</div>
            <h1 className="text-lg font-bold text-[var(--slate-900)]">Performance Telemetry</h1>
          </div>
        </div>
        <div className="text-xs font-mono font-bold text-[var(--slate-500)] bg-[var(--slate-50)] px-3 py-1.5 border border-[var(--slate-200)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-teal)] animate-pulse" />
          SYSTEM LIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">

          {/* Section 1 */}
          <div>
            <SectionHeader title="Core Demographic & Load Trajectory" subtitle="Population forecasts against energy grid peak capacities" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer title="Demographic Shift Forecast" source="Model: Logistic Growth (R²=0.98)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demographicData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <defs>
                      <linearGradient id="demAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-200)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} tickLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Year', position: 'insideBottom', offset: -15, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold', textAnchor: 'middle' }} />
                    <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} tickLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Population (Millions)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--slate-600)', paddingTop: '20px' }} />
                    <Area type="monotone" name="Simulated Projection" dataKey="Population" stroke="var(--accent-blue)" strokeWidth={2} fill="url(#demAreaGrad)" dot={false} />
                    <Area type="monotone" name="Baseline (Unmitigated)" dataKey="Baseline" stroke="var(--slate-400)" strokeDasharray="4 4" strokeWidth={1.5} fill="none" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="Peak Grid Load Simulation" source="BESCOM Telemetry & Grid Model">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyLoadData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-200)" />
                    <XAxis dataKey="hour" tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} tickLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Hour of Day', position: 'insideBottom', offset: -15, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold', textAnchor: 'middle' }} />
                    <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} tickLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Load (GW)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--slate-600)', paddingTop: '20px' }} />
                    <Line type="stepAfter" name="Baseline Draw" dataKey="Baseline" stroke="var(--slate-400)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                    <Line type="stepAfter" name="Simulated Draw" dataKey="Simulated" stroke="var(--accent-navy)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-navy)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <SectionHeader title="Emissions & Economic Impact" subtitle="Sector-wise carbon generation and GDP correlation" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                <ChartContainer title="Carbon Sector Distribution" source="IPCC Tier 2 Emission Model">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={co2SectorData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-200)" />
                      <XAxis dataKey="year" tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Year', position: 'insideBottom', offset: -15, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold' }} />
                      <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Emissions (Mt)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                      <Bar dataKey="Transport" name="Transport" stackId="a" fill="var(--accent-navy)" maxBarSize={30} />
                      <Bar dataKey="Energy" name="Energy Grid" stackId="a" fill="var(--slate-400)" maxBarSize={30} />
                      <Bar dataKey="Industry" name="Industrial" stackId="a" fill="var(--slate-300)" maxBarSize={30} />
                      <Line type="monotone" name="Total Net" dataKey="Total" stroke="var(--accent-teal)" strokeWidth={2} dot={{ r: 4, fill: 'white', stroke: 'var(--accent-teal)', strokeWidth: 2 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <ChartContainer title="Growth/Health Correlation" source="Solow-Swan Matrix">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" />
                    <XAxis type="number" dataKey="gdp" name="GDP Growth" unit="%" tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'GDP Growth (%)', position: 'insideBottom', offset: -15, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold' }} />
                    <YAxis type="number" dataKey="health" name="City Health" tick={{ fill: 'var(--slate-500)', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-300)' }} label={{ value: 'Health Index', angle: -90, position: 'insideLeft', offset: 0, fontSize: 10, fill: 'var(--slate-400)', fontWeight: 'bold' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Projections" data={economicData} fill="var(--accent-blue)" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Section 3: Dense Data Table with Sparklines */}
          <div>
            <SectionHeader title="District Operational Telemetry" subtitle="Micro-metric volatility and congestion severity tracking" />
            <div className="bg-white border border-[var(--slate-200)] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--slate-50)] text-[9px] uppercase font-bold text-[var(--slate-500)] border-b border-[var(--slate-200)] tracking-widest">
                      <th className="py-3 px-4 w-12 text-center">Rank</th>
                      <th className="py-3 px-4">District Sector</th>
                      <th className="py-3 px-4 w-32 text-right">Congestion Index</th>
                      <th className="py-3 px-4 w-24 text-center">Trend</th>
                      <th className="py-3 px-4 w-48">12H Volatility (Spark)</th>
                      <th className="py-3 px-4">Severity Load</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtTableData.map((d, idx) => (
                      <tr key={d.name} className="border-b border-[var(--slate-100)] hover:bg-[var(--slate-50)] transition-colors">
                        <td className="py-3 px-4 text-center text-xs font-bold text-[var(--slate-400)]">{idx + 1}</td>
                        <td className="py-3 px-4 text-xs font-bold text-[var(--slate-800)] uppercase tracking-wider">{d.name}</td>
                        <td className="py-3 px-4 text-right font-mono text-sm font-bold text-[var(--slate-900)]">{d.index}.0</td>
                        <td className="py-3 px-4 text-center">
                          {d.trend === 'up' 
                            ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-red)] bg-[var(--accent-red)]/10 px-2 py-0.5 rounded uppercase"><TrendingUp size={12}/> High</span>
                            : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-teal)] bg-[var(--accent-teal)]/10 px-2 py-0.5 rounded uppercase"><TrendingUp size={12} className="rotate-180"/> Low</span>
                          }
                        </td>
                        <td className="py-3 px-4 h-12">
                          <div className="h-6 w-full">
                            <Sparkline data={d.sparkData} dataKey="v" color={d.trend === 'up' ? 'var(--accent-red)' : 'var(--accent-teal)'} />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full bg-[var(--slate-200)] overflow-hidden">
                              <div className={`h-full rounded-full ${d.index > 80 ? 'bg-[var(--accent-red)]' : d.index > 60 ? 'bg-[var(--accent-amber)]' : 'bg-[var(--accent-teal)]'}`} style={{ width: `${d.index}%` }} />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[var(--slate-500)] w-8 text-right">{d.index}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-[var(--slate-200)] bg-[var(--slate-50)] text-[9px] font-mono text-[var(--slate-500)] uppercase tracking-widest text-right">
                Source: BPR Traffic Matrix · Update Freq: 15min
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
