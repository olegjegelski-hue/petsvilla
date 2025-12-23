import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: NextRequest) {
  try {
    console.log('=== PAYMENT VERIFICATION STARTED ===');
    
    const body = await request.json();
    const { merchantReference } = body;

    console.log('Merchant Reference:', merchantReference);

    if (!merchantReference) {
      console.error('Missing merchantReference');
      return NextResponse.json(
        { error: 'Merchant reference is required' },
        { status: 400 }
      );
    }

    // Search for the order in Notion using the merchant reference in Comments field
    console.log('Searching for order in Notion...');
    console.log('Database ID:', process.env.NOTION_HAY_DATABASE_ID);
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_HAY_DATABASE_ID!,
      filter: {
        property: 'Comments',
        rich_text: {
          contains: merchantReference,
        },
      },
    });

    console.log('Notion search results:', response.results.length, 'orders found');

    if (response.results.length === 0) {
      console.error('Order not found in Notion');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const pageId = response.results[0].id;
    console.log('Found order with page ID:', pageId);

    // Update status to "Uus" (payment successful)
    console.log('Updating order status to "Uus"...');
    
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          select: { name: 'Uus' },
        },
      },
    });

    console.log('✅ Order status updated successfully to "Uus"');
    console.log('=== PAYMENT VERIFICATION COMPLETED ===');

    return NextResponse.json({
      success: true,
      message: 'Order status updated to Uus',
      merchantReference,
    });
  } catch (error) {
    console.error('=== ERROR IN PAYMENT VERIFICATION ===');
    console.error('Error verifying payment:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      {
        error: 'Failed to verify payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
