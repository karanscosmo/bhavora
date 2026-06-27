"use client";

import React, { useState } from 'react';
import { useSimulationStore, useAppStore } from '@/stores';
import { exportToPDF, exportToCSV } from '@/lib/exportUtils';
import { ChevronRight, FileText, Download, Printer, ShieldCheck, Clock, FileSpreadsheet, KeySquare } from 'lucide-react';

interface ReportSpec {
  id: string;
  title: string;
  category: 'Demographics' | 'Transport' | 'Energy' | 'Water' | 'Environment' | 'Economy';
  description: string;
  confidence: number;
  author: string;
  version: string;
  status: 'Published' | 'Under Review' | 'Draft';
  metrics: { label: string; value: string | number; delta?: string; isGood?: boolean }[];
  summary: string;
}

const REPORTS_LIST: ReportSpec[] = [
  {
    id: 'rep-demographics',
    title: 'Demographic & Housing Density Forecast 2025–2050',
    category: 'Demographics',
    description: '15-year population trajectory and carrying capacity models for BBMP zones.',
    confidence: 89,
    author: 'Urban AI Model 4-C',
    version: 'v3.2',
    status: 'Published',
    summary: 'Projections indicate Bengaluru will exceed 22M residents by 2050. The current residential zoning will face critical density factors in Whitefield and Koramangala. Housing capacity must expand by 4.2% annually to maintain current stability indexes.',
    metrics: [
      { label: 'Projected Pop (2050)', value: '22.4M', delta: '+64% vs 2025' },
      { label: 'Density Threshold', value: '18,500/km²', delta: 'Critical' },
      { label: 'Housing Demand Delta', value: '+142k units/yr', delta: 'High' }
    ]
  },
  {
    id: 'rep-transit',
    title: 'Transit Throughput & Corridor Congestion Study',
    category: 'Transport',
    description: 'BPR-derived analysis of Outer Ring Road, Silk Board, and metro expansion corridors.',
    confidence: 91,
    author: 'GIS Mobility Engine',
    version: 'v2.1',
    status: 'Published',
    summary: 'Evaluating peak commute congestion indices against baseline models. Public transit modal share increases with metro corridor investments, projecting a 12% delay decrease along the central spine.',
    metrics: [
      { label: 'Peak Congestion Index', value: '62%', delta: '-5% Improvement', isGood: true },
      { label: 'Metro Commuters Count', value: '450k/day', delta: '+12% ridership' },
      { label: 'Average Delay Reduction', value: '4.8 mins/commute', delta: 'Optimal', isGood: true }
    ]
  },
  {
    id: 'rep-energy',
    title: 'Energy Load Duration Curve & Grid Resilience Assessment',
    category: 'Energy',
    description: 'Peak draw capacity forecasts and renewable integration limits for BESCOM substations.',
    confidence: 86,
    author: 'Substation Telemetry Network',
    version: 'v4.0',
    status: 'Under Review',
    summary: 'Substation capacity limitations in East zone pose overload risks during Q3 summer peaks. Integration of renewable grids must reach 35% by 2028 to maintain current sub-transmission buffer specs.',
    metrics: [
      { label: 'Substation Peak Load', value: '4.1 GW', delta: '91% Capacity Utilization' },
      { label: 'Renewable Fraction', value: '25%', delta: '+8% vs 2024' },
      { label: 'Grid Outage Risk', value: 'Low-Medium', delta: 'Stable' }
    ]
  },
  {
    id: 'rep-water',
    title: 'Water Supply Balance & Catchment Conservation Report',
    category: 'Water',
    description: 'IWA water balance models, groundwater drawdown vectors, and Cauvery stage 5 forecasts.',
    confidence: 84,
    author: 'Hydro-Intelligence Lab',
    version: 'v1.4',
    status: 'Published',
    summary: 'Bengaluru groundwater levels show an average decline of 2.3m since last year. Cauvery Stage 5 will provide crucial buffer volumes but eastern outer districts continue to face tanker reliance risks.',
    metrics: [
      { label: 'Daily Water Deficit', value: '350 MLD', delta: 'Critical Gap' },
      { label: 'Groundwater Level Delta', value: '-2.3m', delta: 'Rapid Depletion' },
      { label: 'Cauvery Supply Buffer', value: '775 MLD (2026)', delta: 'Pending Stage 5' }
    ]
  },
  {
    id: 'rep-environment',
    title: 'Carbon Footprint & Air Quality Abatement Review',
    category: 'Environment',
    description: 'IPCC Tier 2 Sector greenhouse gas inventory and PM2.5 particulate drift vectors.',
    confidence: 88,
    author: 'Environmental Monitor Node',
    version: 'v3.0',
    status: 'Published',
    summary: 'Particulate matters drift vectors indicate heavy drift from eastern construction corridors. Implementation of strict dust mitigation protocols will boost Whitefield AQI metrics by an estimated 12 points.',
    metrics: [
      { label: 'CO2 Annual Value', value: '42,000 kt', delta: '-8% vs 2025 Plan', isGood: true },
      { label: 'Average AQI Index', value: '142', delta: 'Moderate' },
      { label: 'Construction Dust drift', value: '34% Sector Contribution', delta: 'High' }
    ]
  },
  {
    id: 'rep-economy',
    title: 'Economic Yield & Total Factor Productivity Audit',
    category: 'Economy',
    description: 'Solow-Swan investment multipliers and employment-density index updates.',
    confidence: 78,
    author: 'Urban Finance Advisory',
    version: 'v2.5',
    status: 'Draft',
    summary: 'TFP is projected to increase by 6.8% under high-capacity transport infrastructure profiles. Real estate capital appreciation values around metro terminals show high yield ratios.',
    metrics: [
      { label: 'GDP Growth Multiplier', value: '6.8%', delta: '+1.2% Growth Index', isGood: true },
      { label: 'TFP Index Growth', value: '1.14', delta: 'Optimal' },
      { label: 'New Jobs Forecast', value: '185k jobs/yr', delta: 'Target Met' }
    ]
  }
];

