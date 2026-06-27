/**
 * BHAVORA V3 — ZUSTAND STORE SYSTEM
 * All stores in one file for simplicity; split into separate files as needed.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  PolicyInput, SimulationResult, TimelineState,
  DEFAULT_POLICY, computeSimulation, projectTimeline,
  seededRand, generateSeededMetrics,
} from '@/lib/simulation';

// =====================================================================
// TYPES
// =====================================================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  read: boolean;
  path?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tags: string[];
  status: 'draft' | 'simulated' | 'approved' | 'archived';
  policies: PolicyInput;
  results: SimulationResult;
  timeline: TimelineState[];
  notes: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  chartData?: unknown;
  actions?: { label: string; path: string }[];
}

export interface AgentConversation {
  agentId: string;
  messages: AgentMessage[];
  lastUpdated: Date;
}

export interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  count: number;
  icon: string;
}

// =====================================================================
// APP STORE
// =====================================================================

interface AppState {
  notifications: Notification[];
  toasts: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  dismissToast: (id: string) => void;
  unreadCount: () => number;
}

export const useAppStore = create<AppState>()((set, get) => ({
  notifications: [
    { id: 'n1', title: 'Grid Warning', message: 'Electronic City substation at 91% capacity', severity: 'critical', timestamp: new Date(), read: false, path: '/disaster' },
    { id: 'n2', title: 'Traffic Alert', message: 'Silk Board corridor speed below 8 km/h', severity: 'warning', timestamp: new Date(), read: false, path: '/overview' },
    { id: 'n3', title: 'Metro Update', message: 'Metro Line 6 Phase 1 construction on schedule', severity: 'info', timestamp: new Date(), read: true, path: '/cities' },
  ],
  toasts: [],
  addNotification: (n) => {
    const notification: Notification = {
      ...n,
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    set(state => ({
      notifications: [notification, ...state.notifications].slice(0, 100),
      toasts: [notification, ...state.toasts].slice(0, 5),
    }));
  },
  markRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  dismissToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id),
  })),
  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));

// =====================================================================
// CITY DATA STORE (live metrics)
// =====================================================================

interface CityMetrics {
  congestionIndex: number;
  aqi: number;
  gridLoad: number;  // GW
  waterDemand: number; // MLD
  activeIncidents: number;
  metroPunctuality: number; // %
  cityHealthScore: number;
  lastUpdated: Date;
}

interface CityDataState {
  metrics: CityMetrics;
  historicalData: {
    traffic: number[];
    aqi: number[];
    energy: number[];
    water: number[];
  };
  refreshMetrics: () => void;
}

const rand67 = seededRand(67);
const rand142 = seededRand(142);
const rand41 = seededRand(41);
const rand18 = seededRand(18);

export const useCityDataStore = create<CityDataState>()((set) => ({
  metrics: {
    congestionIndex: 67,
    aqi: 142,
    gridLoad: 4.1,
    waterDemand: 1800,
    activeIncidents: 3,
    metroPunctuality: 91,
    cityHealthScore: 64,
    lastUpdated: new Date(),
  },
  historicalData: {
    traffic: generateSeededMetrics(1001, 24, 67, 12),
    aqi: generateSeededMetrics(1002, 24, 142, 20),
    energy: generateSeededMetrics(1003, 24, 4.1, 0.4),
    water: generateSeededMetrics(1004, 24, 1800, 80),
  },
  refreshMetrics: () => {
    const t = Date.now() / 1000;
    set(state => ({
      metrics: {
        congestionIndex: Math.round(60 + Math.sin(t / 900) * 12),
        aqi: Math.round(135 + Math.cos(t / 1200) * 18),
        gridLoad: parseFloat((4.0 + Math.sin(t / 720) * 0.35).toFixed(1)),
        waterDemand: Math.round(1780 + Math.cos(t / 1080) * 90),
        activeIncidents: Math.max(0, Math.round(2.5 + Math.sin(t / 1500) * 2)),
        metroPunctuality: Math.round(88 + Math.sin(t / 600) * 5),
        cityHealthScore: Math.round(62 + Math.sin(t / 800) * 5),
        lastUpdated: new Date(),
      },
      historicalData: state.historicalData,
    }));
  },
}));

// =====================================================================
// SIMULATION STORE
// =====================================================================

interface SimulationState {
  activePolicy: PolicyInput;
  results: SimulationResult;
  timeline: TimelineState[];
  activeYear: number;
  isComputing: boolean;
  activeScenarioName: string | null;
  setPolicy: (policy: Partial<PolicyInput>) => void;
  setYear: (year: number) => void;
  setActiveScenario: (name: string | null) => void;
  recompute: () => void;
}

const initialPolicy = DEFAULT_POLICY;
const initialResults = computeSimulation(initialPolicy);
const initialTimeline = projectTimeline(initialPolicy);

export const useSimulationStore = create<SimulationState>()((set, get) => ({
  activePolicy: initialPolicy,
  results: initialResults,
  timeline: initialTimeline,
  activeYear: 2025,
  isComputing: false,
  activeScenarioName: null,

  setPolicy: (patch) => {
    const newPolicy = { ...get().activePolicy, ...patch };
    set({ isComputing: true });
    // Debounced recompute
    setTimeout(() => {
      const results = computeSimulation(newPolicy);
      const timeline = projectTimeline(newPolicy);
      set({ activePolicy: newPolicy, results, timeline, isComputing: false });
    }, 250);
  },

  setYear: (year) => set({ activeYear: year }),
  setActiveScenario: (name) => set({ activeScenarioName: name }),
  recompute: () => {
    const results = computeSimulation(get().activePolicy);
    const timeline = projectTimeline(get().activePolicy);
    set({ results, timeline });
  },

  // Legacy compatibility properties
  metrics: {
    get trafficCongestion() { return useSimulationStore.getState().results.traffic.delta; },
    get energyDemand() { return useSimulationStore.getState().results.energy.delta; },
    get carbonEmissions() { return useSimulationStore.getState().results.co2.delta; },
    get waterDemand() { return useSimulationStore.getState().results.water.delta; },
  },
  popGrowth: 15,
  indExpansion: 50,
  climateEvent: 'None',
  savedScenarios: [] as Scenario[],
  loadScenario: (_: Scenario) => {},
}));

// =====================================================================
// SCENARIO STORE
// =====================================================================

interface ScenarioState {
  scenarios: Scenario[];
  compareIds: string[];
  saveScenario: (name: string, description: string, tags: string[], notes: string) => string;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  archiveScenario: (id: string) => void;
  approveScenario: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set, get) => ({
      scenarios: [],
      compareIds: [],

      saveScenario: (name, description, tags, notes) => {
        const sim = useSimulationStore.getState();
        const id = `scenario-${Date.now()}`;
        const scenario: Scenario = {
          id,
          name,
          description,
          createdAt: new Date().toISOString(),
          tags,
          status: 'simulated',
          policies: sim.activePolicy,
          results: sim.results,
          timeline: sim.timeline,
          notes,
        };
        set(state => ({ scenarios: [scenario, ...state.scenarios] }));
        useSimulationStore.getState().setActiveScenario(name);
        return id;
      },

      loadScenario: (id) => {
        const scenario = get().scenarios.find(s => s.id === id);
        if (!scenario) return;
        const sim = useSimulationStore.getState();
        sim.setPolicy(scenario.policies);
        sim.setActiveScenario(scenario.name);
      },

      deleteScenario: (id) => set(state => ({ scenarios: state.scenarios.filter(s => s.id !== id) })),
      archiveScenario: (id) => set(state => ({
        scenarios: state.scenarios.map(s => s.id === id ? { ...s, status: 'archived' as const } : s),
      })),
      approveScenario: (id) => set(state => ({
        scenarios: state.scenarios.map(s => s.id === id ? { ...s, status: 'approved' as const } : s),
      })),
      toggleCompare: (id) => set(state => ({
        compareIds: state.compareIds.includes(id)
          ? state.compareIds.filter(i => i !== id)
          : [...state.compareIds, id].slice(0, 3),
      })),
      clearCompare: () => set({ compareIds: [] }),
    }),
    { name: 'bhavora-scenarios', storage: createJSONStorage(() => localStorage) }
  )
);

// =====================================================================
// DISASTER STORE
// =====================================================================

export interface Incident {
  id: string;
  type: 'flood' | 'fire' | 'power' | 'medical' | 'earthquake' | 'industrial' | 'civil';
  name: string;
  severity: 'critical' | 'major' | 'minor';
  location: string;
  coordinates: [number, number];
  startedAt: Date;
  status: 'active' | 'contained' | 'resolved';
  protocol?: string;
  affectedCount?: number;
}

interface DisasterState {
  activeIncidents: Incident[];
  selectedIncidentId: string | null;
  activeProtocol: string | null;
  responseTimeline: { time: string; action: string; status: 'done' | 'active' | 'pending' }[];
  addIncident: (incident: Omit<Incident, 'id' | 'startedAt' | 'status'>) => void;
  activateProtocol: (protocol: string) => void;
  endIncident: (id: string) => void;
  selectIncident: (id: string | null) => void;
}

export const useDisasterStore = create<DisasterState>()((set, get) => ({
  activeIncidents: [
    {
      id: 'i1',
      type: 'power',
      name: 'Grid Overload — Electronic City',
      severity: 'critical',
      location: 'Electronic City Phase 2',
      coordinates: [77.6592, 12.8409],
      startedAt: new Date(Date.now() - 23 * 60 * 1000),
      status: 'active',
      affectedCount: 14000,
    },
    {
      id: 'i2',
      type: 'flood',
      name: 'Waterlogging — Bellandur',
      severity: 'major',
      location: 'Bellandur Lake Road',
      coordinates: [77.6413, 12.9302],
      startedAt: new Date(Date.now() - 65 * 60 * 1000),
      status: 'active',
      affectedCount: 3200,
    },
  ],
  selectedIncidentId: 'i1',
  activeProtocol: null,
  responseTimeline: [],

  addIncident: (incident) => {
    const newIncident: Incident = {
      ...incident,
      id: `i-${Date.now()}`,
      startedAt: new Date(),
      status: 'active',
    };
    set(state => ({ activeIncidents: [newIncident, ...state.activeIncidents] }));
  },

  activateProtocol: (protocol) => {
    type TimelineStep = { time: string; action: string; status: 'done' | 'active' | 'pending' };
    const floodTimeline: TimelineStep[] = [
      { time: 'T+0', action: 'Incident detected and logged', status: 'done' },
      { time: 'T+5min', action: 'Flood Response Protocol activated', status: 'done' },
      { time: 'T+15min', action: 'BBMP Drainage teams dispatched', status: 'active' },
      { time: 'T+30min', action: 'Traffic diversion routes activated', status: 'pending' },
      { time: 'T+1hr', action: 'Pumping stations at full capacity', status: 'pending' },
      { time: 'T+2hr', action: 'Evacuation complete — target zones', status: 'pending' },
      { time: 'T+4hr', action: 'Situation assessment and reporting', status: 'pending' },
    ];
    set({ activeProtocol: protocol, responseTimeline: floodTimeline });
  },

  endIncident: (id) => set(state => ({
    activeIncidents: state.activeIncidents.map(i => i.id === id ? { ...i, status: 'resolved' as const } : i),
    activeProtocol: null,
    responseTimeline: [],
  })),

  selectIncident: (id) => set({ selectedIncidentId: id }),
}));

// =====================================================================
// UI STORE
// =====================================================================

interface UIState {
  isTakeActionOpen: boolean;
  isAgentHubOpen: boolean;
  activeAgentId: string;
  isExplainOpen: boolean;
  explainContext: string | null;
  isSaveScenarioOpen: boolean;
  selectedMapAsset: string | null;
  openTakeAction: () => void;
  closeTakeAction: () => void;
  openAgentHub: (agentId?: string) => void;
  closeAgentHub: () => void;
  openExplain: (context: string) => void;
  closeExplain: () => void;
  openSaveScenario: () => void;
  closeSaveScenario: () => void;
  setSelectedMapAsset: (id: string | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isTakeActionOpen: false,
  isAgentHubOpen: false,
  activeAgentId: 'executive',
  isExplainOpen: false,
  explainContext: null,
  isSaveScenarioOpen: false,
  selectedMapAsset: null,

  openTakeAction: () => set({ isTakeActionOpen: true }),
  closeTakeAction: () => set({ isTakeActionOpen: false }),
  openAgentHub: (agentId) => set({ isAgentHubOpen: true, activeAgentId: agentId || 'executive' }),
  closeAgentHub: () => set({ isAgentHubOpen: false }),
  openExplain: (context) => set({ isExplainOpen: true, explainContext: context }),
  closeExplain: () => set({ isExplainOpen: false, explainContext: null }),
  openSaveScenario: () => set({ isSaveScenarioOpen: true }),
  closeSaveScenario: () => set({ isSaveScenarioOpen: false }),
  setSelectedMapAsset: (id) => set({ selectedMapAsset: id }),
}));

// =====================================================================
// MAP STORE
// =====================================================================

interface MapState {
  layers: MapLayer[];
  toggleLayer: (id: string) => void;
  layerOpacity: number;
  setLayerOpacity: (v: number) => void;
  activeBasemap: 'light' | 'dark' | 'satellite';
  setBasemap: (b: 'light' | 'dark' | 'satellite') => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      layers: [
        { id: 'metro-stations', name: 'Metro Stations', enabled: true, count: 47, icon: 'train' },
        { id: 'metro-routes', name: 'Metro Routes', enabled: true, count: 6, icon: 'route' },
        { id: 'ev-stations', name: 'EV Charging', enabled: false, count: 650, icon: 'zap' },
        { id: 'bus-depots', name: 'Bus Depots', enabled: false, count: 38, icon: 'bus' },
        { id: 'hospitals', name: 'Hospitals', enabled: true, count: 124, icon: 'hospital' },
        { id: 'industrial', name: 'Industrial Zones', enabled: false, count: 18, icon: 'factory' },
        { id: 'tech-parks', name: 'Tech Parks', enabled: true, count: 12, icon: 'laptop' },
        { id: 'flood-zones', name: 'Flood Zones', enabled: false, count: 34, icon: 'waves' },
        { id: 'substations', name: 'Substations', enabled: true, count: 47, icon: 'plug' },
        { id: 'lakes', name: 'Lakes & Reservoirs', enabled: true, count: 189, icon: 'droplet' },
      ],
      layerOpacity: 80,
      activeBasemap: 'dark',

      toggleLayer: (id) => set(state => ({
        layers: state.layers.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l),
      })),
      setLayerOpacity: (v) => set({ layerOpacity: v }),
      setBasemap: (b) => set({ activeBasemap: b }),
    }),
    { name: 'bhavora-map-layers', storage: createJSONStorage(() => localStorage) }
  )
);

// =====================================================================
// AGENT STORE
// =====================================================================

export const AGENTS = {
  urban: {
    id: 'urban',
    name: 'Urban Planner',
    domain: 'Zoning · Metro · Land Use',
    color: '#7C3AED',
    icon: 'building',
    quickActions: ['Optimal metro corridor', 'High-density zones', 'Whitefield density', 'Zoning recommendations'],
  },
  disaster: {
    id: 'disaster',
    name: 'Disaster Response',
    domain: 'Floods · Emergency · Evacuation',
    color: '#EF4444',
    icon: 'alert-triangle',
    quickActions: ['Monsoon flood risk', 'Evacuation plan', 'Bellandur risk score', 'Emergency resources'],
  },
  sustainability: {
    id: 'sustainability',
    name: 'Sustainability',
    domain: 'Carbon · Water · Air Quality',
    color: '#10B981',
    icon: 'leaf',
    quickActions: ['Carbon neutrality path', 'Water stress forecast', 'AQI improvement plan', 'Renewable strategy'],
  },
  infrastructure: {
    id: 'infrastructure',
    name: 'Infrastructure',
    domain: 'Power Grid · EV · Roads',
    color: '#F59E0B',
    icon: 'settings',
    quickActions: ['Substation overload risk', 'EV station placement', 'Grid maintenance priority', 'Road network gaps'],
  },
  executive: {
    id: 'executive',
    name: 'Executive Agent',
    domain: 'Briefings · Strategy · Synthesis',
    color: '#00D4FF',
    icon: 'target',
    quickActions: ['Board briefing', 'Top 3 investments', 'Metro Line 4 impact', 'Quarterly summary'],
  },
} as const;

export type AgentId = keyof typeof AGENTS;

interface AgentState {
  conversations: Record<AgentId, AgentMessage[]>;
  isLoading: boolean;
  addMessage: (agentId: AgentId, message: AgentMessage) => void;
  clearConversation: (agentId: AgentId) => void;
  setLoading: (v: boolean) => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      conversations: { urban: [], disaster: [], sustainability: [], infrastructure: [], executive: [] },
      isLoading: false,

      addMessage: (agentId, message) => set(state => ({
        conversations: {
          ...state.conversations,
          [agentId]: [...(state.conversations[agentId] || []), message],
        },
      })),

      clearConversation: (agentId) => set(state => ({
        conversations: { ...state.conversations, [agentId]: [] },
      })),

      setLoading: (v) => set({ isLoading: v }),
    }),
    { name: 'bhavora-agent-history', storage: createJSONStorage(() => localStorage) }
  )
);
