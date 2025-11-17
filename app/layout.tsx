
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
    default: 'PetsVilla — merisea beebid, viirpapagoid ja kvaliteetne hein | Soinaste',
    template: '%s | PetsVilla OÜ'
  },
  description: 'PetsVilla OÜ pakub tervislikke meriseabeebisid, rõõmsaid viirpapagoid ja looduslikult kuivatatud heina. Asume Soinastes, Tartu mnt 80. Helista +372 512 7938.',
  keywords: [
    'meriseabeebid', 
    'tõumerisiigad', 
    'merisiigade aretaja', 
    'guinea pig breeder Estonia',
    'viirpapagoid', 
    'budgie breeder',
    'näituse kvaliteet',
    'hein merisiigadele', 
    'hein küülikutele',
    'lemmikloomad', 
    'pet store Estonia',
    'pedigree guinea pigs',
    'tõuloomad',
    'lemmikloomade aretaja',
    'PetsVilla',
    'Eesti lemmikloomad'
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
    title: 'PetsVilla OÜ - Tõumerisiigad ja Viirpapagoid | Eesti',
    description: 'Professionaalne tõumerisiigade ja näituse kvaliteediga viirpapagoidega aretaja. Dokumenteeritud päritolu, tervisekontroll ja professionaalne nõustamine.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PetsVilla OÜ - Tõumerisiigad ja Viirpapagoid',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetsVilla OÜ - Tõumerisiigad ja Viirpapagoid',
    description: 'Professionaalne aretaja Eestis. Dokumenteeritud päritolu ja tervisekontroll.',
    images: ['/og-image.png'],
    creator: '@petsvilla',
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
    'fb:app_id': 'your-facebook-app-id',
    'og:phone_number': '+372 512 7938',
    'og:email': 'info@petsvilla.ee',
    'og:country-name': 'Estonia',
    'og:region': 'EE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="et" suppressHydrationWarning>
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
