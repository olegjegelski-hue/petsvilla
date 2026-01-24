
import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

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
    const { name, email, phone, subject, message, product, website, formStartedAt } = body

    // Honeypot check (bots fill hidden fields)
    if (website && String(website).trim().length > 0) {
      return NextResponse.json(
        { message: 'Sõnum edukalt saadetud!' },
        { status: 200 }
      )
    }

    // Minimum time-to-submit check (simple bot protection)
    if (formStartedAt && Date.now() - Number(formStartedAt) < 3000) {
      return NextResponse.json(
        { error: 'Palun proovi uuesti.' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nimi, e-post ja sõnum on kohustuslikud' },
        { status: 400 }
      )
    }

    const trimmedName = String(name).trim()
    const trimmedEmail = String(email).trim().toLowerCase()
    const trimmedMessage = String(message).trim()
    const trimmedSubject = subject ? String(subject).trim() : ''
    const trimmedPhone = phone ? String(phone).trim() : ''

    if (trimmedName.length < 2 || trimmedName.length > 120) {
      return NextResponse.json(
        { error: 'Nimi peab olema 2–120 tähemärki.' },
        { status: 400 }
      )
    }

    if (trimmedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Palun sisesta korrektne e-posti aadress.' },
        { status: 400 }
      )
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'Sõnum peab olema 10–2000 tähemärki.' },
        { status: 400 }
      )
    }

    if (trimmedSubject && trimmedSubject.length > 120) {
      return NextResponse.json(
        { error: 'Teema on liiga pikk.' },
        { status: 400 }
      )
    }

    if (trimmedPhone && !/^[+\d\s\-()]{5,20}$/.test(trimmedPhone)) {
      return NextResponse.json(
        { error: 'Telefoninumber on vigase formaadiga.' },
        { status: 400 }
      )
    }

    const contactData = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || undefined,
      subject: trimmedSubject || undefined,
      message: trimmedMessage,
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
