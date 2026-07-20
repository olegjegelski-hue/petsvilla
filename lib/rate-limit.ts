import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { reportError } from '@/lib/report-error'

type RateLimitEntry = { count: number; resetAt: number }

/** Protsessi-sisene store (Vercel serverless — per-instance; parem kui midagi). */
const stores = new Map<string, Map<string, RateLimitEntry>>()

function getStore(bucket: string): Map<string, RateLimitEntry> {
  let store = stores.get(bucket)
  if (!store) {
    store = new Map()
    stores.set(bucket, store)
  }
  return store
}

export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }

  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  return 'unknown'
}

export type RateLimitOptions = {
  /** Unikaalne ämbri nimi (nt contact, hay-order). */
  bucket: string
  /** Max päringuid aknas. */
  max?: number
  /** Aken ms. */
  windowMs?: number
}

export type RateLimitResult = {
  limited: boolean
  remaining: number
  resetAt: number
}

/**
 * Lihtne fikseeritud aknaga limiit IP kohta.
 * Default: 5 päringut / 10 min.
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions
): RateLimitResult {
  const max = options.max ?? 5
  const windowMs = options.windowMs ?? 10 * 60 * 1000
  const now = Date.now()
  const store = getStore(options.bucket)
  const key = ip || 'unknown'

  let entry = store.get(key)
  if (!entry || entry.resetAt < now) {
    entry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { limited: false, remaining: max - 1, resetAt: entry.resetAt }
  }

  entry.count += 1
  store.set(key, entry)

  return {
    limited: entry.count > max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.resetAt,
  }
}

/** Testide jaoks — tühjenda store. */
export function resetRateLimitStore(bucket?: string): void {
  if (bucket) {
    stores.delete(bucket)
  } else {
    stores.clear()
  }
}

export function rateLimitExceededResponse(
  request: NextRequest,
  options: RateLimitOptions & { route: string }
): NextResponse | null {
  const ip = getClientIp(request)
  const result = checkRateLimit(ip, options)

  if (!result.limited) return null

  reportError(new Error('API rate limit exceeded'), {
    tags: {
      area: 'abuse',
      route: options.route,
      bucket: options.bucket,
    },
    extra: { ip, resetAt: result.resetAt },
  })

  const retryAfterSec = Math.max(
    1,
    Math.ceil((result.resetAt - Date.now()) / 1000)
  )

  return NextResponse.json(
    { error: 'Liiga palju päringuid. Palun proovi mõne aja pärast uuesti.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
      },
    }
  )
}
