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
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--slate-800)]">
      <div>
        <h2 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--accent-blue)]" /> {title}
        </h2>
        {subtitle && <p className="text-[10px] text-[var(--slate-400)] mt-1">{subtitle}</p>}
      </div>
      <div className="flex gap-1.5">
        <button className="flex items-center gap-1.5 px-2 py-1 bg-[var(--slate-900)] border border-[var(--slate-700)] hover:border-[var(--accent-blue)] text-[10px] font-bold text-[var(--slate-300)] transition-colors">
          <Filter size={12} /> FILTER
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1 bg-[var(--slate-900)] border border-[var(--slate-700)] hover:border-[var(--accent-blue)] text-[10px] font-bold text-[var(--slate-300)] transition-colors">
          <Download size={12} /> EXPORT CSV
        </button>
      </div>
    </div>
  );
}

function ChartContainer({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f141e] border border-[var(--slate-800)] flex flex-col h-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      <div className="px-3 py-2 border-b border-[var(--slate-800)] bg-[var(--slate-900)]/80 flex justify-between items-center">
        <h3 className="text-[9px] font-bold text-[var(--slate-300)] uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[var(--accent-teal)] animate-pulse" /> {title}
        </h3>
        <span className="text-[8px] font-mono text-[var(--slate-500)] uppercase tracking-wider">{source}</span>
      </div>
      <div className="flex-1 p-3 min-h-[220px]">
        {children}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--slate-900)] border border-[var(--slate-700)] p-2 shadow-xl text-[10px] font-mono">
        <div className="font-bold text-white mb-1 border-b border-[var(--slate-700)] pb-1">{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-sm" style={{ background: entry.color }} />
            <span className="text-[var(--slate-400)]">{entry.name}:</span>
            <span className="font-bold text-[var(--slate-200)]">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
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
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e14] text-white">
      
      {/* Header Bar */}
      <div className="bg-[var(--slate-900)] border-b border-[var(--slate-800)] px-6 py-3 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center border border-white/10">
            <Activity size={16} color="white" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-[var(--slate-400)] uppercase tracking-widest mb-0.5">Statistical Analytics</div>
            <h1 className="text-sm font-bold text-white tracking-wide">Performance Telemetry Node</h1>
          </div>
        </div>
        <div className="text-[9px] font-mono font-bold text-[var(--accent-teal)] bg-[var(--accent-teal)]/10 px-3 py-1.5 border border-[var(--accent-teal)]/30 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse shadow-[0_0_8px_var(--accent-teal)]" />
          SYSTEM LIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="w-full space-y-6">

          {/* Section 1 */}
          <div>
            <SectionHeader title="Core Demographic & Load Trajectory" subtitle="Population forecasts against energy grid peak capacities" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartContainer title="Demographic Shift Forecast" source="Model: Logistic Growth (R²=0.98)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demographicData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <defs>
                      <linearGradient id="demAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="1 3" vertical={false} stroke="var(--slate-700)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} tickLine={{ stroke: 'var(--slate-700)' }} />
                    <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} tickLine={{ stroke: 'var(--slate-700)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--slate-400)', paddingTop: '10px' }} />
                    <Area type="monotone" name="Simulated Projection" dataKey="Population" stroke="var(--accent-blue)" strokeWidth={1.5} fill="url(#demAreaGrad)" dot={false} />
                    <Area type="monotone" name="Baseline (Unmitigated)" dataKey="Baseline" stroke="var(--slate-500)" strokeDasharray="4 4" strokeWidth={1} fill="none" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="Peak Grid Load Simulation" source="BESCOM Telemetry & Grid Model">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyLoadData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="1 3" vertical={false} stroke="var(--slate-700)" />
                    <XAxis dataKey="hour" tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} tickLine={{ stroke: 'var(--slate-700)' }} />
                    <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} tickLine={{ stroke: 'var(--slate-700)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--slate-400)', paddingTop: '10px' }} />
                    <Line type="stepAfter" name="Baseline Draw" dataKey="Baseline" stroke="var(--slate-500)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
                    <Line type="stepAfter" name="Simulated Draw" dataKey="Simulated" stroke="var(--accent-teal)" strokeWidth={1.5} dot={{ r: 2, fill: 'var(--accent-teal)', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <SectionHeader title="Emissions & Economic Impact" subtitle="Sector-wise carbon generation and GDP correlation" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              <div className="lg:col-span-2">
                <ChartContainer title="Carbon Sector Distribution" source="IPCC Tier 2 Emission Model">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={co2SectorData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                      <CartesianGrid strokeDasharray="1 3" vertical={false} stroke="var(--slate-700)" />
                      <XAxis dataKey="year" tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} />
                      <YAxis tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '10px' }} />
                      <Bar dataKey="Transport" name="Transport" stackId="a" fill="var(--accent-blue)" maxBarSize={20} />
                      <Bar dataKey="Energy" name="Energy Grid" stackId="a" fill="var(--slate-600)" maxBarSize={20} />
                      <Bar dataKey="Industry" name="Industrial" stackId="a" fill="var(--slate-500)" maxBarSize={20} />
                      <Line type="monotone" name="Total Net" dataKey="Total" stroke="var(--accent-teal)" strokeWidth={1.5} dot={{ r: 2, fill: 'var(--slate-900)', stroke: 'var(--accent-teal)', strokeWidth: 1.5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <ChartContainer title="Growth/Health Correlation" source="Solow-Swan Matrix">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="1 3" stroke="var(--slate-700)" />
                    <XAxis type="number" dataKey="gdp" name="GDP Growth" unit="%" tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} />
                    <YAxis type="number" dataKey="health" name="City Health" tick={{ fill: 'var(--slate-500)', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: 'var(--slate-700)' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--slate-600)' }} />
                    <Scatter name="Projections" data={economicData} fill="var(--accent-teal)" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Section 3: Dense Data Table with Sparklines */}
          <div>
            <SectionHeader title="District Operational Telemetry" subtitle="Micro-metric volatility and congestion severity tracking" />
            <div className="bg-[#0f141e] border border-[var(--slate-800)] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--slate-900)]/80 text-[8px] uppercase font-bold text-[var(--slate-500)] border-b border-[var(--slate-800)] tracking-widest">
                      <th className="py-2 px-3 w-10 text-center">Rnk</th>
                      <th className="py-2 px-3">District Sector</th>
                      <th className="py-2 px-3 w-28 text-right">Congestion IDX</th>
                      <th className="py-2 px-3 w-20 text-center">Trend</th>
                      <th className="py-2 px-3 w-40">12H Volatility (Spark)</th>
                      <th className="py-2 px-3">Severity Load</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtTableData.map((d, idx) => (
                      <tr key={d.name} className="border-b border-[var(--slate-800)]/50 hover:bg-[var(--slate-800)]/30 transition-colors">
                        <td className="py-2 px-3 text-center text-[10px] font-mono text-[var(--slate-600)]">0{idx + 1}</td>
                        <td className="py-2 px-3 text-[10px] font-bold text-[var(--slate-300)] uppercase tracking-wider">{d.name}</td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] font-bold text-white">{d.index}.0</td>
                        <td className="py-2 px-3 text-center">
                          {d.trend === 'up' 
                            ? <span className="inline-flex items-center gap-1 text-[8px] font-bold text-[var(--accent-red)] bg-[var(--accent-red)]/10 px-1.5 py-0.5 rounded-sm uppercase tracking-widest border border-[var(--accent-red)]/20"><TrendingUp size={10}/> High</span>
                            : <span className="inline-flex items-center gap-1 text-[8px] font-bold text-[var(--accent-teal)] bg-[var(--accent-teal)]/10 px-1.5 py-0.5 rounded-sm uppercase tracking-widest border border-[var(--accent-teal)]/20"><TrendingUp size={10} className="rotate-180"/> Low</span>
                          }
                        </td>
                        <td className="py-2 px-3 h-8">
                          <div className="h-4 w-full">
                            <Sparkline data={d.sparkData} dataKey="v" color={d.trend === 'up' ? 'var(--accent-red)' : 'var(--accent-teal)'} />
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 rounded-sm bg-[var(--slate-800)] overflow-hidden">
                              <div className={`h-full rounded-sm ${d.index > 80 ? 'bg-[var(--accent-red)]' : d.index > 60 ? 'bg-[var(--accent-amber)]' : 'bg-[var(--accent-teal)]'}`} style={{ width: `${d.index}%` }} />
                            </div>
                            <span className="text-[9px] font-mono font-bold text-[var(--slate-400)] w-6 text-right">{d.index}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-1.5 border-t border-[var(--slate-800)] bg-[var(--slate-900)]/80 text-[8px] font-mono text-[var(--slate-500)] uppercase tracking-widest text-right flex justify-between">
                <span>Data Source: BPR Traffic Matrix</span>
                <span><Activity size={10} className="inline mr-1"/> Update Freq: 15min</span>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
