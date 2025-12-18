'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  categorySlug: string
  price: number
  imageUrl: string
  inStock: boolean
  index: number
  scientificName?: string
  code?: string
}

export function ProductCard({
  id,
  name,
  slug,
  categorySlug,
  price,
  imageUrl,
  inStock,
  index,
  scientificName,
  code,
}: ProductCardProps) {
  // Encode URL parameetreid tühikute jaoks
  const encodedCategory = encodeURIComponent(categorySlug)
  const encodedSlug = encodeURIComponent(slug)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <Link href={`/pood/${encodedCategory}/${encodedSlug}`}>
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <Image
              src={imageUrl || '/placeholder-guinea-pig.jpg'}
              alt={name}
              fill
              className="object-contain transition-transform group-hover:scale-105"
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-red-500 text-white">
                  Otsas
                </Badge>
              </div>
            )}
          </div>
        </Link>
        <CardContent className="p-4">
          <Link href={`/pood/${encodedCategory}/${encodedSlug}`}>
            <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
              {name}
            </h3>
            {scientificName && (
              <p className="text-sm italic mt-1 text-gray-600">{scientificName}</p>
            )}
          </Link>
          <div className="mt-2 flex items-center justify-between">
            {price > 0 ? (
              <span className="text-2xl font-bold text-emerald-700">{price.toFixed(2)} €</span>
            ) : (
              <span className="text-sm font-medium text-gray-800">Hind küsida</span>
            )}
            {code && (
              <span className="text-xs font-semibold text-gray-800">#{code}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            variant="default"
            size="lg"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
            asChild
          >
            <Link href={`/pood/${encodedCategory}/${encodedSlug}`} className="text-white">
              <Eye className="mr-2 h-4 w-4 text-white" />
              Vaata
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
