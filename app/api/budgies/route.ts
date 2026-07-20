import { NextResponse } from 'next/server'
import { getBudgies } from '@/lib/budgies'

/** API jäänuk — sisulehed kasutavad lib/budgies otse (ISR). */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const budgies = await getBudgies()
    return NextResponse.json({ budgies })
  } catch (error: any) {
    console.error('Papagoide müük API viga:', error)
    return NextResponse.json(
      {
        budgies: [],
        error: 'Papagoide müük andmed ei ole kättesaadavad',
        message: error.message,
      },
      { status: 200 }
    )
  }
}
