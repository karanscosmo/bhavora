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

const ENGINES = [
  {
    id: "decision-twin",
    name: "Decision Twin",
    description: "Aggregates multi-source geospatial data to form a real-time responsive digital clone of the city's physical infrastructure.",
    icon: <Server size={22} />,
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.08)"
  },
  {
    id: "scenario-engine",
    name: "Scenario Engine",
    description: "Allows urban planner simulation of policy shifts, infrastructure projects, demographic flows, and climate variations.",
    icon: <Workflow size={22} />,
    color: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.08)"
  },
  {
    id: "impact-engine",
    name: "Impact Engine",
    description: "Formulates system-wide variance reports detailing traffic congestion, carbon footprints, energy loads, and water capacity.",
    icon: <PieChart size={22} />,
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.08)"
  },
  {
    id: "forecast-engine",
    name: "Forecast Engine",
    description: "Generates 15-year projection curves of demographic shifts, infrastructure wear-and-tear, and zoning needs.",
    icon: <LineChart size={22} />,
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.08)"
  },
  {
    id: "ai-insights-engine",
    name: "AI Insights Engine",
    description: "Constantly scans the simulated outcomes to automatically identify bottlenecks, project deficits, and trigger warnings.",
    icon: <Brain size={22} />,
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.08)"
  },
  {
    id: "report-generator",
    name: "Report Generator",
    description: "Compiles all scenario parameters, timeline metrics, and AI recommendations into executive PDF strategy briefs.",
    icon: <FileText size={22} />,
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.08)"
  },
  {
    id: "disaster-engine",
    name: "Disaster Command Engine",
    description: "Evaluates incident command protocols, dynamic evacuation routing, and BESCOM/BBMP dispatch resource load levels.",
    icon: <ShieldAlert size={22} />,
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.08)"
  }
];

function EngineModal({ engineId, onClose }: { engineId: string; onClose: () => void }) {
  const [spec, setSpec] = useState<EngineSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'apis' | 'performance'>('overview');

  React.useEffect(() => {
    fetch(`/api/platform/specs/${engineId}`)
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [engineId]);

  if (loading) {
    return (
      <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: '#0A1628', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
          padding: '40px', width: '480px', zIndex: 301, display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
        </div>
      </>
    );
  }

  if (!spec) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '14px',
        padding: '24px', width: '500px', zIndex: 301, boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'scale-in 0.16s ease-out',
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Technical Specification</div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '6px 0 2px' }}>{spec.name}</h2>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Engine Version: {spec.version}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>

        {/* Modal Tabs Menu (4 Tabs) */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '16px' }}>
          {[
            { id: 'overview', label: 'Overview & Specs' },
            { id: 'flow', label: 'Data Flow' },
            { id: 'apis', label: 'API Interfaces' },
            { id: 'performance', label: 'Performance' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '6px 10px', borderRadius: '4px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                background: activeTab === t.id ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                color: activeTab === t.id ? '#00D4FF' : 'rgba(255,255,255,0.45)',
                transition: 'all 120ms',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div style={{ minHeight: '140px' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, margin: 0 }}>
                {spec.details}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>INPUT PATHS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: '#fff', marginTop: '4px' }}>
                    {spec.inputs.slice(0, 3).map((inp, idx) => <span key={idx}>• {inp}</span>)}
                  </div>
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>OUTPUT PATHS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: '#fff', marginTop: '4px' }}>
                    {spec.outputs.slice(0, 3).map((out, idx) => <span key={idx}>• {out}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '8px' }}>DATA FLOW PIPELINE</span>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#00D4FF', lineHeight: 1.5 }}>
                {spec.dataFlow}
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '8px' }}>CORE ROUTE ENDPOINTS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {spec.apis.map(api => (
                  <div key={api} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fff' }}>{api}</span>
                    <span style={{ fontSize: '8px', color: '#10B981', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(16,185,129,0.1)' }}>GET</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Avg Latency</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#00D4FF', marginTop: '6px', fontFamily: 'monospace' }}>{spec.latency}</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Accuracy rate</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#10B981', marginTop: '6px', fontFamily: 'monospace' }}>{spec.accuracy}</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Data Points</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B', marginTop: '7px', fontFamily: 'monospace' }}>{spec.dataPoints}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>
            Close Specifications
          </button>
        </div>
      </div>
    </>
  );
}

export default function PlatformPage() {
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span>Platform Overview</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: '#00D4FF', fontWeight: 600 }}>Bhavora Architecture</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>City Intelligence Architecture</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Bhavora combines high-fidelity GIS modeling, deterministic impact analysis, and predictive AI engines to de-risk municipal planning.
        </p>
      </div>

      {/* Grid of 7 Engines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
        {ENGINES.map((eng, idx) => (
          <div
            key={eng.id}
            className="glass-card"
            style={{
              padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: '200px', transition: 'all 200ms',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: eng.bg, color: eng.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {eng.icon}
                </div>
                <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                  Engine Layer
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{eng.name}</h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>{eng.description}</p>
            </div>

            <button
              onClick={() => setSelectedEngineId(eng.id)}
              style={{
                background: 'none', border: 'none', color: eng.color, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                textAlign: 'left', padding: '12px 0 0', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              View Technical Specs →
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Technical Spec Summary Card */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>Bengaluru Integrated Data Lake</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
            The platform is built on real municipal, geographical, and industrial datasets from Bangalore Open Data, Censuses, Karnataka EV Policy publications, and BBMP. By processing spatial distributions and applying local infrastructure rules, Bhavora provides urban planning authorities with actionable predictions.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#00D4FF', fontFamily: 'monospace' }}>1.2M+</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Spatial Nodes</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>14,700km</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Road Net</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B', fontFamily: 'monospace' }}>650+</div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>EV Points</div>
          </div>
        </div>
      </div>

      {/* Technical Spec Modal */}
      {selectedEngineId && <EngineModal engineId={selectedEngineId} onClose={() => setSelectedEngineId(null)} />}
    </div>
  );
}
