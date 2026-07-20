'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, MessageSquare, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Script from 'next/script'
import type { ShopProduct } from '@/lib/types'

interface ProductDetailPageProps {
  categorySlug: string
  productSlug: string
  categoryTitle: string
  categoryIcon: string
  product: ShopProduct
}

export function ProductDetailPage({
  categorySlug,
  productSlug,
  categoryTitle,
  product,
}: ProductDetailPageProps) {
  const isInStock = product.status === 'Aktiivne'
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://petsvilla.ee')
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.commonName,
    description: product.scientificName
      ? `${product.commonName} (${product.scientificName})`
      : product.commonName,
    sku: product.code || undefined,
    category: categoryTitle,
    image: `${baseUrl}/api/product-image/${product.id}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price > 0 ? product.price.toFixed(2) : '0.00',
      availability: isInStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/pood/${categorySlug}/${productSlug}`,
    },
    brand: {
      '@type': 'Brand',
      name: 'PetsVilla OÜ',
    },
  }

  return (
    <>
      <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/pood" className="hover:text-green-800 transition-colors">
              Pood
            </Link>
            <span>/</span>
            <Link
              href={`/pood/${categorySlug}`}
              className="hover:text-green-800 transition-colors"
            >
              {categoryTitle}
            </Link>
            <span>/</span>
            <span className="text-green-900 font-medium">{product.commonName}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square bg-[#E1D6C8] rounded-xl overflow-hidden border border-[#D0C3B4]">
                <Image
                  src={`/api/product-image/${product.id}`}
                  alt={product.commonName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {product.code && (
                  <div>
                    <strong>Kood:</strong> {product.code}
                  </div>
                )}
                {product.availability && (
                  <div>
                    <strong>Saadavus:</strong> {product.availability}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
                  {product.commonName}
                </h1>

                {(product.genus || product.species) && (
                  <p className="text-base text-gray-600 italic mb-4">
                    {product.genus} {product.species}
                  </p>
                )}
              </div>

              <div className="bg-[#E3D8CB]/90 border border-[#D7CBBE] rounded-xl p-6 text-center">
                {product.price > 0 ? (
                  <span className="text-4xl font-bold text-green-900">
                    {product.price.toFixed(2)} €
                  </span>
                ) : (
                  <span className="text-2xl font-semibold text-gray-700">Hind küsida</span>
                )}
              </div>

              <div className="space-y-3">
                <Link
                  href={`/kontakt?product=${encodeURIComponent(product.commonName)}&id=${product.id}&code=${encodeURIComponent(product.code || '')}`}
                  className="block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                    disabled={!isInStock}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {isInStock ? 'Saada päring' : 'Küsi saabumist'}
                  </Button>
                </Link>

                <Link
                  href={`/kontakt?product=${encodeURIComponent(product.commonName)}&id=${product.id}&code=${encodeURIComponent(product.code || '')}`}
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-lg py-6 border-2 border-[#D7CBBE] text-green-900 bg-[#E3D8CB] hover:bg-[#DCCFBE]"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Küsi lisainfot
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href={`/pood/${categorySlug}`}
              className="inline-flex items-center text-green-900 hover:text-green-800 font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Tagasi kategooriasse: {categoryTitle}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
