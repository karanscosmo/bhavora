"use client";

import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend, ComposedChart, Bar } from 'recharts';
import { Filter, Download, Activity, TrendingUp, MapPin } from 'lucide-react';
import { useCityDataStore } from '@/stores';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';



export default function AnalyticsPage() {
  const cityData = useCityDataStore();
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '1Y'>('30D');

  const trendsData = useMemo(() => {
    const data = [];
    const { traffic, aqi, energy } = cityData.historicalData;
    const count = traffic.length;
    
    for(let i=0; i<count; i++) {
      data.push({
        day: `Hour ${i+1}`,
        congestion: traffic[i],
        aqi: aqi[i],
        power: energy[i]
      });
    }
    return data;
  }, [cityData.historicalData]);

  const scatterData = useMemo(() => {
    const aqiMult = cityData.metrics.aqi / 142;
    const congMult = cityData.metrics.congestionIndex / 67;

    return [
      { district: 'Whitefield', density: 12000, congestion: Math.min(100, Math.round(85 * congMult)), aqi: Math.round(160 * aqiMult) },
      { district: 'Electronic City', density: 9500, congestion: Math.min(100, Math.round(72 * congMult)), aqi: Math.round(140 * aqiMult) },
      { district: 'Koramangala', density: 15000, congestion: Math.min(100, Math.round(68 * congMult)), aqi: Math.round(125 * aqiMult) },
      { district: 'Indiranagar', density: 14000, congestion: Math.min(100, Math.round(60 * congMult)), aqi: Math.round(110 * aqiMult) },
      { district: 'Hebbal', density: 8000, congestion: Math.min(100, Math.round(92 * congMult)), aqi: Math.round(175 * aqiMult) },
      { district: 'Jayanagar', density: 16000, congestion: Math.min(100, Math.round(55 * congMult)), aqi: Math.round(105 * aqiMult) },
      { district: 'Malleswaram', density: 13500, congestion: Math.min(100, Math.round(48 * congMult)), aqi: Math.round(95 * aqiMult) },
    ];
  }, [cityData.metrics]);

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
        scatterData.forEach(d => {
          const coords = d.district === 'Whitefield' ? [77.7499, 12.9698] :
                         d.district === 'Electronic City' ? [77.6713, 12.8399] :
                         d.district === 'Koramangala' ? [77.6225, 12.9352] :
                         d.district === 'Hebbal' ? [77.5913, 13.0354] :
                         d.district === 'Indiranagar' ? [77.6412, 12.9719] :
                         d.district === 'Jayanagar' ? [77.5838, 12.9299] :
                         [77.5562, 13.0031]; // Malleswaram
          
          const el = document.createElement('div');
          el.className = 'rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white';
          const size = Math.max(12, (d.density / 16000) * 24);
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.backgroundColor = d.aqi > 150 ? '#EF4444' : d.aqi > 110 ? '#F59E0B' : '#10B981';
          el.style.opacity = '0.8';
          
          new mapboxgl.Marker(el)
            .setLngLat(coords as [number, number])
            .addTo(map);
        });
      });
    });

    return () => { isActive = false; mapInstance?.remove(); };
  }, [scatterData]);

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto bg-[var(--bg-base)]">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Analytics Suite</h1>
          <p className="text-sm text-[var(--text-secondary)]">Historical trends and cross-domain correlations across Bengaluru districts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] p-1 rounded-lg">
            {(['30D', '90D', '1Y'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeframe === t 
                    ? 'bg-white shadow-sm text-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary flex items-center gap-2 h-8 text-xs py-0">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Primary Trend Line Chart */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp size={16} className="text-[#2563EB]" />
            Systemic Trend Analysis
          </h3>
          <div className="flex gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Congestion Index</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> AQI Level</div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="congestion" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Congestion (%)" />
              <Line type="monotone" dataKey="aqi" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Air Quality (AQI)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Scatter Plot: Density vs Congestion vs AQI */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[#F59E0B]" />
            Density vs Congestion Correlation
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis type="number" dataKey="density" name="Density (ppl/km²)" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 1000', 'dataMax + 1000']} />
                <YAxis type="number" dataKey="congestion" name="Congestion (%)" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <ZAxis type="number" dataKey="aqi" range={[50, 400]} name="AQI" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                  formatter={(val: any, name: any) => [val, name]}
                  labelFormatter={() => ''}
                />
                <Scatter name="Districts" data={scatterData} fill="#2563EB" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-4 text-center">Bubble size represents Air Quality Index (AQI).</p>
        </div>

        {/* Composed Bar/Line Chart: Power Load */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[#3B82F6]" />
            Power Load Forecast
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendsData.slice(0, 14)} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                />
                <Bar dataKey="power" fill="#93C5FD" radius={[4, 4, 0, 0]} name="Actual Load (GW)" />
                <Line type="monotone" dataKey="power" stroke="#2563EB" strokeWidth={2} dot={false} name="Forecast Trend" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geospatial Analytics Map */}
        <div className="card p-2 h-full min-h-[300px] relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-2">
            <MapPin size={14} className="text-[#EF4444]" /> AQI Spatial Distribution
          </div>
          <div ref={mapContainer} className="w-full h-full rounded-lg border border-[var(--border-subtle)]" />
        </div>

      </div>

    </div>
  );
}

