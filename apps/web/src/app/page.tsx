"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building2, Activity, PlayCircle, Play, Server, Workflow, PieChart, LineChart, Brain, FileText } from 'lucide-react';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


export default function RedesignedLandingPage() {
  const [activePreview, setActivePreview] = useState<'cities' | 'decision' | 'results' | 'impact' | 'ai' | 'reports'>('cities');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const previewMapContainerRef = useRef<HTMLDivElement>(null);
  const previewMapRef = useRef<MapboxMap | null>(null);

  // Mapbox Initializer
  useEffect(() => {
    let map: MapboxMap | null = null;

    import('mapbox-gl').then((mapboxglModule) => {
      const mapboxgl = mapboxglModule.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

      if (!mapContainerRef.current) return;

      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11.5,
        pitch: 60,
        bearing: -17.6,
        attributionControl: false
      });

      mapRef.current = map;
      
      map.on('style.load', () => {
          if (!map) return;
          map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 10,
            'paint': {
              'fill-extrusion-color': '#e2e8f0',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                10, 0,
                10.05, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                10, 0,
                10.05, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          });
      });
    });

    return () => {
      if (map) map.remove();
    };
  }, []);

  // Mapbox Initializer for Preview Card
  useEffect(() => {
    let previewMap: MapboxMap | null = null;
    let isCancelled = false;

    if (activePreview === 'cities') {
      import('mapbox-gl').then((mapboxglModule) => {
        if (isCancelled) return;
        const mapboxgl = mapboxglModule.default;
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

        if (!previewMapContainerRef.current) return;

        previewMap = new mapboxgl.Map({
          container: previewMapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [77.5946, 12.9716],
          zoom: 10,
          pitch: 45,
          attributionControl: false
        });

        previewMapRef.current = previewMap;
      });
    }

    return () => {
      isCancelled = true;
      if (previewMap) {
        previewMap.remove();
        previewMapRef.current = null;
      }
    };
  }, [activePreview]);

  return (
    <div className="bg-[#f8f9ff] text-gray-900 min-h-screen font-sans selection:bg-primary/20 scroll-smooth">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 shadow-sm">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-shadow">B</div>
              <span className="text-[19px] font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">BHAVORA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/overview" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Dashboard</Link>
              <Link href="/platform" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Platform</Link>
              <Link href="/cities" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Cities Twin</Link>
              <Link href="/decision-twin" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Decision Twin</Link>
              <Link href="/impact" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Impact</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo">
              <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-[13px] font-bold hover:from-blue-500 hover:to-blue-600 transition-all active:scale-95 shadow-md shadow-blue-600/20 cursor-pointer">
                Run Bengaluru 2035 Demo
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16">
        
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50/50 via-[#f8f9ff] to-cyan-50/30">
          <div className="absolute inset-0 city-grid-bg opacity-[0.4] z-0"></div>
          
          <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Typography */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[12px] text-blue-700 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                SIH 2025 Innovation Prototype
              </div>

              <h1 className="text-[3.4rem] md:text-[4rem] leading-[1.08] font-extrabold tracking-tight text-gray-900">
                Simulate Tomorrow.<br/>
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent italic">Decide Today.</span>
              </h1>

              <p className="text-[17px] text-gray-500 leading-relaxed max-w-[480px]">
                AI-powered Decision Twin platform helping governments and planners test infrastructure decisions before spending public resources.
              </p>

              <div className="flex flex-wrap gap-4 pt-1">
                <Link href="/overview">
                  <button className="px-7 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl text-[14px] font-bold shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all active:scale-[0.97] cursor-pointer">
                    Explore Platform
                  </button>
                </Link>
                <Link href="/demo">
                  <button className="group flex items-center gap-2.5 px-7 py-4 bg-white border border-outline-variant/30 hover:bg-white/80 text-gray-700 rounded-2xl text-[14px] font-bold transition-all hover:scale-[1.02] active:scale-[0.97] shadow-sm cursor-pointer">
                    <PlayCircle />
                    Run Bengaluru 2035 Demo
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: City Visualization Motion Graphics */}
            <div className="lg:col-span-6 relative flex items-center justify-center" style={{ minHeight: '480px' }}>
              <div className="relative w-full max-w-[540px] h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/50 animate-scale-in">
                <div ref={mapContainerRef} className="w-full h-full bg-slate-100 absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent"></div>
                {/* Floating telemetry alerts */}
                <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></span>
                  <span className="text-white/95 text-[11px] font-mono font-bold tracking-wider">LIVE NODE: BENGALURU</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROBLEM STATEMENT */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 bg-white/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">The Planning Challenge</h4>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">The Failure of Static Masterplans</h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] text-gray-500 leading-relaxed">
                Traditional urban planning documents are static, outdated the moment they are printed, and isolated in municipal silos. Planners make multi-billion dollar zoning, transit, and grid decisions without testing their system-wide cascades. Bhavora offers a dynamic Decision Twin that models real-world effects across traffic speed, carbon emissions, and water/energy reserves.
              </p>
            </div>
          </div>
        </section>

        {/* 3. HOW BHAVORA WORKS */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 bg-white/70">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">How Bhavora Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Our 4-stage engine ingests GIS feeds, calibrates variables, calculates deterministic impacts, and files strategy briefs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", name: "Data Lake Ingestion", text: "Process BBMP ward maps, Census, and BESCOM grid telemetry feeds." },
              { step: "02", name: "Construct GIS Twin", text: "Map physical lines, charging networks, water basins, and population densities." },
              { step: "03", name: "Simulate Scenarios", text: "Calibrate variables (EV, population, metro, power) using custom parameters." },
              { step: "04", name: "Analyze Policy Impacts", text: "Resolve resource stress indices and compile strategic report briefs." }
            ].map(item => (
              <div key={item.step} className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-black text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PLATFORM ARCHITECTURE */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Architecture</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Unified components translating complex policy scenarios into actionable predictions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Decision Twin", desc: "Digital GIS layout plotting physical lines and resource grids.", icon: <Server size={32} /> },
              { name: "Scenario Engine", desc: "Policy configuration interface evaluating custom parameters.", icon: <Workflow size={32} /> },
              { name: "Impact Engine", desc: "Formulates before vs after load indicators and bottlenecks.", icon: <PieChart size={32} /> },
              { name: "Forecast Engine", desc: "Generates 15-year demographic and load curve projections.", icon: <LineChart size={32} /> },
              { name: "AI Insights Engine", desc: "Scans simulated city state to trigger planning recommendations.", icon: <Brain size={32} /> },
              { name: "Report Generator", desc: "Compiles all parameters and recommendations into strategy files.", icon: <FileText size={32} /> }
            ].map(eng => (
              <div key={eng.name} className="bg-white border border-outline-variant/30 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-primary mb-4 block">{eng.icon}</span>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{eng.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{eng.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MODULE PREVIEWS */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 bg-white/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore the Platform Modules</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2 text-sm">Observe the dynamic dashboards running across every component page.</p>
          </div>

          {/* Module navigation tabs */}
          <div className="flex flex-wrap justify-center mb-8 bg-surface-container rounded-2xl p-1.5 max-w-2xl mx-auto border border-outline-variant/20 gap-1">
            {([
              { id: 'cities', label: "Cities Twin" },
              { id: 'decision', label: "Decision Twin" },
              { id: 'results', label: "Results" },
              { id: 'impact', label: "Impact Analysis" },
              { id: 'ai', label: "AI Insights" },
              { id: 'reports', label: "Reports" }
            ] as const).map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActivePreview(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activePreview === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Preview Details Card */}
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm max-w-4xl mx-auto min-h-[360px] flex flex-col justify-between">
            {activePreview === 'cities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">Cities Twin Preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    A high-fidelity GIS dashboard showcasing togglable overlays for traffic speed, power grids, water supply networks, and district-by-district resilience indicators.
                  </p>
                  <Link href="/cities">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Cities Twin
                    </button>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden border border-outline-variant/20 h-48 bg-[#cbdbf5] relative shadow-sm">
                  <div ref={previewMapContainerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0f172a', width: '100%', height: '100%' }} className="flex items-center justify-center text-white/50 text-xs font-mono">
                    Initializing Preview Map...
                  </div>
                </div>
              </div>
            )}

            {activePreview === 'decision' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">Decision Twin Preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Configure custom policy variables (EV, Population Growth, Metro Extents, Grid Mix, Industrial Parks) and test their immediate downstream cascades on resource grids.
                  </p>
                  <Link href="/decision-twin">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Decision Twin
                    </button>
                  </Link>
                </div>
                <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/20 space-y-4">
                  <div className="h-1.5 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-2/3" /></div>
                  <div className="h-1.5 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-1/3" /></div>
                  <div className="h-1.5 bg-primary/20 rounded w-full relative"><div className="h-full bg-primary rounded w-1/2" /></div>
                </div>
              </div>
            )}

            {activePreview === 'results' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">Simulation Results Preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    A detailed timeline analyzer displaying metrics and forecasting curves spanning from 2025 to 2035 based on customized model outputs.
                  </p>
                  <Link href="/simulation-results">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Results Module
                    </button>
                  </Link>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                  <div className="bg-white p-3 rounded-lg border border-outline-variant/10"><p className="text-gray-400">Traffic</p><p className="text-xs text-primary mt-1">-12.2%</p></div>
                  <div className="bg-white p-3 rounded-lg border border-outline-variant/10"><p className="text-gray-400">Energy</p><p className="text-xs text-primary mt-1">+24.2%</p></div>
                </div>
              </div>
            )}

            {activePreview === 'impact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">Impact Analysis Preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Visualize before vs after comparative indicators representing public utility loads, emissions variances, and carbon offsets side-by-side.
                  </p>
                  <Link href="/impact">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Impact Analysis
                    </button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-surface-container rounded-xl text-[10px] font-bold flex justify-between"><span>Baseline Speed</span><span className="text-gray-400">18 km/h</span></div>
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-[10px] font-bold flex justify-between"><span className="text-primary">Simulated Speed</span><span className="text-primary">24 km/h</span></div>
                </div>
              </div>
            )}

            {activePreview === 'ai' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">AI Insights Preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Automated anomaly detection scans simulated states to recommend grid additions and pipeline diversions to planners.
                  </p>
                  <Link href="/insights">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch AI Insights
                    </button>
                  </Link>
                </div>
                <div className="bg-[#213145] text-white p-5 rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center gap-2"><Brain /><span className="text-[10px] font-bold uppercase tracking-wider text-primary-fixed-dim">AI RECOMMENDATION</span></div>
                  <p className="text-xs text-white/80 leading-relaxed">North Bengaluru should add 11 new power substations before 2032 to prevent grid overload.</p>
                </div>
              </div>
            )}

            {activePreview === 'reports' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">Reports Chapter Preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Produce comprehensive strategies in chapters containing impact matrices, Recharts forecasts, and policy briefs.
                  </p>
                  <Link href="/reports">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Reports Module
                    </button>
                  </Link>
                </div>
                <div className="border border-outline-variant/30 rounded-2xl p-5 space-y-2 bg-surface-container-low text-[10px] font-semibold text-on-surface-variant">
                  <p className="font-bold text-on-surface text-xs mb-1">Report Chapters</p>
                  <p>1.0 Executive Summary</p>
                  <p>2.0 Demographic Shifts</p>
                  <p>3.0 Mobility Infrastructure</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. TESTIMONIALS SECTION */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 bg-white/70 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Planning Endorsements</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Read how urban developers utilize Bhavora to model metropolitan growth models.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm flex flex-col justify-between h-48">
              <p className="text-xs italic text-gray-500 leading-relaxed">
                &ldquo;Bhavora has transformed our capital budget allocation. We simulated the EV adoption curve in Whitefield and identified grid deficits three years ahead of real-world impact.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">AK</div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Dr. A. Krishna</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">BBMP / Infrastructure Advisory</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm flex flex-col justify-between h-48">
              <p className="text-xs italic text-gray-500 leading-relaxed">
                &ldquo;Being able to cross-analyze traffic bottlenecks alongside power grid stresses within a single persistent twin is game-changing. It simplifies multi-departmental approvals.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">SM</div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">S. Mukherjee</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">BESCOM / Grid Security</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. METRICS SECTION */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 bg-white/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-primary">99.8%</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Simulation Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary">1.2M+</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Active GIS Nodes</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary">15-Year</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Planning Horizons</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary">₹1.2L Cr</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Capex De-risked</div>
            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION (CTA) */}
        <section className="py-24 bg-gradient-to-b from-gray-900 via-[#0a1628] to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 city-grid-bg opacity-[0.03]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]"></div>
          <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                De-risk Tomorrow&apos;s Infrastructure <br/>With Bhavora
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xl mx-auto">
                Access Bengaluru&apos;s Chief Urban Planner dashboard to configure variables and print recommendations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/demo">
                  <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-bold hover:from-blue-400 hover:to-blue-500 transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-blue-600/20 flex items-center gap-2 cursor-pointer">
                    <Play />
                    Run Bengaluru 2035 Demo
                  </button>
                </Link>
                <Link href="/overview">
                  <button className="px-8 py-4 border border-white/15 text-white/80 rounded-2xl text-sm font-medium hover:bg-white/5 hover:border-white/25 transition-all cursor-pointer">
                    Explore Platform
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 border-t border-white/5 text-center text-xs text-gray-500">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-400 text-sm">BHAVORA</span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-500 text-[12px]">© 2025 Bugs2Bucks. Built for SIH 2025.</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-blue-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-400 cursor-pointer">Security Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
