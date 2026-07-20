import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryCard } from '@/components/category-card'
import { SHOP_CATEGORY_CARDS } from '@/lib/products'

/**
 * Diskreetne e-poe kategooriate plokk (PetsVilla tarbekaubad / Petra Aqua).
 * Ei sega 3 peamist fookust (hein · merisead · viirpapagoid).
 */
export function ShopCategoriesSection() {
  return (
    <section
      className="py-14 md:py-20 border-t border-[#D7CBBE]/80 bg-gradient-to-b from-background to-[#E8DFD3]/40"
      aria-labelledby="shop-categories-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 id="shop-categories-heading" className="section-title mb-3">
            E-pood
          </h2>
          <p className="page-lead">
            Petra Aqua tarbekaubad — elustoit, roomajad, taimed ja linnud. Praegu
            kataloog ja päring (mitte ostukorv).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {SHOP_CATEGORY_CARDS.map((category, index) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              slug={category.slug}
              icon={category.icon}
              index={index}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pood"
            className="inline-flex items-center gap-2 font-semibold text-[#1F6A4C] hover:text-green-900 underline-offset-4 hover:underline"
          >
            Kõik e-poe kategooriad
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
