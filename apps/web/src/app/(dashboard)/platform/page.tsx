"use client";

import React, { useState } from 'react';
import { ChevronRight, Server, Workflow, PieChart, LineChart, Brain, FileText, ShieldAlert } from 'lucide-react';

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

const ENGINE_SPECS_DATA: Record<string, EngineSpec> = {
  'decision-twin': {
    name: 'Decision Twin Engine',
    version: 'v3.0.5',
    inputs: ['GIS Layers', 'IoT Sensor Mesh', 'Census Data', 'Traffic APIs'],
    outputs: ['Scenario Metrics', 'Impact Scores', 'Timeline Projections'],
    apis: ['/api/simulate', '/api/districts', '/api/dashboard/live-metrics'],
    dataFlow: 'Sensor Mesh → Aggregation Layer → Decision Model → KPI Output',
    details: 'Aggregates 240+ urban data streams. Runs on deterministic multi-variable impact equations calibrated against 15 years of municipal data.',
    latency: '< 2 seconds',
    accuracy: '94.2%',
    dataPoints: '240+',
  },
  'scenario-engine': {
    name: 'Scenario Engine',
    version: 'v3.0.4',
    inputs: ['EV Adoption Rate', 'Population Growth', 'Industrial Expansion', 'Metro Lines'],
    outputs: ['Policy Simulations', 'Risk Scores', 'Saved Scenario Library'],
    apis: ['/api/simulate', '/api/scenarios'],
    dataFlow: 'Parameter Inputs → Scenario Model → Impact Calculator → Scenario Store',
    details: 'Supports unlimited scenario branching with version history.',
    latency: '< 2 seconds',
    accuracy: '91.8%',
    dataPoints: '180+',
  },
  'impact-engine': {
    name: 'Impact Engine',
    version: 'v3.0.3',
    inputs: ['Simulation Outputs', 'Baseline Urban KPIs', 'Historical Scenario Data'],
    outputs: ['Traffic Delta', 'Carbon Delta', 'Water Delta', 'Energy Delta', 'Sustainability Score'],
    apis: ['/api/simulate', '/api/dashboard/live-metrics'],
    dataFlow: 'Simulation Output → Delta Calculator → Visualization Engine → Report',
    details: 'Compares every simulation output against the baseline. Generates weighted sustainability scores.',
    latency: '< 1 second',
    accuracy: '96.1%',
    dataPoints: '60+',
  },
  'forecast-engine': {
    name: 'Forecast Engine',
    version: 'v3.0.2',
    inputs: ['Population Growth Rate', 'Economic Indicators', 'Infrastructure Wear Index'],
    outputs: ['15-Year Projection Curves', 'Infrastructure Deficit Reports', 'Policy Recommendations'],
    apis: ['/api/simulate', '/api/reports/generate'],
    dataFlow: 'Trend Modeling → Regression Analysis → Projection Curves → Report Generator',
    details: 'Logarithmic regression models for population. Linear projection for energy and water demand.',
    latency: '< 3 seconds',
    accuracy: '88.5%',
    dataPoints: '120+',
  },
  'ai-insights-engine': {
    name: 'AI Insights Engine',
    version: 'v3.0.5',
    inputs: ['Simulation Outputs', 'Map Layer Data', 'Infrastructure Metrics', 'Historical Scenarios'],
    outputs: ['Strategic Recommendations', 'Risk Alerts', 'Investment Priorities'],
    apis: ['/api/simulate', '/api/insights'],
    dataFlow: 'Output Scan → Threshold Analysis → Recommendation Generator → Alert System',
    details: 'Rule-based expert system with 48 configured threshold rules. Generates natural language recommendations.',
    latency: '< 1 second',
    accuracy: '92.7%',
    dataPoints: '48 rules',
  },
  'report-generator': {
    name: 'Report Generator',
    version: 'v3.0.1',
    inputs: ['Scenario Parameters', 'Simulation Metrics', 'AI Recommendations', 'Timeline Data'],
    outputs: ['Executive PDF Reports', 'Infrastructure Reports', 'Disaster Reports', 'CSV Exports'],
    apis: ['/api/reports/generate'],
    dataFlow: 'Data Aggregation → Template Engine → HTML Render → PDF Conversion',
    details: 'Client-side PDF generation using jsPDF + html2canvas.',
    latency: '< 5 seconds',
    accuracy: 'N/A',
    dataPoints: 'All platform data',
  },
  'disaster-engine': {
    name: 'Disaster Command Engine',
    version: 'v3.0.6',
    inputs: ['Live Weather Radar', 'Sensors Mesh', 'Resource Locations', 'Incident Reports'],
    outputs: ['Response Timelines', 'Evacuation Routes', 'Dispatch Orders', 'Resource Load Levels'],
    apis: ['/api/disaster/flood', '/api/dashboard/live-metrics'],
    dataFlow: 'Live Radar & Incident Reports → Threat Evaluator → Response Planner → Dispatch Action',
    details: 'Optimizes emergency routing and resource dispatch using dynamic flow networks.',
    latency: '< 1 second',
    accuracy: '95.4%',
    dataPoints: '85+ sensors',
  }
};

