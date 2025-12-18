// This endpoint is deprecated. Use /api/montonio/create-order instead.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use /api/montonio/create-order instead.' 
    },
    { status: 410 }
  );
}
