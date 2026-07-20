'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  applyGtagConsent,
  onCookieSettingsOpen,
  readConsent,
  writeConsent,
} from '@/lib/cookie-consent'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    const openSettings = () => {
      const current = readConsent()
      setAnalytics(current?.analytics ?? false)
      setShowDetails(true)
      setShowBanner(true)
    }

    const unsubSettings = onCookieSettingsOpen(openSettings)
    const saved = readConsent()

    if (!saved) {
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => {
        clearTimeout(timer)
        unsubSettings()
      }
    }

    setAnalytics(saved.analytics)
    applyGtagConsent(saved.analytics)
    // gtag võib laadida pärast esimest paint'i — korda Consent Mode update
    const retry = setTimeout(() => applyGtagConsent(saved.analytics), 700)

    return () => {
      clearTimeout(retry)
      unsubSettings()
    }
  }, [])

  const save = (nextAnalytics: boolean) => {
    writeConsent(nextAnalytics)
    setAnalytics(nextAnalytics)
    setShowDetails(false)
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-label="Küpsiste nõusolek"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Cookie className="h-8 w-8 text-green-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Küpsiste kasutamine
                    </h3>

                    <div className="text-gray-700 space-y-2 mb-4">
                      <p>
                        Kasutame küpsiseid, et parandada veebilehe kasutuskogemust,
                        analüüsida liiklust (Google Analytics) ja mõõta reklaamide
                        tulemuslikkust (Meta Pixel). Saate valida, millised on lubatud.
                      </p>

                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-3 text-sm"
                        >
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-2">
                              Vajalikud küpsised
                            </h4>
                            <p className="text-gray-700">
                              Veebilehe põhifunktsioonide jaoks hädavajalikud; neid ei
                              saa keelata.
                            </p>
                          </div>

                          <label className="flex items-start justify-between gap-4 cursor-pointer bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-2">
                                Analüütika ja turundus
                              </h4>
                              <p className="text-gray-700">
                                Google Analytics (GA4) ja Meta Pixel — aitavad mõista
                                külastusi ja reklaamide tulemuslikkust. Lubatakse ainult
                                pärast teie nõusolekut.
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              className="mt-1 h-5 w-5 rounded border-gray-300 accent-green-600"
                              checked={analytics}
                              onChange={(e) => setAnalytics(e.target.checked)}
                              aria-label="Analüütika ja turundus"
                            />
                          </label>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      {!showDetails ? (
                        <>
                          <Button
                            onClick={() => save(true)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
                          >
                            Nõustun kõigiga
                          </Button>

                          <Button
                            onClick={() => save(false)}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100 font-semibold px-6"
                          >
                            Ainult vajalikud
                          </Button>

                          <button
                            type="button"
                            onClick={() => setShowDetails(true)}
                            className="text-green-700 hover:text-green-800 font-medium underline text-sm"
                          >
                            Seaded
                          </button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => save(false)}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100 font-semibold px-6"
                          >
                            Ainult vajalikud
                          </Button>

                          <Button
                            onClick={() => save(analytics)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
                          >
                            Salvesta valikud
                          </Button>
                        </>
                      )}

                      <Link
                        href="/privaatsuspoliitika"
                        className="text-green-700 hover:text-green-800 font-medium underline text-sm"
                      >
                        Privaatsuspoliitika
                      </Link>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => save(false)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Sulge (ainult vajalikud)"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
