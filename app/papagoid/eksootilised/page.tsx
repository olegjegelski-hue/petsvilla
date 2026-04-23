import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { ExoticParrotGallery } from '@/components/exotic-parrot-gallery'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    absolute: 'Eksootilised papagoid - Ara, Jako - Legaalne import | PetsVilla',
  },
  description:
    'Eksklusiivsed suured papagoid ettetellimisel Hollandi tunnustatud aretajatelt. 100% legaalsed linnud, CITES dokumendid, ametlik leping ja veterinaarkontroll.',
  alternates: {
    canonical: 'https://petsvilla.ee/papagoid/eksootilised',
  },
  openGraph: {
    title: 'Eksootilised papagoid - Ara, Jako - Legaalne import | PetsVilla',
    description:
      'Eksklusiivsed suured papagoid ettetellimisel Hollandi tunnustatud aretajatelt. 100% legaalsed linnud, CITES dokumendid, ametlik leping ja veterinaarkontroll.',
    url: 'https://petsvilla.ee/papagoid/eksootilised',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eksootilised papagoid - Ara, Jako - Legaalne import | PetsVilla',
    description:
      'Eksklusiivsed suured papagoid ettetellimisel Hollandi tunnustatud aretajatelt. 100% legaalsed linnud, CITES dokumendid, ametlik leping ja veterinaarkontroll.',
    images: ['/og-image.png'],
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
