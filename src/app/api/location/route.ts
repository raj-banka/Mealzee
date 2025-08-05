import { NextRequest, NextResponse } from 'next/server';

// In-memory store for received locations (for demo purposes)
const locations: Array<{ lat: number; lon: number; time: string }> = [];

export async function POST(req: NextRequest) {
  try {
    const { lat, lon } = await req.json();
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json({ error: 'Invalid latitude or longitude.' }, { status: 400 });
    }
    const time = new Date().toISOString();
    locations.push({ lat, lon, time });
    console.log('Received location:', { lat, lon, time });
    return NextResponse.json({ message: 'Location received successfully!', received: { lat, lon, time } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to process location.' }, { status: 500 });
  }
}
