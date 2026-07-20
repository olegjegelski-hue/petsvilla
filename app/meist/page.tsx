

import { Navigation } from '@/components/navigation'
import { About } from '@/components/about'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    absolute: 'Meist — PetsVilla OÜ | Merisead, Viirpapagoid ja Hein',
  },
  description:
    'PetsVilla OÜ Soinastes: tõumeriseade ja viirpapagoide aretus ning kvaliteetne hein. Üle 4 aasta kogemust, dokumenteeritud päritolu ja eluaegne nõustamine.',
  keywords: ['PetsVilla', 'meist', 'aretaja', 'lemmikloomade aretaja', 'guinea pig breeder', 'budgie breeder', 'Eesti', 'tõuloomad'],
  alternates: {
    canonical: 'https://petsvilla.ee/meist',
  },
  openGraph: {
    title: 'Meist — PetsVilla OÜ | Merisead, Viirpapagoid ja Hein',
    description:
      'PetsVilla OÜ Soinastes: tõumeriseade ja viirpapagoide aretus ning kvaliteetne hein. Üle 4 aasta kogemust ja dokumenteeritud päritolu.',
    url: 'https://petsvilla.ee/meist',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meist — PetsVilla OÜ | Merisead, Viirpapagoid ja Hein',
    description:
      'PetsVilla OÜ Soinastes: tõumeriseade ja viirpapagoide aretus ning kvaliteetne hein.',
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
      description: 'Tõumeriseade ja näitusekvaliteediga viirpapagoide aretaja ning heina müüja Eestis.',
      url: 'https://petsvilla.ee',
      telephone: '+372 512 7938',
      email: 'service@petsvilla.ee',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tartu mnt 80',
        addressLocality: 'Soinaste',
        addressRegion: 'Tartumaa',
        postalCode: '61709',
        addressCountry: 'EE',
      },
      foundingDate: '2010',
      numberOfEmployees: '5',
      knowsAbout: ['Merisiigade aretamine', 'Viirpapagoide aretamine', 'Lemmiklooma hein', 'Lemmikloomade hooldus'],
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <About />
        <Footer />
      </div>
    </>
  )
}
