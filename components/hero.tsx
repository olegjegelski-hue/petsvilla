import { Heart, Bird, Wheat, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const paths = [
  {
    id: 'hein',
    title: 'Hein',
    description: 'Looduslikult kuivatatud hein. Smartpost tarne üle Eesti.',
    href: '/telli-hein',
    cta: 'Telli hein',
    icon: Wheat,
    image: '/hero-hay.webp',
    alt: 'PetsVilla heinamaa — looduslikult kuivatatud hein',
  },
  {
    id: 'merisead',
    title: 'Merisead',
    description: 'Dokumenteeritud päritoluga meriseabeebid otse aretajalt.',
    href: '/meriseabeebid',
    cta: 'Vaata saadaval loomi',
    icon: Heart,
    image: '/hero-lcp.webp',
    alt: 'PetsVilla meriseabeebid dokumenteeritud päritoluga',
  },
  {
    id: 'viirpapagoid',
    title: 'Viirpapagoid',
    description: 'Näitusekvaliteediga, inimestega harjunud viirpapagoid.',
    href: '/viirpapagoid',
    cta: 'Vaata saadaval linde',
    icon: Bird,
    image: '/hero-budgies.jpg',
    alt: 'PetsVilla viirpapagoid aretusest',
  },
] as const

/**
 * Server Component.
 * Esimene viewport = bränd + tekst (LCP); kaardipildid allpool foldi → kiirem LCP.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E3D8CB] via-[#E8DFD3] to-[#D7CBBE]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        <div className="flex min-h-[100svh] flex-col items-center justify-center pt-16 pb-10 text-center md:min-h-[65vh] md:pt-20">
          <h1 className="page-title mb-4">
            <span className="font-semibold tracking-[0.04rem] text-[#1F6A4C]">
              PetsVilla
            </span>
          </h1>
          <p className="page-lead mb-6 !font-medium text-[#2E3A32] sm:text-lg">
            Hein · Merisead · Viirpapagoid — aretus, nõu ja tarne ühest kohast.
          </p>
          <h2 className="section-title">Mida otsid?</h2>
          <p className="mt-3 text-sm font-medium text-[#4F5A52]">
            Vali allpool üks kolmest suunast
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 pb-14 md:grid-cols-3 md:gap-6 md:pb-16">
          {paths.map((path) => {
            const Icon = path.icon
            return (
              <Link
                key={path.id}
                href={path.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D7CBBE] bg-[#E3D8CB]/95 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-[#C8A93E]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6A4C]"
              >
                <div className="relative h-40 overflow-hidden bg-[#D7CBBE] md:h-44">
                  <Image
                    src={path.image}
                    alt={path.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={65}
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-[#1F6A4C]/90 p-2.5 shadow-md">
                    <Icon className="h-5 w-5 text-white" aria-hidden />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 text-left md:p-6">
                  <h3 className="mb-2 text-xl font-bold text-green-900 md:text-2xl">
                    {path.title}
                  </h3>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-[#4F5A52] md:text-base">
                    {path.description}
                  </p>
                  <span className="inline-flex items-center justify-center rounded-full border border-[#C8A93E]/80 bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all group-hover:from-[#19563d] group-hover:to-[#B39133]">
                    {path.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
