

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
    // Format phone number automatically
    if (field === 'phone') {
      value = formatPhoneNumber(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Format phone number to ensure +372 prefix without spaces
  const formatPhoneNumber = (phone: string): string => {
    // Remove ALL spaces and non-digit characters except +
    let cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')
    
    // If starts with 372 (without +), add the +
    if (cleaned.startsWith('372')) {
      cleaned = '+' + cleaned
    }
    // If starts with a digit (like 5...), add +372
    else if (cleaned.length > 0 && /^\d/.test(cleaned)) {
      cleaned = '+372' + cleaned
    }
    // If already has + but not +372, keep as is
    
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || !formData.terminal || !formData.quantity) {
      toast.error('Palun täitke kõik kohustuslikud väljad')
      return
    }

    setIsSubmitting(true)

    try {
      // Check if Montonio payments are enabled
      const montonioEnabled = process.env.NEXT_PUBLIC_MONTONIO_ENABLED === 'true'
      
      if (montonioEnabled) {
        // MONTONIO WORKFLOW: Create payment order and redirect to payment page
        console.log('=== MONTONIO WORKFLOW STARTED ===')
        console.log('Creating Montonio order with data:', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          hayAmount: formData.quantity,
          guineaPigFood: formData.guineaPigFood,
          rabbitFood: formData.rabbitFood,
        })

        console.log('Calling /api/montonio/create-order...')
        const response = await fetch('/api/montonio/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            hayAmount: formData.quantity,
            guineaPigFood: formData.guineaPigFood,
            rabbitFood: formData.rabbitFood,
            deliveryMethod: 'smartpost',
            parcelMachine: formData.terminal,
            notes: formData.comments
          }),
        })

        console.log('=== API RESPONSE RECEIVED ===')
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
        const data = await response.json()
        console.log('Response data:', data)
        console.log('Payment URL:', data.paymentUrl)
        console.log('Merchant Reference:', data.merchantReference)
        console.log('UUID:', data.uuid)

        if (!response.ok) {
          console.error('❌ Order creation failed! Status:', response.status)
          console.error('Response data:', data)
          const errorMessage = data.details || data.error || 'Viga tellimuse loomisel. Palun proovige uuesti.'
          toast.error(errorMessage, { duration: 5000 })
          setIsSubmitting(false)
          return
        }

        console.log('✅ Response OK! Checking paymentUrl...')
        console.log('paymentUrl value:', data.paymentUrl)
        console.log('paymentUrl type:', typeof data.paymentUrl)
        console.log('paymentUrl exists:', !!data.paymentUrl)

        if (!data.paymentUrl) {
          console.error('❌ Payment URL missing from response!')
          console.error('Full response data:', JSON.stringify(data, null, 2))
          toast.error('Makselinki ei leitud. Palun proovige uuesti või võtke meiega ühendust.', { duration: 5000 })
          setIsSubmitting(false)
          return
        }

        console.log('✅ Order created successfully!')
        
        // Save order reference to sessionStorage for confirmation page
        sessionStorage.setItem('lastOrderReference', data.merchantReference || '')
        sessionStorage.setItem('lastOrderUuid', data.uuid || '')
        console.log('Saved to sessionStorage')
        console.log('Merchant Reference:', data.merchantReference)
        console.log('UUID:', data.uuid)
        
        console.log('🔄 Starting redirect to Montonio...')
        console.log('Payment URL:', data.paymentUrl)
        
        // Add a small delay to ensure logs are visible
        setTimeout(() => {
          console.log('Executing redirect NOW')
          // Redirect to Montonio payment page
          window.location.href = data.paymentUrl
        }, 100)
        
        console.log('Redirect scheduled (will execute in 100ms)')
      } else {
        // EMAIL-BASED WORKFLOW: Save order to Notion and show confirmation
        console.log('Saving order to Notion (email-based workflow):', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          quantity: formData.quantity,
          guineaPigFood: formData.guineaPigFood,
          rabbitFood: formData.rabbitFood,
        })

        const response = await fetch('/api/hay-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            terminal: formData.terminal,
            quantity: formData.quantity,
            guineaPigFood: formData.guineaPigFood,
            rabbitFood: formData.rabbitFood,
            comments: formData.comments
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Show success message
          toast.success('Tellimus edukalt saadetud! Saadame sulle emailiga makseinfo.', { duration: 5000 })
          
          // Redirect to confirmation page after 2 seconds
          setTimeout(() => {
            router.push('/tellimus-kinnitatud?payment=success')
          }, 2000)
        } else {
          console.error('Order creation failed:', data)
          const errorMessage = data.error || 'Viga tellimuse loomisel. Palun proovige uuesti.'
          toast.error(errorMessage, { duration: 5000 })
          setIsSubmitting(false)
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Viga tellimuse loomisel. Palun kontrollige internetiühendust ja proovige uuesti.', { duration: 5000 })
      setIsSubmitting(false)
    }
  }

  // Calculate total price:
  // - Hay: 9€ for 1 bag, 18€ for 2 bags, 27€ for 3+ bags
  // - Guinea pig food: 9€ per kg
  // - Rabbit food: 3€ per kg (6€ for 2kg package)
  // - Delivery: FREE (tarne hinna sees)
  const quantity = parseInt(formData.quantity || '1')
  const hayPrice = quantity === 1 ? 9 : quantity === 2 ? 18 : 27
  const guineaPigFoodPrice = parseFloat(formData.guineaPigFood || '0') * 9
  const rabbitFoodPrice = parseFloat(formData.rabbitFood || '0') * 3
  const deliveryPrice = 0 // FREE delivery
  const totalPrice = hayPrice + guineaPigFoodPrice + rabbitFoodPrice
  
  // Check if Montonio is enabled
  const montonioEnabled = process.env.NEXT_PUBLIC_MONTONIO_ENABLED === 'true'

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
            {montonioEnabled ? (
              <>
                Täida tellimuse vorm ja maksa turvaliselt läbi Montonio.
                Hind: 9€/kott (tarne hinna sees)
              </>
            ) : (
              <>
                Täida tellimuse vorm. Saadame sulle emailiga makseinfo.
                Hind: 9€/kott (tarne hinna sees)
              </>
            )}
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
                <p className="text-2xl font-bold text-green-600">TASUTA</p>
                <p className="text-sm text-gray-600">SmartPost</p>
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
                    Pärast vormi täitmist suunatakse teid Montonio makselehele, kus saate tasuda panga lingi või kaardiga.
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
                        placeholder="5XXX XXXX"
                        required
                        className="pl-4 text-gray-900 placeholder:text-gray-500"
                      />
                      <p className="text-xs text-gray-700 font-medium flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        +372 lisatakse automaatselt
                      </p>
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
                            Meriseatoit (kg, 9€/kg)
                          </Label>
                          <Input
                            id="guineaPigFood"
                            type="number"
                            min="0"
                            step="0.5"
                            value={formData.guineaPigFood}
                            onChange={(e) => handleInputChange('guineaPigFood', e.target.value)}
                            placeholder="0"
                            className="pl-4 text-gray-900 placeholder:text-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rabbitFood" className="text-gray-900 font-semibold flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-2 text-gray-600" />
                            Küülikutoit (kg, 3€/kg)
                          </Label>
                          <Input
                            id="rabbitFood"
                            type="number"
                            min="0"
                            step="0.5"
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
                            <span className="text-gray-700">Hein: {formData.quantity} kott{parseInt(formData.quantity) > 1 ? 'i' : ''}</span>
                            <span className="text-gray-900 font-semibold">{hayPrice.toFixed(2)}€</span>
                          </div>
                          {parseFloat(formData.guineaPigFood || '0') > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">Meriseatoit: {formData.guineaPigFood} kg × 9€</span>
                              <span className="text-gray-900 font-semibold">{guineaPigFoodPrice.toFixed(2)}€</span>
                            </div>
                          )}
                          {parseFloat(formData.rabbitFood || '0') > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">Küülikutoit: {formData.rabbitFood} kg × 3€</span>
                              <span className="text-gray-900 font-semibold">{rabbitFoodPrice.toFixed(2)}€</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">SmartPost tarne</span>
                            <span className="text-green-600 font-semibold">TASUTA</span>
                          </div>
                        </div>
                        <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                          <p className="text-gray-700 font-medium text-lg">Kogusumma:</p>
                          <p className="text-3xl font-bold text-green-700">{totalPrice.toFixed(2)}€</p>
                        </div>
                        <p className="text-xs text-gray-600 text-center">Makse toimub Montonio vahendusel</p>
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
                        <span>{montonioEnabled ? 'Loon makse linki...' : 'Saadan tellimust...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {montonioEnabled ? <ShoppingCart className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                        <span>{montonioEnabled ? 'Telli ja maksa' : 'Saada tellimus'}</span>
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
