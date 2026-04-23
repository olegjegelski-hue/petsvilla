import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { ExoticParrotGallery } from '@/components/exotic-parrot-gallery'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Eksklusiivsed papagoid - PetsVilla',
  description: 'Ettetellimisel Hollandist. Lai valik eksootilisi papagoiliike.',
  alternates: {
    canonical: 'https://petsvilla.ee/papagoid/eksootilised',
  },
}

export default function EksootilisedPapagoidPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <ExoticParrotGallery />
      </div>
      <Footer />
    </>
  )
}
