import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { createMontonioShipment } from '@/lib/montonio-shipping';

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

    const page = response.results[0] as any;
    const pageId = page.id;
    console.log('Found order with page ID:', pageId);

    // Extract order data from Notion for shipment creation
    const props = page.properties;
    const customerName = props.Name?.title?.[0]?.plain_text || 'Klient';
    const customerEmail = props.Email?.email || '';
    const customerPhone = props.Phone?.phone_number || '';
    const comments = props.Comments?.rich_text?.[0]?.plain_text || '';
    const hayQuantity = props['Quantity (pakkide arv)']?.number || 1;
    
    // Extract terminal UUID from comments (format: "Pickup Point UUID: xxx")
    const uuidMatch = comments.match(/Pickup Point UUID: ([a-zA-Z0-9-]+)/);
    const terminalUuid = uuidMatch ? uuidMatch[1] : null;
    
    console.log('Customer:', customerName, customerEmail, customerPhone);
    console.log('Terminal UUID:', terminalUuid);
    console.log('Hay Quantity (bags):', hayQuantity);

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

    // Create shipment in Montonio Shipping if we have terminal UUID
    let shipmentResult = null;
    if (terminalUuid) {
      console.log('=== CREATING MONTONIO SHIPMENT ===');
      
      const nameParts = customerName.split(' ');
      const firstName = nameParts[0] || customerName;
      const lastName = nameParts.slice(1).join(' ') || '-';
      
      shipmentResult = await createMontonioShipment({
        merchantReference,
        pickupPointUuid: terminalUuid,
        shippingFirstName: firstName,
        shippingLastName: lastName,
        shippingEmail: customerEmail,
        shippingPhone: customerPhone,
        parcelCount: hayQuantity,
      });

      console.log('Shipment creation result:', shipmentResult);

      // Update Notion with tracking info if shipment was created
      if (shipmentResult.success && shipmentResult.trackingCode) {
        const updatedComments = `${comments}\nTracking: ${shipmentResult.trackingCode}`;
        await notion.pages.update({
          page_id: pageId,
          properties: {
            Comments: {
              rich_text: [{ text: { content: updatedComments.slice(0, 2000) } }],
            },
          },
        });
        console.log('✅ Tracking code added to Notion');
      }
    } else {
      console.log('No terminal UUID found, skipping shipment creation');
    }

    console.log('=== PAYMENT VERIFICATION COMPLETED ===');

    return NextResponse.json({
      success: true,
      message: 'Order status updated to Uus',
      merchantReference,
      shipment: shipmentResult,
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
