import { describe, it, expect } from 'vitest'
import {
  ABANDONED_EMAIL_MAX_AGE_MS,
  ABANDONED_EMAIL_MIN_AGE_MS,
  DEFAULT_ABANDONED_EMAIL_AFTER,
  decideAbandonedEmailAction,
  getAbandonedEmailCutoff,
  isAbandonedUnpaid,
} from '@/lib/hay-abandoned-email'
import {
  commentsWithNewMontonioPayment,
  createHayRetryToken,
  hayOrderRetryEligibility,
  hayRetryPageUrl,
  isRetryableMontonioStatus,
  verifyHayRetryToken,
} from '@/lib/hay-order-retry'
import {
  extractHayMerchantReferences,
  orderUuidMatches,
  type HayOrderSnapshot,
} from '@/lib/hay-order-payment'
import {
  buildHayMontonioOrderData,
  HAY_PAYMENT_METHOD,
  HAY_PAYMENT_METHOD_DISPLAY,
} from '@/lib/hay-montonio-order'
import { buildHayAbandonedEmailContent } from '@/lib/email-templates'
import { shouldTrackPaidHayPurchase } from '@/lib/google-ads'

const SECRET = 'test-hay-retry-secret'

function snapshot(partial: Partial<HayOrderSnapshot> = {}): HayOrderSnapshot {
  return {
    pageId: 'page-1',
    name: 'Mari Mets',
    email: 'mari@example.com',
    phone: '+3725127938',
    terminal: 'Tartu Lõunakeskus',
    comments: 'Montonio Reference: HAY-1-001\nMontonio UUID: uuid-old',
    status: 'Maksmata',
    paidCheckbox: false,
    paymentSelect: 'Katkestatud',
    hayQuantity: 2,
    guineaPigFoodKg: 0,
    rabbitFoodKg: 0,
    totalPrice: 18,
    pickupPointUuid: null,
    montonioUuid: 'uuid-old',
    merchantReference: 'HAY-1-001',
    ...partial,
  }
}

describe('ABANDONED / VOIDED staatused', () => {
  it('tunneb katkestatud või Maksmata maksmata reana', () => {
    expect(
      isAbandonedUnpaid({
        paymentSelect: 'Katkestatud',
        status: 'Maksmata',
      })
    ).toBe(true)
    expect(
      isAbandonedUnpaid({
        paymentSelect: 'Ootel',
        status: 'Maksmata',
      })
    ).toBe(true)
    expect(
      isAbandonedUnpaid({
        paidCheckbox: true,
        paymentSelect: 'Katkestatud',
      })
    ).toBe(false)
    expect(
      isAbandonedUnpaid({
        paymentSelect: 'Tühistatud',
        status: 'Vigane',
      })
    ).toBe(false)
  })
})

