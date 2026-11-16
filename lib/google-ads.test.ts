import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  COOKIE_CONSENT_KEY,
  applyGtagConsent,
  writeConsent,
} from '@/lib/cookie-consent'
import {
  googleAdsPurchaseSendTo,
  isPurchaseAlreadyTracked,
  isValidGoogleAdsId,
  isValidGoogleAdsSendTo,
  markPurchaseTracked,
  resolveGoogleTagIds,
  shouldTrackPaidHayPurchase,
  trackGoogleAdsPurchase,
} from '@/lib/google-ads'

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

describe('isValidGoogleAdsId', () => {
  it('lubab AW- ja numbrid', () => {
    expect(isValidGoogleAdsId('AW-1016905977')).toBe(true)
    expect(isValidGoogleAdsId(' AW-1016905977 ')).toBe(true)
  })

  it('lükkab tagasi tühja, GA4 ja vaba teksti', () => {
    expect(isValidGoogleAdsId('')).toBe(false)
    expect(isValidGoogleAdsId('G-XXXX')).toBe(false)
    expect(isValidGoogleAdsId("AW-1';alert(1)//")).toBe(false)
  })
})

describe('isValidGoogleAdsSendTo', () => {
  it('lubab AW-…/silt kuju', () => {
    expect(isValidGoogleAdsSendTo('AW-1016905977/AbCdEfGhIjk')).toBe(true)
    expect(isValidGoogleAdsSendTo('AW-1/conv-label_1')).toBe(true)
  })

  it('lükkab tagasi ilma sildita või vale kuju', () => {
    expect(isValidGoogleAdsSendTo('')).toBe(false)
    expect(isValidGoogleAdsSendTo('AW-1016905977')).toBe(false)
    expect(isValidGoogleAdsSendTo('AW-1016905977/bad label')).toBe(false)
  })
})

describe('resolveGoogleTagIds', () => {
  it('ei laadi midagi, kui kumbagi ID-d pole', () => {
    expect(resolveGoogleTagIds(undefined, undefined)).toBeNull()
    expect(resolveGoogleTagIds('G-XXXXXXXXXX', '')).toBeNull()
    expect(resolveGoogleTagIds(undefined, 'not-an-id')).toBeNull()
  })

  it('laeb gtag.js GA4 ID-ga, kui ainult GA4 on olemas', () => {
    expect(resolveGoogleTagIds('G-ABC123', undefined)).toEqual({
      scriptId: 'G-ABC123',
      gaId: 'G-ABC123',
    })
  })

  it('laeb gtag.js Adsi ID-ga, kui GA4 puudub', () => {
    expect(resolveGoogleTagIds(undefined, 'AW-1016905977')).toEqual({
      scriptId: 'AW-1016905977',
      adsId: 'AW-1016905977',
    })
  })

  it('hoiab GA4 scripti ID-d, kui mõlemad on olemas', () => {
    expect(resolveGoogleTagIds('G-ABC123', 'AW-1016905977')).toEqual({
      scriptId: 'G-ABC123',
      gaId: 'G-ABC123',
      adsId: 'AW-1016905977',
    })
  })
})

describe('googleAdsPurchaseSendTo', () => {
  const prev = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO

  afterEach(() => {
    if (prev == null) delete process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO
    else process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO = prev
  })

  it('tagastab undefined kui muutujat pole', () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO
    expect(googleAdsPurchaseSendTo()).toBeUndefined()
  })

  it('tagastab undefined tühja ja vale kuju korral', () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO = '   '
    expect(googleAdsPurchaseSendTo()).toBeUndefined()
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO = 'AW-1016905977'
    expect(googleAdsPurchaseSendTo()).toBeUndefined()
  })

  it('tagastab AW-…/silt väärtuse', () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO =
      'AW-1016905977/AbCdEfGhIjk'
    expect(googleAdsPurchaseSendTo()).toBe('AW-1016905977/AbCdEfGhIjk')
  })
})

