
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, Palette, Users, Mail, Phone, Loader2, Cake, PawPrint, Filter, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { GuineaPig } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  const [mounted, setMounted] = useState(false)
  const [guineaPigs, setGuineaPigs] = useState<GuineaPig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBreed, setSelectedBreed] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')

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
              <p className="text-gray-600">Laadin merisigade andmeid...</p>
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
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">Merisead</h1>
          <p className="text-sm md:text-base font-semibold text-gray-600 max-w-3xl mx-auto mb-8">
            Tegeleme lühikarvaliste tõumerisigade professionaalse aretamisega. Aretuse vanemad on hoolikalt valitud, et tagada tervete, rõõmsate ja ilusate beebide sünd. Iga meie meriseal on kaasas ametlik päritolukaart (pedigree), mis kinnitab looma puhast geneetikat ja tervist. Pakume alati nõu ja tuge uutele omanikele – meie hoolitsus ei lõpe looma loovutamisega.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="#ostuprotsess">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#D7CBBE] text-green-900 bg-[#E3D8CB] hover:bg-[#DCCFBE] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Vaata ostuprotsessi
              </Button>
            </Link>
            <Link href="/meist">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#D7CBBE] text-green-900 bg-[#E3D8CB] hover:bg-[#DCCFBE] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Loe lisaks Meist
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-8 text-center">
          <p className="text-xs md:text-sm italic font-semibold text-[#2E3A32] leading-relaxed">
            Tutvu enne merisea valikut nende vajadustega, et pakkuda oma tulevasele lemmikule parimat.
            <br />
            Meie blogist leiad praktilisi nõuandeid ja hooldusjuhiseid nii uuele kui ka kogenud omanikule.
          </p>
          <Link href="/blogi?loom=Merisead">
            <Button
              variant="ghost"
              className="mt-4 inline-flex h-7 w-[4.5rem] items-center justify-center rounded-full border text-[11px] font-semibold leading-[1] tracking-wide border-muted-foreground/60 text-muted-foreground hover:border-green-800 hover:text-green-800 transition-colors"
            >
              BLOGI
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-center">{error}</p>
          </div>
        )}

        {/* Filters - keskele ja kitsamaks */}
        {guineaPigs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8">
            <motion.div
              className="bg-[#E3D8CB] rounded-lg shadow-md p-4 border border-[#D7CBBE]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <div className="flex flex-wrap items-center gap-3 justify-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-pink-500" />
                  <span className="text-base font-semibold text-gray-900">Filtreeri:</span>
                </div>
                
                {/* Breed Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Tõug</label>
                  <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Vali" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Kõik</SelectItem>
                      {Array.from(new Set(guineaPigs.map(pig => pig.breed).filter(Boolean))).sort().map(breed => (
                        <SelectItem key={breed} value={breed!}>{breed}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Sugu</label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Vali" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Kõik</SelectItem>
                      {Array.from(new Set(guineaPigs.map(pig => pig.gender).filter(Boolean))).sort().map(gender => (
                        <SelectItem key={gender} value={gender!}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedBreed !== 'all' || selectedGender !== 'all') && (
                <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-sm text-gray-600">Aktiivsed filtrid:</span>
                  {selectedBreed !== 'all' && (
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                      Tõug: {selectedBreed}
                    </Badge>
                  )}
                  {selectedGender !== 'all' && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Sugu: {selectedGender}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBreed('all')
                      setSelectedGender('all')
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Tühista filtrid
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Results count */}
        {guineaPigs.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Leitud: <span className="font-semibold text-gray-900">
                {guineaPigs.filter(pig => {
                  const breedMatch = selectedBreed === 'all' || pig.breed === selectedBreed
                  const genderMatch = selectedGender === 'all' || pig.gender === selectedGender
                  return breedMatch && genderMatch
                }).length}
              </span> merisiga
            </p>
          </div>
        )}

        {/* Guinea Pig Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {guineaPigs
            .filter(pig => {
              const breedMatch = selectedBreed === 'all' || pig.breed === selectedBreed
              const genderMatch = selectedGender === 'all' || pig.gender === selectedGender
              return breedMatch && genderMatch
            })
            .map((pig, index) => {
            // Use image proxy endpoint for Notion images to avoid expiration
            // If image is placeholder or missing, use "Pilt lisatakse varsti" placeholder
            const imageUrl = pig.image && pig.image !== '/placeholder-guinea-pig.jpg' && pig.image.startsWith('http')
              ? `/api/guinea-pig-image/${pig.id}`
              : '/placeholder-guinea-pig.jpg'
            
            return (
              <motion.div
                key={pig.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg overflow-hidden">
                  <div className="relative h-80 overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt={pig.name || 'Merisiga'}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  {/* Birth date - vasakul üleval */}
                  {pig.birthDate && (
                    <div className="absolute top-3 left-3 bg-background rounded-lg px-2.5 py-1.5 shadow-md border border-[#D7CBBE]">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700">Sündis</p>
                        <p className="text-sm font-bold text-green-700">
                          {new Date(pig.birthDate).toLocaleDateString('et-EE')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Available date - paremal üleval */}
                  {pig.available && (
                    <div className="absolute top-3 right-3 bg-background rounded-lg px-2.5 py-1.5 shadow-md border border-[#D7CBBE]">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700">Saadaval</p>
                        <p className="text-sm font-bold text-green-700">
                          al. {new Date(pig.available).toLocaleDateString('et-EE')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Price - vasakul all */}
                  {pig.price > 0 && (
                    <div className="absolute bottom-3 left-3 bg-[#1F6A4C] text-white rounded-lg px-3 py-2 shadow-xl border-2 border-[#19563d]">
                      <div className="text-xl font-bold text-white drop-shadow-md">{pig.price}€</div>
                    </div>
                  )}
                  
                  {/* Gender heart icon with text - paremal all */}
                  {pig.gender && (
                    <div className="absolute bottom-3 right-3 transition-transform group-hover:scale-110 duration-300">
                      <div className="flex flex-col items-center bg-background rounded-lg px-3 py-2 shadow-md border border-[#D7CBBE]">
                        <Heart 
                          className={`w-8 h-8 mb-1 ${
                            pig.gender === 'Emane' || pig.gender === 'Tüdruk'
                              ? 'text-pink-500 fill-pink-500' 
                              : pig.gender === 'Isane' || pig.gender === 'Poiss'
                              ? 'text-blue-500 fill-blue-500'
                              : 'text-gray-400 fill-gray-400'
                          }`}
                          strokeWidth={2}
                        />
                        <span className={`text-xs font-bold ${
                          pig.gender === 'Emane' || pig.gender === 'Tüdruk'
                            ? 'text-pink-600' 
                            : pig.gender === 'Isane' || pig.gender === 'Poiss'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}>
                          {pig.gender}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  {/* Nimi ja kood keskele */}
                  <h3 className="text-xl font-bold text-green-900 text-center mb-3 drop-shadow-sm">
                    {pig.name}{pig.code && <span className="text-green-800 font-bold"> ({pig.code})</span>}
                  </h3>
                  
                  {/* Tõug ja Värvus ühel real - keskele joondatud */}
                  {(pig.breed || pig.color) && (
                    <div className="flex items-center justify-center gap-3 mb-3 p-2.5 bg-background rounded-lg border border-[#D7CBBE] flex-wrap">
                      {pig.breed && (
                        <div className="flex items-center gap-1.5">
                          <PawPrint className="w-4 h-4 text-green-900 flex-shrink-0" />
                          <span className="text-sm font-semibold text-green-900">
                            Tõug: <span className="font-bold text-green-900">{pig.breed}</span>
                          </span>
                        </div>
                      )}
                      {pig.breed && pig.color && (
                        <span className="font-bold text-green-900">|</span>
                      )}
                      {pig.color && (
                        <div className="flex items-center gap-1.5">
                          <Palette className="w-4 h-4 text-green-900 flex-shrink-0" />
                          <span className="text-sm font-semibold text-green-900">
                            Värvus: <span className="font-bold text-green-900">{pig.color}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {pig.description && (
                    <p className="text-gray-600 mb-4">{pig.description}</p>
                  )}

                  <Link href={`/kontakt?pig=${encodeURIComponent(pig.name)}&id=${pig.id}${pig.code ? `&code=${encodeURIComponent(pig.code)}` : ''}`}>
                    <Button className="w-full bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 font-semibold shadow-md">
                      Küsi infot
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
        </div>

        {/* Purchase Process */}
        <div id="ostuprotsess" className="mb-12 scroll-mt-24">
          <div className="h-px w-4/5 mx-auto bg-[#C9BCAA] mb-4" />
          <div className="text-center mb-6">
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
              Kuidas merisea ostmine käib?
            </h3>
          </div>

          <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
            <div className="text-gray-700">
              <p className="font-semibold text-gray-900">1. Vali sobiv merisiga</p>
              <p className="text-sm md:text-base">Tutvu galeriiga ning vali endale sobiv beebi.</p>
            </div>
            <div className="text-gray-700">
              <p className="font-semibold text-gray-900">2. Võta meiega ühendust</p>
              <p className="text-sm md:text-base">Saada päring läbi kontaktivormi või helista: +372 512 7938.</p>
            </div>
            <div className="text-gray-700">
              <p className="font-semibold text-gray-900">3. Lepime kokku külastuse</p>
              <p className="text-sm md:text-base">Külastus toimub kokkuleppel, et saaksime sulle rahulikult aega pühendada.</p>
            </div>
            <div className="text-gray-700">
              <p className="font-semibold text-gray-900">4. Vali ja vormista</p>
              <p className="text-sm md:text-base">Kohtumisel saad merisea oma silmaga näha, valida ning vormistada ostu.</p>
            </div>
            <div className="text-gray-700 md:col-span-2">
              <p className="font-semibold text-gray-900">5. Dokumendid ja nõuanded</p>
              <p className="text-sm md:text-base">Anname kaasa pedigree info ja vajalikud hooldussoovitused.</p>
            </div>
          </div>
          <div className="h-px w-4/5 mx-auto bg-[#C9BCAA] mt-4" />
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
