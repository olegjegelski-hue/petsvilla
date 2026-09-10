import jwt from 'jsonwebtoken';
import { getMontonioSenderAddress } from '@/lib/site-contact';

interface ShipmentData {
  merchantReference: string;
  pickupPointUuid: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingMethod?: string;
  parcelCount?: number;
}

/**
 * Get Montonio Shipping configuration
 */
export function getMontonioShippingConfig() {
  const accessKey = process.env.MONTONIO_ACCESS_KEY;
  const secretKey = process.env.MONTONIO_SECRET_KEY;
  const environment = process.env.MONTONIO_ENVIRONMENT || 'sandbox';

  if (!accessKey || !secretKey) {
    throw new Error('Montonio API keys are missing.');
  }

  const baseUrl =
    environment === 'sandbox'
      ? 'https://sandbox-shipping.montonio.com/api'
      : 'https://shipping.montonio.com/api';

  return {
    accessKey,
    secretKey,
    environment,
    baseUrl,
  };
}

/**
 * Generate JWT token for Montonio Shipping API
 */
function generateShippingToken(): string {
  const config = getMontonioShippingConfig();
  return jwt.sign(
    { accessKey: config.accessKey },
    config.secretKey,
    { algorithm: 'HS256', expiresIn: '10m' }
  );
}

/**
 * Montonio Shipping v2 returns the carrier tracking number on the parcel,
 * not as a top-level tracking_code.
 */
export function extractMontonioTrackingCode(
  result: unknown
): string | undefined {
  if (!result || typeof result !== 'object') return undefined

  const payload = result as Record<string, unknown>
  const direct = [
    payload.tracking_code,
    payload.trackingCode,
    payload.carrierParcelId,
  ]
  for (const value of direct) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  const parcels = payload.parcels
  if (!Array.isArray(parcels) || !parcels[0] || typeof parcels[0] !== 'object') {
    return undefined
  }

  const parcel = parcels[0] as Record<string, unknown>
  const nested = [
    parcel.carrierParcelId,
    parcel.trackingCode,
    parcel.tracking_code,
  ]
  for (const value of nested) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  return undefined
}

/**
 * Create a shipment in Montonio Shipping
 */
export async function createMontonioShipment(data: ShipmentData): Promise<{
  success: boolean;
  shipmentId?: string;
  trackingCode?: string;
  labelUrl?: string;
  error?: string;
}> {
  try {
    const config = getMontonioShippingConfig();
    
    // Build shipment payload (Montonio Shipping API v2 format)
    const shipmentPayload = {
      shippingMethod: {
        type: 'pickupPoint',
        id: data.pickupPointUuid,
      },
      merchantReference: data.merchantReference,
      sender: getMontonioSenderAddress(),
      receiver: {
        name: `${data.shippingFirstName} ${data.shippingLastName || ''}`.trim(),
        email: data.shippingEmail,
        phoneCountryCode: '+372',
        phoneNumber: data.shippingPhone.replace('+372', '').replace(/\s/g, ''),
        country: 'EE',
      },
      parcels: Array.from({ length: data.parcelCount || 1 }, () => ({
        weight: 1.5,
      })),
    };

    console.log('Creating Montonio shipment with payload:', JSON.stringify(shipmentPayload, null, 2));

    // Generate JWT token for Bearer auth
    const token = generateShippingToken();

    // Call Montonio Shipping API v2
    const response = await fetch(`${config.baseUrl}/v2/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shipmentPayload),
    });

    const responseText = await response.text();
    console.log('Montonio Shipping API response status:', response.status);
    console.log('Montonio Shipping API response:', responseText);

    if (!response.ok) {
      console.error('Montonio Shipping API error:', response.status, responseText);
      return {
        success: false,
        error: `Shipping API error: ${response.status} - ${responseText}`,
      };
    }

    const result = JSON.parse(responseText);

    return {
      success: true,
      shipmentId: result.uuid || result.id,
      trackingCode: extractMontonioTrackingCode(result),
      labelUrl: result.label_url || result.labelUrl,
    };
  } catch (error) {
    console.error('Error creating Montonio shipment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
