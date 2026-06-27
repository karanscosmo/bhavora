/**
 * BHAVORA DEMO TIMELINE — 12-STEP AUTOMATED WALKTHROUGH
 * Each step has short narration for voice (max 120 chars) + detailed display text + timed DOM actions
 */

export interface DemoInteraction {
  type: 'highlight' | 'click' | 'scroll' | 'pulse-all';
  selector: string;    // data-demo="xxx" → [data-demo="xxx"]
  delayMs: number;
  label?: string;
}

export interface DemoStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  route: string;
  durationMs: number;
  // Short sentence spoken aloud — max ~100 chars to avoid Chrome buffer cutoff
  voiceText: string;
  // Full narration displayed in the panel (typewriter)
  narrationDetail: string;
  spotlight: string;
  interactions: DemoInteraction[];
}

export const DEMO_TIMELINE: DemoStep[] = [
  {
    id: 'executive-overview',
    stepNumber: 1,
    title: 'Executive Command Center',
    subtitle: 'Live City Telemetry',
    route: '/overview',
    durationMs: 14000,
    voiceText: 'Bhavora monitors Bengaluru live. City health, traffic, power, water and incidents — all in one command center.',
    narrationDetail: 'Bhavora aggregates real-time telemetry from 240+ municipal data streams — tracking city health score, air quality index, traffic congestion, power grid load, water capacity and active emergency incidents.',
    spotlight: 'Live KPIs updating from municipal systems every 10 seconds',
    interactions: [
      { type: 'highlight', selector: '[data-demo="metric-city-health"]', delayMs: 1500, label: 'City Health Score' },
      { type: 'highlight', selector: '[data-demo="metric-aqi"]', delayMs: 3500, label: 'Air Quality Index' },
      { type: 'highlight', selector: '[data-demo="metric-traffic"]', delayMs: 5500, label: 'Traffic Congestion' },
      { type: 'highlight', selector: '[data-demo="metric-grid"]', delayMs: 7500, label: 'Power Grid Load' },
      { type: 'highlight', selector: '[data-demo="main-map"]', delayMs: 9500, label: 'Bengaluru Digital Twin Map' },
    ]
  },
  {
    id: 'city-twin-gis',
    stepNumber: 2,
    title: 'City Digital Twin GIS',
    subtitle: 'Live Urban Intelligence Layer',
    route: '/cities',
    durationMs: 16000,
    voiceText: 'The city digital twin integrates metro lines, hospitals, power substations and flood zones on a live map.',
    narrationDetail: 'The GIS platform integrates infrastructure, mobility and environmental datasets. Switch between Light, Satellite and Hybrid views. Toggle metro corridors, hospital networks, substations and flood risk zones.',
    spotlight: 'Bengaluru City Twin — Infrastructure Layer Controls',
    interactions: [
      { type: 'highlight', selector: '[data-demo="map-style-satellite"]', delayMs: 2000, label: 'Switch to Satellite View' },
      { type: 'click', selector: '[data-demo="map-style-satellite"]', delayMs: 2500, label: 'Activating Satellite Mode' },
      { type: 'highlight', selector: '[data-demo="layer-metro"]', delayMs: 5000, label: 'BMRCL Metro Network Layer' },
      { type: 'highlight', selector: '[data-demo="layer-hospitals"]', delayMs: 7500, label: 'BBMP Hospitals Layer' },
      { type: 'click', selector: '[data-demo="map-style-hybrid"]', delayMs: 10000, label: 'Switch to Hybrid Mode' },
    ]
  },
  {
    id: 'disaster-response',
    stepNumber: 3,
    title: 'Emergency Response Center',
    subtitle: 'Multi-Agency Coordination',
    route: '/disaster',
    durationMs: 13000,
    voiceText: 'Emergency teams visualize incidents, impact radii and coordinate assets from BBMP, KSFRS and BESCOM.',
    narrationDetail: 'The Emergency Operations Center aggregates active incidents with real-time impact radius mapping. Coordinate NDRF, KSFRS, BBMP and BWSSB response assets with live resource tracking.',
    spotlight: 'Active incidents with population impact and resource allocation',
    interactions: [
      { type: 'highlight', selector: '[data-demo="incident-list"]', delayMs: 2000, label: 'Active Incident Log' },
      { type: 'click', selector: '[data-demo="incident-item-0"]', delayMs: 3500, label: 'Selecting Flood Incident' },
      { type: 'highlight', selector: '[data-demo="eoc-map"]', delayMs: 6000, label: 'EOC Map — Impact Radius' },
      { type: 'highlight', selector: '[data-demo="resource-panel"]', delayMs: 9500, label: 'Resource Deployment Panel' },
    ]
  },
  {
    id: 'decision-twin',
    stepNumber: 4,
    title: 'Decision Twin Engine',
    subtitle: 'Policy Scenario Modeler',
    route: '/decision-twin',
    durationMs: 15000,
    voiceText: 'Adjust investment sliders and see real-time projections for metro, renewable grid and water infrastructure.',
    narrationDetail: 'Move investment sliders — Metro Expansion, Renewable Grid, Water Infrastructure — and watch projected outcomes update instantly. The radar chart shows impact across 6 urban domains before you commit a single rupee.',
    spotlight: 'Adjusting policy sliders in real time — watch metrics update',
    interactions: [
      { type: 'highlight', selector: '[data-demo="slider-metro"]', delayMs: 2000, label: 'Metro Expansion Slider' },
      { type: 'click', selector: '[data-demo="slider-metro-increase"]', delayMs: 3000, label: 'Increasing Metro Investment' },
      { type: 'highlight', selector: '[data-demo="slider-grid"]', delayMs: 6000, label: 'Renewable Grid Slider' },
      { type: 'click', selector: '[data-demo="slider-grid-increase"]', delayMs: 7000, label: 'Boosting Grid Investment' },
      { type: 'highlight', selector: '[data-demo="policy-chart"]', delayMs: 10000, label: 'Impact Radar Chart Updating' },
      { type: 'highlight', selector: '[data-demo="run-simulation"]', delayMs: 12500, label: 'Run Simulation Button' },
    ]
  },
  {
    id: 'run-simulation',
    stepNumber: 5,
    title: 'Simulation Engine',
    subtitle: 'Deterministic 10-Year Forecast',
    route: '/decision-twin',
    durationMs: 10000,
    voiceText: 'Bhavora runs a 10-year deterministic simulation using 15 years of Bengaluru municipal data.',
    narrationDetail: 'Clicking Run Simulation triggers Bhavora\'s multi-variable forecast model. Processing 15 years of municipal data across 6 domains — traffic, energy, water, emissions, economics and housing.',
    spotlight: 'Simulation engine computing 10-year infrastructure outcomes',
    interactions: [
      { type: 'highlight', selector: '[data-demo="run-simulation"]', delayMs: 1500, label: 'Initiating Simulation' },
      { type: 'click', selector: '[data-demo="run-simulation"]', delayMs: 2500, label: 'Simulation Running...' },
    ]
  },
  {
    id: 'simulation-results',
    stepNumber: 6,
    title: 'Simulation Results',
    subtitle: '10-Year Infrastructure Forecast',
    route: '/simulation-results',
    durationMs: 12000,
    voiceText: 'Results show traffic down 28 percent, AQI improved by 34 points, and carbon emissions cut by 23 percent.',
    narrationDetail: 'Simulation results quantify policy impact: -28% traffic congestion, +34 AQI improvement, -23% carbon emissions, +₹890 Cr GDP contribution, improved water coverage and housing capacity.',
    spotlight: 'Before vs After — 10-year infrastructure impact forecast',
    interactions: [
      { type: 'highlight', selector: '[data-demo="result-traffic"]', delayMs: 2000, label: 'Traffic Reduction: -28%' },
      { type: 'highlight', selector: '[data-demo="result-aqi"]', delayMs: 4500, label: 'AQI Improvement: +34 pts' },
      { type: 'highlight', selector: '[data-demo="result-carbon"]', delayMs: 7000, label: 'Carbon Reduction: -23%' },
      { type: 'highlight', selector: '[data-demo="result-gdp"]', delayMs: 9500, label: 'GDP Contribution: +₹890 Cr' },
    ]
  },
  {
    id: 'impact-analysis',
    stepNumber: 7,
    title: 'Financial Impact Analysis',
    subtitle: 'Municipal Investment ROI',
    route: '/impact',
    durationMs: 12000,
    voiceText: 'Investment returns 2.1 times over five years, with full capital payback in 4.2 years across districts.',
    narrationDetail: 'The Impact module quantifies CAPEX, operational savings, payback period and ROI across all 27 Bengaluru districts. Cash flow projections support state and central government grant applications.',
    spotlight: 'ROI analysis — district-by-district investment allocation',
    interactions: [
      { type: 'highlight', selector: '[data-demo="impact-capex"]', delayMs: 2000, label: 'Total CAPEX Required' },
      { type: 'highlight', selector: '[data-demo="impact-roi"]', delayMs: 4500, label: '5-Year ROI: 2.1x' },
      { type: 'highlight', selector: '[data-demo="impact-districts"]', delayMs: 7000, label: 'District Allocation Map' },
    ]
  },
  {
    id: 'ai-insights',
    stepNumber: 8,
    title: 'Bhavishyavani Intelligence Briefs',
    subtitle: 'Predictive AI Recommendations',
    route: '/insights',
    durationMs: 12000,
    voiceText: 'Bhavishyavani auto-generates risk briefs with evidence chains, confidence scores and ROI projections.',
    narrationDetail: 'The AI continuously scans urban telemetry to generate intelligence briefs. Each brief includes evidence chains, confidence intervals, recommended interventions and projected ROI for decision-maker review.',
    spotlight: 'Auto-generated intelligence briefs — click to expand any insight',
    interactions: [
      { type: 'highlight', selector: '[data-demo="insight-card-0"]', delayMs: 2000, label: 'Eastern Grid Reinforcement Brief' },
      { type: 'click', selector: '[data-demo="insight-card-0"]', delayMs: 3200, label: 'Opening intelligence brief...' },
      { type: 'highlight', selector: '[data-demo="insight-evidence"]', delayMs: 6000, label: 'Evidence Chain & Confidence Score' },
    ]
  },
  {
    id: 'analytics-suite',
    stepNumber: 9,
    title: 'Advanced Analytics Suite',
    subtitle: 'Longitudinal Forecasting',
    route: '/analytics',
    durationMs: 11000,
    voiceText: 'Analytics show 30-day trends in congestion, AQI and energy demand across all 27 Bengaluru districts.',
    narrationDetail: 'Historical trend analysis, cross-domain correlations, population growth modeling and energy demand forecasting across Bengaluru\'s 27 districts. Geospatial AQI heatmap included.',
    spotlight: 'Cross-domain trend analysis — 30-day rolling window',
    interactions: [
      { type: 'highlight', selector: '[data-demo="analytics-chart-traffic"]', delayMs: 2000, label: 'Traffic Congestion Trends' },
      { type: 'highlight', selector: '[data-demo="analytics-chart-aqi"]', delayMs: 5000, label: 'AQI Historical Trends' },
      { type: 'highlight', selector: '[data-demo="analytics-map"]', delayMs: 8000, label: 'Geospatial AQI Distribution' },
    ]
  },
  {
    id: 'reports',
    stepNumber: 10,
    title: 'Executive Report Generation',
    subtitle: 'Board-Ready Documentation',
    route: '/reports',
    durationMs: 11000,
    voiceText: 'Generate board-ready infrastructure reports for municipal commissioners and government funding agencies.',
    narrationDetail: 'One-click report generation for BBMP commissioners, state finance departments, ADB and World Bank project teams. Reports include infrastructure audits, simulation forecasts and investment proposals.',
    spotlight: 'One-click report generation — select type and export',
    interactions: [
      { type: 'highlight', selector: '[data-demo="report-type-infrastructure"]', delayMs: 2000, label: 'Infrastructure Audit Report' },
      { type: 'click', selector: '[data-demo="report-type-infrastructure"]', delayMs: 3000, label: 'Selecting report type' },
      { type: 'highlight', selector: '[data-demo="generate-report"]', delayMs: 6000, label: 'Generate Report Button' },
      { type: 'click', selector: '[data-demo="generate-report"]', delayMs: 7000, label: 'Generating executive report...' },
    ]
  },
  {
    id: 'bhavishyavani-ai',
    stepNumber: 11,
    title: 'Bhavishyavani AI Copilot',
    subtitle: 'Conversational Urban Intelligence',
    route: '/overview',
    durationMs: 14000,
    voiceText: 'Ask Bhavishyavani anything — it answers with real infrastructure data, risk rankings and investment priorities.',
    narrationDetail: 'Municipal commissioners and decision-makers query Bhavishyavani in natural language. It responds with real infrastructure data, district risk rankings, budget recommendations and policy analysis.',
    spotlight: 'Ask Bhavishyavani — conversational AI for urban governance',
    interactions: [
      { type: 'highlight', selector: '[data-demo="summon-bhavishyavani"]', delayMs: 1500, label: 'Opening Bhavishyavani AI' },
      { type: 'click', selector: '[data-demo="summon-bhavishyavani"]', delayMs: 2500, label: 'Launching AI Copilot' },
    ]
  },
  {
    id: 'executive-summary',
    stepNumber: 12,
    title: 'Platform Summary',
    subtitle: 'Bhavora — Urban Intelligence OS',
    route: '/overview',
    durationMs: 12000,
    voiceText: 'Bhavora recommends metro expansion, eastern grid reinforcement, and water resilience. Projected savings: 4200 crores.',
    narrationDetail: 'Demo complete. Bhavora recommends: Metro Phase 3 acceleration, Eastern Grid Reinforcement and BWSSB NE Water Pipeline. Combined 5-year projected savings: ₹4,200 Cr. City Health target: 89/100 by 2028.',
    spotlight: 'Complete platform demonstrated — 12 modules in under 3 minutes',
    interactions: [
      { type: 'highlight', selector: '[data-demo="metric-city-health"]', delayMs: 2000, label: 'City Health improving to 89/100' },
      { type: 'pulse-all', selector: '[data-demo="metric-city-health"]', delayMs: 4000, label: '' },
    ]
  }
];

export const TOTAL_DEMO_DURATION_MS = DEMO_TIMELINE.reduce((sum, step) => sum + step.durationMs, 0);
