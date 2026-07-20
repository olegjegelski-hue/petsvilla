import { NextResponse } from 'next/server'
import { getGuineaPigs } from '@/lib/guinea-pigs'

/** API jäänuk / välistele klientidele — sisulehed kasutavad lib/guinea-pigs otse (ISR). */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const guineaPigs = await getGuineaPigs()
    return NextResponse.json({ guineaPigs })
  } catch (error: any) {
    console.error('Notion API viga:', error)
    return NextResponse.json(
      {
        guineaPigs: [],
        error: 'Notion andmed ei ole kättesaadavad',
        message:
          'Palun jaga Notion andmebaas integratsiooniga või kontrolli API võtit.',
      },
      { status: 200 }
    )
  }
}
