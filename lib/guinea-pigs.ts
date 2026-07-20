import { resolveSaleStatus, sortBySaleAvailability } from '@/lib/animal-sale-status'
import { getNotionClient, extractNotionFileUrl } from '@/lib/notion'
import type { GuineaPig } from '@/lib/types'

export async function getGuineaPigs(): Promise<GuineaPig[]> {
  const databaseId = process.env.NOTION_GUINEA_PIG_DATABASE_ID
  if (!databaseId) {
    console.error('NOTION_GUINEA_PIG_DATABASE_ID puudub')
    return []
  }

  try {
    const notion = getNotionClient()
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          { property: 'Staatus', select: { equals: 'Emmega' } },
          { property: 'Staatus', select: { equals: 'Lasteaed' } },
          { property: 'Staatus', select: { equals: 'Broneeritud' } },
        ],
      },
      sorts: [{ property: 'Sündis', direction: 'descending' }],
    })

    const guineaPigs = response.results
      .map((page: any) => {
        const properties = page.properties
        const name = properties.Beebi?.title?.[0]?.plain_text || 'Nimetu'
        const price = properties.Maksumus?.number || 0
        const color = properties.Värvus?.rich_text?.[0]?.plain_text || ''
        const age =
          properties.Vanus?.formula?.string ||
          properties.Vanus?.formula?.number?.toString() ||
          ''
        const gender = properties.Sugu?.select?.name || ''
        const breed = properties.Tõug?.select?.name || ''
        const code = properties.Kood?.formula?.string || ''
        const birthDate = properties['Sündis']?.date?.start || ''
        const available = properties.Saadaval?.formula?.date?.start || ''
        const status = properties.Staatus?.select?.name || ''
        const sale = resolveSaleStatus(status)

        if (!sale.visible) return null

        return {
          id: page.id,
          name,
          code,
          price,
          color,
          age,
          gender,
          breed,
          birthDate,
          available,
          status,
          saleDisplay: sale.display,
          canBook: sale.canBook,
          image: extractNotionFileUrl(properties.Pilt),
        } satisfies GuineaPig
      })
      .filter(Boolean) as GuineaPig[]

    return sortBySaleAvailability(guineaPigs)
  } catch (error) {
    console.error('Notion merisead fetch viga:', error)
    return []
  }
}
