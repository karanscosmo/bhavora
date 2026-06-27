"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { ChevronRight, Download, Crosshair, TrendingUp, Activity, BarChart3, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, BarChart, Bar, ComposedChart, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

function TimeRangeSelector() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {['1H', '24H', '7D', '1M', '1Y'].map((t) => (
        <button key={t} className="time-chip" style={{
          padding: '2px 8px', fontSize: '9px', fontWeight: 600,
          borderRadius: '4px', border: '1px solid var(--border-subtle)',
          background: t === '24H' ? 'var(--accent-navy)' : 'transparent',
          color: t === '24H' ? '#fff' : 'var(--text-muted)',
          cursor: 'pointer',
        }}>{t}</button>
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}>
          <Download size={12} /> Export
        </button>
        <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}>
          <Crosshair size={12} /> Drill Down
        </button>
      </div>
    </div>
  );
}

function ChartContainer({ title, subtitle, children, delay = 0 }: { title: string; subtitle?: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', flexShrink: 0 }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
          {subtitle && <p className="micro-label" style={{ margin: '2px 0 0', textTransform: 'none', letterSpacing: 'normal', fontSize: '10px' }}>{subtitle}</p>}
        </div>
        <TimeRangeSelector />
      </div>
      <div style={{ flex: 1, minHeight: '240px' }}>
        {children}
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid var(--border-normal)',
        borderRadius: '8px', padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
        fontSize: '11px', lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '12px' }}>{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: entry.color, display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { results, activePolicy, timeline } = useSimulationStore();
  const cityData = useCityDataStore();

  // ── Original Data Pipelines (preserved exactly) ──

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

  const waterBalanceData = useMemo(() => {
    const years = ['2025', '2030', '2035', '2040', '2045', '2050'];
    return years.map((yr, idx) => {
      const t = idx * 5;
      const state = timeline.find(item => item.year === 2025 + t) || timeline[timeline.length - 1];
      const demand = state.population * 0.000135;
      const supply = 1450 * (1 + (activePolicy.waterInfrastructure / 100) * 0.25 * Math.min(1, t / 10));
      return {
        year: yr,
        Demand: Math.round(demand),
        Supply: Math.round(supply),
        Stress: state.water_stress
      };
    });
  }, [timeline, activePolicy]);

  const economicData = useMemo(() => {
    return timeline.filter((_, i) => i % 2 === 0).map(t => ({
      gdp: t.gdp_growth,
      health: t.city_health,
      year: t.year
    }));
  }, [timeline]);

  // ── New Data: Grid Load Forecast ──

  interface GridLoadPoint {
    hour: string;
    Baseline: number | null;
    Simulated: number | null;
    Projected?: number;
  }

  const gridLoadWithForecast: GridLoadPoint[] = useMemo(() => {
    const data: GridLoadPoint[] = [...energyLoadData];
    const last = data[data.length - 1];
    if (last) {
      ['02:00', '06:00', '10:00', '14:00'].forEach((h, i) => {
        data.push({
          hour: h,
          Baseline: null,
          Simulated: null,
          Projected: parseFloat(((last.Simulated ?? 0) * (1 + (i + 1) * 0.025)).toFixed(2)),
        });
      });
    }
    return data;
  }, [energyLoadData]);

  // ── New Data: 6-Factor Radar (Current vs Projected) ──

  const radarData = useMemo(() => {
    const current = timeline[timeline.length - 1] || timeline[0];
    return [
      { factor: 'Air Quality', Current: 62, Projected: 48 },
      { factor: 'Transit', Current: Math.max(20, 100 - results.traffic.delta * 0.6), Projected: 72 },
      { factor: 'Energy Grid', Current: Math.max(20, 100 - (results.energy.delta / 18500) * 50), Projected: 78 },
      { factor: 'Water Supply', Current: current.water_stress ? Math.max(25, 100 - current.water_stress * 0.4) : 75, Projected: 65 },
      { factor: 'Green Cover', Current: 48, Projected: 58 },
      { factor: 'City Health', Current: Math.round(current.city_health * 10), Projected: 74 },
    ];
  }, [timeline, results]);

  // ── New Data: Correlation Heatmap ──

  const heatmapLabels = ['Traffic', 'AQI', 'Energy', 'Water'];
  const heatmapData = useMemo(() => {
    const data = cityData.historicalData;
    const series = {
      Traffic: data.traffic,
      AQI: data.aqi,
      Energy: data.energy,
      Water: data.water,
    };
    const keys = Object.keys(series) as (keyof typeof series)[];
    return keys.map((row, ri) =>
      keys.map((col, ci) => {
        if (ri === ci) return { row, col, value: 1.0 };
        const base = 0.7 - Math.abs(ri - ci) * 0.15 + (ri * ci % 3) * 0.05;
        return { row, col, value: parseFloat(Math.min(0.99, Math.max(0.1, base)).toFixed(2)) };
      })
    ).flat();
  }, [cityData.historicalData]);

  // ── New Data: KPI Metrics ──

  const kpis = useMemo(() => [
    { label: 'Data Points Analyzed', value: '24,892', change: '+12.3%', positive: true },
    { label: 'Forecast Accuracy', value: '94.7%', change: '+2.1%', positive: true },
    { label: 'Anomalies Detected', value: '18', change: '-8.3%', positive: false },
    { label: 'Systems Monitored', value: '12,450', change: '+5.6%', positive: true },
  ], []);

  // ── District table data with trends ──

  const districtTableData = useMemo(() => {
    const districts = [
      { name: 'Whitefield', index: 94, trend: 'up' as const, rank: 1, color: '#EF4444' },
      { name: 'Koramangala', index: 92, trend: 'up' as const, rank: 2, color: '#F59E0B' },
      { name: 'Indiranagar', index: 88, trend: 'down' as const, rank: 3, color: '#F59E0B' },
      { name: 'Hebbal', index: 65, trend: 'down' as const, rank: 4, color: '#10B981' },
      { name: 'Electronic City', index: 62, trend: 'up' as const, rank: 5, color: '#10B981' },
    ];
    const maxIndex = Math.max(...districts.map(d => d.index));
    return districts.map(d => ({ ...d, barWidth: (d.index / maxIndex) * 100 }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const getHeatColor = (v: number) => {
    if (v > 0.85) return 'rgba(0, 74, 198, 0.85)';
    if (v > 0.7) return 'rgba(0, 74, 198, 0.6)';
    if (v > 0.5) return 'rgba(0, 74, 198, 0.35)';
    if (v > 0.3) return 'rgba(0, 74, 198, 0.2)';
    return 'rgba(0, 74, 198, 0.08)';
  };

  return (
    <div className="page-container" style={{ padding: '24px 32px', maxWidth: '1600px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <nav style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Analytics Suite</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: 'var(--accent-navy)', fontWeight: 600 }}>Performance Telemetry</span>
        </nav>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>Statistical Analytics</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Deep-dive forecasting and telemetry reports of demographic shifts, energy load curves, and transit throughputs.
        </p>
      </motion.div>

      {/* ── KPI Summary Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card"
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0',
          padding: '0', marginTop: '20px', overflow: 'hidden',
        }}
      >
        {kpis.map((kpi, idx) => (
          <div key={kpi.label} style={{
            padding: '20px 24px',
            borderRight: idx < kpis.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <p className="micro-label" style={{ margin: '0 0 6px' }}>{kpi.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="stat-value" style={{ color: 'var(--text-primary)' }}>{kpi.value}</span>
              <span className={`metric-change-${kpi.positive ? 'positive' : 'negative'}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Chart Sections ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Section 1: Core Metrics */}
        <div>
          <SectionHeader title="Core Metrics" subtitle="Demographic trajectory and energy grid performance" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ChartContainer title="Demographic Shifts" subtitle="Bengaluru population trajectory projections (Millions)" delay={0.1}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demographicData}>
                  <defs>
                    <linearGradient id="demAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004ac6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="Population" stroke="#004ac6" strokeWidth={2.5} fill="url(#demAreaGrad)" dot={false} />
                  <Area type="monotone" dataKey="Baseline" stroke="var(--text-disabled)" strokeDasharray="4 3" strokeWidth={1.5} fill="none" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Peak Grid Load" subtitle="Simulated energy draw hourly curves (GW) with forecast projection" delay={0.15}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gridLoadWithForecast} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="Baseline" stroke="var(--text-disabled)" strokeDasharray="4 3" strokeWidth={1.5} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="Simulated" stroke="#D97706" strokeWidth={2.5} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="Projected" stroke="#D97706" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#D97706', r: 3 }} connectNulls={true} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Section 2: Transportation & Environment */}
        <div>
          <SectionHeader title="Transportation & Environment" subtitle="District congestion and carbon emissions analysis" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ChartContainer title="District Transit Latency" subtitle="Congestion Index comparisons (Scale 0-100)" delay={0.2}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <XAxis dataKey="district" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Bar dataKey="Baseline" fill="var(--text-disabled)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="Simulated" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Carbon Footprint Sector Trend" subtitle="CO₂ Emissions Breakdown (Million tonnes / year)" delay={0.25}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={co2SectorData} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Bar dataKey="Transport" stackId="a" fill="#3B82F6" maxBarSize={24} />
                  <Bar dataKey="Energy" stackId="a" fill="#D97706" maxBarSize={24} />
                  <Bar dataKey="Industry" stackId="a" fill="#EF4444" maxBarSize={24} />
                  <Line type="monotone" dataKey="Total" stroke="#004ac6" strokeWidth={2.5} dot={{ r: 3, fill: '#004ac6' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Section 3: Resources & Economics */}
        <div>
          <SectionHeader title="Resources & Economics" subtitle="Water balance and economic correlation studies" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ChartContainer title="Water Supply & Demand" subtitle="Volumetric comparisons (MLD)" delay={0.3}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterBalanceData} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="Demand" stroke="#EF4444" fill="url(#demandGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="Supply" stroke="#059669" fill="url(#supplyGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Economic & Health Correlation" subtitle="GDP Growth rate vs City Health Index (2025–2050)" delay={0.35}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                  <XAxis type="number" dataKey="gdp" name="GDP Growth" unit="%" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <YAxis type="number" dataKey="health" name="City Health" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border-subtle)' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Scatter name="Projections" data={economicData} fill="#7C3AED" line={false} shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Section 4: Advanced Analytics (Radar + Heatmap) */}
        <div>
          <SectionHeader title="Advanced Analytics" subtitle="Multi-dimensional factor analysis and metric correlation" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ChartContainer title="6-Factor Performance Radar" subtitle="Current vs Projected sustainability indices" delay={0.4}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <PolarGrid stroke="var(--border-subtle)" strokeOpacity={0.6} />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 8 }} tickCount={5} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-muted)', paddingTop: '8px' }} />
                  <Radar name="Current" dataKey="Current" stroke="#004ac6" fill="#004ac6" fillOpacity={0.12} strokeWidth={2} />
                  <Radar name="Projected" dataKey="Projected" stroke="#059669" fill="#059669" fillOpacity={0.12} strokeWidth={2} strokeDasharray="4 3" />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Metric Correlation Heatmap" subtitle="Cross-metric correlation coefficients (Traffic / AQI / Energy / Water)" delay={0.45}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '4px', padding: '12px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${heatmapLabels.length}, 1fr)`, gap: '4px', width: '100%', maxWidth: '320px' }}>
                  {heatmapLabels.map((label) => (
                    <div key={label} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 2px' }}>
                      {label}
                    </div>
                  ))}
                  {heatmapLabels.map((row) =>
                    heatmapLabels.map((col) => {
                      const cell = heatmapData.find(d => d.row === row && d.col === col);
                      const val = cell ? cell.value : 0;
                      return (
                        <div key={`${row}-${col}`} style={{
                          aspectRatio: '1',
                          borderRadius: '6px',
                          background: getHeatColor(val),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: val > 0.6 ? '#fff' : 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          transition: 'transform 150ms ease, box-shadow 150ms ease',
                          cursor: 'default',
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          {val.toFixed(2)}
                        </div>
                      );
                    })
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Low</span>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
                      <div key={v} style={{ width: '16px', height: '10px', borderRadius: '2px', background: getHeatColor(v) }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>High</span>
                </div>
              </div>
            </ChartContainer>
          </div>
        </div>

        {/* Section 5: District Comparison Table */}
        <div>
          <SectionHeader title="District Comparison" subtitle="Real-time congestion ranking across Bengaluru districts" />
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            style={{ padding: '0', overflow: 'hidden' }}
          >
            {/* Table Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 100px 100px 1fr',
              gap: '0', padding: '12px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-2)',
            }}>
              <span className="micro-label" style={{ textAlign: 'center' }}>#</span>
              <span className="micro-label">District</span>
              <span className="micro-label" style={{ textAlign: 'right' }}>Index</span>
              <span className="micro-label" style={{ textAlign: 'center' }}>Trend</span>
              <span className="micro-label">Severity</span>
            </div>
            {/* Table Rows */}
            {districtTableData.map((d, idx) => (
              <div key={d.name} style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 100px 100px 1fr',
                gap: '0', padding: '14px 20px',
                borderBottom: idx < districtTableData.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                background: 'transparent',
                transition: 'background 120ms ease',
                cursor: 'default',
                alignItems: 'center',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>{d.rank}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: d.color, textAlign: 'right' }}>{d.index}</span>
                <span style={{ textAlign: 'center' }}>
                  {d.trend === 'up' ? (
                    <ArrowUp size={14} style={{ color: '#EF4444', display: 'inline' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#059669', display: 'inline' }} />
                  )}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--bg-surface-3)', overflow: 'hidden' }}>
                    <div style={{ width: `${d.barWidth}%`, height: '100%', borderRadius: '3px', background: d.color, transition: 'width 400ms ease' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: '32px', textAlign: 'right' }}>{d.index}%</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Section 6: GIS Overlays (Choropleth-inspired) */}
        <div style={{ marginBottom: '32px' }}>
          <SectionHeader title="GIS Overlays" subtitle="District-level spatial visualization of key metrics" />
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            style={{ padding: '24px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {[
                { name: 'Whitefield', density: 94, aqi: 156, energy: 4.8 },
                { name: 'Electronic City', density: 62, aqi: 112, energy: 5.2 },
                { name: 'Koramangala', density: 92, aqi: 138, energy: 4.1 },
                { name: 'Hebbal', density: 65, aqi: 98, energy: 3.5 },
                { name: 'Indiranagar', density: 88, aqi: 124, energy: 3.9 },
              ].map((district) => {
                const densityColor = district.density > 85 ? '#EF4444' : district.density > 75 ? '#F59E0B' : '#059669';
                return (
                  <div key={district.name} style={{
                    borderRadius: '12px',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    textAlign: 'center',
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                    cursor: 'default',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Choropleth color block */}
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: '8px', marginBottom: '10px',
                      background: `linear-gradient(135deg, ${densityColor}40, ${densityColor}80)`,
                      border: `1px solid ${densityColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `radial-gradient(circle at 50% 50%, ${densityColor}20, transparent 70%)`,
                      }} />
                      <span style={{ fontSize: '24px', fontWeight: 700, color: densityColor, fontFamily: 'var(--font-mono)', position: 'relative', zIndex: 1 }}>
                        {district.density}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>{district.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span>AQI <strong style={{ color: 'var(--text-secondary)' }}>{district.aqi}</strong></span>
                      <span>GW <strong style={{ color: 'var(--text-secondary)' }}>{district.energy}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div className="micro-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#05966980' }} /> Low Density (&#60;75)
              </div>
              <div className="micro-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B80' }} /> Medium Density (75-85)
              </div>
              <div className="micro-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#EF444480' }} /> High Density (&#62;85)
              </div>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
