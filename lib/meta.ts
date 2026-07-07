export interface TrackPurchaseInput {
  orderId: string
  value: number
  currency: string
  email?: string
  phone?: string
  numItems?: number
}

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export async function trackPurchase({
  orderId,
  value,
  currency,
  email,
  phone,
  numItems,
}: TrackPurchaseInput): Promise<void> {
  if (typeof window === 'undefined') return

  if (window.fbq) {
    window.fbq(
      'track',
      'Purchase',
      {
        value,
        currency,
        ...(numItems !== undefined ? { num_items: numItems } : {}),
      },
      { eventID: orderId }
    )
  }

  const fbp = getCookie('_fbp')
  const fbc = getCookie('_fbc')

  await fetch('/api/meta-capi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId,
      value,
      currency,
      email,
      phone,
      numItems,
      fbp,
      fbc,
      eventSourceUrl: window.location.href,
    }),
  })
}
