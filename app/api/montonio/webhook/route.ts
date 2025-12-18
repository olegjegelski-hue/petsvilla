// This endpoint is deprecated. Use /api/montonio/callback instead.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/montonio/callback instead.' 
    },
    { status: 410 }
  );
}
