import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
})

function extractText(prop: any): string {
  if (!prop) return ''
  if (prop.rich_text?.length) {
    return prop.rich_text.map((rt: any) => rt?.plain_text).filter(Boolean).join(' ').trim()
  }
  if (prop.title?.length) {
    return prop.title.map((rt: any) => rt?.plain_text).filter(Boolean).join(' ').trim()
  }
  if (prop.formula?.string) {
    return String(prop.formula.string).trim()
  }
  if (prop.select?.name) {
    return String(prop.select.name).trim()
  }
  return ''
}

export async function GET() {
  try {
    const databaseId = process.env.NOTION_PAPAGOI_DATABASE_ID

    if (!databaseId) {
      return NextResponse.json(
        { error: 'Papagoide database ID puudub' },
        { status: 500 }
      )
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Staatus',
            status: {
              equals: 'Müügis',
            },
          },
          {
            or: [
              {
                property: 'Liik',
                select: {
                  equals: 'Viirpapagoi (Tava)',
                },
              },
              {
                property: 'Liik',
                select: {
                  equals: 'Viirpapagoi (Inglane)',
                },
              },
            ],
          },
        ],
      },
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    })

    const budgies = response.results.map((page: any) => {
      const properties = page.properties

      const name =
        extractText(properties.Name) ||
        'Nimetu'

      const age =
        extractText(properties.Vanus)

      const code =
        extractText(properties.Kood) ||
        extractText(properties['Kood ']) ||
        extractText(properties.Code)

      const color =
        extractText(properties.Värvus) ||
        extractText(properties.Varvus) ||
        extractText(properties.Värv)

      const gender =
        extractText(properties.Sugu) ||
        extractText(properties.Gender)

      const price =
        properties.Maksumus?.number || 0

      const description = ''

      const personality: string[] = []

      let image = '/placeholder-guinea-pig.jpg'
      const imageProperty = properties.Pilt

      if (imageProperty?.files?.[0]) {
        const file = imageProperty.files[0]
        if (file.type === 'external') {
          image = file.external.url
        } else if (file.type === 'file') {
          image = file.file.url
        }
      }

      return {
        id: page.id,
        name,
        code,
        age,
        color,
        gender,
        price,
        personality,
        description,
        image,
      }
    })

    return NextResponse.json({ budgies })
  } catch (error: any) {
    console.error('Papagoi API viga:', error)
    return NextResponse.json(
      {
        budgies: [],
        error: 'Papagoi andmed ei ole kättesaadavad',
        message: error.message,
      },
      { status: 200 }
    )
  }
}
