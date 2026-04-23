import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
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
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">Papagoid</h1>
            <p className="text-sm md:text-base font-semibold text-gray-600 max-w-3xl mx-auto">
              Otsid seltsiliseks sotsiaalset viirpapagoid või unistad suurest eksootilisest
              lemmikust, leiad PetsVillast usaldusväärse partneri. Kõik meie linnud - nii
              kohapeal aretatud kui ka Hollandist imporditud - omavad ametlikku päritolu ja
              PetsVilla kvaliteedigarantiid. Pakume igale uuele omanikule eluaegset nõustamist.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8 text-center animate-fade-in-up">
            <p className="text-xs md:text-sm italic font-semibold text-[#2E3A32] leading-relaxed">
              Tutvu enne papagoi valikut nende vajadustega, et pakkuda oma tulevasele lemmikule parimat.
              <br />
              Meie blogist leiad praktilisi nõuandeid ja hooldusjuhiseid nii uuele kui ka kogenud omanikule.
            </p>
            <Link href="/blogi?loom=Papagoid">
              <Button
                variant="ghost"
                className="mt-4 inline-flex h-7 w-[4.5rem] items-center justify-center rounded-full border text-[11px] font-semibold leading-[1] tracking-wide border-muted-foreground/60 text-muted-foreground hover:border-green-800 hover:text-green-800 transition-colors"
              >
                BLOGI
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
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

          <div className="my-12 animate-fade-in-up">
            <Card className="border border-[#D7CBBE] shadow-2xl bg-[#E3D8CB]/90">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">
                    🦜 Tule Papagoi Keskusesse!
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Tahad näha, kuidas meie loomad päriselt elavad? Otsid perele meeldejäävat ja hariduslikku elamust?
                    <br />
                    Külasta meie Papagoi Keskust, kus saad:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {[
                    'Vahetu kontakt: Toida ja suhtle meie sotsiaalsete papagoidega.',
                    'Teadlik valik: Tutvu merisigade ja lindudega isiklikult enne ostuotsuse tegemist.',
                    'Privaatkülastused: Broneeri rahulik aeg oma perele ja saa personaalset nõustamist.',
                    'Täielik läbipaistvus: Näe oma silmaga meie professionaalset aretuskeskkonda.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-white/90 rounded-xl p-4 shadow-md">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Link href="https://papagoi.ee" target="_blank" rel="noreferrer">
                    <Button className="bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Broneeri külastus →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
