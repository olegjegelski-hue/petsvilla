
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bird, Calendar, Palette, Users, Mail, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Fallback data - in the future this could be fetched from Notion
const budgies = [
  {
    id: 1,
    name: 'Sky',
    age: '4 kuud',
    color: 'Sinine-valge',
    gender: 'Isane',
    price: 30,
    personality: ['Laulev', 'Sotsiaalne', 'Energiline'],
    description: 'Sky on väga laulev ja rõõmsameelne poiss, kes armastab tähelepanu ja suhtlemist.',
    image: 'https://cdn.abacus.ai/images/a4579294-65fd-47b1-8f6c-b55b420e2676.png',
    available: true
  },
  {
    id: 2,
    name: 'Sunny',
    age: '3 kuud',
    color: 'Kollane-roheline',
    gender: 'Emane',
    price: 32,
    personality: ['Rahulik', 'Sõbralik', 'Ilus'],
    description: 'Sunny on kauni kuldse sulestikuga tüdruk, kes on väga rahulik ja sõbralik.',
    image: 'https://cdn.abacus.ai/images/428c6281-4a7e-49a0-8449-e460fc5cf704.png',
    available: true
  },
  {
    id: 3,
    name: 'Rainbow',
    age: '5 kuud',
    color: 'Värvikirev',
    gender: 'Isane',
    price: 45,
    personality: ['Intelligentne', 'Mänguline', 'Kõnekas'],
    description: 'Rainbow on erakordse värvikira sulestikuga ja väga intelligentne lind.',
    image: 'https://cdn.abacus.ai/images/526d8b61-5ea7-47e0-8d90-c245014be97d.png',
    available: false
  },
  {
    id: 4,
    name: 'Pearl',
    age: '3.5 kuud',
    color: 'Valge-hall',
    gender: 'Emane',
    price: 35,
    personality: ['Elegantne', 'Vaikne', 'Usaldav'],
    description: 'Pearl on elegantse ilmega tüdruk, kes on väga usaldav ja rahulik.',
    image: 'https://cdn.abacus.ai/images/d293995c-d29b-4020-ab1c-a6e74e703322.png',
    available: true
  }
]

export function BudgieGallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="py-20" />
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
            <Bird className="inline-block w-12 h-12 text-blue-500 mr-4" />
            Viirpapagoid
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Kirjud ja elurõõmsad viirpapagoid, kes toovad teie koju rõõmu ja värvikust. 
            Meie linnud on terved ja hästi sotsiaalsed.
          </p>
          <Link href="#ostuprotsess-viirpapagoid">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Vaata ostuprotsessi
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          {/* Availability Notice */}
          <div className="bg-red-50 border-2 border-red-500 rounded-lg px-6 py-3 max-w-2xl mx-auto mt-6 mb-8">
            <p className="text-red-600 font-semibold text-lg text-center">
              NB! linnud peagi saabimas.
            </p>
          </div>
          
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">Vanus</p>
                <p className="text-sm text-gray-600">3-5 kuud</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Palette className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">Värvid</p>
                <p className="text-sm text-gray-600">Erinevad värvid</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">Iseloom</p>
                <p className="text-sm text-gray-600">Lauljad ja sõbralikud</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Budgie Cards */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {budgies.map((budgie, index) => (
            <motion.div
              key={budgie.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className={`h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden ${
                !budgie.available ? 'opacity-75' : ''
              }`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={budgie.image}
                    alt={budgie.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={budgie.available ? "default" : "secondary"}
                      className={budgie.available ? "bg-green-500" : "bg-gray-500"}
                    >
                      {budgie.available ? "Saadaval" : "Müüdud"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/80">
                      {budgie.gender}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{budgie.name}</h3>
                    <div className="text-2xl font-bold text-blue-500">{budgie.price}€</div>
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

                  <p className="text-gray-600 mb-4">{budgie.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {budgie.personality?.map((trait, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  {budgie.available && (
                    <Link href="/kontakt">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <Bird className="w-4 h-4 mr-2" />
                        Küsi infot
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Purchase Process */}
        <div id="ostuprotsess-viirpapagoid" className="mb-16 scroll-mt-24">
          <Card className="border border-blue-100 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-green-50">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Kuidas viirpapagoi ostmine käib?
                </h3>
                <p className="text-gray-600">Selge ja sõbralik protsess, et kõik sujuks.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-white/90 border border-blue-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Bird className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">1. Vali sobiv viirpapagoi</h4>
                      <p className="text-gray-600">Tutvu galeriiga ning vali endale sobiv lind.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-blue-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">2. Võta ühendust</h4>
                      <p className="text-gray-600">Küsi rohkem infot telefonil või kontaktivormi kaudu.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-blue-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">3. Külastus / valik</h4>
                      <p className="text-gray-600">Lepime kokku aja, kus saad linde näha ja valida sobiva.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-blue-100 p-5 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">4. Vali ja vormista</h4>
                      <p className="text-gray-600">Kohtumisel saad viirpapagoisi oma silmaga näha, valida ning vormistada ostu.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/90 border border-blue-100 p-5 shadow-lg md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
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

        {/* Info CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">PetsVilla on näituse kvaliteediga viirpapagoide aretaja.</h3>
              <p className="text-lg mb-6 opacity-95">
                Meie beebid on väga ilusa sulestiku ja uhke päritoluga.
              </p>
              <Link href="/meist#viirpapagoidest">
                <Button size="lg" variant="secondary" className="px-8">
                  <Users className="w-5 h-5 mr-2" />
                  Loe lisaks Meist
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
