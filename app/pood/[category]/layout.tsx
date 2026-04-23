import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const categoryMeta: Record<string, { title: string; description: string }> = {
  birds: {
    title: 'Papagoid - PetsVilla E-pood',
    description: 'Papagoid ja lindude tooted PetsVilla E-poes.',
  },
  'feed-for-reptiles': {
    title: 'Elustoit - PetsVilla E-pood',
    description: 'Kvaliteetne elustoit roomajatele ja kahepaiksetele.',
  },
  'reptiles-amphibians': {
    title: 'Roomajad ja Kahepaiksed - PetsVilla E-pood',
    description: 'Roomajad, kahepaiksed ja nendega seotud tooted PetsVilla E-poes.',
  },
  plants: {
    title: 'Akvaariumi Taimed - PetsVilla E-pood',
    description: 'Elavad akvaariumi taimed PetsVilla E-poes.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'https://petsvilla.ee'

  const meta = categoryMeta[decodedCategory] ?? {
    title: 'Kategooria - PetsVilla E-pood',
    description: 'Tutvu kategooria toodetega PetsVilla E-poes.',
  }

  const canonical = `${baseUrl}/pood/${decodedCategory}`

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/og-image.png'],
    },
  }
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return children
}
