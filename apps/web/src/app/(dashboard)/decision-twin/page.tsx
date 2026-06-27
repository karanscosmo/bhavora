"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useSimulationStore, useUIStore, useScenarioStore, useAppStore } from '@/stores';
import { PolicyInput, CascadeNode } from '@/lib/simulation';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid,
} from 'recharts';
import { Sliders, RefreshCcw, Save, FolderOpen, Play, CheckCircle2, AlertTriangle, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';

// ===== PRESET BUTTONS =====
const PRESETS = [
  { label: 'Low', value: 20 },
  { label: 'Med', value: 50 },
  { label: 'High', value: 80 },
];

const EXPLAIN_CONTENT: Record<string, { methodology: string; formula: string; confidence: number; whyMatters: string }> = {
  metroExpansion: {
    methodology: 'Transport Demand Model (4-step)',
    formula: 't = t₀ × (1 + 0.15 × (V/C)⁴) — BPR Traffic Function',
    confidence: 0.87,
    whyMatters: 'Bengaluru has the 5th worst traffic globally. Metro decongestion directly improves economic productivity and air quality.',
  },
  evAdoptionRate: {
    methodology: 'Carbon Emission Model (IPCC Tier 2)',
    formula: 'CO₂ = VKT × EF × (1 − EV_share) — IPCC 2006',
    confidence: 0.91,
    whyMatters: 'Transport accounts for 43% of Bengaluru\'s CO₂. EV adoption is Karnataka\'s primary strategy for achieving 30% EV penetration by 2030.',
  },
  roadCapacity: {
    methodology: 'BPR Traffic Assignment Function',
    formula: 't = t₀ × (1 + α × (V/C)^β), α = 0.15, β = 4',
    confidence: 0.87,
    whyMatters: 'Road capacity improvements can reduce congestion but may induce demand. Optimal investment balances road widening with transit.',
  },
  renewableShare: {
    methodology: 'Energy Grid Model (Load Duration Curve)',
    formula: 'EF_grid = Σ(EF_i × share_i) — CEA 2023',
    confidence: 0.89,
    whyMatters: 'Karnataka aims for 50% renewable by 2030. Each 10% grid decarbonization cascades across buildings and transport.',
  },
  waterInfrastructure: {
    methodology: 'IWA Water Balance Model',
    formula: 'NRW = (Supply − Billed) / Supply — Leakage: 40%',
    confidence: 0.84,
    whyMatters: 'Bengaluru\'s 40% water leakage is among India\'s highest. Fixing leaks costs 5× less than new supply projects.',
  },
  greenSpaceAllocation: {
    methodology: 'Urban Heat Island + AQI Regression',
    formula: 'ΔT = −0.4°C per 10% green cover increase (Oke 1982)',
    confidence: 0.82,
    whyMatters: 'Green spaces sequester carbon, lower urban temps by up to 4°C, and improve mental health.',
  },
  industrialZoning: {
    methodology: 'Land Use + Solow-Swan Economic Model',
    formula: 'Y = A × K^α × L^(1−α), α = 0.35',
    confidence: 0.78,
    whyMatters: 'Industrial zoning above 50% boosts GDP but compounds pollution and traffic.',
  },
};

function ExplainPanel({ sliderKey, onClose }: { sliderKey: keyof PolicyInput; onClose: () => void }) {
  const info = EXPLAIN_CONTENT[sliderKey];
  if (!info) return null;
  const confPct = Math.round(info.confidence * 100);
  const confTier = info.confidence >= 0.85 ? 'High' : info.confidence >= 0.65 ? 'Medium' : 'Low';

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }}
      className="absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-[var(--slate-200)] shadow-2xl z-50 flex flex-col"
    >
      <div className="p-5 border-b border-[var(--slate-200)] flex justify-between items-center bg-[var(--slate-50)] shrink-0">
        <span className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-wider flex items-center gap-2">
          <HelpCircle size={16} className="text-[var(--accent-blue)]" /> Explainability
        </span>
        <button onClick={onClose} className="text-[var(--slate-400)] hover:text-[var(--accent-red)] transition-colors">✕</button>
      </div>

      <div className="p-5 flex flex-col gap-6 overflow-y-auto">
        <div>
          <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1.5">Model Reference</div>
          <div className="text-sm font-bold text-[var(--slate-900)]">{info.methodology}</div>
          <div className="text-[11px] text-[var(--accent-blue)] font-mono bg-[var(--accent-blue)]/5 p-2 rounded border border-[var(--accent-blue)]/20 mt-2">
            {info.formula}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2">Confidence Interval</div>
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-bold ${info.confidence >= 0.85 ? 'text-[var(--accent-teal)]' : info.confidence >= 0.65 ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-red)]'}`}>
              {confPct}%
            </span>
            <div>
              <div className="text-sm font-bold text-[var(--slate-900)]">{confTier} Confidence</div>
              <div className="text-xs text-[var(--slate-500)]">±{(100 - confPct)}% margin of error</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-[var(--slate-200)] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${info.confidence >= 0.85 ? 'bg-[var(--accent-teal)]' : info.confidence >= 0.65 ? 'bg-[var(--accent-amber)]' : 'bg-[var(--accent-red)]'}`} style={{ width: `${confPct}%` }} />
          </div>
        </div>

        <div className="bg-[var(--slate-900)] rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-blue)]/30 blur-2xl rounded-full" />
          <div className="text-[10px] font-bold text-[var(--accent-blue-light)] uppercase tracking-widest mb-2">Why This Matters</div>
          <div className="text-xs text-[var(--slate-300)] leading-relaxed">{info.whyMatters}</div>
        </div>
      </div>
    </motion.div>
  );
}

function PolicySlider({
  label, description, value, onChange, icon, onExplain,
}: {
  label: string; description: string;
  value: number; onChange: (v: number) => void; icon: string; onExplain: () => void;
}) {
  const percentage = value;
  const segmentColor = percentage > 66 ? 'var(--accent-teal)' : percentage > 33 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const impactDirection = percentage > 55 ? 'positive' : percentage < 45 ? 'negative' : 'neutral';
  const impactLabel = impactDirection === 'positive' ? 'Beneficial' : impactDirection === 'negative' ? 'Caution' : 'Neutral';
  const impactColor = impactDirection === 'positive' ? 'var(--accent-teal)' : impactDirection === 'negative' ? 'var(--accent-red)' : 'var(--slate-400)';

  return (
    <div className="py-4 border-b border-[var(--slate-200)] group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--slate-900)]">{label}</span>
              <button onClick={onExplain} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-[var(--accent-blue)]/30">?</button>
            </div>
            <div className="text-[10px] text-[var(--slate-500)] mt-0.5">{description}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold" style={{ color: segmentColor }}>{value}%</span>
          <button onClick={() => onChange(0)} className="text-[9px] font-bold text-[var(--slate-400)] uppercase tracking-wider hover:text-[var(--accent-blue)] transition-colors mt-0.5">Reset</button>
        </div>
      </div>

      <div className="relative h-6 flex items-center mt-2 group/slider">
        <div className="absolute inset-x-0 h-1.5 bg-[var(--slate-200)] rounded-full" />
        <div className="absolute left-0 h-1.5 rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, var(--accent-red) 0%, var(--accent-amber) 33%, var(--accent-teal) 66%, var(--accent-teal) 100%)` }} />
        <div className="absolute w-3 h-3 bg-white border-2 rounded-full shadow-sm top-1/2 -translate-y-1/2 -translate-x-1.5 group-hover/slider:scale-125 transition-transform" style={{ left: `${value}%`, borderColor: segmentColor }} />
        <input
          type="range" min={0} max={100} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex gap-1.5 mt-3">
        {PRESETS.map(p => (
          <button
            key={p.label} onClick={() => onChange(p.value)}
            className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-widest rounded transition-colors ${
              value === p.value ? 'text-white shadow-sm' : 'bg-[var(--slate-100)] text-[var(--slate-500)] hover:bg-[var(--slate-200)]'
            }`}
            style={value === p.value ? { background: segmentColor } : {}}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricDelta({ label, before, after, delta, unit, confidence }: {
  label: string; before: number; after: number; delta: number; unit: string; confidence: number;
}) {
  const isGood = unit === '%congestion' ? delta < 0 : unit === 'ktCO2/yr' ? delta < 0 : unit === 'AQI' ? delta < 0 : delta > 0;
  const deltaColor = isGood ? 'var(--accent-teal)' : 'var(--accent-red)';
  const deltaArrow = delta > 0 ? '▲' : '▼';
  const confidenceTier = confidence >= 0.85 ? 'High' : confidence >= 0.65 ? 'Med' : 'Low';
  
  return (
    <div className="bg-white border border-[var(--slate-200)] rounded-xl p-4 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl rounded-full opacity-20 ${isGood ? 'bg-[var(--accent-teal)]' : 'bg-[var(--accent-red)]'}`} />
      
      <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-3">{label}</div>
      
      <div className="flex items-end gap-4 mb-3">
        <div className="flex-1">
          <div className="text-[10px] text-[var(--slate-400)] font-semibold uppercase mb-1">Before</div>
          <div className="text-xl font-bold text-[var(--slate-700)]">
            {typeof before === 'number' ? before.toFixed(before < 10 ? 1 : 0) : before}
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center shrink-0 w-8">
          <span className="text-[10px] text-[var(--slate-300)] font-bold">→</span>
        </div>
        
        <div className="flex-1">
          <div className="text-[10px] text-[var(--accent-blue)] font-bold uppercase mb-1">After</div>
          <div className="text-2xl font-bold text-[var(--slate-900)]">
            {typeof after === 'number' ? after.toFixed(after < 10 ? 1 : 0) : after}
          </div>
        </div>
      </div>
      
      <div className={`flex justify-between items-center px-3 py-1.5 rounded-md border ${isGood ? 'bg-[var(--accent-teal)]/5 border-[var(--accent-teal)]/20' : 'bg-[var(--accent-red)]/5 border-[var(--accent-red)]/20'}`}>
        <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: deltaColor }}>
          {deltaArrow} {Math.abs(delta).toFixed(delta < 10 ? 1 : 0)} {unit}
        </div>
        <div className="text-[9px] font-bold text-[var(--slate-500)] uppercase">
          {Math.round(confidence * 100)}% Conf
        </div>
      </div>
    </div>
  );
}

