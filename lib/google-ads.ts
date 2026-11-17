import { hasAnalyticsConsent } from '@/lib/cookie-consent'
import { ensureGtag } from '@/lib/gtag'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Google Ads konto silt, nt AW-1016905977 */
export const GOOGLE_ADS_ID_PATTERN = /^AW-\d+$/
/** Konversioonisilt, nt AW-1016905977/AbCdEfGhIjk */
export const GOOGLE_ADS_SEND_TO_PATTERN = /^AW-\d+\/[\w-]+$/

export const PURCHASE_TRACKED_STORAGE_KEY_PREFIX = 'meta_purchase_tracked_'

export type HayPurchasePayload = {
  orderId: string
  value: number
  currency: string
  email?: string
  phone?: string
  numItems?: number
}

export function isValidGoogleAdsId(id: string): boolean {
  return GOOGLE_ADS_ID_PATTERN.test(id.trim())
}

export function isValidGoogleAdsSendTo(value: string): boolean {
  return GOOGLE_ADS_SEND_TO_PATTERN.test(value.trim())
}

export function isValidGaMeasurementId(id: string | undefined | null): boolean {
  if (!id) return false
  const trimmed = id.trim()
  return trimmed.length > 0 && trimmed !== 'G-XXXXXXXXXX'
}

export function resolveGoogleTagIds(
  gaMeasurementId?: string,
  adsId?: string
): { scriptId: string; gaId?: string; adsId?: string } | null {
  const gaId = isValidGaMeasurementId(gaMeasurementId)
    ? gaMeasurementId!.trim()
    : undefined
  const ads = adsId && isValidGoogleAdsId(adsId) ? adsId.trim() : undefined
  if (!gaId && !ads) return null
  return {
    scriptId: gaId ?? ads!,
    ...(gaId ? { gaId } : {}),
    ...(ads ? { adsId: ads } : {}),
  }
}

export function googleAdsPurchaseSendTo(): string | undefined {
  const value = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO?.trim()
  if (!value || !isValidGoogleAdsSendTo(value)) return undefined
  return value
}

export function shouldTrackPaidHayPurchase(data: {
  paid?: unknown
  purchase?: HayPurchasePayload | null
}): data is { paid: true; purchase: HayPurchasePayload } {
  return (
    data.paid === true &&
    !!data.purchase &&
    typeof data.purchase.orderId === 'string' &&
    data.purchase.orderId.length > 0 &&
    typeof data.purchase.value === 'number' &&
    typeof data.purchase.currency === 'string'
  )
}

export function isPurchaseAlreadyTracked(orderId: string): boolean {
  if (typeof sessionStorage === 'undefined') return false
  try {
    return (
      sessionStorage.getItem(`${PURCHASE_TRACKED_STORAGE_KEY_PREFIX}${orderId}`) ===
      '1'
    )
  } catch {
    return false
  }
}

export function markPurchaseTracked(orderId: string): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(
      `${PURCHASE_TRACKED_STORAGE_KEY_PREFIX}${orderId}`,
      '1'
    )
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Heinatellimuse Google Ads konversioon.
 * Ei saada nime, e-posti ega telefoni.
 */
export function trackGoogleAdsPurchase(input: {
  orderId: string
  value: number
  currency: string
}): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return
  const gtag = ensureGtag()
  if (typeof gtag !== 'function') return

  const sendTo = googleAdsPurchaseSendTo()
  if (!sendTo) return

  gtag('event', 'conversion', {
    send_to: sendTo,
    value: input.value,
    currency: input.currency,
    transaction_id: input.orderId,
  })
}
