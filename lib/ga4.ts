/**
 * GA4 sündmused gtag'i kaudu. Silt laeb ainult pärast analüütikanõusolekut
 * (Consent Mode basic). Nime, e-posti ega telefoni ei saadeta.
 */

import { hasAnalyticsConsent } from '@/lib/cookie-consent'
import { ensureGtag } from '@/lib/gtag'

export type Ga4PurchaseInput = {
  orderId: string
  value: number
  currency: string
  quantity?: number
}

export function buildGa4PurchaseEvent(input: Ga4PurchaseInput): {
  transaction_id: string
  value: number
  currency: string
  items: Array<{ item_id: string; item_name: string; quantity: number }>
} {
  return {
    transaction_id: input.orderId,
    value: input.value,
    currency: input.currency,
    items: [
      {
        item_id: 'hein',
        item_name: 'Hein',
        quantity: input.quantity ?? 1,
      },
    ],
  }
}

export function trackGa4Purchase(input: Ga4PurchaseInput): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return
  const gtag = ensureGtag()
  if (typeof gtag !== 'function') return

  gtag('event', 'purchase', buildGa4PurchaseEvent(input))
}
