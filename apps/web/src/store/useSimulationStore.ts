import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedScenario {
  id: string;
  name: string;
  creator: string;
  date: string;
  version: string;
  inputs: {
    evAdoption: number;
    popGrowth: number;
    indExpansion: number;
    metroExpansion: number;
    renewableGrowth: number;
    climateEvent: string;
    disasterEvent: string;
  };
  metrics: {
    energyDemand: number;
    carbonEmissions: number;
    trafficCongestion: number;
    waterDemand: number;
    jobsCreated: number;
    infrastructureStress: number;
  };
}

interface SimulationStore {
  // Inputs
  evAdoption: number;
  popGrowth: number;
  indExpansion: number;
  metroExpansion: number;
  renewableGrowth: number;
  climateEvent: string;
  disasterEvent: string;

  // Status
  isSimulating: boolean;

  // Outputs
  metrics: {
    energyDemand: number;
    carbonEmissions: number;
    trafficCongestion: number;
    waterDemand: number;
    jobsCreated: number;
    infrastructureStress: number;
  };
  recommendations: string[];
  timeline: Array<{
    year: number;
    energy: number;
    traffic: number;
  }>;

  // Library
  savedScenarios: SavedScenario[];

  // Actions
  setInputs: (inputs: Partial<{
    evAdoption: number;
    popGrowth: number;
    indExpansion: number;
    metroExpansion: number;
    renewableGrowth: number;
    climateEvent: string;
    disasterEvent: string;
  }>) => void;
  runSimulation: (customInputs?: Partial<{
    evAdoption: number;
    popGrowth: number;
    indExpansion: number;
    metroExpansion: number;
    renewableGrowth: number;
    climateEvent: string;
    disasterEvent: string;
    name?: string;
  }>) => Promise<{
    metrics: {
      energyDemand: number;
      carbonEmissions: number;
      trafficCongestion: number;
      waterDemand: number;
      jobsCreated: number;
      infrastructureStress: number;
    };
    recommendations: string[];
    timeline: Array<{
      year: number;
      energy: number;
      traffic: number;
    }>;
  }>;
  loadScenario: (scenario: SavedScenario) => void;
  deleteScenario: (id: string) => void;
  saveScenario: (name: string, creator: string, inputs: SavedScenario['inputs'], metrics: SavedScenario['metrics']) => void;
}

