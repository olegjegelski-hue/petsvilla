import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bird } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Papagoid - PetsVilla',
  description: 'Papagoid jagunevad viirpapagoideks ja eksklusiivseteks eksootilisteks papagoideks.',
  alternates: {
    canonical: 'https://petsvilla.ee/papagoid',
  },
}

export default function PapagoidPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Bird className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Papagoid</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vali sobiv suund: meie enda aretatud viirpapagoid või eksklusiivsed
              eksootilised papagoid ettetellimisel Hollandist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-2xl bg-white/90">
              <CardContent className="p-8">
                <div className="relative h-48 md:h-56 mb-6 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/papagoid-viirpapagoid.png"
                    alt="Viirpapagoid"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Viirpapagoid</h2>
                <p className="text-gray-600 mb-6">
                  Näitusekvaliteediga viirpapagoid, keda aretame ise.
                </p>
                <Link href="/viirpapagoid">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Vaata viirpapagoisid
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-white/90">
              <CardContent className="p-8">
                <div className="relative h-48 md:h-56 mb-6 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/papagoid-eksootilised.png"
                    alt="Eksklusiivsed eksootilised papagoid"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Eksklusiivsed eksootilised papagoid
                </h2>
                <p className="text-gray-600 mb-6">
                  Ettetellimisel Hollandist – lai ja kvaliteetne valik.
                </p>
                <Link href="/papagoid/eksootilised">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    Vaata eksootilisi papagoisid
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
