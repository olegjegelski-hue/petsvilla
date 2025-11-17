
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Bird, Wheat, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const products = [
  {
    id: 'meriseabeebid',
    title: 'Meriseabeebid',
    description: 'Tegeleme lühikarvaliste tõumerisigade professionaalse aretamisega. Aretuse vanemad on hoolikalt valitud, et tagada tervete, rõõmsate ja ilusate beebide sünd. Pakume alati nõu ja tuge uutele omanikele.',
    icon: Heart,
    color: 'from-pink-400 to-red-500',
    href: '/meriseabeebid',
    image: 'https://cdn.abacus.ai/images/9981df73-bb04-4c4b-822a-37d612af899f.png',
    features: ['Julge', 'Sotsiaalne', 'Hooldatud', 'Vaktsineeritud']
  },
  {
    id: 'viirpapagoid',
    title: 'Viirpapagoid',
    description: 'Kirjud ja elurõõmsad viirpapagoid, kes toovad teie koju rõõmu ja värvikust. Meie linnud on terved ja hästi sotsiaalsed.',
    icon: Bird,
    color: 'from-blue-400 to-green-500',
    href: '/viirpapagoid',
    image: 'https://cdn.abacus.ai/images/55d8bcc3-efe9-42e2-8e63-e17f39ee28f9.png',
    features: ['Värvikas sulestik', 'Rõõmsameelne', 'Sotsiaalne', 'Laulev']
  },
  {
    id: 'hein',
    title: 'Kvaliteetne hein',
    description: 'Meie hein on kasvanud puhtas keskkonnas, eemal teedest ja saasteallikatest. Kuivatame heina looduslikult - päikese ja tuule abil.',
    icon: Wheat,
    color: 'from-yellow-400 to-green-500',
    href: '/hein',
    image: '/hay-product.jpg',
    features: ['80L kott', '~4kg', 'Smartpost tarne']
  }
]

export function ProductShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Karvased sõbrad, sulelised lauljad ja kvaliteetne hein
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-20`} />
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${product.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{product.title}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {product.features?.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center mt-2">
                      <Link href={product.href}>
                        <Button className="group bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white border-0 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                          Vaata lähemalt
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
