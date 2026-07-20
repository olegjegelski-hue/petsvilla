
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, Palette, Users, Mail, Phone, Cake, PawPrint, Filter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { GuineaPig } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface GuineaPigGalleryProps {
  /** Serverist (ISR) eelrenderdatud Notion andmed — crawl + LCP. */
  initialGuineaPigs: GuineaPig[]
}

export function GuineaPigGallery({ initialGuineaPigs }: GuineaPigGalleryProps) {
  const [guineaPigs] = useState(initialGuineaPigs)
  const [selectedBreed, setSelectedBreed] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')

  return (
    <section className="pt-20 pb-0">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header — ilma opacity:0 animatsioonita (LCP = pealkiri / staatiline banner) */}
        <div className="text-center mb-8">
          <h1 className="page-title mb-4">
            Meriseabeebid
          </h1>
          <p className="page-lead mb-2">
            Merisead müügiks ainult beebidena — dokumenteeritud päritoluga (pedigree).
          </p>
          <p className="text-sm md:text-base font-medium text-gray-600 max-w-3xl mx-auto mb-6">
            Lühikarvalised tõumerisead ametliku päritolukaardiga. Nõu ja tugi ka pärast loovutamist.
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
        </div>

        <details className="max-w-3xl mx-auto mb-8 text-sm text-gray-600 leading-relaxed">
          <summary className="cursor-pointer font-semibold text-green-900 text-center list-none [&::-webkit-details-marker]:hidden">
            Loe aretuse kohta rohkem
          </summary>
          <p className="mt-3 text-center font-medium">
            Tegeleme lühikarvaliste tõumerisigade professionaalse aretamisega. Aretuse vanemad on hoolikalt valitud, et tagada tervete, rõõmsate ja ilusate beebide sünd. Iga meie meriseal on kaasas ametlik päritolukaart (pedigree), mis kinnitab looma puhast geneetikat ja tervist. Pakume alati nõu ja tuge uutele omanikele – meie hoolitsus ei lõpe looma loovutamisega.
          </p>
        </details>

        {/* Filters - keskele ja kitsamaks */}
        {guineaPigs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-[#E3D8CB] rounded-lg shadow-md p-4 border border-[#D7CBBE]">
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
            </div>
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
              <div key={pig.id}>
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg overflow-hidden">
                  <div className="relative h-80 overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt={
                        pig.name
                          ? `Dokumenteeritud päritoluga tõumerisiga PetsVilla aretusest - ${pig.name}`
                          : 'Dokumenteeritud päritoluga tõumerisead PetsVilla aretusest'
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  {/* Müügistaatus */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      className={
                        pig.saleDisplay === 'Broneeritud' || pig.status === 'Broneeritud'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                      }
                    >
                      {pig.saleDisplay === 'Broneeritud' || pig.status === 'Broneeritud'
                        ? 'Broneeritud'
                        : 'Saadaval'}
                    </Badge>
                  </div>

                  {pig.available && pig.saleDisplay !== 'Broneeritud' && pig.status !== 'Broneeritud' && (
                    <div className="absolute top-3 right-3 bg-background rounded-lg px-2.5 py-1.5 shadow-md border border-[#D7CBBE]">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700">Alates</p>
                        <p className="text-sm font-bold text-green-700">
                          {new Date(pig.available).toLocaleDateString('et-EE')}
                        </p>
                      </div>
                    </div>
                  )}

                  {pig.birthDate && (
                    <div className="absolute top-12 left-3 bg-background rounded-lg px-2.5 py-1.5 shadow-md border border-[#D7CBBE]">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700">Sündis</p>
                        <p className="text-sm font-bold text-green-700">
                          {new Date(pig.birthDate).toLocaleDateString('et-EE')}
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

                  {pig.canBook !== false && pig.saleDisplay !== 'Broneeritud' && pig.status !== 'Broneeritud' ? (
                    <Link
                      href={`/kontakt?pig=${encodeURIComponent(pig.name)}&id=${pig.id}${pig.code ? `&code=${encodeURIComponent(pig.code)}` : ''}&intent=broneering`}
                    >
                      <Button className="w-full bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 font-semibold shadow-md">
                        Broneeri
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 border border-gray-400 font-semibold cursor-not-allowed"
                    >
                      Broneeritud — ei saa broneerida
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
        </div>

        <div className="max-w-4xl mx-auto mb-12 text-center">
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
              <p className="font-semibold text-gray-900">2. Broneeri</p>
              <p className="text-sm md:text-base">Vajuta „Broneeri“ — saadame päringu. Elusloomad ei lähe ostukorvi.</p>
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

      </div>
    </section>
  )
}
