
import { Navigation } from '@/components/navigation'
import { BudgieGallery } from '@/components/budgie-gallery'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Viirpapagoid — PetsVilla | Värvikad ja sõbralikud',
  description: 'Värvikad ja hästi sotsialiseeritud viirpapagoid PetsVillast. Info hindade, saatmise ja hoolduse kohta.',
  keywords: ['viirpapagoid', 'budgies', 'budgie breeder', 'näituse kvaliteet', 'show quality budgies', 'viirpapagoide aretaja', 'Eesti', 'linnud', 'lemmiklinnud'],
  alternates: {
    canonical: 'https://petsvilla.ee/viirpapagoid',
  },
  openGraph: {
    title: 'Näituse Kvaliteediga Viirpapagoid - PetsVilla OÜ',
    description: 'Professionaalne viirpapagoide aretamine. Meie beebid on väga ilusa sulestiku ja uhke päritoluga.',
    url: 'https://petsvilla.ee/viirpapagoid',
    images: ['/og-image.png'],
  },
}

export default function ViirpapagoidPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Näituse Kvaliteediga Viirpapagoid',
    description: 'Kirjud ja elurõõmsad viirpapagoid näituse kvaliteediga. Meie linnud on terved ja hästi sotsiaalsed. Ilusa sulestiku ja uhke päritoluga.',
    brand: {
      '@type': 'Brand',
      name: 'PetsVilla OÜ',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '30',
      highPrice: '60',
      offerCount: '20',
      availability: 'https://schema.org/PreOrder',
    },
    image: 'https://cdn.abacus.ai/images/55d8bcc3-efe9-42e2-8e63-e17f39ee28f9.png',
    url: 'https://petsvilla.ee/viirpapagoid',
    category: 'Pet',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Vanus',
        value: '3-5 kuud',
      },
      {
        '@type': 'PropertyValue',
        name: 'Kvaliteet',
        value: 'Näituse standard',
      },
      {
        '@type': 'PropertyValue',
        name: 'Paari arv',
        value: 'Kuni 20 paari',
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Avaleht',
        item: 'https://petsvilla.ee',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Viirpapagoid',
        item: 'https://petsvilla.ee/viirpapagoid',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-budgies"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-budgies"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <Navigation />
        <BudgieGallery />
        <Footer />
      </div>
    </>
  )
}
