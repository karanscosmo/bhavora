import { NextResponse } from 'next/server';

const specs: Record<string, object> = {
  'decision-twin': {
    name: 'Decision Twin Engine',
    version: 'v3.0.5',
    inputs: ['GIS Layers', 'IoT Sensor Mesh', 'Census Data', 'Traffic APIs'],
    outputs: ['Scenario Metrics', 'Impact Scores', 'Timeline Projections'],
    apis: ['/api/simulate', '/api/districts', '/api/dashboard/live-metrics'],
    dataFlow: 'Sensor Mesh → Aggregation Layer → Decision Model → KPI Output',
    details: 'Aggregates 240+ urban data streams. Runs on deterministic multi-variable impact equations calibrated against 15 years of Bengaluru municipal data.',
    latency: '< 2 seconds',
    accuracy: '94.2%',
    dataPoints: '240+',
  },
  'scenario-engine': {
    name: 'Scenario Engine',
    version: 'v3.0.4',
    inputs: ['EV Adoption Rate', 'Population Growth', 'Industrial Expansion', 'Metro Lines', 'Renewable Mix'],
    outputs: ['Policy Simulations', 'Risk Scores', 'Saved Scenario Library'],
    apis: ['/api/simulate', '/api/scenarios'],
    dataFlow: 'Parameter Inputs → Scenario Model → Impact Calculator → Scenario Store',
    details: 'Supports unlimited scenario branching with version history. Scenarios persist across sessions via Zustand + localStorage.',
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
    details: 'Compares every simulation output against the 2025 baseline. Generates weighted sustainability (0-10), resilience (0-10), and economic (0-10) scores.',
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
    details: 'Logarithmic regression models for population. Linear projection for energy and water demand. Exponential decay for infrastructure stress.',
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
    details: 'Rule-based expert system with 48 configured threshold rules. Generates natural language recommendations based on projected metric deltas.',
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
    details: 'Client-side PDF generation using jsPDF + html2canvas. Reports include: metrics summary, impact charts, AI recommendations, and scenario comparison.',
    latency: '< 5 seconds',
    accuracy: 'N/A',
    dataPoints: 'All platform data',
  },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ engine: string }> }
) {
  const { engine } = await params;
  const spec = specs[engine];
  if (!spec) {
    return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
  }
  return NextResponse.json(spec);
}