describe('Pooleli kirja otsus', () => {
  const now = new Date('2026-11-18T00:00:00.000Z')
  const cutoff = new Date(DEFAULT_ABANDONED_EMAIL_AFTER)
  const created = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()

  const due = {
    email: 'mari@example.com',
    abandonedEmailSent: false,
    createdTime: created,
    unpaidAbandoned: true,
  }

  it('saadab, kui 1–48 h, cutoffist uuem, kiri saatmata, hilisemat makstut pole', () => {
    expect(
      decideAbandonedEmailAction({
        candidate: due,
        now,
        cutoff,
        hasLaterPaidOrder: false,
      })
    ).toBe('send')
  })

  it('ei saada vanadele ridadele enne cutoffi (sh 7 kaotatud klienti)', () => {
    expect(
      decideAbandonedEmailAction({
        candidate: {
          ...due,
          createdTime: '2026-11-10T10:00:00.000Z',
        },
        now,
        cutoff,
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
  })

  it('ei saada enne 1 h ega pärast 48 h', () => {
    expect(
      decideAbandonedEmailAction({
        candidate: {
          ...due,
          createdTime: new Date(
            now.getTime() - ABANDONED_EMAIL_MIN_AGE_MS + 60_000
          ).toISOString(),
        },
        now,
        cutoff,
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
    expect(
      decideAbandonedEmailAction({
        candidate: {
          ...due,
          createdTime: new Date(
            now.getTime() - ABANDONED_EMAIL_MAX_AGE_MS - 60_000
          ).toISOString(),
        },
        now,
        cutoff: new Date('2026-11-01T00:00:00.000Z'),
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
  })

  it('märgib hilisema makstud tellimuse skipiks ja ei saada korduskirja', () => {
    expect(
      decideAbandonedEmailAction({
        candidate: due,
        now,
        cutoff,
        hasLaterPaidOrder: true,
      })
    ).toBe('skip-later-order')
    expect(
      decideAbandonedEmailAction({
        candidate: { ...due, abandonedEmailSent: true },
        now,
        cutoff,
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
  })

  it('loeb cutoffi envist', () => {
    expect(
      getAbandonedEmailCutoff('2026-11-18T08:00:00.000Z').toISOString()
    ).toBe('2026-11-18T08:00:00.000Z')
    expect(getAbandonedEmailCutoff('').toISOString()).toBe(
      DEFAULT_ABANDONED_EMAIL_AFTER
    )
  })
})

describe('Retry token', () => {
  it('allkirjastab pageId ja lükkab äraarvatava reference’i tagasi', () => {
    const pageId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
    const token = createHayRetryToken(pageId, SECRET)
    expect(verifyHayRetryToken(token, SECRET)).toBe(pageId)
    expect(verifyHayRetryToken(token, 'muu-saladus')).toBeNull()
    expect(verifyHayRetryToken('HAY-1730000000000-123', SECRET)).toBeNull()
    expect(verifyHayRetryToken('vigane', SECRET)).toBeNull()
  })

  it('koostab /maksa-uuesti URL-i, mitte toore HAY-viite', () => {
    const url = hayRetryPageUrl(
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      'https://petsvilla.ee',
      SECRET
    )
    expect(url).toMatch(/^https:\/\/petsvilla\.ee\/maksa-uuesti\?token=/)
    expect(url).not.toContain('HAY-')
  })
})

describe('Retry kõlblikkus ja UUID', () => {
  it('lubab katkestatud maksmata rida ja keelab makstud/VOIDED/saadetud', () => {
    expect(hayOrderRetryEligibility(snapshot()).ok).toBe(true)
    expect(
      hayOrderRetryEligibility(
        snapshot({ paidCheckbox: true, paymentSelect: 'Makstud' })
      )
    ).toEqual({ ok: false, reason: 'paid' })
    expect(
      hayOrderRetryEligibility(
        snapshot({ paymentSelect: 'Tühistatud', status: 'Vigane' })
      )
    ).toEqual({ ok: false, reason: 'voided' })
    expect(
      hayOrderRetryEligibility(
        snapshot({ status: 'Saadetud', paymentSelect: 'Makstud' })
      )
    ).toEqual({ ok: false, reason: 'paid' })
  })

  it('tunnistab ABANDONED retry-kõlblikuks, PENDING ja VOIDED mitte', () => {
    expect(isRetryableMontonioStatus('ABANDONED')).toBe(true)
    expect(isRetryableMontonioStatus('PENDING')).toBe(false)
    expect(isRetryableMontonioStatus('VOIDED')).toBe(false)
    expect(isRetryableMontonioStatus('PAID')).toBe(false)
  })

  it('uuendab sama rea kommentaare uue reference/UUID-ga', () => {
    const next = commentsWithNewMontonioPayment('vana rida\nMontonio UUID: uuid-old', {
      merchantReference: 'HAY-2-002',
      uuid: 'uuid-new',
      now: new Date('2026-11-17T22:00:00.000Z'),
    })
    expect(extractHayMerchantReferences(next)[0]).toBe('HAY-2-002')
    expect(next).toContain('Montonio UUID: uuid-new')
    expect(next).toContain('Retry: 2026-11-17T22:00:00.000Z')
    expect(next).toContain('vana rida')
  })

  it('võrdleb UUID-d välja, mitte ainult kommentaaride sisu järgi', () => {
    const row = snapshot({
      montonioUuid: 'uuid-new',
      comments: 'Montonio UUID: uuid-old\nMontonio UUID: uuid-new',
    })
    expect(orderUuidMatches(row, 'uuid-new')).toBe(true)
    expect(orderUuidMatches(row, 'uuid-old')).toBe(false)
  })
})

describe('Montonio tellimuse payload', () => {
  it('kasutab paymentInitiation ja silti Pangalink', () => {
    const order = buildHayMontonioOrderData({
      name: 'Mari Mets',
      email: 'mari@example.com',
      phone: '+3725127938',
      hayQuantity: 2,
      guineaPigFoodKg: 0,
      rabbitFoodPacks: 0,
      totalPrice: 18,
      merchantReference: 'HAY-1-001',
      origin: 'https://petsvilla.ee',
    })
    expect(order.payment.method).toBe(HAY_PAYMENT_METHOD)
    expect(order.payment.methodDisplay).toBe(HAY_PAYMENT_METHOD_DISPLAY)
    expect(HAY_PAYMENT_METHOD).toBe('paymentInitiation')
    expect(HAY_PAYMENT_METHOD_DISPLAY).toBe('Pangalink')
    expect(order.returnUrl).toContain('/tellimus-kinnitatud?reference=HAY-1-001')
  })
})

describe('Pooleli kirja mall', () => {
  it('sisaldab teemat, kokkuvõtet ja Jätka maksmist, ilma allahindluseta', () => {
    const content = buildHayAbandonedEmailContent({
      quantity: 2,
      terminal: 'Tartu Lõunakeskus',
      totalPrice: 18,
      continueUrl: 'https://petsvilla.ee/maksa-uuesti?token=abc',
    })
    expect(content.subject).toBe('Sinu heinatellimus jäi pooleli')
    expect(content.html).toContain('Jätka maksmist')
    expect(content.html).toContain('Tartu Lõunakeskus')
    expect(content.html).toContain('18€')
    expect(content.html).toContain('2 kotti')
    expect(content.html).toContain('https://petsvilla.ee/maksa-uuesti?token=abc')
    expect(content.html.toLowerCase()).not.toContain('allahindlus')
    expect(content.html.toLowerCase()).not.toContain('soodustus')
    expect(content.text).toContain('Sinu heinatellimus jäi pooleli')
    expect(content.text).not.toMatch(/-%|\bsoodus/i)
  })
})

describe('Ostu jälgimine retry puhul', () => {
  it('ei loe maksmata retry vastust ostuks', () => {
    expect(
      shouldTrackPaidHayPurchase({
        paid: false,
        purchase: {
          orderId: 'HAY-1-001',
          value: 18,
          currency: 'EUR',
        },
      })
    ).toBe(false)
    expect(
      shouldTrackPaidHayPurchase({
        paid: true,
        purchase: undefined,
      })
    ).toBe(false)
  })
})
