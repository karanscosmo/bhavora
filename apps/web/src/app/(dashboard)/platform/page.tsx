"use client";

import React, { useState } from 'react';

interface EngineSpec {
  name: string;
  version: string;
  inputs: string[];
  outputs: string[];
  apis: string[];
  dataFlow: string;
  details: string;
  latency: string;
  accuracy: string;
  dataPoints: string;
}

export default function PlatformPage() {
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
  const [engineSpec, setEngineSpec] = useState<EngineSpec | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSpec = async (id: string) => {
    setSelectedEngine(id);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/platform/specs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEngineSpec(data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const engines = [
    {
      id: "decision-twin",
      name: "Decision Twin",
      description: "Aggregates multi-source geospatial data to form a real-time responsive digital clone of the city's physical infrastructure.",
      icon: "dns",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: "scenario-engine",
      name: "Scenario Engine",
      description: "Allows urban planner simulation of policy shifts, infrastructure projects, demographic flows, and climate variations.",
      icon: "account_tree",
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },
    {
      id: "impact-engine",
      name: "Impact Engine",
      description: "Formulates system-wide variance reports detailing traffic congestion, carbon footprints, energy loads, and water capacity.",
      icon: "donut_large",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      id: "forecast-engine",
      name: "Forecast Engine",
      description: "Generates 15-year projection curves of demographic shifts, infrastructure wear-and-tear, and zoning needs.",
      icon: "timeline",
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      id: "ai-insights-engine",
      name: "AI Insights Engine",
      description: "Constantly scans the simulated outcomes to automatically identify bottlenecks, project deficits, and trigger warnings.",
      icon: "psychology",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      id: "report-generator",
      name: "Report Generator",
      description: "Compiles all scenario parameters, timeline metrics, and AI recommendations into executive PDF strategy briefs.",
      icon: "description",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
          <span>Platform Overview</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">Bhavora Architecture</span>
        </nav>
        <h1 className="font-display-sm text-display-sm text-on-surface">City Intelligence Architecture</h1>
        <p className="text-on-surface-variant font-body-md max-w-xl">
          Bhavora combines high-fidelity GIS modeling, deterministic impact analysis, and predictive AI engines to de-risk municipal planning.
        </p>
      </div>

      {/* Grid of Engines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engines.map((eng, i) => (
          <div 
            key={eng.name}
            className="bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
            style={{ animation: `fade-slide-in 0.4s ease-out ${i * 100}ms both` }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${eng.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-2xl ${eng.color}`}>{eng.icon}</span>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-on-surface-variant/40">ENGINE LAYER</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">{eng.name}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{eng.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/10 text-right">
              <span onClick={() => fetchSpec(eng.id)} className={`text-[11px] font-bold ${eng.color} flex items-center justify-end gap-1 cursor-pointer hover:underline`}>
                View Technical Specs <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* System Integration Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-headline-sm text-on-surface">Integrated Data Lake</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The platform is built on real municipal, geographical, and industrial datasets from Bangalore Open Data, Censuses, Karnataka EV Policy publications, and BBMP. By processing spatial distributions and applying local infrastructure rules, Bhavora provides urban planning authorities with actionable predictions.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Bengaluru Open Data", "BBMP Ward Maps", "Census India 2021", "Karnataka Transport Reports"].map((source) => (
              <span key={source} className="px-3 py-1 bg-surface-container text-primary rounded-full text-[10px] font-semibold uppercase">{source}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 flex items-center justify-center bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20">
          <div className="grid grid-cols-3 gap-4 text-center w-full">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-outline-variant/20">
              <div className="text-2xl font-bold text-primary">1.2M+</div>
              <div className="text-[9px] text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Spatial Nodes</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-outline-variant/20">
              <div className="text-2xl font-bold text-secondary">50+</div>
              <div className="text-[9px] text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Urban Parameters</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-outline-variant/20">
              <div className="text-2xl font-bold text-tertiary">99.8%</div>
              <div className="text-[9px] text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Grid Match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Spec Modal */}
      {selectedEngine && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 animate-scale-in">
            <div className="p-6 bg-surface-container flex justify-between items-center border-b border-outline-variant/20">
              <h2 className="text-xl font-bold text-on-surface">Technical Specifications</h2>
              <button onClick={() => setSelectedEngine(null)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
                </div>
              ) : engineSpec ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{engineSpec.name}</h3>
                    <p className="text-xs text-on-surface-variant font-mono">{engineSpec.version}</p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-sm leading-relaxed text-on-surface-variant">{engineSpec.details}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Inputs</h4>
                      <ul className="space-y-1">
                        {engineSpec.inputs.map((input: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                            {input}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Outputs</h4>
                      <ul className="space-y-1">
                        {engineSpec.outputs.map((output: string, idx: number) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/20 pt-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Latency</span>
                      <span className="text-sm font-mono font-bold">{engineSpec.latency}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Accuracy</span>
                      <span className="text-sm font-mono font-bold text-emerald-600">{engineSpec.accuracy}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Data Points</span>
                      <span className="text-sm font-mono font-bold">{engineSpec.dataPoints}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
