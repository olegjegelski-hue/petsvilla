'use client'

import { useState } from 'react'
import { Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HayBankLinkHelp } from '@/components/hay-bank-link-help'
import { SITE_CONTACT } from '@/lib/site-contact'

export function HayRetryPaymentButton({
  token,
  label = 'Proovi uuesti',
  showHelpOnError = true,
}: {
  token: string
  label?: string
  showHelpOnError?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startRetry = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/montonio/retry-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await response.json().catch(() => ({}))

      if (data?.reason === 'paid' && data.merchantReference) {
        window.location.href = `/tellimus-kinnitatud?payment=success&reference=${encodeURIComponent(data.merchantReference)}`
        return
      }

      if (!response.ok || !data?.paymentUrl) {
        setError(
          typeof data?.error === 'string'
            ? data.error
            : `Makset ei õnnestunud uuesti alustada. Palun proovi uuesti või kirjuta ${SITE_CONTACT.email}.`
        )
        setLoading(false)
        return
      }

      window.location.href = data.paymentUrl
    } catch {
      setError(
        `Makset ei õnnestunud uuesti alustada. Palun proovi uuesti või kirjuta ${SITE_CONTACT.email}.`
      )
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="flex items-center gap-2"
        onClick={startRetry}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Package className="w-5 h-5" />
        )}
        {loading ? 'Suunan makselehele…' : label}
      </Button>
      {error ? (
        <>
          <p className="text-sm text-orange-700 max-w-md text-center">{error}</p>
          {showHelpOnError ? <HayBankLinkHelp /> : null}
        </>
      ) : null}
    </div>
  )
}
