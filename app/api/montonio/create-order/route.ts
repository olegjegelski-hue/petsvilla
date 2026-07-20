import { NextRequest, NextResponse } from 'next/server'
import {
  createMontonioOrder,
  generateMerchantReference,
} from '@/lib/montonio'
import { Client } from '@notionhq/client'
import { sendHayOrderEmail } from '@/lib/email'
import { reportError } from '@/lib/report-error'
import { validateHayOrderForm } from '@/lib/hay-order-validation'
import { rateLimitExceededResponse } from '@/lib/rate-limit'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitExceededResponse(request, {
      bucket: 'hay-order',
      route: 'montonio/create-order',
      max: 5,
      windowMs: 10 * 60 * 1000,
    })
    if (limited) return limited

    const body = await request.json()
    const result = validateHayOrderForm(body)

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    if (result.honeypot) {
      reportError(new Error('Montonio create-order honeypot triggered'), {
        tags: { area: 'abuse', route: 'montonio/create-order' },
      })
      return NextResponse.json({
        success: true,
        paymentUrl: 'https://petsvilla.ee/tellimus-kinnitatud?payment=success',
        merchantReference: 'HP-BLOCKED',
        uuid: 'honeypot',
      })
    }

    const {
      name,
      email,
      phone,
      terminal,
      quantity,
      guineaPigFood,
      rabbitFood,
      comments,
      totalPrice,
    } = result.data

    const { address, city, postalCode, parcelMachineUuid } = body

    const hayAmount = quantity
    const parcelMachine = terminal
    const notes = comments
    const grandTotal = totalPrice
    const hayPrice = quantity * 9

    const merchantReference = generateMerchantReference('HAY')

    let origin =
      request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || ''

    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      !origin
    ) {
      origin = 'https://petsvilla.ee'
    }

    const lineItems = []

    lineItems.push({
      name: `Lemmiklooma hein (${hayAmount} kott${hayAmount > 1 ? 'i' : ''})`,
      quantity: hayAmount,
      finalPrice: hayPrice,
    })

    if (guineaPigFood > 0) {
      lineItems.push({
        name: `Meriseatoit (${guineaPigFood} kg)`,
        quantity: 1,
        finalPrice: guineaPigFood * 9,
      })
    }

    if (rabbitFood > 0) {
      lineItems.push({
        name: `Küülikutoit (${rabbitFood} × 2 kg pakk)`,
        quantity: 1,
        finalPrice: rabbitFood * 6,
      })
    }

    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0] || name
    const lastName = nameParts.slice(1).join(' ') || '-'

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
    }

    console.log('=== STARTING MONTONIO ORDER CREATION ===')
    console.log('Sending order to Montonio:', JSON.stringify(orderData, null, 2))

    let paymentUrl, uuid
    try {
      console.log('Calling createMontonioOrder...')
      const montonioResult = await createMontonioOrder(orderData)
      paymentUrl = montonioResult.paymentUrl
      uuid = montonioResult.uuid
      console.log('Montonio order created successfully!')
      console.log('Payment URL:', paymentUrl)
      console.log('UUID:', uuid)
      console.log('=== MONTONIO ORDER CREATION COMPLETED ===')
    } catch (montonioError) {
      console.error('=== MONTONIO ORDER CREATION FAILED ===')
      console.error('Montonio API error:', montonioError)
      throw new Error(
        `Montonio API viga: ${
          montonioError instanceof Error
            ? montonioError.message
            : 'Tundmatu viga'
        }`
      )
    }

    try {
      const properties: Record<string, unknown> = {
        Name: {
          title: [{ text: { content: name } }],
        },
        Email: {
          email,
        },
        Phone: {
          phone_number: phone,
        },
        Terminal: {
          rich_text: [{ text: { content: parcelMachine || '' } }],
        },
        'Quantity (pakkide arv)': {
          number: hayAmount,
        },
        'Meriseatoit (kg)': {
          number: guineaPigFood,
        },
        'Küülikutoit (kg)': {
          number: rabbitFood * 2,
        },
        'Total Price (EUR)': {
          number: grandTotal,
        },
        Comments: {
          rich_text: [
            {
              text: {
                content: `${notes || ''}\n\nMontonio Reference: ${merchantReference}\nMontonio UUID: ${uuid}${
                  parcelMachineUuid
                    ? `\nPickup Point UUID: ${parcelMachineUuid}`
                    : ''
                }`,
              },
            },
          ],
        },
        Status: {
          select: { name: 'Töötlemisel' },
        },
      }

      await notion.pages.create({
        parent: { database_id: process.env.NOTION_HAY_DATABASE_ID! },
        properties: properties as any,
      })
      console.log(
        `Order ${merchantReference} saved to Notion with status: Töötlemisel`
      )
    } catch (notionError) {
      console.error('Error saving to Notion:', notionError)
    }

    try {
      await sendHayOrderEmail({
        name,
        email,
        phone,
        terminal: parcelMachine || 'Määramata',
        quantity: hayAmount,
        guineaPigFood,
        rabbitFood,
        totalPrice: grandTotal,
        comments: notes || '',
      })
      console.log(`Order confirmation email sent for ${merchantReference}`)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
    }

    return NextResponse.json({
      success: true,
      paymentUrl,
      merchantReference,
      uuid,
    })
  } catch (error) {
    reportError(error, { tags: { area: 'montonio', route: 'create-order' } })
    console.error('Error creating Montonio order:', error)

    return NextResponse.json(
      {
        error: 'Tellimuse loomisel tekkis viga. Palun proovi uuesti.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
