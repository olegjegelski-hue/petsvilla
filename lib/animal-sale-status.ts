/**
 * Loomade müügistaatus Notionist → UI.
 * Merisead (Beebid): Emmega | Lasteaed | Broneeritud | Müüdud | …
 * Viirpapagoid: Status/Staatus (Müügis | Kodus | Broneeritud | Müüdud | …)
 */

export type SaleDisplayStatus = 'Saadaval' | 'Broneeritud'

export type SaleStatusInfo = {
  /** Notion toorväärtus */
  notionStatus: string
  /** Kasutajale näidatav märgend */
  display: SaleDisplayStatus
  /** Kas „Broneeri“ CTA on aktiivne */
  canBook: boolean
  /** Kas looma näidatakse galeriis */
  visible: boolean
}

const AVAILABLE_RAW = new Set([
  'Emmega',
  'Lasteaed',
  'Müügis',
  'Saadaval',
  'Available',
])

const RESERVED_RAW = new Set(['Broneeritud', 'Reserved', 'Reserveeritud'])

const HIDDEN_RAW = new Set([
  'Müüdud',
  'Kadunud',
  'Endale',
  'Karantiin',
  'Sold',
  'Archived',
])

export function resolveSaleStatus(raw: string | null | undefined): SaleStatusInfo {
  const notionStatus = (raw || '').trim()
  if (!notionStatus || HIDDEN_RAW.has(notionStatus)) {
    return {
      notionStatus,
      display: 'Saadaval',
      canBook: false,
      visible: false,
    }
  }
  if (RESERVED_RAW.has(notionStatus)) {
    return {
      notionStatus,
      display: 'Broneeritud',
      canBook: false,
      visible: true,
    }
  }
  if (AVAILABLE_RAW.has(notionStatus)) {
    return {
      notionStatus,
      display: 'Saadaval',
      canBook: true,
      visible: true,
    }
  }
  // Tundmatu staatus: ära näita (ohutu vaikimisi)
  return {
    notionStatus,
    display: 'Saadaval',
    canBook: false,
    visible: false,
  }
}

export function sortBySaleAvailability<T extends { saleDisplay?: SaleDisplayStatus }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const rank = (s?: SaleDisplayStatus) => (s === 'Saadaval' ? 0 : 1)
    return rank(a.saleDisplay) - rank(b.saleDisplay)
  })
}
