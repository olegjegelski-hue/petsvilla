/**
 * GA4 sündmused gtag'i kaudu. Consent Mode (default denied + applyGtagConsent)
 * jääb muutmata — sündmused lähevad sama gtag'i kaudu nagu lehevaated.
 * Nime, e-posti ega telefoni ei saadeta.
 */

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
  if (typeof window === 'undefined') return
  const gtag = window.gtag
  if (typeof gtag !== 'function') return

  gtag('event', 'purchase', buildGa4PurchaseEvent(input))
}
