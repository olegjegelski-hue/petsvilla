import { NextRequest, NextResponse } from 'next/server';
import { validateMontonioToken } from '@/lib/montonio';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

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
