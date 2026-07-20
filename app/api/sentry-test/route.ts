import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

/**
 * Ühekordne verifitseerimise endpoint (K20a).
 * Kaitstud query-paramiga; eemalda pärast DoD tõendit.
 * GET /api/sentry-test?key=petsvilla-sentry-verify-k20a
 */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('key')
  if (key !== 'petsvilla-sentry-verify-k20a') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) {
    return NextResponse.json(
      { ok: false, error: 'Sentry DSN puudub' },
      { status: 500 }
    )
  }

  const err = new Error('petsvilla test')
  Sentry.withScope((scope) => {
    scope.setTag('verification', 'k20a')
    scope.setLevel('error')
    Sentry.captureException(err)
  })
  await Sentry.flush(3000)

  return NextResponse.json({
    ok: true,
    message: 'Test-event saadetud',
    environment:
      process.env.SENTRY_ENVIRONMENT ||
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV,
  })
}
