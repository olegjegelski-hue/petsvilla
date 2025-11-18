
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Home, Package } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tellimus kinnitatud | PetsVilla',
  description: 'Teie heinatellimus on edukalt vastu võetud',
}

export default function TellimusKinnitatudPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Thank You Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aitäh tellimuse eest!
            </h1>
            
            <p className="text-lg text-gray-700 mb-8">
              Teie heinatellimus on edukalt vastu võetud.
            </p>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Mis edasi?
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Võtame teiega ühendust <strong>24 tunni jooksul</strong> tellimuse kinnitamiseks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Saadame teile makseinfo ja täpsustame tarne detailid</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Hein jõuab teie valitud Smartpost pakiautomaati 2-5 tööpäeva jooksul</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Küsimused?</h3>
              <p className="text-gray-700 text-sm mb-2">
                Kui teil on küsimusi, võtke julgesti ühendust:
              </p>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">
                  📧 Email: <a href="mailto:service@petsvilla.ee" className="text-orange-600 hover:underline">service@petsvilla.ee</a>
                </p>
                <p className="text-gray-600">
                  📱 Telefon: <a href="tel:+3725127938" className="text-orange-600 hover:underline">+372 512 7938</a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Avalehele
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link href="/hein" className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Tagasi heina lehele
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Tellimuse number ja täpsem info saadetakse teile peagi e-posti teel
        </p>
      </main>

      <Footer />
    </div>
  )
}
