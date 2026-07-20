/** Shared cookie / marketing consent (GDPR). Stored in localStorage. */

export const COOKIE_CONSENT_KEY = 'petsvilla_cookie_consent'
export const COOKIE_CONSENT_CHANGE_EVENT = 'petsvilla-cookie-consent-change'
export const COOKIE_SETTINGS_OPEN_EVENT = 'petsvilla-cookie-settings-open'

export type CookieConsent = {
  necessary: true
  /** GA4 + Meta Pixel (turundus/analüütika) */
  analytics: boolean
  timestamp?: number
}

export function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as {
      analytics?: boolean
      marketing?: boolean
      timestamp?: number
    }
    const analytics =
      typeof parsed.analytics === 'boolean'
        ? parsed.analytics
        : typeof parsed.marketing === 'boolean'
          ? parsed.marketing
          : null
    if (analytics === null) return null
    return {
      necessary: true,
      analytics,
      timestamp: parsed.timestamp,
    }
  } catch {
    return null
  }
}

/** Turundus-/analüütikaskriptid (GA4 + Meta Pixel) lubatud. */
export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true
}

export function writeConsent(analytics: boolean): CookieConsent {
  const value: CookieConsent = {
    necessary: true,
    analytics,
    timestamp: Date.now(),
  }
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value))
  applyGtagConsent(analytics)
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: value })
  )
  return value
}

export function applyGtagConsent(analytics: boolean): void {
  if (typeof window === 'undefined' || !window.gtag) return

  const state = analytics ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  })
}

export function onConsentChange(
  callback: (consent: CookieConsent) => void
): () => void {
  const handler = (event: Event) => {
    callback((event as CustomEvent<CookieConsent>).detail)
  }
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, handler)
  return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, handler)
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT))
}

export function onCookieSettingsOpen(callback: () => void): () => void {
  window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, callback)
  return () => window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, callback)
}

declare global {
  interface Window {
    gtag?: (
      command: 'consent',
      action: 'default' | 'update',
      params: {
        analytics_storage?: 'granted' | 'denied'
        ad_storage?: 'granted' | 'denied'
        ad_user_data?: 'granted' | 'denied'
        ad_personalization?: 'granted' | 'denied'
        wait_for_update?: number
      }
    ) => void
  }
}
