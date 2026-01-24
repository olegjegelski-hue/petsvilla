import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductDetailPage } from '@/components/product-detail-page'

const categoryData: Record<string, { title: string; icon: string; notionCategory: string }> = {
  birds: {
    title: 'Papagoid',
    icon: '🦜',
    notionCategory: 'BIRDS',
  },
  'feed-for-reptiles': {
    title: 'Elustoit',
    icon: '🦗',
    notionCategory: 'FEED FOR REPTILES',
  },
  'reptiles-amphibians': {
    title: 'Roomajad ja Kahepaiksed',
    icon: '🦎',
    notionCategory: 'REPTILES & AMPHIBIANS',
  },
  plants: {
    title: 'Akvaariumi Taimed',
    icon: '🌿',
    notionCategory: 'PLANTS',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const resolved = await params
  const decodedCat = decodeURIComponent(resolved.category)
  const decodedSlug = decodeURIComponent(resolved.slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'https://petsvilla.ee'

  return {
    title: decodedSlug.replace(/-/g, ' '),
    alternates: {
      canonical: `${baseUrl}/pood/${decodedCat}/${decodedSlug}`,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const resolved = await params
  const decodedCat = decodeURIComponent(resolved.category)
  const decodedSlug = decodeURIComponent(resolved.slug)
  const category = categoryData[decodedCat]

  if (!category) {
    notFound()
  }

  return (
    <ProductDetailPage
      categorySlug={decodedCat}
      productSlug={decodedSlug}
      categoryTitle={category.title}
      categoryIcon={category.icon}
      notionCategory={category.notionCategory}
    />
  )
}
