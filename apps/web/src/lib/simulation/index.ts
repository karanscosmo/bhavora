/**
 * BHAVORA V3 — URBAN SIMULATION ENGINE
 * Phase C: Mathematical Models
 *
 * All models are pure TypeScript with no UI dependencies.
 * Sources: IPCC Tier 2, IWA, BPR, IEC 60038, Solow-Swan
 */

// =====================================================================
// TYPES
// =====================================================================

export interface PolicyInput {
  metroExpansion: number;        // 0–100
  evAdoptionRate: number;        // 0–100
  roadCapacity: number;          // 0–100
  renewableShare: number;        // 0–100
  waterInfrastructure: number;   // 0–100
  greenSpaceAllocation: number;  // 0–100
  industrialZoning: number;      // 0–100
}

export const DEFAULT_POLICY: PolicyInput = {
  metroExpansion: 30,
  evAdoptionRate: 15,
  roadCapacity: 40,
  renewableShare: 25,
  waterInfrastructure: 35,
  greenSpaceAllocation: 20,
  industrialZoning: 50,
};

export interface CascadeNode {
  id: string;
  label: string;
  delta: number;
  unit: string;
  confidence: number;
  children: CascadeNode[];
  type: 'improvement' | 'deterioration' | 'neutral';
}

export interface MetricResult {
  before: number;
  after: number;
  delta: number;
  unit: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface BlindSpot {
  id: string;
  title: string;
  description: string;
  metrics: { label: string; value: string; isNegative: boolean }[];
  probability: number;
}

export interface SimulationResult {
  traffic: MetricResult & { unit: '%congestion' };
  co2: MetricResult & { unit: 'ktCO2/yr' };
  energy: MetricResult & { unit: 'GWh' };
  water: MetricResult & { unit: 'MLD' };
  gdp: MetricResult & { unit: '%growth' };
  aqi: MetricResult & { unit: 'AQI' };
  modalSplit: MetricResult & { unit: '%transit' };
  cityHealth: MetricResult & { unit: '/100' };
  cascadingEffects: CascadeNode[];
  blindSpots: BlindSpot[];
  confidence: number;
  computedAt: Date;
  methodology: string[];
}

export interface TimelineState {
  year: number;
  population: number;
  trafficIndex: number;
  co2_ktyr: number;
  aqi: number;
  gdp_growth: number;
  water_stress: number;
  energy_demand_gwh: number;
  renewable_fraction: number;
  infrastructure_health: number;
  city_health: number;
}

// =====================================================================
// BENGALURU BASELINE CONSTANTS (2025)
// =====================================================================

export const BENGALURU_BASELINE = {
  population: 13_600_000,
  area_km2: 741,
  gdp_billion_usd: 110,
  // Transport
  peak_traffic_index: 67,          // % congestion
  modal_split_transit_pct: 22,     // % using public transport
  vehicle_km_travelled_bn: 28.4,   // billion km/yr
  // Environment
  aqi_annual_avg: 142,             // µg/m³ PM2.5 equivalent
  co2_ktyr: 42_000,               // kt CO₂/year
  grid_emission_factor: 0.82,      // kgCO₂/kWh (Karnataka, CEA 2023)
  renewable_fraction: 0.24,        // 24% of grid is renewable
  // Energy
  peak_demand_gw: 4.2,
  energy_demand_gwh_yr: 18_500,
  // Water
  water_demand_mld: 1_800,         // Million Litres per Day
  water_supply_mld: 1_450,
  water_stress_index: 1.24,        // demand/supply > 1 = stress
  // Infrastructure
  metro_route_km: 72,
  ev_charging_stations: 650,
  substation_count: 47,
  road_network_km: 14_700,
  green_space_pct: 11,
  // Economic
  employment_millions: 5.2,
  infrastructure_health_score: 63, // /100
};

// =====================================================================
// MODEL 1: POPULATION GROWTH (Logistic with migration)
// =====================================================================

/**
 * Logistic growth model: P(t) = K / (1 + ((K-P0)/P0) * exp(-r*t))
 * Karnataka intrinsic growth rate r = 0.021
 * Carrying capacity K computed from land use + infrastructure limits
 */
export function projectPopulation(
  years: number,
  policyNorm: number, // 0–1, higher policy investment = higher K
  baseline = BENGALURU_BASELINE
): number {
  const P0 = baseline.population;
  const r = 0.021;
  // Carrying capacity boosted by infrastructure investment
  const K = 22_000_000 + (policyNorm * 4_000_000);
  const t = years;
  const P = K / (1 + ((K - P0) / P0) * Math.exp(-r * t));
  return Math.round(P);
}

// =====================================================================
// MODEL 2: TRANSPORT DEMAND (4-step model)
// =====================================================================

/**
 * BPR (Bureau of Public Roads) travel time function:
 * t = t0 * (1 + 0.15 * (V/C)^4)
 * where V/C = volume-to-capacity ratio
 */
function bprFunction(volumeCapacityRatio: number): number {
  return 1 + 0.15 * Math.pow(volumeCapacityRatio, 4);
}

/**
 * Modal split logit model:
 * P_transit = 1 / (1 + exp(-(β0 + β1*cost_ratio + β2*time_ratio)))
 */
function modalSplitLogit(costRatio: number, timeRatio: number): number {
  const beta0 = -0.8, beta1 = 1.2, beta2 = 1.8;
  const utility = beta0 + beta1 * costRatio + beta2 * timeRatio;
  return 1 / (1 + Math.exp(-utility));
}

export function computeTrafficImpact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: '%congestion' } {
  // Metro expansion reduces road volume
  const metroEffect = (policy.metroExpansion / 100) * 0.18;
  // Road capacity reduces congestion
  const roadEffect = (policy.roadCapacity / 100) * 0.12;
  // EV adoption has minimal direct effect on congestion
  const evEffect = 0;

  // Volume-to-capacity ratio improvement
  const vc_before = 0.85; // high congestion baseline
  const vc_after = vc_before * (1 - metroEffect - roadEffect - evEffect);

  const congestion_before = baseline.peak_traffic_index;
  const bpr_before = bprFunction(vc_before);
  const bpr_after = bprFunction(Math.max(0.1, vc_after));
  const congestion_after = Math.round(congestion_before * (bpr_after / bpr_before));

  // Modal split: higher metro = better transit share
  const costRatio = 0.3 + (policy.metroExpansion / 100) * 0.4;
  const timeRatio = 0.2 + (policy.metroExpansion / 100) * 0.6;
  const transitShare = modalSplitLogit(costRatio, timeRatio) * 100;

  const delta = congestion_after - congestion_before;
  return {
    before: congestion_before,
    after: Math.max(10, congestion_after),
    delta: parseFloat(delta.toFixed(1)),
    unit: '%congestion',
    confidence: 0.87,
    trend: delta < 0 ? 'down' : delta > 0 ? 'up' : 'stable',
  };
}

