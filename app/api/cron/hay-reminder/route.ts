import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import {
  isAuthorizedCron,
  runHayReminders,
} from '@/lib/hay-reminder-job'
import { reportError } from '@/lib/report-error'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY })
    const result = await runHayReminders(notion)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    reportError(error, { tags: { area: 'cron', route: 'hay-reminder' } })
    console.error('Hay reminder cron failed:', error)
    return NextResponse.json(
      { error: 'Meeldetuletuste saatmine ebaõnnestus' },
      { status: 500 }
    )
  }
}
