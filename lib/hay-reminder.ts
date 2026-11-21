import { createHmac, timingSafeEqual } from 'crypto'

export const HAY_REMINDER_WEEKS = [3, 4, 6, 8] as const
export type HayReminderWeeks = (typeof HAY_REMINDER_WEEKS)[number]
export const DEFAULT_HAY_REMINDER_WEEKS: HayReminderWeeks = 4

export const HAY_REMINDER_ORDER_URL =
  'https://petsvilla.ee/telli-hein?utm_source=email&utm_medium=meeldetuletus&utm_campaign=hein_kordus'

export const HAY_WINBACK_ORDER_URL =
  'https://petsvilla.ee/telli-hein?utm_source=email&utm_medium=meeldetuletus&utm_campaign=hein_90p'

export const HAY_WINBACK_DAYS = 90
export const DEFAULT_HAY_WINBACK_DAILY_LIMIT = 10
export const HAY_REMINDER_OPT_OUT_MESSAGE =
  'Selge — me ei saada sulle enam heina meeldetuletusi.'

export const HAY_REMINDER_TYPE = {
  checkbox: 'Linnuke',
  winback: '90 päeva',
} as const

export type HayReminderTypeName =
  (typeof HAY_REMINDER_TYPE)[keyof typeof HAY_REMINDER_TYPE]