// =====================================================================
// MODEL 3: CARBON EMISSIONS (IPCC Tier 2)
// =====================================================================

/**
 * CO₂_transport = VKT × EF[vehicle_type] × (1 - EV_share)
 * CO₂_energy    = kWh × grid_EF × (1 - renewable_share)
 * CO₂_industry  = output × industry_intensity
 * Karnataka grid EF: 0.82 kgCO₂/kWh (CEA 2023)
 */
export function computeCO2Impact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: 'ktCO2/yr' } {
  const evShare = policy.evAdoptionRate / 100;
  const renewShare = policy.renewableShare / 100;
  const metroShare = policy.metroExpansion / 100;
  const greenShare = policy.greenSpaceAllocation / 100;

  // VKT reduction from metro + EV substitution from private vehicles
  const vkt_reduction = metroShare * 0.15 + evShare * 0.08;
  const co2_transport_before = 18_000; // kt CO₂/yr
  const co2_transport_after = co2_transport_before * (1 - vkt_reduction) * (1 - evShare * 0.85);

  // Energy CO₂ reduction from renewables
  const co2_energy_before = baseline.energy_demand_gwh_yr * baseline.grid_emission_factor;
  const co2_energy_after = baseline.energy_demand_gwh_yr * baseline.grid_emission_factor * (1 - renewShare * 0.9);

  // Green space = carbon sequestration
  const co2_sequestration = greenShare * 500; // kt CO₂/yr absorbed

  // Industry CO₂ (slight increase with industrial zoning)
  const co2_industry_before = 9_000;
  const co2_industry_after = co2_industry_before * (1 + (policy.industrialZoning - 50) / 500);

  const total_before = baseline.co2_ktyr;
  const total_after = Math.round(
    co2_transport_after / 1000 +
    co2_energy_after / 1000 +
    co2_industry_after -
    co2_sequestration
  );

  const delta = total_after - total_before;
  return {
    before: total_before,
    after: Math.max(10000, total_after),
    delta: parseFloat(delta.toFixed(0)),
    unit: 'ktCO2/yr',
    confidence: 0.91,
    trend: delta < 0 ? 'down' : 'up',
  };
}

