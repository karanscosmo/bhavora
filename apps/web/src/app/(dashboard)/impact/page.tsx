"use client";

import React, { useMemo } from 'react';
import { useSimulationStore } from '@/stores';
import { IndianRupee, TrendingDown, Clock, MapPin, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import dynamic from 'next/dynamic';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

function ImpactAnalysisPageContent() {
  const simStore = useSimulationStore();
  const inputs = simStore.activePolicy;

  // Deterministic financial calculation based on slider percentages (pseudo-economics)
  const economics = useMemo(() => {
    // Treat 1% slider as 100 Crore INR
    const capex = (inputs.metroExpansion * 150) + (inputs.roadCapacity * 80) + (inputs.waterInfrastructure * 60) + (inputs.evAdoptionRate * 40) + (inputs.greenSpaceAllocation * 20);
    
    // OpEx savings (fuel, health costs, water leakage)
    const opexSavings = (inputs.metroExpansion * 15) + (inputs.evAdoptionRate * 25) + (inputs.waterInfrastructure * 12);
    
    // Payback period (Years)
    const payback = opexSavings > 0 ? (capex / opexSavings) : 0;
    
    // Funding Allocation
    const allocation = [
      { category: 'Mobility', value: (inputs.metroExpansion * 150) + (inputs.roadCapacity * 80) + (inputs.evAdoptionRate * 40) },
      { category: 'Utilities', value: (inputs.waterInfrastructure * 60) + (inputs.renewableShare * 90) },
      { category: 'Urban Realm', value: (inputs.greenSpaceAllocation * 20) + (inputs.industrialZoning * 30) },
    ];

    // Heatmap data (District impact score)
    const districts = [
      { name: 'Whitefield', impact: Math.round(inputs.metroExpansion * 0.4 + inputs.roadCapacity * 0.3) },
      { name: 'Electronic City', impact: Math.round(inputs.metroExpansion * 0.3 + inputs.industrialZoning * 0.5) },
      { name: 'Koramangala', impact: Math.round(inputs.waterInfrastructure * 0.4 + inputs.greenSpaceAllocation * 0.6) },
      { name: 'Hebbal', impact: Math.round(inputs.roadCapacity * 0.5 + inputs.industrialZoning * 0.2) },
      { name: 'Indiranagar', impact: Math.round(inputs.greenSpaceAllocation * 0.5 + inputs.waterInfrastructure * 0.3) },
    ].sort((a, b) => b.impact - a.impact);

    // Cashflow projection
    const cashflow = [];
    let cumulative = -capex;
    for (let year = 2024; year <= 2035; year++) {
      if (year > 2024) cumulative += opexSavings;
      cashflow.push({
        year: year.toString(),
        Cashflow: Math.round(cumulative),
      });
    }

    return {
      capex: Math.round(capex),
      opexSavings: Math.round(opexSavings),
      payback: payback.toFixed(1),
      allocation,
      districts,
      cashflow
    };
  }, [inputs]);

  const mapContainer = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.5946, 12.9716],
      zoom: 10,
      interactive: false,
      attributionControl: false
    });
    
    map.on('load', () => {
      economics.districts.forEach(d => {
        const coords = d.name === 'Whitefield' ? [77.7499, 12.9698] :
                       d.name === 'Electronic City' ? [77.6713, 12.8399] :
                       d.name === 'Koramangala' ? [77.6225, 12.9352] :
                       d.name === 'Hebbal' ? [77.5913, 13.0354] :
                       [77.6412, 12.9719]; // Indiranagar
        
        const el = document.createElement('div');
        el.className = 'w-4 h-4 rounded-full bg-[#2563EB] shadow-md';
        el.style.opacity = (d.impact / 100).toString();
        
        new mapboxgl.Marker(el)
          .setLngLat(coords as [number, number])
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [economics]);

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto bg-[var(--bg-base)]">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Financial & Economic Impact</h1>
        <p className="text-sm text-[var(--text-secondary)]">Municipal cost-benefit analysis and district-wise investment allocation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <IndianRupee size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Required CapEx</span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] font-mono">₹{economics.capex.toLocaleString()} Cr</div>
          <div className="text-sm text-[var(--text-secondary)] mt-2">Total upfront capital expenditure</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#10B981]">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Annual OpEx Savings</span>
          </div>
          <div className="text-3xl font-bold text-[#10B981] font-mono">₹{economics.opexSavings.toLocaleString()} Cr</div>
          <div className="text-sm text-[var(--text-secondary)] mt-2">Recurring savings via efficiency</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Payback Period</span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] font-mono">{economics.payback} Years</div>
          <div className="text-sm text-[var(--text-secondary)] mt-2">Time to achieve ROI breakeven</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Cashflow Chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6">Cumulative Cashflow (10-Year Horizon)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={economics.cashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}Cr`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Net Cashflow']}
                />
                <Area type="step" dataKey="Cashflow" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Bar */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6">Funding Allocation</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={economics.allocation} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-surface-2)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Allocation']}
                />
                <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <MapPin size={16} className="text-[#2563EB]" />
              District Heatmap (Investment Impact)
            </h3>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {economics.districts.map((d, i) => (
              <div key={d.name} className="p-4 flex items-center justify-between hover:bg-[var(--bg-surface-2)] transition-colors">
                <div className="flex items-center gap-4 w-1/3">
                  <span className="text-xs font-bold text-[var(--text-muted)] w-4">{i + 1}</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{d.name}</span>
                </div>
                <div className="flex-1 px-8">
                  <div className="h-2 w-full bg-[var(--bg-surface-3)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB]" style={{ width: `${d.impact}%` }}></div>
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{d.impact} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-2 h-[350px] relative overflow-hidden">
           <div className="absolute top-4 left-4 z-10">
             <div className="bg-white/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
               Investment Geospatial Heatmap
             </div>
           </div>
           <div ref={mapContainer} className="w-full h-full rounded-lg border border-[var(--border-subtle)]" />
        </div>
      </div>

    </div>
  );
}

export default dynamic(() => Promise.resolve(ImpactAnalysisPageContent), { ssr: false });
