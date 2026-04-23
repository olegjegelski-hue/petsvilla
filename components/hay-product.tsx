
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wheat, Package, Scale, Truck, MapPin, Euro } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: Package,
    title: '80L Kott',
    description: 'Suur maht, pikaks ajaks'
  },
  {
    icon: Scale,
    title: '~4kg Kaal',
    description: 'Kvaliteetne ja tolmuvaba'
  },
  {
    icon: Wheat,
    title: 'Värske Kvaliteet',
    description: 'Alati värske ja kuiv'
  },
  {
    icon: Truck,
    title: 'Smartpost Tarne',
    description: 'Kiire ja mugav tarne'
  }
]

const benefits = [
  'Ideaalne merisiigadele ja küülikutele',
  'Värsketent ja kuiv',
  'Suur 80L kott kestab kaua',
  'Kvaliteetne ja loomuldline',
  'Kiire tarne Smartpost kaudu',
  'Soodne hind'
]

export function HayProduct() {
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
            Kvaliteetne hein
          </h1>
          <p className="text-sm md:text-base font-semibold text-gray-600 max-w-3xl mx-auto">
            Meie hein on kasvanud puhtas keskkonnas, eemal teedest ja saasteallikatest.
            <br />
            Kuivatame heina looduslikult päikese ja tuule abil.
          </p>
          <Link href="/meist#heinast">
            <Button
              variant="outline"
              className="mt-4 border-2 border-[#D7CBBE] text-green-900 bg-[#E3D8CB] hover:bg-[#DCCFBE] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Meie hein
            </Button>
          </Link>
        </motion.div>

        {/* Main Product Section */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src="/hay-product.jpg"
                  alt="Kvaliteetne looduslik hein merisigadele ja küülikutele - 80L kott"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-green-900 mb-4">
                  Hein
                </h2>
                <div className="text-sm md:text-base font-semibold text-gray-600 leading-relaxed space-y-2">
                  <p>(pakitud 80L viljakotti, ca 4 kg)</p>
                  <p>Sobib merisigadele, küülikutele ja teistele närilistele.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-[#E3D8CB]/90 border border-[#D7CBBE] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">Hinnad</h3>
                  </div>
                  <Euro className="w-8 h-8 text-green-900" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm border border-[#D7CBBE]">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-green-800 flex-shrink-0" />
                      <div className="font-medium">
                        <div>Kohapeal Tartu mnt 80, Soinaste</div>
                        <div className="text-sm text-gray-600">(enne tulekut helista tel 512 7938)</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">8€</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm border border-[#D7CBBE]">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-green-800 flex-shrink-0" />
                      <div className="font-medium">
                        <div>Smartpost tarne üle Eesti</div>
                        <div className="text-sm text-gray-600">(koti hind koos saatmisega)</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">9€</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/telli-hein">
                <Button size="lg" className="w-full bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 py-4 text-lg">
                  <Truck className="w-5 h-5 mr-2" />
                  Telli Smartposti kaudu
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Grid - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 text-green-900 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-800 font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Food Brands Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-0"
        >
          <Card className="border border-[#D7CBBE] bg-[#E3D8CB]/90">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center text-green-900 mb-3">
                Pakume heinaga kaasa ka kvaliteettoitu
              </h3>
              <p className="text-sm md:text-base font-semibold text-gray-600 text-center max-w-3xl mx-auto mb-6">
                Kvaliteetse lisatoidu saad mugavalt ja ilma eraldi postikuluta oma ostukorvi lisada otse heina tellimuse lehel.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                <div className="relative w-40 h-20 md:w-48 md:h-24">
                  <Image
                    src="/dobele-transparent.png"
                    alt="Dobeles Dzīrnavnieks kvaliteetstoit"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
                <div className="relative w-40 h-20 md:w-48 md:h-24">
                  <Image
                    src="/VerseleLaga-transparent.png"
                    alt="Versele-Laga kvaliteetstoit"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </section>
  )
}