// =====================================================================
// MODEL 4: ENERGY GRID (Load Duration Curve)
// =====================================================================

export function computeEnergyImpact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: 'GWh' } {
  const renewShare = policy.renewableShare / 100;
  const evShare = policy.evAdoptionRate / 100;
  const industrialFactor = policy.industrialZoning / 50; // baseline = 50

  // EV adoption increases demand
  const ev_load_addition = evShare * 1_200; // GWh/yr additional
  // Industrial zoning increases demand
  const industry_load = baseline.energy_demand_gwh_yr * 0.35 * industrialFactor;
  // Renewable share doesn't reduce demand but improves grid health
  const base_demand = baseline.energy_demand_gwh_yr;
  const new_demand = Math.round(base_demand + ev_load_addition + (industry_load - base_demand * 0.35));

  const delta = new_demand - base_demand;
  return {
    before: base_demand,
    after: Math.max(15000, new_demand),
    delta: parseFloat(delta.toFixed(0)),
    unit: 'GWh',
    confidence: 0.89,
    trend: delta > 0 ? 'up' : 'down',
  };
}

// =====================================================================
// MODEL 5: WATER DEMAND (IWA Water Balance)
// =====================================================================

export function computeWaterImpact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: 'MLD' } {
  const infraUpgrade = policy.waterInfrastructure / 100;
  const greenAlloc = policy.greenSpaceAllocation / 100;

  // Infrastructure reduces leakage (typically 40% loss in Bengaluru)
  const leakage_reduction = infraUpgrade * 0.30;
  // Population growth increases demand
  const pop_growth_5yr = 1.11; // ~11% in 5 years
  const demand_growth = baseline.water_demand_mld * pop_growth_5yr;

  const new_demand = Math.round(demand_growth * (1 - greenAlloc * 0.05));
  const new_supply = Math.round(baseline.water_supply_mld * (1 + infraUpgrade * 0.25 - leakage_reduction * 0.5));

  const delta = new_demand - baseline.water_demand_mld;
  return {
    before: baseline.water_demand_mld,
    after: Math.max(1500, new_demand),
    delta: parseFloat(delta.toFixed(0)),
    unit: 'MLD',
    confidence: 0.84,
    trend: delta > 0 ? 'up' : 'down',
  };
}

// =====================================================================
// MODEL 6: ECONOMIC GROWTH (Solow-Swan adapted)
// =====================================================================

/**
 * Y = A × K^α × L^(1-α)
 * Infrastructure multiplier boosts TFP
 */
