'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  hasAnalyticsConsent,
  onConsentChange,
  type CookieConsent,
} from '@/lib/cookie-consent'

const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  process.env.META_PIXEL_ID ||
  '847652724033387'

function revokePixelConsent() {
  try {
    window.fbq?.('consent', 'revoke')
  } catch {
    // ignore
  }
}

export function MetaPixel() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(hasAnalyticsConsent())

    return onConsentChange((consent: CookieConsent) => {
      if (consent.analytics) {
        setAllowed(true)
        // Kui skript juba laetud (nt pärast tagasivõttu + uuest nõusolekut)
        if (window.fbq) {
          try {
            window.fbq('consent', 'grant')
            window.fbq('track', 'PageView')
          } catch {
            // ignore
          }
        }
      } else {
        revokePixelConsent()
        setAllowed(false)
      }
    })
  }, [])

  if (!allowed || !META_PIXEL_ID) {
    return null
  }

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'grant');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
      }}
    />
  )
}
