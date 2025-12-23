import { NextRequest, NextResponse } from 'next/server';
import {
  createMontonioOrder,
  generateMerchantReference,
} from '@/lib/montonio';
import { Client } from '@notionhq/client';
import { sendHayOrderEmail } from '@/lib/email';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Customer info
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      // Order items
      hayAmount,
      guineaPigFood,
      rabbitFood,
      deliveryMethod,
      parcelMachine,
      notes,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Palun täida kõik kohustuslikud väljad' },
        { status: 400 }
      );
    }

    if (!hayAmount || parseInt(hayAmount) <= 0) {
      return NextResponse.json(
        { error: 'Palun vali heina kogus' },
        { status: 400 }
      );
    }

    // Calculate prices
    const hayPrice = parseInt(hayAmount) === 1 ? 9 : parseInt(hayAmount) === 2 ? 18 : 27;
    
    // Guinea pig food: 9€ per kg
    const guineaPigFoodPrice = parseFloat(guineaPigFood || '0') * 9;
    
    // Rabbit food: 3€ per kg (6€ for 2kg package)
    const rabbitFoodPrice = parseFloat(rabbitFood || '0') * 3;
    
    // Delivery is FREE (included in product prices)
    const deliveryPrice = 0;
    
    const grandTotal = hayPrice + guineaPigFoodPrice + rabbitFoodPrice + deliveryPrice;

    // Generate unique merchant reference
    const merchantReference = generateMerchantReference('HAY');

    // Get origin for return and notification URLs
    // For Montonio, we need a public HTTPS URL, not localhost
    let origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || '';
    
    // If using localhost, fallback to deployed URL
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      origin = 'https://petsvilla.abacusai.app';
    }

    // Prepare line items
    const lineItems = [];

    // Add hay
    lineItems.push({
      name: `Lemmiklooma hein (${hayAmount} kott${parseInt(hayAmount) > 1 ? 'i' : ''})`,
      quantity: parseInt(hayAmount),
      finalPrice: hayPrice,
    });

    // Add guinea pig food if ordered (9€ per kg)
    if (guineaPigFood && parseFloat(guineaPigFood) > 0) {
      lineItems.push({
        name: `Meriseatoit (${guineaPigFood} kg)`,
        quantity: 1,
        finalPrice: parseFloat(guineaPigFood) * 9,
      });
    }

    // Add rabbit food if ordered (3€ per kg)
    if (rabbitFood && parseFloat(rabbitFood) > 0) {
      lineItems.push({
        name: `Küülikutoit (${rabbitFood} kg)`,
        quantity: 1,
        finalPrice: parseFloat(rabbitFood) * 3,
      });
    }

    // Delivery is FREE (tarne hinna sees)
    // No separate delivery line item needed

    // Split name into first and last name
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '-';

    // Create Montonio order
    const orderData = {
      merchantReference,
      returnUrl: `${origin}/tellimus-kinnitatud?reference=${merchantReference}`,
      notificationUrl: `${origin}/api/montonio/callback`,
      currency: 'EUR',
      grandTotal: grandTotal,
      locale: 'et',
      billingAddress: {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        country: 'EE',
        addressLine1: address || '',
        locality: city || '',
        postalCode: postalCode || '',
      },
      lineItems,
      payment: {
        method: 'paymentInitiation',
        methodDisplay: 'Panga link või kaart',
        amount: grandTotal,
        currency: 'EUR',
        methodOptions: {
          paymentDescription: `Heinatellimus ${merchantReference}`,
          preferredCountry: 'EE',
        },
      },
    };

    // Create order in Montonio
    console.log('=== STARTING MONTONIO ORDER CREATION ===');
    console.log('Sending order to Montonio:', JSON.stringify(orderData, null, 2));
    
    let paymentUrl, uuid;
    try {
      console.log('Calling createMontonioOrder...');
      const result = await createMontonioOrder(orderData);
      paymentUrl = result.paymentUrl;
      uuid = result.uuid;
      console.log('Montonio order created successfully!');
      console.log('Payment URL:', paymentUrl);
      console.log('UUID:', uuid);
      console.log('=== MONTONIO ORDER CREATION COMPLETED ===');
    } catch (montonioError) {
      console.error('=== MONTONIO ORDER CREATION FAILED ===');
      console.error('Montonio API error:', montonioError);
      console.error('Error type:', typeof montonioError);
      console.error('Error message:', montonioError instanceof Error ? montonioError.message : 'Unknown error');
      throw new Error(`Montonio API viga: ${montonioError instanceof Error ? montonioError.message : 'Tundmatu viga'}`);
    }

    // Save order to Notion with payment status "pending"
    try {
      // Build properties object with only fields that exist in database
      const properties: any = {
        Name: { 
          title: [{ text: { content: name } }] 
        },
        Email: { 
          email 
        },
        Phone: { 
          phone_number: phone 
        },
        Terminal: { 
          rich_text: [{ text: { content: parcelMachine || '' } }] 
        },
        'Quantity (pakkide arv)': { 
          number: parseInt(hayAmount) 
        },
        'Meriseatoit (kg)': { 
          number: parseFloat(guineaPigFood || '0') 
        },
        'Küülikutoit (kg)': { 
          number: parseFloat(rabbitFood || '0') * 2  // Sold in 2kg packages
        },
        'Total Price (EUR)': { 
          number: grandTotal 
        },
        Comments: { 
          rich_text: [{ text: { content: `${notes || ''}\n\nMontonio Reference: ${merchantReference}\nMontonio UUID: ${uuid}` } }] 
        },
        Status: { 
          select: { name: 'Töötlemisel' } 
        },
      };

      await notion.pages.create({
        parent: { database_id: process.env.NOTION_HAY_DATABASE_ID! },
        properties,
      });
      console.log(`Order ${merchantReference} saved to Notion with status: Töötlemisel`);
    } catch (notionError) {
      console.error('Error saving to Notion:', notionError);
      console.error('Notion error details:', JSON.stringify(notionError, null, 2));
      // Continue even if Notion save fails - payment can still proceed
    }

    // Send email notification with order details
    try {
      await sendHayOrderEmail({
        name,
        email,
        phone,
        terminal: parcelMachine || 'Määramata',
        quantity: parseInt(hayAmount),
        guineaPigFood: parseFloat(guineaPigFood || '0'),
        rabbitFood: parseFloat(rabbitFood || '0'),
        totalPrice: grandTotal,
        comments: notes || '',
      });
      console.log(`Order confirmation email sent for ${merchantReference}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue even if email fails - order is still valid
    }

    console.log('=== RETURNING SUCCESS RESPONSE ===');
    console.log('Success:', true);
    console.log('Payment URL:', paymentUrl);
    console.log('Merchant Reference:', merchantReference);
    console.log('UUID:', uuid);
    
    return NextResponse.json({
      success: true,
      paymentUrl,
      merchantReference,
      uuid,
    });
  } catch (error) {
    console.error('=== ERROR IN ORDER CREATION ===');
    console.error('Error creating Montonio order:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      {
        error: 'Tellimuse loomisel tekkis viga. Palun proovi uuesti.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