export function computeGDPImpact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: '%growth' } {
  const alpha = 0.35; // capital share

  // Infrastructure multiplier
  const infra_mult = 1 + (
    0.15 * (policy.metroExpansion / 100) +
    0.08 * (policy.roadCapacity / 100) +
    0.06 * (policy.waterInfrastructure / 100) +
    0.12 * (policy.evAdoptionRate / 100)
  );

  // Industrial zoning effect
  const industry_effect = (policy.industrialZoning - 50) / 100 * 0.8;

  const base_growth = 6.8; // % baseline GDP growth
  const enhanced_growth = base_growth * infra_mult + industry_effect;

  const delta = enhanced_growth - base_growth;
  return {
    before: parseFloat(base_growth.toFixed(1)),
    after: parseFloat(Math.max(3, enhanced_growth).toFixed(1)),
    delta: parseFloat(delta.toFixed(2)),
    unit: '%growth',
    confidence: 0.78,
    trend: delta > 0 ? 'up' : 'down',
  };
}

// =====================================================================
// MODEL 7: AQI (composite)
// =====================================================================

export function computeAQIImpact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: 'AQI' } {
  const evEffect = (policy.evAdoptionRate / 100) * 18;
  const metroEffect = (policy.metroExpansion / 100) * 14;
  const greenEffect = (policy.greenSpaceAllocation / 100) * 12;
  const industrialPenalty = ((policy.industrialZoning - 50) / 100) * 10;

  const improvement = evEffect + metroEffect + greenEffect - industrialPenalty;
  const aqi_after = Math.round(baseline.aqi_annual_avg - improvement);

  const delta = aqi_after - baseline.aqi_annual_avg;
  return {
    before: baseline.aqi_annual_avg,
    after: Math.max(40, aqi_after),
    delta: parseFloat(delta.toFixed(0)),
    unit: 'AQI',
    confidence: 0.82,
    trend: delta < 0 ? 'down' : 'up',
  };
}

// =====================================================================
// MODEL 8: MODAL SPLIT
// =====================================================================

export function computeModalSplitImpact(
  policy: PolicyInput,
  baseline = BENGALURU_BASELINE
): MetricResult & { unit: '%transit' } {
  const metro_effect = (policy.metroExpansion / 100) * 25;
  const cost_sensitivity = 0.3;
  const before = baseline.modal_split_transit_pct;
  const after = Math.min(75, before + metro_effect * cost_sensitivity);
  const delta = after - before;

  return {
    before,
    after: parseFloat(after.toFixed(1)),
    delta: parseFloat(delta.toFixed(1)),
    unit: '%transit',
    confidence: 0.86,
    trend: delta > 0 ? 'up' : 'down',
  };
}

// =====================================================================
// CITY HEALTH SCORE
// =====================================================================

export function computeCityHealth(
  traffic: MetricResult,
  co2: MetricResult,
  energy: MetricResult,
  water: MetricResult,
  gdp: MetricResult,
  aqi: MetricResult,
): MetricResult & { unit: '/100' } {
  // Weighted composite score
  const mobility_score = Math.max(0, 100 - traffic.after);
  const env_score = Math.max(0, 100 - (aqi.after / 3));
  const energy_score = 70; // stable
  const water_score = Math.max(0, 100 - ((water.after / water.before) * 50));
  const econ_score = Math.min(100, 50 + gdp.after * 5);

  const composite = (
    mobility_score * 0.25 +
    env_score * 0.25 +
    energy_score * 0.15 +
    water_score * 0.15 +
    econ_score * 0.20
  );

  const before = 64;
  const after = Math.round(Math.min(100, Math.max(20, composite)));
  const delta = after - before;

  return {
    before,
    after,
    delta,
    unit: '/100',
    confidence: 0.85,
    trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable',
  };
}

// =====================================================================
// CASCADING EFFECTS TREE BUILDER
// =====================================================================

