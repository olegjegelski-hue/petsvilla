'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { FacebookGroupsInvite } from '@/components/facebook-groups-invite'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Home, Loader2, Mail, Package } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackPurchase } from '@/lib/meta'
import { trackGa4Purchase } from '@/lib/ga4'
import {
  isPurchaseAlreadyTracked,
  markPurchaseTracked,
  shouldTrackPaidHayPurchase,
  trackGoogleAdsPurchase,
} from '@/lib/google-ads'

type PaymentView = 'loading' | 'paid' | 'pending' | 'failed' | 'unknown'

function TellimusKinnitatudContent() {
  const searchParams = useSearchParams()
  const [orderReference, setOrderReference] = useState<string>('')
  const [view, setView] = useState<PaymentView>('loading')

  useEffect(() => {
    const referenceParam = searchParams.get('reference')
    const orderToken = searchParams.get('order-token')
    const legacySuccess = searchParams.get('payment') === 'success'

    if (referenceParam) {
      setOrderReference(referenceParam)
    }

    if (orderToken) {
      verifyPayment(orderToken)
      return
    }

    if (legacySuccess) {
      setView('paid')
      return
    }

    setView('unknown')
  }, [searchParams])

  const verifyPayment = async (orderToken: string) => {
    try {
      const response = await fetch('/api/montonio/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setView('unknown')
        return
      }

      if (data.paid) {
        setView('paid')
        if (data.merchantReference) {
          setOrderReference(data.merchantReference)
        }

        if (shouldTrackPaidHayPurchase(data)) {
          const alreadyTracked = isPurchaseAlreadyTracked(data.purchase.orderId)

          if (!alreadyTracked) {
            await trackPurchase({
              orderId: data.purchase.orderId,
              value: data.purchase.value,
              currency: data.purchase.currency,
              email: data.purchase.email,
              phone: data.purchase.phone,
              numItems: data.purchase.numItems,
            })
            trackGoogleAdsPurchase({
              orderId: data.purchase.orderId,
              value: data.purchase.value,
              currency: data.purchase.currency,
            })
            trackGa4Purchase({
              orderId: data.purchase.orderId,
              value: data.purchase.value,
              currency: data.purchase.currency,
              quantity: data.purchase.numItems ?? 1,
            })
            markPurchaseTracked(data.purchase.orderId)
          }
        }
        return
      }

      const status = String(data.paymentStatus || '').toUpperCase()
      setView(status === 'PENDING' || status === 'AUTHORIZED' ? 'pending' : 'failed')
    } catch (error) {
      console.error('Error verifying payment:', error)
      setView('unknown')
    }
  }

  const isPaid = view === 'paid'

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            {view === 'loading' && (
              <>
                <div className="flex justify-center mb-6">
                  <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Kontrollin makset…
                </h1>
                <p className="text-lg text-gray-700">
                  Palun oota, kinnitame Montonio makse staatust.
                </p>
              </>
            )}

            {isPaid && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="w-16 h-16 text-green-600" />
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Makse õnnestus!
                </h1>

                <p className="text-lg text-gray-700 mb-4">
                  Tellimus on saadetud ka teie mailile.
                </p>
              </>
            )}

            {view === 'pending' && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-amber-100 p-4">
                    <AlertCircle className="w-16 h-16 text-amber-600" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Makse on pooleli
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  Pank ei ole makset veel kinnitanud. Ära esita tellimust uuesti —
                  kui raha läheb maha, jõuab kinnitus meile automaatselt.
                </p>
              </>
            )}

            {(view === 'failed' || view === 'unknown') && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-orange-100 p-4">
                    <AlertCircle className="w-16 h-16 text-orange-600" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Makse ei õnnestunud
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  Pangas tekkis viga või makse katkestati. Raha ei ole võetud.
                  Palun proovi uuesti.
                </p>
              </>
            )}

            {orderReference && view !== 'loading' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 inline-block">
                <p className="text-sm text-gray-600">Tellimuse number:</p>
                <p className="text-lg font-mono font-semibold text-green-700">
                  {orderReference}
                </p>
              </div>
            )}

            {isPaid && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                  <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Tarne informatsioon
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>
                        Hein saadetakse välja <strong>1-3 päeva jooksul</strong>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>
                        Kui hein on SmartPost kapis, <strong>tuleb teile SMS</strong>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Saate ka e-kirja, kui pakk on pakiautomaati jõudnud</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 text-left">
                  <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-orange-600" />
                    Tellimuse kinnitus
                  </h2>
                  <p className="text-gray-700">
                    Tellimuse kinnitus on saadetud teie emailile. <br />
                    Palun kontrollige oma postkasti (ka rämpsposti kausta).
                  </p>
                </div>

                <FacebookGroupsInvite />
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Küsimused?</h3>
              <p className="text-gray-700 text-sm mb-2">
                Kui teil on küsimusi, võtke julgesti ühendust:
              </p>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">
                  Email:{' '}
                  <a
                    href="mailto:service@petsvilla.ee"
                    className="text-orange-600 hover:underline"
                  >
                    service@petsvilla.ee
                  </a>
                </p>
                <p className="text-gray-600">
                  Telefon:{' '}
                  <a href="tel:+3725127938" className="text-orange-600 hover:underline">
                    +372 512 7938
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Avalehele
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link
                  href={isPaid ? '/hein' : '/telli-hein'}
                  className="flex items-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  {isPaid ? 'Tagasi heina lehele' : 'Proovi uuesti tellida'}
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

export default function TellimusKinnitatudPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50" />
      }
    >
      <TellimusKinnitatudContent />
    </Suspense>
  )
}
