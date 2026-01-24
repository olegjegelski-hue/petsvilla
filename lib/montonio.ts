import jwt from 'jsonwebtoken';

interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1?: string;
  locality?: string;
  region?: string;
  country: string;
  postalCode?: string;
  phoneNumber: string;
}

interface LineItem {
  name: string;
  quantity: number;
  finalPrice: number;
}

interface PaymentMethod {
  method: string; // 'paymentInitiation' | 'card' | 'bnpl'
  methodDisplay: string;
  amount: number;
  currency: string;
  methodOptions?: {
    paymentDescription?: string;
    preferredCountry?: string;
    preferredProvider?: string;
  };
}

interface CreateOrderPayload {
  accessKey: string;
  merchantReference: string;
  returnUrl: string;
  notificationUrl: string;
  currency: string;
  grandTotal: number;
  locale: string;
  billingAddress: BillingAddress;
  lineItems: LineItem[];
  payment: PaymentMethod;
}

/**
 * Get Montonio configuration from environment variables
 */
export function getMontonioConfig() {
  const accessKey = process.env.MONTONIO_ACCESS_KEY;
  const secretKey = process.env.MONTONIO_SECRET_KEY;
  const environment = process.env.MONTONIO_ENVIRONMENT || 'sandbox';

  if (!accessKey || !secretKey) {
    throw new Error('Montonio API keys are missing. Please check your .env file.');
  }

  const apiUrl =
    environment === 'sandbox'
      ? 'https://sandbox-stargate.montonio.com/api/orders'
      : 'https://stargate.montonio.com/api/orders';

  return {
    accessKey,
    secretKey,
    environment,
    apiUrl,
  };
}

/**
 * Create a Montonio payment order
 * @param orderData - Order data including customer info, line items, and payment method
 * @returns Payment URL to redirect the customer
 */
export async function createMontonioOrder(
  orderData: Omit<CreateOrderPayload, 'accessKey'>
): Promise<{ paymentUrl: string; uuid: string }> {
  const config = getMontonioConfig();

  // Construct the full payload with accessKey
  const payload: CreateOrderPayload = {
    accessKey: config.accessKey,
    ...orderData,
  };

  // Generate JWT token with 10-minute expiry
  const token = jwt.sign(payload, config.secretKey, {
    algorithm: 'HS256',
    expiresIn: '10m',
  });

  // Send POST request to Montonio API
  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: token }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Montonio API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.paymentUrl || !data.uuid) {
    throw new Error('Invalid response from Montonio API: missing paymentUrl or uuid');
  }

  return {
    paymentUrl: data.paymentUrl,
    uuid: data.uuid,
  };
}

/**
 * Validate Montonio callback token (webhook or return URL)
 * @param token - JWT token received from Montonio
 * @returns Decoded token payload
 */
export function validateMontonioToken(token: string): any {
  const config = getMontonioConfig();

  try {
    const decoded = jwt.verify(token, config.secretKey, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (error) {
    throw new Error(`Invalid Montonio token: ${error}`);
  }
}

/**
 * Format price for Montonio (in cents/smallest currency unit)
 * Montonio expects amounts in the smallest currency unit (e.g., cents for EUR)
 * @param price - Price in euros (e.g., 9.00)
 * @returns Price in cents (e.g., 900)
 */
export function formatMontonioPrice(price: number): number {
  return Math.round(price * 100);
}

/**
 * Generate Montonio order reference
 * @param prefix - Prefix for the reference (e.g., 'HAY', 'GP')
 * @param timestamp - Timestamp for uniqueness
 * @returns Unique merchant reference
 */
export function generateMerchantReference(prefix: string = 'ORDER'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}