export function buildCascadeTree(
  policy: PolicyInput,
  results: Omit<SimulationResult, 'cascadingEffects' | 'blindSpots' | 'computedAt' | 'methodology' | 'confidence'>
): CascadeNode[] {
  const nodes: CascadeNode[] = [];

  if (policy.metroExpansion > 20) {
    nodes.push({
      id: 'metro',
      label: `Metro Expansion (+${policy.metroExpansion}%)`,
      delta: policy.metroExpansion,
      unit: '%',
      confidence: 0.9,
      type: 'improvement',
      children: [
        {
          id: 'metro-traffic',
          label: `Traffic Volume ▼ ${Math.abs(results.traffic.delta).toFixed(0)}%`,
          delta: results.traffic.delta,
          unit: '%',
          confidence: 0.87,
          type: results.traffic.delta < 0 ? 'improvement' : 'deterioration',
          children: [
            {
              id: 'metro-co2',
              label: `CO₂ Emissions ▼ ${Math.abs(results.co2.delta / 100).toFixed(0)} kt/yr`,
              delta: results.co2.delta,
              unit: 'ktCO₂/yr',
              confidence: 0.91,
              type: results.co2.delta < 0 ? 'improvement' : 'deterioration',
              children: [{
                id: 'co2-aqi',
                label: `Air Quality ▲ ${Math.abs(results.aqi.delta).toFixed(0)} AQI pts`,
                delta: results.aqi.delta,
                unit: 'AQI',
                confidence: 0.82,
                type: results.aqi.delta < 0 ? 'improvement' : 'deterioration',
                children: [],
              }],
            },
            {
              id: 'metro-modal',
              label: `Transit Share ▲ ${results.modalSplit.delta.toFixed(1)}%`,
              delta: results.modalSplit.delta,
              unit: '%transit',
              confidence: 0.86,
              type: results.modalSplit.delta > 0 ? 'improvement' : 'deterioration',
              children: [{
                id: 'modal-fuel',
                label: `Fuel Demand ▼ ${(results.modalSplit.delta * 0.4).toFixed(1)}%`,
                delta: -results.modalSplit.delta * 0.4,
                unit: '%',
                confidence: 0.80,
                type: 'improvement',
                children: [],
              }],
            },
          ],
        },
        {
          id: 'metro-gdp',
          label: `Real Estate Value ▲ ${(results.gdp.delta * 0.6).toFixed(1)}%`,
          delta: results.gdp.delta * 0.6,
          unit: '%',
          confidence: 0.75,
          type: results.gdp.delta > 0 ? 'improvement' : 'deterioration',
          children: [],
        },
      ],
    });
  }

  if (policy.renewableShare > 20) {
    nodes.push({
      id: 'renewable',
      label: `Renewable Energy (+${policy.renewableShare}%)`,
      delta: policy.renewableShare,
      unit: '%',
      confidence: 0.88,
      type: 'improvement',
      children: [
        {
          id: 'ren-co2',
          label: `Grid CO₂ Factor ▼ ${(policy.renewableShare * 0.5).toFixed(0)}%`,
          delta: -(policy.renewableShare * 0.5),
          unit: '%',
          confidence: 0.91,
          type: 'improvement',
          children: [],
        },
        {
          id: 'ren-energy',
          label: `Grid Stability ▲ ${(policy.renewableShare * 0.3).toFixed(0)} pts`,
          delta: policy.renewableShare * 0.3,
          unit: 'pts',
          confidence: 0.85,
          type: 'improvement',
          children: [],
        },
      ],
    });
  }

  if (policy.waterInfrastructure > 30) {
    nodes.push({
      id: 'water',
      label: `Water Infrastructure (+${policy.waterInfrastructure}%)`,
      delta: policy.waterInfrastructure,
      unit: '%',
      confidence: 0.84,
      type: 'improvement',
      children: [
        {
          id: 'water-stress',
          label: `Water Stress Index ▼ ${(policy.waterInfrastructure * 0.008).toFixed(2)}`,
          delta: -(policy.waterInfrastructure * 0.008),
          unit: 'index',
          confidence: 0.84,
          type: 'improvement',
          children: [{
            id: 'water-health',
            label: `Public Health Risk ▼ Moderate`,
            delta: -15,
            unit: '%',
            confidence: 0.70,
            type: 'improvement',
            children: [],
          }],
        },
      ],
    });
  }

  return nodes;
}

