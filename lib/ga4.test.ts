import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { shouldTrackPaidHayPurchase } from '@/lib/google-ads'
import { buildGa4PurchaseEvent, trackGa4Purchase } from '@/lib/ga4'

type GtagCall = unknown[]

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

  beforeEach(() => {
    gtagCalls.length = 0
    const gtag = (...args: unknown[]) => {
      gtagCalls.push(args)
    }
    Object.defineProperty(globalThis, 'window', {
      value: { gtag },
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    gtagCalls.length = 0
  })

  it('saadab purchase ainult makstud tellimusel', () => {
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

  it('ei saada nime, e-posti ega telefoni', () => {
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

  it('ei saada sündmust, kui window.gtag puudub', () => {
    ;(globalThis as { window: { gtag?: unknown } }).window.gtag = undefined
    trackGa4Purchase({
      orderId: 'HAY-1',
      value: 12.5,
      currency: 'EUR',
    })
    expect(gtagCalls).toEqual([])
  })
})
