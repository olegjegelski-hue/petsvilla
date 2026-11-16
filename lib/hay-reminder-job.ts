import type { Client } from '@notionhq/client'
import { sendHayReminderEmail } from '@/lib/email'
import {
  decideHayReminderAction,
  hayReminderOptOutUrl,
  HAY_REMINDER_NOTION_PROPS,
  isHayOrderPaid,
  todayInTallinn,
  verifyHayReminderOptOutToken,
  type HayReminderCandidate,
} from '@/lib/hay-reminder'
import { getSiteUrl } from '@/lib/site-url'
import { reportError } from '@/lib/report-error'

type NotionPage = {
  id: string
  created_time?: string
  properties: Record<string, any>
}

export type HayReminderRunResult = {
  today: string
  scanned: number
  sent: number
  skippedLaterOrder: number
  ignored: number
  errors: number
}

function readSelect(prop: any): string | null {
  return prop?.select?.name || null
}

function snapshotReminder(page: NotionPage): HayReminderCandidate & {
  pageId: string
  createdTime: string
} {
  const props = page.properties
  return {
    pageId: page.id,
    createdTime: page.created_time || '',
    email: String(props.Email?.email || '')
      .trim()
      .toLowerCase(),
    reminder: Boolean(props[HAY_REMINDER_NOTION_PROPS.enabled]?.checkbox),
    reminderSent: Boolean(props[HAY_REMINDER_NOTION_PROPS.sent]?.checkbox),
    reminderDate: props[HAY_REMINDER_NOTION_PROPS.date]?.date?.start || null,
    paid: isHayOrderPaid({
      paidCheckbox: Boolean(props.Makse?.checkbox),
      paymentSelect: readSelect(props['Makse staatus']),
    }),
  }
}

async function markReminderProcessed(notion: Client, pageId: string) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [HAY_REMINDER_NOTION_PROPS.sent]: { checkbox: true },
    },
  })
}

async function disableReminder(notion: Client, pageId: string) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [HAY_REMINDER_NOTION_PROPS.enabled]: { checkbox: false },
      [HAY_REMINDER_NOTION_PROPS.sent]: { checkbox: true },
    },
  })
}

export async function hasLaterPaidHayOrder(
  notion: Client,
  databaseId: string,
  email: string,
  createdTime: string
): Promise<boolean> {
  if (!email || !createdTime) return false

  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 1,
    filter: {
      and: [
        { property: 'Email', email: { equals: email } },
        {
          timestamp: 'created_time',
          created_time: { after: createdTime },
        },
        {
          or: [
            { property: 'Makse', checkbox: { equals: true } },
            {
              property: 'Makse staatus',
              select: { equals: 'Makstud' },
            },
          ],
        },
      ],
    },
  })

  return response.results.length > 0
}

async function queryDueReminders(
  notion: Client,
  databaseId: string,
  today: string
): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 50,
      filter: {
        and: [
          {
            property: HAY_REMINDER_NOTION_PROPS.enabled,
            checkbox: { equals: true },
          },
          {
            property: HAY_REMINDER_NOTION_PROPS.sent,
            checkbox: { equals: false },
          },
          {
            property: HAY_REMINDER_NOTION_PROPS.date,
            date: { on_or_before: today },
          },
          {
            or: [
              { property: 'Makse', checkbox: { equals: true } },
              {
                property: 'Makse staatus',
                select: { equals: 'Makstud' },
              },
            ],
          },
        ],
      },
    })

    pages.push(...(response.results as NotionPage[]))
    cursor = response.has_more ? response.next_cursor || undefined : undefined
  } while (cursor)

  return pages
}

export function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

export async function runHayReminders(notion: Client): Promise<HayReminderRunResult> {
  const today = todayInTallinn()
  const result: HayReminderRunResult = {
    today,
    scanned: 0,
    sent: 0,
    skippedLaterOrder: 0,
    ignored: 0,
    errors: 0,
  }

  const databaseId = process.env.NOTION_HAY_DATABASE_ID
  if (!databaseId) {
    throw new Error('NOTION_HAY_DATABASE_ID is not set')
  }

  const pages = await queryDueReminders(notion, databaseId, today)
  result.scanned = pages.length

  for (const page of pages) {
    const snapshot = snapshotReminder(page)
    try {
      const hasLaterPaidOrder = await hasLaterPaidHayOrder(
        notion,
        databaseId,
        snapshot.email,
        snapshot.createdTime
      )
      const action = decideHayReminderAction({
        candidate: snapshot,
        today,
        hasLaterPaidOrder,
      })

      if (action === 'ignore') {
        result.ignored += 1
        continue
      }

      if (action === 'skip-later-order') {
        await markReminderProcessed(notion, snapshot.pageId)
        result.skippedLaterOrder += 1
        continue
      }

      const optOutUrl = hayReminderOptOutUrl(snapshot.pageId, getSiteUrl())
      await sendHayReminderEmail({
        email: snapshot.email,
        optOutUrl,
      })
      await markReminderProcessed(notion, snapshot.pageId)
      result.sent += 1
    } catch (error) {
      result.errors += 1
      reportError(error, {
        tags: { area: 'email', route: 'hay-reminder-cron' },
        extra: { pageId: snapshot.pageId },
      })
    }
  }

  return result
}

export type HayReminderOptOutResult =
  | { ok: true; alreadyOff?: boolean }
  | { ok: false; reason: 'missing-token' | 'invalid-token' | 'not-found' | 'error' }

export async function optOutHayReminder(
  notion: Client,
  token: string | undefined
): Promise<HayReminderOptOutResult> {
  if (!token) return { ok: false, reason: 'missing-token' }

  const pageId = verifyHayReminderOptOutToken(token)
  if (!pageId) return { ok: false, reason: 'invalid-token' }

  try {
    const page = (await notion.pages.retrieve({ page_id: pageId })) as NotionPage
    const snapshot = snapshotReminder(page)
    if (!snapshot.reminder) {
      return { ok: true, alreadyOff: true }
    }
    await disableReminder(notion, pageId)
    return { ok: true }
  } catch (error: any) {
    const code = error?.code || error?.status
    if (code === 'object_not_found' || code === 404) {
      return { ok: false, reason: 'not-found' }
    }
    reportError(error, {
      tags: { area: 'notion', route: 'hay-reminder-opt-out' },
      extra: { pageId },
    })
    return { ok: false, reason: 'error' }
  }
}
