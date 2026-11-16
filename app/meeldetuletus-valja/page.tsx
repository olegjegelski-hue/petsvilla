import { Metadata } from 'next'
import Link from 'next/link'
import { Client } from '@notionhq/client'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { LegalPageShell, legalCallout } from '@/components/legal-page-shell'
import { optOutHayReminder } from '@/lib/hay-reminder-job'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Meeldetuletus tühistatud | PetsVilla',
  description: 'Heina meeldetuletus on tühistatud.',
  robots: 'noindex, nofollow',
}

type PageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function MeeldetuletusValjaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const result = await optOutHayReminder(notion, params.token)

  const success = result.ok
  const title = success
    ? 'Meeldetuletus on tühistatud'
    : 'Meeldetuletust ei õnnestunud tühistada'
  const message = success
    ? result.alreadyOff
      ? 'Selle tellimuse meeldetuletus oli juba välja lülitatud. Rohkem kirju selle tellimuse kohta ei saadeta.'
      : 'Selle tellimuse kohta rohkem meeldetuletusi ei saadeta.'
    : result.reason === 'missing-token' || result.reason === 'invalid-token'
      ? 'Link on vigane või aegunud. Kui soovid meeldetuletuse tühistada, vasta viimasele kirjale või kirjuta service@petsvilla.ee.'
      : 'Midagi läks valesti. Palun proovi uuesti või kirjuta service@petsvilla.ee.'

  return (
    <LegalPageShell
      title={title}
      subtitle="Heina meeldetuletus"
      icon={
        success ? (
          <CheckCircle2 aria-hidden />
        ) : (
          <AlertCircle aria-hidden />
        )
      }
      backHref="/telli-hein"
      backLabel="Tagasi heinatellimuse juurde"
    >
      <div className={success ? legalCallout.success : legalCallout.warn}>
        <p>{message}</p>
      </div>
      <p>
        Kui hein hakkab otsa saama, saad uue koti alati tellida lehelt{' '}
        <Link href="/telli-hein">Telli hein</Link>.
      </p>
    </LegalPageShell>
  )
}
