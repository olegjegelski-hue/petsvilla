import { describe, it, expect } from 'vitest'
import {
  SITE_CONTACT,
  getCanonicalAddressLine,
  getMontonioSenderAddress,
} from '@/lib/site-contact'

describe('Kanooniline aadress (Montonio / sait)', () => {
  it('ei kasuta vana Jüri / Männi aadressi', () => {
    const line = getCanonicalAddressLine()
    expect(line).toContain('Tartu mnt 80')
    expect(line).toContain('Soinaste')
    expect(line).toContain('61709')
    expect(line.toLowerCase()).not.toContain('jüri')
    expect(line.toLowerCase()).not.toContain('männi')
  })

  it('Montonio sender on Soinaste', () => {
    const sender = getMontonioSenderAddress()
    expect(sender.streetAddress).toBe('Tartu mnt 80')
    expect(sender.locality).toBe('Soinaste')
    expect(sender.region).toBe('Tartumaa')
    expect(sender.postalCode).toBe('61709')
    expect(sender.email).toBe(SITE_CONTACT.email)
    expect(sender.name).toBe('PetsVilla OÜ')
  })
})
