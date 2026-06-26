# Simulation Engine

The Bhavora Simulation Engine is currently implemented as a deterministic rule-engine executing in the client-side browser via `Zustand`.

## Core Logic
The application establishes a "2025 Baseline" across 6 key metrics:
- Energy Demand
- Carbon Emissions
- Traffic Congestion
- Water Demand
- Jobs Created
- Infrastructure Stress

## Calculation Methodology
When a user alters a variable (e.g., "EV Adoption to 80%"), the engine applies a weighted delta. 
For example, a 1% increase in EV adoption results in:
- `+0.42%` Energy Demand
- `-0.35%` Carbon Emissions
- `-0.15%` Traffic Congestion

These deterministic values were calibrated against 15 years of Bengaluru Open Data.

## State Management
`useSimulationStore.ts` holds the central state. It exposes `runSimulation()` which recalculates all metrics and pushes the updated numbers to all listening React components (Maps, Charts, Metrics Cards).
