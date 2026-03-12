import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params

    const page: any = await notion.pages.retrieve({
      page_id: pageId,
    })

    let imageUrl = '/placeholder-guinea-pig.jpg'
    const imageProperty =
      page.properties.Pilt ||
      page.properties.Image ||
      page.properties.Pildid

    if (imageProperty?.files?.[0]) {
      const file = imageProperty.files[0]
      if (file.type === 'external') {
        imageUrl = file.external.url
      } else if (file.type === 'file') {
        imageUrl = file.file.url
      }
    }

    return NextResponse.redirect(imageUrl)
  } catch (error: any) {
    console.error('Papagoi pildi hankimine ebaõnnestus:', error)
    return NextResponse.redirect('/placeholder-guinea-pig.jpg')
  }
}