describe('shouldTrackPaidHayPurchase', () => {
  const purchase = {
    orderId: 'HAY-1',
    value: 12.5,
    currency: 'EUR',
    email: 'klient@example.com',
    phone: '+3725127938',
  }

  it('lubab ainult kinnitatud makse + purchase payloadiga', () => {
    expect(shouldTrackPaidHayPurchase({ paid: true, purchase })).toBe(true)
  })

  it('keelab maksmata, ootel ja purchase-ita vastused', () => {
    expect(shouldTrackPaidHayPurchase({ paid: false, purchase })).toBe(false)
    expect(
      shouldTrackPaidHayPurchase({ paid: true, purchase: undefined })
    ).toBe(false)
    expect(shouldTrackPaidHayPurchase({ paid: undefined, purchase })).toBe(false)
  })
})

describe('trackGoogleAdsPurchase', () => {
  const prevSendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO
  const gtagCalls: GtagCall[] = []
  const storage = memoryStorage()

  beforeEach(() => {
    gtagCalls.length = 0
    storage.clear()
    delete process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO

    const gtag = (...args: unknown[]) => {
      gtagCalls.push(args)
    }

    const win = {
      gtag,
      localStorage: storage,
      sessionStorage: storage,
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {},
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
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: storage,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    if (prevSendTo == null) delete process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO
    else process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO = prevSendTo
    storage.removeItem(COOKIE_CONSENT_KEY)
  })

  it('ei saada konversiooni ilma analüütikanõusolekuta', () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO =
      'AW-1016905977/AbCdEfGhIjk'
    writeConsent(false)
    gtagCalls.length = 0
    trackGoogleAdsPurchase({
      orderId: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
    })
    expect(gtagCalls).toEqual([])
  })

  it('ei saada konversiooni, kui window.gtag puudub', () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO =
      'AW-1016905977/AbCdEfGhIjk'
    writeConsent(true)
    gtagCalls.length = 0
    ;(globalThis as { window: { gtag?: unknown } }).window.gtag = undefined
    trackGoogleAdsPurchase({
      orderId: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
    })
    expect(gtagCalls).toEqual([])
  })

  it('saadab conversion ilma isikuandmeteta', () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO =
      'AW-1016905977/AbCdEfGhIjk'
    writeConsent(true)
    gtagCalls.length = 0
    trackGoogleAdsPurchase({
      orderId: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
    })
    expect(gtagCalls).toEqual([
      [
        'event',
        'conversion',
        {
          send_to: 'AW-1016905977/AbCdEfGhIjk',
          value: 12.5,
          currency: 'EUR',
          transaction_id: 'HAY-1',
        },
      ],
    ])
    const serialized = JSON.stringify(gtagCalls)
    expect(serialized.includes('@')).toBe(false)
    expect(serialized.toLowerCase().includes('email')).toBe(false)
    expect(serialized.toLowerCase().includes('phone')).toBe(false)
    expect(serialized.toLowerCase().includes('nimi')).toBe(false)
  })

  it('ei saada konversiooni, kui send_to puudub või on vale', () => {
    writeConsent(true)
    gtagCalls.length = 0
    trackGoogleAdsPurchase({
      orderId: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
    })
    expect(gtagCalls).toEqual([])
  })

  it('ei teki topeltloendust sama sessionStorage võtmega', () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO =
      'AW-1016905977/AbCdEfGhIjk'
    writeConsent(true)
    gtagCalls.length = 0
    const purchase = { orderId: 'HAY-1', value: 12.5, currency: 'EUR' }

    const fireLikeConfirmationPage = () => {
      if (isPurchaseAlreadyTracked(purchase.orderId)) return
      trackGoogleAdsPurchase(purchase)
      markPurchaseTracked(purchase.orderId)
    }

    fireLikeConfirmationPage()
    fireLikeConfirmationPage()
    expect(gtagCalls).toHaveLength(1)
    expect(isPurchaseAlreadyTracked('HAY-1')).toBe(true)
  })
})

describe('Consent Mode kehtib ka Adsi kohta', () => {
  it('applyGtagConsent uuendab ad_storage koos analytics_storage-ga', () => {
    const gtagCalls: GtagCall[] = []
    Object.defineProperty(globalThis, 'window', {
      value: { gtag: (...args: unknown[]) => gtagCalls.push(args) },
      configurable: true,
      writable: true,
    })

    applyGtagConsent(true)
    applyGtagConsent(false)

    expect(gtagCalls).toEqual([
      [
        'consent',
        'update',
        {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        },
      ],
      [
        'consent',
        'update',
        {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        },
      ],
    ])
  })
})
