const FALLBACK_SITE_URL = 'https://petsvilla.ee'

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || ''
  const normalized = envUrl.trim().replace(/\/+$/, '')

  // Safety fix: never emit vercel.app URLs for production SEO surfaces.
  if (!normalized || normalized.includes('vercel.app')) {
    return FALLBACK_SITE_URL
  }

  return normalized
}
