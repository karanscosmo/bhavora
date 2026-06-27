"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/stores';
import { ChevronLeft, ArrowDown, ArrowUp, Activity, Car, Wind, Droplets, Zap, TrendingUp, Home, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';



export default function SimulationResultsPage() {
  const simStore = useSimulationStore();
  const inputs = simStore.activePolicy;

  // DETERMINISTIC CALCULATION ENGINE
  const metrics = useMemo(() => {
    // Metro expansion reduces traffic and CO2
    const trafficDelta = -1 * (inputs.metroExpansion * 0.2 + inputs.roadCapacity * 0.1 - inputs.industrialZoning * 0.15);
    const co2Delta = -1 * (inputs.evAdoptionRate * 0.3 + inputs.renewableShare * 0.4 + inputs.greenSpaceAllocation * 0.1 - inputs.industrialZoning * 0.2);
    const aqiDelta = co2Delta * 0.8 - (inputs.industrialZoning * 0.3); // Negative is good
    
    // Industrial zoning boosts GDP but hurts environment
    const gdpDelta = (inputs.industrialZoning * 0.4 + inputs.roadCapacity * 0.2 + inputs.metroExpansion * 0.1);
    
    // Water demand increases with industry, decreases with water infrastructure
    const waterDemand = (inputs.industrialZoning * 0.2) - (inputs.waterInfrastructure * 0.5);
    
    // Energy demand increases with industry and EV, decreases with renewable
    const energyDemand = (inputs.industrialZoning * 0.3 + inputs.evAdoptionRate * 0.2) - (inputs.renewableShare * 0.1);

    // Housing demand increases with GDP and Metro
    const housingDemand = (gdpDelta * 0.5 + inputs.metroExpansion * 0.3);

    return {
      traffic: trafficDelta.toFixed(1),
      co2: co2Delta.toFixed(1),
      aqi: aqiDelta.toFixed(1),
      gdp: gdpDelta.toFixed(1),
      water: waterDemand.toFixed(1),
      energy: energyDemand.toFixed(1),
      housing: housingDemand.toFixed(1),
    };
  }, [inputs]);

  // Generate deterministic chart data based on outputs
  const chartData = useMemo(() => {
    const data = [];
    const baseTraffic = 100;
    const trafficTarget = 100 + Number(metrics.traffic);
    const baseAQI = 150;
    const aqiTarget = 150 + Number(metrics.aqi);

    for (let i = 0; i <= 5; i++) {
      const year = 2025 + i * 2;
      const progress = i / 5;
      data.push({
        year: year.toString(),
        Traffic: Math.round(baseTraffic + (trafficTarget - baseTraffic) * progress),
        AQI: Math.round(baseAQI + (aqiTarget - baseAQI) * progress),
      });
    }
    return data;
  }, [metrics]);

  const mapContainer = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!mapContainer.current) return;
    let mapInstance: any = null;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive || !mapContainer.current) return;
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
      const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.5946, 12.9716],
      zoom: 10,
      interactive: false,
      attributionControl: false
    });
      mapInstance = map;
    
    map.on('load', () => {
      // Just a static demo visualization for simulation footprint
      map.addSource('sim-footprint', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }, properties: {} },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [77.6410, 12.9590] }, properties: {} }
          ]
        }
      });
      map.addLayer({
        id: 'sim-points',
        type: 'circle',
        source: 'sim-footprint',
        paint: {
          'circle-radius': 25,
          'circle-color': '#10B981',
          'circle-opacity': 0.3,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#10B981'
        }
      });
    });

    });

    return () => { isActive = false; mapInstance?.remove(); };
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-64px)] overflow-y-auto bg-[var(--bg-base)]">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/decision-twin" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Simulation Results</h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] ml-7">Deterministic multi-domain impact projections for 2035.</p>
        </div>
        <Link href="/impact" className="btn btn-primary flex items-center gap-2">
          View Financial Impact <ChevronLeft size={16} className="rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Traffic Congestion" value={`${metrics.traffic}%`} icon={Car} isGood={Number(metrics.traffic) < 0} />
        <MetricCard title="Carbon Emissions" value={`${metrics.co2}%`} icon={Wind} isGood={Number(metrics.co2) < 0} />
        <MetricCard title="Air Quality Index" value={`${metrics.aqi} pts`} icon={Activity} isGood={Number(metrics.aqi) < 0} />
        <MetricCard title="GDP Growth" value={`+${metrics.gdp}%`} icon={TrendingUp} isGood={Number(metrics.gdp) > 0} />
        <MetricCard title="Water Demand" value={`${metrics.water}%`} icon={Droplets} isGood={Number(metrics.water) < 0} />
        <MetricCard title="Energy Load" value={`${metrics.energy}%`} icon={Zap} isGood={Number(metrics.energy) < 0} />
        <MetricCard title="Housing Demand" value={`+${metrics.housing}%`} icon={Home} isGood={true} />
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="card p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">10-Year Projection Curve</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-warning)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-warning)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="Traffic" stroke="var(--accent-warning)" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
              <Area type="monotone" dataKey="AQI" stroke="var(--accent-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorAQI)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-2 h-[350px] relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
          Simulated Spatial Impact
        </div>
        <div ref={mapContainer} className="w-full h-full rounded-lg border border-[var(--border-subtle)]" />
      </div>
    </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-[var(--accent-success)]" />
          Automated Policy Recommendations
        </h3>
        <div className="space-y-3">
          {Number(metrics.traffic) > -5 && (
            <div className="p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Increase Metro Investment:</strong> Traffic reduction is currently suboptimal. Consider raising Metro Expansion to at least 60% to achieve significant decongestion.
            </div>
          )}
          {Number(metrics.water) > 0 && (
            <div className="p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Critical Water Deficit:</strong> Industrial zoning is outpacing water infrastructure. You must increase Water Infrastructure investment to prevent extreme water stress.
            </div>
          )}
          {Number(metrics.co2) > -10 && (
            <div className="p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Carbon Target Missed:</strong> Accelerate EV Adoption and Renewable Grid Mix to meet the state's 2030 decarbonization goals.
            </div>
          )}
          {(Number(metrics.traffic) <= -5 && Number(metrics.water) <= 0 && Number(metrics.co2) <= -10) && (
            <div className="p-3 bg-[#DCFCE7] rounded-lg border border-[#10B981] text-sm text-[#065F46]">
              <strong className="block mb-1">Optimal Scenario Achieved</strong>
              The current policy mix achieves balanced sustainable growth without triggering critical infrastructure deficits.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon: Icon, isGood }: { title: string, value: string, icon: any, isGood: boolean }) {
  const isPositiveNum = !value.startsWith('-');
  const color = isGood ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]';
  
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
          <Icon size={16} />
        </div>
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">{value}</span>
        <span className={`text-sm font-bold flex items-center ${color}`}>
          {isPositiveNum ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </span>
      </div>
    </div>
  );
}

