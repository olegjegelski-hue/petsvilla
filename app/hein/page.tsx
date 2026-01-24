
import { Navigation } from '@/components/navigation'
import { HayProduct } from '@/components/hay-product'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Kvaliteetne hein — PetsVilla | Looduslikult kuivatatud',
  description: 'Meie hein kasvab saastest eemal ja kuivatatakse päikese ning tuulega. 80L kott (~4kg), SmartPOST tarne.',
  keywords: ['hein', 'kvaliteetne hein', 'looduslik hein', 'hein merisiigadele', 'hein küülikutele', 'guinea pig hay', 'rabbit hay', 'hay Estonia', '80L kott'],
  alternates: {
    canonical: 'https://petsvilla.ee/hein',
  },
  openGraph: {
    title: 'Kvaliteetne Looduslik Hein - PetsVilla OÜ',
    description: 'Looduslikult kuivatatud kvaliteetne hein merisiigadele ja küülikutele. 80L kott.',
    url: 'https://m.media-amazon.com/images/I/81eHAG1WxWL._AC_UF1000,1000_QL80_.jpg',
    images: ['/hay-product.jpg'],
  },
}

export default function HeinPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Kvaliteetne Looduslik Hein',
    description: 'Meie hein on kasvanud puhtas keskkonnas, eemal teedest ja saasteallikatest. Kuivatame heina looduslikult päikese ja tuule abil. 80L kott umbes 4kg kaaluga.',
    brand: {
      '@type': 'Brand',
      name: 'PetsVilla OÜ',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: '8.00',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'PetsVilla OÜ',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          currency: 'EUR',
          value: '1.00',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'EE',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    image: 'https://m.media-amazon.com/images/I/811m7EVaW0L.jpg',
    url: 'https://petsvilla.ee/hein',
    category: 'Pet Supplies',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '15',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Maht',
        value: '80L',
      },
      {
        '@type': 'PropertyValue',
        name: 'Kaal',
        value: '~4kg',
      },
      {
        '@type': 'PropertyValue',
        name: 'Kuivatusmeetod',
        value: 'Looduslik (päike ja tuul)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Päritolu',
        value: 'Puhas keskkond',
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
        name: 'Kvaliteetne Hein',
        item: 'https://petsvilla.ee/hein',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-hay"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-hay"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">
        <Navigation />
        <HayProduct />
        <Footer />
      </div>
    </>
  )
}
