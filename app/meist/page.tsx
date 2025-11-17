

import { Navigation } from '@/components/navigation'
import { About } from '@/components/about'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Meist - Professionaalne Lemmikloomade Aretaja',
  description: 'Tutvuge PetsVillaga - tõumerisigade ja näituse kvaliteediga viirpapagoidega aretaja Eestis. Meie lugu, statistika, aretuse vanemad ja filosoofia. Üle 15 aasta kogemus.',
  keywords: ['PetsVilla', 'meist', 'aretaja', 'lemmikloomade aretaja', 'guinea pig breeder', 'budgie breeder', 'Eesti', 'tõuloomad'],
  alternates: {
    canonical: 'https://petsvilla.ee/meist',
  },
  openGraph: {
    title: 'Meist - PetsVilla OÜ',
    description: 'Professionaalne tõumerisiigade ja viirpapagoidega aretaja. Meie lugu ja filosoofia.',
    url: 'https://petsvilla.ee/meist',
    images: ['/og-image.png'],
  },
}

export default function MeistPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'PetsVilla OÜ',
      description: 'Professionaalne tõumerisiigade ja näituse kvaliteediga viirpapagoidega aretaja Eestis.',
      url: 'https://petsvilla.ee',
      telephone: '+372 512 7938',
      email: 'info@petsvilla.ee',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'EE',
      },
      foundingDate: '2010',
      numberOfEmployees: '5',
      knowsAbout: ['Merisiigade aretamine', 'Viirpapagoide aretamine', 'Lemmikloomade hooldus'],
    },
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
        name: 'Meist',
        item: 'https://petsvilla.ee/meist',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
        <Navigation />
        <About />
        <Footer />
      </div>
    </>
  )
}
