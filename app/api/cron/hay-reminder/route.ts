import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import {
  isAuthorizedCron,
  maybeSendHayReminderDailyReport,
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
    try {
      await maybeSendHayReminderDailyReport(result)
    } catch (reportErrorValue) {
      reportError(reportErrorValue, {
        tags: { area: 'email', route: 'hay-reminder-report' },
      })
      console.error('Hay reminder daily report failed:', reportErrorValue)
    }
    const { recipients, winback, ...rest } = result
    const { recipients: winbackRecipients, ...winbackRest } = winback
    return NextResponse.json({
      ok: true,
      ...rest,
      recipientCount: recipients.length,
      winback: { ...winbackRest, recipientCount: winbackRecipients.length },
    })
  } catch (error) {
    reportError(error, { tags: { area: 'cron', route: 'hay-reminder' } })
    console.error('Hay reminder cron failed:', error)
    return NextResponse.json(
      { error: 'Meeldetuletuste saatmine ebaõnnestus' },
      { status: 500 }
    )
  }
}
