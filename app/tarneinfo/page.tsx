import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, Clock, Euro, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tarneinfo | PetsVilla',
  description: 'SmartPost pakiautomaat tarne. Tarneajad, kulud ja pakiautomaatide asukohad. Eluslooma üleandmine.',
  openGraph: {
    title: 'Tarneinfo | PetsVilla',
    description: 'SmartPost pakiautomaat tarne. Tarneajad ja kulud.',
    url: 'https://petsvilla.ee/tarneinfo',
  },
}

export default function TarneinfoPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Tarneinfo</h1>
          
          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <p className="text-gray-700 text-lg mb-8">
              Kasutame <strong>SmartPost pakiautomaate</strong> kiire ja mugava tarne tagamiseks. 
              Eluslooma müük toimub isikliku üleandmise teel.
            </p>

            {/* 1. SMARTPOST PAKIAUTOMAAT */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Package className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. SmartPost Pakiautomaat</h2>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Miks SmartPost?</h3>
                <ul className="text-purple-800 space-y-2">
                  <li>✅ <strong>Mugav:</strong> Pakiautomaadid üle Eesti (200+ asukohta)</li>
                  <li>✅ <strong>Kiire:</strong> Tarne 1-3 tööpäeva</li>
                  <li>✅ <strong>24/7:</strong> Saad pakki kätte ööpäev läbi</li>
                  <li>✅ <strong>Turvaline:</strong> SMS ja e-posti teavitused</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kuidas toimib?</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
                <li>
                  <strong>Vali tellimuse vormil sobiv pakiautomaat</strong>
                  <p className="text-sm mt-1 ml-6">Näed kõiki saadaolevaid asukohti rippmenüüs</p>
                </li>
                <li>
                  <strong>Soorita makse</strong>
                  <p className="text-sm mt-1 ml-6">Pangalink, kaardimakse või järelmaks</p>
                </li>
                <li>
                  <strong>Meie pakendame tellimuse 1 tööpäeva jooksul</strong>
                  <p className="text-sm mt-1 ml-6">Saad e-kirja kinnituse paki saatmise kohta</p>
                </li>
                <li>
                  <strong>Jälgi saadetist</strong>
                  <p className="text-sm mt-1 ml-6">Saad SMS-i ja e-kirja, kui pakk jõuab automaati</p>
                </li>
                <li>
                  <strong>Võta pakk kätte</strong>
                  <p className="text-sm mt-1 ml-6">Kasuta SMS-is saadetud koodi (hoiuaeg 7 päeva)</p>
                </li>
              </ol>

              {/* Info box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-blue-800 text-sm">
                  📱 <strong>Jälgimiskood:</strong> Pärast paki saatmist saad e-kirja, kus on SmartPost jälgimisnumber. 
                  Saad jälgida saadetist aadressil <a href="https://www.smartpost.ee" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">smartpost.ee</a>
                </p>
              </div>
            </section>

            {/* 2. TARNEAJAD */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Tarneajad</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🌾 Heinapakid ja toit</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li><strong>Töötlemine:</strong> 1 tööpäev</li>
                    <li><strong>Tarne:</strong> 1-2 tööpäeva (SmartPost)</li>
                    <li><strong>Kokku:</strong> <span className="text-lg font-bold">1-3 tööpäeva</span></li>
                  </ul>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-pink-900 mb-3">🐹 Merisead ja viirpapagoid</h3>
                  <ul className="text-pink-800 space-y-2 text-sm">
                    <li><strong>Ettemakse:</strong> 50% broneerimise ajal</li>
                    <li><strong>Järelmakse:</strong> üleandmisel</li>
                    <li><strong>Üleandmine:</strong> <span className="text-lg font-bold">Kokkuleppel</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 text-sm">
                  ⚠️ <strong>NB!</strong> Tarneajad algavad makse laekumisest. Pangalinkide puhul laekub raha kohe, 
                  kaardimaksete puhul võib kuluda 1-2 tööpäeva.
                </p>
              </div>
            </section>

            {/* 3. TARNEKULUD */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Euro className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Tarnekulud</h2>
              </div>

              <p className="text-gray-700 mb-4">
                SmartPost pakiautomaat hinnad sõltuvad paki kaalust:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Paki kaal</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Tarnekulu</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Näide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-gray-700">Kuni 10 kg</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">3,50 - 4,50 €</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">1× heinapakk (8-9 kg)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">10-20 kg</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">4,50 - 5,50 €</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">2× heinapakki (16-18 kg)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-700">20-30 kg</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">5,50 - 6,50 €</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">3× heinapakki (24-27 kg)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-800 text-sm">
                  💡 <strong>Täpne hind</strong> arvutatakse automaatselt tellimuse vormil vastavalt valitud kogusele.
                </p>
              </div>
            </section>

            {/* 4. PAKIAUTOMAATIDE ASUKOHAD */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <MapPin className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Pakiautomaatide asukohad</h2>
              </div>

              <p className="text-gray-700 mb-4">
                SmartPost pakiautomaadid asuvad üle Eesti mugavates kohtades:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Tallinn:</strong> 50+ pakiautomaati (Vanalinn, Kesklinn, Mustamäe, Lasnamäe jt)</li>
                <li><strong>Tartu:</strong> 15+ pakiautomaati (Keskus, Annelinn, Raadi, Supilinn jt)</li>
                <li><strong>Pärnu, Narva, Viljandi:</strong> 5-10 pakiautomaati igas linnas</li>
                <li><strong>Väiksemad linnad:</strong> Vähemalt 1 pakiautomaat igal pool</li>
              </ul>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🗺️ Leia oma lähim pakiautomaat:</h3>
                <a 
                  href="https://www.smartpost.ee/et" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Ava SmartPost kaart
                </a>
              </div>
            </section>

            {/* 5. ELUSLOOMA ÜLEANDMINE */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Truck className="w-8 h-8 text-pink-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Eluslooma üleandmine</h2>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 mb-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">🐹 Merisead ja viirpapagoid</h3>
                <p className="text-pink-800 mb-4">
                  Elusloomi <strong>EI SAA</strong> saata pakiautomaadi. Üleandmine toimub isiklikult.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kuidas toimub üleandmine?</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
                <li>
                  <strong>Kontakteeru meiega:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>E-post: <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a></li>
                    <li>Või läbi <Link href="/merisead" className="text-purple-600 hover:underline">merisigade galerii</Link> kontaktivormi</li>
                  </ul>
                </li>
                <li>
                  <strong>Soorita 50% ettemakse</strong>
                  <p className="text-sm mt-1 ml-6">Broneerime looma sinu jaoks</p>
                </li>
                <li>
                  <strong>Lepime kokku kohtumise aja ja koha</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><strong>Meie asukoht:</strong> Kambja vald, Tartumaa 61709</li>
                    <li><strong>Võimalus tulla vaatama:</strong> Jah, enne ostu otsust</li>
                  </ul>
                </li>
                <li>
                  <strong>Looma üleandmine</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Kaasa tuleb tervisepass</li>
                    <li>Saad nõuandeid hoolduse ja toitmise kohta</li>
                    <li>Maksa ülejäänud 50% (sularaha või pangalink)</li>
                  </ul>
                </li>
              </ol>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  ✅ <strong>30-päevane garantii:</strong> Kui tekivad varem varjatud terviseprobleemid, 
                  tegeleme sellega koos sinuga!
                </p>
              </div>
            </section>

            {/* 6. JÄLGIMINE JA TEAVITUSED */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Jälgimine ja teavitused</h2>
              <p className="text-gray-700 mb-4">
                Oleme läbipaistvad ja saadame sulle pidevalt uuendusi:
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Tellimuse kinnitus</h3>
                    <p className="text-gray-600 text-sm">Kohe pärast makse sooritamist (e-post)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Paki saatmine</h3>
                    <p className="text-gray-600 text-sm">Kui pakk on saadetud + jälgimisnumber (e-post)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pakk jõudis automaati</h3>
                    <p className="text-gray-600 text-sm">SMS + e-post koodiga (SmartPost)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Meeldetuletus</h3>
                    <p className="text-gray-600 text-sm">Kui pakk on automaadis üle 5 päeva (SmartPost)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. KKK */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Korduma kippuvad küsimused</h2>
              
              <div className="space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">Kui kaua hoitakse pakki automaadis?</summary>
                  <p className="text-gray-700 text-sm mt-2">
                    SmartPost hoiab pakki <strong>7 päeva</strong>. Kui ei võta kätte, tagastatakse meile ja 
                    võtame sinuga ühendust.
                  </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">Kas saan muuta tarne aadressi?</summary>
                  <p className="text-gray-700 text-sm mt-2">
                    Jah, enne paki saatmist (1 tööpäeva jooksul). Kirjuta meile: service@petsvilla.ee
                  </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">Mis saab, kui pakk kaob või on kahjustatud?</summary>
                  <p className="text-gray-700 text-sm mt-2">
                    SmartPost on kindlustatud. Kui pakk kaob või on vigastatud tarne ajal, saad täieliku hüvitise 
                    või uue paki tasuta.
                  </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer">Kas saate toimetada koju?</summary>
                  <p className="text-gray-700 text-sm mt-2">
                    Praegu kasutame ainult pakiautomaate. Kui on eriline vajadus (nt suured tellimused 30+ kg), 
                    võta meiega ühendust.
                  </p>
                </details>
              </div>
            </section>

            {/* KONTAKT */}
            <section className="bg-purple-50 rounded-xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Küsimused tarne kohta?</h2>
              <p className="text-gray-700 mb-4">
                Kui sul on küsimusi, võta meiega ühendust:
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
          </div>
        </div>
      </div>
    </div>
  )
}