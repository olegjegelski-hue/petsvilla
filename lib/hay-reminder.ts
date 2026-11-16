import { createHmac, timingSafeEqual } from 'crypto'

export const HAY_REMINDER_WEEKS = [3, 4, 6, 8] as const
export type HayReminderWeeks = (typeof HAY_REMINDER_WEEKS)[number]
export const DEFAULT_HAY_REMINDER_WEEKS: HayReminderWeeks = 4

export const HAY_REMINDER_ORDER_URL =
  'https://petsvilla.ee/telli-hein?utm_source=email&utm_medium=meeldetuletus&utm_campaign=hein_kordus'

export const HAY_REMINDER_NOTION_PROPS = {
  enabled: 'Meeldetuletus',
  date: 'Meeldetuletuse kuupäev',
  sent: 'Meeldetuletus saadetud',
} as const

const TALLINN_TZ = 'Europe/Tallinn'

export function isHayReminderWeeks(value: number): value is HayReminderWeeks {
  return (HAY_REMINDER_WEEKS as readonly number[]).includes(value)
}

export function parseHayReminderFlag(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

export function parseHayReminderWeeks(value: unknown): HayReminderWeeks {
  const n = parseInt(String(value ?? DEFAULT_HAY_REMINDER_WEEKS), 10)
  return isHayReminderWeeks(n) ? n : DEFAULT_HAY_REMINDER_WEEKS
}

/** Kalendrikuupäev YYYY-MM-DD Tallinna aja järgi. */
export function todayInTallinn(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TALLINN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/**
 * Lisa nädalaid kalendrikuupäevale (Tallinna päev + N×7 UTC-päeva).
 * DST ei nihuta kuupäeva, sest töötame kuupäevaosaga.
 */
export function addWeeksToIsoDate(from: Date, weeks: number): string {
  const start = todayInTallinn(from)
  const [year, month, day] = start.split('-').map(Number)
  const utc = new Date(Date.UTC(year, month - 1, day))
  utc.setUTCDate(utc.getUTCDate() + weeks * 7)
  return utc.toISOString().slice(0, 10)
}

export function buildHayReminderNotionProperties(input: {
  reminder: boolean
  reminderWeeks?: number
  now?: Date
}): Record<string, unknown> {
  if (!input.reminder) {
    return {
      [HAY_REMINDER_NOTION_PROPS.enabled]: { checkbox: false },
      [HAY_REMINDER_NOTION_PROPS.sent]: { checkbox: false },
      [HAY_REMINDER_NOTION_PROPS.date]: { date: null },
    }
  }

  const weeks = parseHayReminderWeeks(input.reminderWeeks)
  return {
    [HAY_REMINDER_NOTION_PROPS.enabled]: { checkbox: true },
    [HAY_REMINDER_NOTION_PROPS.sent]: { checkbox: false },
    [HAY_REMINDER_NOTION_PROPS.date]: {
      date: { start: addWeeksToIsoDate(input.now ?? new Date(), weeks) },
    },
  }
}

export type HayReminderDecision = 'send' | 'skip-later-order' | 'ignore'

export type HayReminderCandidate = {
  reminder: boolean
  reminderSent: boolean
  reminderDate: string | null
  paid: boolean
  email: string
}

/**
 * Kas see tellimus peaks täna meeldetuletuse saama.
 * Uus makstud tellimus samalt e-postilt → ära saada, märgi töödelduks.
 */
export function decideHayReminderAction(input: {
  candidate: HayReminderCandidate
  today: string
  hasLaterPaidOrder: boolean
}): HayReminderDecision {
  const { candidate, today, hasLaterPaidOrder } = input
  if (
    !candidate.reminder ||
    candidate.reminderSent ||
    !candidate.paid ||
    !candidate.email ||
    !candidate.reminderDate ||
    candidate.reminderDate > today
  ) {
    return 'ignore'
  }

  if (hasLaterPaidOrder) {
    return 'skip-later-order'
  }

  return 'send'
}

export function isHayOrderPaid(input: {
  paidCheckbox?: boolean
  paymentSelect?: string | null
}): boolean {
  return Boolean(input.paidCheckbox) || input.paymentSelect === 'Makstud'
}

export function getHayReminderSecret(): string {
  const secret =
    process.env.HAY_REMINDER_SECRET ||
    process.env.CRON_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.NOTION_API_KEY

  if (!secret) {
    throw new Error(
      'Meeldetuletuse allkiri vajab HAY_REMINDER_SECRET, CRON_SECRET, NEXTAUTH_SECRET või NOTION_API_KEY'
    )
  }

  return secret
}

export function createHayReminderOptOutToken(
  pageId: string,
  secret = getHayReminderSecret()
): string {
  const payload = Buffer.from(pageId, 'utf8').toString('base64url')
  const signature = createHmac('sha256', secret).update(pageId).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyHayReminderOptOutToken(
  token: string,
  secret = getHayReminderSecret()
): string | null {
  const [payload, signature] = String(token || '').split('.')
  if (!payload || !signature) return null

  let pageId: string
  try {
    pageId = Buffer.from(payload, 'base64url').toString('utf8')
  } catch {
    return null
  }

  if (!pageId) return null

  const expected = createHmac('sha256', secret).update(pageId).digest('base64url')
  const given = Buffer.from(signature)
  const wanted = Buffer.from(expected)
  if (given.length !== wanted.length) return null
  if (!timingSafeEqual(given, wanted)) return null

  return pageId
}

export function hayReminderOptOutUrl(
  pageId: string,
  siteUrl: string,
  secret = getHayReminderSecret()
): string {
  const token = createHayReminderOptOutToken(pageId, secret)
  const base = siteUrl.replace(/\/+$/, '')
  return `${base}/meeldetuletus-valja?token=${encodeURIComponent(token)}`
}
