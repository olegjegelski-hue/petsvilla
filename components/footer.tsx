
import { Heart, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-green-500 flex items-center justify-center">
                <span className="text-white font-bold">PV</span>
              </div>
              <span className="font-bold text-2xl">PetsVilla OÜ</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">Reg. nr. 14980686</p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Oleme pühendunud lemmikloomade heaolule ja teie rahulolule. 
              Meie eesmärk on tuua teie koju armastust ja rõõmu.
            </p>
            <div className="flex items-center text-orange-400">
              <Heart className="w-5 h-5 mr-2" />
              <span>Tehtud armastusega</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Kiired lingid</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Avaleht
                </Link>
              </li>
              <li>
                <Link href="/merisead" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Merisead
                </Link>
              </li>
              <li>
                <Link href="/viirpapagoid" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Viirpapagoid
                </Link>
              </li>
              <li>
                <Link href="/hein" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Hein
                </Link>
              </li>
              <li>
                <Link href="/pood" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Pood
                </Link>
              </li>
              <li>
                <Link href="/blogi" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Blogi
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* E-poe tingimused */}
          <div>
            <h3 className="font-bold text-lg mb-6">E-pood</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/muugitingimused" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Müügitingimused
                </Link>
              </li>
              <li>
                <Link href="/tagastuspoliitika" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Tagastuspoliitika
                </Link>
              </li>
              <li>
                <Link href="/tarneinfo" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Tarneinfo
                </Link>
              </li>
              <li>
                <Link href="/privaatsuspoliitika" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Privaatsuspoliitika
                </Link>
              </li>
              <li>
                <Link href="/kupsiste-teadaanne" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Küpsiste teadaanne
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Kontaktinfo</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Tartu mnt 80, Soinaste</p>
                  <p className="text-gray-400 text-sm">Kambja vald, Tartumaa 61709</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300">+372 512 7938</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300">service@petsvilla.ee</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© 2025 PetsVilla OÜ Kõik õigused kaitstud.</p>
        </div>
      </div>
    </footer>
  )
}
