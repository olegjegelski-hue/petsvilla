'use client'

import { useEffect } from 'react'
import {
  FACEBOOK_GROUPS_BRAND_COLOR,
  buildGroupJoinClickParams,
} from '@/lib/facebook-groups'

const REDIRECT_FALLBACK_MS = 800

type GroupJoinRedirectProps = {
  slug: string
  facebookUrl: string
  groupName: string
  utmSource?: string
  utmMedium?: string
}

export function GroupJoinRedirect({
  slug,
  facebookUrl,
  groupName,
  utmSource,
  utmMedium,
}: GroupJoinRedirectProps) {
  useEffect(() => {
    const redirect = () => {
      window.location.replace(facebookUrl)
    }

    const gtag = window.gtag
    if (typeof gtag !== 'function') {
      redirect()
      return
    }

    const timer = window.setTimeout(redirect, REDIRECT_FALLBACK_MS)
    const params = buildGroupJoinClickParams(slug, utmSource, utmMedium)
    gtag('event', 'group_join_click', {
      ...params,
      event_callback: () => {
        window.clearTimeout(timer)
        redirect()
      },
    })

    return () => window.clearTimeout(timer)
  }, [slug, facebookUrl, utmSource, utmMedium])

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-lg text-gray-700 mb-6">
          Suuname sind Facebooki gruppi {groupName}…
        </p>
        <a
          href={facebookUrl}
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: FACEBOOK_GROUPS_BRAND_COLOR }}
        >
          Ava grupp Facebookis
        </a>
        <noscript>
          <meta httpEquiv="refresh" content={`0;url=${facebookUrl}`} />
        </noscript>
      </div>
    </main>
  )
}
