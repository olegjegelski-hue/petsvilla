import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { ExoticParrotGallery } from '@/components/exotic-parrot-gallery'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Eksklusiivsed eksootilised papagoid - PetsVilla',
  description: 'Ettetellimisel Hollandist. Lai valik eksootilisi papagoiliike.',
  alternates: {
    canonical: 'https://petsvilla.ee/papagoid/eksootilised',
  },
}

export default function EksootilisedPapagoidPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <ExoticParrotGallery />
      </div>
      <Footer />
    </>
  )
}
