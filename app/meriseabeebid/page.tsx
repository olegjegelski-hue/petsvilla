import { Navigation } from '@/components/navigation'
import { GuineaPigGallery } from '@/components/guinea-pig-gallery'
import { FaqSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'
import { getGuineaPigs } from '@/lib/guinea-pigs'
import { buildFaqPageSchema, meriseabeebidFaq } from '@/lib/faq'

/** ISR — peab olema literaal (Next.js ei luba importitud konstanti). */
export const revalidate = 120

export const metadata: Metadata = {
  title: {
    absolute: 'Meriseabeebid müügil | Merisead dokumenteeritud päritoluga | PetsVilla',
  },
  description:
    'Meriseabeebid müügiks (5–8 nädalat) — lühikarvased tõumerisead dokumenteeritud päritoluga (pedigree). Tervisekontroll, sotsialiseeritud, parasiiditõrje. Soinaste, Tartumaa. Tel: +372 512 7938.',
  keywords: [
    'meriseabeebid',
    'meriseabeebi ost',
    'merisead',
    'merisead müük',
    'tõumerisead',
    'merisead Eestis',
    'lühikarvased merisead',
    'rosette merisead',
    'pedigree merisead',
    'dokumenteeritud päritolu',
    'merisiigade aretaja',
    'guinea pig breeder Estonia',
    'pedigree guinea pigs',
    'guinea pigs for sale',
    'merisea kasvatus',
    'tõuloomad',
    'lemmikloomad Tartus',
    'PetsVilla merisead',
  ],
  alternates: {
    canonical: 'https://petsvilla.ee/meriseabeebid',
  },
  openGraph: {
    title: 'Meriseabeebid müügil | Merisead | PetsVilla',
    description:
      'Müüme ainult meriseabeebisid (5–8 nädalat). Dokumenteeritud päritolu, tervisekontroll, sotsialiseeritud. Soinaste, Tartumaa.',
    url: 'https://petsvilla.ee/meriseabeebid',
    type: 'website',
    images: [
      {
        url: '/parent-babies.jpg',
        width: 1200,
        height: 630,
        alt: 'PetsVilla tõumeriseabeebid koos vanemaga',
      },
    ],
    locale: 'et_EE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meriseabeebid müügil | Merisead | PetsVilla',
    description:
      'Müüme ainult meriseabeebisid. Dokumenteeritud päritolu, tervisekontroll, professionaalne nõustamine.',
    images: ['/parent-babies.jpg'],
  },
}

export default async function MeriseabeebidPage() {
  const guineaPigs = await getGuineaPigs()
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Meriseabeebid',
    alternateName: ['Tõumeriseabeebid', 'Merisead (beebid)', 'Guinea Pig Babies', 'Pedigree Guinea Pigs'],
    description:
      'Müügiks ainult meriseabeebid (vanus 5–8 nädalat). Lühikarvased tõumerisead dokumenteeritud päritoluga (pedigree). Iga beebi on sotsialiseeritud, tervisekontrolliga ja parasiiditõrjega. Täiskasvanud merisead ei ole müügiks.',
    brand: {
      '@type': 'Brand',
      name: 'PetsVilla OÜ',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'PetsVilla OÜ',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tartu mnt 80',
        addressLocality: 'Soinaste',
        addressRegion: 'Tartumaa',
        postalCode: '61709',
        addressCountry: 'EE',
      },
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: '25.00',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'PetsVilla OÜ',
      },
      priceValidUntil: '2026-12-31',
      url: 'https://petsvilla.ee/meriseabeebid',
    },
    image: [
      'https://petsvilla.ee/parent-babies.jpg',
      'https://petsvilla.ee/parent-brown.jpg',
      'https://petsvilla.ee/parent-silver.jpg',
    ],
    url: 'https://petsvilla.ee/meriseabeebid',
    category: 'Pets > Guinea Pigs',
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Pet Owners',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Vanus müümisel',
        value: '5-8 nädalat (ainult beebid)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Päritolu',
        value: 'Dokumenteeritud pedigree',
      },
      {
        '@type': 'PropertyValue',
        name: 'Tõug',
        value: 'Lühikarvalised tõumerisead',
      },
      {
        '@type': 'PropertyValue',
        name: 'Tervisekontroll',
        value: 'Jah, enne uude koju minekut',
      },
      {
        '@type': 'PropertyValue',
        name: 'Sotsialiseeritud',
        value: 'Jah, harjunud inimestega',
      },
      {
        '@type': 'PropertyValue',
        name: 'Aretuskogemus',
        value: 'Üle 4 aasta',
      },
    ],
  }

  const faqSchema = buildFaqPageSchema(meriseabeebidFaq)

  const breadcrumbSchema = {
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
        name: 'Meriseabeebid',
        item: 'https://petsvilla.ee/meriseabeebid',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <GuineaPigGallery initialGuineaPigs={guineaPigs} />
        <FaqSection
          title="Meriseabeebid — korduma kippuvad küsimused"
          items={meriseabeebidFaq}
        />
        <Footer />
      </div>
    </>
  )
}
