"use client";

import React, { useMemo } from 'react';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { ChevronRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, BarChart, Bar, ComposedChart, ScatterChart, Scatter
} from 'recharts';

export default function AnalyticsPage() {
  const { results, activePolicy, timeline } = useSimulationStore();
  const cityData = useCityDataStore();

  // 1. Demographic Shifts Data (2025–2050 timeline)
  const demographicData = useMemo(() => {
    return timeline.filter((_, i) => i % 5 === 0 || timeline[i].year === 2050).map(t => ({
      year: String(t.year),
      Population: parseFloat((t.population / 1000000).toFixed(2)),
      Baseline: parseFloat((13.6 * Math.pow(1.021, t.year - 2025)).toFixed(2))
    }));
  }, [timeline]);

  // 2. Peak Grid Load Curves (Hourly drawing)
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

  // 3. District Transit Congestion comparisons
  const trafficData = useMemo(() => {
    const districts = [
      { name: 'Whitefield', base: 94 },
      { name: 'Electronic City', base: 62 },
      { name: 'Koramangala', base: 92 },
      { name: 'Hebbal', base: 65 },
      { name: 'Indiranagar', base: 88 },
    ];
    // Scale delta appropriately
    const deltaScale = results.traffic.delta / 67;
    return districts.map(d => ({
      district: d.name,
      Baseline: d.base,
      Simulated: Math.max(10, Math.round(d.base * (1 + deltaScale)))
    }));
  }, [results]);

  // 4. Carbon Footprint Sector Trend (Composed Bar & Line)
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

  // 5. Water Supply vs Demand balance (Composed Area Chart)
  const waterBalanceData = useMemo(() => {
    const years = ['2025', '2030', '2035', '2040', '2045', '2050'];
    return years.map((yr, idx) => {
      const t = idx * 5;
      const state = timeline.find(item => item.year === 2025 + t) || timeline[timeline.length - 1];
      const demand = state.population * 0.000135; // approx demand MLD
      const supply = 1450 * (1 + (activePolicy.waterInfrastructure / 100) * 0.25 * Math.min(1, t / 10));
      return {
        year: yr,
        Demand: Math.round(demand),
        Supply: Math.round(supply),
        Stress: state.water_stress
      };
    });
  }, [timeline, activePolicy]);

  // 6. Economic Indicators Scatter Plot
  const economicData = useMemo(() => {
    return timeline.filter((_, i) => i % 2 === 0).map(t => ({
      gdp: t.gdp_growth,
      health: t.city_health,
      year: t.year
    }));
  }, [timeline]);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span>Analytics Suite</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: '#00D4FF', fontWeight: 600 }}>Performance Telemetry</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Statistical Analytics</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Deep-dive forecasting and telemetry reports of demographic shifts, energy load curves, and transit throughputs.
        </p>
      </div>

      {/* Grid of charts (6 Types) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Chart 1: Demographic Shifts */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Demographic Shifts</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Bengaluru population trajectory projections (Millions)</p>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demographicData}>
                <defs>
                  <linearGradient id="demAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }} />
                <Area type="monotone" dataKey="Population" stroke="#00D4FF" strokeWidth={2} fill="url(#demAreaGrad)" />
                <Area type="monotone" dataKey="Baseline" stroke="rgba(255,255,255,0.35)" strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Peak Grid Load */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Peak Grid Load</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Simulated energy draw hourly curves (GW)</p>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }} />
                <Line type="monotone" dataKey="Baseline" stroke="rgba(255,255,255,0.35)" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Simulated" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: District Transit Latency */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>District Transit Latency</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Congestion Index comparisons (Scale 0-100)</p>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="district" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }} />
                <Bar dataKey="Baseline" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Simulated" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Carbon Footprint Sector Trend */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Carbon Footprint Sector Trend</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>CO₂ Emissions Breakdown (Million tonnes / year)</p>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={co2SectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }} />
                <Bar dataKey="Transport" stackId="a" fill="#3B82F6" />
                <Bar dataKey="Energy" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Industry" stackId="a" fill="#EF4444" />
                <Line type="monotone" dataKey="Total" stroke="#00D4FF" strokeWidth={2} dot={true} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Water Supply vs Demand Balance */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Water Supply & Demand</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Volumetric comparisons (MLD)</p>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }} />
                <Area type="monotone" dataKey="Demand" stroke="#EF4444" fill="rgba(239, 68, 68, 0.08)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="Supply" stroke="#10B981" fill="rgba(16, 185, 129, 0.08)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Economic Growth vs City Health */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Economic & Health Correlation</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>GDP Growth rate vs overall City Health Index (2025–2050)</p>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" dataKey="gdp" name="GDP Growth" unit="%" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9 }} />
                <YAxis type="number" dataKey="health" name="City Health" unit="" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', fontSize: '10px' }} />
                <Scatter name="Projections" data={economicData} fill="#8B5CF6" line shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
