/**
 * BHAVORA AI INTELLIGENCE ENGINE
 * Context-aware responses for Bhavishyavani across all 5 agent modes
 */

interface AIResponse {
  content: string;
  actions?: { label: string; path: string }[];
}

// Keywords → rich contextual responses
const KNOWLEDGE_BASE: { keywords: string[]; agentId?: string; response: AIResponse }[] = [
  // Executive Domain
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'],
    response: {
      content: `Namaste! I am Bhavishyavani, Bhavora's Predictive Urban Intelligence Copilot.

I monitor Bengaluru's real-time infrastructure across traffic, power, water, air quality and emergency response systems.

How can I assist today? You can ask me to:
• **Summarise top city risks** for the week
• **Generate an executive briefing** on infrastructure health  
• **Run a scenario simulation** for a specific investment
• **Identify high-risk districts** for any infrastructure domain`
    }
  },
  {
    keywords: ['board', 'briefing', 'executive', 'report', 'presentation', 'summary'],
    agentId: 'executive',
    response: {
      content: `**Executive Infrastructure Briefing — Bengaluru**
Week of June 27, 2026

**🔴 Critical:**
Eastern grid load at 94% capacity. BESCOM Whitefield substation at risk of brownout during peak hours (6–9 PM). Recommend immediate load shedding protocol.

**🟡 Watch:**
AQI at 153 (Moderate-High). Peenya Industrial Zone contributing 38% of PM2.5 load. BBMP pollution abatement order recommended.

**🟢 Stable:**
Metro Phase 2 ridership up 12% MoM. BWSSB reservoir levels at 68% — adequate for 3 months.

**AI Recommendation:**
Prioritise Eastern Grid Reinforcement (₹820 Cr, 4-year payback). Risk-adjusted ROI: 2.3x.`,
      actions: [{ label: 'View Full Report', path: '/reports' }, { label: 'Run Simulation', path: '/decision-twin' }]
    }
  },
  {
    keywords: ['risk', 'danger', 'threat', 'critical', 'alert', 'incident', 'emergency'],
    response: {
      content: `**Top 3 Active Risk Vectors — Bengaluru**

**1. Power Grid Stress** (Severity: CRITICAL)
Eastern corridor substations operating at 94% load factor. Whitefield, Marathahalli and Varthur at highest brownout risk. Probability of grid event in 14 days: 73%.

**2. Flood Vulnerability** (Severity: HIGH)
BWSSB flood model shows Bellandur, Agara and HSR Layout at risk if cumulative rainfall exceeds 85mm in 48 hours. Monsoon onset in 9 days.

**3. Traffic Bottleneck** (Severity: MEDIUM)
ORR–Silk Board–Hebbal corridor operating at 91% capacity. Emergency vehicle clearance time: 18 minutes (target: 8 minutes).

**Recommended Actions:**
• Deploy BESCOM emergency load management
• Pre-position NDRF teams in Bellandur zone
• Activate alternate traffic routing via Bannerghatta Road`,
      actions: [{ label: 'Disaster Response', path: '/disaster' }, { label: 'Impact Analysis', path: '/impact' }]
    }
  },
  {
    keywords: ['infrastructure', 'invest', 'capital', 'priority', 'recommend', 'prioritize', 'prioritise'],
    response: {
      content: `**Infrastructure Investment Priority Matrix**

Based on Bhavora's multi-variable simulation model (15 years historical data):

| Rank | Project | Capex | 5-Yr ROI | City Impact |
|------|---------|-------|----------|-------------|
| #1 | Eastern Grid Reinforcement | ₹820 Cr | 2.3x | Critical |
| #2 | Metro Phase 3 (Hebbal-Airport) | ₹3,400 Cr | 1.8x | High |
| #3 | BWSSB Water Pipeline NE | ₹640 Cr | 2.1x | High |
| #4 | Bellandur Lake Rejuvenation | ₹180 Cr | 3.4x | Medium |
| #5 | Smart Traffic Signals (500 junctions) | ₹220 Cr | 1.9x | High |

**AI Recommendation:** Proceed with Eastern Grid + BWSSB Water Pipeline in parallel. Combined 5-year savings: ₹1,240 Cr in avoided emergency costs.`,
      actions: [{ label: 'Decision Twin', path: '/decision-twin' }, { label: 'Impact Analysis', path: '/impact' }]
    }
  },
  {
    keywords: ['traffic', 'congestion', 'transport', 'road', 'vehicle', 'mobility'],
    response: {
      content: `**Real-Time Traffic Intelligence — Bengaluru**

**Current Congestion Index: 71%** (High)

**Critical Bottlenecks:**
• Silk Board Junction → ORR: 94% capacity (avg speed 8 km/h)
• Hebbal Flyover: 87% capacity (accident reported 14 min ago)
• Marathahalli Bridge: 83% capacity

**AI Traffic Forecast (next 2 hours):**
• Congestion will peak at 6:30 PM on ORR → Whitefield corridor
• Alternative route via Sarjapur Road estimated to reduce travel time by 34%

**Metro Ridership Today:** 2.1M passengers (record high)

**Bhavora Recommendation:** Activate Variable Message Signage on ORR and Hosur Road. Coordinate with Namma Metro to increase frequency on Purple Line.`,
      actions: [{ label: 'City Twin GIS', path: '/cities' }, { label: 'Analytics', path: '/analytics' }]
    }
  },
  {
    keywords: ['water', 'bwssb', 'reservoir', 'flood', 'rain', 'monsoon', 'drainage'],
    agentId: 'sustainability',
    response: {
      content: `**Water Systems Intelligence — Bengaluru**

**Reservoir Status (June 27):**
• Cauvery System: 68% capacity — adequate through September
• TK Halli: 71% | Hesaraghatta: 52% | Thippagondanahalli: 63%

**Flood Risk Zones (Pre-Monsoon):**
🔴 Bellandur Basin: HIGH (drainage capacity at 89%)
🔴 Varthur Lake: HIGH (bund integrity score: 61/100)  
🟡 HSR Layout: MEDIUM (stormwater drains 78% silted)
🟡 Koramangala Valley: MEDIUM

**Water Demand Forecast 2027:**
Current: 1,440 MLD → Projected demand: 1,780 MLD
Gap: 340 MLD — requires NE Water Pipeline by 2026

**Recommendation:** Accelerate Phase 1 BWSSB NE Pipeline (₹640 Cr). ROI: 2.1x over 5 years through reduced tanker dependency.`
    }
  },
  {
    keywords: ['aqi', 'air', 'pollution', 'environment', 'carbon', 'emission', 'green'],
    agentId: 'sustainability',
    response: {
      content: `**Air Quality Intelligence — Bengaluru**

**Current AQI: 153** (Moderate-High)

**District Breakdown:**
🔴 Peenya Industrial: AQI 215 (Very Poor)
🔴 Hebbal/ORR North: AQI 178 (Poor)
🟡 Whitefield: AQI 142 (Moderate)
🟡 Central Bengaluru: AQI 128 (Moderate)
🟢 Jayanagar/Koramangala: AQI 98 (Good)

**Primary Pollutant Sources:**
• Industrial emissions (Peenya, Bommasandra): 38%
• Vehicle exhaust (ORR corridor): 44%
• Construction dust (Whitefield): 18%

**Carbon Reduction Forecast:**
Implementing Metro Phase 3 + 500 EV charging stations could reduce transport emissions by **23% by 2028** — saving ₹890 Cr in public health costs.`
    }
  },
  {
    keywords: ['power', 'grid', 'electricity', 'bescom', 'substation', 'energy', 'load'],
    agentId: 'infrastructure',
    response: {
      content: `**Power Grid Intelligence — Bengaluru**

**Grid Load: 3.7 GW** (Current) | Peak Capacity: 4.2 GW

**Substation Risk Assessment:**
🔴 Whitefield (KV-220): 94% load — CRITICAL
🔴 ITPL Grid Node: 91% load — HIGH RISK  
🟡 Electronic City: 84% load — WATCH
🟡 Yeshwanthpur: 79% load — MONITOR
🟢 Jayanagar: 68% load — STABLE

**Forecast:**
Peak demand today (6–8 PM): 4.05 GW projected
Surplus capacity: only 150 MW (3.6% buffer — dangerous)

**AI Recommendation:**
Immediate: Activate BESCOM demand response program (negotiate 200 MW reduction from industrial consumers).
Long-term: Accelerate Eastern Grid Reinforcement Project (₹820 Cr, reduces risk by 67% by 2026).`,
      actions: [{ label: 'Simulation Engine', path: '/decision-twin' }, { label: 'Analytics', path: '/analytics' }]
    }
  },
  {
    keywords: ['metro', 'transit', 'namma', 'rail', 'public transport', 'phase 3'],
    response: {
      content: `**Metro & Transit Intelligence — Bengaluru**

**Namma Metro Status:**
• Daily Ridership: 2.1M (Phase 1+2 combined)
• On-time Performance: 96.4%
• Purple Line: KIA–Whitefield (43 stations)
• Green Line: Nagasandra–Silk Board (38 stations)

**Phase 3 Impact Simulation:**
If Metro Phase 3 (Hebbal–Kempegowda Airport, 38 km) is completed by 2027:
• 380,000 daily passengers diverted from roads
• ORR congestion reduction: -28%
• Carbon emission reduction: 340,000 tonnes/year
• Capex: ₹3,400 Cr | ROI: 1.8x over 10 years

**Bhavora Simulation Result:**
Combined Metro Phase 3 + Smart Traffic Signal investment reduces Bengaluru's average commute by **34 minutes/day** per citizen — economic value: ₹8,200 Cr/year in productivity.`,
      actions: [{ label: 'Decision Twin', path: '/decision-twin' }, { label: 'City Twin GIS', path: '/cities' }]
    }
  },
  {
    keywords: ['simulation', 'scenario', 'model', 'forecast', 'predict', 'twin'],
    response: {
      content: `**Simulation Engine Ready**

Bhavora's deterministic simulation model uses 15 years of Bengaluru municipal data across 6 domains:

**Available Scenarios:**
1. **Metro Expansion Only** → Traffic -18%, AQI -12%
2. **Renewable Grid Transition** → Emissions -34%, Grid resilience +67%  
3. **Water Infrastructure Package** → Supply gap closed by 2026
4. **Comprehensive Smart City** → City Health: 82/100 → 91/100

**How to use:**
Open the Decision Twin module, adjust investment sliders, and click "Run Simulation" to generate a 10-year infrastructure forecast with economic projections.

Shall I navigate you there now?`,
      actions: [{ label: 'Open Decision Twin', path: '/decision-twin' }, { label: 'View Results', path: '/simulation-results' }]
    }
  },
  {
    keywords: ['district', 'zone', 'area', 'worst', 'best', 'highest risk', 'whitefield', 'hebbal', 'koramangala'],
    response: {
      content: `**District Risk Intelligence — Bengaluru (27 Districts)**

**Highest Risk Districts:**
🔴 Whitefield — Power: Critical, Traffic: Critical, AQI: Poor
🔴 Bellandur — Flood: Critical, Sewage: Critical  
🔴 Hebbal — Traffic: Critical, Air: Poor
🟡 Peenya — Industrial pollution, Grid load
🟡 Electronic City — Power grid, Traffic, Water stress

**Lowest Risk Districts:**
🟢 Jayanagar — City Health: 84/100
🟢 Malleswaram — City Health: 82/100
🟢 Koramangala — City Health: 79/100

**Key Insight:**
The Eastern Corridor (Whitefield → Marathahalli → Bellandur) is the highest composite risk zone. Infrastructure failure cascade probability: 34% in 18 months if no intervention.`,
      actions: [{ label: 'Analytics Suite', path: '/analytics' }, { label: 'Impact Analysis', path: '/impact' }]
    }
  }
];

