import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'
import { reportError } from '@/lib/report-error'
import { validateContactForm } from '@/lib/contact-validation'
import { rateLimitExceededResponse } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitExceededResponse(request, {
      bucket: 'contact',
      route: 'contact',
      max: 5,
      windowMs: 10 * 60 * 1000,
    })
    if (limited) return limited

    const body = await request.json()
    const result = validateContactForm(body)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    // Honeypot — vasta edukalt, ära saada meili
    if (result.honeypot) {
      reportError(new Error('Contact honeypot triggered'), {
        tags: { area: 'abuse', route: 'contact' },
      })
      return NextResponse.json(
        { message: 'Sõnum edukalt saadetud!' },
        { status: 200 }
      )
    }

    const contactData = {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || undefined,
      subject: result.data.subject || undefined,
      message: result.data.message,
      product: result.data.product,
    }

    console.log('Contact form submission:', {
      ...contactData,
      timestamp: new Date().toISOString(),
    })

    await sendContactEmail(contactData)

    return NextResponse.json(
      {
        message: 'Sõnum edukalt saadetud!',
        id: 'temp-' + Date.now(),
      },
      { status: 201 }
    )
  } catch (error) {
    reportError(error, { tags: { area: 'email', route: 'contact' } })
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Serveriviga. Palun proovige hiljem uuesti.' },
      { status: 500 }
    )
  }
}
