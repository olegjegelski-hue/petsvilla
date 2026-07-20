import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import type { ReactNode } from 'react'

type LegalPageShellProps = {
  title: string
  /** Valikuline alapealkiri (nt kuupäev) */
  subtitle?: string
  /** Valikuline ikoon pealkirja juurde */
  icon?: ReactNode
  backHref?: string
  backLabel?: string
  children: ReactNode
}

/**
 * Ühtne PetsVilla õiguslehtede raam: nav + soe roheline/kuldne taust + loetav sisukaart + footer.
 */
export function LegalPageShell({
  title,
  subtitle,
  icon,
  backHref = '/',
  backLabel = 'Tagasi avalehele',
  children,
}: LegalPageShellProps) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-[#E3D8CB] via-[#E8DFD3] to-background pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4 md:max-w-4xl">
          <nav aria-label="Leivapuru" className="mb-6">
            <Link
              href={backHref}
              className="inline-flex items-center text-[#1F6A4C] hover:text-green-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden />
              {backLabel}
            </Link>
          </nav>

          <article className="rounded-2xl border border-[#D7CBBE] bg-[#E3D8CB]/95 shadow-lg p-6 sm:p-8 md:p-12">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-green-900 flex flex-wrap items-center gap-3">
                {icon ? (
                  <span className="text-[#1F6A4C] [&_svg]:w-9 [&_svg]:h-9 md:[&_svg]:w-10 md:[&_svg]:h-10">
                    {icon}
                  </span>
                ) : null}
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 text-gray-600 text-base md:text-lg">{subtitle}</p>
              ) : null}
              <div className="mt-4 h-1 w-16 bg-[#C8A93E] rounded-full" aria-hidden />
            </header>

            <div className="space-y-8 text-gray-700 leading-relaxed text-base md:text-lg [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-green-900 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-green-900 [&_h3]:mb-3 [&_a]:text-[#1F6A4C] [&_a]:font-medium [&_a]:underline-offset-2 hover:[&_a]:underline hover:[&_a]:text-green-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1">
              {children}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

/** Brändi info-/hoiatuskastid õiguslehtedel */
export const legalCallout = {
  brand:
    'rounded-lg border border-[#D7CBBE] bg-[#E8DFD3]/90 p-4 md:p-6 text-green-900',
  accent:
    'rounded-lg border border-[#C8A93E]/50 bg-[#E3D8CB] p-4 md:p-6 text-green-900',
  warn:
    'rounded-lg border border-amber-300 bg-amber-50 p-4 md:p-6 text-amber-950',
  success:
    'rounded-r-lg border-l-4 border-[#1F6A4C] bg-[#E8DFD3]/80 p-4 md:p-6 text-green-900',
} as const