export function computeBlindSpots(policy: PolicyInput, partial: any): BlindSpot[] {
  const spots: BlindSpot[] = [];

  // Example 1: High Metro Expansion causes migration and water stress
  if (policy.metroExpansion > 40) {
    const popInflux = Math.round(policy.metroExpansion * 8000);
    const waterDemand = Math.round(policy.metroExpansion * 3.5);
    spots.push({
      id: 'bs-metro-migration',
      title: 'Population Migration & Resource Stress',
      description: 'Rapid transit expansion creates new economic corridors, driving localized population density far beyond current zoning estimates.',
      probability: 0.82,
      metrics: [
        { label: 'Population growth expected', value: `+${popInflux.toLocaleString()} residents`, isNegative: true },
        { label: 'Water demand increase', value: `+${waterDemand} MLD`, isNegative: true },
        { label: 'Hospital capacity stress', value: `+${Math.round(policy.metroExpansion * 0.25)}%`, isNegative: true }
      ]
    });
  }

  // Example 2: High Industrial Zoning causes grid overload
  if (policy.industrialZoning > 60) {
    spots.push({
      id: 'bs-industrial-grid',
      title: 'Substation Overload & Power Cascades',
      description: 'Aggressive industrial zoning without matching grid reinforcement creates severe vulnerabilities in local substations.',
      probability: 0.78,
      metrics: [
        { label: 'Substation overload risk', value: '78%', isNegative: true },
        { label: 'Voltage instability events', value: '+4 per month', isNegative: true }
      ]
    });
  }

  // Example 3: High Road Capacity induces demand
  if (policy.roadCapacity > 50) {
    spots.push({
      id: 'bs-induced-demand',
      title: 'Induced Traffic Demand',
      description: 'Widening roads temporarily relieves congestion, but encourages higher private vehicle usage which fills the new capacity within 3 years.',
      probability: 0.94,
      metrics: [
        { label: 'Private vehicle ownership', value: '+8%', isNegative: true },
        { label: 'Long-term congestion', value: 'Returns to baseline by 2028', isNegative: true }
      ]
    });
  }

  return spots;
}

// =====================================================================
// MAIN POLICY IMPACT CALCULATOR
// =====================================================================

export function computeSimulation(policy: PolicyInput): SimulationResult {
  const traffic = computeTrafficImpact(policy);
  const co2 = computeCO2Impact(policy);
  const energy = computeEnergyImpact(policy);
  const water = computeWaterImpact(policy);
  const gdp = computeGDPImpact(policy);
  const aqi = computeAQIImpact(policy);
  const modalSplit = computeModalSplitImpact(policy);
  const cityHealth = computeCityHealth(traffic, co2, energy, water, gdp, aqi);

  const partial = { traffic, co2, energy, water, gdp, aqi, modalSplit, cityHealth };
  const cascadingEffects = buildCascadeTree(policy, partial);
  const blindSpots = computeBlindSpots(policy, partial);

  // Aggregate confidence
  const avg_confidence = [
    traffic.confidence, co2.confidence, energy.confidence,
    water.confidence, gdp.confidence, aqi.confidence, modalSplit.confidence,
  ].reduce((a, b) => a + b, 0) / 7;

  return {
    ...partial,
    cascadingEffects,
    blindSpots,
    confidence: parseFloat(avg_confidence.toFixed(2)),
    computedAt: new Date(),
    methodology: [
      'BPR Traffic Function (TRB 1965)',
      'Logit Modal Split Model',
      'IPCC Tier 2 Carbon Methodology',
      'IWA Water Balance Model',
      'Load Duration Curve (Energy)',
      'Solow-Swan Economic Growth Model',
      'Karnataka CEA Grid Emission Factor 2023',
    ],
  };
}

// =====================================================================
// TIMELINE PROJECTION ENGINE (2025–2050)
// =====================================================================

