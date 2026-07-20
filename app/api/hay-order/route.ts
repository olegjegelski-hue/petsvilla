import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { sendHayOrderEmail } from '@/lib/email'
import { reportError } from '@/lib/report-error'
import { validateHayOrderForm } from '@/lib/hay-order-validation'
import { rateLimitExceededResponse } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitExceededResponse(request, {
      bucket: 'hay-order',
      route: 'hay-order',
      max: 5,
      windowMs: 10 * 60 * 1000,
    })
    if (limited) return limited

    const body = await request.json()
    const result = validateHayOrderForm(body)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    if (result.honeypot) {
      reportError(new Error('Hay-order honeypot triggered'), {
        tags: { area: 'abuse', route: 'hay-order' },
      })
      return NextResponse.json(
        { message: 'Tellimus edukalt saadetud' },
        { status: 200 }
      )
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

    const databaseId = process.env.NOTION_HAY_DATABASE_ID

    if (!databaseId) {
      console.error('NOTION_HAY_DATABASE_ID is not set')
      return NextResponse.json(
        { error: 'Serveri konfiguratsioon puudu' },
        { status: 500 }
      )
    }

    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [{ text: { content: name } }],
        },
        Email: {
          email: email,
        },
        Phone: {
          phone_number: phone,
        },
        Terminal: {
          rich_text: [{ text: { content: terminal } }],
        },
        'Quantity (pakkide arv)': {
          number: quantity,
        },
        'Meriseatoit (kg)': {
          number: guineaPigFood,
        },
        'Küülikutoit (kg)': {
          number: rabbitFood * 2, // Sold in 2kg packages
        },
        'Total Price (EUR)': {
          number: totalPrice,
        },
        Comments: {
          rich_text: [{ text: { content: comments || '' } }],
        },
        Status: {
          select: {
            name: 'Uus',
          },
        },
      },
    })

    await sendHayOrderEmail({
      name,
      email,
      phone,
      terminal,
      quantity,
      guineaPigFood,
      rabbitFood,
      totalPrice,
      comments,
    })

    return NextResponse.json(
      { message: 'Tellimus edukalt saadetud' },
      { status: 200 }
    )
  } catch (error) {
    reportError(error, { tags: { area: 'notion', route: 'hay-order' } })
    console.error('Error processing hay order:', error)
    return NextResponse.json(
      { error: 'Viga tellimuse töötlemisel' },
      { status: 500 }
    )
  }
}
