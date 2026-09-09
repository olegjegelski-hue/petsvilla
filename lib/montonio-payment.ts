import { validateMontonioToken } from '@/lib/montonio'

export type MontonioOrderTokenPayload = {
  uuid?: string
  accessKey?: string
  merchantReference?: string
  paymentStatus?: string
  payment_status?: string
  status?: string
  grandTotal?: number
  amount?: number | string
  currency?: string
}

export type NotionHayPaymentUpdate = {
  orderStatus: 'Uus' | 'Töötlemisel' | 'Vigane'
  paymentSelect: 'Ootel' | 'Makstud' | 'Tühistatud' | 'Katkestatud'
  paid: boolean
}

const FULFILLED_STATUSES = new Set(['Saadetud', 'Lõpetatud', 'Tagastatud'])

export function extractMontonioOrderToken(input: {
  body?: Record<string, unknown> | null
  searchParams?: URLSearchParams | null
}): string | null {
  const body = input.body
  const fromBody = [
    body?.orderToken,
    body?.order_token,
    body?.payment_token,
  ].find((value): value is string => typeof value === 'string' && value.length > 0)

  if (fromBody) return fromBody

  const params = input.searchParams
  const fromQuery = [
    params?.get('order-token'),
    params?.get('orderToken'),
    params?.get('payment_token'),
  ].find((value): value is string => typeof value === 'string' && value.length > 0)

  return fromQuery ?? null
}

export function decodeMontonioOrderToken(
  token: string
): MontonioOrderTokenPayload {
  return validateMontonioToken(token) as MontonioOrderTokenPayload
}

export function getMontonioPaymentStatus(
  decoded: MontonioOrderTokenPayload
): string {
  const raw = decoded.paymentStatus ?? decoded.payment_status ?? decoded.status
  return typeof raw === 'string' ? raw.trim().toUpperCase() : ''
}

export function isPaidMontonioStatus(status: string): boolean {
  return status === 'PAID' || status === 'FINALIZED'
}

export function mapMontonioStatusToNotion(
  status: string
): NotionHayPaymentUpdate {
  if (isPaidMontonioStatus(status)) {
    return { orderStatus: 'Uus', paymentSelect: 'Makstud', paid: true }
  }
  if (status === 'ABANDONED') {
    return { orderStatus: 'Vigane', paymentSelect: 'Katkestatud', paid: false }
  }
  if (status === 'VOIDED') {
    return { orderStatus: 'Vigane', paymentSelect: 'Tühistatud', paid: false }
  }
  return { orderStatus: 'Töötlemisel', paymentSelect: 'Ootel', paid: false }
}

/**
 * Ära kirjuta üle juba saadetud/lõpetatud tellimust.
 * Maksmata „Uus“ (vigane verify) tohib ABANDONED/VOIDED peale minna Vigane-ks.
 */
export function nextHayOrderStatus(input: {
  currentStatus: string | null
  alreadyPaid: boolean
  mapped: NotionHayPaymentUpdate
}): string | null {
  const current = input.currentStatus
  if (current && FULFILLED_STATUSES.has(current)) return null
  if (input.mapped.paid) return input.mapped.orderStatus
  // VOIDED võib tulla pärast PAID (pank tühistas) — märgi Vigane, kui pole juba saadetud.
  if (input.mapped.paymentSelect === 'Tühistatud') return input.mapped.orderStatus
  if (input.alreadyPaid) return null
  return input.mapped.orderStatus
}

export function parseMontonioAmount(
  decoded: MontonioOrderTokenPayload
): number | undefined {
  const raw = decoded.grandTotal ?? decoded.amount
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}
