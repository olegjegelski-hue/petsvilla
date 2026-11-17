import { isHayOrderPaid } from '@/lib/hay-reminder'

export const ABANDONED_EMAIL_NOTION_PROP = 'Pooleli kiri saadetud'
export const ABANDONED_EMAIL_MIN_AGE_MS = 60 * 60 * 1000
export const ABANDONED_EMAIL_MAX_AGE_MS = 48 * 60 * 60 * 1000
export const DEFAULT_ABANDONED_EMAIL_AFTER = '2026-11-17T21:00:00.000Z'

export type AbandonedEmailDecision = 'send' | 'skip-later-order' | 'ignore'

export type AbandonedEmailCandidate = {
  email: string
  abandonedEmailSent: boolean
  createdTime: string
  unpaidAbandoned: boolean
}

export function isAbandonedUnpaid(input: {
  paidCheckbox?: boolean
  paymentSelect?: string | null
  status?: string | null
}): boolean {
  if (isHayOrderPaid(input)) return false
  return (
    input.paymentSelect === 'Katkestatud' || input.status === 'Maksmata'
  )
}

/**
 * Kirju saadetakse ainult pärast production-deploy'd loodud ridadele.
 * Env HAY_ABANDONED_EMAIL_AFTER (ISO) katab täpse deploy aja; vaikimisi
 * 2026-11-17T21:00:00.000Z, et vanad (sh 7 kaotatud klienti) kirja ei saaks.
 */
export function getAbandonedEmailCutoff(
  envValue = process.env.HAY_ABANDONED_EMAIL_AFTER
): Date {
  const raw = (envValue || DEFAULT_ABANDONED_EMAIL_AFTER).trim()
  const parsed = new Date(raw)
  if (!Number.isFinite(parsed.getTime())) {
    return new Date(DEFAULT_ABANDONED_EMAIL_AFTER)
  }
  return parsed
}

export function decideAbandonedEmailAction(input: {
  candidate: AbandonedEmailCandidate
  now: Date
  cutoff: Date
  hasLaterPaidOrder: boolean
}): AbandonedEmailDecision {
  const { candidate, now, cutoff, hasLaterPaidOrder } = input
  if (
    !candidate.unpaidAbandoned ||
    candidate.abandonedEmailSent ||
    !candidate.email ||
    !candidate.createdTime
  ) {
    return 'ignore'
  }

  const created = new Date(candidate.createdTime)
  if (!Number.isFinite(created.getTime())) return 'ignore'
  if (created.getTime() <= cutoff.getTime()) return 'ignore'

  const ageMs = now.getTime() - created.getTime()
  if (ageMs < ABANDONED_EMAIL_MIN_AGE_MS) return 'ignore'
  if (ageMs > ABANDONED_EMAIL_MAX_AGE_MS) return 'ignore'

  if (hasLaterPaidOrder) return 'skip-later-order'

  return 'send'
}
