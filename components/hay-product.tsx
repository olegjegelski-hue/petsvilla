
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wheat, Package, Scale, Truck, MapPin, Euro, CheckCircle } from 'lucide-react'
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
    description: 'Kvaliteetne ja värsketent'
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
            <Wheat className="inline-block w-12 h-12 text-yellow-600 mr-4" />
            Kvaliteetne Hein
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meie hein on kasvanud puhtas keskkonnas, eemal teedest ja saasteallikatest. 
            Kuivatame heina looduslikult päikese ja tuule abil.
          </p>
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
                  alt="Kvaliteetne hein - 80L kott"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Saadaval
                  </Badge>
                </div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Hein
                </h2>
                <div className="text-lg text-gray-600 leading-relaxed space-y-2">
                  <p>(pakitud 80L viljakotti, ca 4 kg)</p>
                  <p>Sobib meriseadele, küülikutele ja teistele närilistele.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-yellow-100 to-green-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Hinnad</h3>
                  </div>
                  <Euro className="w-8 h-8 text-yellow-600" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div className="font-medium">
                        <div>Kohapeal Tartu mnt 80, Soinaste</div>
                        <div className="text-sm text-gray-600">(enne tulekut helista tel 512 7938)</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">8€</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div className="font-medium">
                        <div>Smartpost tarne üle Eesti</div>
                        <div className="text-sm text-gray-600">(koti hind koos saatmisega)</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">9€</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/telli-hein">
                <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white py-4 text-lg">
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
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
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
          className="mb-16"
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Pakume heinaga kaasa ka kvaliteettoitu
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                <div className="relative w-40 h-20 md:w-48 md:h-24">
                  <Image
                    src="/dobele.png"
                    alt="Dobeles Dzīrnavnieks kvaliteetstoit"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-40 h-20 md:w-48 md:h-24">
                  <Image
                    src="/VerseleLaga.jpg"
                    alt="Versele-Laga kvaliteetstoit"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-yellow-500 to-green-500 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-center mb-8">Miks valida meie hein?</h3>
              
              <div className="text-center">
                <Link href="/meist#heinast">
                  <Button 
                    size="lg" 
                    className="bg-white text-green-600 hover:bg-gray-100 hover:text-green-700 text-lg px-8 py-6 shadow-xl"
                  >
                    <Wheat className="w-5 h-5 mr-2" />
                    Loe Lähemalt Meie Heinast
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
