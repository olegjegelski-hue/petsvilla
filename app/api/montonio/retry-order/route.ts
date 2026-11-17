import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { HAY_RETRY_PAGE_PATH, retryHayOrderPayment } from '@/lib/hay-order-retry'
import { reportError } from '@/lib/report-error'
import { rateLimitExceededResponse } from '@/lib/rate-limit'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

function extractRetryToken(request: NextRequest): string | null {
  const fromQuery = request.nextUrl.searchParams.get('token')
  if (fromQuery && fromQuery.trim()) return fromQuery.trim()
  return null
}

async function extractRetryTokenFromBody(
  request: NextRequest
): Promise<string | null> {
  try {
    const body = (await request.json()) as { token?: unknown }
    return typeof body.token === 'string' && body.token.trim()
      ? body.token.trim()
      : null
  } catch {
    return null
  }
}

/** GET ei loo makset (e-posti skännerid). Suuna kinnituslehele. */
export async function GET(request: NextRequest) {
  const token = extractRetryToken(request)
  const origin = getSiteUrl()
  if (!token) {
    return NextResponse.redirect(`${origin}/telli-hein`)
  }
  return NextResponse.redirect(
    `${origin}${HAY_RETRY_PAGE_PATH}?token=${encodeURIComponent(token)}`
  )
}

export async function POST(request: NextRequest) {
  const limited = rateLimitExceededResponse(request, {
    bucket: 'hay-retry',
    route: 'montonio/retry-order',
    max: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (limited) return limited

  const token =
    extractRetryToken(request) || (await extractRetryTokenFromBody(request))
  if (!token) {
    return NextResponse.json(
      { error: 'Puudub allkirjastatud token' },
      { status: 400 }
    )
  }

  try {
    const result = await retryHayOrderPayment({
      notion,
      token,
      origin: getSiteUrl(),
    })

    if (!result.ok) {
      const status =
        result.reason === 'invalid-token' || result.reason === 'missing'
          ? 400
          : result.reason === 'paid' ||
              result.reason === 'voided' ||
              result.reason === 'fulfilled'
            ? 409
            : 500
      return NextResponse.json(
        {
          error:
            result.reason === 'paid'
              ? 'See tellimus on juba makstud'
              : result.reason === 'invalid-token'
                ? 'Link on vigane või aegunud'
                : 'Makset ei õnnestunud uuesti alustada',
          reason: result.reason,
          merchantReference: result.merchantReference,
        },
        { status }
      )
    }

    return NextResponse.json({
      success: true,
      paymentUrl: result.paymentUrl,
      merchantReference: result.merchantReference,
      uuid: result.uuid,
    })
  } catch (error) {
    reportError(error, { tags: { area: 'montonio', route: 'retry-order' } })
    return NextResponse.json(
      { error: 'Makset ei õnnestunud uuesti alustada' },
      { status: 500 }
    )
  }
}
