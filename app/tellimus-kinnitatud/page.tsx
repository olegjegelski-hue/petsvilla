'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Home, Package, Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function TellimusKinnitatudPage() {
  const searchParams = useSearchParams()
  const [orderReference, setOrderReference] = useState<string>('')
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false)

  useEffect(() => {
    // Get order reference from URL params
    const referenceParam = searchParams.get('reference')
    if (referenceParam) {
      setOrderReference(referenceParam)
      
      // Automatically update order status in Notion
      updateOrderStatus(referenceParam)
    }
  }, [searchParams])

  const updateOrderStatus = async (reference: string) => {
    try {
      console.log('=== UPDATING ORDER STATUS ===')
      console.log('Order reference:', reference)
      
      const response = await fetch('/api/montonio/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantReference: reference,
        }),
      })

      console.log('Status update response:', response.status)
      const data = await response.json()
      console.log('Status update data:', data)

      if (response.ok) {
        console.log('✅ Order status updated successfully!')
        setStatusUpdated(true)
      } else {
        console.error('❌ Failed to update order status:', data)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ✅ Makse õnnestus!
            </h1>
            
            <p className="text-lg text-gray-700 mb-4">
              Tellimus on saadetud ka teie mailile.
            </p>

            {orderReference && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 inline-block">
                <p className="text-sm text-gray-600">Tellimuse number:</p>
                <p className="text-lg font-mono font-semibold text-green-700">{orderReference}</p>
              </div>
            )}

            {/* Delivery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Tarne informatsioon
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Hein saadetakse välja <strong>1-3 päeva jooksul</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Kui hein on SmartPost kapis, <strong>tuleb teile SMS</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Saate ka e-kirja, kui pakk on pakiautomaati jõudnud</span>
                </li>
              </ul>
            </div>

            {/* Email Confirmation */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600" />
                Tellimuse kinnitus
              </h2>
              <p className="text-gray-700">
                Tellimuse kinnitus on saadetud teie emailile. <br/>
                Palun kontrollige oma postkasti (ka rämpsposti kausta).
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Küsimused?</h3>
              <p className="text-gray-700 text-sm mb-2">
                Kui teil on küsimusi, võtke julgesti ühendust:
              </p>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">
                  📧 Email: <a href="mailto:service@petsvilla.ee" className="text-orange-600 hover:underline">service@petsvilla.ee</a>
                </p>
                <p className="text-gray-600">
                  📱 Telefon: <a href="tel:+3725127938" className="text-orange-600 hover:underline">+372 512 7938</a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Avalehele
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link href="/hein" className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Tagasi heina lehele
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
