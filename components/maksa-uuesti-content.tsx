'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HayRetryPaymentButton } from '@/components/hay-retry-payment-button'
import { HayBankLinkHelp } from '@/components/hay-bank-link-help'
import { SITE_CONTACT } from '@/lib/site-contact'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function MaksaUuestiContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const hasToken = token.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-orange-100 p-4">
                <AlertCircle className="w-16 h-16 text-orange-600" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hasToken ? 'Jätka heinatellimuse maksmist' : 'Link on vigane'}
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              {hasToken
                ? 'Sinu tellimuse andmed on alles. Ühe klõpsuga suuname sind Montonio makselehele — vormi ei pea uuesti täitma.'
                : `See link on vigane või aegunud. Palun alusta tellimust uuesti või kirjuta ${SITE_CONTACT.email}.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hasToken ? (
                <HayRetryPaymentButton token={token} label="Jätka maksmist" />
              ) : null}
              <Button asChild variant={hasToken ? 'outline' : 'default'} size="lg">
                <Link
                  href={hasToken ? '/' : '/telli-hein'}
                  className="flex items-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  {hasToken ? 'Avalehele' : 'Telli hein'}
                </Link>
              </Button>
            </div>
            {!hasToken ? <HayBankLinkHelp /> : null}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
