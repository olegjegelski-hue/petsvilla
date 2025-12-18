import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Müügitingimused | PetsVilla',
  description: 'PetsVilla OÜ e-poe müügitingimused ja tarnetingimused. Lemmikloomade tarvikud, hein ja eluslooma müük.',
  openGraph: {
    title: 'Müügitingimused | PetsVilla',
    description: 'PetsVilla OÜ e-poe müügitingimused ja tarnetingimused.',
    url: 'https://petsvilla.ee/muugitingimused',
  },
}

export default function MuugitingimusedPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Müügitingimused</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Kehtivad alates: 28.11.2025<br />
              Viimati uuendatud: 28.11.2025
            </p>

            {/* 1. ÜLDISED TINGIMUSED */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Üldised tingimused</h2>
              <p className="text-gray-700 mb-4">
                Käesolevad müügitingimused kehtivad <strong>PetsVilla OÜ</strong> (registrikood: <strong>14980686</strong>, 
                aadress: Kambja vald, Tartumaa 61709) veebilehel <strong>petsvilla.ee</strong> (edaspidi "e-pood") 
                toodete ja teenuste müügil.
              </p>
              <p className="text-gray-700 mb-4">
                E-poes tellimusi tehes nõustub ostja käesolevate müügitingimustega.
              </p>
              <p className="text-gray-700">
                Müüja jätab endale õiguse muuta müügitingimusi, teavitades sellest ostjat veebilehel.
              </p>
            </section>

            {/* 2. TOOTED JA TEENUSED */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tooted ja teenused</h2>
              <p className="text-gray-700 mb-4">
                PetsVilla müüb:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Kvaliteetset lemmiklooma heina</strong> (pakendis 8-9 kg, valikud: 1×, 2× või 3× pakki)</li>
                <li><strong>Lemmikloomade toitu</strong> (Dobeles Dzīrnavnieks, Versele-Laga)</li>
                <li><strong>Merisigade beebid</strong> (eluslooma müük, ettetellimisega)</li>
                <li><strong>Viirpapagoid</strong> (eluslooma müük, ettetellimisega)</li>
              </ul>
              <p className="text-gray-700">
                Kõik tooted on kirjeldatud tootelehtedel. Müüja ei vastuta vigade eest, mis on tingitud ostja 
                seadmete ekraani värvi- või resolutsioonierinevatest sätetest.
              </p>
            </section>

            {/* 3. HINNAD */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hinnad</h2>
              <p className="text-gray-700 mb-4">
                Kõik e-poes toodud hinnad on eurodes (€) ja sisaldavad Eesti käibemaksu 22%.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Heinapakkide hinnad:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>1× pakk (8-9 kg): <strong>9,00 €</strong></li>
                <li>2× pakki (16-18 kg): <strong>18,00 €</strong></li>
                <li>3× pakki (24-27 kg): <strong>27,00 €</strong></li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Lisateenused:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Meriseatoit (Dobeles/Versele-Laga): hind vastavalt valitud kogusele</li>
                <li>Küülikutoit (Dobeles/Versele-Laga): hind vastavalt valitud kogusele</li>
              </ul>
            </section>

            {/* 4. TARNEVIISID JA -KULUD */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Tarneviisid ja -kulud</h2>
              <p className="text-gray-700 mb-4">
                <strong>Tarneviis:</strong> SmartPost pakiautomaat (Eesti piires)
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Tarnekulu:</strong> Lisandub tellimuse lõppsummale vastavalt SmartPost hinnakirjale.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Tarneaeg:</strong> 1-3 tööpäeva pärast tellimuse kinnitamist ja makse laekumist.
              </p>
              <p className="text-gray-700">
                <strong>Eluslooma müük:</strong> Merisead ja viirpapagoid tuleb kätte toimetada isiklikult kokkuleppel. 
                Tarne toimub pärast 50% ettemakse laekumist.
              </p>
            </section>

            {/* 5. MAKSEVIISID */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Makseviisid</h2>
              <p className="text-gray-700 mb-4">
                E-poes saab tasuda <strong>Montonio</strong> maksekeskuse kaudu:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Pangalingid:</strong> Swedbank, SEB, LHV, Luminor, Coop Pank jt</li>
                <li><strong>Kaardimaksed:</strong> Visa, Mastercard, American Express</li>
                <li><strong>Järelmaks:</strong> Inbank Pay Later (tulevikus)</li>
              </ul>
              <p className="text-gray-700">
                Maksete töötlemise eest vastutab <strong>Montonio Finance UAB</strong> (Leedu makseasutus, 
                litsents nr. 16 Leedu Pangalt).
              </p>
            </section>

            {/* 6. TELLIMUSE KINNITAMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tellimuse kinnitamine</h2>
              <p className="text-gray-700 mb-4">
                Pärast tellimuse esitamist ja makse sooritamist saadab müüja ostjale e-kirja teel tellimuse kinnituse.
              </p>
              <p className="text-gray-700 mb-4">
                Müüjal on õigus tellimus tühistada, kui:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Toode on otsas või pole saadaval</li>
                <li>Hinnas on ilmselge viga</li>
                <li>Ostja andmed on valed või puudulikud</li>
              </ul>
            </section>

            {/* 7. TAGANEMISÕIGUS */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Taganemisõigus (14 päeva)</h2>
              <p className="text-gray-700 mb-4">
                Vastavalt Eesti Vabariigi seadustele on tarbijal õigus lepingust taganeda 14 päeva jooksul 
                alates kauba kättesaamisest.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Taganemisõigus kehtib:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Heinapakid (avamata, originaalpakendis)</li>
                <li>Lemmikloomade toit (avamata, originaalpakendis)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong className="text-red-600">Taganemisõigus EI KEHTI:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Eluslooma müügil</strong> (merisead, viirpapagoid) - seaduse kohaselt</li>
                <li>Avatud või kasutatud toodetele</li>
                <li>Hügieenipõhjustel (närimistarvikud, täitmaterjalid)</li>
              </ul>
              <p className="text-gray-700">
                Taganemisavalduse saab saata e-posti aadressile: <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a>
              </p>
            </section>

            {/* 8. TAGASTAMINE JA RAHA TAGASTAMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Tagastamine ja raha tagastamine</h2>
              <p className="text-gray-700 mb-4">
                <strong>Tagastamise kord:</strong>
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
                <li>Saada taganemisavaldus e-postile: service@petsvilla.ee</li>
                <li>Müüja kinnitab tagastamise ja saadab juhised</li>
                <li>Saada toode tagasi originaalpakendis (avamata, kasutamata)</li>
                <li>Müüja kontrollib kaupa ja tagastab raha 14 päeva jooksul</li>
              </ol>
              <p className="text-gray-700 mb-4">
                <strong>Tagastamise kulud:</strong> Ostja kannab tagastamise kulud, välja arvatud juhul, 
                kui toode on defektne või vale.
              </p>
              <p className="text-gray-700">
                <strong>Raha tagastamine:</strong> Toimub samale arvelduskontole, millelt makse tehti.
              </p>
            </section>

            {/* 9. GARANTII JA PRETENSIOONID */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Garantii ja pretensioonid</h2>
              <p className="text-gray-700 mb-4">
                Müüja tagab, et kõik müüdavad tooted vastavad kvaliteedinõuetele ja on õigesti pakendatud.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Defektse kauba korral:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Teavita müüjat 7 päeva jooksul: service@petsvilla.ee</li>
                <li>Saada foto defektist</li>
                <li>Müüja vahetab kauba või tagastab raha täies ulatuses</li>
              </ul>
              <p className="text-gray-700">
                <strong>Eluslooma tervis:</strong> Merisigade ja viirpapagoidega kaasas tervisepass. 
                Kui tekivad terviseprobleemid 30 päeva jooksul, palun võta ühendust.
              </p>
            </section>

            {/* 10. VASTUTUSE PIIRAMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Vastutuse piiramine</h2>
              <p className="text-gray-700 mb-4">
                Müüja ei vastuta:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Tarnehilinemise eest, mis on tingitud vääramatutest asjaoludest (force majeure)</li>
                <li>Ostja poolt valesti sisestatud andmete tõttu tekkinud kahjude eest</li>
                <li>Kolmandate osapoolte teenuste (SmartPost, Montonio) eest</li>
                <li>Eluslooma haiguste/vigastuste eest, mis tekivad pärast üleandmist</li>
              </ul>
            </section>

            {/* 11. ISIKUANDMETE TÖÖTLEMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Isikuandmete töötlemine</h2>
              <p className="text-gray-700 mb-4">
                Tellimuse esitamisel töödeldakse ostja isikuandmeid vastavalt 
                <Link href="/privaatsuspoliitika" className="text-purple-600 hover:underline"> privaatsuspoliitikale</Link>.
              </p>
              <p className="text-gray-700">
                Andmeid kasutatakse ainult tellimuse täitmiseks ja ei jagata kolmandatele osapooltele 
                (välja arvatud SmartPost tarne jaoks).
              </p>
            </section>

            {/* 12. VAIDLUSTE LAHENDAMINE */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Vaidluste lahendamine</h2>
              <p className="text-gray-700 mb-4">
                Vaidluste korral palume esmajoones pöörduda müüja poole: 
                <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a>
              </p>
              <p className="text-gray-700 mb-4">
                Kui kokkulepet ei saavutata, on ostjal õigus pöörduda:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Tarbijavaidluste Komisjon:</strong> <a href="https://komisjon.ee" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">komisjon.ee</a></li>
                <li><strong>Euroopa Liidu ODR platvorm:</strong> <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">ec.europa.eu/consumers/odr</a></li>
              </ul>
            </section>

            {/* KONTAKT */}
            <section className="bg-purple-50 rounded-xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontaktandmed</h2>
              <p className="text-gray-700 mb-2"><strong>Ettevõte:</strong> PetsVilla OÜ</p>
              <p className="text-gray-700 mb-2"><strong>Registrikood:</strong> 14980686</p>
              <p className="text-gray-700 mb-2"><strong>Aadress:</strong> Kambja vald, Tartumaa 61709</p>
              <p className="text-gray-700 mb-2"><strong>E-post:</strong> <a href="mailto:service@petsvilla.ee" className="text-purple-600 hover:underline">service@petsvilla.ee</a></p>
              <p className="text-gray-700"><strong>Veebileht:</strong> <a href="https://petsvilla.ee" className="text-purple-600 hover:underline">petsvilla.ee</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}