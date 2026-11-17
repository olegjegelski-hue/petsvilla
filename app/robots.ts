
import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/tellimus-kinnitatud/',
          '/sonum-saadetud/',
          '/meeldetuletus-valja/',
          '/maksa-uuesti/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/tellimus-kinnitatud/',
          '/sonum-saadetud/',
          '/meeldetuletus-valja/',
          '/maksa-uuesti/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/tellimus-kinnitatud/',
          '/sonum-saadetud/',
          '/meeldetuletus-valja/',
          '/maksa-uuesti/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
