import { NextResponse } from 'next/server';
import { z } from 'zod';

const SimulationInputSchema = z.object({
  evAdoption: z.number().min(0).max(100),
  populationGrowth: z.number().min(-10).max(50),
  industrialExpansion: z.number().min(-10).max(50),
  metroExpansion: z.number().min(0).max(20),
  renewableEnergyGrowth: z.number().min(0).max(100),
  climateEvent: z.string().default('None'),
  disasterEvent: z.string().default('None'),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const body = SimulationInputSchema.parse(rawBody);
    
    // Simulation logic is handled client-side deterministically if API is missing.
    // This route acts as a validation layer for server-side processing.
    return NextResponse.json({ success: true, inputs: body });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
