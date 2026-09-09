import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { processMontonioHayOrderPayment } from '@/lib/hay-order-payment'
import { extractMontonioOrderToken } from '@/lib/montonio-payment'
import { reportError } from '@/lib/report-error'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function handleMontonioNotification(request: NextRequest) {
  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    body = {}
  }

  const token = extractMontonioOrderToken({
    body,
    searchParams: request.nextUrl.searchParams,
  })

  if (!token) {
    return NextResponse.json({ error: 'Missing orderToken' }, { status: 400 })
  }

  const result = await processMontonioHayOrderPayment({
    notion,
    token,
    requestHeaders: request.headers,
    sendMeta: true,
  })

  return NextResponse.json({
    success: true,
    paid: result.paid,
    paymentStatus: result.paymentStatus,
    merchantReference: result.merchantReference,
  })
}

function isInvalidTokenError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : ''
  return /Invalid Montonio token|puudub merchantReference|accessKey ei kattu/i.test(
    message
  )
}

export async function POST(request: NextRequest) {
  try {
    return await handleMontonioNotification(request)
  } catch (error) {
    reportError(error, { tags: { area: 'montonio', route: 'callback' } })
    const status = isInvalidTokenError(error) ? 400 : 500
    return NextResponse.json(
      {
        error: 'Failed to process callback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return await handleMontonioNotification(request)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    )
  }
}
