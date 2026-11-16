
'use client'

import Script from 'next/script'
import { isValidGoogleAdsId, resolveGoogleTagIds } from '@/lib/google-ads'

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const adsIdEnv = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const tags = resolveGoogleTagIds(measurementId, adsIdEnv)

  if (!tags) {
    return null
  }

  const { scriptId, gaId, adsId } = tags
  const adsConfig =
    adsId && isValidGoogleAdsId(adsId) ? `gtag('config', '${adsId}');` : ''

  return (
    <>
      {/* Google Consent Mode v2 - Set defaults BEFORE gtag loads */}
      <Script
        id="google-consent-mode"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent to 'denied' (GDPR compliant)
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${scriptId}`}
      />
      
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            gtag('js', new Date());
            ${
              gaId
                ? `gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });`
                : ''
            }
            ${adsConfig}
          `,
        }}
      />
    </>
  )
}
