import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Package, Clock, Euro, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tagastuspoliitika | PetsVilla',
  description: '14 päeva taganemisõigus. PetsVilla tagastamise tingimused ja kord. Eluslooma erandid.',
  alternates: {
    canonical: 'https://petsvilla.ee/tagastuspoliitika',
  },
  openGraph: {
    title: 'Tagastuspoliitika | PetsVilla',
    description: '14 päeva taganemisõigus. Tagastamise tingimused ja kord.',
    url: 'https://petsvilla.ee/tagastuspoliitika',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tagastuspoliitika | PetsVilla',
    description: '14 päeva taganemisõigus. Tagastamise tingimused ja kord.',
    images: ['/og-image.png'],
  },
}

export default function TagastuspoliitProvidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tagasi avalehele
        </Link>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Tagastuspoliitika</h1>
          
          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg">
              <p className="text-green-800 font-semibold mb-2">
                ✅ Sinul on õigus lepingust taganeda 14 päeva jooksul!
              </p>
              <p className="text-green-700 text-sm">
                Vastavalt Eesti Vabariigi tarbijakaitseseadusele on tarbijal õigus osta tagasi makstud 
                tooted 14 päeva jooksul alates kauba kättesaamisest.
              </p>
            </div>

            {/* 1. TAGANEMISÕIGUS */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Taganemisõigus (14 päeva)</h2>
              <p className="text-gray-700 mb-4">
                <strong>Taganemisaeg:</strong> 14 kalendripäeva alates kauba kättesaamisest.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Kuidas kasutada taganemisõigust:</strong>
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
                <li>
                  <strong>Saada meile taganemisavaldus:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>E-post: <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a></li>
                    <li>Märgi avalduses oma nimi, tellimuse number ja põhjus</li>
                  </ul>
                </li>
                <li>
                  <strong>Meie saadame kinnituse ja tagastamise juhised</strong> (1-2 tööpäeva jooksul)
                </li>
                <li>
                  <strong>Saada toode tagasi:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Originaalpakendis, avamata ja kasutamata</li>
                    <li>Kaasa arve või tellimuse number</li>
                  </ul>
                </li>
                <li>
                  <strong>Meie tagastame raha 14 päeva jooksul</strong> pärast kauba tagasisaamist
                </li>
              </ol>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Tähtajad:</h3>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Taganemisavaldus: <strong>14 päeva</strong> pärast kättesaamist</li>
                      <li>• Kauba tagastamine: <strong>14 päeva</strong> pärast avaldust</li>
                      <li>• Raha tagastamine: <strong>14 päeva</strong> pärast kauba tagasisaamist</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. TAGASTATAVAD TOOTED */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tagastatavad tooted</h2>
              <p className="text-gray-700 mb-4">
                <strong className="text-green-600">✅ Taganemisõigus KEHTIB:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Heinapakid</strong> (8-9 kg, originaalpakendis, avamata)</li>
                <li><strong>Lemmikloomade toit</strong> (Dobeles, Versele-Laga, originaalpakendis, avamata)</li>
                <li><strong>Tarvikud</strong> (avamata, kasutamata, originaalpakendis)</li>
              </ul>

              {/* Warning box */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-red-800 font-semibold mb-3">
                      ❌ Taganemisõigus EI KEHTI:
                    </p>
                    <ul className="text-red-700 space-y-2">
                      <li>
                        <strong>1. Eluslooma müük (merisead, viirpapagoid)</strong>
                        <p className="text-sm mt-1">
                          Vastavalt tarbijakaitseseaduse § 53 lg 4 p 2 ei kehti taganemisõigus elusloomade 
                          või -lindude puhul, kuna nende heaolu ja tervis muutuvad omaniku vahetuse korral.
                        </p>
                      </li>
                      <li>
                        <strong>2. Avatud või kasutatud tooted</strong>
                        <p className="text-sm mt-1">
                          Avatud heinapakid, toidu pakendid või kasutatud tarvikud.
                        </p>
                      </li>
                      <li>
                        <strong>3. Hügieenitooted</strong>
                        <p className="text-sm mt-1">
                          Närimistarvikud, puidupuru, täitematerjalid (hügieenipõhjustel).
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. TAGASTAMISE KULUD */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Tagastamise kulud</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <Euro className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Kes maksab tagastamise eest?</h3>
                    <ul className="text-purple-800 space-y-3">
                      <li>
                        <strong>Ostja muutis meelt:</strong> Ostja maksab tagastamise kulud
                        <p className="text-sm mt-1">Soovitame kasutada SmartPost pakiautomaati (ca 3-5 €)</p>
                      </li>
                      <li>
                        <strong>Toode on defektne või vale:</strong> Müüja maksab tagastamise kulud
                        <p className="text-sm mt-1">Saadame tasuta tagastussaatemärgi</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. RAHA TAGASTAMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Raha tagastamine</h2>
              <p className="text-gray-700 mb-4">
                Müüja tagastab ostja poolt makstud summa (sh algne tarnekulu, kui toode oli defektne) 
                <strong> 14 päeva jooksul</strong> alates kauba tagasisaamisest.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Kuidas toimub tagastamine:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Tagastame samale arvelduskontole, millelt makse tehti</li>
                <li>Kui kasutasid pangalinki - raha laekub 1-3 tööpäeva jooksul</li>
                <li>Kui kasutasid kaarti - raha laekub 3-5 tööpäeva jooksul</li>
                <li>Saadame e-kirja kinnituse raha tagastamise kohta</li>
              </ul>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 text-sm">
                  ⚠️ <strong>NB!</strong> Müüja ei tagasta tagastamise tarnekulusid (kui ostja muutis meelt).
                </p>
              </div>
            </section>

            {/* 5. DEFEKTSE KAUBA TAGASTAMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Defektse kauba tagastamine</h2>
              <p className="text-gray-700 mb-4">
                Kui toode on kahjustatud, vigane või ei vasta kirjeldusele:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
                <li>
                  <strong>Teavita meid 7 päeva jooksul:</strong> <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a>
                </li>
                <li>
                  <strong>Saada fotod defektist</strong> (pakend, toode, saatekleebis)
                </li>
                <li>
                  <strong>Meie pakume lahenduse:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Kauba vahetus uue vastu (tasuta tarne)</li>
                    <li>Täielik raha tagastamine (sh tarnekulu)</li>
                  </ul>
                </li>
              </ol>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  ✅ <strong>Garantii:</strong> Meie tagame toodete kvaliteedi. Kui midagi läheb valesti, 
                  tegeleme sellega kiiresti ja professionaalselt!
                </p>
              </div>
            </section>

            {/* 6. ELUSLOOMA TERVISE PROBLEEMID */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Eluslooma terviseprobleemid</h2>
              <p className="text-gray-700 mb-4">
                Kuigi elusloomade müügil taganemisõigus ei kehti, oleme vastutustundlikud aretajad:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Tervisepass:</strong> Iga loom läheb uue omaniku juurde täiesti tervena</li>
                <li><strong>30-päevane garantii:</strong> Kui 30 päeva jooksul ilmnevad varem varjatud terviseprobleemid, 
                  võta meiega ühendust</li>
                <li><strong>Nõuanded:</strong> Pakume tasuta nõu loomade hoolduse ja toitmise kohta</li>
              </ul>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <p className="text-pink-800 text-sm">
                  💕 <strong>Meie lubadus:</strong> Kui midagi läheb valesti, tegeleme sellega koos sinuga. 
                  Loomade heaolu on meile kõige tähtsam!
                </p>
              </div>
            </section>

            {/* 7. KONTAKT */}
            <section className="bg-purple-50 rounded-xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Küsimused tagastamise kohta?</h2>
              <p className="text-gray-700 mb-4">
                Kui sul on küsimusi või soovid toote tagastada, võta meiega ühendust:
              </p>
              <div className="text-gray-700 space-y-2">
                <p><strong>E-post:</strong> <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a></p>
                <p><strong>Aadress:</strong> PetsVilla OÜ, Kambja vald, Tartumaa 61709</p>
                <p><strong>Registrikood:</strong> 14980686</p>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Vastame 1-2 tööpäeva jooksul!
              </p>
            </section>

            {/* Legal reference */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">
                <strong>Õiguslik alus:</strong> Tarbijakaitseseadus § 53-56 (taganemisõigus), 
                § 53 lg 4 p 2 (erandid elusloomade puhul).
                <br />
                <a href="https://www.riigiteataja.ee/akt/TKS" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  Vaata seadust →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}