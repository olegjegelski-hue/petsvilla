import { NextRequest, NextResponse } from 'next/server';
import {
  createMontonioOrder,
  formatMontonioPrice,
  generateMerchantReference,
} from '@/lib/montonio';
import { Client } from '@notionhq/client';

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
      finalPrice: formatMontonioPrice(hayPrice),
    });

    // Add guinea pig food if ordered (9€ per kg)
    if (guineaPigFood && parseFloat(guineaPigFood) > 0) {
      lineItems.push({
        name: `Meriseatoit (${guineaPigFood} kg)`,
        quantity: 1,
        finalPrice: formatMontonioPrice(parseFloat(guineaPigFood) * 9),
      });
    }

    // Add rabbit food if ordered (3€ per kg)
    if (rabbitFood && parseFloat(rabbitFood) > 0) {
      lineItems.push({
        name: `Küülikutoit (${rabbitFood} kg)`,
        quantity: 1,
        finalPrice: formatMontonioPrice(parseFloat(rabbitFood) * 3),
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
      returnUrl: `${origin}/tellimus-kinnitatud?payment=success&reference=${merchantReference}`,
      notificationUrl: `${origin}/api/montonio/callback`,
      currency: 'EUR',
      grandTotal: formatMontonioPrice(grandTotal),
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
        amount: formatMontonioPrice(grandTotal),
        currency: 'EUR',
        methodOptions: {
          paymentDescription: `Heinatellimus ${merchantReference}`,
          preferredCountry: 'EE',
        },
      },
    };

    // Create order in Montonio
    console.log('Sending order to Montonio:', JSON.stringify(orderData, null, 2));
    
    let paymentUrl, uuid;
    try {
      const result = await createMontonioOrder(orderData);
      paymentUrl = result.paymentUrl;
      uuid = result.uuid;
      console.log('Montonio order created successfully:', { paymentUrl, uuid });
    } catch (montonioError) {
      console.error('Montonio API error:', montonioError);
      throw new Error(`Montonio API viga: ${montonioError instanceof Error ? montonioError.message : 'Tundmatu viga'}`);
    }

    // Save order to Notion with payment status "pending"
    try {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_HAY_DATABASE_ID! },
        properties: {
          Nimi: { title: [{ text: { content: name } }] },
          Email: { email },
          Telefon: { phone_number: phone },
          Aadress: { rich_text: [{ text: { content: address || '' } }] },
          Linn: { rich_text: [{ text: { content: city || '' } }] },
          Postiindeks: { rich_text: [{ text: { content: postalCode || '' } }] },
          Heina_kogus: { number: parseInt(hayAmount) },
          Meriseatoit_kg: { number: parseFloat(guineaPigFood || '0') },
          Küülikutoit_kg: { number: parseFloat(rabbitFood || '0') },
          Tarne_viis: {
            select: {
              name: deliveryMethod === 'smartpost' ? 'SmartPost' : 'Kohaletoimetamine',
            },
          },
          Pakiautomaat: {
            rich_text: [{ text: { content: parcelMachine || '' } }],
          },
          Märkused: { rich_text: [{ text: { content: notes || '' } }] },
          Summa: { number: grandTotal },
          Maksemeetod: { select: { name: 'Montonio' } },
          Makse_staatus: { select: { name: 'Ootel' } },
          Makse_viide: { rich_text: [{ text: { content: merchantReference } }] },
          Montonio_UUID: { rich_text: [{ text: { content: uuid } }] },
        },
      });
    } catch (notionError) {
      console.error('Error saving to Notion:', notionError);
      // Continue even if Notion save fails
    }

    return NextResponse.json({
      success: true,
      paymentUrl,
      merchantReference,
      uuid,
    });
  } catch (error) {
    console.error('Error creating Montonio order:', error);
    return NextResponse.json(
      {
        error: 'Tellimuse loomisel tekkis viga. Palun proovi uuesti.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
