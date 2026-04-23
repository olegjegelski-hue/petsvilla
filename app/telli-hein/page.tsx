

import { Navigation } from '@/components/navigation'
import { HayOrderForm } from '@/components/hay-order-form'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Telli Hein - Smartpost Tarne',
  description: 'Telli kvaliteetset heina Smartpost tarne kaudu. 80L viljakott, ca 4kg, sobib meriseadele ja küülikutele. Kiire ja mugav tarne üle Eesti.',
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">
      <Navigation />
      <HayOrderForm />
      <Footer />
    </div>
  )
}
