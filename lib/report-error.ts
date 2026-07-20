import * as Sentry from '@sentry/nextjs'

/**
 * Turvaline vea logimine — töötab ka ilma Sentry DSN-ita (ainult console).
 */
export function reportError(
  error: unknown,
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, unknown>
  }
): void {
  console.error(error)

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) return

  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value)
      })
    }
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    Sentry.captureException(error)
  })
}
