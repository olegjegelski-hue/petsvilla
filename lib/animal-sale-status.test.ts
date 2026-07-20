import { describe, it, expect } from 'vitest'
import {
  resolveSaleStatus,
  sortBySaleAvailability,
} from '@/lib/animal-sale-status'
import { extractNotionText, fixMojibake } from '@/lib/notion'
import { slugifyProductName } from '@/lib/products'

describe('Notion loomade staatuse mapping', () => {
  it('Emmega / Lasteaed / Müügis → Saadaval + canBook', () => {
    for (const status of ['Emmega', 'Lasteaed', 'Müügis']) {
      const r = resolveSaleStatus(status)
      expect(r.visible).toBe(true)
      expect(r.canBook).toBe(true)
      expect(r.display).toBe('Saadaval')
    }
  })

  it('Broneeritud → nähtav, ei saa broneerida', () => {
    const r = resolveSaleStatus('Broneeritud')
    expect(r.visible).toBe(true)
    expect(r.canBook).toBe(false)
    expect(r.display).toBe('Broneeritud')
  })

  it('Müüdud / tundmatu → peidetud', () => {
    expect(resolveSaleStatus('Müüdud').visible).toBe(false)
    expect(resolveSaleStatus('XYZ').visible).toBe(false)
    expect(resolveSaleStatus('').visible).toBe(false)
  })

  it('sortBySaleAvailability paneb Saadaval ette', () => {
    const sorted = sortBySaleAvailability([
      { id: 1, saleDisplay: 'Broneeritud' as const },
      { id: 2, saleDisplay: 'Saadaval' as const },
    ])
    expect(sorted[0].id).toBe(2)
  })
})

describe('Notion tekst / toote slug', () => {
  it('extractNotionText loeb title ja rich_text', () => {
    expect(
      extractNotionText({
        title: [{ plain_text: 'Luna' }],
      })
    ).toBe('Luna')
    expect(
      extractNotionText({
        rich_text: [{ plain_text: 'pruun' }, { plain_text: 'valge' }],
      })
    ).toBe('pruun valge')
  })

  it('fixMojibake jätab puhta teksti samaks', () => {
    expect(fixMojibake('Viirpapagoi')).toBe('Viirpapagoi')
  })

  it('slugifyProductName eemaldab täpitähed', () => {
    expect(slugifyProductName('Ööbik ära')).toBe('oobik-ara')
    expect(slugifyProductName('Eastern Rosella')).toBe('eastern-rosella')
  })
})
