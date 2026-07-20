import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductDetailPage } from '@/components/product-detail-page'
import {
  getProductBySlug,
  getAllShopStaticParams,
  SHOP_CATEGORIES,
} from '@/lib/products'

/** ISR — peab olema literaal (Next.js ei luba importitud konstanti). */
export const revalidate = 120

export async function generateStaticParams() {
  try {
    return await getAllShopStaticParams()
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const resolved = await params
  const decodedCat = decodeURIComponent(resolved.category)
  const decodedSlug = decodeURIComponent(resolved.slug)
  const category = SHOP_CATEGORIES[decodedCat]
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://petsvilla.ee'
  const canonical = `${baseUrl}/pood/${decodedCat}/${decodedSlug}`

  if (!category) {
    return { title: decodedSlug.replace(/-/g, ' ') }
  }

  const product = await getProductBySlug(category.notionCategory, decodedSlug)
  const productTitle = product?.commonName || decodedSlug.replace(/-/g, ' ')
  const description = product
    ? `Tutvu tootega "${product.commonName}" PetsVilla E-poes.${
        product.scientificName ? ` ${product.scientificName}.` : ''
      }`
    : `Tutvu tootega "${productTitle}" PetsVilla E-poes.`

  return {
    title: productTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: productTitle,
      description,
      url: canonical,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const resolved = await params
  const decodedCat = decodeURIComponent(resolved.category)
  const decodedSlug = decodeURIComponent(resolved.slug)
  const category = SHOP_CATEGORIES[decodedCat]

  if (!category) {
    notFound()
  }

  const product = await getProductBySlug(category.notionCategory, decodedSlug)
  if (!product) {
    notFound()
  }

  return (
    <ProductDetailPage
      categorySlug={decodedCat}
      productSlug={decodedSlug}
      categoryTitle={category.title}
      categoryIcon={category.icon}
      product={product}
    />
  )
}
