import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accessKey = process.env.MONTONIO_ACCESS_KEY;
    const secretKey = process.env.MONTONIO_SECRET_KEY;

    if (!accessKey || !secretKey) {
      return NextResponse.json({ error: 'Montonio API keys missing' }, { status: 500 });
    }

    // Generate JWT token for Montonio
    const token = jwt.sign(
      { accessKey },
      secretKey,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // Fetch pickup points from Montonio v3 API
    const response = await fetch(
      'https://shipping.montonio.com/api/v3/shipping-methods/pickup-points?countryCode=EE&carrierCode=smartpost',
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Montonio pickup points error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch pickup points' }, { status: 500 });
    }

    const data = await response.json();
    const pickupPoints = data.pickupPoints || [];

    // Transform to match existing format used by TerminalPicker
    const terminals = pickupPoints.map((pp: any) => ({
      id: pp.carrierAssignedId, // SmartPost ID for display
      uuid: pp.id, // Montonio UUID for shipment creation
      name: pp.name,
      address: pp.streetAddress,
      city: pp.locality,
      postalCode: pp.postalCode,
      type: pp.type,
    }));

    return NextResponse.json({ terminals });
  } catch (error) {
    console.error('Error fetching Montonio pickup points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}