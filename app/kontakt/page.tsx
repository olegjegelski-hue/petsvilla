
import { Navigation } from '@/components/navigation'
import { ContactForm } from '@/components/contact-form'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Kontakt — PetsVilla OÜ | Soinaste, Tartu mnt 80',
  description: 'Võta ühendust PetsVillaga: Tartu mnt 80, Soinaste. Telefon +372 512 7938. Kirjuta: service@petsvilla.ee',
  keywords: ['kontakt', 'ühendust', 'PetsVilla kontakt', 'lemmikloomad', 'küsimused'],
  alternates: {
    canonical: 'https://petsvilla.ee/kontakt',
  },
  openGraph: {
    title: 'Kontakt - PetsVilla OÜ',
    description: 'Võtke meiega ühendust. Oleme siin, et aidata!',
    url: 'https://petsvilla.ee/kontakt',
    images: ['/og-image.png'],
  },
}

export default function KontaktPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'PetsVilla OÜ',
      url: 'https://petsvilla.ee',
      telephone: '+3725127938',
      email: 'service@petsvilla.ee',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tartu mnt 80',
        addressLocality: 'Soinaste',
        addressRegion: 'Tartumaa',
        postalCode: '61709',
        addressCountry: 'EE',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+3725127938',
        contactType: 'customer service',
        email: 'info@petsvilla.ee',
        availableLanguage: ['Estonian', 'English'],
        areaServed: 'EE',
      },
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
        name: 'Kontakt',
        item: 'https://petsvilla.ee/kontakt',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
        <Navigation />
        <ContactForm />
        <Footer />
      </div>
    </>
  )
}
