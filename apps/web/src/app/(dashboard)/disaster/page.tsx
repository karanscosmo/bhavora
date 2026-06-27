"use client";

import React from 'react';
import { AlertTriangle, Clock, Activity, Map, Users, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DisasterPage() {
  const incidents = [
    { id: 'INC-9021', type: 'Severe Flood Warning', location: 'Bellandur Catchment', time: '10 mins ago', status: 'Active', severity: 'Critical' },
    { id: 'INC-9020', type: 'Power Grid Failure', location: 'Whitefield Zone 4', time: '1 hr ago', status: 'Responding', severity: 'High' },
    { id: 'INC-9019', type: 'Traffic Gridlock', location: 'Silk Board Junction', time: '2 hrs ago', status: 'Resolved', severity: 'Medium' },
  ];

  const resources = [
    { type: 'NDRF Teams', deployed: 4, available: 12, status: 'Optimal' },
    { type: 'Ambulances', deployed: 45, available: 15, status: 'Strained' },
    { type: 'Fire Engines', deployed: 12, available: 30, status: 'Optimal' },
    { type: 'Evac Buses', deployed: 8, available: 50, status: 'Optimal' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Emergency Operations Center (EOC)</h1>
          <p className="text-sm text-[var(--text-secondary)]">Live incident tracking and resource dispatch.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-danger)] bg-[#FEE2E2] px-4 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-danger)] animate-pulse"></span>
            DEFCON 3 STATUS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-danger)]/10 flex items-center justify-center text-[var(--accent-danger)]">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Incidents</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">24</div>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--accent-danger)] h-full w-[45%]"></div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2">12% higher than 30-day average</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-warning)]/10 flex items-center justify-center text-[var(--accent-warning)]">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Affected Population</div>
              <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">14,250</div>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--accent-warning)] h-full w-[25%]"></div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2">Evacuation protocols active in 2 zones</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-bg)] flex items-center justify-center text-[var(--accent-primary)]">
              <Truck size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Resources Deployed</div>
              <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">69</div>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--accent-primary)] h-full w-[60%]"></div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2">Fleet utilization at 60% capacity</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex justify-between items-center">
              <h3 className="font-bold text-[var(--text-primary)]">Incident Queue</h3>
              <button className="btn btn-secondary text-xs px-3 py-1">Filter</button>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {incidents.map(inc => (
                <div key={inc.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-surface-2)] transition-colors">
                  <div className="flex items-center gap-4">
                    {inc.severity === 'Critical' ? (
                      <AlertCircle className="text-[var(--accent-danger)]" size={20} />
                    ) : inc.severity === 'High' ? (
                      <AlertTriangle className="text-[var(--accent-warning)]" size={20} />
                    ) : (
                      <CheckCircle2 className="text-[var(--accent-success)]" size={20} />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[var(--text-primary)]">{inc.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          inc.status === 'Active' ? 'bg-[#FEE2E2] text-[var(--accent-danger)]' :
                          inc.status === 'Responding' ? 'bg-[#FEF3C7] text-[var(--accent-warning)]' :
                          'bg-[#DCFCE7] text-[var(--accent-success)]'
                        }`}>{inc.status}</span>
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">{inc.type} • {inc.location}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Clock size={12} /> {inc.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
              <h3 className="font-bold text-[var(--text-primary)]">Geospatial Overview</h3>
            </div>
            <div className="h-[300px] bg-[var(--bg-surface-3)] flex items-center justify-center relative">
              <div className="text-[var(--text-muted)] text-sm flex flex-col items-center gap-2">
                <Map size={32} />
                <span>Mapbox EOC Layer initializing...</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
              <h3 className="font-bold text-[var(--text-primary)]">Dispatch Readiness</h3>
            </div>
            <div className="p-4 space-y-4">
              {resources.map((res, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{res.type}</span>
                    <span className="text-xs font-mono text-[var(--text-secondary)]">{res.deployed} / {res.available + res.deployed} deployed</span>
                  </div>
                  <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${res.status === 'Strained' ? 'bg-[var(--accent-warning)]' : 'bg-[var(--accent-primary)]'}`} 
                      style={{ width: `${(res.deployed / (res.available + res.deployed)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-0 overflow-hidden border-[var(--accent-danger)]">
            <div className="p-4 border-b border-[var(--border-subtle)] bg-[#FEE2E2]">
              <h3 className="font-bold text-[var(--accent-danger)]">Automated Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1 toggle-switch" />
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Auto-Dispatch NDRF</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Dispatches nearest unit when flood risk exceeds 80%</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 toggle-switch" />
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Traffic Rerouting</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Automatically alters traffic signals around incident zones</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
