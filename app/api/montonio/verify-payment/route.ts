import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { processMontonioHayOrderPayment } from '@/lib/hay-order-payment'
import {
  createHayRetryToken,
  isRetryableMontonioStatus,
} from '@/lib/hay-order-retry'
import { extractMontonioOrderToken } from '@/lib/montonio-payment'
import { reportError } from '@/lib/report-error'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: 'Makse kinnitamiseks on vaja Montonio order-tokenit' },
        { status: 400 }
      )
    }

    const result = await processMontonioHayOrderPayment({
      notion,
      token,
      requestHeaders: request.headers,
      sendMeta: true,
    })

    let retryToken: string | undefined
    if (
      !result.paid &&
      result.pageId &&
      isRetryableMontonioStatus(result.paymentStatus)
    ) {
      try {
        retryToken = createHayRetryToken(result.pageId)
      } catch (error) {
        reportError(error, {
          tags: { area: 'montonio', route: 'verify-payment-retry-token' },
        })
      }
    }

    return NextResponse.json({
      success: true,
      paid: result.paid,
      paymentStatus: result.paymentStatus,
      merchantReference: result.merchantReference,
      purchase: result.purchase,
      shipments: result.shipments,
      shipmentsCreated: result.shipments.filter((s) => s.success).length,
      retryToken,
    })
  } catch (error) {
    reportError(error, { tags: { area: 'montonio', route: 'verify-payment' } })
    return NextResponse.json(
      {
        error: 'Failed to verify payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
