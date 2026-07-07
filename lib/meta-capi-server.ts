import { createHash } from 'crypto'

const META_PIXEL_ID = process.env.META_PIXEL_ID || '847652724033387'
const META_GRAPH_API_VERSION = 'v21.0'

export interface MetaPurchaseEventInput {
  orderId: string
  value: number
  currency: string
  email?: string
  phone?: string
  numItems?: number
  fbp?: string
  fbc?: string
  eventSourceUrl?: string
  clientIpAddress?: string
  clientUserAgent?: string
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hashEmail(email: string): string | undefined {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return undefined
  return sha256(normalized)
}

function hashPhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return undefined

  let normalized = digits
  if (normalized.startsWith('372')) {
    normalized = normalized
  } else if (normalized.startsWith('0')) {
    normalized = `372${normalized.slice(1)}`
  } else {
    normalized = `372${normalized}`
  }

  return sha256(normalized)
}

export async function sendMetaPurchaseEvent(
  input: MetaPurchaseEventInput
): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  const token = process.env.META_CAPI_TOKEN
  if (!token) {
    return { success: false, error: 'META_CAPI_TOKEN is not configured' }
  }

  const userData: Record<string, string> = {}

  const hashedEmail = input.email ? hashEmail(input.email) : undefined
  if (hashedEmail) userData.em = hashedEmail

  const hashedPhone = input.phone ? hashPhone(input.phone) : undefined
  if (hashedPhone) userData.ph = hashedPhone

  if (input.fbp) userData.fbp = input.fbp
  if (input.fbc) userData.fbc = input.fbc
  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent

  const eventData: Record<string, unknown> = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.orderId,
    action_source: 'website',
    user_data: userData,
    custom_data: {
      value: input.value,
      currency: input.currency,
      ...(input.numItems !== undefined ? { num_items: input.numItems } : {}),
    },
  }

  if (input.eventSourceUrl) {
    eventData.event_source_url = input.eventSourceUrl
  }

  const payload: Record<string, unknown> = {
    data: [eventData],
    access_token: token,
  }

  const testEventCode = process.env.META_TEST_EVENT_CODE
  if (testEventCode) {
    payload.test_event_code = testEventCode
  }

  const response = await fetch(
    `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_PIXEL_ID}/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    return {
      success: false,
      error: `Meta CAPI request failed (${response.status})`,
    }
  }

  return { success: true }
}

export function getClientIpFromHeaders(headers: Headers): string | undefined {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0]?.trim()
    if (ip) return ip
  }

  const realIp = headers.get('x-real-ip')?.trim()
  return realIp || undefined
}

export function calculateHayOrderNumItems(props: {
  hayQuantity?: number
  guineaPigFoodKg?: number
  rabbitFoodKg?: number
}): number {
  const hayQuantity = props.hayQuantity ?? 1
  const guineaPigFoodKg = props.guineaPigFoodKg ?? 0
  const rabbitFoodKg = props.rabbitFoodKg ?? 0

  return (
    hayQuantity +
    (guineaPigFoodKg > 0 ? 1 : 0) +
    (rabbitFoodKg > 0 ? 1 : 0)
  )
}

export function hasMetaPurchaseBeenSent(comments: string): boolean {
  return /Meta Purchase sent:/i.test(comments)
}

export function appendMetaPurchaseMarker(comments: string): string {
  return `${comments}\n\nMeta Purchase sent: ${new Date().toISOString()}`.slice(0, 2000)
}