function findBestResponse(message: string, agentId: string): AIResponse {
  const lower = message.toLowerCase();
  
  // Try to find agent-specific match first
  const agentSpecific = KNOWLEDGE_BASE.find(
    kb => kb.agentId === agentId && kb.keywords.some(k => lower.includes(k))
  );
  if (agentSpecific) return agentSpecific.response;
  
  // General keyword match
  const general = KNOWLEDGE_BASE.find(
    kb => !kb.agentId && kb.keywords.some(k => lower.includes(k))
  );
  if (general) return general.response;
  
  // Fallback: domain-aware intelligent response
  const domainFallbacks: Record<string, string> = {
    executive: `**Bhavishyavani Executive Analysis**

Query: "${message}"

Processing through Bengaluru urban intelligence model...

Based on current city telemetry:
• City Health Score: 63/100 (Moderate)
• Active Priority Risks: 4 (2 Critical, 2 High)
• Infrastructure Systems at Risk: Eastern Power Grid, Bellandur Watershed

For a detailed analysis of "${message}", I recommend:
1. Running a targeted simulation in the Decision Twin
2. Reviewing district-level analytics
3. Generating an executive briefing report

Would you like me to open any of these modules?`,
    urban: `**Urban Planning Intelligence**

Analysing "${message}" in context of Bengaluru's urban development trajectory...

Key spatial data:
• Population density hotspots: Whitefield, Hebbal, Koramangala
• Rapid urbanisation zones: Sarjapur, Devanahalli, Kanakapura Road
• Greenfield development potential: North Bengaluru corridor

Recommendation: Cross-reference with the City Twin GIS to visualise spatial distribution patterns.`,
    disaster: `**Emergency Response Intelligence**

Query analysed against NDRF, BBMP, KSFRS and BWSSB operational data...

Current incident status:
• Active incidents: 4 (2 flood-risk, 1 fire, 1 infrastructure)
• Response teams deployed: 23 units across 8 zones
• Estimated population in risk zones: 180,000 residents

For detailed emergency coordination, open the Disaster Response EOC module.`,
    sustainability: `**Sustainability Intelligence**

Environmental impact analysis for "${message}"...

Bengaluru sustainability metrics:
• Carbon emissions: 18.4 MT CO₂/year (15% above 2019 target)
• Renewable energy share: 12% (target: 30% by 2030)
• Green cover: 21% of city area (declining at 1.2% annually)
• Water recycling: 8% of wastewater treated and reused

Recommend reviewing the Analytics Suite for longitudinal sustainability trends.`,
    infrastructure: `**Infrastructure Intelligence**

Technical analysis of "${message}" across Bengaluru infrastructure systems...

Current grid status: 3.7 GW load (88% capacity)
Water supply: 1,440 MLD (95% of demand met)  
Road network: 14,000 km (67% rated GOOD or better)
Metro: 81 km operational, 2.1M daily riders

Run a simulation in the Decision Twin to model investment impacts on any of these systems.`
  };
  
  return {
    content: domainFallbacks[agentId] || domainFallbacks.executive,
    actions: [{ label: 'Decision Twin', path: '/decision-twin' }, { label: 'Analytics', path: '/analytics' }]
  };
}

export { findBestResponse };
export type { AIResponse };
