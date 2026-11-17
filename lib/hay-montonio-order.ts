import type { BillingAddress } from '@/lib/montonio'
import { getSiteUrl } from '@/lib/site-url'

export const HAY_PAYMENT_METHOD = 'paymentInitiation'
export const HAY_PAYMENT_METHOD_DISPLAY = 'Pangalink'

export type HayMontonioCustomer = {
  name: string
  email: string
  phone: string
  hayQuantity: number
  guineaPigFoodKg: number
  rabbitFoodPacks: number
  totalPrice: number
  notes?: string
  address?: string
  city?: string
  postalCode?: string
}

export type HayMontonioLineItem = {
  name: string
  quantity: number
  finalPrice: number
}

export function resolveMontonioOrigin(requestOrigin?: string | null): string {
  let origin = requestOrigin || process.env.NEXT_PUBLIC_BASE_URL || ''

  if (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    !origin
  ) {
    origin = getSiteUrl()
  }

  return origin.replace(/\/+$/, '')
}

export function splitHayCustomerName(name: string): {
  firstName: string
  lastName: string
} {
  const nameParts = name.trim().split(/\s+/)
  const firstName = nameParts[0] || name
  const lastName = nameParts.slice(1).join(' ') || firstName
  return { firstName, lastName }
}

export function buildHayLineItems(
  input: HayMontonioCustomer
): HayMontonioLineItem[] {
  const lineItems: HayMontonioLineItem[] = [
    {
      name: `Lemmiklooma hein (${input.hayQuantity} kott${input.hayQuantity > 1 ? 'i' : ''})`,
      quantity: input.hayQuantity,
      finalPrice: input.hayQuantity * 9,
    },
  ]

  if (input.guineaPigFoodKg > 0) {
    lineItems.push({
      name: `Meriseatoit (${input.guineaPigFoodKg} kg)`,
      quantity: 1,
      finalPrice: input.guineaPigFoodKg * 9,
    })
  }

  if (input.rabbitFoodPacks > 0) {
    lineItems.push({
      name: `Küülikutoit (${input.rabbitFoodPacks} × 2 kg pakk)`,
      quantity: 1,
      finalPrice: input.rabbitFoodPacks * 6,
    })
  }

  return lineItems
}

export function buildHayBillingAddress(
  input: HayMontonioCustomer
): BillingAddress {
  const { firstName, lastName } = splitHayCustomerName(input.name)
  return {
    firstName,
    lastName,
    email: input.email,
    phoneNumber: input.phone,
    country: 'EE',
    ...(input.address ? { addressLine1: input.address } : {}),
    ...(input.city ? { locality: input.city } : {}),
    ...(input.postalCode ? { postalCode: input.postalCode } : {}),
  }
}

export function buildHayMontonioOrderData(
  input: HayMontonioCustomer & {
    merchantReference: string
    origin: string
  }
) {
  return {
    merchantReference: input.merchantReference,
    returnUrl: `${input.origin}/tellimus-kinnitatud?reference=${input.merchantReference}`,
    notificationUrl: `${input.origin}/api/montonio/callback`,
    currency: 'EUR',
    grandTotal: input.totalPrice,
    locale: 'et',
    billingAddress: buildHayBillingAddress(input),
    lineItems: buildHayLineItems(input),
    payment: {
      method: HAY_PAYMENT_METHOD,
      methodDisplay: HAY_PAYMENT_METHOD_DISPLAY,
      amount: input.totalPrice,
      currency: 'EUR',
      methodOptions: {
        paymentDescription: `Heinatellimus ${input.merchantReference}`,
        preferredCountry: 'EE',
      },
    },
  }
}
