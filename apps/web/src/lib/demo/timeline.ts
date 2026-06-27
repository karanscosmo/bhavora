/**
 * BHAVORA DEMO TIMELINE — 12-STEP AUTOMATED WALKTHROUGH
 * Each step has a route, narration, duration, and actions.
 */

import type { DemoStep } from './types';

export const DEMO_TIMELINE: DemoStep[] = [
  {
    id: 'executive-overview',
    stepNumber: 1,
    title: 'Executive Command Center',
    subtitle: 'Live City Telemetry',
    route: '/overview',
    durationMs: 12000,
    narration: 'Hello. I am Bhavishyavani, Bhavora\'s Predictive Urban Intelligence Copilot.',
    narrationDetail: 'Bhavora continuously monitors Bengaluru\'s city infrastructure and aggregates real-time telemetry from municipal systems — tracking city health, air quality, traffic congestion, power grid load, and active emergency incidents.',
    spotlight: {
      message: 'Live metrics updating from 240+ municipal data streams',
      position: 'bottom',
    }
  },
  {
    id: 'city-twin-gis',
    stepNumber: 2,
    title: 'City Digital Twin GIS',
    subtitle: 'Live Urban Intelligence Layer',
    route: '/cities',
    durationMs: 14000,
    narration: 'Bhavora maintains a live digital twin of Bengaluru.',
    narrationDetail: 'The GIS platform integrates infrastructure, mobility, environmental and demographic datasets into a unified spatial model. Metro corridors, hospital networks, power substations, flood zones and 3D building extrusions are rendered in real time.',
    spotlight: {
      message: 'Interactive city twin — switch between Light, Satellite and Hybrid modes',
      position: 'right',
    }
  },
  {
    id: 'disaster-response',
    stepNumber: 3,
    title: 'Emergency Response Center',
    subtitle: 'Multi-Agency Coordination',
    route: '/disaster',
    durationMs: 12000,
    narration: 'Emergency response teams can visualize incidents in real time.',
    narrationDetail: 'The Emergency Operations Center aggregates active incidents, estimates affected populations within impact radii, and coordinates response asset deployment across BBMP, KSFRS, BESCOM and BWSSB.',
    spotlight: {
      message: 'Active incident tracking with resource allocation',
      position: 'right',
    }
  },
  {
    id: 'decision-twin',
    stepNumber: 4,
    title: 'Decision Twin Engine',
    subtitle: 'Policy Scenario Modeler',
    route: '/decision-twin',
    durationMs: 14000,
    narration: 'Decision Twin enables policymakers to evaluate interventions before committing capital.',
    narrationDetail: 'Policymakers can adjust investment sliders — Metro Expansion, Renewable Grid, Water Infrastructure, Smart Traffic — and see real-time projections of urban outcomes including emission reduction, congestion improvement and GDP impact.',
    spotlight: {
      message: 'Move sliders to model policy impact before deployment',
      position: 'right',
    }
  },
  {
    id: 'run-simulation',
    stepNumber: 5,
    title: 'Bhavora Simulation Engine',
    subtitle: 'Deterministic Forecasting',
    route: '/decision-twin',
    durationMs: 10000,
    narration: 'Bhavora evaluates long-term outcomes using deterministic forecasting models.',
    narrationDetail: 'The simulation engine processes 15 years of Bengaluru municipal data through multi-variable impact equations to generate statistically validated 10-year infrastructure forecasts.',
    spotlight: {
      message: 'Running 10-year simulation across 6 infrastructure domains',
      position: 'bottom',
    }
  },
  {
    id: 'simulation-results',
    stepNumber: 6,
    title: 'Simulation Results',
    subtitle: '10-Year Infrastructure Forecast',
    route: '/simulation-results',
    durationMs: 12000,
    narration: 'Simulation results show projected improvements across all urban domains.',
    narrationDetail: 'Results quantify the impact of policy interventions: traffic reduction, AQI improvement, carbon emission reduction, GDP growth, water demand management and housing capacity. Before vs After comparisons are generated for executive briefings.',
    spotlight: {
      message: 'Before vs After comparison across 6 infrastructure KPIs',
      position: 'bottom',
    }
  },
  {
    id: 'impact-analysis',
    stepNumber: 7,
    title: 'Financial Impact Analysis',
    subtitle: 'Municipal Investment ROI',
    route: '/impact',
    durationMs: 12000,
    narration: 'Investment impact is quantified using financial and operational metrics.',
    narrationDetail: 'The impact module calculates CAPEX requirements, operational savings, payback period and ROI across districts. District-level funding allocation and cash flow projections support budget justification for state and central government grants.',
    spotlight: {
      message: 'District-by-district ROI and investment allocation',
      position: 'bottom',
    }
  },
  {
    id: 'ai-insights',
    stepNumber: 8,
    title: 'Bhavishyavani AI Insights',
    subtitle: 'Predictive Intelligence Briefs',
    route: '/insights',
    durationMs: 12000,
    narration: 'Bhavishyavani continuously generates predictive intelligence briefs.',
    narrationDetail: 'The AI continuously scans urban telemetry to identify emerging risks, optimization opportunities, and policy recommendations. Each insight brief includes evidence chains, confidence intervals, recommended interventions and projected ROI.',
    spotlight: {
      message: 'Auto-generated intelligence briefs with evidence and confidence scores',
      position: 'right',
    }
  },
  {
    id: 'analytics-suite',
    stepNumber: 9,
    title: 'Advanced Analytics Suite',
    subtitle: 'Longitudinal Infrastructure Forecasting',
    route: '/analytics',
    durationMs: 11000,
    narration: 'Advanced analytics provide longitudinal infrastructure forecasting.',
    narrationDetail: 'The analytics engine delivers historical trend analysis, cross-domain correlations, population growth modeling and energy demand forecasting across Bengaluru\'s 27 districts. Heat maps and scatter plots reveal infrastructure stress patterns before they become crises.',
    spotlight: {
      message: 'Cross-domain correlation analysis across 27 districts',
      position: 'bottom',
    }
  },
  {
    id: 'reports',
    stepNumber: 10,
    title: 'Executive Report Generation',
    subtitle: 'Board-Ready Documentation',
    route: '/reports',
    durationMs: 10000,
    narration: 'Board-ready reports can be generated instantly.',
    narrationDetail: 'Bhavora generates structured executive reports for municipal commissioners, state government officials, international development banks and bond rating agencies. Reports include infrastructure audits, simulation outputs and investment proposals.',
    spotlight: {
      message: 'One-click generation of municipal executive reports',
      position: 'right',
    }
  },
  {
    id: 'bhavishyavani-ai',
    stepNumber: 11,
    title: 'Bhavishyavani AI Copilot',
    subtitle: 'Conversational Urban Intelligence',
    route: '/overview',
    durationMs: 14000,
    narration: 'Bhavishyavani is always available for executive-grade urban intelligence queries.',
    narrationDetail: 'Municipal commissioners and decision makers can query Bhavishyavani in natural language — asking about infrastructure priorities, risk assessments, budget recommendations and policy options — receiving AI-generated briefings in seconds.',
    spotlight: {
      message: 'Ask anything about Bengaluru\'s infrastructure',
      position: 'left',
    }
  },
  {
    id: 'executive-summary',
    stepNumber: 12,
    title: 'Executive Summary',
    subtitle: 'Platform Capabilities Overview',
    route: '/overview',
    durationMs: 12000,
    narration: 'Bhavora is ready for deployment.',
    narrationDetail: 'Based on current city conditions, Bhavora recommends: accelerating metro expansion on the Eastern corridor, reinforcing BESCOM grid infrastructure in Whitefield, and investing in BWSSB water resilience across North Bengaluru. Projected 5-year savings: ₹4,200 Cr.',
    spotlight: {
      message: 'Complete platform demonstrated — 12 modules in 3 minutes',
      position: 'center',
    }
  }
];

export const TOTAL_DEMO_DURATION_MS = DEMO_TIMELINE.reduce((sum, step) => sum + step.durationMs, 0);
