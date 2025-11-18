
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Heart, Bird, Wheat, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'

export function ContactForm() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    product: ''
  })

  // Load guinea pig info from URL params
  useEffect(() => {
    const pigName = searchParams.get('pig')
    const pigId = searchParams.get('id')
    
    if (pigName) {
      setFormData(prev => ({
        ...prev,
        product: 'merisead',
        subject: `Päring merisea ${pigName} kohta`,
        message: `Tere! Olen huvitatud meriseast nimega "${pigName}". Palun saatke mulle rohkem infot.`
      }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Palun täitke kõik kohustuslikud väljad')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to success page
        router.push('/sonum-saadetud')
      } else {
        toast.error('Viga sõnumi saatmisel. Palun proovige uuesti.')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Viga sõnumi saatmisel. Palun proovige uuesti.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            <MessageSquare className="inline-block w-12 h-12 text-orange-500 mr-4" />
            Kontakt
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Võtke meiega ühendust meie lemmikloomade ja toodete kohta. 
            Oleme siin, et aidata leida teile sobiv lemmikloom.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>Asukoht</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Külastage meid:</p>
                <p className="text-lg font-semibold text-gray-900">Tartu mnt 80, Soinaste</p>
                <p className="text-sm text-gray-500 mt-1">Kambja vald, Tartumaa 61709</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span>Telefon</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Helistage meile:</p>
                <a href="tel:+3725127938" className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition-colors">
                  +372 512 7938
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-red-200 bg-red-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 font-semibold text-lg">
                    Enne kohale tulekut kindlasti helistada ja kokku leppida.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Saada meile sõnum
                </CardTitle>
                <p className="text-gray-700">
                  Täitke vorm ja võtame teiega peagi ühendust
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900 font-semibold">Nimi *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Teie nimi"
                        required
                        className="pl-4 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900 font-semibold">E-post *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="teie@email.ee"
                        required
                        className="pl-4 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-900 font-semibold">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+372 XXX XXXX"
                        className="pl-4 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-gray-900 font-semibold">Huvitab toode</Label>
                      <Select 
                        value={formData.product || undefined}
                        onValueChange={(value) => handleInputChange('product', value)}
                      >
                        <SelectTrigger className="text-gray-900">
                          <SelectValue placeholder="Valige toode" className="text-gray-500" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="merisead">
                            <div className="flex items-center space-x-2">
                              <Heart className="w-4 h-4 text-pink-500" />
                              <span>Merisead</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="viirpapagoid">
                            <div className="flex items-center space-x-2">
                              <Bird className="w-4 h-4 text-blue-500" />
                              <span>Viirpapagoid</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="hein">
                            <div className="flex items-center space-x-2">
                              <Wheat className="w-4 h-4 text-yellow-600" />
                              <span>Hein</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="üldine">Üldine päring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-900 font-semibold">Teema</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Sõnumi teema"
                      className="pl-4 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-900 font-semibold">Sõnum *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Kirjutage oma sõnum siia..."
                      rows={6}
                      required
                      className="pl-4 pt-3 resize-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white py-4 text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saadan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Saada sõnum</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
