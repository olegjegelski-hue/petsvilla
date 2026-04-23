import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Tellimus kinnitatud | PetsVilla',
  description: 'Teie tellimus on edukalt kinnitatud.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function TellimusKinnitatudLayout({ children }: { children: ReactNode }) {
  return children
}
