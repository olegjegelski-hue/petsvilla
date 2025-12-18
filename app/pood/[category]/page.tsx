'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CategoryPageProps {
  params: {
    category: string
  }
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
  'BIRDS': {
    title: 'Papagoid',
    description: 'Erinevad linnuliigid - papagoid, kakaduud, ja muud eksootilised linnud',
    icon: '🦜',
  },
  'FEED FOR REPTILES': {
    title: 'Elustoit',
    description: 'Kvaliteetne elustoit roomajatele ja kahepaiksetele',
    icon: '🦗',
  },
  'REPTILES & AMPHIBIANS': {
    title: 'Roomajad ja Kahepaiksed',
    description: 'Roomajad, kahepaiksed ja nende hooldus',
    icon: '🦎',
  },
  'PLANTS': {
    title: 'Akvaariumi Taimed',
    description: 'Elavad akvaariumi taimed - ilu ja tervisliku keskkonna loomiseks',
    icon: '🌿',
  },
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // URL-decode kategooria nime (tühikute käsitlemiseks)
  const decodedCategory = decodeURIComponent(params.category)
  const category = categoryData[decodedCategory]

  useEffect(() => {
    async function fetchProducts() {
      if (!category) {
        setLoading(false)
        return
      }

      try {
        // Kasutame decodeeritud kategooriat API päringus
        const response = await fetch(`/api/products?category=${encodeURIComponent(decodedCategory)}`)
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

  if (!category) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-16">
        <Link
          href="/pood"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Tagasi kategooriatele
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {category.title}
              </h1>
              <p className="text-xl text-gray-600 mt-2">{category.description}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Viga toodete laadimisel
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Proovi uuesti
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tooteid lisatakse peagi
            </h2>
            <p className="text-gray-600 mb-8">
              Selle kategooria tooted on lisamisel. Võta meiega ühendust, et saada rohkem infot!
            </p>
            <Link
              href="/kontakt"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
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
