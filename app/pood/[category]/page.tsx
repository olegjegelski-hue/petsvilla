'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

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

const categoryData: Record<string, any> = {
  birds: {
    title: 'Papagoid',
    description: 'Erinevad linnuliigid - papagoid, kakaduud, ja muud eksootilised linnud',
    icon: '🦜',
    notionCategory: 'BIRDS',
  },
  'feed-for-reptiles': {
    title: 'Elustoit',
    description: 'Kvaliteetne elustoit roomajatele ja kahepaiksetele',
    icon: '🦗',
    notionCategory: 'FEED FOR REPTILES',
  },
  'reptiles-amphibians': {
    title: 'Roomajad ja Kahepaiksed',
    description: 'Roomajad, kahepaiksed ja nende hooldus',
    icon: '🦎',
    notionCategory: 'REPTILES & AMPHIBIANS',
  },
  plants: {
    title: 'Akvaariumi Taimed',
    description: 'Elavad akvaariumi taimed - ilu ja tervisliku keskkonna loomiseks',
    icon: '🌿',
    notionCategory: 'PLANTS',
  },
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<any>(null)
  const [decodedCategory, setDecodedCategory] = useState<string>('')
  const [paramsReady, setParamsReady] = useState(false)

  useEffect(() => {
    async function initParams() {
      const resolvedParams = await params
      const decodedCat = decodeURIComponent(resolvedParams.category)
      setDecodedCategory(decodedCat)
      setCategory(categoryData[decodedCat])
      setParamsReady(true)
    }
    initParams()
  }, [params])

  useEffect(() => {
    async function fetchProducts() {
      if (!category) {
        setLoading(false)
        return
      }

      try {
        // Kasutame decodeeritud kategooriat API päringus
        const response = await fetch(`/api/products?category=${encodeURIComponent(category.notionCategory)}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.message || 'Toodete laadimine ebaõnnestus')
        } else {
          setProducts(data.products || [])
        }
      } catch (err) {
        console.error('Viga toodete laadimisel:', err)
        setError('Toodete laadimine ebaõnnestus')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [decodedCategory, category])

  if (!paramsReady) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-900" />
        </div>
        <Footer />
      </>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
        <Link
          href="/pood"
          className="inline-flex items-center text-green-900 hover:text-green-800 mb-8 font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Tagasi kategooriatele
        </Link>

        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-green-900">
                {category.title}
              </h1>
              <p className="text-sm md:text-base font-semibold text-gray-600 mt-2">{category.description}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Viga toodete laadimisel
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white font-semibold border border-[#C8A93E]/80 px-8 py-3 rounded-lg transition-colors"
            >
              Proovi uuesti
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Tooteid lisatakse peagi
            </h2>
            <p className="text-gray-600 mb-8">
              Selle kategooria tooted on lisamisel. Võta meiega ühendust, et saada rohkem infot!
            </p>
            <Link
              href="/kontakt"
              className="inline-block bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white font-semibold border border-[#C8A93E]/80 px-8 py-3 rounded-lg transition-colors"
            >
              Võta ühendust
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.commonName}
                slug={product.slug}
                categorySlug={decodedCategory}
                price={product.price || 0}
                imageUrl={`/api/product-image/${product.id}`}
                inStock={product.status === 'Aktiivne'}
                scientificName={product.scientificName}
                code={product.code}
                index={index}
              />
            ))}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  )
}
