
import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { sendHayOrderEmail } from '@/lib/email'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, terminal, quantity, guineaPigFood, rabbitFood, comments } = body

    if (!name || !email || !phone || !terminal || !quantity) {
      return NextResponse.json(
        { error: 'Palun täitke kõik kohustuslikud väljad' },
        { status: 400 }
      )
    }

    const databaseId = process.env.NOTION_HAY_DATABASE_ID
    
    if (!databaseId) {
      console.error('NOTION_HAY_DATABASE_ID is not set')
      return NextResponse.json(
        { error: 'Serveri konfiguratsioon puudu' },
        { status: 500 }
      )
    }

    // Calculate total price
    // - Hay: quantity * 9€
    // - Guinea pig food: guineaPigFood * 9€
    // - Rabbit food: rabbitFood * 6€ (sold in 2kg packages)
    const hayPrice = parseInt(quantity) * 9
    const guineaPigFoodPrice = parseInt(guineaPigFood || '0') * 9
    const rabbitFoodPrice = parseInt(rabbitFood || '0') * 6
    const totalPrice = hayPrice + guineaPigFoodPrice + rabbitFoodPrice

    // Create new page in Notion database
    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Phone: {
          phone_number: phone,
        },
        Terminal: {
          rich_text: [
            {
              text: {
                content: terminal,
              },
            },
          ],
        },
        'Quantity (pakkide arv)': {
          number: parseInt(quantity),
        },
        'Meriseatoit (kg)': {
          number: parseInt(guineaPigFood || '0'),
        },
        'Küülikutoit (kg)': {
          number: parseInt(rabbitFood || '0') * 2,  // Sold in 2kg packages
        },
        'Total Price (EUR)': {
          number: totalPrice,
        },
        Comments: {
          rich_text: [
            {
              text: {
                content: comments || '',
              },
            },
          ],
        },
        Status: {
          select: {
            name: 'Uus',
          },
        },
      },
    })

    // Send email notification
    await sendHayOrderEmail({
      name,
      email,
      phone,
      terminal,
      quantity: parseInt(quantity),
      guineaPigFood: parseInt(guineaPigFood || '0'),
      rabbitFood: parseInt(rabbitFood || '0'),
      totalPrice,
      comments,
    })

    return NextResponse.json(
      { message: 'Tellimus edukalt saadetud' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing hay order:', error)
    return NextResponse.json(
      { error: 'Viga tellimuse töötlemisel' },
      { status: 500 }
    )
  }
}
