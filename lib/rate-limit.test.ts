import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, resetRateLimitStore } from '@/lib/rate-limit'
import { validateHayOrderForm } from '@/lib/hay-order-validation'

describe('Rate limit', () => {
  beforeEach(() => {
    resetRateLimitStore('test-bucket')
  })

  it('lubab max päringut aknas, siis limited', () => {
    const opts = { bucket: 'test-bucket', max: 3, windowMs: 60_000 }
    expect(checkRateLimit('1.1.1.1', opts).limited).toBe(false)
    expect(checkRateLimit('1.1.1.1', opts).limited).toBe(false)
    expect(checkRateLimit('1.1.1.1', opts).limited).toBe(false)
    expect(checkRateLimit('1.1.1.1', opts).limited).toBe(true)
  })

  it('eri IP-d on eraldi', () => {
    const opts = { bucket: 'test-bucket', max: 1, windowMs: 60_000 }
    expect(checkRateLimit('1.1.1.1', opts).limited).toBe(false)
    expect(checkRateLimit('1.1.1.1', opts).limited).toBe(true)
    expect(checkRateLimit('2.2.2.2', opts).limited).toBe(false)
  })
})

describe('Heinatellimuse valideerimine', () => {
  const valid = {
    name: 'Jüri Tamm',
    email: 'juri@example.com',
    phone: '5127938',
    terminal: 'Tartu Lõunakeskus',
    quantity: '2',
  }

  it('aktsepteerib korrektset sisendit', () => {
    const r = validateHayOrderForm(valid)
    expect(r.ok).toBe(true)
    if (r.ok && !r.honeypot) {
      expect(r.data.quantity).toBe(2)
      expect(r.data.totalPrice).toBe(18)
      expect(r.data.phone).toMatch(/^\+372/)
    }
  })

  it('toetab Montonio välju (hayAmount, parcelMachine)', () => {
    const r = validateHayOrderForm({
      name: 'Mari',
      email: 'm@example.com',
      phone: '+3725127938',
      hayAmount: 1,
      parcelMachine: 'Tallinn Ülemiste',
    })
    expect(r.ok).toBe(true)
    if (r.ok && !r.honeypot) {
      expect(r.data.terminal).toBe('Tallinn Ülemiste')
      expect(r.data.quantity).toBe(1)
    }
  })

  it('honeypot annab ok + honeypot lipu', () => {
    const r = validateHayOrderForm({ ...valid, website: 'http://spam.bot' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.honeypot).toBe(true)
  })

  it('liiga kiire submit → 400', () => {
    const now = 20_000
    const r = validateHayOrderForm({ ...valid, formStartedAt: now - 500 }, now)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(400)
  })

  it('lükkab koguse 0 tagasi', () => {
    const r = validateHayOrderForm({ ...valid, quantity: '0' })
    expect(r.ok).toBe(false)
  })
})
