
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Bird, Wheat, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const products = [
  {
    id: 'hein',
    title: 'Kvaliteetne hein',
    description: 'Meie hein on kasvanud puhtas keskkonnas, eemal teedest ja saasteallikatest. Kuivatame heina looduslikult - päikese ja tuule abil. Sinu lemmiku tervise alustala. Smartpost tarne üle Eesti.',
    icon: Wheat,
    color: 'from-yellow-400 to-green-500',
    href: '/hein',
    image: '/hay-product.jpg',
    features: ['80L kott', '~4kg', 'Smartpost tarne']
  }
]

const featuredSections: Array<{
  id: string
  title: string
  href?: string
  image: string
  buttonLabel?: string
  icon: typeof Heart
  gradient: string
  buttons?: Array<{ label: string; href: string }>
}> = [
  {
    id: 'merisead',
    title: 'Merisead',
    href: '/merisead',
    image: 'https://cdn.abacus.ai/images/9981df73-bb04-4c4b-822a-37d612af899f.png',
    buttonLabel: 'Tutvu merisigadega',
    icon: Heart,
    gradient: 'from-pink-400 to-red-500',
  },
  {
    id: 'papagoid',
    title: 'Papagoid',
    image: '/papagoid-koos.png',
    icon: Bird,
    gradient: 'from-blue-400 to-green-500',
    buttons: [
      { label: 'Viirpapagoid', href: '/viirpapagoid' },
      { label: 'Teised papagoid', href: '/papagoid/eksootilised' },
    ],
  },
]

export function ProductShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const renderProductCard = (product: (typeof products)[number], index: number) => {
    const Icon = product.icon
    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        <Card className="group h-full hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg">
          <div className="relative h-40 md:h-52 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-20`} />
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#1F6A4C] to-[#2F7A5B] shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 md:p-8 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-green-900">{product.title}</h3>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            <div className="flex-1 flex items-end justify-center mt-2 pb-2">
              <Link href={product.href}>
                <Button size="sm" className="group bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Telli heina
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderFeaturedCard = (section: (typeof featuredSections)[number], index: number) => {
    const Icon = section.icon
    return (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-white/90 overflow-hidden h-full">
          <div className="relative h-40 md:h-52">
            <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20`} />
            <Image
              src={section.image}
              alt={
                section.id === 'papagoid'
                  ? 'Laps suhtleb sotsiaalse papagoiga Papagoi Keskuses Tartumaal'
                  : section.id === 'merisead'
                    ? 'Dokumenteeritud päritoluga tõumerisead PetsVilla aretusest'
                    : section.title
              }
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[#1F6A4C] to-[#2F7A5B] shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <CardContent className="p-6 md:p-8 flex flex-col flex-1">
            <h3 className="text-2xl font-bold text-green-900 mb-2">{section.title}</h3>
            <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
              {section.id === 'merisead'
                ? 'Vastutustundlik aretus, kus esikohal on loomade tervis, puhas geneetika ja suurepärane iseloom. Iga meriseaga on kaasas ametlik päritolukaart ja meiepoolne eluaegne nõustamine.'
                : section.id === 'papagoid'
                  ? 'Pakume ametliku päritoluga ja legaalseid eksootilisi papagoisid (Hollandi import) ning meie enda Keskuses kasvanud sotsiaalseid viirpapagoisid. Kõikidele lindudele kehtib PetsVilla kvaliteedigarantii ja eluaegne nõustamine.'
                  : 'Tutvu meie hoitud lemmikutega, kellele on tagatud hooldus, tervisekontroll ja rahulik keskkond.'}
            </p>
            {section.buttons ? (
              <div className="mt-2">
                <div className="flex flex-wrap gap-3">
                  {section.buttons.map((button) => (
                    <Link key={button.href} href={button.href}>
                      <Button size="sm" className="bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 rounded-full px-6 py-2">
                        {button.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-end justify-center mt-2 pb-2">
                <Link href={section.href || '#'}>
                  <Button size="sm" className="bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 rounded-full px-6 py-2">
                    {section.buttonLabel}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <section ref={ref} className="pt-10 pb-16 bg-background">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-xl md:text-2xl text-[#1F6A4C] mb-4 max-w-3xl mx-auto leading-relaxed font-semibold">
            Karvased ja sulelised sõbrad, kvaliteetne hein
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderFeaturedCard(featuredSections[0], 0)}
          {renderFeaturedCard(featuredSections[1], 1)}
          {renderProductCard(products[0], 2)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="my-12"
        >
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
        </motion.div>

      </div>
    </section>
  )
}
