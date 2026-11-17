import jwt from 'jsonwebtoken'
import type { Client } from '@notionhq/client'
import {
  createMontonioOrder,
  generateMerchantReference,
} from '@/lib/montonio'
import {
  buildHayMontonioOrderData,
  resolveMontonioOrigin,
} from '@/lib/hay-montonio-order'
import {
  findHayOrderByPageId,
  snapshotHayOrder,
  type HayOrderSnapshot,
} from '@/lib/hay-order-payment'
import { getHayReminderSecret } from '@/lib/hay-reminder'
import { getSiteUrl } from '@/lib/site-url'

export const HAY_RETRY_TOKEN_PURPOSE = 'hay-retry'
export const HAY_RETRY_TOKEN_EXPIRES = '7d'
export const HAY_RETRY_PAGE_PATH = '/maksa-uuesti'

const FULFILLED_STATUSES = new Set(['Saadetud', 'Lõpetatud', 'Tagastatud'])
const BLOCKED_PAYMENT_SELECTS = new Set(['Makstud', 'Tühistatud'])
const PENDING_MONTONIO_STATUSES = new Set(['PENDING', 'AUTHORIZED'])
const PAID_MONTONIO_STATUSES = new Set(['PAID', 'FINALIZED'])
const VOIDED_MONTONIO_STATUSES = new Set(['VOIDED'])

export type HayRetryTokenPayload = {
  purpose: typeof HAY_RETRY_TOKEN_PURPOSE
  pageId: string
}

export type HayRetryEligibility =
  | { ok: true }
  | {
      ok: false
      reason: 'paid' | 'voided' | 'fulfilled' | 'pending' | 'missing'
    }

function getHayRetrySecret(): string {
  return getHayReminderSecret()
}

export function createHayRetryToken(
  pageId: string,
  secret = getHayRetrySecret()
): string {
  if (!pageId) {
    throw new Error('Retry token vajab Notioni pageId-d')
  }
  return jwt.sign(
    { purpose: HAY_RETRY_TOKEN_PURPOSE, pageId } satisfies HayRetryTokenPayload,
    secret,
    { algorithm: 'HS256', expiresIn: HAY_RETRY_TOKEN_EXPIRES }
  )
}

export function verifyHayRetryToken(
  token: string,
  secret = getHayRetrySecret()
): string | null {
  if (!token || typeof token !== 'string') return null
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as Partial<HayRetryTokenPayload>
    if (
      decoded.purpose !== HAY_RETRY_TOKEN_PURPOSE ||
      typeof decoded.pageId !== 'string' ||
      !decoded.pageId
    ) {
      return null
    }
    return decoded.pageId
  } catch {
    return null
  }
}

export function hayRetryPageUrl(
  pageId: string,
  siteUrl = getSiteUrl(),
  secret = getHayRetrySecret()
): string {
  const token = createHayRetryToken(pageId, secret)
  const base = siteUrl.replace(/\/+$/, '')
  return `${base}${HAY_RETRY_PAGE_PATH}?token=${encodeURIComponent(token)}`
}

export function isRetryableMontonioStatus(status: string): boolean {
  const normalized = status.trim().toUpperCase()
  if (!normalized) return true
  if (PAID_MONTONIO_STATUSES.has(normalized)) return false
  if (PENDING_MONTONIO_STATUSES.has(normalized)) return false
  if (VOIDED_MONTONIO_STATUSES.has(normalized)) return false
  return true
}

export function hayOrderRetryEligibility(
  snapshot: HayOrderSnapshot | null
): HayRetryEligibility {
  if (!snapshot) return { ok: false, reason: 'missing' }
  if (snapshot.paidCheckbox || snapshot.paymentSelect === 'Makstud') {
    return { ok: false, reason: 'paid' }
  }
  if (snapshot.paymentSelect === 'Tühistatud') {
    return { ok: false, reason: 'voided' }
  }
  if (snapshot.status && FULFILLED_STATUSES.has(snapshot.status)) {
    return { ok: false, reason: 'fulfilled' }
  }
  if (
    snapshot.paymentSelect &&
    BLOCKED_PAYMENT_SELECTS.has(snapshot.paymentSelect)
  ) {
    return { ok: false, reason: 'paid' }
  }
  return { ok: true }
}

export function commentsWithNewMontonioPayment(
  comments: string,
  input: { merchantReference: string; uuid: string; now?: Date }
): string {
  const header = [
    `Montonio Reference: ${input.merchantReference}`,
    `Montonio UUID: ${input.uuid}`,
    `Retry: ${(input.now ?? new Date()).toISOString()}`,
    '',
  ].join('\n')
  const rest = comments.trim()
  const next = rest ? `${header}\n${rest}` : header.trimEnd()
  return next.slice(0, 2000)
}

export type RetryHayOrderResult =
  | {
      ok: true
      paymentUrl: string
      merchantReference: string
      uuid: string
      pageId: string
    }
  | {
      ok: false
      reason:
        | 'invalid-token'
        | 'missing'
        | 'paid'
        | 'voided'
        | 'fulfilled'
        | 'pending'
        | 'montonio'
      merchantReference?: string
      error?: string
    }

export async function retryHayOrderPayment(input: {
  notion: Client
  token: string
  origin?: string | null
}): Promise<RetryHayOrderResult> {
  const pageId = verifyHayRetryToken(input.token)
  if (!pageId) return { ok: false, reason: 'invalid-token' }

  const page = await findHayOrderByPageId(input.notion, pageId)
  if (!page) return { ok: false, reason: 'missing' }

  const snapshot = snapshotHayOrder(page)
  const eligibility = hayOrderRetryEligibility(snapshot)
  if (!eligibility.ok) {
    return {
      ok: false,
      reason: eligibility.reason,
      merchantReference: snapshot.merchantReference ?? undefined,
    }
  }

  const merchantReference = generateMerchantReference('HAY')
  const origin = resolveMontonioOrigin(input.origin || getSiteUrl())
  const rabbitFoodPacks =
    snapshot.rabbitFoodKg > 0 ? snapshot.rabbitFoodKg / 2 : 0

  try {
    const { paymentUrl, uuid } = await createMontonioOrder(
      buildHayMontonioOrderData({
        name: snapshot.name,
        email: snapshot.email,
        phone: snapshot.phone,
        hayQuantity: snapshot.hayQuantity,
        guineaPigFoodKg: snapshot.guineaPigFoodKg,
        rabbitFoodPacks,
        totalPrice: snapshot.totalPrice,
        notes: snapshot.comments,
        merchantReference,
        origin,
      })
    )

    const comments = commentsWithNewMontonioPayment(snapshot.comments, {
      merchantReference,
      uuid,
    })

    await input.notion.pages.update({
      page_id: snapshot.pageId,
      properties: {
        Status: { select: { name: 'Töötlemisel' } },
        Makse: { checkbox: false },
        'Makse staatus': { select: { name: 'Ootel' } },
        'Montonio UUID': {
          rich_text: [{ text: { content: uuid || '' } }],
        },
        Comments: {
          rich_text: [{ text: { content: comments } }],
        },
      } as any,
    })

    return {
      ok: true,
      paymentUrl,
      merchantReference,
      uuid,
      pageId: snapshot.pageId,
    }
  } catch (error) {
    return {
      ok: false,
      reason: 'montonio',
      merchantReference: snapshot.merchantReference ?? undefined,
      error: error instanceof Error ? error.message : 'Tundmatu viga',
    }
  }
}
