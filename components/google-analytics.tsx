'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  hasAnalyticsConsent,
  onConsentChange,
  type CookieConsent,
} from '@/lib/cookie-consent'
import { resolveGoogleTagIds } from '@/lib/google-ads'
import { bootstrapGoogleTag, googleTagLoadPlan } from '@/lib/gtag'

export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false)
  const tags = resolveGoogleTagIds(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  )
  const load = googleTagLoadPlan(allowed, tags)

  useEffect(() => {
    const currentTags = resolveGoogleTagIds(
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    )

    const apply = (analytics: boolean) => {
      if (analytics && currentTags) {
        bootstrapGoogleTag(currentTags)
      }
      setAllowed(analytics)
    }

    apply(hasAnalyticsConsent())
    return onConsentChange((consent: CookieConsent) => {
      apply(consent.analytics)
    })
  }, [])

  if (!load) {
    return null
  }

  return (
    <Script src={load.scriptSrc} strategy="afterInteractive" />
  )
}