const defaultPresets: SavedScenario[] = [
  {
    id: "preset-ev-2035",
    name: "EV Revolution 2035",
    creator: "System Plan",
    date: "2026-06-26 18:20",
    version: "v3.0.4",
    inputs: { evAdoption: 80, popGrowth: 12, indExpansion: 4, metroExpansion: 2, renewableGrowth: 60, climateEvent: "None", disasterEvent: "None" },
    metrics: { energyDemand: 24.2, carbonEmissions: -18.4, trafficCongestion: -12.2, waterDemand: 4.8, jobsCreated: 14.0, infrastructureStress: 68.0 }
  },
  {
    id: "preset-tech-boom",
    name: "North Corridor Tech Boom",
    creator: "BBMP Dev Cluster",
    date: "2026-06-25 10:14",
    version: "v2.8.1",
    inputs: { evAdoption: 30, popGrowth: 25, indExpansion: 12, metroExpansion: 4, renewableGrowth: 35, climateEvent: "None", disasterEvent: "None" },
    metrics: { energyDemand: 38.5, carbonEmissions: 22.0, trafficCongestion: 18.2, waterDemand: 18.6, jobsCreated: 32.4, infrastructureStress: 84.5 }
  },
  {
    id: "preset-extreme-monsoon",
    name: "Extreme Monsoon Resilience",
    creator: "Urban Disaster Cell",
    date: "2026-06-24 16:45",
    version: "v3.0.0",
    inputs: { evAdoption: 45, popGrowth: 12, indExpansion: 4, metroExpansion: 2, renewableGrowth: 25, climateEvent: "100-Year Flood", disasterEvent: "Substation Failure" },
    metrics: { energyDemand: 14.8, carbonEmissions: -4.2, trafficCongestion: 32.5, waterDemand: 6.2, jobsCreated: 8.5, infrastructureStress: 92.2 }
  }
];

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      // Default Inputs
      evAdoption: 45,
      popGrowth: 12,
      indExpansion: 4,
      metroExpansion: 2,
      renewableGrowth: 25,
      climateEvent: "None",
      disasterEvent: "None",

      isSimulating: false,

      // Default Outputs
      metrics: {
        energyDemand: 24.0,
        carbonEmissions: -18.0,
        trafficCongestion: -12.0,
        waterDemand: 4.8,
        jobsCreated: 14.0,
        infrastructureStress: 68.0
      },
      recommendations: [
        "Power grid levels stable. Focus solar storage additions near industrial nodes.",
        "Metro expansion is effectively reducing congestion. Consider accelerating Phase 3."
      ],
      timeline: [
        { year: 2025, energy: 4.2, traffic: 100 },
        { year: 2027, energy: 4.6, traffic: 97 },
        { year: 2030, energy: 5.1, traffic: 93 },
        { year: 2035, energy: 5.6, traffic: 88 }
      ],

      savedScenarios: defaultPresets,

      setInputs: (newInputs) => set(newInputs),

      loadScenario: (scen) => {
        set({
          evAdoption: scen.inputs.evAdoption,
          popGrowth: scen.inputs.popGrowth,
          indExpansion: scen.inputs.indExpansion,
          metroExpansion: scen.inputs.metroExpansion,
          renewableGrowth: scen.inputs.renewableGrowth,
          climateEvent: scen.inputs.climateEvent,
          disasterEvent: scen.inputs.disasterEvent,
          metrics: scen.metrics,
          recommendations: [
            `Loaded from scenario library: ${scen.name}. Policy parameters calibrated successfully.`,
            scen.metrics.energyDemand > 30 ? "Energy demand remains high. Grid stabilization buffers are active." : "Grid load levels normal."
          ],
          timeline: [
            { year: 2025, energy: 4.2, traffic: 100 },
            { year: 2027, energy: 4.2 + (scen.metrics.energyDemand * 0.05), traffic: 100 + (scen.metrics.trafficCongestion * 0.05) },
            { year: 2030, energy: 4.2 + (scen.metrics.energyDemand * 0.15), traffic: 100 + (scen.metrics.trafficCongestion * 0.15) },
            { year: 2035, energy: 4.2 + (scen.metrics.energyDemand * 0.3), traffic: 100 + (scen.metrics.trafficCongestion * 0.3) }
          ]
        });
      },

      deleteScenario: (id) => {
        set(state => ({
          savedScenarios: state.savedScenarios.filter(x => x.id !== id)
        }));
      },

      saveScenario: (name, creator, inputs, metrics) => {
        const now = new Date();
        const dateStr = now.toISOString().replace('T', ' ').slice(0, 16);
        const randId = Math.random().toString(36).substring(2, 9);
        
        const newScenario: SavedScenario = {
          id: `custom-${randId}`,
          name: name,
          creator: creator,
          date: dateStr,
          version: "v3.0.5",
          inputs: inputs,
          metrics: metrics
        };

        set(state => ({
          savedScenarios: [newScenario, ...state.savedScenarios]
        }));
      },

            runSimulation: async (customInputs) => {
        set({ isSimulating: true });
        
        // Grab either parameters passed or current store state
        const ev = customInputs?.evAdoption ?? get().evAdoption;
        const pop = customInputs?.popGrowth ?? get().popGrowth;
        const ind = customInputs?.indExpansion ?? get().indExpansion;
        const metro = customInputs?.metroExpansion ?? get().metroExpansion;
        const renew = customInputs?.renewableGrowth ?? get().renewableGrowth;
        const climate = customInputs?.climateEvent ?? get().climateEvent;
        const disaster = customInputs?.disasterEvent ?? get().disasterEvent;

        // --- NEW DEPENDENCY-BASED SIMULATION ENGINE ---
        // 1. Base Demands from raw growth
        const popFactor = pop;
        const indFactor = ind;
        const metroFactor = metro;
        const evFactor = ev;
        const renewFactor = renew;

        let water_impact = (popFactor * 1.2) + (indFactor * 1.8);
        let base_traffic = (popFactor * 1.5) + (indFactor * 0.8);

        // 2. Metro directly relieves traffic, EV relieves slight congestion
        let traffic_impact = base_traffic - (metroFactor * 3.0) - (evFactor * 0.1);

        // 3. Energy demand
        let energy_impact = (popFactor * 0.8) + (indFactor * 2.5) + (evFactor * 0.9) - (renewFactor * 0.4);

        // 4. Carbon
        let carbon_impact = (indFactor * 1.5) + (traffic_impact * 0.6) - (evFactor * 0.8) - (renewFactor * 1.2);

        // 5. Employment
        let employment_impact = (indFactor * 2.0) + (metroFactor * 1.5) + (renewFactor * 0.8);

        // 6. Infrastructure Stress
        let infra_stress = 35 + (energy_impact * 1.2) + (water_impact * 1.5) + (traffic_impact * 0.8);

        if (climate === "100-Year Flood") {
          infra_stress += 25;
          traffic_impact += 30; 
          water_impact -= 5;
        } else if (climate === "Severe Drought") {
          water_impact += 40; 
          carbon_impact += 5; 
        }

        if (disaster === "Substation Failure") {
          infra_stress += 15;
          energy_impact -= 10;
          traffic_impact += 15;
        } else if (disaster === "Cyber Attack (Grid)") {
          infra_stress += 35;
          energy_impact = 0; 
        }

        const roundVal = (v: number, dec: number) => {
          return Number(Math.round(Number(v + 'e' + dec)) + 'e-' + dec);
        };

        const localMetrics = {
          energyDemand: roundVal(energy_impact, 1),
          carbonEmissions: roundVal(carbon_impact, 1),
          trafficCongestion: roundVal(traffic_impact, 1),
          waterDemand: roundVal(water_impact, 1),
          jobsCreated: roundVal(employment_impact, 1),
          infrastructureStress: Math.min(100, Math.max(0, roundVal(infra_stress, 1)))
        };

        const recs: string[] = [];
        if (localMetrics.energyDemand > 15) {
          recs.push("High energy demand projected. Recommend building 11 new substations in North Bengaluru by 2028.");
        }
        if (localMetrics.waterDemand > 10) {
          recs.push("Water stress risk expected in eastern zones by 2032. Accelerate Cauvery Stage V phase.");
        }
        if (localMetrics.trafficCongestion < 0) {
          recs.push(`Metro expansion is effectively reducing congestion by ${Math.abs(localMetrics.trafficCongestion)}%. Consider accelerating Phase 3.`);
        }
        if (recs.length === 0) {
          recs.push("Current infrastructure is equipped to handle the projected growth. Focus on maintenance.");
        }

        const baseEnergy = 4.2;
        const resultData = {
          metrics: localMetrics,
          recommendations: recs,
          timeline: [
            { year: 2025, energy: baseEnergy + (localMetrics.energyDemand * 0.1), traffic: 100 + (localMetrics.trafficCongestion * 0.1) },
            { year: 2027, energy: baseEnergy + (localMetrics.energyDemand * 0.3), traffic: 100 + (localMetrics.trafficCongestion * 0.3) },
            { year: 2030, energy: baseEnergy + (localMetrics.energyDemand * 0.6), traffic: 100 + (localMetrics.trafficCongestion * 0.6) },
            { year: 2035, energy: baseEnergy + localMetrics.energyDemand, traffic: 100 + localMetrics.trafficCongestion }
          ]
        };

        const now = new Date();
        const dateStr = now.toISOString().replace('T', ' ').slice(0, 16);
        const randId = Math.random().toString(36).substring(2, 9);
        const name = customInputs?.name ?? `Scenario-EV-${ev}-Pop-${pop}`;
        
        const newScenario: SavedScenario = {
          id: `custom-${randId}`,
          name: name,
          creator: "Admin Cluster",
          date: dateStr,
          version: "v3.0.5",
          inputs: { evAdoption: ev, popGrowth: pop, indExpansion: ind, metroExpansion: metro, renewableGrowth: renew, climateEvent: climate, disasterEvent: disaster },
          metrics: resultData.metrics
        };

        set(state => ({
          isSimulating: false,
          evAdoption: ev,
          popGrowth: pop,
          indExpansion: ind,
          metroExpansion: metro,
          renewableGrowth: renew,
          climateEvent: climate,
          disasterEvent: disaster,
          metrics: resultData.metrics,
          recommendations: resultData.recommendations,
          timeline: resultData.timeline,
          savedScenarios: [newScenario, ...state.savedScenarios]
        }));

        return resultData;
      }
    }),
    {
      name: 'bhavora-simulation-store',
      partialize: (state) => ({
        evAdoption: state.evAdoption,
        popGrowth: state.popGrowth,
        indExpansion: state.indExpansion,
        metroExpansion: state.metroExpansion,
        renewableGrowth: state.renewableGrowth,
        climateEvent: state.climateEvent,
        disasterEvent: state.disasterEvent,
        metrics: state.metrics,
        recommendations: state.recommendations,
        timeline: state.timeline,
        savedScenarios: state.savedScenarios
      })
    }
  )
);
