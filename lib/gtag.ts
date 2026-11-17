import { hasAnalyticsConsent } from '@/lib/cookie-consent'
import { buildGroupJoinClickParams } from '@/lib/facebook-groups'

export const GTAG_SCRIPT_ORIGIN = 'https://www.googletagmanager.com/gtag/js'
export const GROUP_JOIN_REDIRECT_FALLBACK_MS = 800

export const GTAG_CONSENT_GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const

export type GoogleTagIds = {
  scriptId: string
  gaId?: string
  adsId?: string
}

function asGtagArgs(entry: unknown): ArrayLike<unknown> | null {
  if (!entry || (typeof entry !== 'object' && typeof entry !== 'function')) {
    return null
  }
  return entry as ArrayLike<unknown>
}

function dataLayerHas(command: string, action?: string): boolean {
  const layer = window.dataLayer || []
  return layer.some((entry) => {
    const args = asGtagArgs(entry)
    if (!args || args[0] !== command) return false
    if (action === undefined) return true
    return args[1] === action
  })
}

/**
 * dataLayer + gtag stub, ainult analüütikanõusoleku korral.
 * Sündmused lähevad järjekorda, kui gtag.js alles laeb.
 */
export function ensureGtag(): ((...args: unknown[]) => void) | undefined {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return undefined

  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments)
    }
  }
  return window.gtag
}

export function googleTagScriptUrl(scriptId: string): string {
  return `${GTAG_SCRIPT_ORIGIN}?id=${scriptId}`
}

/** Komponent renderdab gtag.js ainult nõusoleku + kehtivate ID-de korral. */
export function googleTagLoadPlan(
  consented: boolean,
  tags: GoogleTagIds | null
): { scriptSrc: string } | null {
  if (!consented || !tags) return null
  return { scriptSrc: googleTagScriptUrl(tags.scriptId) }
}

/**
 * Consent default granted enne js/config'e. Korduv kutse ei lisa duplikaate.
 */
export function bootstrapGoogleTag(tags: GoogleTagIds): boolean {
  const gtag = ensureGtag()
  if (!gtag) return false

  if (!dataLayerHas('consent', 'default')) {
    gtag('consent', 'default', { ...GTAG_CONSENT_GRANTED })
  }
  if (!dataLayerHas('js')) {
    gtag('js', new Date())
  }
  if (tags.gaId && !dataLayerHas('config', tags.gaId)) {
    gtag('config', tags.gaId, {
      page_path:
        typeof window.location?.pathname === 'string'
          ? window.location.pathname
          : '/',
      anonymize_ip: true,
    })
  }
  if (tags.adsId && !dataLayerHas('config', tags.adsId)) {
    gtag('config', tags.adsId)
  }
  return true
}

export function sendGroupJoinClickOrRedirect(input: {
  slug: string
  utmSource?: string
  utmMedium?: string
  redirect: () => void
  fallbackMs?: number
}): () => void {
  const { slug, utmSource, utmMedium, redirect, fallbackMs = GROUP_JOIN_REDIRECT_FALLBACK_MS } =
    input

  if (typeof window === 'undefined' || !hasAnalyticsConsent()) {
    redirect()
    return () => {}
  }

  const gtag = ensureGtag()
  if (typeof gtag !== 'function') {
    redirect()
    return () => {}
  }

  const timer = setTimeout(redirect, fallbackMs)
  gtag('event', 'group_join_click', {
    ...buildGroupJoinClickParams(slug, utmSource, utmMedium),
    event_callback: () => {
      clearTimeout(timer)
      redirect()
    },
  })

  return () => clearTimeout(timer)
}
