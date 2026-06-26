import { NextResponse } from 'next/server';
import { z } from 'zod';

const AnalyticsInputSchema = z.object({
  metrics: z.array(z.string()),
  timeframe: z.enum(['1M', '6M', '1Y', '5Y', '15Y']),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const body = AnalyticsInputSchema.parse(rawBody);
    
    return NextResponse.json({ success: true, timeframe: body.timeframe, data: [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
