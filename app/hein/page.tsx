
import { Navigation } from '@/components/navigation'
import { HayProduct } from '@/components/hay-product'
import { TestimonialsSection } from '@/components/testimonials-section'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    absolute: 'Kvaliteetne looduslik hein merisigadele ja küülikutele | PetsVilla',
  },
  description:
    'Puhtas looduses kasvanud, päikese ja tuulega kuivatatud hein lemmikloomadele. 80L kott vaid 9€ koos TASUTA Smartpost tarnega üle Eesti!',
  keywords: ['hein', 'kvaliteetne hein', 'looduslik hein', 'hein merisiigadele', 'hein küülikutele', 'guinea pig hay', 'rabbit hay', 'hay Estonia', '80L kott'],
  alternates: {
    canonical: 'https://petsvilla.ee/hein',
  },
  openGraph: {
    title: 'Kvaliteetne looduslik hein merisigadele ja küülikutele | PetsVilla',
    description:
      'Puhtas looduses kasvanud, päikese ja tuulega kuivatatud hein lemmikloomadele. 80L kott vaid 9€ koos TASUTA Smartpost tarnega üle Eesti!',
    url: 'https://petsvilla.ee/hein',
    images: ['/hay-product.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kvaliteetne looduslik hein merisigadele ja küülikutele | PetsVilla',
    description:
      'Puhtas looduses kasvanud, päikese ja tuulega kuivatatud hein lemmikloomadele. 80L kott vaid 9€ koos TASUTA Smartpost tarnega üle Eesti!',
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
      price: '9.00',
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
          value: '0.00',
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <HayProduct />
        <TestimonialsSection
          title="Mida meie kliendid ütlevad"
          toneClassName="from-[#EAE0D5] via-[#EAE0D5] to-[#EAE0D5] border-[#D7CBBE]"
          cardClassName="bg-[#E3D8CB]/90"
          nameClassName="text-green-900"
          items={[
            {
              name: 'Kristel',
              text: 'Hein oli värske ja lõhnav, tolmuvaba. Lemmikud sõid isuga.',
            },
            {
              name: 'Siim',
              text: 'Tarne oli kiire ja pakk korralik. Väga rahul kvaliteediga.',
            },
            {
              name: 'Helena',
              text: 'Stabiilselt hea kvaliteet — ostan kindlasti uuesti.',
            },
          ]}
        />
        <Footer />
      </div>
    </>
  )
}
