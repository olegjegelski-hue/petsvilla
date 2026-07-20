
'use client'

import { Heart, Bird, Wheat, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const paths = [
  {
    id: 'hein',
    title: 'Hein',
    description: 'Looduslikult kuivatatud hein. Smartpost tarne üle Eesti.',
    href: '/telli-hein',
    cta: 'Telli hein',
    icon: Wheat,
    image: '/hay-meadow.jpg',
    alt: 'PetsVilla heinamaa — looduslikult kuivatatud hein',
  },
  {
    id: 'merisead',
    title: 'Merisead',
    description: 'Dokumenteeritud päritoluga meriseabeebid otse aretajalt.',
    href: '/meriseabeebid',
    cta: 'Vaata saadaval loomi',
    icon: Heart,
    image: '/parent-babies.jpg',
    alt: 'PetsVilla meriseabeebid dokumenteeritud päritoluga',
  },
  {
    id: 'viirpapagoid',
    title: 'Viirpapagoid',
    description: 'Näitusekvaliteediga, inimestega harjunud viirpapagoid.',
    href: '/viirpapagoid',
    cta: 'Vaata saadaval linde',
    icon: Bird,
    image: '/budgies-aviary.jpg',
    alt: 'PetsVilla viirpapagoid aretusest',
  },
] as const

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-[520px] md:min-h-[600px] bg-gradient-to-br from-[#E3D8CB] to-[#C9BCAA]" />
    )
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E3D8CB] via-[#E8DFD3] to-[#D7CBBE]">
      <div className="absolute inset-0 opacity-25">
        <Image
          src="/parent-babies.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#E3D8CB]/80 via-[#E3D8CB]/70 to-background" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 pt-16 pb-14 md:pt-20 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
            <span className="font-[family-name:var(--font-poppins)] font-semibold tracking-[0.04rem] text-[#1F6A4C]">
              PetsVilla
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#2E3A32] max-w-2xl mx-auto font-medium mb-8">
            Hein · Merisead · Viirpapagoid — aretus, nõu ja tarne ühest kohast.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-green-900">
            Mida otsid?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {paths.map((path, index) => {
            const Icon = path.icon
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + index * 0.1 }}
              >
                <Link
                  href={path.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D7CBBE] bg-[#E3D8CB]/95 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-[#C8A93E]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6A4C]"
                >
                  <div className="relative h-40 md:h-44 overflow-hidden">
                    <Image
                      src={path.image}
                      alt={path.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-[#1F6A4C]/90 p-2.5 shadow-md">
                      <Icon className="h-5 w-5 text-white" aria-hidden />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6 text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-2">
                      {path.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#4F5A52] mb-5 flex-1 leading-relaxed">
                      {path.description}
                    </p>
                    <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] px-5 py-2.5 text-sm font-semibold text-white border border-[#C8A93E]/80 shadow-md transition-all group-hover:from-[#19563d] group-hover:to-[#B39133]">
                      {path.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
