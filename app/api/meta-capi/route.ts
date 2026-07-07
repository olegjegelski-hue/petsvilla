import { NextRequest, NextResponse } from 'next/server'
import {
  getClientIpFromHeaders,
  sendMetaPurchaseEvent,
} from '@/lib/meta-capi-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderId,
      value,
      currency,
      email,
      phone,
      numItems,
      fbp,
      fbc,
      eventSourceUrl,
    } = body

    if (!orderId || value === undefined || !currency) {
      return NextResponse.json(
        { error: 'orderId, value, and currency are required' },
        { status: 400 }
      )
    }

    const parsedValue = Number(value)
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return NextResponse.json(
        { error: 'value must be a valid non-negative number' },
        { status: 400 }
      )
    }

    const result = await sendMetaPurchaseEvent({
      orderId: String(orderId),
      value: parsedValue,
      currency: String(currency),
      email: email ? String(email) : undefined,
      phone: phone ? String(phone) : undefined,
      numItems:
        numItems !== undefined && numItems !== null
          ? Number(numItems)
          : undefined,
      fbp: fbp ? String(fbp) : undefined,
      fbc: fbc ? String(fbc) : undefined,
      eventSourceUrl: eventSourceUrl ? String(eventSourceUrl) : undefined,
      clientIpAddress: getClientIpFromHeaders(request.headers),
      clientUserAgent: request.headers.get('user-agent') || undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send Meta CAPI event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process Meta CAPI request' },
      { status: 500 }
    )
  }
}
