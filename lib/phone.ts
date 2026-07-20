/**
 * Telefoni normaliseerimine SmartPost / Montonio jaoks (+372).
 */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')

  if (cleaned.startsWith('372')) {
    cleaned = '+' + cleaned
  } else if (cleaned.length > 0 && /^\d/.test(cleaned)) {
    cleaned = '+372' + cleaned
  }

  return cleaned
}

/** Heinatellimuse summa (EUR) — sama loogika mis /api/hay-order. */
export function calculateHayOrderTotal(params: {
  quantity: number
  guineaPigFood?: number
  rabbitFood?: number
}): number {
  const hay = Math.max(0, Number(params.quantity) || 0) * 9
  const guinea = Math.max(0, Number(params.guineaPigFood) || 0) * 9
  // Küülikutoit: 6€ / 2kg pakend
  const rabbit = Math.max(0, Number(params.rabbitFood) || 0) * 6
  return hay + guinea + rabbit
}
