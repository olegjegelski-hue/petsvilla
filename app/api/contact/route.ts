import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'
import { reportError } from '@/lib/report-error'
import { validateContactForm } from '@/lib/contact-validation'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp.trim()
  }
  return 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count += 1
  rateLimitStore.set(ip, entry)
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Liiga palju päringuid. Palun proovi mõne aja pärast uuesti.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = validateContactForm(body)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    // Honeypot — vasta edukalt, ära saada meili
    if (result.honeypot) {
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
