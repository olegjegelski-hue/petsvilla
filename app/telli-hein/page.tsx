

import { Navigation } from '@/components/navigation'
import { HayOrderForm } from '@/components/hay-order-form'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Telli Hein - Smartpost Tarne',
  description: 'Telli kvaliteetset heina Smartpost tarne kaudu. 80L viljakott, ca 4kg, sobib meriseadele ja küülikutele. Kiire ja mugav tarne üle Eesti.',
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
