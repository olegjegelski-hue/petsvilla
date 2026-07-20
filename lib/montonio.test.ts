import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import {
  formatMontonioPrice,
  generateMerchantReference,
  validateMontonioToken,
  getMontonioConfig,
} from '@/lib/montonio'

describe('Montonio', () => {
  const prev = { ...process.env }

  beforeEach(() => {
    process.env.MONTONIO_ACCESS_KEY = 'test-access'
    process.env.MONTONIO_SECRET_KEY = 'test-secret-key-for-jwt'
    process.env.MONTONIO_ENVIRONMENT = 'sandbox'
  })

  afterEach(() => {
    process.env = { ...prev }
  })

  it('formatMontonioPrice teisendab eurod sentideks', () => {
    expect(formatMontonioPrice(9)).toBe(900)
    expect(formatMontonioPrice(9.5)).toBe(950)
    expect(formatMontonioPrice(0.1)).toBe(10)
  })

  it('generateMerchantReference sisaldab prefiksit ja on unikaalne formaat', () => {
    const ref = generateMerchantReference('HAY')
    expect(ref).toMatch(/^HAY-\d+-\d{3}$/)
  })

  it('getMontonioConfig loeb sandbox URL-i', () => {
    const config = getMontonioConfig()
    expect(config.apiUrl).toContain('sandbox-stargate.montonio.com')
    expect(config.accessKey).toBe('test-access')
  })

  it('validateMontonioToken aktsepteerib kehtivat JWT allkirja', () => {
    const payload = {
      accessKey: 'test-access',
      merchantReference: 'HAY-1',
      paymentStatus: 'PAID',
    }
    const token = jwt.sign(payload, 'test-secret-key-for-jwt', {
      algorithm: 'HS256',
      expiresIn: '10m',
    })
    const decoded = validateMontonioToken(token) as typeof payload
    expect(decoded.merchantReference).toBe('HAY-1')
    expect(decoded.paymentStatus).toBe('PAID')
  })

  it('validateMontonioToken lükkab vale allkirja tagasi', () => {
    const token = jwt.sign({ a: 1 }, 'wrong-secret', { algorithm: 'HS256' })
    expect(() => validateMontonioToken(token)).toThrow(/Invalid Montonio token/)
  })
})
