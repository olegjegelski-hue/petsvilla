import type { Client } from '@notionhq/client'
import { sendHayReminderEmail, sendHayWinbackEmail } from '@/lib/email'
import {
  addDaysToIsoDate,
  buildHayReminderSentProperties,
  decideHayReminderAction,
  hayReminderListUnsubscribeUrl,
  hayReminderOptOutUrl,
  hayPaidNotionFilter,
  HAY_REMINDER_NOTION_PROPS,
  HAY_REMINDER_TYPE,
  HAY_WINBACK_DAYS,
  hasLaterPaidFromIndex,
  isHayOrderPaid,
  isHayWinbackDryRun,
  getHayWinbackDailyLimit,
  maskHayEmail,
  normalizeHayEmail,
  selectHayWinbackRecipients,
  todayInTallinn,
  verifyHayReminderOptOutToken,
  type HayReminderCandidate,
  type HayWinbackOrder,
  type LatestPaidHayOrder,
} from '@/lib/hay-reminder'
import { getSiteUrl } from '@/lib/site-url'
import { reportError } from '@/lib/report-error'

type NotionPage = {
  id: string
  created_time?: string
  properties: Record<string, any>
}

const PAID_FILTER = hayPaidNotionFilter()

export type HayWinbackRunResult = {
  scanned: number
  sent: number
  dryRun: boolean
  dryRunListed: number
  eligible: number
  limited: number
  skippedLaterOrder: number
  skippedOptedOut: number
  ignored: number
  errors: number
}

export type HayReminderRunResult = {
  today: string
  scanned: number
  sent: number
  skippedLaterOrder: number
  skippedOptedOut: number
  ignored: number
  errors: number
  winback: HayWinbackRunResult
}

function readSelect(prop: any): string | null {
  return prop?.select?.name || null
}

function snapshotReminder(page: NotionPage): HayReminderCandidate & {
  pageId: string
  createdTime: string
  optedOut: boolean
} {
  const props = page.properties
  return {
    pageId: page.id,
    createdTime: page.created_time || '',
    email: normalizeHayEmail(props.Email?.email || ''),
    reminder: Boolean(props[HAY_REMINDER_NOTION_PROPS.enabled]?.checkbox),
    reminderSent: Boolean(props[HAY_REMINDER_NOTION_PROPS.sent]?.checkbox),
    reminderDate: props[HAY_REMINDER_NOTION_PROPS.date]?.date?.start || null,
    optedOut: Boolean(props[HAY_REMINDER_NOTION_PROPS.optedOut]?.checkbox),
    paid: isHayOrderPaid({
      paidCheckbox: Boolean(props.Makse?.checkbox),
      paymentSelect: readSelect(props['Makse staatus']),
      status: readSelect(props.Status),
    }),
  }
}

function snapshotWinback(page: NotionPage): HayWinbackOrder & {
  optedOut: boolean
} {
  const snapshot = snapshotReminder(page)
  return {
    pageId: snapshot.pageId,
    email: snapshot.email,
    createdTime: snapshot.createdTime,
    reminder: snapshot.reminder,
    reminderSent: snapshot.reminderSent,
    paid: snapshot.paid,
    optedOut: snapshot.optedOut,
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

async function markReminderSent(
  notion: Client,
  pageId: string,
  type: (typeof HAY_REMINDER_TYPE)[keyof typeof HAY_REMINDER_TYPE],
  sentDate: string
) {
  await notion.pages.update({
    page_id: pageId,
    properties: buildHayReminderSentProperties({ type, sentDate }) as any,
  })
}

async function markOptedOut(notion: Client, pageId: string) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [HAY_REMINDER_NOTION_PROPS.optedOut]: { checkbox: true },
      [HAY_REMINDER_NOTION_PROPS.enabled]: { checkbox: false },
      [HAY_REMINDER_NOTION_PROPS.sent]: { checkbox: true },
    },
  })
}

async function queryAllPages(
  notion: Client,
  databaseId: string,
  filter: Record<string, unknown>
): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      filter: filter as any,
    })
    pages.push(...(response.results as NotionPage[]))
    cursor = response.has_more ? response.next_cursor || undefined : undefined
  } while (cursor)

  return pages
}

