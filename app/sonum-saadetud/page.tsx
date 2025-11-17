
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Home, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Sõnum saadetud | PetsVilla',
  description: 'Teie sõnum on edukalt saadetud. Võtame teiega peagi ühendust.',
  robots: 'noindex, nofollow'
}

export default function MessageSentPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <CheckCircle className="relative w-24 h-24 text-green-500" strokeWidth={1.5} />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                Aitäh sõnumi eest!
              </h1>
              
              <p className="text-lg text-center text-gray-600 mb-8">
                Teie sõnum on edukalt saadetud. Võtame teiega <strong>peagi ühendust</strong>.
              </p>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="w-6 h-6 text-blue-500 mr-2" />
                  Mis edasi?
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm">
                      1
                    </div>
                    <p className="text-gray-700 pt-1">
                      Oleme saanud teie sõnumi ja vaatame selle läbi <strong>esimesel võimalusel</strong>
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm">
                      2
                    </div>
                    <p className="text-gray-700 pt-1">
                      Võtame teiega ühendust <strong>24 tunni jooksul</strong> (tööpäevadel)
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm">
                      3
                    </div>
                    <p className="text-gray-700 pt-1">
                      Vastame teie küsimustele ja aitame leida <strong>kõige sobivama lahenduse</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Kontaktandmed:</h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    📧 E-post: <a href="mailto:service@petsvilla.ee" className="text-orange-600 hover:text-orange-700 font-medium">service@petsvilla.ee</a>
                  </p>
                  <p>
                    📞 Telefon: <a href="tel:+3725127938" className="text-orange-600 hover:text-orange-700 font-medium">+372 512 7938</a>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                >
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Avalehele
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                >
                  <Link href="/kontakt">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Saada uus sõnum
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
