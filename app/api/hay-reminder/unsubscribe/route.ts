import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { isHayReminderUnsubscribeBrowserConfirm } from '@/lib/hay-reminder'
import { optOutHayReminder } from '@/lib/hay-reminder-job'
import { getSiteUrl } from '@/lib/site-url'
import { reportError } from '@/lib/report-error'

export const dynamic = 'force-dynamic'

function tokenFrom(request: NextRequest): string | undefined {
  const fromQuery = request.nextUrl.searchParams.get('token')
  if (fromQuery) return fromQuery
  return undefined
}

function choicePageUrl(request: NextRequest, token: string | undefined): URL {
  const url = request.nextUrl.clone()
  url.pathname = '/meeldetuletus-valja'
  url.search = ''
  if (token) url.searchParams.set('token', token)
  return url
}

export async function GET(request: NextRequest) {
  const token = tokenFrom(request)
  const url = new URL('/meeldetuletus-valja', getSiteUrl())
  if (token) url.searchParams.set('token', token)
  return NextResponse.redirect(url, 302)
}

export async function POST(request: NextRequest) {
  const token = tokenFrom(request)
  const body = await request.text()
  const browserConfirm = isHayReminderUnsubscribeBrowserConfirm(body)

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY })
    const result = await optOutHayReminder(notion, token)

    if (browserConfirm) {
      return NextResponse.redirect(choicePageUrl(request, token), 303)
    }

    if (!result.ok) {
      const status =
        result.reason === 'missing-token' || result.reason === 'invalid-token'
          ? 400
          : result.reason === 'not-found'
            ? 404
            : 500
      return new NextResponse(null, { status })
    }
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    reportError(error, {
      tags: { area: 'email', route: 'hay-reminder-unsubscribe' },
    })
    if (browserConfirm) {
      return NextResponse.redirect(choicePageUrl(request, token), 303)
    }
    return new NextResponse(null, { status: 500 })
  }
}