export async function loadOptedOutHayEmails(
  notion: Client,
  databaseId: string
): Promise<Set<string>> {
  const pages = await queryAllPages(notion, databaseId, {
    property: HAY_REMINDER_NOTION_PROPS.optedOut,
    checkbox: { equals: true },
  })
  const emails = new Set<string>()
  for (const page of pages) {
    const email = normalizeHayEmail(page.properties?.Email?.email || '')
    if (email) emails.add(email)
  }
  return emails
}

export async function loadLatestPaidHayByEmail(
  notion: Client,
  databaseId: string
): Promise<Map<string, LatestPaidHayOrder>> {
  const pages = await queryAllPages(notion, databaseId, PAID_FILTER)
  const latest = new Map<string, LatestPaidHayOrder>()

  for (const page of pages) {
    const snapshot = snapshotReminder(page)
    if (!snapshot.paid || !snapshot.email || !snapshot.createdTime) continue
    const prev = latest.get(snapshot.email)
    if (!prev || snapshot.createdTime > prev.createdTime) {
      latest.set(snapshot.email, {
        pageId: snapshot.pageId,
        createdTime: snapshot.createdTime,
      })
    }
  }

  return latest
}

export async function hasLaterPaidHayOrder(
  notion: Client,
  databaseId: string,
  email: string,
  createdTime: string
): Promise<boolean> {
  const normalized = normalizeHayEmail(email)
  if (!normalized || !createdTime) return false

  let cursor: string | undefined
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        and: [
          {
            timestamp: 'created_time',
            created_time: { after: createdTime },
          },
          PAID_FILTER,
        ],
      },
    })

    for (const page of response.results as NotionPage[]) {
      const pageEmail = normalizeHayEmail(page.properties?.Email?.email || '')
      if (pageEmail && pageEmail === normalized) return true
    }

    cursor = response.has_more ? response.next_cursor || undefined : undefined
  } while (cursor)

  return false
}

async function queryDueReminders(
  notion: Client,
  databaseId: string,
  today: string
): Promise<NotionPage[]> {
  return queryAllPages(notion, databaseId, {
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
      PAID_FILTER,
    ],
  })
}

async function queryWinbackCandidates(
  notion: Client,
  databaseId: string,
  today: string
): Promise<NotionPage[]> {
  const cutoff = addDaysToIsoDate(today, -(HAY_WINBACK_DAYS - 1))
  return queryAllPages(notion, databaseId, {
    and: [
      {
        property: HAY_REMINDER_NOTION_PROPS.enabled,
        checkbox: { equals: false },
      },
      {
        property: HAY_REMINDER_NOTION_PROPS.sent,
        checkbox: { equals: false },
      },
      {
        timestamp: 'created_time',
        created_time: { on_or_before: `${cutoff}T23:59:59.999+03:00` },
      },
      PAID_FILTER,
    ],
  })
}

export function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

