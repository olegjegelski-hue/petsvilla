
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import { Shield, Lock, Eye, Mail, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privaatsuspoliitika — PetsVilla OÜ',
  description: 'PetsVilla OÜ privaatsuspoliitika ja isikuandmete töötlemise põhimõtted.',
  keywords: ['privaatsus', 'isikuandmed', 'GDPR', 'andmekaitse'],
  alternates: {
    canonical: 'https://petsvilla.ee/privaatsuspoliitika',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivaatsuspoliitikаPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Shield className="w-12 h-12 text-orange-500" />
              Privaatsuspoliitika
            </h1>
            <p className="text-lg text-gray-600">
              Viimati uuendatud: 13. november 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-orange-500" />
                  1. Üldsätted
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Käesolev privaatsuspoliitika kehtib PetsVilla OÜ (registrikood: 14980686) veebilehe <strong>petsvilla.ee</strong> kasutamisel.
                  </p>
                  <p>
                    Me kogume ja töötleme teie isikuandmeid kooskõlas Euroopa Liidu üldise andmekaitsemääruse (GDPR) ja Eesti isikuandmete kaitse seadusega.
                  </p>
                  <div>
                    <p><strong>Vastutav töötleja:</strong></p>
                    <p>PetsVilla OÜ</p>
                    <p>Tartu mnt 80, Soinaste, 61709, Tartumaa</p>
                    <p>E-post: service@petsvilla.ee</p>
                    <p>Telefon: +372 512 7938</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-orange-500" />
                  2. Milliseid andmeid me kogume?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Me võime koguda järgmisi isikuandmeid:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Kontaktvormid:</strong> nimi, e-posti aadress, telefoninumber, sõnum</li>
                    <li><strong>Tellimused:</strong> nimi, telefon, e-post, tarne aadress, tellimuse detailid</li>
                    <li><strong>Automaatselt kogutavad andmed:</strong> IP-aadress, brauseri tüüp, külastusaeg, lehitsemise käitumine (Google Analytics)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-orange-500" />
                  3. Kuidas me kasutame teie andmeid?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Teie isikuandmeid kasutame järgmistel eesmärkidel:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Teie päringutele vastamiseks ja klienditeeninduse pakkumiseks</li>
                    <li>Tellimuste töötlemiseks ja tarneks</li>
                    <li>Veebilehe funktsionaalsuse tagamiseks</li>
                    <li>Statistika ja analüütika eesmärkidel (Google Analytics)</li>
                    <li>Õiguslike kohustuste täitmiseks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-orange-500" />
                  4. Andmete jagamine kolmandate osapooltega
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Me ei müü ega rendi teie isikuandmeid kolmandatele osapooltele. Võime jagada teie andmeid järgmiste teenusepakkujatega:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Notion:</strong> tellimuste ja päringute haldamiseks</li>
                    <li><strong>Google Analytics:</strong> veebilehe külastuste analüüsiks</li>
                    <li><strong>SmartPOST:</strong> tarne korraldamiseks (ainult vajalikud andmed)</li>
                    <li><strong>E-posti teenusepakkuja (Alfanet):</strong> e-kirjade saatmiseks</li>
                  </ul>
                  <p className="mt-4">
                    Kõik kolmandad osapooled on kohustatud järgima GDPR-i ja tagama teie andmete turvalisuse.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-orange-500" />
                  5. Kuidas me kaitseme teie andmeid?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Me kasutame mitmeid turvameetmeid teie andmete kaitsmiseks:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL-krüpteerimine (HTTPS)</li>
                    <li>Turvaline andmebaas (Postgres)</li>
                    <li>Ligipääsukontroll (ainult volitatud töötajad)</li>
                    <li>Regulaarsed turvauuendused</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  6. Teie õigused
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Teil on järgmised õigused:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Juurdepääsu õigus:</strong> saada koopia oma isikuandmetest</li>
                    <li><strong>Parandamise õigus:</strong> parandada ebaõigeid andmeid</li>
                    <li><strong>Kustutamise õigus:</strong> taotleda oma andmete kustutamist</li>
                    <li><strong>Töötlemise piiramise õigus:</strong> piirata andmete töötlemist</li>
                    <li><strong>Andmete ülekandmise õigus:</strong> saada oma andmed masintöödeldavas formaadis</li>
                    <li><strong>Vastuväite õigus:</strong> esitada vastuväiteid andmete töötlemisele</li>
                  </ul>
                  <p className="mt-4">
                    Oma õiguste kasutamiseks võtke meiega ühendust: <a href="mailto:service@petsvilla.ee" className="text-orange-600 hover:underline">service@petsvilla.ee</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Küpsised (Cookies)
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Meie veebileht kasutab küpsiseid veebilehe toimimise ja analüütika jaoks. Täpsem info küpsiste kohta on meie <a href="/kupsiste-teadaanne" className="text-orange-600 hover:underline">küpsiste teadaandes</a>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Muudatused privaatsuspoliitikas
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Me võime aeg-ajalt uuendada käesolevat privaatsuspoliitikat. Muudatustest teavitame teid veebilehel. Soovitame regulaarselt kontrollida seda lehte.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Kontakt
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Kui teil on küsimusi privaatsuspoliitika kohta, võtke meiega ühendust:
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg mt-4">
                    <p><strong>PetsVilla OÜ</strong></p>
                    <p>Tartu mnt 80, Soinaste, 61709, Tartumaa</p>
                    <p>E-post: <a href="mailto:service@petsvilla.ee" className="text-orange-600 hover:underline">service@petsvilla.ee</a></p>
                    <p>Telefon: <a href="tel:+3725127938" className="text-orange-600 hover:underline">+372 512 7938</a></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
