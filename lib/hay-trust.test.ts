import { describe, it, expect } from 'vitest'
import {
  HAY_TRUST_BRAND_COLOR,
  HAY_TRUST_TITLE,
  HAY_TRUST_TEXT,
  HAY_TRUST_CTA_LABEL,
  HAY_TRUST_CTA_HREF,
  SHARED_META_PIXEL_PRIVACY_SENTENCE,
} from '@/lib/hay-trust'

describe('Heina usaldusplokk ja ühine piksel', () => {
  it('hoiab lukus pealkirja, teksti ja külastuslingi UTM-iga', () => {
    expect(HAY_TRUST_BRAND_COLOR).toBe('#2F6F4E')
    expect(HAY_TRUST_TITLE).toBe(
      'Sama hein, mida söövad Papagoi Keskuse merisead'
    )
    expect(HAY_TRUST_TEXT).toBe(
      'PetsVilla ei ole tavaline heinamüüja. Soinastes asub meie Papagoi Keskus, kus elab üle 50 papagoi ja ligi 50 merisiga. Iga kott, mille saadame, on samast heinast, mida meie merisead iga päev söövad. Iga partii kontrollime üle: lõhn, kuivus, tolm ja struktuur. Kui hein meie loomadele ei sobi, ei paki me seda ka sulle.'
    )
    expect(HAY_TRUST_CTA_LABEL).toBe(
      '🦜 Tule vaata ise – külastus broneeringuga'
    )
    expect(HAY_TRUST_CTA_HREF).toBe(
      'https://papagoi.ee/et/broneeri?utm_source=petsvilla.ee&utm_medium=referral&utm_campaign=ristturundus'
    )
    expect(HAY_TRUST_CTA_HREF).toContain('utm_source=petsvilla.ee')
    expect(HAY_TRUST_CTA_HREF).toContain('utm_medium=referral')
    expect(HAY_TRUST_CTA_HREF).toContain('utm_campaign=ristturundus')
  })

  it('hoiab lukus privaatsuspoliitika ühise piksli lause', () => {
    expect(SHARED_META_PIXEL_PRIVACY_SENTENCE).toBe(
      'PetsVilla OÜ ja MTÜ Papagoi Keskus kasutavad ühist Meta pikslit. Kui olete andnud nõusoleku turundusküpsistele, võime näidata teile Facebookis ja Instagramis mõlema reklaame.'
    )
  })
})
