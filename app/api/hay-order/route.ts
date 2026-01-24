
import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { sendHayOrderEmail } from '@/lib/email'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Format phone number to ensure +372 prefix for SmartPost (without spaces)
function formatPhoneNumber(phone: string): string {
  // Remove ALL spaces and non-digit characters except +
  let cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')
  
  // If starts with 372 (without +), add the +
  if (cleaned.startsWith('372')) {
    cleaned = '+' + cleaned
  }
  // If starts with a digit (like 5...), add +372
  else if (cleaned.length > 0 && /^\d/.test(cleaned)) {
    cleaned = '+372' + cleaned
  }
  // If already has + but not +372, keep as is
  
  return cleaned
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { name, email, phone, terminal, quantity, guineaPigFood, rabbitFood, comments } = body

    if (!name || !email || !phone || !terminal || !quantity) {
      return NextResponse.json(
        { error: 'Palun täitke kõik kohustuslikud väljad' },
        { status: 400 }
      )
    }

    // Format phone number to ensure +372 prefix for SmartPost
    phone = formatPhoneNumber(phone)

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
