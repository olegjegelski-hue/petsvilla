
import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, product } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nimi, e-post ja sõnum on kohustuslikud' },
        { status: 400 }
      )
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      subject: subject?.trim() || undefined,
      message: message.trim(),
      product: product || undefined,
    }

    // Log the contact form submission
    console.log('Contact form submission:', {
      ...contactData,
      timestamp: new Date().toISOString()
    })

    // Send email notification
    await sendContactEmail(contactData)

    return NextResponse.json(
      { 
        message: 'Sõnum edukalt saadetud!',
        id: 'temp-' + Date.now()
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Serveriviga. Palun proovige hiljem uuesti.' },
      { status: 500 }
    )
  }
}
