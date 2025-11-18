
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, Palette, Users, Mail, Phone, ArrowRight, Loader2, Cake, PawPrint } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { GuineaPig } from '@/lib/types'

// Fallback data in case Notion API fails
const fallbackGuineaPigs: GuineaPig[] = [
  {
    id: '1',
    name: 'Luna',
    age: '6 nädalat',
    color: 'Tricolored (must, valge, pruun)',
    gender: 'Emane',
    price: 25,
    description: 'Luna on väga sõbralik ja rahulik kutsikas, kes armastab kõditamist ja kergeid maiustusi.',
    image: 'https://cdn.abacus.ai/images/fc84ac74-1d4c-4308-9a31-f0a0c13d5f51.png',
  }
]

export function GuineaPigGallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [mounted, setMounted] = useState(false)
  const [guineaPigs, setGuineaPigs] = useState<GuineaPig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Fetch guinea pigs from Notion API
    async function fetchGuineaPigs() {
      try {
        setLoading(true)
        const response = await fetch('/api/guinea-pigs')
        
        if (!response.ok) {
          throw new Error('Andmete laadimine ebaõnnestus')
        }
        
        const data = await response.json()
        
        if (data.guineaPigs && data.guineaPigs.length > 0) {
          setGuineaPigs(data.guineaPigs)
        } else {
          // Use fallback data if no data from Notion
          setGuineaPigs(fallbackGuineaPigs)
        }
      } catch (err) {
        console.error('Viga andmete laadimisel:', err)
        setError('Ei õnnestunud andmeid laadida. Kasutan varundatud andmeid.')
        setGuineaPigs(fallbackGuineaPigs)
      } finally {
        setLoading(false)
      }
    }

    fetchGuineaPigs()
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
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Laadin meriseabeebide andmeid...</p>
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
            <Heart className="inline-block w-12 h-12 text-pink-500 mr-4" />
            Merisead
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Tegeleme lühikarvaliste tõumerisigade professionaalse aretamisega. Aretuse vanemad on hoolikalt valitud, et tagada tervete, rõõmsate ja ilusate beebide sünd. Pakume alati nõu ja tuge uutele omanikele.
          </p>
          
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="font-semibold">Vanus</p>
                <p className="text-sm text-gray-600">5-8 nädalat</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Palette className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="font-semibold">Värvid</p>
                <p className="text-sm text-gray-600">Erinevad värvid</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="font-semibold">Sotsiaalsed</p>
                <p className="text-sm text-gray-600">Sõbralikud ja usaludasväärsed</p>
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

        {/* Guinea Pig Cards */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {guineaPigs.map((pig, index) => {
            // Use different placeholder images if no image is provided
            const placeholderImages = [
              '/parent-brown.png',
              '/parent-silver.jpg',
              '/parent-black.jpg',
              '/parent-cream.jpg',
              '/parent-rosette.jpg',
              '/parent-white-red-eyes.jpg'
            ]
            const placeholderImage = placeholderImages[index % placeholderImages.length]
            
            // Use image proxy endpoint for Notion images to avoid expiration
            const imageUrl = pig.image && pig.image !== '/placeholder-guinea-pig.jpg' 
              ? `/api/guinea-pig-image/${pig.id}`
              : (pig.image || placeholderImage)
            
            return (
              <motion.div
                key={pig.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <div className="relative h-80 overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt={pig.name || 'Meriseabeeby'}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  {/* Status badge - vasakul üleval */}
                  <div className="absolute top-4 left-4">
                    {pig.status && (
                      <Badge 
                        variant="default" 
                        className={
                          pig.status === 'Emmega' ? 'bg-green-500 hover:bg-green-600' :
                          pig.status === 'Broneeritud' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          pig.status === 'Müüdud' ? 'bg-gray-500 hover:bg-gray-600' :
                          'bg-blue-500 hover:bg-blue-600'
                        }
                      >
                        {pig.status}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Available date - paremal üleval */}
                  {pig.available && (
                    <div className="absolute top-4 right-4 bg-white/95 rounded-lg px-3 py-2 shadow-md">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700">Saadaval</p>
                        <p className="text-sm font-bold text-pink-600">
                          al. {new Date(pig.available).toLocaleDateString('et-EE')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Gender heart icon - alumises paremas nurgas */}
                  {pig.gender && (
                    <div className="absolute bottom-4 right-4 transition-transform group-hover:scale-110 duration-300">
                      <Heart 
                        className={`w-10 h-10 drop-shadow-lg ${
                          pig.gender === 'Emane' || pig.gender === 'Tüdruk'
                            ? 'text-pink-500 fill-pink-500' 
                            : pig.gender === 'Isane' || pig.gender === 'Poiss'
                            ? 'text-blue-500 fill-blue-500'
                            : 'text-gray-400 fill-gray-400'
                        }`}
                        strokeWidth={2}
                      />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{pig.name}</h3>
                    {pig.price > 0 && (
                      <div className="text-2xl font-bold text-pink-500">{pig.price}€</div>
                    )}
                  </div>
                  
                  <div className="space-y-2.5 mb-4">
                    {pig.gender && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600"><span className="font-semibold">Sugu:</span> {pig.gender}</span>
                      </div>
                    )}
                    {pig.breed && (
                      <div className="flex items-center space-x-2">
                        <PawPrint className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600"><span className="font-semibold">Tõug:</span> {pig.breed}</span>
                      </div>
                    )}
                    {pig.color && (
                      <div className="flex items-center space-x-2">
                        <Palette className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600"><span className="font-semibold">Värvus:</span> {pig.color}</span>
                      </div>
                    )}
                    {pig.birthDate && (
                      <div className="flex items-center space-x-2">
                        <Cake className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600"><span className="font-semibold">Sündis:</span> {new Date(pig.birthDate).toLocaleDateString('et-EE')}</span>
                      </div>
                    )}
                    {pig.age && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600"><span className="font-semibold">Vanus:</span> {pig.age}</span>
                      </div>
                    )}
                  </div>

                  {pig.description && (
                    <p className="text-gray-600 mb-4">{pig.description}</p>
                  )}

                  <Link href={`/kontakt?pig=${encodeURIComponent(pig.name)}&id=${pig.id}`}>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      <Heart className="w-4 h-4 mr-2" />
                      Küsi infot
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
        </div>

        {/* Info CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">PetsVilla on tõumerisigade aretaja.</h3>
              <p className="text-lg mb-6 opacity-95">
                Meie beebid on dokumenteeritud päritoluga (pedigree).
              </p>
              <Link href="/meist">
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
