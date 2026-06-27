const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../apps/web/src/store/useSimulationStore.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newRunSimulation = `      runSimulation: async (customInputs) => {
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
          recs.push(\`Metro expansion is effectively reducing congestion by \${Math.abs(localMetrics.trafficCongestion)}%. Consider accelerating Phase 3.\`);
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
        const name = customInputs?.name ?? \`Scenario-EV-\${ev}-Pop-\${pop}\`;
        
        const newScenario: SavedScenario = {
          id: \`custom-\${randId}\`,
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
      }`;

const before = content.substring(0, content.indexOf('runSimulation: async'));
const after = content.substring(content.lastIndexOf('}') + 1); // wait, that's not precise enough.
const afterRegex = content.match(/    \}\),\n    \{\n      name: 'bhavora-simulation-store'/);
const cleanAfter = afterRegex ? content.substring(afterRegex.index) : content;

const newContent = before + newRunSimulation + '\n' + cleanAfter;

fs.writeFileSync(filePath, newContent);
console.log('Fixed useSimulationStore.ts');
