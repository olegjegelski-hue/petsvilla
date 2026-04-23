import { Metadata } from 'next'
import { CategoryCard } from '@/components/category-card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { CheckCircle } from 'lucide-react'

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
    title: 'Elustoit',
    slug: 'feed-for-reptiles',
    description: 'Kvaliteetne elustoit roomajatele ja kahepaiksetele',
    icon: '🦗',
    productCount: 3,
    gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50',
  },
  {
    id: '2',
    title: 'Roomajad ja Kahepaiksed',
    slug: 'reptiles-amphibians',
    description: 'Roomajad, kahepaiksed ja nende hooldus',
    icon: '🦎',
    productCount: 17,
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
  },
  {
    id: '3',
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            PetsVilla E-pood
          </h1>
          <p className="text-sm md:text-base font-semibold text-gray-600 max-w-2xl mx-auto">
            Avasta meie lai tootevalik...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} {...category} index={index} />
          ))}
        </div>

        <div className="mt-12">
          <div className="border border-[#D7CBBE] shadow-2xl bg-[#E3D8CB]/90 rounded-2xl p-8 md:p-10 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-3">
                🦜 Tule Papagoi Keskusesse!
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Tahad näha, kuidas meie loomad päriselt elavad? Otsid perele meeldejäävat ja hariduslikku elamust?
                <br />
                Külasta meie Papagoi Keskust, kus saad:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Vahetu kontakt: Toida ja suhtle meie sotsiaalsete papagoidega.',
                'Teadlik valik: Tutvu merisigade ja lindudega isiklikult enne ostuotsuse tegemist.',
                'Privaatkülastused: Broneeri rahulik aeg oma perele ja saa personaalset nõustamist.',
                'Täielik läbipaistvus: Näe oma silmaga meie professionaalset aretuskeskkonda.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white/90 rounded-xl p-4 shadow-md">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <a
                href="https://papagoi.ee"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white font-semibold border border-[#C8A93E]/80 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Broneeri külastus →
              </a>
            </div>
          </div>
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
