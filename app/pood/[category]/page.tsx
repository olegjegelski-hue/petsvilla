import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { getProducts, SHOP_CATEGORIES } from '@/lib/products'
import { NOTION_REVALIDATE_SECONDS } from '@/lib/notion'

export const revalidate = NOTION_REVALIDATE_SECONDS

export function generateStaticParams() {
  return Object.keys(SHOP_CATEGORIES).map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: raw } = await params
  const decoded = decodeURIComponent(raw)
  const category = SHOP_CATEGORIES[decoded]
  if (!category) {
    return { title: 'Kategooria' }
  }
  return {
    title: `${category.title} | E-pood`,
    description: category.description,
    alternates: {
      canonical: `https://petsvilla.ee/pood/${decoded}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: raw } = await params
  const decodedCategory = decodeURIComponent(raw)
  const category = SHOP_CATEGORIES[decodedCategory]

  if (!category) {
    notFound()
  }

  const products = await getProducts(category.notionCategory)

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
                <p className="text-sm md:text-base font-semibold text-gray-600 mt-2">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-green-900 mb-4">
                Tooteid lisatakse peagi
              </h2>
              <p className="text-gray-600 mb-8">
                Selle kategooria tooted on lisamisel. Võta meiega ühendust, et saada rohkem
                infot!
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
