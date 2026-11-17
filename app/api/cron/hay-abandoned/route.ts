import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { runAbandonedHayEmails } from '@/lib/hay-abandoned-job'
import { isAuthorizedCron } from '@/lib/hay-reminder-job'
import { reportError } from '@/lib/report-error'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY })
    const result = await runAbandonedHayEmails(notion)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    reportError(error, { tags: { area: 'cron', route: 'hay-abandoned' } })
    console.error('Hay abandoned-order cron failed:', error)
    return NextResponse.json(
      { error: 'Pooleli kirjade saatmine ebaõnnestus' },
      { status: 500 }
    )
  }
}