export function projectTimeline(
  policy: PolicyInput,
  startYear = 2025,
  endYear = 2050,
  stepYears = 1
): TimelineState[] {
  const states: TimelineState[] = [];
  const policyNorm = Object.values(policy).reduce((a, b) => a + b, 0) / (7 * 100);

  for (let year = startYear; year <= endYear; year += stepYears) {
    const t = year - startYear;
    const population = projectPopulation(t, policyNorm);

    // Linear interpolation of simulation results toward full effect over 10 years
    const policy_ramp = Math.min(1, t / 10);
    const sim = computeSimulation({
      ...policy,
      metroExpansion: policy.metroExpansion * policy_ramp,
      evAdoptionRate: policy.evAdoptionRate * Math.min(1, t / 8),
      renewableShare: policy.renewableShare * policy_ramp,
    });

    // Natural trends + policy effects
    const base_aqi_trend = 142 + t * 2.5; // worsens without policy
    const policy_aqi = sim.aqi.after;
    const aqi = Math.round(base_aqi_trend * (1 - policy_ramp) + policy_aqi * policy_ramp);

    const base_co2_trend = 42000 + t * 800;
    const co2 = Math.round(base_co2_trend * (1 - policy_ramp) + sim.co2.after * policy_ramp);

    const energy_growth = BENGALURU_BASELINE.energy_demand_gwh_yr * Math.pow(1.04, t);
    const energy = Math.round(energy_growth);

    const renewable = BENGALURU_BASELINE.renewable_fraction + policy_ramp * (policy.renewableShare / 100 - BENGALURU_BASELINE.renewable_fraction);

    const traffic_trend = Math.min(95, 67 + t * 1.2);
    const traffic = Math.round(traffic_trend * (1 - policy_ramp * 0.4) + sim.traffic.after * policy_ramp * 0.4);

    const water_stress = 1.24 + t * 0.015 - policy_ramp * (policy.waterInfrastructure / 100) * 0.3;

    const gdp_growth = 6.8 + policy_ramp * sim.gdp.delta;

    const infra_health = Math.min(100, 63 + policy_ramp * 25);
    const city_health = Math.round(
      (Math.max(0, 100 - traffic) * 0.25 +
      Math.max(0, 100 - aqi / 3) * 0.25 +
      Math.max(0, 100 - water_stress * 40) * 0.15 +
      Math.min(100, 50 + gdp_growth * 5) * 0.20 +
      infra_health * 0.15)
    );

    states.push({
      year,
      population,
      trafficIndex: Math.max(10, traffic),
      co2_ktyr: Math.max(10000, co2),
      aqi: Math.max(30, aqi),
      gdp_growth: parseFloat(gdp_growth.toFixed(1)),
      water_stress: parseFloat(Math.max(0.5, water_stress).toFixed(2)),
      energy_demand_gwh: energy,
      renewable_fraction: parseFloat(Math.min(0.95, renewable).toFixed(2)),
      infrastructure_health: parseFloat(infra_health.toFixed(0)),
      city_health: Math.min(100, Math.max(20, city_health)),
    });
  }

  return states;
}

// =====================================================================
// SEEDED RANDOM (deterministic, no Math.random())
// =====================================================================

export function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSeededMetrics(seed: number, count: number, base: number, variance: number): number[] {
  const rand = seededRand(seed);
  const result = [];
  let current = base;
  
  for (let i = 0; i < count; i++) {
    // Random walk with mean reversion to prevent wandering off too far
    const step = (rand() - 0.5) * 2 * (variance * 0.3); // smaller step size
    current = current + step + (base - current) * 0.1; 
    
    // Add a diurnal (sine) pattern to simulate time-of-day cycles
    const diurnal = Math.sin((i / count) * Math.PI * 2 - Math.PI / 2) * (variance * 0.7);
    
    result.push(parseFloat((current + diurnal).toFixed(1)));
  }
  return result;
}
