import { Metadata } from 'next'
import Link from 'next/link'
import { Client } from '@notionhq/client'
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import { LegalPageShell, legalCallout } from '@/components/legal-page-shell'
import {
  HAY_OPT_OUT_ORDER_URL,
  HAY_REMINDER_OPT_OUT_CHOICE_TEXT,
  HAY_REMINDER_OPT_OUT_MESSAGE,
} from '@/lib/hay-reminder'
import {
  hayReminderOptOutView,
  inspectHayReminderOptOut,
} from '@/lib/hay-reminder-job'
import { SITE_CONTACT } from '@/lib/site-contact'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Heina meeldetuletus | PetsVilla',
  description: 'Heina meeldetuletuse valikud.',
  robots: 'noindex, nofollow',
}

type PageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function MeeldetuletusValjaPage({ searchParams }: PageProps) {
  const params = await searchParams
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const result = await inspectHayReminderOptOut(notion, params.token)
  const view = hayReminderOptOutView(result)

  if (view === 'choice') {
    const unsubscribeAction = `/api/hay-reminder/unsubscribe?token=${encodeURIComponent(params.token || '')}`
    return (
      <LegalPageShell
        title="Heina meeldetuletus"
        subtitle="Vali, mida soovid teha"
        icon={<HelpCircle aria-hidden />}
        backHref="/telli-hein"
        backLabel="Tagasi heinatellimuse juurde"
      >
        <div className={legalCallout.brand}>
          <p>{HAY_REMINDER_OPT_OUT_CHOICE_TEXT}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={HAY_OPT_OUT_ORDER_URL}
            className="inline-flex items-center justify-center rounded-lg bg-[#1F6A4C] px-6 py-3 !text-white font-semibold hover:bg-[#19563d] hover:!text-white transition-colors no-underline"
          >
            Telli hein
          </Link>
          <form method="POST" action={unsubscribeAction}>
            <input type="hidden" name="confirm" value="1" />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#1F6A4C] bg-transparent px-6 py-3 text-[#1F6A4C] font-semibold hover:bg-[#E8DFD3] transition-colors"
            >
              Loobu meeldetuletustest
            </button>
          </form>
        </div>
      </LegalPageShell>
    )
  }

  const success = view === 'done'
  const title = success
    ? 'Meeldetuletus on tühistatud'
    : 'Meeldetuletust ei õnnestunud tühistada'
  const message = success
    ? HAY_REMINDER_OPT_OUT_MESSAGE
    : !result.ok &&
        (result.reason === 'missing-token' || result.reason === 'invalid-token')
      ? `Link on vigane või aegunud. Kui soovid meeldetuletuse tühistada, vasta viimasele kirjale või kirjuta ${SITE_CONTACT.email}.`
      : `Midagi läks valesti. Palun proovi uuesti või kirjuta ${SITE_CONTACT.email}.`

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
