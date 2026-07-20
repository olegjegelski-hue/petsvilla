'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="et">
      <body className="min-h-screen bg-[#E3D8CB] text-green-900 flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Midagi läks valesti</h1>
          <p className="text-gray-700">
            Vabandame — tekkis ootamatu viga. Proovi uuesti või mine avalehele.
          </p>
          {error.digest ? (
            <p className="text-xs text-gray-500">Viide: {error.digest}</p>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-[#1F6A4C] px-5 py-2.5 text-white font-semibold hover:bg-[#19563d]"
            >
              Proovi uuesti
            </button>
            <Link
              href="/"
              className="rounded-lg border border-[#D7CBBE] bg-[#E8DFD3] px-5 py-2.5 font-semibold hover:bg-[#E3D8CB]"
            >
              Avalehele
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
