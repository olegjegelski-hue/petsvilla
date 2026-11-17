import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  COOKIE_CONSENT_KEY,
  writeConsent,
} from '@/lib/cookie-consent'
import { resolveGoogleTagIds } from '@/lib/google-ads'
import {
  bootstrapGoogleTag,
  googleTagLoadPlan,
  googleTagScriptUrl,
  sendGroupJoinClickOrRedirect,
} from '@/lib/gtag'

type GtagCall = unknown[]

function memoryStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size
    },
  }
}

function layerCalls(): GtagCall[] {
  return (window.dataLayer || []).map((entry) =>
    Array.from(entry as ArrayLike<unknown>)
  )
}

const storage = memoryStorage()

function installWindow(extra: Record<string, unknown> = {}) {
  const win = {
    dataLayer: undefined as unknown[] | undefined,
    gtag: undefined as ((...args: unknown[]) => void) | undefined,
    localStorage: storage,
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { pathname: '/telli-hein' },
    ...extra,
  }
  Object.defineProperty(globalThis, 'window', {
    value: win,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  })
  return win
}

describe('Google tag Consent Mode basic', () => {
  beforeEach(() => {
    storage.clear()
    installWindow()
  })

  afterEach(() => {
    storage.removeItem(COOKIE_CONSENT_KEY)
    vi.useRealTimers()
  })

  it('ilma nõusolekuta ei renderda Google skripte ega loo gtag-i', () => {
    writeConsent(false)
    const tags = resolveGoogleTagIds('G-Q1NSYHYYHB', 'AW-1016905977')
    expect(googleTagLoadPlan(false, tags)).toBeNull()
    expect(bootstrapGoogleTag(tags!)).toBe(false)
    expect(window.gtag).toBeUndefined()
    expect(window.dataLayer).toBeUndefined()
  })

  it('nõusolekuga laeb gtag.js URL-i ja consent default granted on enne config-e', () => {
    writeConsent(true)
    const tags = resolveGoogleTagIds('G-Q1NSYHYYHB', 'AW-1016905977')
    expect(googleTagLoadPlan(true, tags)).toEqual({
      scriptSrc: googleTagScriptUrl('G-Q1NSYHYYHB'),
    })
    expect(googleTagScriptUrl('G-Q1NSYHYYHB')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-Q1NSYHYYHB'
    )

    expect(bootstrapGoogleTag(tags!)).toBe(true)
    const calls = layerCalls()
    expect(calls[0][0]).toBe('consent')
    expect(calls[0][1]).toBe('default')
    expect(calls[0][2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
    expect(calls[1][0]).toBe('js')
    expect(calls[1][1]).toBeInstanceOf(Date)

    const gaConfig = calls.find(
      (call) => call[0] === 'config' && call[1] === 'G-Q1NSYHYYHB'
    )
    const adsConfig = calls.find(
      (call) => call[0] === 'config' && call[1] === 'AW-1016905977'
    )
    expect(gaConfig).toEqual([
      'config',
      'G-Q1NSYHYYHB',
      { page_path: '/telli-hein', anonymize_ip: true },
    ])
    expect(adsConfig).toEqual(['config', 'AW-1016905977'])

    const consentIdx = calls.findIndex((call) => call[0] === 'consent')
    const firstConfigIdx = calls.findIndex((call) => call[0] === 'config')
    expect(consentIdx).toBeLessThan(firstConfigIdx)
  })

  it('ilma nõusolekuta ei saada group_join_click-i ja suunab kohe', () => {
    writeConsent(false)
    const redirect = vi.fn()
    const cancel = sendGroupJoinClickOrRedirect({
      slug: 'merisigala',
      utmSource: 'kinnituskiri',
      utmMedium: 'email',
      redirect,
    })
    expect(redirect).toHaveBeenCalledTimes(1)
    expect(layerCalls().some((call) => call[1] === 'group_join_click')).toBe(
      false
    )
    cancel()
  })

  it('nõusolekuga saadab group_join_click-i ja suunab callback-iga', () => {
    writeConsent(true)
    const redirect = vi.fn()
    sendGroupJoinClickOrRedirect({
      slug: 'merisigala',
      utmSource: 'kinnituskiri',
      utmMedium: 'email',
      redirect,
    })
    expect(redirect).not.toHaveBeenCalled()
    const event = layerCalls().find((call) => call[1] === 'group_join_click')
    expect(event?.[0]).toBe('event')
    expect(event?.[2]).toMatchObject({
      group: 'merisigala',
      link_source: 'kinnituskiri',
      link_medium: 'email',
    })
    const params = event?.[2] as { event_callback: () => void }
    params.event_callback()
    expect(redirect).toHaveBeenCalledTimes(1)
  })

  it('nõusolekuga suunab 800 ms pärast, kui callback ei tule', () => {
    writeConsent(true)
    vi.useFakeTimers()
    const redirect = vi.fn()
    sendGroupJoinClickOrRedirect({
      slug: 'kuulikusobrad',
      redirect,
    })
    expect(redirect).not.toHaveBeenCalled()
    vi.advanceTimersByTime(799)
    expect(redirect).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(redirect).toHaveBeenCalledTimes(1)
  })
})
