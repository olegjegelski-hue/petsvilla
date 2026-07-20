import { Navigation } from '@/components/navigation'
import { HayOrderForm } from '@/components/hay-order-form'
import { FaqSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'
import { buildFaqPageSchema, telliHeinFaq } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Telli Hein - Smartpost Tarne',
  description:
    'Telli kvaliteetset heina Smartpost tarne kaudu. 80L viljakott, ca 4kg, sobib meriseadele ja küülikutele. Kiire ja mugav tarne üle Eesti.',
  alternates: {
    canonical: 'https://petsvilla.ee/telli-hein',
  },
  openGraph: {
    title: 'Telli hein - PetsVilla',
    description: 'Telli kvaliteetset heina Smartpost tarne kaudu üle Eesti.',
    url: 'https://petsvilla.ee/telli-hein',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telli hein - PetsVilla',
    description: 'Telli kvaliteetset heina Smartpost tarne kaudu üle Eesti.',
    images: ['/og-image.png'],
  },
}

export default function TelliHeinPage() {
  const faqSchema = buildFaqPageSchema(telliHeinFaq)

  return (
    <>
      <Script
        id="json-ld-faq-hein"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">
        <Navigation />
        <HayOrderForm />
        <FaqSection
          title="Heinatellimus — korduma kippuvad küsimused"
          description="Hind, SmartPost tarne ja kogused enne tellimist."
          items={telliHeinFaq}
        />
        <Footer />
      </div>
    </>
  )
}
