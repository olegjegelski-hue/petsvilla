'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bird, Calendar, Palette, Users, Mail, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Parrot {
  id: string
  name: string
  code: string
  age: string
  color: string
  gender: string
  price: number
  description: string
  image: string
}

export function ExoticParrotGallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [mounted, setMounted] = useState(false)
  const [parrots, setParrots] = useState<Parrot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    async function fetchParrots() {
      try {
        setLoading(true)
        const response = await fetch('/api/exotic-parrots')
        if (!response.ok) {
          throw new Error('Andmete laadimine ebaõnnestus')
        }
        const data = await response.json()
        if (data.parrots) {
          setParrots(data.parrots)
        }
      } catch (err) {
        console.error('Viga andmete laadimisel:', err)
        setError('Ei õnnestunud eksootilisi papagoisid laadida.')
      } finally {
        setLoading(false)
      }
    }

    fetchParrots()
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
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Laadin eksootilisi papagoisid...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            <Bird className="inline-block w-12 h-12 text-green-500 mr-4" />
            Eksklusiivsed eksootilised papagoid
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Ettetellimisel Hollandist. Aitame leida sobiva liigi ja vormistada tellimuse.
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Ettetellimisel</p>
                <p className="text-sm text-gray-600">Hollandist</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Palette className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Suur valik</p>
                <p className="text-sm text-gray-600">Erinevad liigid</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Nõustamine</p>
                <p className="text-sm text-gray-600">Professionaalne tugi</p>
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
        {!error && parrots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Hetkel ei ole eksootilisi papagoisid saadaval.</p>
          </div>
        )}

        {/* Parrot Cards */}
        {parrots.length > 0 && (
          <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {parrots.map((parrot, index) => (
              <motion.div
                key={parrot.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <div className="relative h-80 overflow-hidden">
                    {(() => {
                      const imageUrl =
                        parrot.image &&
                        parrot.image !== '/placeholder-guinea-pig.jpg' &&
                        parrot.image.startsWith('http')
                          ? `/api/budgie-image/${parrot.id}`
                          : parrot.image || '/placeholder-guinea-pig.jpg'
                      return (
                        <Image
                          src={imageUrl}
                          alt={parrot.name || 'Papagoi'}
                          fill
                          className="object-contain bg-white hover:scale-105 transition-transform duration-700"
                        />
                      )
                    })()}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {parrot.name}
                        {parrot.code && (
                          <span className="text-gray-500 font-semibold"> ({parrot.code})</span>
                        )}
                      </h3>
                      {parrot.price > 0 && (
                        <div className="text-2xl font-bold text-green-600">{parrot.price}€</div>
                      )}
                    </div>

                    {parrot.description && (
                      <p className="text-gray-600 mb-4">{parrot.description}</p>
                    )}

                    <Link href={`/kontakt?product=papagoi&id=${parrot.id}${parrot.code ? `&code=${encodeURIComponent(parrot.code)}` : ''}`}>
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
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
        <div className="mb-16">
          <Card className="border border-green-100 shadow-2xl bg-gradient-to-br from-green-50 via-white to-blue-50">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Kuidas eksootilise papagoi tellimine käib?
                </h3>
                <p className="text-gray-600">Selge ja personaalne protsess, et kõik sujuks.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-white/90 border border-green-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Bird className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">1. Vali sobiv papagoi</h4>
                      <p className="text-gray-600">Tutvu valikuga ja anna teada, milline liik huvitab.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-green-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">2. Võta meiega ühendust</h4>
                      <p className="text-gray-600">Küsi rohkem infot telefonil või kontaktivormi kaudu.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-green-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">3. Lepime kokku detailid</h4>
                      <p className="text-gray-600">Kinnitame liigi, hinna ja saabumise aja.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-green-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">4. Kättesaamine ja nõustamine</h4>
                      <p className="text-gray-600">Saad papagoi kätte koos vajalike juhistega.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Papagoi Center CTA */}
        <div className="mb-16">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-green-50">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-6">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  🦜 Tule Papagoi Keskusesse!
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Soovid näha meie merisigasid ja viirpapagoide enne ostu?
                  <br />
                  Külasta meie Papagoi Keskust, kus saad:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  'Tutvuda müügiloomadega rahulikult',
                  'Küsida nõu ja saada eksperdivastuseid',
                  'Veeta aega loomadega ja valida oma lemmik',
                  'Näha, kuidas meie loomad elavad',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-white/90 rounded-xl p-4 shadow-md">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Link href="https://papagoi.ee" target="_blank" rel="noreferrer">
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
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
