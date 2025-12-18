import { NextRequest, NextResponse } from 'next/server';
import { validateMontonioToken } from '@/lib/montonio';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_token } = body;

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
        // Find the order in Notion by merchant reference
        const response = await notion.databases.query({
          database_id: process.env.NOTION_HAY_DATABASE_ID!,
          filter: {
            property: 'Makse_viide',
            rich_text: {
              equals: merchantReference,
            },
          },
        });

        if (response.results.length > 0) {
          const pageId = response.results[0].id;

          // Map Montonio status to our status
          let paymentStatus = 'Ootel';
          if (status === 'finalized' || status === 'paid') {
            paymentStatus = 'Makstud';
          } else if (status === 'abandoned' || status === 'voided') {
            paymentStatus = 'Tühistatud';
          }

          // Update the order with payment status
          await notion.pages.update({
            page_id: pageId,
            properties: {
              Makse_staatus: {
                select: { name: paymentStatus },
              },
            },
          });

          console.log(`Order ${merchantReference} updated with status: ${paymentStatus}`);
        } else {
          console.warn(`Order not found in Notion: ${merchantReference}`);
        }
      } catch (notionError) {
        console.error('Error updating Notion:', notionError);
        // Don't fail the callback if Notion update fails
      }
    }

    // Return success response to Montonio
    return NextResponse.json({ success: true });
  } catch (error) {
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
