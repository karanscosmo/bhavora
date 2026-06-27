import { NextResponse } from 'next/server';
import { computeSimulation, projectTimeline, PolicyInput } from '@/lib/simulation';

export async function POST(request: Request) {
  try {
    const policy: PolicyInput = await request.json();

    // Artificial delay to simulate heavy backend AI crunching (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Run the complex models server-side
    const results = computeSimulation(policy);
    const timeline = projectTimeline(policy);

    return NextResponse.json({
      success: true,
      data: {
        results,
        timeline,
      }
    });
  } catch (error) {
    console.error('Simulation Engine Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
