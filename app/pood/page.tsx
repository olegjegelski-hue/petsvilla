import { Metadata } from 'next'
import { CategoryCard } from '@/components/category-card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SHOP_CATEGORY_CARDS } from '@/lib/products'

export const metadata: Metadata = {
  title: {
    absolute: 'PetsVilla E-pood - Hein, elustoit ja lemmikloomatarbed',
  },
  description:
    'Avasta PetsVilla e-pood! Papagoid, elustoit roomajatele, roomajad/kahepaiksed ja akvaariumitaimed. Kataloog ja päring — tarne üle Eesti.',
  alternates: {
    canonical: 'https://petsvilla.ee/pood',
  },
  openGraph: {
    title: 'PetsVilla E-pood - Hein, elustoit ja lemmikloomatarbed',
    description:
      'Avasta PetsVilla e-pood! Papagoid, elustoit roomajatele, roomajad/kahepaiksed ja akvaariumitaimed.',
    url: 'https://petsvilla.ee/pood',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetsVilla E-pood - Hein, elustoit ja lemmikloomatarbed',
    description:
      'Avasta PetsVilla e-pood! Papagoid, elustoit, roomajad ja akvaariumitaimed.',
    images: ['/og-image.png'],
  },
}

export default function PoodPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="page-title mb-4">PetsVilla E-pood</h1>
            <p className="page-lead">
              Petra Aqua kataloog: papagoid, elustoit, roomajad ja akvaariumitaimed.
              Tooted on päringupõhised — saada päring kontaktilehel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div className="mt-16 text-center">
            <div className="rounded-xl border border-[#D7CBBE] bg-[#E3D8CB]/90 p-8 max-w-3xl mx-auto shadow-md">
              <h2 className="section-title mb-4">Kas ei leidnud, mida otsisid?</h2>
              <p className="text-gray-700 mb-6">
                Võta meiega ühendust ja aitame leida just selle, mida sinu lemmikloom
                vajab!
              </p>
              <a
                href="/kontakt"
                className="inline-block bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white font-semibold border border-[#C8A93E]/80 px-8 py-3 rounded-lg transition-colors"
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