export const HAY_REMINDER_NOTION_PROPS = {
  enabled: 'Meeldetuletus',
  date: 'Meeldetuletuse kuupäev',
  sent: 'Meeldetuletus saadetud',
  optedOut: 'Loobunud',
  type: 'Meeldetuletuse tüüp',
  sentAt: 'Meeldetuletus saadetud (kp)',
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

export type HayReminderDecision =
  | 'send'
  | 'skip-later-order'
  | 'skip-opted-out'
  | 'ignore'

export type HayReminderCandidate = {
  reminder: boolean
  reminderSent: boolean
  reminderDate: string | null
  paid: boolean
  email: string
}

export function normalizeHayEmail(email: string | null | undefined): string {
  return String(email || '').trim().toLowerCase()
}

export function emailsMatch(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const left = normalizeHayEmail(a)
  const right = normalizeHayEmail(b)
  return Boolean(left) && left === right
}

export function maskHayEmail(email: string): string {
  const normalized = normalizeHayEmail(email)
  const at = normalized.indexOf('@')
  if (at <= 0) return '***'
  const local = normalized.slice(0, at)
  const domain = normalized.slice(at + 1)
  const keep = local.slice(0, Math.min(2, local.length))
  return `${keep}***@${domain}`
}

export function addDaysToIsoDate(fromIsoDate: string, days: number): string {
  const [year, month, day] = fromIsoDate.split('-').map(Number)
  const utc = new Date(Date.UTC(year, month - 1, day))
  utc.setUTCDate(utc.getUTCDate() + days)
  return utc.toISOString().slice(0, 10)
}

export function hayWinbackDueDate(created: Date): string {
  return addDaysToIsoDate(todayInTallinn(created), HAY_WINBACK_DAYS)
}

export function isHayWinbackDue(created: Date, today: string): boolean {
  if (!Number.isFinite(created.getTime())) return false
  return hayWinbackDueDate(created) <= today
}

function envFlagTrue(value: string | undefined): boolean {
  const v = String(value || '').trim().toLowerCase()
  return v === 'true' || v === '1' || v === 'yes' || v === 'on'
}

function envFlagFalse(value: string | undefined): boolean {
  const v = String(value || '').trim().toLowerCase()
  return v === 'false' || v === '0' || v === 'no' || v === 'off'
}

/** Vaikimisi true: 90p kirju ei saadeta ega märgita. Tühi / puuduv env = dry-run. */
export function isHayWinbackDryRun(
  envValue = process.env.HAY_WINBACK_DRY_RUN
): boolean {
  if (envValue === undefined || String(envValue).trim() === '') return true
  if (envFlagFalse(envValue)) return false
  if (envFlagTrue(envValue)) return true
  return true
}

export function getHayWinbackDailyLimit(
  envValue = process.env.HAY_WINBACK_DAILY_LIMIT
): number {
  const n = parseInt(String(envValue ?? DEFAULT_HAY_WINBACK_DAILY_LIMIT), 10)
  if (!Number.isFinite(n) || n < 1) return DEFAULT_HAY_WINBACK_DAILY_LIMIT
  return n
}

export type HayWinbackOrder = {
  pageId: string
  email: string
  createdTime: string
  reminder: boolean
  reminderSent: boolean
  paid: boolean
}

export type LatestPaidHayOrder = {
  pageId: string
  createdTime: string
}

/**
 * Kas see tellimus peaks täna linnukese-meeldetuletuse saama.
 * Uus makstud tellimus samalt e-postilt või Loobunud → ära saada.
 */
export function decideHayReminderAction(input: {
  candidate: HayReminderCandidate
  today: string
  hasLaterPaidOrder: boolean
  emailOptedOut?: boolean
}): HayReminderDecision {
  const { candidate, today, hasLaterPaidOrder } = input
  if (
    !candidate.reminder ||
    candidate.reminderSent ||
    !candidate.paid ||
    !normalizeHayEmail(candidate.email) ||
    !candidate.reminderDate ||
    candidate.reminderDate > today
  ) {
    return 'ignore'
  }

  if (input.emailOptedOut) {
    return 'skip-opted-out'
  }

  if (hasLaterPaidOrder) {
    return 'skip-later-order'
  }

  return 'send'
}

export type HayWinbackDecision = 'send' | 'skip-later-order' | 'skip-opted-out' | 'ignore'

export function decideHayWinbackAction(input: {
  candidate: HayWinbackOrder
  today: string
  isLatestPaidOrder: boolean
  emailOptedOut?: boolean
}): HayWinbackDecision {
  const { candidate, today } = input
  const created = new Date(candidate.createdTime)
  if (
    candidate.reminder ||
    candidate.reminderSent ||
    !candidate.paid ||
    !normalizeHayEmail(candidate.email) ||
    !candidate.createdTime ||
    !isHayWinbackDue(created, today)
  ) {
    return 'ignore'
  }

  if (input.emailOptedOut) return 'skip-opted-out'
  if (!input.isLatestPaidOrder) return 'skip-later-order'
  return 'send'
}

export function hasLaterPaidFromIndex(
  email: string,
  pageId: string,
  createdTime: string,
  latestPaidByEmail: Map<string, LatestPaidHayOrder>
): boolean {
  const latest = latestPaidByEmail.get(normalizeHayEmail(email))
  if (!latest) return false
  if (latest.pageId === pageId) return false
  return latest.createdTime > createdTime
}

export function isLatestPaidFromIndex(
  email: string,
  pageId: string,
  latestPaidByEmail: Map<string, LatestPaidHayOrder>
): boolean {
  const latest = latestPaidByEmail.get(normalizeHayEmail(email))
  return Boolean(latest && latest.pageId === pageId)
}

/**
 * 90p järjekord: viimane makstud tellimus kahanevalt, siis päevalimiit.
 * Linnukesega ridu siia ei panda.
 */
export function selectHayWinbackRecipients(input: {
  candidates: HayWinbackOrder[]
  latestPaidByEmail: Map<string, LatestPaidHayOrder>
  optedOutEmails: Set<string>
  today: string
  limit: number
}): {
  selected: HayWinbackOrder[]
  deferred: HayWinbackOrder[]
  skippedLaterOrder: number
  skippedOptedOut: number
  ignored: number
} {
  const eligible: HayWinbackOrder[] = []
  let skippedLaterOrder = 0
  let skippedOptedOut = 0
  let ignored = 0

  for (const candidate of input.candidates) {
    const email = normalizeHayEmail(candidate.email)
    const action = decideHayWinbackAction({
      candidate: { ...candidate, email },
      today: input.today,
      isLatestPaidOrder: isLatestPaidFromIndex(
        email,
        candidate.pageId,
        input.latestPaidByEmail
      ),
      emailOptedOut: input.optedOutEmails.has(email),
    })

    if (action === 'send') {
      eligible.push({ ...candidate, email })
    } else if (action === 'skip-later-order') {
      skippedLaterOrder += 1
    } else if (action === 'skip-opted-out') {
      skippedOptedOut += 1
    } else {
      ignored += 1
    }
  }

  eligible.sort((a, b) => b.createdTime.localeCompare(a.createdTime))
  const limit = input.limit < 1 ? DEFAULT_HAY_WINBACK_DAILY_LIMIT : input.limit

  return {
    selected: eligible.slice(0, limit),
    deferred: eligible.slice(limit),
    skippedLaterOrder,
    skippedOptedOut,
    ignored,
  }
}

export function hayReminderUnsubscribeHeaders(listUnsubscribeUrl: string): {
  'List-Unsubscribe': string
  'List-Unsubscribe-Post': string
} {
  return {
    'List-Unsubscribe': `<${listUnsubscribeUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

export function buildHayReminderSentProperties(input: {
  type: HayReminderTypeName
  sentDate: string
}): Record<string, unknown> {
  return {
    [HAY_REMINDER_NOTION_PROPS.sent]: { checkbox: true },
    [HAY_REMINDER_NOTION_PROPS.type]: { select: { name: input.type } },
    [HAY_REMINDER_NOTION_PROPS.sentAt]: { date: { start: input.sentDate } },
  }
}

export const HAY_PAID_ORDER_STATUSES = ['Saadetud', 'Lõpetatud'] as const

/**
 * Makstud tellimus: Makse ✓ VÕI Makse staatus = Makstud VÕI Status ∈ {Saadetud, Lõpetatud}.
 * Tagastatud / Vigane / Maksmata ja Tühistatud / Katkestatud ei vasta sellele.
 */
export function isHayOrderPaid(input: {
  paidCheckbox?: boolean
  paymentSelect?: string | null
  status?: string | null
}): boolean {
  return (
    Boolean(input.paidCheckbox) ||
    input.paymentSelect === 'Makstud' ||
    (HAY_PAID_ORDER_STATUSES as readonly string[]).includes(input.status || '')
  )
}

/** Notion filter — sama definitsioon mis isHayOrderPaid. */
export function hayPaidNotionFilter() {
  return {
    or: [
      { property: 'Makse' as const, checkbox: { equals: true as const } },
      {
        property: 'Makse staatus' as const,
        select: { equals: 'Makstud' as const },
      },
      {
        property: 'Status' as const,
        select: { equals: 'Saadetud' as const },
      },
      {
        property: 'Status' as const,
        select: { equals: 'Lõpetatud' as const },
      },
    ],
  }
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

export function hayReminderListUnsubscribeUrl(
  pageId: string,
  siteUrl: string,
  secret = getHayReminderSecret()
): string {
  const token = createHayReminderOptOutToken(pageId, secret)
  const base = siteUrl.replace(/\/+$/, '')
  return `${base}/api/hay-reminder/unsubscribe?token=${encodeURIComponent(token)}`
}
