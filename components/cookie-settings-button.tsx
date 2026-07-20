'use client'

import { openCookieSettings } from '@/lib/cookie-consent'

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => openCookieSettings()}
      className="text-[#4F5A52] hover:text-green-800 transition-colors text-left"
    >
      Küpsiste seaded
    </button>
  )
}