const ENGINES = [
  { id: "decision-twin", name: "Decision Twin", description: "Aggregates multi-source geospatial data to form a real-time responsive digital clone of the city's physical infrastructure.", icon: <Server size={22} />, color: "var(--accent-primary)", bg: "var(--accent-primary-bg)" },
  { id: "scenario-engine", name: "Scenario Engine", description: "Allows urban planner simulation of policy shifts, infrastructure projects, demographic flows, and climate variations.", icon: <Workflow size={22} />, color: "var(--accent-success)", bg: "#DCFCE7" },
  { id: "impact-engine", name: "Impact Engine", description: "Formulates system-wide variance reports detailing traffic congestion, carbon footprints, energy loads, and water capacity.", icon: <PieChart size={22} />, color: "var(--accent-warning)", bg: "#FEF3C7" },
  { id: "forecast-engine", name: "Forecast Engine", description: "Generates 15-year projection curves of demographic shifts, infrastructure wear-and-tear, and zoning needs.", icon: <LineChart size={22} />, color: "var(--accent-danger)", bg: "#FEE2E2" },
  { id: "ai-insights-engine", name: "AI Insights Engine", description: "Constantly scans the simulated outcomes to automatically identify bottlenecks, project deficits, and trigger warnings.", icon: <Brain size={22} />, color: "var(--accent-primary)", bg: "var(--accent-primary-bg)" },
  { id: "report-generator", name: "Report Generator", description: "Compiles all scenario parameters, timeline metrics, and AI recommendations into executive PDF strategy briefs.", icon: <FileText size={22} />, color: "var(--accent-success)", bg: "#DCFCE7" },
  { id: "disaster-engine", name: "Disaster Command Engine", description: "Evaluates incident command protocols, dynamic evacuation routing, and BESCOM/BBMP dispatch resource load levels.", icon: <ShieldAlert size={22} />, color: "var(--accent-danger)", bg: "#FEE2E2" }
];

function EngineModal({ engineId, onClose }: { engineId: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'apis' | 'performance'>('overview');
  const spec = ENGINE_SPECS_DATA[engineId];

  if (!spec) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-[var(--border-subtle)] rounded-xl p-6 w-[500px] z-[51] shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-1">Technical Specification</div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{spec.name}</h2>
            <span className="text-[11px] text-[var(--text-secondary)]">Engine Version: {spec.version}</span>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        </div>

        <div className="flex gap-2 border-b border-[var(--border-subtle)] pb-2 mb-4">
          {[
            { id: 'overview', label: 'Overview & Specs' },
            { id: 'flow', label: 'Data Flow' },
            { id: 'apis', label: 'API Interfaces' },
            { id: 'performance', label: 'Performance' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded text-[12px] font-semibold transition-colors ${
                activeTab === t.id 
                  ? 'bg-[var(--accent-primary-bg)] text-[var(--accent-primary)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[160px]">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {spec.details}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Input Paths</span>
                  <div className="flex flex-col gap-1 text-xs text-[var(--text-primary)]">
                    {spec.inputs.slice(0, 3).map((inp, idx) => <span key={idx}>• {inp}</span>)}
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Output Paths</span>
                  <div className="flex flex-col gap-1 text-xs text-[var(--text-primary)]">
                    {spec.outputs.slice(0, 3).map((out, idx) => <span key={idx}>• {out}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Data Flow Pipeline</span>
              <div className="p-4 bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-lg text-sm font-mono text-[var(--text-primary)] leading-relaxed">
                {spec.dataFlow}
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Core Route Endpoints</span>
              <div className="flex flex-col gap-2">
                {spec.apis.map(api => (
                  <div key={api} className="flex justify-between items-center p-3 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)]">
                    <span className="text-xs font-mono text-[var(--text-primary)]">{api}</span>
                    <span className="text-[10px] font-bold text-[var(--accent-success)] bg-[#DCFCE7] px-2 py-0.5 rounded">GET</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 text-center border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-2)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Latency</div>
                <div className="text-lg font-bold text-[var(--text-primary)] font-mono">{spec.latency}</div>
              </div>
              <div className="p-3 text-center border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-2)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Accuracy</div>
                <div className="text-lg font-bold text-[var(--accent-success)] font-mono">{spec.accuracy}</div>
              </div>
              <div className="p-3 text-center border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface-2)]">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Data Points</div>
                <div className="text-lg font-bold text-[var(--accent-primary)] font-mono">{spec.dataPoints}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function PlatformPage() {
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Platform Architecture</h1>
        <p className="text-sm text-[var(--text-secondary)]">Technical specifications of the Bhavora OS micro-engines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ENGINES.map(engine => (
          <div key={engine.id} className="card p-6 flex flex-col justify-between group hover:border-[var(--accent-primary)] transition-colors cursor-pointer" onClick={() => setSelectedEngine(engine.id)}>
            <div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: engine.bg, color: engine.color }}>
                {engine.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{engine.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {engine.description}
              </p>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)]">
              View Technical Specs
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {selectedEngine && (
        <EngineModal engineId={selectedEngine} onClose={() => setSelectedEngine(null)} />
      )}
    </div>
  );
}
