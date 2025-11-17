

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Truck, MapPin, User, Mail, Phone, ShoppingCart, Send, Package, AlertCircle, Wheat } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function HayOrderForm() {
  const router = useRouter()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    terminal: '',
    quantity: '1',
    guineaPigFood: '0',
    rabbitFood: '0',
    comments: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || !formData.terminal || !formData.quantity) {
      toast.error('Palun täitke kõik kohustuslikud väljad')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement API endpoint for hay orders
      const response = await fetch('/api/hay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to confirmation page
        router.push('/tellimus-kinnitatud')
      } else {
        toast.error('Viga tellimuse saatmisel. Palun proovige uuesti.')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('Viga tellimuse saatmisel. Palun proovige uuesti.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total price:
  // - Hay: quantity * 9€
  // - Guinea pig food: guineaPigFood * 9€ per kg
  // - Rabbit food: sold in 2 kg packages at 6€ per package
  const hayPrice = parseInt(formData.quantity || '1') * 9
  const guineaPigFoodPrice = parseInt(formData.guineaPigFood || '0') * 9
  const rabbitFoodQuantity = parseInt(formData.rabbitFood || '0')
  const rabbitFoodPrice = rabbitFoodQuantity * 6  // 6€ per 2kg package
  const totalPrice = hayPrice + guineaPigFoodPrice + rabbitFoodPrice

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
            <Truck className="inline-block w-12 h-12 text-orange-500 mr-4" />
            Telli Hein
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Täida tellimuse vorm ja võtame sinuga peagi ühendust tellimuse kinnitamiseks.
            Hind: 9€/kott (sh Smartpost tarne üle Eesti)
          </p>
        </motion.div>

        {/* Product Info Cards */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Package className="w-5 h-5 text-yellow-600" />
                  <span>Maht</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">80L</p>
                <p className="text-sm text-gray-600">Viljakott</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Wheat className="w-5 h-5 text-green-600" />
                  <span>Kaal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">~4kg</p>
                <p className="text-sm text-gray-600">Kvaliteetne hein</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Truck className="w-5 h-5 text-orange-600" />
                  <span>Tarne</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">9€</p>
                <p className="text-sm text-gray-600">Smartpost</p>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-orange-200 bg-orange-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-orange-800 font-semibold">
                    Hind sisaldab heina ja Smartpost tarne maksumust. 
                    Pärast tellimuse saamist võtame teiega ühendust kinnitamiseks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Tellimuse andmed
                </CardTitle>
                <p className="text-gray-700">
                  Täitke vorm ja võtame teiega peagi ühendust
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900 font-semibold flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-600" />
                        Nimi *
                      </Label>
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
                      <Label htmlFor="email" className="text-gray-900 font-semibold flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-600" />
                        E-post *
                      </Label>
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
                      <Label htmlFor="phone" className="text-gray-900 font-semibold flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-600" />
                        Telefon *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+372 5XXX XXXX"
                        required
                        className="pl-4 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-gray-900 font-semibold flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2 text-gray-600" />
                        Hein (kotid) *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder="1"
                        required
                        className="pl-4 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Food Products Section */}
                  <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                        Vajadusel lisa ka toit
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="guineaPigFood" className="text-gray-900 font-semibold flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-2 text-gray-600" />
                            Meriseatoit (1 kg 9 eur)
                          </Label>
                          <Input
                            id="guineaPigFood"
                            type="number"
                            min="0"
                            value={formData.guineaPigFood}
                            onChange={(e) => handleInputChange('guineaPigFood', e.target.value)}
                            placeholder="0"
                            className="pl-4 text-gray-900 placeholder:text-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rabbitFood" className="text-gray-900 font-semibold flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-2 text-gray-600" />
                            Küülikutoit (2 kg pakend 6 eur)
                          </Label>
                          <Input
                            id="rabbitFood"
                            type="number"
                            min="0"
                            value={formData.rabbitFood}
                            onChange={(e) => handleInputChange('rabbitFood', e.target.value)}
                            placeholder="0"
                            className="pl-4 text-gray-900 placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="terminal" className="text-gray-900 font-semibold flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                      Smartpost Pakiautomaat *
                    </Label>
                    <Input
                      id="terminal"
                      value={formData.terminal}
                      onChange={(e) => handleInputChange('terminal', e.target.value)}
                      placeholder="Nt. Tartu Lõunakeskus Smartpost pakiautomaat"
                      required
                      className="pl-4 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments" className="text-gray-900 font-semibold">
                      Kommentaar (valikuline)
                    </Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => handleInputChange('comments', e.target.value)}
                      placeholder="Lisainfo või küsimused..."
                      rows={4}
                      className="pl-4 pt-3 resize-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  {/* Price Summary */}
                  <Card className="bg-gradient-to-r from-yellow-100 to-green-100 border-0">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">Hein: {formData.quantity} kott × 9€</span>
                            <span className="text-gray-900 font-semibold">{hayPrice}€</span>
                          </div>
                          {parseInt(formData.guineaPigFood || '0') > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">Meriseatoit: {formData.guineaPigFood} kg × 9€</span>
                              <span className="text-gray-900 font-semibold">{guineaPigFoodPrice}€</span>
                            </div>
                          )}
                          {parseInt(formData.rabbitFood || '0') > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">Küülikutoit: {formData.rabbitFood} × 2 kg pakend (6€)</span>
                              <span className="text-gray-900 font-semibold">{rabbitFoodPrice}€</span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                          <p className="text-gray-700 font-medium text-lg">Kogusumma:</p>
                          <p className="text-3xl font-bold text-green-700">{totalPrice}€</p>
                        </div>
                        <p className="text-xs text-gray-600 text-center">Hein hind sisaldab Smartpost tarnet</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white py-4 text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saadan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Saada tellimus</span>
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
