import type { Client } from '@notionhq/client'
import { sendHayAbandonedEmail } from '@/lib/email'
import {
  ABANDONED_EMAIL_MAX_AGE_MS,
  ABANDONED_EMAIL_MIN_AGE_MS,
  ABANDONED_EMAIL_NOTION_PROP,
  decideAbandonedEmailAction,
  getAbandonedEmailCutoff,
  isAbandonedUnpaid,
} from '@/lib/hay-abandoned-email'
import { hayRetryPageUrl } from '@/lib/hay-order-retry'
import { snapshotHayOrder } from '@/lib/hay-order-payment'
import { hasLaterPaidHayOrder } from '@/lib/hay-reminder-job'
import { getSiteUrl } from '@/lib/site-url'
import { reportError } from '@/lib/report-error'

type NotionPage = {
  id: string
  created_time?: string
  properties: Record<string, any>
}

export type HayAbandonedRunResult = {
  cutoff: string
  scanned: number
  sent: number
  skippedLaterOrder: number
  skippedSameEmail: number
  ignored: number
  errors: number
}

function isoMinutesAgo(now: Date, ms: number): string {
  return new Date(now.getTime() - ms).toISOString()
}

async function queryAbandonedCandidates(
  notion: Client,
  databaseId: string,
  now: Date,
  cutoff: Date
): Promise<NotionPage[]> {
  const createdAfter = new Date(
    Math.max(cutoff.getTime(), now.getTime() - ABANDONED_EMAIL_MAX_AGE_MS)
  ).toISOString()
  const createdBefore = isoMinutesAgo(now, ABANDONED_EMAIL_MIN_AGE_MS)

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
            property: ABANDONED_EMAIL_NOTION_PROP,
            checkbox: { equals: false },
          },
          {
            property: 'Makse',
            checkbox: { equals: false },
          },
          {
            timestamp: 'created_time',
            created_time: { after: createdAfter },
          },
          {
            timestamp: 'created_time',
            created_time: { before: createdBefore },
          },
          {
            or: [
              {
                property: 'Makse staatus',
                select: { equals: 'Katkestatud' },
              },
              {
                property: 'Status',
                select: { equals: 'Maksmata' },
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

async function markAbandonedEmailSent(notion: Client, pageId: string) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [ABANDONED_EMAIL_NOTION_PROP]: { checkbox: true },
    },
  })
}

export async function hasRecentAbandonedEmailForAddress(
  notion: Client,
  databaseId: string,
  email: string,
  sinceIso: string
): Promise<boolean> {
  if (!email) return false

  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 1,
    filter: {
      and: [
        { property: 'Email', email: { equals: email } },
        {
          property: ABANDONED_EMAIL_NOTION_PROP,
          checkbox: { equals: true },
        },
        {
          timestamp: 'created_time',
          created_time: { after: sinceIso },
        },
      ],
    },
  })

  return response.results.length > 0
}

export async function runAbandonedHayEmails(
  notion: Client,
  now = new Date()
): Promise<HayAbandonedRunResult> {
  const cutoff = getAbandonedEmailCutoff()
  const result: HayAbandonedRunResult = {
    cutoff: cutoff.toISOString(),
    scanned: 0,
    sent: 0,
    skippedLaterOrder: 0,
    skippedSameEmail: 0,
    ignored: 0,
    errors: 0,
  }

  const databaseId = process.env.NOTION_HAY_DATABASE_ID
  if (!databaseId) {
    throw new Error('NOTION_HAY_DATABASE_ID is not set')
  }

  const pages = await queryAbandonedCandidates(notion, databaseId, now, cutoff)
  pages.sort((a, b) =>
    String(b.created_time || '').localeCompare(String(a.created_time || ''))
  )
  result.scanned = pages.length
  const emailsSentThisRun = new Set<string>()
  const recentSince = new Date(
    now.getTime() - ABANDONED_EMAIL_MAX_AGE_MS
  ).toISOString()

  for (const page of pages) {
    const snapshot = snapshotHayOrder(page)
    const createdTime = page.created_time || ''
    const email = snapshot.email.trim().toLowerCase()

    try {
      const hasLaterPaidOrder = await hasLaterPaidHayOrder(
        notion,
        databaseId,
        email,
        createdTime
      )
      const alreadySendingToEmail = emailsSentThisRun.has(email)
      const hasRecentAbandonedEmail =
        alreadySendingToEmail ||
        (Boolean(email) &&
          (await hasRecentAbandonedEmailForAddress(
            notion,
            databaseId,
            email,
            recentSince
          )))
      const action = decideAbandonedEmailAction({
        candidate: {
          email,
          abandonedEmailSent: Boolean(
            page.properties[ABANDONED_EMAIL_NOTION_PROP]?.checkbox
          ),
          createdTime,
          unpaidAbandoned: isAbandonedUnpaid({
            paidCheckbox: snapshot.paidCheckbox,
            paymentSelect: snapshot.paymentSelect,
            status: snapshot.status,
          }),
        },
        now,
        cutoff,
        hasLaterPaidOrder,
        hasRecentAbandonedEmail,
        alreadySendingToEmail,
      })

      if (action === 'ignore') {
        result.ignored += 1
        continue
      }

      if (action === 'skip-later-order') {
        await markAbandonedEmailSent(notion, snapshot.pageId)
        result.skippedLaterOrder += 1
        continue
      }

      if (action === 'skip-same-email') {
        await markAbandonedEmailSent(notion, snapshot.pageId)
        result.skippedSameEmail += 1
        continue
      }

      const continueUrl = hayRetryPageUrl(snapshot.pageId, getSiteUrl())
      await sendHayAbandonedEmail({
        email,
        quantity: snapshot.hayQuantity,
        terminal: snapshot.terminal,
        totalPrice: snapshot.totalPrice,
        continueUrl,
      })
      await markAbandonedEmailSent(notion, snapshot.pageId)
      emailsSentThisRun.add(email)
      result.sent += 1
    } catch (error) {
      result.errors += 1
      reportError(error, {
        tags: { area: 'email', route: 'hay-abandoned-cron' },
        extra: { pageId: snapshot.pageId },
      })
    }
  }

  return result
}
