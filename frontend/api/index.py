from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Bhavora V3 Simulation Engine", description="AI Decision Twin for Cities")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScenarioInputs(BaseModel):
    # camelCase inputs
    evAdoption: float | None = None
    populationGrowth: float | None = None
    industrialExpansion: float | None = None
    metroExpansion: float | None = None
    renewableEnergyGrowth: float | None = None
    climateEvent: str | None = "None"
    disasterEvent: str | None = "None"
    
    # snake_case inputs
    ev_adoption_rate: float | None = None
    population_growth: float | None = None
    new_industrial_parks: float | None = None
    new_metro_lines: float | None = None
    time_horizon_years: int | None = None

@app.get("/")
def read_root():
    return {"status": "Bhavora Core Engine is running."}

@app.post("/simulate")
def run_simulation(inputs: ScenarioInputs):
    # Resolve parameter overrides between camelCase and snake_case
    ev_val = inputs.evAdoption if inputs.evAdoption is not None else (inputs.ev_adoption_rate * 100 if inputs.ev_adoption_rate is not None else 45.0)
    pop_val = inputs.populationGrowth if inputs.populationGrowth is not None else (inputs.population_growth * 100 if inputs.population_growth is not None else 12.0)
    ind_val = inputs.industrialExpansion if inputs.industrialExpansion is not None else (inputs.new_industrial_parks if inputs.new_industrial_parks is not None else 4.0)
    metro_val = inputs.metroExpansion if inputs.metroExpansion is not None else (inputs.new_metro_lines if inputs.new_metro_lines is not None else 2.0)
    renew_val = inputs.renewableEnergyGrowth if inputs.renewableEnergyGrowth is not None else 25.0
    climate = inputs.climateEvent if inputs.climateEvent is not None else "None"
    disaster = inputs.disasterEvent if inputs.disasterEvent is not None else "None"

    # Base load assumption (GW)
    base_energy = 4.2 
    
    # Mathematical impacts (weighted logic)
    energy_impact = (ev_val * 0.15) + (pop_val * 0.4) + (ind_val * 0.6) - (renew_val * 0.2)
    carbon_impact = (ind_val * 0.8) + (pop_val * 0.3) - (ev_val * 0.4) - (renew_val * 0.5)
    traffic_impact = (pop_val * 0.5) - (metro_val * 0.6) - (ev_val * 0.05)
    water_impact = (pop_val * 0.4) + (ind_val * 0.3)
    employment_impact = (ind_val * 0.5) + (metro_val * 0.2)
    
    # Stress score (0-100)
    infra_stress = 30 + (energy_impact * 2) + (traffic_impact * 1.5) + (water_impact * 2)
    
    # Add adjustments based on hazards
    if climate == "100-Year Flood":
        traffic_impact += 25.0
        infra_stress += 20.0
    if disaster == "Substation Failure":
        energy_impact += 12.0
        infra_stress += 15.0

    # AI recommendations based on calculated values
    recommendations = []
    if energy_impact > 15:
        recommendations.append("High energy demand projected. Recommend building 11 new substations in North Bengaluru by 2028.")
    if water_impact > 10:
        recommendations.append("Water stress risk expected in eastern zones by 2032. Accelerate the Cauvery Stage V phase.")
    if traffic_impact < 0:
        recommendations.append(f"Metro expansion is effectively reducing congestion by {abs(round(traffic_impact))}%. Consider accelerating Phase 3.")
    
    if not recommendations:
        recommendations.append("Current infrastructure is equipped to handle the projected growth. Focus on maintenance.")

    return {
        "metrics": {
            "energyDemand": round(energy_impact, 1),
            "carbonEmissions": round(carbon_impact, 1),
            "trafficCongestion": round(traffic_impact, 1),
            "waterDemand": round(water_impact, 1),
            "jobsCreated": round(employment_impact, 1),
            "infrastructureStress": min(100, max(0, round(infra_stress, 1)))
        },
        "recommendations": recommendations,
        "timeline": [
            {"year": 2025, "energy": base_energy + (energy_impact * 0.1), "traffic": 100 + (traffic_impact * 0.1)},
            {"year": 2027, "energy": base_energy + (energy_impact * 0.3), "traffic": 100 + (traffic_impact * 0.3)},
            {"year": 2030, "energy": base_energy + (energy_impact * 0.6), "traffic": 100 + (traffic_impact * 0.6)},
            {"year": 2035, "energy": base_energy + energy_impact, "traffic": 100 + traffic_impact},
        ]
    }

@app.get("/districts")
def get_districts():
    return {
        "districts": [
            {"id": "whitefield", "name": "Whitefield", "population": 250000, "trafficScore": 85, "waterDemand": 90, "energyDemand": 95, "employmentIndex": 88, "growthIndex": 12, "riskIndex": 65},
            {"id": "electronic_city", "name": "Electronic City", "population": 180000, "trafficScore": 75, "waterDemand": 70, "energyDemand": 85, "employmentIndex": 92, "growthIndex": 15, "riskIndex": 40},
            {"id": "koramangala", "name": "Koramangala", "population": 150000, "trafficScore": 92, "waterDemand": 88, "energyDemand": 75, "employmentIndex": 80, "growthIndex": 5, "riskIndex": 30},
            {"id": "hebbal", "name": "Hebbal", "population": 120000, "trafficScore": 65, "waterDemand": 60, "energyDemand": 60, "employmentIndex": 70, "growthIndex": 18, "riskIndex": 50},
            {"id": "indiranagar", "name": "Indiranagar", "population": 110000, "trafficScore": 88, "waterDemand": 75, "energyDemand": 70, "employmentIndex": 85, "growthIndex": 4, "riskIndex": 25},
            {"id": "hsr_layout", "name": "HSR Layout", "population": 140000, "trafficScore": 80, "waterDemand": 82, "energyDemand": 78, "employmentIndex": 86, "growthIndex": 8, "riskIndex": 35},
            {"id": "jayanagar", "name": "Jayanagar", "population": 200000, "trafficScore": 70, "waterDemand": 85, "energyDemand": 65, "employmentIndex": 75, "growthIndex": 3, "riskIndex": 20},
            {"id": "yelahanka", "name": "Yelahanka", "population": 160000, "trafficScore": 55, "waterDemand": 50, "energyDemand": 55, "employmentIndex": 65, "growthIndex": 22, "riskIndex": 45},
        ]
    }
