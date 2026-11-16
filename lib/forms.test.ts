import { describe, it, expect } from 'vitest'
import { validateContactForm } from '@/lib/contact-validation'
import { formatPhoneNumber, calculateHayOrderTotal } from '@/lib/phone'
import {
  buildContactEmailContent,
  buildHayOrderEmailContent,
} from '@/lib/email-templates'

describe('Kontaktivormi valideerimine', () => {
  const valid = {
    name: 'Mari Mets',
    email: 'mari@example.com',
    message: 'Tere, soovin broneerida merisea.',
  }

  it('aktsepteerib korrektset sisendit', () => {
    const r = validateContactForm(valid)
    expect(r.ok).toBe(true)
    if (r.ok && !r.honeypot) {
      expect(r.data.email).toBe('mari@example.com')
    }
  })

  it('nõuab nime, e-posti ja sõnumit', () => {
    const r = validateContactForm({ name: 'A', email: '', message: '' })
    expect(r.ok).toBe(false)
  })

  it('lükkab vigase e-posti tagasi', () => {
    const r = validateContactForm({ ...valid, email: 'mitte-email' })
    expect(r.ok).toBe(false)
  })

  it('honeypot annab ok + honeypot lipu', () => {
    const r = validateContactForm({ ...valid, website: 'http://spam' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.honeypot).toBe(true)
  })

  it('liiga kiire submit → 400', () => {
    const now = 10_000
    const r = validateContactForm({ ...valid, formStartedAt: now - 500 }, now)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.status).toBe(400)
  })
})

describe('Telefon ja heinahind', () => {
  it('formatPhoneNumber lisab +372', () => {
    expect(formatPhoneNumber('5127938')).toBe('+3725127938')
    expect(formatPhoneNumber('372 512 7938')).toBe('+3725127938')
    expect(formatPhoneNumber('+3725127938')).toBe('+3725127938')
  })

  it('calculateHayOrderTotal: 9€ hein, 9€ meriseatoit, 6€ küülik', () => {
    expect(calculateHayOrderTotal({ quantity: 2 })).toBe(18)
    expect(
      calculateHayOrderTotal({ quantity: 1, guineaPigFood: 1, rabbitFood: 1 })
    ).toBe(9 + 9 + 6)
  })
})

describe('E-maili mallid', () => {
  it('buildContactEmailContent sisaldab nime ja sõnumit', () => {
    const c = buildContactEmailContent({
      name: 'Mari',
      email: 'mari@example.com',
      message: 'Tere tulemast PetsVilla',
      product: 'Luna',
    })
    expect(c.subject).toContain('Mari')
    expect(c.html).toContain('mari@example.com')
    expect(c.html).toContain('Luna')
    expect(c.text).toContain('Tere tulemast PetsVilla')
  })

  it('buildHayOrderEmailContent sisaldab terminali ja summat', () => {
    const c = buildHayOrderEmailContent({
      name: 'Jüri',
      email: 'j@example.com',
      phone: '+3725000000',
      terminal: 'Tartu Lõunakeskus',
      quantity: 2,
      guineaPigFood: 0,
      rabbitFood: 0,
      totalPrice: 18,
    })
    expect(c.subject).toContain('2 pakki')
    expect(c.html).toContain('Tartu Lõunakeskus')
    expect(c.html).toContain('18€')
    expect(c.html).toContain(
      'Aitäh tellimuse eest! Pakk jõuab sinuni tavaliselt 1–3 tööpäeva jooksul.'
    )
    expect(c.text).toContain(
      'Aitäh tellimuse eest! Pakk jõuab sinuni tavaliselt 1–3 tööpäeva jooksul.'
    )
    const headingHtml = c.html.indexOf('✅ Heinatellimus kinnitatud')
    const thanksHtml = c.html.indexOf('Aitäh tellimuse eest!')
    const nameHtml = c.html.indexOf('<strong>Nimi:</strong>')
    expect(headingHtml).toBeGreaterThan(-1)
    expect(thanksHtml).toBeGreaterThan(headingHtml)
    expect(nameHtml).toBeGreaterThan(thanksHtml)
  })

  it('heinatellimuse kinnitus sisaldab FB grupi kutset pärast tarneinfot', () => {
    const c = buildHayOrderEmailContent({
      name: 'Jüri',
      email: 'j@example.com',
      phone: '+3725000000',
      terminal: 'Tartu Lõunakeskus',
      quantity: 1,
      guineaPigFood: 1,
      rabbitFood: 1,
      totalPrice: 24,
    })

    const merisigala = 'https://www.facebook.com/groups/merisigala'
    const kuulikud = 'https://www.facebook.com/groups/2037723266312747'
    const title = 'Liitu meie Facebooki gruppidega'

    expect(c.html).toContain(title)
    expect(c.html).toContain(merisigala)
    expect(c.html).toContain(kuulikud)
    expect(c.html).toContain('#2F6F4E')
    expect(c.html).toContain('role="presentation"')
    expect(c.text).toContain(title)
    expect(c.text).toContain(merisigala)
    expect(c.text).toContain(kuulikud)

    const tarneIndex = c.html.indexOf('SmartPost terminal')
    const inviteIndex = c.html.indexOf(title)
    const footerIndex = c.html.indexOf('PetsVilla OÜ - petsvilla.ee')
    expect(tarneIndex).toBeGreaterThan(-1)
    expect(inviteIndex).toBeGreaterThan(tarneIndex)
    expect(footerIndex).toBeGreaterThan(inviteIndex)
  })
})
