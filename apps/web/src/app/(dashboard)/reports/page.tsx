"use client";

import React, { useState } from 'react';
import { useSimulationStore, useAppStore } from '@/stores';
import { exportToPDF, exportToCSV } from '@/lib/exportUtils';
import { ChevronRight } from 'lucide-react';

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
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span>Analysis</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: '#00D4FF', fontWeight: 600 }}>Predictive Outlook Reports</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Predictive Infrastructure Outlook</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Evaluate regional carrying capacity, transit indices, and grid stability reports based on Bengaluru urban models.
        </p>
      </div>

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '16px', alignItems: 'start' }}>
        
        {/* Left Side: 6 Reports List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {REPORTS_LIST.map(report => {
            const isSelected = selectedReportId === report.id;
            const confColor = report.confidence >= 85 ? '#10B981' : report.confidence >= 65 ? '#F59E0B' : '#EF4444';

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className="glass-card"
                style={{
                  padding: '16px', borderRadius: '10px', cursor: 'pointer',
                  borderColor: isSelected ? 'rgba(0, 212, 255, 0.3)' : undefined,
                  background: isSelected ? 'rgba(0, 212, 255, 0.03)' : undefined,
                  transition: 'all 150ms',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {report.category}
                  </span>
                  <span style={{ fontSize: '10px', color: confColor, fontWeight: 700 }}>
                    Confidence {report.confidence}%
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
                  {report.title}
                </h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>
                  {report.description}
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
                  <span>Author: {report.author}</span>
                  <span>·</span>
                  <span>Ver: {report.version}</span>
                  <span>·</span>
                  <span style={{ color: report.status === 'Published' ? '#10B981' : '#F59E0B' }}>{report.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Interactive Report Viewer details panel */}
        <div id="reports-detail-panel" className="glass-card" style={{ padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(10,22,40,0.85)' }}>
          <div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#00D4FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {selectedReport.category} REPORT SPEC
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '8px 0 4px', lineHeight: 1.3 }}>
              {selectedReport.title}
            </h2>
            <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
              <span>Version {selectedReport.version}</span>
              <span>·</span>
              <span>By {selectedReport.author}</span>
            </div>
          </div>

          {/* Core Indicator Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedReport.metrics.map((m, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{m.value}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: m.isGood ? '#10B981' : '#EF4444' }}>
                  {m.delta}
                </span>
              </div>
            ))}
          </div>

          {/* Summary Abstract */}
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Summary Abstract</div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
              {selectedReport.summary}
            </p>
          </div>

          {/* Policy Context */}
          <div style={{ padding: '12px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '8px' }}>
            <span style={{ fontSize: '9px', color: '#00D4FF', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SIMULATOR CONTEXT</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
              Values calculated under current model profiles (Metro: {activePolicy.metroExpansion}%, EV: {activePolicy.evAdoptionRate}%, Renewables: {activePolicy.renewableShare}%).
            </span>
          </div>

          {/* Document actions */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }} className="no-print">
            <button
              onClick={() => handleExportPDF(selectedReport)}
              disabled={exporting}
              className="btn-primary"
              style={{ flex: 1, padding: '10px', fontSize: '12px' }}
            >
              {exporting ? 'Generating PDF...' : '⬇ Export PDF Report'}
            </button>
            <button
              onClick={() => handleExportCSV(selectedReport)}
              className="btn-ghost"
              style={{ padding: '10px 14px', fontSize: '12px' }}
            >
              📊 Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
