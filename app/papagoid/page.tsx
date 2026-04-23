import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl px-4 pt-20 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">Papagoid</h1>
            <p className="text-sm md:text-base font-semibold text-gray-600 max-w-3xl mx-auto">
              Otsid seltsiliseks sotsiaalset viirpapagoid või unistad suurest eksootilisest
              lemmikust, leiad PetsVillast usaldusväärse partneri. Kõik meie linnud - nii
              kohapeal aretatud kui ka Hollandist imporditud - omavad ametlikku päritolu ja
              PetsVilla kvaliteedigarantiid. Pakume igale uuele omanikule eluaegset nõustamist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-[#D7CBBE] shadow-2xl bg-[#E3D8CB]/90">
              <CardContent className="p-8">
                <div className="relative h-48 md:h-56 mb-6 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/papagoid-viirpapagoid.png"
                    alt="Viirpapagoid"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-3">Viirpapagoid</h2>
                <p className="text-gray-600 mb-6">
                  Meie Papagoi Keskuses sirgunud, näitusekvaliteediga ja inimestega harjunud viirpapagoid. Sotsiaalsed ja terved sulelised, kes toovad perre palju rõõmu.
                </p>
                <Link href="/viirpapagoid">
                  <Button className="bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80">
                    Vaata viirpapagoisid
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-[#D7CBBE] shadow-2xl bg-[#E3D8CB]/90">
              <CardContent className="p-8">
                <div className="relative h-48 md:h-56 mb-6 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/papagoid-eksootilised.png"
                    alt="Eksklusiivsed eksootilised papagoid"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-3">
                  Eksklusiivsed papagoid
                </h2>
                <p className="text-gray-600 mb-6">
                  Eksootilised papagoid ettetellimisel tunnustatud Hollandi partneritelt. 100% legaalsed, ametlike dokumentidega.
                </p>
                <Link href="/papagoid/eksootilised">
                  <Button className="bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80">
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
