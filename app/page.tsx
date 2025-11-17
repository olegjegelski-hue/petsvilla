
import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/hero'
import { ProductShowcase } from '@/components/product-showcase'
import { Footer } from '@/components/footer'
import Script from 'next/script'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PetStore',
    name: 'PetsVilla OÜ',
    description: 'Professionaalne merisiigade ja viirpapagoidega aretaja. Müüme kvaliteetset heina merisiigadele ja küülikutele.',
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
    priceRange: '€€',
    image: 'https://petsvilla.ee/og-image.png',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://petsvilla.ee',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Lemmikloomad ja Tarvikud',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Meriseabeebid',
          description: 'Tõumerisigade professionaalne aretamine. Meie beebid on dokumenteeritud päritoluga (pedigree).',
          url: 'https://petsvilla.ee/meriseabeebid',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Viirpapagoid',
          description: 'Näituse kvaliteediga viirpapagoide aretaja. Meie beebid on väga ilusa sulestiku ja uhke päritoluga.',
          url: 'https://petsvilla.ee/viirpapagoid',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Kvaliteetne hein',
            description: 'Meie hein on kasvanud puhtas keskkonnas, eemal teedest ja saasteallikatest. Kuivatame heina looduslikult - päikese ja tuule abil.',
            url: 'https://petsvilla.ee/hein',
          },
        },
      ],
    },
  }

  return (
    <>
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
        <Navigation />
        <Hero />
        <ProductShowcase />
        <Footer />
      </div>
    </>
  )
}
