import { NextRequest, NextResponse } from 'next/server';
import { validateMontonioToken } from '@/lib/montonio';
import { Client } from '@notionhq/client';
import {
  appendMetaPurchaseMarker,
  calculateHayOrderNumItems,
  getClientIpFromHeaders,
  hasMetaPurchaseBeenSent,
  sendMetaPurchaseEvent,
} from '@/lib/meta-capi-server';
import { getSiteUrl } from '@/lib/site-url';
import { reportError } from '@/lib/report-error';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function isPaidMontonioStatus(status: string): boolean {
  return status === 'finalized' || status === 'paid' || status === 'PAID';
}

async function sendPurchaseFromNotionOrder(
  merchantReference: string,
  request: NextRequest,
  fallback?: { value?: number; currency?: string }
) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_HAY_DATABASE_ID!,
    filter: {
      property: 'Comments',
      rich_text: {
        contains: merchantReference,
      },
    },
  });

  if (response.results.length === 0) {
    console.warn(`Meta CAPI: order not found in Notion: ${merchantReference}`);
    return;
  }

  const page = response.results[0] as {
    id: string
    properties: Record<string, any>
  };
  const props = page.properties;
  const comments = props.Comments?.rich_text?.[0]?.plain_text || '';

  if (hasMetaPurchaseBeenSent(comments)) {
    console.log(`Meta CAPI: Purchase already sent for ${merchantReference}`);
    return;
  }

  const customerEmail = props.Email?.email || '';
  const customerPhone = props.Phone?.phone_number || '';
  const hayQuantity = props['Quantity (pakkide arv)']?.number || 1;
  const guineaPigFoodKg = props['Meriseatoit (kg)']?.number || 0;
  const rabbitFoodKg = props['Küülikutoit (kg)']?.number || 0;
  const totalPrice = props['Total Price (EUR)']?.number ?? fallback?.value ?? 0;
  const currency = fallback?.currency || 'EUR';
  const numItems = calculateHayOrderNumItems({
    hayQuantity,
    guineaPigFoodKg,
    rabbitFoodKg,
  });

  const result = await sendMetaPurchaseEvent({
    orderId: merchantReference,
    value: totalPrice,
    currency,
    email: customerEmail,
    phone: customerPhone,
    numItems,
    eventSourceUrl: `${getSiteUrl()}/tellimus-kinnitatud?reference=${merchantReference}`,
    clientIpAddress: getClientIpFromHeaders(request.headers),
    clientUserAgent: request.headers.get('user-agent') || undefined,
  });

  if (!result.success) {
    console.error(`Meta CAPI: failed to send Purchase for ${merchantReference}`);
    return;
  }

  await notion.pages.update({
    page_id: page.id,
    properties: {
      Comments: {
        rich_text: [{ text: { content: appendMetaPurchaseMarker(comments) } }],
      },
    },
  });

  console.log(`Meta CAPI: Purchase sent for ${merchantReference}`);
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== MONTONIO CALLBACK RECEIVED ===');
    console.log('Request body:', JSON.stringify(await request.clone().json(), null, 2));
    
    const body = await request.json();
    const { payment_token } = body;
    
    console.log('Payment token:', payment_token);

    if (!payment_token) {
      return NextResponse.json(
        { error: 'Missing payment_token' },
        { status: 400 }
      );
    }

    // Validate the token from Montonio
    const decoded = validateMontonioToken(payment_token);

    // Extract payment information
    const {
      merchant_reference: merchantReference,
      status,
      uuid,
      amount,
      currency,
    } = decoded;

    console.log('Montonio callback received:', {
      merchantReference,
      status,
      uuid,
      amount,
      currency,
    });

    // Update order in Notion based on payment status
    if (merchantReference && status) {
      try {
        // Find the order in Notion by searching Comments field for merchant reference
        const response = await notion.databases.query({
          database_id: process.env.NOTION_HAY_DATABASE_ID!,
          filter: {
            property: 'Comments',
            rich_text: {
              contains: merchantReference,
            },
          },
        });

        if (response.results.length > 0) {
          const pageId = response.results[0].id;

          // Map Montonio status to our status
          let paymentStatus = 'Töötlemisel';
          if (status === 'finalized' || status === 'paid') {
            paymentStatus = 'Uus'; // Payment successful, order is ready to process
          } else if (status === 'abandoned' || status === 'voided') {
            paymentStatus = 'Tühistatud'; // Payment cancelled
          }
          // Otherwise stays 'Töötlemisel' (payment pending/processing)

          // Update the order with payment status
          await notion.pages.update({
            page_id: pageId,
            properties: {
              Status: {
                select: { name: paymentStatus },
              },
            },
          });

          console.log(`Order ${merchantReference} updated with status: ${paymentStatus}`);

          if (isPaidMontonioStatus(status)) {
            try {
              const parsedAmount =
                typeof amount === 'number'
                  ? amount
                  : amount
                    ? Number(amount)
                    : undefined;

              await sendPurchaseFromNotionOrder(merchantReference, request, {
                value: Number.isFinite(parsedAmount) ? parsedAmount : undefined,
                currency: currency || 'EUR',
              });
            } catch (metaError) {
              console.error('Meta CAPI error in Montonio callback:', metaError);
            }
          }
        } else {
          console.warn(`Order not found in Notion: ${merchantReference}`);
        }
      } catch (notionError) {
        console.error('Error updating Notion:', notionError);
        console.error('Notion update error details:', JSON.stringify(notionError, null, 2));
        // Don't fail the callback if Notion update fails
      }
    }

    // Return success response to Montonio
    return NextResponse.json({ success: true });
  } catch (error) {
    reportError(error, { tags: { area: 'montonio', route: 'callback' } });
    console.error('Error processing Montonio callback:', error);
    return NextResponse.json(
      {
        error: 'Failed to process callback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const payment_token = searchParams.get('payment_token');

  if (!payment_token) {
    return NextResponse.json(
      { error: 'Missing payment_token' },
      { status: 400 }
    );
  }

  try {
    const decoded = validateMontonioToken(payment_token);
    return NextResponse.json({
      success: true,
      data: decoded,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