export default function ReportsPage() {
  const { results, activePolicy } = useSimulationStore();
  const { addNotification } = useAppStore();
  
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-demographics');
  const [exporting, setExporting] = useState(false);

  const selectedReport = REPORTS_LIST.find(r => r.id === selectedReportId) || REPORTS_LIST[0];

  const handleExportPDF = async (report: ReportSpec) => {
    setExporting(true);
    try {
      await exportToPDF('reports-detail-panel', `${report.id}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      addNotification({ title: 'Report Downloaded', message: `PDF report "${report.title}" exported successfully`, severity: 'success' });
    } catch {
      addNotification({ title: 'Export Failed', message: 'Could not generate report PDF', severity: 'critical' });
    }
    setExporting(false);
  };

  const handleExportCSV = (report: ReportSpec) => {
    const csvData = report.metrics.map(m => ({
      ReportTitle: report.title,
      Category: report.category,
      Author: report.author,
      Version: report.version,
      Indicator: m.label,
      Value: m.value,
      Details: m.delta
    }));
    try {
      exportToCSV(csvData, `${report.id}_Data_${new Date().toISOString().split('T')[0]}.csv`);
      addNotification({ title: 'Data Exported', message: 'CSV dataset downloaded successfully', severity: 'success' });
    } catch {
      addNotification({ title: 'Export Failed', message: 'Could not export CSV dataset', severity: 'critical' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0e14] text-white">
      
      {/* Left Column: Document Index */}
      <div className="w-[340px] bg-[var(--slate-900)] border-r border-[var(--slate-800)] flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="p-4 border-b border-[var(--slate-800)] bg-[var(--slate-900)]/80 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[var(--slate-800)] to-[var(--slate-900)] border border-[var(--slate-700)] text-white flex items-center justify-center">
              <KeySquare size={16} />
            </div>
            <div>
              <h1 className="text-[11px] font-bold text-white uppercase tracking-widest">Document Center</h1>
              <div className="text-[9px] text-[var(--accent-teal)] font-semibold mt-0.5 font-mono">CLASSIFIED ARCHIVES</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {REPORTS_LIST.map(report => {
            const isSelected = selectedReportId === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-3 rounded-sm cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-[#0f141e] border-[var(--accent-blue)] shadow-[inset_0_0_10px_rgba(37,99,235,0.2)]' 
                    : 'bg-transparent border-transparent hover:bg-[var(--slate-800)] hover:border-[var(--slate-700)]'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[8px] font-bold text-[var(--slate-400)] tracking-widest uppercase">
                    {report.category}
                  </span>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                    report.status === 'Published' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)] border-[var(--accent-teal)]/20' :
                    report.status === 'Under Review' ? 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border-[var(--accent-amber)]/20' :
                    'bg-[var(--slate-800)] text-[var(--slate-400)] border-[var(--slate-700)]'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h3 className={`text-[11px] leading-snug mb-2 font-mono ${isSelected ? 'font-bold text-white' : 'font-semibold text-[var(--slate-300)]'}`}>
                  {report.title}
                </h3>
                <div className="flex items-center gap-2 text-[8px] font-mono text-[var(--slate-500)] uppercase">
                  <span>REF: {report.id.toUpperCase()}</span>
                  <span>·</span>
                  <span>VER: {report.version}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Physical Document Viewer */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0a0e14] flex justify-center">
        
        {/* The Paper Document */}
        <div 
          id="reports-detail-panel" 
          className="w-full max-w-[900px] bg-[#0f141e] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-[var(--slate-800)] my-2 relative flex flex-col"
          style={{ minHeight: '100%' }}
        >
          {/* Top Edge / Letterhead */}
          <div className="h-1 bg-[var(--accent-blue)] w-full absolute top-0 left-0" />
          
          <div className="p-8 pt-12 flex-1">
            {/* Header section */}
            <div className="flex justify-between items-start border-b border-[var(--slate-800)] pb-6 mb-6">
              <div>
                <div className="text-[9px] font-bold text-[var(--accent-blue)] uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-blue)]" /> DEPARTMENT OF URBAN INTELLIGENCE
                </div>
                <div className="text-2xl font-bold text-white font-serif leading-tight max-w-[500px] tracking-wide">
                  {selectedReport.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1 font-mono">Report Identifier</div>
                <div className="text-sm font-bold text-[var(--slate-300)] font-mono tracking-wider">{selectedReport.id.toUpperCase()}</div>
                <div className="text-[10px] text-[var(--slate-400)] font-mono mt-2 flex items-center justify-end gap-1">
                  <ShieldCheck size={12} className="text-[var(--accent-teal)]" /> 
                  CONFIDENCE: <span className="text-[var(--accent-teal)] font-bold">{selectedReport.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-4 gap-0 border border-[var(--slate-800)] bg-[var(--slate-900)] mb-8 font-mono text-[10px]">
              <div className="p-3 border-r border-[var(--slate-800)]">
                <div className="text-[8px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Author</div>
                <div className="font-bold text-[var(--slate-300)] truncate">{selectedReport.author}</div>
              </div>
              <div className="p-3 border-r border-[var(--slate-800)]">
                <div className="text-[8px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Version</div>
                <div className="font-bold text-[var(--slate-300)]">{selectedReport.version}</div>
              </div>
              <div className="p-3 border-r border-[var(--slate-800)]">
                <div className="text-[8px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Classification</div>
                <div className="font-bold text-[var(--slate-300)] uppercase">{selectedReport.category}</div>
              </div>
              <div className="p-3">
                <div className="text-[8px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Date</div>
                <div className="font-bold text-[var(--slate-300)]">{new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            {/* Abstract */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-[var(--slate-300)] uppercase tracking-widest mb-3 border-b border-[var(--slate-800)] pb-1.5 inline-block font-mono">1.0 Executive Summary</h3>
              <p className="text-xs text-[var(--slate-400)] leading-relaxed font-serif text-justify">
                {selectedReport.summary}
              </p>
            </div>

            {/* Metrics */}
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-[var(--slate-300)] uppercase tracking-widest mb-3 border-b border-[var(--slate-800)] pb-1.5 inline-block font-mono">2.0 Key Indicators</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedReport.metrics.map((m, idx) => (
                  <div key={idx} className="border border-[var(--slate-800)] p-3 bg-[var(--slate-900)]/50">
                    <div className="text-[8px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1 font-mono h-6">{m.label}</div>
                    <div className="text-xl font-bold text-white font-serif mb-1">{m.value}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-widest font-mono ${m.isGood ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-red)]'}`}>
                      {m.delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Context */}
            <div className="mb-10">
              <h3 className="text-[10px] font-bold text-[var(--slate-300)] uppercase tracking-widest mb-3 border-b border-[var(--slate-800)] pb-1.5 inline-block font-mono">3.0 Model Variables</h3>
              <div className="border border-[var(--slate-800)] p-4 bg-[var(--slate-900)] font-mono text-[10px] leading-relaxed text-[var(--slate-400)] shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                <p className="text-[var(--accent-blue)] mb-2">:: SYSTEM TELEMETRY STATE AT REPORT GENERATION ::</p>
                <ul className="space-y-1.5 list-none">
                  <li><span className="text-[var(--slate-500)]">VAR_METRO_EXPANSION_IDX:</span> <span className="text-white">{activePolicy.metroExpansion}%</span></li>
                  <li><span className="text-[var(--slate-500)]">VAR_EV_ADOPTION_RATE:</span> <span className="text-white">{activePolicy.evAdoptionRate}%</span></li>
                  <li><span className="text-[var(--slate-500)]">VAR_RENEWABLE_SHARE:</span> <span className="text-white">{activePolicy.renewableShare}%</span></li>
                  <li><span className="text-[var(--slate-500)]">VAR_ROAD_CAPACITY_IDX:</span> <span className="text-white">{activePolicy.roadCapacity}%</span></li>
                  <li><span className="text-[var(--slate-500)]">VAR_WATER_INFRASTRUCTURE:</span> <span className="text-white">{activePolicy.waterInfrastructure}%</span></li>
                </ul>
              </div>
            </div>

            {/* Footer / Signoff */}
            <div className="mt-auto pt-6 border-t border-[var(--slate-800)] flex justify-between items-end font-mono text-[8px] text-[var(--slate-600)]">
              <div>
                GENERATED BY BHAVORA URBAN OS<br/>
                CHECKSUM: <span className="text-[var(--slate-400)]">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-[var(--slate-700)] mb-1.5 inline-block"></div><br/>
                AUTHORIZED TERMINAL
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 flex gap-2 no-print z-50">
        <button
          onClick={() => handleExportCSV(selectedReport)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--slate-900)] border border-[var(--slate-700)] hover:border-[var(--accent-blue)] text-[var(--slate-300)] text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all"
        >
          <FileSpreadsheet size={14} /> EXPORT DATA
        </button>
        <button
          onClick={() => handleExportPDF(selectedReport)}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)]"
        >
          <Printer size={14} /> {exporting ? 'PRINTING...' : 'PRINT BRIEFING'}
        </button>
      </div>

    </div>
  );
}
