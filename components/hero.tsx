
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight">
            <span className="font-[family-name:var(--font-poppins)] font-semibold tracking-[0.05rem] text-[#1F6A4C] block whitespace-nowrap">
              PetsVilla - hoitud lemmikud teie perele
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[#2E3A32] mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Kasvatus, nõu ja varustus ühest kohast. Meie kodust teie koju!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <Link href="/merisead">
            <Button size="lg" variant="outline" className="border-2 border-[#C8A93E] text-[#1F6A4C] bg-white/60 hover:bg-[#C8A93E]/15 hover:text-[#1F6A4C] px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Heart className="w-5 h-5 mr-2" />
              Merisead
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/viirpapagoid">
            <Button size="lg" className="bg-[#2F7A5B] hover:bg-[#25674D] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Bird className="w-5 h-5 mr-2" />
              Papagoid
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/hein">
            <Button size="lg" variant="outline" className="border-2 border-[#C8A93E] text-[#1F6A4C] bg-white/60 hover:bg-[#C8A93E]/15 hover:text-[#1F6A4C] px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
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
          className="text-base font-semibold text-[#2E3A32]/80"
        >
          <p>Professionaalne hooldus • Usaldusväärne teenindus</p>
          <p>Armastus loomade vastu</p>
        </motion.div>
      </div>
    </section>
  )
}
