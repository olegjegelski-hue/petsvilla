'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ConsentPreferences = {
  necessary: boolean
  analytics: boolean
  timestamp: number
}

const CONSENT_KEY = 'petsvilla_cookie_consent'
const CONSENT_VERSION = '1.0'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(CONSENT_KEY)
    
    if (!savedConsent) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    } else {
      // Apply saved consent preferences
      try {
        const consent: ConsentPreferences = JSON.parse(savedConsent)
        applyConsent(consent)
      } catch (e) {
        // If parsing fails, show banner again
        setShowBanner(true)
      }
    }
  }, [])

  const applyConsent = (preferences: ConsentPreferences) => {
    // Update GA4 consent mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: 'denied', // We don't use ads
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
    }
  }

  const saveConsent = (analytics: boolean) => {
    const preferences: ConsentPreferences = {
      necessary: true, // Always true
      analytics,
      timestamp: Date.now(),
    }

    localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences))
    applyConsent(preferences)
    setShowBanner(false)
  }

  const acceptAll = () => {
    saveConsent(true)
  }

  const acceptNecessary = () => {
    saveConsent(false)
  }

  const acceptSelected = () => {
    // For now, just analytics toggle (can be expanded)
    saveConsent(true) // Default to accepting analytics if they click "Salvesta valikud"
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
                      🍪 Küpsiste Kasutamine
                    </h3>
                    
                    <div className="text-gray-700 space-y-2 mb-4">
                      <p>
                        Kasutame küpsiseid, et parandada teie veebilehe kasutuskogemust ja analüüsida liiklust. 
                        Saate valida, millised küpsised on lubatud.
                      </p>
                      
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-3 text-sm"
                        >
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-2">✅ Vajalikud Küpsised</h4>
                            <p className="text-gray-700">
                              Need küpsised on veebilehe põhifunktsioonide jaoks hädavajalikud ja neid ei saa keelata.
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">📊 Analüütilised Küpsised (Google Analytics)</h4>
                            <p className="text-gray-700">
                              Aitavad meil mõista, kuidas külastajad kasutavad meie veebilehte, et saaksime seda paremaks muuta. 
                              Kõik andmed on anonüümsed.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <Button
                        onClick={acceptAll}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
                      >
                        Nõustun kõigiga
                      </Button>
                      
                      <Button
                        onClick={acceptNecessary}
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100 font-semibold px-6"
                      >
                        Ainult vajalikud
                      </Button>
                      
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-green-700 hover:text-green-800 font-medium underline text-sm"
                      >
                        {showDetails ? 'Peida detailid' : 'Vaata detaile'}
                      </button>
                      
                      <Link
                        href="/privaatsuspoliitika"
                        className="text-green-700 hover:text-green-800 font-medium underline text-sm"
                      >
                        Privaatsuspoliitika
                      </Link>
                    </div>
                  </div>
                  
                  <button
                    onClick={acceptNecessary}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Sulge"
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

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'consent',
      action: 'default' | 'update',
      params: {
        analytics_storage?: 'granted' | 'denied'
        ad_storage?: 'granted' | 'denied'
        ad_user_data?: 'granted' | 'denied'
        ad_personalization?: 'granted' | 'denied'
        wait_for_update?: number
      }
    ) => void
  }
}
