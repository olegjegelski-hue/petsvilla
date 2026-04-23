import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PetsVilla OÜ',
    short_name: 'PetsVilla',
    description: 'Merisead, viirpapagoid ja kvaliteetne hein.',
    start_url: '/',
    display: 'standalone',
    background_color: '#EAE0D5',
    theme_color: '#1F6A4C',
    lang: 'et-EE',
    icons: [
      {
        src: '/petsvilla-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/petsvilla-favicon-pv.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
