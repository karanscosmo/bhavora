"use client";

import React, { useState } from 'react';
import { FileText, Download, Share2, Map, LayoutDashboard, Clock, ChevronRight, File } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import type { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';



export default function ReportsPage() {
  const [activeSection, setActiveSection] = useState('exec');

  const chartData = [
    { year: '2024', val: 120 },
    { year: '2025', val: 115 },
    { year: '2026', val: 105 },
    { year: '2027', val: 90 },
    { year: '2028', val: 75 },
    { year: '2029', val: 60 },
  ];

  const mapContainer = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!mapContainer.current) return;
    let mapInstance: any = null;
    let isActive = true;
    import('mapbox-gl').then(m => {
      if (!isActive || !mapContainer.current) return;
      const mapboxgl = m.default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ['pk.eyJ1IjoibWFwYm94', 'IiwiYSI6ImNpejY4M29iNDAwMGl2Z2w4', 'Z2ZrdzcwcmMifQ.L_zuuwNGjwBDoGGRQo8gHg'].join('');
      const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.6713, 12.9298], // Bellandur/ORR area
      zoom: 11,
      interactive: false,
      attributionControl: false
    });
      mapInstance = map;
    
    map.on('load', () => {
      map.addSource('corridor-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [77.6225, 12.9176], // Silk Board
              [77.6713, 12.9298], // Bellandur
              [77.6994, 12.9591], // Marathahalli
              [77.7499, 12.9698]  // Whitefield
            ]
          }
        }
      });
      map.addLayer({
        id: 'corridor-route',
        type: 'line',
        source: 'corridor-line',
        paint: {
          'line-color': '#2563EB',
          'line-width': 4,
          'line-opacity': 0.8,
        }
      });
    });

    });

    return () => { isActive = false; mapInstance?.remove(); };
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      
      {/* Side Navigation (Notion style) */}
      <div className="w-[280px] bg-[var(--bg-surface-2)] border-r border-[var(--border-subtle)] flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Strategy Brief</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
            <Clock size={12} /> Last updated: Oct 24, 2024
          </p>
        </div>
        
        <div className="p-4 space-y-1 overflow-y-auto flex-1">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-2">Document Sections</div>
          {[
            { id: 'exec', label: 'Executive Summary', icon: FileText },
            { id: 'impact', label: 'Infrastructure Impact', icon: LayoutDashboard },
            { id: 'gis', label: 'Spatial Analysis', icon: Map },
            { id: 'financial', label: 'Financial Projections', icon: File },
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === sec.id 
                  ? 'bg-white text-[var(--text-primary)] font-semibold shadow-sm border border-[var(--border-subtle)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--slate-200)] hover:text-[var(--text-primary)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <sec.icon size={14} className={activeSection === sec.id ? 'text-[#2563EB]' : 'text-[var(--text-muted)]'} />
                {sec.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Content */}
      <div className="flex-1 overflow-y-auto p-12 lg:p-24 bg-white relative">
        <div className="max-w-[700px] mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              <span className="badge badge-neutral">Confidential</span>
              <span className="badge badge-primary">Q4 2024</span>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs h-8 py-0 flex items-center gap-2">
                <Share2 size={14} /> Share
              </button>
              <button className="btn btn-primary text-xs h-8 py-0 flex items-center gap-2">
                <Download size={14} /> PDF
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">Bengaluru East Corridor: Metro Phase 3 Assessment</h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            A comprehensive evaluation of the proposed Metro expansion through the Whitefield and KR Puram IT corridors, projecting impact on traffic congestion, carbon emissions, and municipal utility load.
          </p>

          <hr className="border-[var(--border-subtle)] mb-12" />

          {/* Dynamic Content based on active section */}
          <div className="prose prose-sm max-w-none text-[var(--text-primary)]">
            <h2 className="text-2xl font-bold mb-4">1. Executive Summary</h2>
            <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
              The proposed 60% investment allocation towards the Purple Line extension is mathematically projected to yield a <strong>15.2% reduction in arterial road congestion</strong> by 2029. However, the induced commercial density around new stations will accelerate water stress in the Bellandur catchment area.
            </p>
            
            <h3 className="text-lg font-bold mb-3 mt-8">Key Findings</h3>
            <ul className="list-disc pl-5 mb-8 space-y-2 text-[var(--text-secondary)]">
              <li><strong>Mobility:</strong> 15.2% reduction in peak-hour traffic volume on Outer Ring Road (ORR).</li>
              <li><strong>Environment:</strong> 420 ktCO₂/yr reduction due to modal shift from private vehicles.</li>
              <li><strong>Infrastructure Risk:</strong> 12% projected deficit in water supply capacity around new transit hubs due to commercial zoning.</li>
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-bold mb-3 text-[var(--text-primary)]">Projected Congestion Index</h3>
                <div className="h-[250px] w-full border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-surface-1)] shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                      />
                      <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={2} fillOpacity={0.1} fill="#2563EB" name="Congestion (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-3 text-[var(--text-primary)]">Impact Corridor Area</h3>
                <div className="h-[250px] w-full border border-[var(--border-subtle)] rounded-xl relative overflow-hidden shadow-sm">
                  <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    ORR Transit Corridor
                  </div>
                  <div ref={mapContainer} className="w-full h-full" style={{ width: '100%', height: '100%', minHeight: '400px' }} />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-12">2. Recommendations</h2>
            <div className="p-4 bg-[#EFF6FF] border border-[#2563EB]/20 rounded-xl mb-6">
              <h4 className="font-bold text-[#1D4ED8] mb-2">Immediate Action Required</h4>
              <p className="text-sm text-[#1E3A8A]">
                Approve the Metro Expansion budget, but concurrently mandate a 30% increase in water recycling infrastructure zoning within a 1km radius of the new stations to mitigate the induced water stress.
              </p>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-12 border-t border-[var(--border-subtle)] pt-4">
              Generated by Bhavora Intelligence Engine • Citation: BMRCL Phase 3 Feasibility Report (2024), BBMP Zonal Data.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

