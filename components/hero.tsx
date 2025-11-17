
'use client'

import { Button } from '@/components/ui/button'
import { Heart, Bird, Wheat, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[600px] bg-gradient-to-r from-orange-100 to-green-100" />
  }

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-orange-100 to-green-100">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('https://cdn.abacus.ai/images/f5e50a94-2f96-4763-87cf-6f169e387d9a.png')",
          filter: "blur(1px)"
        }}
      />
      <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight">
            <span className="font-[family-name:var(--font-poppins)] font-semibold tracking-[0.075rem] text-[#222222] block">
              <span className="text-orange-500">Pets</span>
              <span className="text-green-600">Villa</span>
              <span className="font-normal text-[90%] text-[#6B7280]"> — karvased sõbrad, sulelised lauljad ja kvaliteetne hein</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Kasvatus, nõu ja varustus ühest kohast. Meie kodust teie koju!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <Link href="/meriseabeebid">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Heart className="w-5 h-5 mr-2" />
              Meriseabeebid
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/viirpapagoid">
            <Button size="lg" variant="outline" className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Bird className="w-5 h-5 mr-2" />
              Viirpapagoid
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/hein">
            <Button size="lg" variant="outline" className="border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Wheat className="w-5 h-5 mr-2" />
              Kvaliteetne Hein
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm text-gray-600"
        >
          Professionaalne hooldus • Armastus loomade vastu • Usaldusväärne teenindus
        </motion.div>
      </div>
    </section>
  )
}
