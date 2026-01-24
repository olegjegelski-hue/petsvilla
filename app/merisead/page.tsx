
import { Navigation } from '@/components/navigation'
import { GuineaPigGallery } from '@/components/guinea-pig-gallery'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Merisead Dokumenteeritud Päritoluga | Tõumerisead PetsVilla',
  description: 'Lühikarvased tõumerisead dokumenteeritud päritoluga (pedigree). Üle 50 tõumeriseaga erinevate värvide ja karvastruktuuriga. Tervisekontroll, sotsialiseeritud, parasiiditõrge. Professionaalne nõustamine. Soinaste, Tartumaa. Tel: +372 512 7938.',
  keywords: [
    'merisead',
    'merisea ost',
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
    'PetsVilla merisead'
  ],
  alternates: {
    canonical: 'https://petsvilla.ee/merisead',
  },
  openGraph: {
    title: 'Tõumerisead Dokumenteeritud Päritoluga | PetsVilla OÜ',
    description: 'Professionaalne tõumerisigade aretaja Soinastes. Üle 50 tõumeriseaga erinevate värvide ja karvastruktuuriga. Dokumenteeritud päritolu, tervisekontroll, sotsialiseeritud beebid.',
    url: 'https://petsvilla.ee/merisead',
    type: 'website',
    images: [
      {
        url: '/parent-babies.jpg',
        width: 1200,
        height: 630,
        alt: 'PetsVilla tõumerisead koos vanemaga',
      }
    ],
    locale: 'et_EE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tõumerisead | PetsVilla OÜ',
    description: 'Lühikarvased tõumerisead dokumenteeritud päritoluga. Professionaalne aretamine ja nõustamine.',
    images: ['/parent-babies.jpg'],
  },
}

export default function MeriseadPage() {
  // Enhanced Product Schema with detailed information
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Tõumerisead',
    alternateName: ['Merisead', 'Guinea Pig Babies', 'Pedigree Guinea Pigs'],
    description: 'Lühikarvased tõumerisead dokumenteeritud päritoluga (pedigree). Professionaalne aretamine üle 4 aasta kogemusega. Üle 50 tõumeriseaga erinevate värvide ja karvastruktuuriga. Iga beebi on sotsialiseeritud, tervisekontrolliga ja parasiiditõrjega.',
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
        addressCountry: 'EE'
      }
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '25',
      highPrice: '50',
      offerCount: '10',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'PetsVilla OÜ'
      },
      priceValidUntil: '2026-12-31',
      url: 'https://petsvilla.ee/merisead'
    },
    image: [
      'https://petsvilla.ee/parent-babies.jpg',
      'https://petsvilla.ee/parent-brown.jpg',
      'https://petsvilla.ee/parent-silver.jpg'
    ],
    url: 'https://petsvilla.ee/merisead',
    category: 'Pets > Guinea Pigs',
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Pet Owners'
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Vanus',
        value: '5-8 nädalat'
      },
      {
        '@type': 'PropertyValue',
        name: 'Päritolu',
        value: 'Dokumenteeritud pedigree'
      },
      {
        '@type': 'PropertyValue',
        name: 'Tõug',
        value: 'Lühikarvalised tõumerisead'
      },
      {
        '@type': 'PropertyValue',
        name: 'Tervisekontroll',
        value: 'Jah, enne uude koju minekut'
      },
      {
        '@type': 'PropertyValue',
        name: 'Sotsialiseeritud',
        value: 'Jah, harjunud inimestega'
      },
      {
        '@type': 'PropertyValue',
        name: 'Aretuskogemus',
        value: 'Üle 4 aasta'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '50'
    }
  }

  // FAQ Schema for AI understanding
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Mis on merisea dokumenteeritud päritolu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dokumenteeritud päritolu (pedigree) tähendab, et meie merisead on tõuloomad, kelle vanemate ja vanavanemete informatsioon on täpselt dokumenteeritud. See kinnitab nende tõuomadusi ja tervise tausta.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kui vanad on merisead müümisel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Meie merisead on müümisel vanuses 5-8 nädalat. Selles vanuses on nad juba iseseisvad, söövad ise ja on valmis liikuma uude koju.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kas merisead on tervisekontrolliga?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jah, kõik meie beebid saavad enne uude koju minekut parasiiditõrje ja tervisekontrolli. Me paneme suurt rõhku vanemapopulatsiooni tervisele ja iseloomule.'
        }
      },
      {
        '@type': 'Question',
        name: 'Millised värvid on saadaval?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Meil on üle 50 tõumeriseaga erinevate värvide ja karvastruktuuriga: pruun, hõbedane, must, kreemikas, rosette, valge, must-valge, valge-hall ja tume-pruun.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kas pakute nõustamist?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Jah, pakume professionaalset nõustamist merisiigade hooldamisel, toitmisel ja pidamisel. Meie üle 4 aasta kogemus tagab, et iga beebi leiab armastava kodu, kus teda osatakse õigesti hoida.'
        }
      }
    ]
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Avaleht',
        item: 'https://petsvilla.ee'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Merisead',
        item: 'https://petsvilla.ee/merisead'
      }
    ]
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
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50">
        <Navigation />
        <GuineaPigGallery />
        <Footer />
      </div>
    </>
  )
}
