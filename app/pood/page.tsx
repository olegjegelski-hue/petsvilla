import { Metadata } from 'next'
import { CategoryCard } from '@/components/category-card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pood - PetsVilla',
  description: 'Avasta meie laia tootevalikut - papagoid, elustoit, lemmikloomatoit ja akvaariumi taimed.',
  openGraph: {
    title: 'PetsVilla Pood',
    description: 'Kõik lemmikloomade tarbeks ühest kohast',
    images: ['/og-image.png'],
  },
}

const categories = [
  {
    id: '1',
    title: 'Papagoid',
    slug: 'birds',
    description: 'Erinevad linnuliigid - papagoid, kakaduud, ja muud eksootilised linnud',
    icon: '🦜',
    productCount: 4,
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
  },
  {
    id: '2',
    title: 'Elustoit',
    slug: 'feed-for-reptiles',
    description: 'Kvaliteetne elustoit roomajatele ja kahepaiksetele',
    icon: '🦗',
    productCount: 3,
    gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50',
  },
  {
    id: '3',
    title: 'Roomajad ja Kahepaiksed',
    slug: 'reptiles-amphibians',
    description: 'Roomajad, kahepaiksed ja nende hooldus',
    icon: '🦎',
    productCount: 17,
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
  },
  {
    id: '4',
    title: 'Akvaariumi Taimed',
    slug: 'plants',
    description: 'Elavad akvaariumi taimed - ilu ja tervisliku keskkonna loomiseks',
    icon: '🌿',
    productCount: 1,
    gradient: 'bg-gradient-to-br from-teal-50 to-cyan-50',
  },
]

export default function PoodPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-green-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PetsVilla Pood
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Avasta meie laia tootevaliku - kõik lemmikloomade tarbeks ühest kohast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} {...category} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kas ei leidnud, mida otsisid?
            </h2>
            <p className="text-gray-700 mb-6">
              Võta meiega ühendust ja aitame leida just selle, mida sinu lemmikloom vajab!
            </p>
            <a
              href="/kontakt"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Võta ühendust
            </a>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}
