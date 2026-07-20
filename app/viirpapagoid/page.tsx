
import { Navigation } from '@/components/navigation'
import { BudgieGallery } from '@/components/budgie-gallery'
import { TestimonialsSection } from '@/components/testimonials-section'
import { FaqSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'
import { getBudgies } from '@/lib/budgies'
import { buildFaqPageSchema, viirpapagoidFaq } from '@/lib/faq'

/** ISR — peab olema literaal (Next.js ei luba importitud konstanti). */
export const revalidate = 120

export const metadata: Metadata = {
  title: {
    absolute: 'Sotsiaalsed viirpapagoid otse aretajalt | PetsVilla',
  },
  description:
    'Kirjud, terved ja inimestega harjunud viirpapagoid PetsVilla aretusest. Valikus ka kogukamad Inglise viirpapagoid. Eluaegne tugi ja nõustamine. Soinaste, Tartumaa.',
  keywords: ['viirpapagoid', 'budgies', 'budgie breeder', 'näituse kvaliteet', 'show quality budgies', 'viirpapagoide aretaja', 'Eesti', 'linnud', 'lemmiklinnud'],
  alternates: {
    canonical: 'https://petsvilla.ee/viirpapagoid',
  },
  openGraph: {
    title: 'Sotsiaalsed viirpapagoid otse aretajalt | PetsVilla',
    description:
      'Kirjud, terved ja inimestega harjunud viirpapagoid PetsVilla aretusest. Valikus ka kogukamad Inglise viirpapagoid.',
    url: 'https://petsvilla.ee/viirpapagoid',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sotsiaalsed viirpapagoid otse aretajalt | PetsVilla',
    description:
      'Kirjud, terved ja inimestega harjunud viirpapagoid PetsVilla aretusest.',
    images: ['/og-image.png'],
  },
}

export default async function ViirpapagoidPage() {
  const budgies = await getBudgies()
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
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: '30.00',
      availability: 'https://schema.org/InStock',
      url: 'https://petsvilla.ee/viirpapagoid',
    },
    image: 'https://petsvilla.ee/viirpapagoid-schema.png',
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

  const faqSchema = buildFaqPageSchema(viirpapagoidFaq)

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
      <Script
        id="json-ld-faq-viirpapagoid"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <BudgieGallery initialBudgies={budgies} />
        <TestimonialsSection
          title="Mida meie kliendid ütlevad"
          toneClassName="from-[#EAE0D5] via-[#EAE0D5] to-[#EAE0D5] border-[#D7CBBE]"
          cardClassName="bg-[#E3D8CB]/90"
          nameClassName="text-green-900"
          items={[
            {
              name: 'Laura',
              text: 'Lind oli rahulik ja inimese kohalolekuga harjunud. Väga meeldiv kogemus.',
            },
            {
              name: 'Rasmus',
              text: 'Sulestik on imeilus ja saime head hooldusjuhised kaasa.',
            },
            {
              name: 'Anu',
              text: 'Kokkulepped olid lihtsad ning suhtlus kiire ja sõbralik.',
            },
          ]}
        />
        <FaqSection
          title="Viirpapagoid — korduma kippuvad küsimused"
          items={viirpapagoidFaq}
        />
        <Footer />
      </div>
    </>
  )
}
