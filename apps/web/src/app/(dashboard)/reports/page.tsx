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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--slate-200)] text-[var(--slate-800)]">
      
      {/* Left Column: Document Index */}
      <div className="w-[380px] bg-[var(--slate-50)] border-r border-[var(--slate-300)] flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        <div className="p-5 border-b border-[var(--slate-300)] bg-white shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded bg-[var(--slate-900)] text-white flex items-center justify-center shadow-inner">
              <KeySquare size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest">Document Center</h1>
              <div className="text-[10px] text-[var(--slate-500)] font-semibold mt-0.5 font-mono">CLASSIFIED ARCHIVES</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {REPORTS_LIST.map(report => {
            const isSelected = selectedReportId === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-white border-[var(--accent-navy)] shadow-md ring-1 ring-[var(--accent-navy)]' 
                    : 'bg-white border-[var(--slate-200)] shadow-sm hover:border-[var(--slate-300)]'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-[var(--slate-500)] tracking-widest uppercase">
                    {report.category}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                    report.status === 'Published' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]' :
                    report.status === 'Under Review' ? 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]' :
                    'bg-[var(--slate-200)] text-[var(--slate-600)]'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h3 className={`text-sm leading-tight mb-2 ${isSelected ? 'font-bold text-[var(--accent-navy)]' : 'font-semibold text-[var(--slate-800)]'}`}>
                  {report.title}
                </h3>
                <div className="flex items-center gap-2 text-[9px] font-mono text-[var(--slate-500)] uppercase mt-3 pt-3 border-t border-[var(--slate-100)]">
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
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[var(--slate-200)] flex justify-center">
        
        {/* The Paper Document */}
        <div 
          id="reports-detail-panel" 
          className="w-full max-w-[850px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[var(--slate-300)] my-4 relative"
          style={{ minHeight: '1100px' }}
        >
          {/* Top Edge / Letterhead */}
          <div className="h-4 bg-[var(--accent-navy)] w-full absolute top-0 left-0" />
          
          <div className="p-16 pt-20">
            {/* Header section */}
            <div className="flex justify-between items-start border-b-2 border-[var(--slate-900)] pb-8 mb-8">
              <div>
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1 font-mono">
                  DEPARTMENT OF URBAN INTELLIGENCE
                </div>
                <div className="text-4xl font-bold text-[var(--slate-900)] font-serif leading-tight max-w-[500px]">
                  {selectedReport.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-1 font-mono">Report Identifier</div>
                <div className="text-lg font-bold text-[var(--slate-900)] font-mono">{selectedReport.id.toUpperCase()}</div>
                <div className="text-xs text-[var(--slate-600)] font-mono mt-2 flex items-center justify-end gap-1">
                  <ShieldCheck size={14} className="text-[var(--accent-teal)]" /> 
                  CONFIDENCE: {selectedReport.confidence}%
                </div>
              </div>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-4 gap-0 border-y border-[var(--slate-300)] bg-[var(--slate-50)] mb-10 font-mono text-xs">
              <div className="p-3 border-r border-[var(--slate-300)]">
                <div className="text-[9px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Author</div>
                <div className="font-bold text-[var(--slate-900)]">{selectedReport.author}</div>
              </div>
              <div className="p-3 border-r border-[var(--slate-300)]">
                <div className="text-[9px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Version</div>
                <div className="font-bold text-[var(--slate-900)]">{selectedReport.version}</div>
              </div>
              <div className="p-3 border-r border-[var(--slate-300)]">
                <div className="text-[9px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Classification</div>
                <div className="font-bold text-[var(--slate-900)] uppercase">{selectedReport.category}</div>
              </div>
              <div className="p-3">
                <div className="text-[9px] text-[var(--slate-500)] uppercase tracking-widest mb-1">Date</div>
                <div className="font-bold text-[var(--slate-900)]">{new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            {/* Abstract */}
            <div className="mb-12">
              <h3 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest mb-4 border-b border-[var(--slate-200)] pb-2 inline-block">1.0 Executive Summary</h3>
              <p className="text-sm text-[var(--slate-700)] leading-loose font-serif text-justify">
                {selectedReport.summary}
              </p>
            </div>

            {/* Metrics */}
            <div className="mb-12">
              <h3 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest mb-4 border-b border-[var(--slate-200)] pb-2 inline-block">2.0 Key Indicators</h3>
              <div className="grid grid-cols-3 gap-6">
                {selectedReport.metrics.map((m, idx) => (
                  <div key={idx} className="border border-[var(--slate-300)] p-4 bg-white shadow-sm">
                    <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono h-8">{m.label}</div>
                    <div className="text-2xl font-bold text-[var(--slate-900)] font-serif mb-2">{m.value}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest font-mono ${m.isGood ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-red)]'}`}>
                      {m.delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Context */}
            <div className="mb-12">
              <h3 className="text-sm font-bold text-[var(--slate-900)] uppercase tracking-widest mb-4 border-b border-[var(--slate-200)] pb-2 inline-block">3.0 Model Variables</h3>
              <div className="border border-[var(--slate-300)] p-5 bg-[var(--slate-50)] font-mono text-xs leading-relaxed text-[var(--slate-700)]">
                <p>THE FOLLOWING SIMULATION VECTORS WERE ACTIVE AT TIME OF REPORT GENERATION:</p>
                <ul className="mt-3 space-y-2 list-disc list-inside">
                  <li>METRO EXPANSION INDEX: {activePolicy.metroExpansion}%</li>
                  <li>EV ADOPTION RATE: {activePolicy.evAdoptionRate}%</li>
                  <li>RENEWABLE ENERGY SHARE: {activePolicy.renewableShare}%</li>
                  <li>ROAD CAPACITY INDEX: {activePolicy.roadCapacity}%</li>
                  <li>WATER INFRASTRUCTURE: {activePolicy.waterInfrastructure}%</li>
                </ul>
              </div>
            </div>

            {/* Footer / Signoff */}
            <div className="mt-24 pt-8 border-t border-[var(--slate-300)] flex justify-between items-end font-mono text-[10px] text-[var(--slate-500)]">
              <div>
                GENERATED BY BHAVORA URBAN OS<br/>
                CHECKSUM: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-[var(--slate-400)] mb-2"></div>
                AUTHORIZED SIGNATURE
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 right-8 flex gap-3 no-print z-50">
        <button
          onClick={() => handleExportCSV(selectedReport)}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-[var(--slate-300)] hover:bg-[var(--slate-50)] text-[var(--slate-700)] text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"
        >
          <FileSpreadsheet size={16} /> Export CSV
        </button>
        <button
          onClick={() => handleExportPDF(selectedReport)}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-3 bg-[var(--accent-navy)] hover:bg-[var(--accent-navy)]/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"
        >
          <Printer size={16} /> {exporting ? 'PRINTING...' : 'PRINT REPORT'}
        </button>
      </div>

    </div>
  );
}
