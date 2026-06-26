import { NextResponse } from 'next/server';
import { z } from 'zod';

const FloodInputSchema = z.object({
  climateEvent: z.string().optional().default('None'),
  rainfall: z.number().optional().default(0),
  district: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const body = FloodInputSchema.parse(rawBody);
    const { climateEvent, rainfall } = body;

  if (climateEvent === 'None' && rainfall === 0) {
    return NextResponse.json({
      riskLevel: 'Low',
      affectedRoads: [],
      affectedPopulation: 0,
      hospitalStress: 0,
      floodZones: [],
      recoveryEstimateHours: 0,
      recommendations: ['No active flood risk. Continue normal monitoring protocols.']
    });
  }

  const intensity = climateEvent === '100-Year Flood' ? 1.0 : climateEvent === 'Severe Drought' ? 0.2 : 0.6;

  const floodZones = [
    { name: 'Koramangala Valley', lat: 12.9352, lng: 77.6245, severity: intensity > 0.8 ? 'Critical' : 'High', population: Math.round(55000 * intensity) },
    { name: 'Bellandur Lake Area', lat: 12.9256, lng: 77.6697, severity: intensity > 0.8 ? 'Critical' : 'Moderate', population: Math.round(42000 * intensity) },
    { name: 'Whitefield Lowlands', lat: 12.9698, lng: 77.7499, severity: 'Moderate', population: Math.round(28000 * intensity) },
    { name: 'Hebbal Junction', lat: 13.0358, lng: 77.5913, severity: intensity > 0.8 ? 'High' : 'Low', population: Math.round(18000 * intensity) },
  ];

  const affectedRoads = [
    'Sarjapur Road (KM 4–12)',
    'Outer Ring Road – Silk Board to Marathahalli',
    'Bellandur Village Road',
    intensity > 0.8 ? 'NH-44 – Partial closure near Yelahanka' : null,
  ].filter(Boolean) as string[];

  const affectedPopulation = floodZones.reduce((sum, z) => sum + z.population, 0);
  const hospitalStress = Math.min(100, Math.round(45 + (intensity * 50)));

  const alternatePaths = [
    {
      from: 'Silk Board',
      to: 'Marathahalli',
      via: 'Koramangala 80ft Road → Intermediate Ring Road',
      congestionReduction: Math.round(18 + intensity * 12),
      distanceKm: 14.2,
    },
    {
      from: 'Bellandur',
      to: 'Whitefield',
      via: 'EPIP Zone → KIADB Road',
      congestionReduction: Math.round(22 + intensity * 8),
      distanceKm: 11.8,
    }
  ];

  return NextResponse.json({
    riskLevel: intensity > 0.8 ? 'Critical' : intensity > 0.5 ? 'High' : 'Moderate',
    affectedRoads,
    affectedPopulation,
    hospitalStress,
    floodZones,
    alternatePaths,
    recoveryEstimateHours: Math.round(24 + intensity * 72),
    riskScore: parseFloat((intensity * 9.2).toFixed(1)),
    recommendations: [
      `Activate emergency shelter protocols for ${affectedPopulation.toLocaleString()} residents in flood zones.`,
      `Reroute ORR traffic via Intermediate Ring Road. Estimated congestion reduction: ${alternatePaths[0].congestionReduction}%.`,
      `${hospitalStress > 80 ? 'Deploy additional medical teams to Koramangala ESI Hospital.' : 'Hospital capacity within stress tolerance.'}`,
      `Estimated recovery time: ${Math.round(24 + intensity * 72)} hours post-peak rainfall.`,
    ]
  });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
