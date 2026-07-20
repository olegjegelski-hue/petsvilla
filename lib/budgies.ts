import { resolveSaleStatus, sortBySaleAvailability } from '@/lib/animal-sale-status'
import {
  getNotionClient,
  extractNotionText,
  extractNotionFileUrl,
} from '@/lib/notion'
import type { Budgie } from '@/lib/types'

/**
 * Allikas: Notion DB „Papagoide müük“ (NOTION_PAPAGOI_DATABASE_ID).
 * NB: „Papagoid“ DB = meie enda linnud, MITTE müük.
 */
export async function getBudgies(): Promise<Budgie[]> {
  const databaseId = process.env.NOTION_PAPAGOI_DATABASE_ID
  if (!databaseId) {
    console.error('NOTION_PAPAGOI_DATABASE_ID puudub')
    return []
  }

  try {
    const notion = getNotionClient()
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: 'Liik', select: { equals: 'Viirpapagoi' } },
          {
            or: [
              { property: 'Staatus', status: { equals: 'Müügis' } },
              { property: 'Staatus', status: { equals: 'Broneeritud' } },
            ],
          },
        ],
      },
      sorts: [{ property: 'Name', direction: 'ascending' }],
    })

    const budgies = response.results
      .map((page: any) => {
        const properties = page.properties
        const name = extractNotionText(properties.Name) || 'Nimetu'
        const code =
          extractNotionText(properties.Kood) ||
          extractNotionText(properties['Rõnga number'])
        const gender = extractNotionText(properties.Sugu)
        const price = properties.Maksumus?.number || 0
        const status =
          properties.Staatus?.status?.name ||
          extractNotionText(properties.Staatus) ||
          ''
        const sale = resolveSaleStatus(status)
        if (!sale.visible) return null

        const arrived = properties.Saabunud?.date?.start || ''
        const age = arrived
          ? `Saabunud ${new Date(arrived).toLocaleDateString('et-EE')}`
          : ''

        return {
          id: page.id,
          name,
          code,
          age,
          color: '',
          gender,
          price,
          personality: [] as string[],
          description: '',
          image: extractNotionFileUrl(properties.Pilt),
          status,
          saleDisplay: sale.display,
          canBook: sale.canBook,
        } satisfies Budgie
      })
      .filter(Boolean) as Budgie[]

    return sortBySaleAvailability(budgies)
  } catch (error) {
    console.error('Papagoide müük (viirpapagoid) fetch viga:', error)
    return []
  }
}
