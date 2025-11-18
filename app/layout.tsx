
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { GoogleAnalytics } from '@/components/google-analytics'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://petsvilla.ee'),
  title: {
    default: 'PetsVilla OÜ — Merisead, Viirpapagoid ja Kvaliteetne Hein | Soinaste, Tartu',
    template: '%s | PetsVilla OÜ'
  },
  description: 'Professionaalne lemmikloomade aretaja Soinastes. Pakume tervislikke merisigasid dokumenteeritud päritoluga, näituse kvaliteediga viirpapagoid ja looduslikult kuivatatud heina. Üle 4 aasta kogemus. Helista +372 512 7938.',
  keywords: [
    // Eesti keelsed võtmesõnad - Merisead
    'merisead',
    'merisead',
    'merisea ost',
    'tõumerisead',
    'merisead Eestis',
    'merisiigade aretaja',
    'merisea kasvatus',
    'lühikarvased merisead',
    'rosette merisead',
    'pedigree merisead',
    'dokumenteeritud päritolu',
    // Eesti keelsed võtmesõnad - Viirpapagoid
    'viirpapagoid',
    'viirpapagoi ost',
    'viirpapagoidide aretaja',
    'näituse viirpapagoid',
    'papagoid Eestis',
    'linnud Eestis',
    'viirpapagoi kasvatus',
    // Eesti keelsed võtmesõnad - Hein
    'kvaliteetne hein',
    'hein merisiigadele',
    'hein küülikutele',
    'looduslik hein',
    'hein Tartus',
    'meriseatoit',
    'küülikutoit',
    // Inglise keelsed võtmesõnad
    'guinea pig breeder Estonia',
    'pedigree guinea pigs',
    'budgie breeder Estonia',
    'pet store Estonia',
    'show quality budgies',
    'guinea pigs for sale',
    // Üldised
    'lemmikloomad Eestis',
    'lemmikloomade aretaja',
    'tõuloomad',
    'PetsVilla',
    'Soinaste',
    'Tartu lemmikloomad'
  ],
  authors: [{ name: 'PetsVilla OÜ' }],
  creator: 'PetsVilla OÜ',
  publisher: 'PetsVilla OÜ',
  category: 'Pets & Animals',
  alternates: {
    canonical: 'https://petsvilla.ee',
    languages: {
      'et': 'https://petsvilla.ee',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'et_EE',
    url: 'https://petsvilla.ee',
    siteName: 'PetsVilla OÜ',
    title: 'PetsVilla OÜ — Merisead, Viirpapagoid ja Kvaliteetne Hein | Soinaste',
    description: 'Professionaalne lemmikloomade aretaja Soinastes. Tervislikud merisead dokumenteeritud päritoluga, näituse kvaliteediga viirpapagoid ja looduslikult kuivatatud hein. Üle 4 aasta kogemus. Tartu mnt 80, Soinaste. Tel: +372 512 7938.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PetsVilla OÜ — Professionaalne merisigade ja viirpapagoidide aretaja Soinastes, Tartumaa',
        type: 'image/png',
      },
    ],
    countryName: 'Estonia',
    emails: ['service@petsvilla.ee', 'info@petsvilla.ee'],
    phoneNumbers: ['+372 512 7938'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@petsvilla',
    creator: '@petsvilla',
    title: 'PetsVilla OÜ — Merisead, Viirpapagoid ja Kvaliteetne Hein',
    description: 'Professionaalne lemmikloomade aretaja Soinastes, Tartumaa. Dokumenteeritud päritolu, tervisekontroll ja professionaalne nõustamine. Helista +372 512 7938.',
    images: {
      url: '/og-image.png',
      alt: 'PetsVilla OÜ — Merisead ja Viirpapagoid',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Lisa siia Google Search Console verification kui saadaval
    // google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'og:phone_number': '+372 512 7938',
    'og:email': 'service@petsvilla.ee',
    'og:country-name': 'Estonia',
    'og:region': 'Tartumaa',
    'og:locality': 'Soinaste',
    'og:postal-code': '61709',
    'og:street-address': 'Tartu mnt 80',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Organization Schema for AI and Search Engines
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PetsVilla OÜ',
    legalName: 'PetsVilla OÜ',
    url: 'https://petsvilla.ee',
    logo: 'https://petsvilla.ee/og-image.png',
    description: 'Professionaalne lemmikloomade aretaja Eestis. Spetsialiseerunud tõumerisiigade ja näituse kvaliteediga viirpapagoidide aretamisele.',
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: 'PetsVilla OÜ Juht'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tartu mnt 80',
      addressLocality: 'Soinaste',
      addressRegion: 'Tartumaa',
      postalCode: '61709',
      addressCountry: 'EE'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+372-512-7938',
      contactType: 'customer service',
      email: 'service@petsvilla.ee',
      availableLanguage: ['Estonian', 'Russian', 'English'],
      areaServed: 'EE'
    },
    sameAs: [
      'https://petsvilla.ee'
    ],
    email: 'service@petsvilla.ee',
    telephone: '+372 512 7938',
    areaServed: {
      '@type': 'Country',
      name: 'Estonia'
    },
    knowsAbout: [
      'Guinea Pig Breeding',
      'Budgerigar Breeding',
      'Pet Care',
      'Animal Husbandry',
      'Pedigree Documentation',
      'Show Quality Animals'
    ]
  }

  return (
    <html lang="et" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.className} ${poppins.variable}`} suppressHydrationWarning>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
