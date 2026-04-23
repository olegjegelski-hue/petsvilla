
'use client'

import { Card } from '@/components/ui/card'
import { Heart, Award, Users, Star, Bird, Wheat } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const stats = [
    {
      icon: Heart,
      value: '50+',
      label: 'Merisiga aretuses',
      color: 'text-green-900'
    },
    {
      icon: Bird,
      value: '50+',
      label: 'Papagoi keskuses',
      color: 'text-green-800'
    },
    {
      icon: Award,
      value: '4+',
      label: 'Aastat kogemust',
      color: 'text-green-700'
    },
    {
      icon: Users,
      value: '1000+',
      label: 'Rahulolevat pere',
      color: 'text-green-900'
    },
    {
      icon: Star,
      value: '5/5',
      label: 'Klientide hinnang',
      color: 'text-green-800'
    }
  ]

  const quickLinks = [
    { name: 'Merisead', href: '#merisigadest', icon: Heart, color: 'from-pink-500 to-orange-500' },
    { name: 'Viirpapagoid', href: '#viirpapagoidest', icon: Bird, color: 'from-blue-500 to-cyan-500' },
    { name: 'Lemmiklooma hein', href: '#heinast', icon: Wheat, color: 'from-green-500 to-yellow-500' },
  ]

  const allParents = [
    {
      name: 'Pruun ema',
      image: '/parent-brown.jpg',
      description: 'Lühikarvaline tõumerisiga'
    },
    {
      name: 'Hõbedane isa',
      image: '/parent-silver.jpg',
      description: 'Karvakarvane tõumerisiga'
    },
    {
      name: 'Must isa',
      image: '/parent-black.jpg',
      description: 'Lühikarvaline tõumerisiga'
    },
    {
      name: 'Kreemikas ema',
      image: '/parent-cream.jpg',
      description: 'Lühikarvaline'
    },
    {
      name: 'Rosette isa',
      image: '/parent-rosette.jpg',
      description: 'Karvakarvane rosette'
    },
    {
      name: 'Valge ema',
      image: '/parent-white-red-eyes.jpg',
      description: 'Lühikarvaline albino'
    },
    {
      name: 'Must-valge isa',
      image: '/parent-bw-rosette.jpg',
      description: 'Karvakarvane rosette'
    },
    {
      name: 'Valge-hall ema',
      image: '/parent-white-gray.jpg',
      description: 'Lühikarvaline'
    },
    {
      name: 'Tumepruun isa',
      image: '/parent-dark-brown.jpg',
      description: 'Lühikarvaline'
    }
  ]

  return (
    <section id="meist" className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            PetsVilla - hoitud lemmikud teie perele
          </h2>
          <div className="w-24 h-1 bg-[#C9BCAA] mx-auto mb-6"></div>
          <p className="text-sm md:text-base font-semibold text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Oleme usaldusväärne partner lemmikloomade maailmas. Tegeleme tõumerisigade ja 
            viirpapagoidega professionaalse aretamisega ning pakume kvaliteetset heina.
          </p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {quickLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="py-3 px-6 text-center border border-[#D7CBBE] bg-[#E3D8CB] text-green-900 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer rounded-full">
                <div className="flex items-center justify-center gap-3">
                  <link.icon className="w-5 h-5" />
                  <h3 className="font-bold text-lg">{link.name}</h3>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>

        {/* Story - Meie lugu */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card className="p-8 md:p-12 border border-[#D7CBBE] shadow-xl bg-[#E3D8CB]/90">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
                  Meie lugu
                </h3>
                <p>
                  PetsVilla on kasvanud väikesest papagoi perest mitmekülgseks ja professionaalseks Papagoi 
                  Keskuseks. Meie tegevus ühendab kolm põhivaldkonda: Papagoi Keskus (üle 50 papagoi) - 
                  külastused gruppidele, lühikarvaliste tõumerisigade ja viirpapagoide aretus ning kvaliteetse, 
                  looduslikult kuivatatud heina müük väikeste ja suurte lemmikloomapidajate jaoks.
                </p>
                <p>
                  Pesakonnad sotsialiseeritud ning terved; iga merisea beebi saab dokumenteeritud päritolu 
                  (pedigree). Heina kasvatame puhastes kohtades eemal teedest ja saasteallikatest ning 
                  kuivatame loodusselt päikese ja tuulega — sama heina sööb ja hindab ka meie üle 50 
                  tõumerisiga.
                </p>
                <p>
                  PetsVilla pakub kvaliteeti, läbipaistvust ja pidevat tuge lemmikute omanikele. Pakume 
                  nõu toitumisest, hooldusest ja varustusest. Kutsume huvilisi külastama Papagoi Keskust, 
                  tutvuma meie lindude ja merisigadega ning veenduma meie töö eetikas ja elukeskkonna 
                  kvaliteedis.
                </p>
              </div>
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://cdn.abacus.ai/images/f5e50a94-2f96-4763-87cf-6f169e387d9a.png"
                  alt="PetsVilla - meie armastusega kasvatatud lemmikloomad"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Merisigadest Section */}
        <div id="merisigadest" className="mb-20 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 text-center">
              <Heart className="inline-block w-8 h-8 mr-2 text-pink-600" />
              Merisead
            </h3>
            <div className="w-20 h-1 bg-[#C9BCAA] mx-auto mb-8"></div>
            <Card className="p-8 md:p-12 border border-[#D7CBBE] shadow-xl bg-[#E3D8CB]/90">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  <p>
                    <strong>PetsVilla — usaldusväärne merisigade kasvataja.</strong> Oleme spetsialiseerunud 
                    lühikarvalistele tõumerisigadele ning töötame valdkonnas juba üle 4 aasta. Meie aretuses on 
                    rohkem kui 50 tõumeriseaga erinevate värvide ja karvastruktuuriga.
                  </p>
                  <p>
                    Kõik meie merisea beebid on <strong>dokumenteeritud päritoluga (pedigree)</strong>, mis kinnitab 
                    nende tõuomadusi ja tervise tausta.
                  </p>
                  <p>
                    Me paneme suurt rõhku vanemapopulatsiooni tervisele ja iseloomule — iga ema ja isa on hoolikalt 
                    valitud, et tagada terved, sõbralikud ja kaunid järglased. Iga beebi kasvab armastuses ning 
                    saab vajaliku hoolduse ja sotsialiseerimise.
                  </p>
                  <p>
                    Enne uude koju minekut saab iga beebi ka parasiiditõrje. Beebid on julged harjunud inimestega 
                    kuna meie keskust külastavad pidevalt grupid. <Link href="/kontakt" 
                    className="text-green-800 hover:text-green-900 font-semibold underline transition-colors">(Võta 
                    meiega ühendus külastuseks)</Link>
                  </p>
                </div>
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/parent-babies.jpg"
                    alt="Meie merisead koos vanemaga"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Merisea Care Guide CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border border-[#D7CBBE] shadow-xl bg-[#E3D8CB]/90">
            <div className="p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">
                Kuidas merisea eest õigesti hoolitseda?
              </h3>
              <p className="text-gray-700 text-lg mb-6">
                Meie blogist leiad praktilised juhendid, toitmissoovitused ja
                igapäevase hoolduse nipid, et sinu merisiga oleks terve ja rõõmus.
              </p>
              <Link href="/blogi">
                <Button className="bg-gradient-to-r from-[#1F6A4C] to-[#C8A93E] hover:from-[#19563d] hover:to-[#B39133] text-white border border-[#C8A93E]/80 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Loe merisigade hooldusjuhiseid →
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Breeding Parents Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 text-center">
            <Heart className="inline-block w-8 h-8 mr-2 text-pink-600" />
            Meie aretuse merisead
          </h3>
          <div className="w-20 h-1 bg-[#C9BCAA] mx-auto mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {allParents.map((parent, index) => (
              <motion.div
                key={parent.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
              >
                <Card className="overflow-hidden border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <div className="relative h-64 bg-background">
                    <Image
                      src={parent.image}
                      alt={parent.name}
                      fill
                      className="object-cover"
                      loading={index < 6 ? "eager" : "lazy"}
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Viirpapagoidest Section */}
        <div id="viirpapagoidest" className="mb-20 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 text-center">
              <Bird className="inline-block w-8 h-8 mr-2 text-blue-600" />
              Viirpapagoid
            </h3>
            <div className="w-20 h-1 bg-[#C9BCAA] mx-auto mb-8"></div>
            <Card className="p-8 md:p-12 border border-[#D7CBBE] shadow-xl bg-[#E3D8CB]/90">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  <p>
                    Üks meie tegevusteks on <strong>Papagoi Keskus</strong> - oleme uhked, et meie juures elab 
                    üle 50 papagoi! Tegeleme ka väikeste papagoidega professionaalse aretamisega, keskendudes 
                    eelkõige <strong>viirpapagoidele (budgerigars)</strong>.
                  </p>
                  <p>
                    Meie keskuses on üle 20 viirpapagoi paari, kes vastavad näituste standardile. Iga paar on 
                    hoolikalt valitud nende tervislike omaduste, värvi, suuruse ja iseloomu järgi. Meie eesmärk 
                    on kasvatada standardile vastavaid, terveid ja elujõulisi viirpapagoisi.
                  </p>
                  <p>
                    Viirpapagoid on suurepased lemmiklinnud - nad on sõbralikud, õppimisvõimelised ja 
                    rõõmsameelsed. Meie aretuse viirpapagoid kasvavad sotsialiseeritud keskkonnas, kus nad 
                    saavad pidevalt inimkontakte ja õiget hooldust.
                  </p>
                  <p>
                    Pakume nõu ja tuge viirpapagoi pidamisel, õigel toitmisel ja hooldamisel. Meie kogemus 
                    ja teadmised tagavad, et iga linnuke leiab armastava kodu, kus teda osatakse õigesti hoida.
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    💡 Täpsem info viirpapagoidest ja saadaolevate linnukeste kohta - võtke meiega ühendust!
                  </p>
                </div>
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/budgies-aviary.jpg"
                    alt="PetsVilla viirpapagoid aretuskeskuses"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Heinast Section */}
        <div id="heinast" className="mb-20 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 text-center">
              <Wheat className="inline-block w-8 h-8 mr-2 text-green-600" />
              Lemmiklooma hein
            </h3>
            <div className="w-20 h-1 bg-[#C9BCAA] mx-auto mb-8"></div>
            <Card className="p-8 md:p-12 border border-[#D7CBBE] shadow-xl bg-[#E3D8CB]/90">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  <h4 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
                    PetsVilla hein: Puhas loodus ja tõestatud kvaliteet
                  </h4>
                  <p>
                    <strong>Kvaliteetne hein - lemmiklooma tervisliku toitumise alus!</strong> PetsVilla pakub 
                    parimat heina, mis on spetsiaalselt mõeldud merisigadele, küülikutele ja teistele närilistele.
                  </p>
                  <p>
                    Kasutame ainult kvaliteetseid heinasorte, mis on rikkalikud kiudainete poolest ja sisaldavad 
                    vajalikke vitamiine ning mineraale. Meie hein on puhas, kuiv ja tolmuvaba - hoolikalt valitud 
                    ja õigel ajal koristatud. Heinamaad asuvad eemal tiheda liiklusega teedest ja muudest 
                    saasteallikatest, pakkudes ideaalset keskkonda rikkaliku ja tervisliku heina kasvuks.
                  </p>
                  <p>
                    Kuivatame heina traditsioonilisel ja loodussõbralikul viisil – päikese ja tuule abil. See 
                    aeglane ja loomulik protsess aitab säilitada heina loomuliku värvi, aroomi ning kõik olulised 
                    vitamiinid ja mineraalid, mis on teie lemmikloomade tervisele ja heaolule hädavajalikud.
                  </p>
                  <p>
                    Hein on <strong>merisigadele eluliselt oluline</strong> - see moodustab 80% nende toidulauast 
                    ja aitab hoida seedetrakti tervist ning hambaid korras. Pakutav hein on alati värske 
                    ja meeldiva lõhnaga, mis meelitab lemmikloomi.
                  </p>
                  <p>
                    Meie heina kvaliteeti ei pea te aga pimesi uskuma. Sama heina söövad iga päev ka meie enda 
                    üle 50 tõumerisea, kes on PetsVilla uhkuseks ja elavaks tõestuseks pakutava heina 
                    kvaliteedist. Nende hea tervis ja elujõud on parimaks kinnituseks, et meie hein on 
                    tõeliselt esmaklassiline valik teie lemmikutele!
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    🌾 Soovite tellida kvaliteetset heina? Võtke meiega ühendust!
                  </p>
                </div>
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/hay-meadow.jpg"
                    alt="PetsVilla kvaliteetse heina heinamaa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-green-900 mb-8 text-center">
            Statistika
          </h3>
          <div className="w-20 h-1 bg-[#C9BCAA] mx-auto mb-12"></div>
        </div>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg hover:shadow-xl transition-shadow">
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold text-green-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
