"use client";

import React, { useMemo, useState } from 'react';
import { useSimulationStore, useCityDataStore } from '@/stores';
import { Briefcase, TrendingDown, TrendingUp, AlertTriangle, ChevronRight, Download, Filter, FileSpreadsheet } from 'lucide-react';

export default function ImpactPage() {
  const { results, activePolicy } = useSimulationStore();
  const cityData = useCityDataStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const districtRankings = useMemo(() => {
    const districts = [
      { name: 'Whitefield', baseCong: 94, baseStress: 82, baseWater: 90, budgetImpact: 45000000 },
      { name: 'Electronic City', baseCong: 62, baseStress: 68, baseWater: 78, budgetImpact: 12000000 },
      { name: 'Koramangala', baseCong: 92, baseStress: 76, baseWater: 70, budgetImpact: 28000000 },
      { name: 'Hebbal', baseCong: 65, baseStress: 58, baseWater: 52, budgetImpact: 8500000 },
      { name: 'Indiranagar', baseCong: 88, baseStress: 62, baseWater: 48, budgetImpact: 19000000 },
    ];

    const trafficFactor = results.traffic.delta / 67;
    const waterFactor = results.water.delta / 1800;
    const energyFactor = results.energy.delta / 18500;

    return districts.map(d => {
      const currentCong = Math.round(Math.min(100, Math.max(10, d.baseCong * (1 + trafficFactor))));
      const currentWater = Math.round(Math.min(100, Math.max(10, d.baseWater * (1 + waterFactor))));
      const currentStress = Math.round(Math.min(100, Math.max(10, d.baseStress * (1 + energyFactor))));
      const compositeScore = Math.round((currentCong + currentWater + currentStress) / 3);
      
      const newBudgetImpact = Math.round(d.budgetImpact * (1 + (compositeScore - 70)/100));

      return {
        name: d.name,
        congestion: currentCong,
        waterStress: currentWater,
        energyStress: currentStress,
        score: compositeScore,
        budgetBase: d.budgetImpact,
        budgetProjected: newBudgetImpact,
        status: compositeScore > 75 ? 'Critical Risk' : compositeScore > 55 ? 'Elevated Risk' : 'Nominal'
      };
    }).sort((a, b) => b.score - a.score);
  }, [results]);

  const policyFlowWidths = useMemo(() => {
    return {
      metroToTraffic: Math.max(1, (activePolicy.metroExpansion / 100) * 12),
      roadToTraffic: Math.max(1, (activePolicy.roadCapacity / 100) * 10),
      evToCarbon: Math.max(1, (activePolicy.evAdoptionRate / 100) * 12),
      renewToEnergy: Math.max(1, (activePolicy.renewableShare / 100) * 14),
      waterToResource: Math.max(1, (activePolicy.waterInfrastructure / 100) * 12),
      trafficToCarbon: Math.max(1, Math.abs(results.traffic.delta) * 0.5),
      energyToCarbon: Math.max(1, (results.energy.after / 10000) * 4),
      carbonToHealth: Math.max(1, (100 - results.aqi.after) * 0.15),
      trafficToHealth: Math.max(1, (100 - results.traffic.after) * 0.15),
    };
  }, [activePolicy, results]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const totalCapex = (activePolicy.metroExpansion * 150000000) + (activePolicy.roadCapacity * 45000000) + (activePolicy.waterInfrastructure * 85000000);
  const totalOpexReduction = Math.abs(results.traffic.delta) * 12000000 + Math.abs(results.energy.delta) * 8000;
  const roiYears = totalOpexReduction > 0 ? (totalCapex / totalOpexReduction).toFixed(1) : '∞';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-50)] text-[var(--slate-800)]">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-[var(--slate-200)] px-8 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[var(--accent-navy)] text-white flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-0.5">Financial & Operational Analysis</div>
            <h1 className="text-lg font-bold text-[var(--slate-900)]">Impact Breakdown Report</h1>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-sm font-bold text-[var(--slate-700)] transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--slate-200)] hover:bg-[var(--slate-50)] text-sm font-bold text-[var(--slate-700)] transition-colors">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-navy)] hover:bg-[var(--accent-navy)]/90 text-white text-sm font-bold transition-colors">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Top Financial Summary */}
          <div className="bg-white border border-[var(--slate-200)] shadow-sm flex flex-col md:flex-row">
            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-[var(--slate-200)]">
              <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2">Total CAPEX Requirement</div>
              <div className="text-3xl font-bold text-[var(--slate-900)] font-serif tracking-tight">{formatCurrency(totalCapex)}</div>
              <div className="text-xs text-[var(--slate-500)] mt-2">Capital expenditure for active infrastructure policies</div>
            </div>
            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-[var(--slate-200)]">
              <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2">Projected Annual OPEX Savings</div>
              <div className="text-3xl font-bold text-[var(--accent-teal)] font-serif tracking-tight">{formatCurrency(totalOpexReduction)}</div>
              <div className="text-xs text-[var(--slate-500)] mt-2">Operational savings from efficiency gains</div>
            </div>
            <div className="flex-1 p-6">
              <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2">Est. Return on Investment</div>
              <div className="text-3xl font-bold text-[var(--slate-900)] font-serif tracking-tight">{roiYears} <span className="text-lg text-[var(--slate-500)]">Years</span></div>
              <div className="text-xs text-[var(--slate-500)] mt-2">Time to recoup capital expenditure</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Flow Diagram */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[var(--slate-200)] shadow-sm p-6">
                <div className="flex justify-between items-end mb-6 border-b border-[var(--slate-200)] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest">Policy Volumetric Flow</h2>
                    <p className="text-xs text-[var(--slate-500)] mt-1">Traces the allocation of resources through operational vectors.</p>
                  </div>
                </div>

                <div className="bg-[var(--slate-50)] border border-[var(--slate-200)] p-4 relative h-[320px]">
                  <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                    {/* Source Nodes */}
                    <rect x="10" y="20" width="16" height="30" fill="var(--slate-800)" />
                    <text x="36" y="38" fill="var(--slate-800)" fontSize="10" fontWeight="bold">Metro CAPEX</text>

                    <rect x="10" y="65" width="16" height="30" fill="var(--slate-700)" />
                    <text x="36" y="83" fill="var(--slate-700)" fontSize="10" fontWeight="bold">Road CAPEX</text>

                    <rect x="10" y="110" width="16" height="30" fill="var(--slate-600)" />
                    <text x="36" y="128" fill="var(--slate-600)" fontSize="10" fontWeight="bold">EV Subsidies</text>

                    <rect x="10" y="155" width="16" height="30" fill="var(--slate-500)" />
                    <text x="36" y="173" fill="var(--slate-500)" fontSize="10" fontWeight="bold">Grid Renewables</text>

                    <rect x="10" y="200" width="16" height="30" fill="var(--slate-400)" />
                    <text x="36" y="218" fill="var(--slate-400)" fontSize="10" fontWeight="bold">Water CAPEX</text>

                    {/* Intermediate Nodes */}
                    <rect x="250" y="40" width="16" height="50" fill="var(--slate-300)" />
                    <text x="276" y="68" fill="var(--slate-800)" fontSize="10" fontWeight="bold">Mobility Network</text>

                    <rect x="250" y="110" width="16" height="50" fill="var(--slate-300)" />
                    <text x="276" y="138" fill="var(--slate-800)" fontSize="10" fontWeight="bold">Emissions Factor</text>

                    <rect x="250" y="180" width="16" height="50" fill="var(--slate-300)" />
                    <text x="276" y="208" fill="var(--slate-800)" fontSize="10" fontWeight="bold">Resource Grid</text>

                    {/* Final Node */}
                    <rect x="520" y="90" width="20" height="90" fill="var(--accent-navy)" />
                    <text x="550" y="140" fill="var(--accent-navy)" fontSize="12" fontWeight="bold">Net OPEX</text>

                    {/* Links */}
                    <path d="M 26 35 C 130 35, 130 55, 250 55" fill="none" stroke="var(--slate-800)" strokeOpacity="0.15" strokeWidth={policyFlowWidths.metroToTraffic * 2} />
                    <path d="M 26 80 C 130 80, 130 75, 250 75" fill="none" stroke="var(--slate-700)" strokeOpacity="0.15" strokeWidth={policyFlowWidths.roadToTraffic * 2} />
                    <path d="M 26 125 C 130 125, 130 120, 250 120" fill="none" stroke="var(--slate-600)" strokeOpacity="0.15" strokeWidth={policyFlowWidths.evToCarbon * 2} />
                    <path d="M 26 170 C 130 170, 130 145, 250 145" fill="none" stroke="var(--slate-500)" strokeOpacity="0.15" strokeWidth={policyFlowWidths.renewToEnergy * 2} />
                    <path d="M 26 215 C 130 215, 130 205, 250 205" fill="none" stroke="var(--slate-400)" strokeOpacity="0.15" strokeWidth={policyFlowWidths.waterToResource * 2} />

                    <path d="M 266 65 C 390 65, 390 115, 520 115" fill="none" stroke="var(--accent-navy)" strokeOpacity="0.1" strokeWidth={policyFlowWidths.trafficToHealth * 3} />
                    <path d="M 266 135 C 390 135, 390 135, 520 135" fill="none" stroke="var(--accent-navy)" strokeOpacity="0.1" strokeWidth={policyFlowWidths.energyToCarbon * 3} />
                    <path d="M 266 205 C 390 205, 390 155, 520 155" fill="none" stroke="var(--accent-navy)" strokeOpacity="0.1" strokeWidth={policyFlowWidths.carbonToHealth * 3} />
                  </svg>
                </div>
              </div>

              {/* District Budget Table */}
              <div className="bg-white border border-[var(--slate-200)] shadow-sm">
                <div className="p-6 border-b border-[var(--slate-200)]">
                  <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest">District Operations Ledger</h2>
                  <p className="text-xs text-[var(--slate-500)] mt-1">Projected OPEX requirements per district based on simulation outcomes.</p>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--slate-50)] text-[10px] uppercase font-bold text-[var(--slate-500)] border-b border-[var(--slate-200)]">
                      <th className="py-3 px-6">District</th>
                      <th className="py-3 px-6">Risk Profile</th>
                      <th className="py-3 px-6 text-right">Base OPEX</th>
                      <th className="py-3 px-6 text-right">Projected OPEX</th>
                      <th className="py-3 px-6 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtRankings.map(d => {
                      const variance = d.budgetProjected - d.budgetBase;
                      const isOver = variance > 0;
                      return (
                        <tr key={d.name} className="border-b border-[var(--slate-100)] hover:bg-[var(--slate-50)] transition-colors">
                          <td className="py-4 px-6 text-sm font-bold text-[var(--slate-800)]">{d.name}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              d.status === 'Critical Risk' ? 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]' :
                              d.status === 'Elevated Risk' ? 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]' :
                              'bg-[var(--slate-200)] text-[var(--slate-600)]'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-sm font-medium text-[var(--slate-500)] font-mono">{formatCurrency(d.budgetBase)}</td>
                          <td className="py-4 px-6 text-right text-sm font-bold text-[var(--slate-900)] font-mono">{formatCurrency(d.budgetProjected)}</td>
                          <td className="py-4 px-6 text-right text-sm font-bold font-mono">
                            <span className={isOver ? 'text-[var(--accent-red)]' : 'text-[var(--accent-teal)]'}>
                              {isOver ? '+' : ''}{formatCurrency(variance)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Operational Risks */}
            <div className="space-y-6">
              <div className="bg-white border border-[var(--slate-200)] shadow-sm p-6">
                <h2 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest mb-6">Operational Risk Matrix</h2>
                
                <div className="space-y-4">
                  {districtRankings.slice(0, 3).map((d, i) => (
                    <div key={d.name} className="border border-[var(--slate-200)] p-4 relative overflow-hidden bg-[var(--slate-50)]">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${d.status === 'Critical Risk' ? 'bg-[var(--accent-red)]' : 'bg-[var(--accent-amber)]'}`} />
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-[var(--slate-900)]">{d.name}</div>
                        <div className="text-[10px] font-bold text-[var(--slate-500)]">Rank {i+1}</div>
                      </div>
                      <div className="text-[10px] text-[var(--slate-600)] mb-3 leading-relaxed">
                        Composite risk elevated by {d.congestion > 80 ? 'severe congestion liabilities' : d.waterStress > 80 ? 'critical water shortages' : 'grid overloads'}. Action required.
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[var(--slate-500)] border-t border-[var(--slate-200)] pt-2">
                        <span>Risk Index</span>
                        <span className="text-[var(--slate-900)]">{d.score} / 100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--accent-navy)] text-white p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[var(--accent-amber)]" /> Auditor Notes
                </h2>
                <div className="text-xs text-[var(--slate-300)] space-y-4 leading-relaxed">
                  <p>Model relies on static population growth bounds (±2%). Macroeconomic shocks are not priced into OPEX projections.</p>
                  <p>Water infrastructure CAPEX estimates assume standard right-of-way acquisition costs. Delays may inflate capital requirements by up to 14% YoY.</p>
                  <p>Renewable subsidies present the highest variance in ROI timelines depending on central government block grants.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
