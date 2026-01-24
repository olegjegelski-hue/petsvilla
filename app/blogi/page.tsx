
import { Navigation } from '@/components/navigation'
import { BlogList } from '@/components/blog-list'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Blogi - Lemmikloomade Hooldus ja Nõuanded',
  description: 'Loe huvitavaid artikleid meriseade, viirpapagoide hoolduse, toitmise ja tervise kohta. PetsVilla ekspertide nõuanded lemmikloomade omanikele.',
  keywords: ['lemmikloomade blogi', 'merisead hooldus', 'viirpapagoid toitmine', 'loomade tervis', 'lemmikloomade nõuanded', 'guinea pig care', 'budgie care'],
  alternates: {
    canonical: 'https://petsvilla.ee/blogi',
  },
  openGraph: {
    title: 'Blogi - PetsVilla OÜ',
    description: 'Huvitavad artiklid lemmikloomade hoolduse kohta',
    url: 'https://petsvilla.ee/blogi',
    images: ['/og-image.png'],
  },
}

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PetsVilla Blogi',
    description: 'Artiklid lemmikloomade hoolduse, toitmise ja tervise kohta. Ekspertide nõuanded meriseade ja viirpapagoide omanikele.',
    url: 'https://petsvilla.ee/blogi',
    publisher: {
      '@type': 'Organization',
      name: 'PetsVilla OÜ',
      logo: {
        '@type': 'ImageObject',
        url: 'https://upload.wikimedia.org/wikipedia/en/0/09/Wellness_Pet_Company_Logo_2022.png',
      },
    },
    inLanguage: 'et-EE',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Avaleht',
        item: 'https://petsvilla.ee',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogi',
        item: 'https://petsvilla.ee/blogi',
      },
    ],
  }

  return (
    <>
      <Script
        id="json-ld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        <Navigation />
        <BlogList />
        <Footer />
      </div>
    </>
  )
}
