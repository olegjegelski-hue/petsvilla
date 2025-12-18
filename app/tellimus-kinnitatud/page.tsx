'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Home, Package, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function TellimusKinnitatudPage() {
  const searchParams = useSearchParams()
  const [orderReference, setOrderReference] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing')

  useEffect(() => {
    // Get order reference from sessionStorage or URL params
    const storedRef = sessionStorage.getItem('lastOrderReference')
    const paymentParam = searchParams.get('payment')
    const referenceParam = searchParams.get('reference')
    
    const reference = referenceParam || storedRef || ''
    setOrderReference(reference)

    // Check payment status based on URL parameter
    if (paymentParam === 'success' && reference) {
      setPaymentStatus('success')
      // Clear sessionStorage after successful return
      sessionStorage.removeItem('lastOrderReference')
      sessionStorage.removeItem('lastOrderUuid')
    } else if (paymentParam === 'cancel' || paymentParam === 'failed') {
      setPaymentStatus('failed')
    } else if (storedRef && !paymentParam) {
      // User came back but no payment status yet - show processing
      setPaymentStatus('processing')
    }
  }, [searchParams])

  const isSuccess = paymentStatus === 'success'
  const isProcessing = paymentStatus === 'processing'
  const isFailed = paymentStatus === 'failed'

  return (
    <div className={`min-h-screen ${isSuccess ? 'bg-gradient-to-b from-green-50 to-emerald-50' : isProcessing ? 'bg-gradient-to-b from-blue-50 to-sky-50' : 'bg-gradient-to-b from-red-50 to-rose-50'}`}>
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className={`${isSuccess ? 'border-green-200' : isProcessing ? 'border-blue-200' : 'border-red-200'} shadow-lg`}>
          <CardContent className="pt-12 pb-8 text-center">
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              <div className={`rounded-full ${isSuccess ? 'bg-green-100' : isProcessing ? 'bg-blue-100' : 'bg-red-100'} p-4`}>
                {isSuccess && <CheckCircle2 className="w-16 h-16 text-green-600" />}
                {isProcessing && <Clock className="w-16 h-16 text-blue-600 animate-pulse" />}
                {isFailed && <XCircle className="w-16 h-16 text-red-600" />}
              </div>
            </div>

            {/* Status Message */}
            {isSuccess && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Makse õnnestus!
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  Teie tellimus on edukalt vastu võetud ja makse kinnitatud.
                </p>
                {orderReference && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 inline-block">
                    <p className="text-sm text-gray-600">Tellimuse number:</p>
                    <p className="text-lg font-mono font-semibold text-green-700">{orderReference}</p>
                  </div>
                )}
              </>
            )}

            {isProcessing && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Tellimus edukalt saadetud!
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Teie mailile tuli teade. Vaadake see üle.
                </p>
              </>
            )}

            {isFailed && (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Makse ebaõnnestus
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Kahjuks teie makse ebaõnnestus. Palun proovige uuesti või võtke meiega ühendust.
                </p>
              </>
            )}

            {/* Info Card */}
            {isSuccess && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Mis edasi?
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Saate kohe e-kirja tellimuse kinnituse</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Pakendame teie tellimuse <strong>1 tööpäeva jooksul</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Hein jõuab teie valitud Smartpost pakiautomaati <strong>1-3 tööpäeva</strong> jooksul</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Saate SMS-i ja e-kirja, kui pakk on pakiautomaati jõudnud</span>
                  </li>
                </ul>
              </div>
            )}

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

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Tellimuse number ja täpsem info saadetakse teile peagi e-posti teel
        </p>
      </main>

      <Footer />
    </div>
  )
}
