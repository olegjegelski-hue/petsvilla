import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MaksaUuestiContent } from '@/components/maksa-uuesti-content'

export const metadata: Metadata = {
  title: 'Jätka maksmist | PetsVilla',
  description: 'Jätka pooleli jäänud heinatellimuse maksmist.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function MaksaUuestiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50" />
      }
    >
      <MaksaUuestiContent />
    </Suspense>
  )
}