function CascadeNodeView({ node, depth = 0 }: { node: CascadeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const isImprovement = node.type === 'improvement';
  const color = isImprovement ? 'var(--accent-teal)' : node.type === 'deterioration' ? 'var(--accent-red)' : 'var(--slate-500)';
  
  return (
    <div className="mb-1">
      <div className="flex items-center">
        {depth > 0 && (
          <div className="w-6 flex shrink-0 justify-center">
            <div className="w-px h-full bg-[var(--slate-200)]" />
            <div className="w-2 h-px bg-[var(--slate-300)]" />
          </div>
        )}
        <button 
          onClick={() => setOpen(!open)}
          className={`flex-1 flex items-center justify-between p-2 rounded-lg border hover:bg-[var(--slate-50)] transition-colors ${depth === 0 ? 'bg-white border-[var(--slate-200)] shadow-sm' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-[10px] transition-transform ${open ? 'rotate-90' : ''} ${node.children.length > 0 ? 'text-[var(--slate-400)]' : 'opacity-0'}`}>▶</span>
            <div className={`w-1.5 h-1.5 rounded-full`} style={{ background: color }} />
            <span className="text-xs font-semibold text-[var(--slate-800)]">{node.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-1 bg-[var(--slate-100)] rounded-full overflow-hidden shrink-0">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(node.delta)*2)}%`, background: color }} />
            </div>
            <span className="text-[10px] font-bold text-[var(--slate-400)] w-8 text-right">{Math.round(node.confidence * 100)}%</span>
          </div>
        </button>
      </div>
      
      {open && node.children.length > 0 && (
        <div className="ml-1 mt-1 border-l border-[var(--slate-100)] pl-1">
          {node.children.map(child => <CascadeNodeView key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

const SLIDERS: { key: keyof PolicyInput; label: string; description: string; icon: string }[] = [
  { key: 'metroExpansion', label: 'Metro Expansion', description: 'Network reach vs demand', icon: '🚇' },
  { key: 'evAdoptionRate', label: 'EV Adoption Rate', description: 'Fleet electrification %', icon: '⚡' },
  { key: 'roadCapacity', label: 'Road Capacity', description: 'Infrastructure widenings', icon: '🛣' },
  { key: 'renewableShare', label: 'Renewable Grid', description: 'Solar/Wind integration', icon: '☀' },
  { key: 'waterInfrastructure', label: 'Water Infrastructure', description: 'Leakage reduction', icon: '💧' },
  { key: 'greenSpaceAllocation', label: 'Green Space', description: 'Parks & canopy cover', icon: '🌿' },
  { key: 'industrialZoning', label: 'Industrial Zoning', description: 'Manufacturing capacity', icon: '🏭' },
];

export default function DecisionTwinPage() {
  const { activePolicy, results, timeline, isComputing, setPolicy, activeScenarioName } = useSimulationStore();
  const [explainSlider, setExplainSlider] = useState<keyof PolicyInput | null>(null);

  const radarData = [
    { dimension: 'Mobility', value: Math.max(0, 100 - results.traffic.after) },
    { dimension: 'Environment', value: Math.max(0, 100 - results.aqi.after / 2) },
    { dimension: 'Energy', value: 70 },
    { dimension: 'Water', value: Math.max(0, 100 - (results.water.after / results.water.before * 50)) },
    { dimension: 'Economy', value: Math.min(100, 50 + results.gdp.after * 5) },
    { dimension: 'Safety', value: 72 },
    { dimension: 'Equity', value: 60 + (activePolicy.metroExpansion * 0.2) },
    { dimension: 'Climate', value: Math.max(0, 100 - (results.co2.after / results.co2.before * 80)) },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[var(--slate-50)]">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-[var(--slate-200)] px-6 py-3 flex justify-between items-center shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--slate-900)] text-white flex items-center justify-center">
              <Sliders size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-wider">Decision Twin Engine</h1>
              <div className="text-[10px] text-[var(--slate-500)] font-semibold mt-0.5">{activeScenarioName || 'Custom Run'}</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-[var(--slate-200)]" />
          
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[9px] font-bold text-[var(--slate-400)] uppercase tracking-widest mb-0.5">Model Confidence</div>
              <div className="text-sm font-bold text-[var(--accent-teal)]">{Math.round(results.confidence * 100)}%</div>
            </div>
            {isComputing && (
              <div className="flex items-center gap-1.5 bg-[var(--accent-blue)]/10 px-2 py-1 rounded">
                <RefreshCcw size={12} className="text-[var(--accent-blue)] animate-spin" />
                <span className="text-[10px] font-bold text-[var(--accent-blue)] uppercase tracking-wider">Computing</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-xs font-bold text-[var(--slate-600)] rounded-lg transition-colors">
            <FolderOpen size={14} /> Load
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[var(--slate-900)] hover:bg-[var(--slate-800)] text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
            <Save size={14} /> Save Scenario
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Inputs */}
        <div className="w-[340px] bg-white border-r border-[var(--slate-200)] flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 bg-[var(--slate-50)] border-b border-[var(--slate-200)] flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest">Policy Dials</span>
            <span className="text-[10px] font-bold bg-[var(--slate-200)] text-[var(--slate-600)] px-2 py-0.5 rounded-full">{Object.values(activePolicy).filter(v => v>0).length}/7 Active</span>
          </div>
          <div className="flex-1 overflow-y-auto px-5 custom-scrollbar">
            {SLIDERS.map(s => (
              <PolicySlider key={s.key} label={s.label} description={s.description} icon={s.icon} value={activePolicy[s.key]} onChange={v => setPolicy({ [s.key]: v })} onExplain={() => setExplainSlider(s.key)} />
            ))}
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--slate-50)] custom-scrollbar">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Impact Cards */}
            <div>
              <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Play size={14} className="text-[var(--accent-blue)]" /> Predicted Impact Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricDelta label="Traffic Congestion" before={results.traffic.before} after={results.traffic.after} delta={results.traffic.delta} unit="%congestion" confidence={results.traffic.confidence} />
                <MetricDelta label="CO₂ Emissions" before={results.co2.before} after={results.co2.after} delta={results.co2.delta} unit="ktCO2/yr" confidence={results.co2.confidence} />
                <MetricDelta label="Air Quality" before={results.aqi.before} after={results.aqi.after} delta={results.aqi.delta} unit="AQI" confidence={results.aqi.confidence} />
                <MetricDelta label="Water Demand Gap" before={results.water.before} after={results.water.after} delta={results.water.delta} unit="MLD" confidence={results.water.confidence} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Radar Chart */}
              <div className="bg-white border border-[var(--slate-200)] rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Vector Assessment</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--slate-200)" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: 'var(--slate-600)', fontSize: 11, fontWeight: 600 }} />
                      <Radar dataKey="value" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cascade Network */}
              <div className="bg-white border border-[var(--slate-200)] rounded-xl p-5 shadow-sm flex flex-col">
                <h3 className="text-xs font-bold text-[var(--slate-500)] uppercase tracking-widest mb-4">Cascading Effects</h3>
                <div className="flex-1 bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-lg p-3 overflow-y-auto max-h-[280px] custom-scrollbar">
                  {results.cascadingEffects.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-[var(--slate-400)] font-medium">
                      Adjust policy dials to simulate effects
                    </div>
                  ) : (
                    results.cascadingEffects.map(node => <CascadeNodeView key={node.id} node={node} />)
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Explain Overlay */}
        <AnimatePresence>
          {explainSlider && <ExplainPanel sliderKey={explainSlider} onClose={() => setExplainSlider(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
