
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#E1D6C8] text-[#2E3A32] pt-4 pb-3 border-t border-[#D0C3B4]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-4 gap-5 md:gap-6">
          {/* Brand Section */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-col items-center md:items-start mb-3">
              <div className="relative h-24 w-48 mx-auto md:mx-0">
                <Image
                  src="/petsvilla-logo-stacked-transparent-v2.png"
                  alt="PetsVilla logo"
                  fill
                  sizes="192px"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-[#4F5A52] leading-relaxed mb-4">
              Oleme pühendunud lemmikloomade heaolule ja teie rahulolule. 
              Meie eesmärk on tuua teie koju armastust ja rõõmu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-green-900">Kiired lingid</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Avaleht
                </Link>
              </li>
              <li>
                <Link href="/merisead" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Merisead
                </Link>
              </li>
              <li>
                <Link href="/papagoid" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Papagoid
                </Link>
              </li>
              <li>
                <Link href="/hein" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Hein
                </Link>
              </li>
              <li>
                <Link href="/pood" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Pood
                </Link>
              </li>
              <li>
                <Link href="/meist" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Meist
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* E-poe tingimused */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-green-900">E-pood</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/muugitingimused" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Müügitingimused
                </Link>
              </li>
              <li>
                <Link href="/tagastuspoliitika" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Tagastuspoliitika
                </Link>
              </li>
              <li>
                <Link href="/tarneinfo" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Tarneinfo
                </Link>
              </li>
              <li>
                <Link href="/privaatsuspoliitika" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Privaatsuspoliitika
                </Link>
              </li>
              <li>
                <Link href="/kupsiste-teadaanne" className="text-[#4F5A52] hover:text-green-800 transition-colors">
                  Küpsiste teadaanne
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-green-900">Kontaktinfo</h3>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-800 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#4F5A52]">Tartu mnt 80, Soinaste</p>
                  <p className="text-[#6A6F68] text-sm">Kambja vald, Tartumaa 61709</p>
                  <a
                    href="https://maps.google.com/?q=Tartu+mnt+80,+Soinaste,+Kambja+vald,+Tartumaa+61709"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-sm text-green-800 hover:text-green-900 underline underline-offset-2"
                  >
                    Vaata kaardil
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-800 flex-shrink-0" />
                <p className="text-[#4F5A52]">+372 512 7938</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-800 flex-shrink-0" />
                <p className="text-[#4F5A52]">service@petsvilla.ee</p>
              </div>
              <div className="flex items-center gap-6 pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=100092538633994"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PetsVilla Facebook"
                  className="text-green-900 hover:text-green-800 transition-colors"
                >
                  <Facebook className="h-7 w-7" />
                </a>
                <a
                  href="https://www.instagram.com/petsvilla_lemmikloomadekodu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PetsVilla Instagram"
                  className="text-green-900 hover:text-green-800 transition-colors"
                >
                  <Instagram className="h-7 w-7" />
                </a>
                <a
                  href="https://www.youtube.com/@PetsVillaTartu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PetsVilla YouTube"
                  className="text-green-900 hover:text-green-800 transition-colors"
                >
                  <Youtube className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#C9BCAA] mt-3 pt-2 text-center">
          <p className="text-green-900">© 2025 PetsVilla OÜ Reg. nr. 14980686 Kõik õigused kaitstud.</p>
        </div>
      </div>
    </footer>
  )
}