async function runCheckboxReminders(input: {
  notion: Client
  pages: NotionPage[]
  today: string
  optedOutEmails: Set<string>
  latestPaidByEmail: Map<string, LatestPaidHayOrder>
  result: HayReminderRunResult
}) {
  const { notion, pages, today, optedOutEmails, latestPaidByEmail, result } =
    input
  const siteUrl = getSiteUrl()

  for (const page of pages) {
    const snapshot = snapshotReminder(page)
    try {
      const action = decideHayReminderAction({
        candidate: snapshot,
        today,
        hasLaterPaidOrder: hasLaterPaidFromIndex(
          snapshot.email,
          snapshot.pageId,
          snapshot.createdTime,
          latestPaidByEmail
        ),
        emailOptedOut: optedOutEmails.has(snapshot.email),
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

      if (action === 'skip-opted-out') {
        await markReminderProcessed(notion, snapshot.pageId)
        result.skippedOptedOut += 1
        continue
      }

      const optOutUrl = hayReminderOptOutUrl(snapshot.pageId, siteUrl)
      const listUnsubscribeUrl = hayReminderListUnsubscribeUrl(
        snapshot.pageId,
        siteUrl
      )
      await sendHayReminderEmail({
        email: snapshot.email,
        optOutUrl,
        listUnsubscribeUrl,
      })
      await markReminderSent(
        notion,
        snapshot.pageId,
        HAY_REMINDER_TYPE.checkbox,
        today
      )
      result.sent += 1
    } catch (error) {
      result.errors += 1
      reportError(error, {
        tags: { area: 'email', route: 'hay-reminder-cron' },
        extra: { pageId: snapshot.pageId },
      })
    }
  }
}

async function runWinbackReminders(input: {
  notion: Client
  databaseId: string
  today: string
  optedOutEmails: Set<string>
  latestPaidByEmail: Map<string, LatestPaidHayOrder>
}): Promise<HayWinbackRunResult> {
  const { notion, databaseId, today, optedOutEmails, latestPaidByEmail } = input
  const dryRun = isHayWinbackDryRun()
  const limit = getHayWinbackDailyLimit()
  const result: HayWinbackRunResult = {
    scanned: 0,
    sent: 0,
    dryRun,
    dryRunListed: 0,
    eligible: 0,
    limited: 0,
    skippedLaterOrder: 0,
    skippedOptedOut: 0,
    ignored: 0,
    errors: 0,
  }

  const pages = await queryWinbackCandidates(notion, databaseId, today)
  result.scanned = pages.length

  const queue = selectHayWinbackRecipients({
    candidates: pages.map(snapshotWinback),
    latestPaidByEmail,
    optedOutEmails,
    today,
    limit,
  })

  result.skippedLaterOrder = queue.skippedLaterOrder
  result.skippedOptedOut = queue.skippedOptedOut
  result.ignored = queue.ignored
  result.eligible = queue.selected.length + queue.deferred.length
  result.limited = queue.deferred.length

  if (dryRun) {
    const masked = queue.selected.map((row) => maskHayEmail(row.email))
    result.dryRunListed = masked.length
    console.log('[hay-winback dry-run]', {
      today,
      eligible: result.eligible,
      wouldSendToday: masked.length,
      limited: queue.deferred.length,
      skippedLaterOrder: queue.skippedLaterOrder,
      skippedOptedOut: queue.skippedOptedOut,
      ignored: queue.ignored,
      emails: masked,
    })
    return result
  }

  const siteUrl = getSiteUrl()
  for (const row of queue.selected) {
    try {
      const optOutUrl = hayReminderOptOutUrl(row.pageId, siteUrl)
      const listUnsubscribeUrl = hayReminderListUnsubscribeUrl(
        row.pageId,
        siteUrl
      )
      await sendHayWinbackEmail({
        email: row.email,
        optOutUrl,
        listUnsubscribeUrl,
      })
      await markReminderSent(
        notion,
        row.pageId,
        HAY_REMINDER_TYPE.winback,
        today
      )
      result.sent += 1
    } catch (error) {
      result.errors += 1
      reportError(error, {
        tags: { area: 'email', route: 'hay-winback-cron' },
        extra: { pageId: row.pageId },
      })
    }
  }

  return result
}

export async function runHayReminders(notion: Client): Promise<HayReminderRunResult> {
  const today = todayInTallinn()
  const result: HayReminderRunResult = {
    today,
    scanned: 0,
    sent: 0,
    skippedLaterOrder: 0,
    skippedOptedOut: 0,
    ignored: 0,
    errors: 0,
    winback: {
      scanned: 0,
      sent: 0,
      dryRun: isHayWinbackDryRun(),
      dryRunListed: 0,
      eligible: 0,
      limited: 0,
      skippedLaterOrder: 0,
      skippedOptedOut: 0,
      ignored: 0,
      errors: 0,
    },
  }

  const databaseId = process.env.NOTION_HAY_DATABASE_ID
  if (!databaseId) {
    throw new Error('NOTION_HAY_DATABASE_ID is not set')
  }

  const [optedOutEmails, latestPaidByEmail, duePages] = await Promise.all([
    loadOptedOutHayEmails(notion, databaseId),
    loadLatestPaidHayByEmail(notion, databaseId),
    queryDueReminders(notion, databaseId, today),
  ])

  result.scanned = duePages.length
  await runCheckboxReminders({
    notion,
    pages: duePages,
    today,
    optedOutEmails,
    latestPaidByEmail,
    result,
  })

  result.winback = await runWinbackReminders({
    notion,
    databaseId,
    today,
    optedOutEmails,
    latestPaidByEmail,
  })

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
    if (snapshot.optedOut) {
      return { ok: true, alreadyOff: true }
    }
    await markOptedOut(notion, pageId)
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
