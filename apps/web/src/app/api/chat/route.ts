import { NextResponse } from 'next/server';
import { z } from 'zod';

const ChatInputSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const body = ChatInputSchema.parse(rawBody);
    
    // In a real app, this would call an LLM.
    // For Bhavora V2, the local AICopilot rule engine handles it client-side.
    return NextResponse.json({ reply: `Received: ${body.message}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
