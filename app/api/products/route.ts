import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

/** API jäänuk — sisulehed kasutavad lib/products otse (ISR). */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const products = await getProducts(category)
    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('Petra-Aqua API viga:', error)
    return NextResponse.json(
      {
        products: [],
        error: 'Petra-Aqua andmed ei ole kättesaadavad',
        message: error.message,
      },
      { status: 200 }
    )
  }
}
