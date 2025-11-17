
import { Navigation } from '@/components/navigation'
import { GuineaPigGallery } from '@/components/guinea-pig-gallery'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Meriseabeebid — PetsVilla | Tervislikud ja sotsiaalsed',
  description: 'Lühikarvaliste tõumerisigade aretus PetsVillast. Terved, sotsiaalsed ja hooldatud merisead — nõu ja tugi uutele omanikele.',
  keywords: ['meriseabeebid', 'tõumerisiigad', 'guinea pigs', 'pedigree', 'guinea pig breeder', 'merisiigade aretaja', 'Eesti', 'lühikarvalised'],
  alternates: {
    canonical: 'https://petsvilla.ee/meriseabeebid',
  },
  openGraph: {
    title: 'Tõumeriseabeebid - PetsVilla OÜ',
    description: 'Professionaalne tõumerisiigade aretamine. Dokumenteeritud päritoluga (pedigree) beebid.',
    url: 'https://petsvilla.ee/meriseabeebid',
    images: ['/og-image.png'],
  },
}

export default function MeriseabeebidPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Tõumeriseabeebid',
    description: 'Professionaalne tõumerisiigade aretamine. Aretuse vanemad on hoolikalt valitud, et tagada tervete, rõõmsate ja ilusate beebide sünd. Dokumenteeritud päritoluga (pedigree).',
    brand: {
      '@type': 'Brand',
      name: 'PetsVilla OÜ',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '25',
      highPrice: '50',
      offerCount: '10',
      availability: 'https://schema.org/InStock',
    },
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Small_Guinea_Pig.jpg',
    url: 'https://petsvilla.ee/meriseabeebid',
    category: 'Pet',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Vanus',
        value: '5-8 nädalat',
      },
      {
        '@type': 'PropertyValue',
        name: 'Päritolu',
        value: 'Dokumenteeritud pedigree',
      },
      {
        '@type': 'PropertyValue',
        name: 'Tõug',
        value: 'Lühikarvalised tõumerisiigad',
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
        name: 'Meriseabeebid',
        item: 'https://petsvilla.ee/meriseabeebid',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-guinea-pigs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-guinea-pigs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50">
        <Navigation />
        <GuineaPigGallery />
        <Footer />
      </div>
    </>
  )
}
