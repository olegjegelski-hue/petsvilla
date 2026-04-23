
import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/hero'
import { ProductShowcase } from '@/components/product-showcase'
import { Footer } from '@/components/footer'
import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'PetsVilla - Tõumerisead, Papagoid ja Kvaliteetne Hein',
  },
  description:
    'PetsVilla on usaldusväärne lemmikloomade aretaja Tartumaal. Pakume dokumenteeritud päritoluga merisigu, papagoisid ja naturaalset heina. Tule Papagoi Keskusesse!',
  alternates: {
    canonical: 'https://petsvilla.ee',
  },
  openGraph: {
    title: 'PetsVilla - Tõumerisead, Papagoid ja Kvaliteetne Hein',
    description:
      'PetsVilla on usaldusväärne lemmikloomade aretaja Tartumaal. Pakume dokumenteeritud päritoluga merisigu, papagoisid ja naturaalset heina. Tule Papagoi Keskusesse!',
    url: 'https://petsvilla.ee',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetsVilla - Tõumerisead, Papagoid ja Kvaliteetne Hein',
    description:
      'PetsVilla on usaldusväärne lemmikloomade aretaja Tartumaal. Pakume dokumenteeritud päritoluga merisigu, papagoisid ja naturaalset heina. Tule Papagoi Keskusesse!',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'PetStore',
    name: 'PetsVilla',
    image: 'https://petsvilla.ee/logo.png',
    '@id': 'https://petsvilla.ee',
    url: 'https://petsvilla.ee',
    telephone: '+372 512 7938',
    email: 'service@petsvilla.ee',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tartu mnt 80, Soinaste',
      addressLocality: 'Kambja vald',
      addressRegion: 'Tartumaa',
      postalCode: '61709',
      addressCountry: 'EE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 58.351,
      longitude: 26.699,
    },
    description:
      'Professionaalne lemmikloomade aretaja Tartumaal. Pakume lühikarvalisi tõumerisigu, papagoisid ja kvaliteetset heina.',
  }

  // Breadcrumb Schema for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Avaleht',
        item: 'https://petsvilla.ee'
      }
    ]
  }

  return (
    <>
      <Script
        id="json-ld-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        <ProductShowcase />
        <Footer />
      </div>
    </>
  )
}
