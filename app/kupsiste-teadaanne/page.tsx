
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import { Cookie, Settings, BarChart, Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Küpsiste teadaanne — PetsVilla OÜ',
  description: 'PetsVilla OÜ küpsiste kasutamise põhimõtted ja seaded.',
  keywords: ['küpsised', 'cookies', 'veebilehe analüütika', 'Google Analytics'],
  alternates: {
    canonical: 'https://petsvilla.ee/kupsiste-teadaanne',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function KupsistePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Cookie className="w-12 h-12 text-orange-500" />
              Küpsiste teadaanne
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Mis on küpsised?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Küpsised (cookies) on väikesed tekstifailid, mida veebileht salvestab teie seadmesse (arvuti, telefon, tahvelarvuti) kui külastate veebilehte. Küpsised aitavad veebilehel:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Meeles pidada teie eelistusi</li>
                    <li>Parandada kasutajakogemust</li>
                    <li>Koguda statistikat külastuste kohta</li>
                    <li>Analüüsida veebilehe toimimist</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-orange-500" />
                  2. Milliseid küpsiseid me kasutame?
                </h2>
                <div className="space-y-6 text-gray-700">
                  {/* Essential Cookies */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      2.1 Vajalikud küpsised
                    </h3>
                    <p>
                      Need küpsised on veebilehe toimimiseks hädavajalikud. Ilma nendeta ei saa veebileht korralikult toimida.
                    </p>
                    <div className="mt-4 bg-green-50 p-4 rounded-lg">
                      <p><strong>Näited:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li>Sessiooni küpsised</li>
                        <li>Turvalisuse küpsised</li>
                        <li>Keele valik</li>
                      </ul>
                      <p className="mt-2"><strong>Säilitusaeg:</strong> Sessiooni lõppemiseni või kuni 12 kuud</p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-blue-500" />
                      2.2 Analüütika küpsised
                    </h3>
                    <p>
                      Me kasutame Google Analytics'i, et mõista, kuidas külastajad meie veebilehte kasutavad. See aitab meil parandada veebilehe kvaliteeti.
                    </p>
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                      <p><strong>Google Analytics küpsised:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li><strong>_ga:</strong> Eristab kasutajaid (säilitusaeg: 2 aastat)</li>
                        <li><strong>_ga_*:</strong> Säilitab sessiooni olekut (säilitusaeg: 2 aastat)</li>
                        <li><strong>_gid:</strong> Eristab kasutajaid (säilitusaeg: 24 tundi)</li>
                      </ul>
                      <p className="mt-4">
                        <strong>Kogutud info:</strong> IP-aadress (anonüümitud), brauseri tüüp, külastuse kestus, külastatud lehed, geograafiline asukoht (riik/linn)
                      </p>
                      <p className="mt-2">
                        <strong>Lisainfo:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  3. Kuidas hallata küpsiseid?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Saate igal ajal küpsiseid hallata või keelata oma brauseri seadetes. Palun arvestage, et küpsiste keelamine võib mõjutada veebilehe toimimist.
                  </p>
                  
                  <div className="space-y-3 mt-6">
                    <h3 className="font-semibold">Küpsiste haldamine erinevates brauserites:</h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>Google Chrome:</strong> Seaded → Privaatsus ja turvalisus → Küpsised ja muud saidiaadmhed
                        <br />
                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-sm">
                          Juhend →
                        </a>
                      </li>
                      <li>
                        <strong>Mozilla Firefox:</strong> Seaded → Privaatsus ja turvalisus → Küpsised ja saidi andmed
                        <br />
                        <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-sm">
                          Juhend →
                        </a>
                      </li>
                      <li>
                        <strong>Safari:</strong> Eelistused → Privaatsus → Küpsised ja veebilehtede andmed
                        <br />
                        <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-sm">
                          Juhend →
                        </a>
                      </li>
                      <li>
                        <strong>Microsoft Edge:</strong> Seaded → Küpsised ja saidi load
                        <br />
                        <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-sm">
                          Juhend →
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg mt-6">
                    <p className="font-semibold mb-2">Google Analytics'i keelamine:</p>
                    <p>
                      Saate Google Analytics'i jälgimise keelata, installides Google Analytics Opt-out Browser Add-on:
                    </p>
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                      Laadi alla →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Kolmandate osapoolte küpsised
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Meie veebilehel võivad olla kolmandate osapoolte teenused (nt Google Analytics), mis kasutavad oma küpsiseid. Need teenused järgivad oma privaatsuspoliitikat:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Privacy Policy</a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Muudatused küpsiste teadaandes
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Me võime aeg-ajalt uuendada käesolevat küpsiste teadaannet. Muudatustest teavitame teid veebilehel.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Kontakt
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Kui teil on küsimusi küpsiste kohta, võtke meiega ühendust:
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg mt-4">
                    <p><strong>PetsVilla OÜ</strong></p>
                    <p>Tartu mnt 80, Soinaste, 61709, Tartumaa</p>
                    <p>E-post: <a href="mailto:service@petsvilla.ee" className="text-orange-600 hover:underline">service@petsvilla.ee</a></p>
                    <p>Telefon: <a href="tel:+3725127938" className="text-orange-600 hover:underline">+372 512 7938</a></p>
                  </div>
                  <p className="mt-4">
                    Lisainfo andmete töötlemise kohta: <a href="/privaatsuspoliitika" className="text-orange-600 hover:underline">Privaatsuspoliitika</a>
                  </p>
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
