
import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/hero'
import { ProductShowcase } from '@/components/product-showcase'
import { Footer } from '@/components/footer'
import Script from 'next/script'

export default function Home() {
  // LocalBusiness + PetStore Schema for better SEO and AI understanding
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'PetStore'],
    '@id': 'https://petsvilla.ee/#organization',
    name: 'PetsVilla OÜ',
    alternateName: 'PetsVilla',
    legalName: 'PetsVilla OÜ',
    description: 'Professionaalne lemmikloomade aretaja Soinastes, Tartumaal. Spetsialiseerunud tõumerisiigade (guinea pigs) ja näituse kvaliteediga viirpapagoidide (budgerigars) aretamisele. Pakume ka kvaliteetset looduslikult kuivatatud heina.',
    url: 'https://petsvilla.ee',
    telephone: '+372 512 7938',
    email: 'service@petsvilla.ee',
    foundingDate: '2020',
    priceRange: '€€',
    image: [
      'https://petsvilla.ee/og-image.png',
      'https://petsvilla.ee/parent-babies.jpg',
      'https://petsvilla.ee/budgies-aviary.jpg'
    ],
    logo: {
      '@type': 'ImageObject',
      url: 'https://petsvilla.ee/og-image.png',
      width: 1200,
      height: 630
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tartu mnt 80',
      addressLocality: 'Soinaste',
      addressRegion: 'Tartumaa',
      postalCode: '61709',
      addressCountry: 'EE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 58.2777,
      longitude: 26.5419
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '16:00'
      }
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+372 512 7938',
        contactType: 'customer service',
        email: 'service@petsvilla.ee',
        availableLanguage: ['et', 'en', 'ru'],
        areaServed: 'EE'
      },
      {
        '@type': 'ContactPoint',
        telephone: '+372 512 7938',
        contactType: 'sales',
        email: 'info@petsvilla.ee',
        availableLanguage: ['et', 'en', 'ru'],
        areaServed: 'EE'
      }
    ],
    sameAs: [
      'https://petsvilla.ee'
    ],
    areaServed: [
      {
        '@type': 'Country',
        name: 'Estonia'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Tartumaa'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Lemmikloomad ja Tarvikud',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Meriseabeebid',
            alternateName: 'Tõumerisead',
            description: 'Lühikarvased tõumerisead dokumenteeritud päritoluga (pedigree). Professionaalne aretamine, tervisekontroll ja nõustamine. Üle 50 tõumeriseaga erinevate värvide ja karvastruktuuriga.',
            url: 'https://petsvilla.ee/meriseabeebid',
            category: 'Lemmikloomad',
            brand: {
              '@type': 'Brand',
              name: 'PetsVilla'
            }
          },
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'PetsVilla OÜ'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Viirpapagoid',
            alternateName: 'Budgerigars',
            description: 'Näituse kvaliteediga viirpapagoid vastavad standarditele. Üle 20 paari, hoolikalt valitud tervislike omaduste, värvi ja suuruse järgi. Sotsialiseeritud ja terved linnud.',
            url: 'https://petsvilla.ee/viirpapagoid',
            category: 'Lemmikloomad',
            brand: {
              '@type': 'Brand',
              name: 'PetsVilla'
            }
          },
          availability: 'https://schema.org/PreOrder',
          seller: {
            '@type': 'Organization',
            name: 'PetsVilla OÜ'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Kvaliteetne hein',
            description: 'Looduslikult kuivatatud hein merisiigadele ja küülikutele. Kasvanud puhtas keskkonnas, kuivatatud päikese ja tuule abil. Ei sisalda kunstväljaeid ega lisandeid.',
            url: 'https://petsvilla.ee/hein',
            category: 'Lemmikloomade toit',
            brand: {
              '@type': 'Brand',
              name: 'PetsVilla'
            }
          },
          price: '0.50',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'PetsVilla OÜ'
          }
        }
      ]
    },
    knowsAbout: [
      'Guinea Pig Breeding',
      'Budgerigar Breeding', 
      'Pedigree Documentation',
      'Show Quality Animals',
      'Pet Care',
      'Animal Nutrition',
      'Natural Hay Production'
    ],
    slogan: 'Hoitud lemmikud teie perele'
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50">
        <Navigation />
        <Hero />
        <ProductShowcase />
        <Footer />
      </div>
    </>
  )
}
