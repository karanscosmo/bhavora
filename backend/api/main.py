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
    evAdoption: float
    populationGrowth: float
    industrialExpansion: float
    metroExpansion: float
    renewableEnergyGrowth: float
    climateEvent: str
    disasterEvent: str

@app.get("/")
def read_root():
    return {"status": "Bhavora Core Engine is running."}

@app.post("/simulate")
def run_simulation(inputs: ScenarioInputs):
    # Deterministic simulation engine based on actual rules (not random)
    # Example logic mapping inputs to impacts
    
    # Base load assumption (GW)
    base_energy = 4.2 
    
    # Impacts
    energy_impact = (inputs.evAdoption * 0.15) + (inputs.populationGrowth * 0.4) + (inputs.industrialExpansion * 0.6) - (inputs.renewableEnergyGrowth * 0.2)
    carbon_impact = (inputs.industrialExpansion * 0.8) + (inputs.populationGrowth * 0.3) - (inputs.evAdoption * 0.4) - (inputs.renewableEnergyGrowth * 0.5)
    traffic_impact = (inputs.populationGrowth * 0.5) - (inputs.metroExpansion * 0.6) - (inputs.evAdoption * 0.05)
    water_impact = (inputs.populationGrowth * 0.4) + (inputs.industrialExpansion * 0.3)
    employment_impact = (inputs.industrialExpansion * 0.5) + (inputs.metroExpansion * 0.2)
    
    # Stress score (0-100)
    infra_stress = 30 + (energy_impact * 2) + (traffic_impact * 1.5) + (water_impact * 2)
    
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
    # Return mock real district data until DB is hooked up
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
