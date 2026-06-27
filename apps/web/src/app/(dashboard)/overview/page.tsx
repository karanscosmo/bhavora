"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ActionModal } from '@/components/ui/ActionModal';
import { exportToPDF } from '@/lib/exportUtils';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Droplet, Landmark, MoreVertical, Sparkles, TrendingUp, TrendingDown, Zap, Hourglass, Download } from 'lucide-react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


export default function OverviewPage() {

  const store = useSimulationStore();
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const { metrics, popGrowth, indExpansion } = store;
  const [timeStr, setTimeStr] = useState("14:32:05");
  
  const [liveData, setLiveData] = useState<Record<string, number> | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Client-side clock sync
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mapbox Initializer
  useEffect(() => {
    let map: MapboxMap | null = null;

    import('mapbox-gl').then((mapboxglModule) => {
      const mapboxgl = mapboxglModule.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      if (!mapContainerRef.current) return;

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [77.5946, 12.9716],
        zoom: 10.5,
        pitch: 45,
        attributionControl: false
      });

      mapRef.current = map;

      map.on('load', () => {
        if (!map) return;
        
        // Load Real GIS Data (Metro Stations as transit density heatmap)
        fetch('/data/metro_stations.geojson')
          .then(r => r.json())
          .then(data => {
            if (!map) return;
            map.addSource('traffic-heat', { type: 'geojson', data });

            map.addLayer({
              id: 'traffic-heat-layer',
              type: 'heatmap',
              source: 'traffic-heat',
              maxzoom: 15,
              paint: {
                'heatmap-intensity': 1,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0,0,0,0)',
                  0.2, 'rgba(255,165,0,0.5)',
                  0.6, 'rgba(255,69,0,0.8)',
                  1, 'rgba(255,0,0,1)'
                ],
                'heatmap-radius': 25,
                'heatmap-opacity': 0.8
              }
            });
            
            // Draw points on top of heatmap when zoomed in
            map.addLayer({
              id: 'metro-points',
              type: 'circle',
              source: 'traffic-heat',
              minzoom: 12,
              paint: {
                'circle-radius': 4,
                'circle-color': '#fff',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000'
              }
            });
          })
          .catch(err => console.error('Failed to load GIS data:', err));
      });
    });

    return () => {
      if (map) map.remove();
    };
  }, []);

  useEffect(() => {
    // Live metrics fetching
    const fetchLiveMetrics = async () => {
      try {
        const res = await fetch('/api/dashboard/live-metrics');
        if (res.ok) {
          const data = await res.json();
          setLiveData(data);
        }
      } catch (e) {
        console.error("Failed to fetch live metrics", e);
      }
    };
    
    fetchLiveMetrics();
    const metricTimer = setInterval(fetchLiveMetrics, 30000);
    return () => clearInterval(metricTimer);
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    await exportToPDF('dashboard-content', 'bhavora-city-overview.pdf');
    setIsExporting(false);
  };

  const executeAction = async () => {
    setIsActionModalOpen(false);
    // Setup AI-recommended scenario based on traffic problem
    store.setInputs({ 
      metroExpansion: 4, 
      popGrowth: popGrowth > 10 ? popGrowth - 2 : popGrowth 
    });
    
    await store.runSimulation();
    router.push('/simulation-results');
  };

  // Compute values (favoring live API data if available, falling back to local formulas)
  const displayPopulation = liveData?.population ?? (13.6 * (1 + popGrowth / 100)).toFixed(1);
  const displayEnergy = liveData?.energyDemand ?? (4.2 * (1 + metrics.energyDemand / 100)).toFixed(2);
  const displayWater = liveData?.waterReserves ?? Math.max(1, 18 - metrics.waterDemand).toFixed(1);
  const displayCarbon = liveData?.co2Emissions ?? (2.4 * (1 + metrics.carbonEmissions / 100)).toFixed(2);
  const displayJobs = liveData?.jobsIndex ?? (114.2 + metrics.jobsCreated).toFixed(1);
  const displayGdp = liveData?.gdpGrowth ?? (8.4 + (indExpansion * 0.1) + (popGrowth * 0.05)).toFixed(1);
  const displayTrafficSpeed = metrics.trafficCongestion < 0 
    ? Math.round(18 * (1 + Math.abs(metrics.trafficCongestion) / 100)) 
    : Math.round(18 * (1 - metrics.trafficCongestion / 100));

  // Determine Traffic Index State
  const congestionPercent = Math.min(100, Math.max(10, Math.round(78 + metrics.trafficCongestion)));
  let trafficStatus = "Normal";
  let trafficStatusColor = "text-primary";
  let trafficBadgeBg = "bg-primary-fixed/20 text-primary";
  if (congestionPercent > 85) {
    trafficStatus = "Critical";
    trafficStatusColor = "text-error";
    trafficBadgeBg = "bg-error-container text-on-error-container";
  } else if (congestionPercent > 70) {
    trafficStatus = "High";
    trafficStatusColor = "text-error animate-pulse";
    trafficBadgeBg = "bg-error-container text-on-error-container";
  } else if (congestionPercent > 50) {
    trafficStatus = "Moderate";
    trafficStatusColor = "text-amber-600";
    trafficBadgeBg = "bg-amber-100 text-amber-800";
  }

  // Energy chart dynamic scaling
  const energyDrawRatio = Math.min(1.8, 1 + metrics.energyDemand / 100);
  const chartBars = [
    { height: `${Math.round(40 * energyDrawRatio)}%` },
    { height: `${Math.round(55 * energyDrawRatio)}%` },
    { height: `${Math.round(70 * energyDrawRatio)}%` },
    { height: `${Math.round(60 * energyDrawRatio)}%` },
    { height: `${Math.min(100, Math.round(85 * energyDrawRatio))}%` },
    { height: `${Math.round(40 * energyDrawRatio)}%` }
  ];

  return (
    <div className="p-8" id="dashboard-content">
      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onExecute={executeAction}
        title="Traffic Bottleneck Detected"
        description="Silk Board junction is experiencing severe congestion latency exceeding projected thresholds. The current state is reducing GDP productivity by 1.2%."
        recommendations={[
          "Accelerate Phase 3 Metro Expansion by 2 lines",
          "Implement dynamic peak-hour tolling on ORR",
          "Divert commercial freight routes to peripheral ring road"
        ]}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">City Overview Dashboard</h1>
          <p className="text-body-md text-on-surface-variant">Real-time metropolitan performance analytics for Bengaluru Cluster.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface border border-outline-variant/30 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
            <span className="font-mono-label text-on-surface">LIVE: {timeStr}</span>
          </div>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 no-print"
          >
            {isExporting ? <Hourglass size={20} /> : <Download size={20} />}
            <span className="text-xs">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-primary-fixed-dim/20 border border-primary/20 rounded-2xl flex items-center gap-4 relative overflow-hidden group animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg">
          <Sparkles />
        </div>
        <div className="flex-1">
          <h4 className="font-label-md text-primary uppercase tracking-wider">AI Predictive Insight</h4>
          <p className="text-body-md font-semibold text-on-surface">
            {metrics.trafficCongestion > 5 ? (
              <span>Traffic at <span className="text-primary underline decoration-dotted">Silk Board</span> expected to surge {Math.round(metrics.trafficCongestion)}% due to current policy limits. <span className="text-on-surface-variant font-normal">Recommend activating peak-hour signal sync on ORR.</span></span>
            ) : (
              <span>Metro extensions have successfully stabilized <span className="text-primary underline decoration-dotted">Silk Board</span> transit velocity. <span className="text-on-surface-variant font-normal">Grid load is within secure parameters.</span></span>
            )}
          </p>
        </div>
        <button 
          onClick={() => setIsActionModalOpen(true)}
          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary-container/80 transition-all no-print cursor-pointer"
        >
          TAKE ACTION
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20 group hover:shadow-md transition-shadow">
          <p className="text-on-surface-variant font-label-md mb-2">Population</p>
          <h3 className="text-headline-sm font-bold text-on-surface">{displayPopulation}M</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            <TrendingUp />
            <span className="text-[11px] font-bold">+{popGrowth}% target</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Traffic Index</p>
          <div className="flex items-center gap-2">
            <h3 className={`text-headline-sm font-bold ${trafficStatusColor}`}>{trafficStatus}</h3>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${trafficBadgeBg}`}>
              {congestionPercent > 70 ? 'CRITICAL' : 'OPTIMAL'}
            </div>
          </div>
          <div className="mt-4 w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-error transition-all duration-[1.5s]" style={{ width: `${congestionPercent}%` }}></div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Energy Demand</p>
          <h3 className="text-headline-sm font-bold text-on-surface">{metrics.energyDemand > 0 ? "+" : ""}{metrics.energyDemand}%</h3>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
            <Zap />
            <span className="text-[11px] font-medium">{displayEnergy} GW / Day</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Water Reserves</p>
          <h3 className={`text-headline-sm font-bold ${metrics.waterDemand > 10 ? 'text-error animate-pulse' : 'text-on-surface'}`}>
            {metrics.waterDemand > 10 ? 'Critical' : 'Normal'}
          </h3>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
            <Droplet />
            <span className="text-[11px] font-medium">{displayWater}% Capacity</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">CO2 Emissions</p>
          <h3 className="text-headline-sm font-bold text-on-surface">{displayCarbon}t</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            {metrics.carbonEmissions < 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
            <span className="text-[11px] font-bold">{metrics.carbonEmissions}% Mtd</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">Jobs Index</p>
          <h3 className="text-headline-sm font-bold text-on-surface">{displayJobs}</h3>
          <div className="mt-4 flex items-center gap-1 text-tertiary">
            <BadgeCheck />
            <span className="text-[11px] font-bold">High Growth</span>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-md mb-2">GDP Growth</p>
          <h3 className="text-headline-sm font-bold text-primary">{displayGdp}%</h3>
          <div className="mt-4 flex items-center gap-1 text-on-surface-variant">
            <Landmark />
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
            <div ref={mapContainerRef} className="w-full h-full bg-gray-900 absolute inset-0" />
            <div className="absolute bottom-6 right-6 flex flex-col gap-3">
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/40">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Avg Speed City-wide</p>
                <p className="text-xl font-bold text-on-surface">{displayTrafficSpeed} km/h</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/40">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Active Incidents</p>
                <p className="text-xl font-bold text-error">{metrics.trafficCongestion > 10 ? '18 Major' : '12 Major'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex-1">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-headline-sm text-on-surface">Energy Demand Peak Profile</h3>
              <MoreVertical />
            </div>
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
              <div className="w-full h-full relative flex items-end gap-2">
                {chartBars.map((bar, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 bg-primary rounded-t-sm transition-all duration-[1s]" 
                    style={{ height: bar.height }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
