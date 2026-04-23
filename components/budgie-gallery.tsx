
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bird, Calendar, Palette, Users, Mail, Phone, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Budgie {
  id: string
  name: string
  code: string
  age: string
  color: string
  gender: string
  price: number
  personality: string[]
  description: string
  image: string
}

export function BudgieGallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [mounted, setMounted] = useState(false)
  const [budgies, setBudgies] = useState<Budgie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    async function fetchBudgies() {
      try {
        setLoading(true)
        const response = await fetch('/api/budgies')
        if (!response.ok) {
          throw new Error('Andmete laadimine ebaõnnestus')
        }
        const data = await response.json()
        if (data.budgies) {
          setBudgies(data.budgies)
        }
      } catch (err) {
        console.error('Viga andmete laadimisel:', err)
        setError('Ei õnnestunud viirpapagoisid laadida.')
      } finally {
        setLoading(false)
      }
    }

    fetchBudgies()
  }, [])

  if (!mounted) {
    return <div className="py-20" />
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Laadin viirpapagoisid...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-20 pb-0">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Viirpapagoid
          </h1>
          <p className="text-sm md:text-base font-semibold text-gray-600 max-w-3xl mx-auto mb-4">
            Kirjud ja elurõõmsad viirpapagoid, kes toovad teie koju rõõmu ja värvikust. 
            Meie linnud on terved ja hästi sotsiaalsed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link href="#ostuprotsess-viirpapagoid">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#D7CBBE] text-green-900 bg-[#E3D8CB] hover:bg-[#DCCFBE] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Vaata ostuprotsessi
              </Button>
            </Link>
            <Link href="/meist#viirpapagoidest">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#D7CBBE] text-green-900 bg-[#E3D8CB] hover:bg-[#DCCFBE] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Loe lisaks Meist
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto mb-8 text-center">
            <p className="text-xs md:text-sm italic font-semibold text-[#2E3A32] leading-relaxed">
              Tutvu enne viirpapagoi valikut nende vajadustega, et pakkuda oma tulevasele lemmikule parimat.
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
          
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-green-900 mx-auto mb-2" />
                <p className="font-semibold text-green-900">Vanus</p>
                <p className="text-sm text-gray-600">3-5 kuud</p>
              </CardContent>
            </Card>
            <Card className="border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg">
              <CardContent className="p-4 text-center">
                <Palette className="w-8 h-8 text-green-900 mx-auto mb-2" />
                <p className="font-semibold text-green-900">Värvid</p>
                <p className="text-sm text-gray-600">Erinevad värvid</p>
              </CardContent>
            </Card>
            <Card className="border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-900 mx-auto mb-2" />
                <p className="font-semibold text-green-900">Iseloom</p>
                <p className="text-sm text-gray-600">Lauljad ja sõbralikud</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-center">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!error && budgies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Hetkel ei ole viirpapagoisid müügis.</p>
          </div>
        )}

        {/* Budgie Cards */}
        {budgies.length > 0 && (
          <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {budgies.map((budgie, index) => (
            <motion.div
              key={budgie.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg overflow-hidden">
                <div className="relative h-80 overflow-hidden">
                  {(() => {
                    const imageUrl =
                      budgie.image &&
                      budgie.image !== '/placeholder-guinea-pig.jpg' &&
                      budgie.image.startsWith('http')
                        ? `/api/budgie-image/${budgie.id}`
                        : budgie.image || '/placeholder-guinea-pig.jpg'
                    return (
                      <Image
                        src={imageUrl}
                        alt={budgie.name || 'Viirpapagoi'}
                        fill
                        className="object-contain bg-background hover:scale-105 transition-transform duration-700"
                      />
                    )
                  })()}
                  {budgie.gender && (
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="outline"
                        className={
                          budgie.gender === 'Tüdruk'
                            ? 'bg-pink-100 text-pink-700 border-pink-200'
                            : budgie.gender === 'Poiss'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-white/80 text-gray-700'
                        }
                      >
                        {budgie.gender}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-green-900">
                      {budgie.name}
                      {budgie.code && (
                        <span className="text-gray-500 font-semibold"> ({budgie.code})</span>
                      )}
                    </h3>
                    {budgie.price > 0 && (
                      <div className="text-2xl font-bold text-green-900">{budgie.price}€</div>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{budgie.age}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{budgie.color}</span>
                    </div>
                  </div>

                  {budgie.description && (
                    <p className="text-gray-600 mb-4">{budgie.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {budgie.personality?.map((trait, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <Link
                    href={`/kontakt?product=viirpapagoi&id=${budgie.id}${budgie.code ? `&code=${encodeURIComponent(budgie.code)}` : ''}`}
                  >
                    <Button className="w-full bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80">
                      <Bird className="w-4 h-4 mr-2" />
                      Küsi infot
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </div>
        )}

        {/* Purchase Process */}
        <div id="ostuprotsess-viirpapagoid" className="mb-16 scroll-mt-24">
          <Card className="border border-[#D7CBBE] shadow-2xl bg-[#E3D8CB]/90">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-green-900 mb-2">
                  Kuidas viirpapagoi ostmine käib?
                </h3>
                <p className="text-gray-600">Selge ja sõbralik protsess, et kõik sujuks.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-background border border-[#D7CBBE] p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#E3D8CB] text-green-900 flex items-center justify-center">
                      <Bird className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">1. Vali sobiv viirpapagoi</h4>
                      <p className="text-gray-600">Tutvu galeriiga ning vali endale sobiv lind.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-background border border-[#D7CBBE] p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#E3D8CB] text-green-900 flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">2. Võta ühendust</h4>
                      <p className="text-gray-600">Küsi rohkem infot telefonil või kontaktivormi kaudu.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-background border border-[#D7CBBE] p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#E3D8CB] text-green-900 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">3. Külastus / valik</h4>
                      <p className="text-gray-600">Lepime kokku aja, kus saad linde näha ja valida sobiva.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-background border border-[#D7CBBE] p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#E3D8CB] text-green-900 flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">4. Vali ja vormista</h4>
                      <p className="text-gray-600">Kohtumisel saad viirpapagoisi oma silmaga näha, valida ning vormistada ostu.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-background border border-[#D7CBBE] p-5 shadow-lg md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#E3D8CB] text-green-900 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">5. Nõuanded ja juhised</h4>
                      <p className="text-gray-600">Anname kaasa vajalikud hooldus- ja toitmissoovitused.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Papagoi Center CTA */}
        <div className="mb-0">
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
    </section>
  )
}
