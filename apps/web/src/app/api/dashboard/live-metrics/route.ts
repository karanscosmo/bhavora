import { NextResponse } from 'next/server';

function rand(base: number, variance: number) {
  return parseFloat((base + (Math.random() - 0.5) * variance).toFixed(2));
}

export async function GET() {
  const now = new Date();
  const hour = now.getHours();
  
  // Time-of-day multipliers (rush hour peaks)
  const trafficMultiplier = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.4 : 1.0;
  const energyMultiplier = (hour >= 9 && hour <= 13) || (hour >= 18 && hour <= 22) ? 1.3 : 0.85;

  return NextResponse.json({
    timestamp: now.toISOString(),
    population: rand(13.6, 0.05),
    trafficIndex: rand(78 * trafficMultiplier, 4),
    energyDemand: rand(4.2 * energyMultiplier, 0.15),
    waterReserves: rand(18.4, 0.3),
    co2Emissions: rand(2.41, 0.05),
    jobsIndex: rand(114.2, 0.8),
    gdpGrowth: rand(8.6, 0.1),
    activeIncidents: Math.floor(rand(12, 6)),
    avgTrafficSpeed: rand(21, 3),
    gridLoad: rand(82, 5),
    airQualityIndex: Math.floor(rand(94, 8)),
  });
}
