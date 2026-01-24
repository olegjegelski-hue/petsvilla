'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ShoppingCart, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Script from 'next/script'

interface Product {
  id: string
  code: string
  genus: string
  species: string
  commonName: string
  scientificName: string
  category: string
  status: string
  price: number
  availability: string
  image: string
  slug: string
}

interface ProductDetailPageProps {
  categorySlug: string
  productSlug: string
  categoryTitle: string
  categoryIcon: string
  notionCategory: string
}

export function ProductDetailPage({
  categorySlug,
  productSlug,
  categoryTitle,
  categoryIcon,
  notionCategory,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(notionCategory)}`)
        const data = await response.json()

        if (data.error) {
          setError(data.message || 'Toote laadimine ebaõnnestus')
          return
        }

        const foundProduct = data.products?.find((p: Product) => p.slug === productSlug)
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          setError('Toodet ei leitud')
        }
      } catch (err) {
        console.error('Viga toote laadimisel:', err)
        setError('Toote laadimine ebaõnnestus')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [notionCategory, productSlug])

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 py-16">
            <Link
              href={`/pood/${categorySlug}`}
              className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Tagasi kategooriasse
            </Link>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {error || 'Toodet ei leitud'}
              </h2>
              <p className="text-gray-600 mb-8">
                Palun kontrolli URL-i või mine tagasi kategooriasse.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const isInStock = product.status === 'Aktiivne'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://petsvilla.ee')
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.commonName,
    description: product.scientificName ? `${product.commonName} (${product.scientificName})` : product.commonName,
    sku: product.code || undefined,
    category: categoryTitle,
    image: `${baseUrl}/api/product-image/${product.id}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price > 0 ? product.price.toFixed(2) : undefined,
      availability: isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/pood" className="hover:text-green-700 transition-colors">
              Pood
            </Link>
            <span>/</span>
            <Link href={`/pood/${categorySlug}`} className="hover:text-green-700 transition-colors">
              {categoryTitle}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.commonName}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Toote pilt */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                <Image
                  src={`/api/product-image/${product.id}`}
                  alt={product.commonName}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Info ühel real */}
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

            {/* Toote info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.commonName}
                </h1>

                {(product.genus || product.species) && (
                  <p className="text-base text-gray-600 italic mb-4">
                    {product.genus} {product.species}
                  </p>
                )}
              </div>

              {/* Hind */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
                {product.price > 0 ? (
                  <span className="text-4xl font-bold text-green-700">
                    {product.price.toFixed(2)} €
                  </span>
                ) : (
                  <span className="text-2xl font-semibold text-gray-700">
                    Hind küsida
                  </span>
                )}
              </div>

              {/* Tegevusnupud */}
              <div className="space-y-3">
                <Link
                  href={`/kontakt?product=${encodeURIComponent(product.commonName)}&id=${product.id}&code=${encodeURIComponent(product.code || '')}`}
                  className="block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                    disabled={!isInStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isInStock ? 'Telli kohe' : 'Küsi saabumist'}
                  </Button>
                </Link>

                <Link
                  href={`/kontakt?product=${encodeURIComponent(product.commonName)}&id=${product.id}&code=${encodeURIComponent(product.code || '')}`}
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-lg py-6 border-2"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Küsi lisainfot
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Tagasi link */}
          <div className="mt-12">
            <Link
              href={`/pood/${categorySlug}`}
              className="inline-flex items-center text-green-700 hover:text-green-800 font-medium"
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
