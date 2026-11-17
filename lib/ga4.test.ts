import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  COOKIE_CONSENT_KEY,
  writeConsent,
} from '@/lib/cookie-consent'
import { shouldTrackPaidHayPurchase } from '@/lib/google-ads'
import { buildGa4PurchaseEvent, trackGa4Purchase } from '@/lib/ga4'

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

describe('GA4 purchase', () => {
  const purchase = {
    orderId: 'HAY-1',
    value: 12.5,
    currency: 'EUR',
    email: 'klient@example.com',
    phone: '+3725127938',
    numItems: 2,
  }

  const gtagCalls: GtagCall[] = []
  const storage = memoryStorage()

  beforeEach(() => {
    gtagCalls.length = 0
    storage.clear()
    const gtag = (...args: unknown[]) => {
      gtagCalls.push(args)
    }
    Object.defineProperty(globalThis, 'window', {
      value: {
        gtag,
        localStorage: storage,
        dispatchEvent: () => true,
        addEventListener: () => {},
        removeEventListener: () => {},
      },
      configurable: true,
      writable: true,
    })
    Object.defineProperty(globalThis, 'localStorage', {
      value: storage,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    gtagCalls.length = 0
    storage.removeItem(COOKIE_CONSENT_KEY)
  })

  it('saadab purchase ainult makstud tellimusel', () => {
    writeConsent(true)
    gtagCalls.length = 0

    const fireLikeConfirmationPage = (data: {
      paid?: unknown
      purchase?: typeof purchase
    }) => {
      if (!shouldTrackPaidHayPurchase(data)) return
      trackGa4Purchase({
        orderId: data.purchase.orderId,
        value: data.purchase.value,
        currency: data.purchase.currency,
        quantity: data.purchase.numItems ?? 1,
      })
    }

    fireLikeConfirmationPage({ paid: false, purchase })
    fireLikeConfirmationPage({ paid: true, purchase: undefined })
    fireLikeConfirmationPage({ paid: undefined, purchase })
    expect(gtagCalls).toEqual([])

    fireLikeConfirmationPage({ paid: true, purchase })
    expect(gtagCalls).toHaveLength(1)
    expect(gtagCalls[0][0]).toBe('event')
    expect(gtagCalls[0][1]).toBe('purchase')
  })

  it('ei saada purchase-it ilma analüütikanõusolekuta', () => {
    writeConsent(false)
    gtagCalls.length = 0
    trackGa4Purchase({
      orderId: purchase.orderId,
      value: purchase.value,
      currency: purchase.currency,
      quantity: purchase.numItems,
    })
    expect(gtagCalls).toEqual([])
  })

  it('ei saada nime, e-posti ega telefoni', () => {
    writeConsent(true)
    gtagCalls.length = 0

    const event = buildGa4PurchaseEvent({
      orderId: purchase.orderId,
      value: purchase.value,
      currency: purchase.currency,
      quantity: purchase.numItems,
    })

    expect(event).toEqual({
      transaction_id: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
      items: [{ item_id: 'hein', item_name: 'Hein', quantity: 2 }],
    })

    trackGa4Purchase({
      orderId: purchase.orderId,
      value: purchase.value,
      currency: purchase.currency,
      quantity: purchase.numItems,
    })

    const serialized = JSON.stringify(gtagCalls)
    expect(serialized.includes('klient@example.com')).toBe(false)
    expect(serialized.includes('+3725127938')).toBe(false)
    expect(serialized.toLowerCase().includes('email')).toBe(false)
    expect(serialized.toLowerCase().includes('phone')).toBe(false)
    expect(serialized.toLowerCase().includes('nimi')).toBe(false)
  })

  it('quantity vaikimisi 1, kui numItems puudub', () => {
    expect(
      buildGa4PurchaseEvent({
        orderId: 'HAY-2',
        value: 10,
        currency: 'EUR',
      }).items[0].quantity
    ).toBe(1)
  })

  it('järjekorda paneb purchase, kui gtag.js pole veel laetud', () => {
    writeConsent(true)
    const win = globalThis.window as Window
    win.gtag = undefined
    win.dataLayer = []
    trackGa4Purchase({
      orderId: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
    })
    expect(typeof win.gtag).toBe('function')
    const queued = (win.dataLayer || []).map((entry) =>
      Array.from(entry as ArrayLike<unknown>)
    )
    expect(queued.some((call) => call[0] === 'event' && call[1] === 'purchase')).toBe(
      true
    )
  })
})
