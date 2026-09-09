import type { Client } from '@notionhq/client'
import { createMontonioShipment } from '@/lib/montonio-shipping'
import { sendHayOrderEmail } from '@/lib/email'
import {
  appendMetaPurchaseMarker,
  calculateHayOrderNumItems,
  getClientIpFromHeaders,
  hasMetaPurchaseBeenSent,
  sendMetaPurchaseEvent,
} from '@/lib/meta-capi-server'
import {
  decodeMontonioOrderToken,
  getMontonioPaymentStatus,
  isPaidMontonioStatus,
  mapMontonioStatusToNotion,
  nextHayOrderStatus,
  parseMontonioAmount,
  type MontonioOrderTokenPayload,
} from '@/lib/montonio-payment'
import { getSiteUrl } from '@/lib/site-url'
import { reportError } from '@/lib/report-error'

const EMAIL_MARKER = /Email sent:/i
const TRACKING_MARKER = /Tracking:/i
const SHIPMENT_MARKER = /Shipment created:|Shipment creating:/i

type NotionPage = {
  id: string
  properties: Record<string, any>
}

export type HayOrderSnapshot = {
  pageId: string
  name: string
  email: string
  phone: string
  terminal: string
  comments: string
  status: string | null
  paidCheckbox: boolean
  paymentSelect: string | null
  hayQuantity: number
  guineaPigFoodKg: number
  rabbitFoodKg: number
  totalPrice: number
  pickupPointUuid: string | null
}

export type ProcessHayPaymentResult = {
  paid: boolean
  paymentStatus: string
  merchantReference: string
  uuid?: string
  purchase?: {
    orderId: string
    value: number
    currency: string
    email: string
    phone: string
    numItems: number
  }
  shipments: Array<{
    success: boolean
    trackingCode?: string
    error?: string
  }>
}

function readTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text || ''
}

function readRichText(prop: any): string {
  const parts = prop?.rich_text
  if (!Array.isArray(parts) || parts.length === 0) return ''
  return parts.map((block: { plain_text?: string }) => block.plain_text || '').join('')
}

function readSelect(prop: any): string | null {
  return prop?.select?.name || null
}

export async function findHayOrderByReference(
  notion: Client,
  merchantReference: string
): Promise<NotionPage | null> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_HAY_DATABASE_ID!,
    filter: {
      property: 'Comments',
      rich_text: {
        contains: merchantReference,
      },
    },
  })

  if (response.results.length === 0) return null
  return response.results[0] as NotionPage
}

export function snapshotHayOrder(page: NotionPage): HayOrderSnapshot {
  const props = page.properties
  const comments = readRichText(props.Comments)
  const uuidMatch = comments.match(/Pickup Point UUID: ([a-zA-Z0-9-]+)/)

  return {
    pageId: page.id,
    name: readTitle(props.Name) || 'Klient',
    email: props.Email?.email || '',
    phone: props.Phone?.phone_number || '',
    terminal: readRichText(props.Terminal) || 'Määramata',
    comments,
    status: readSelect(props.Status),
    paidCheckbox: Boolean(props.Makse?.checkbox),
    paymentSelect: readSelect(props['Makse staatus']),
    hayQuantity: props['Quantity (pakkide arv)']?.number || 1,
    guineaPigFoodKg: props['Meriseatoit (kg)']?.number || 0,
    rabbitFoodKg: props['Küülikutoit (kg)']?.number || 0,
    totalPrice: props['Total Price (EUR)']?.number || 0,
    pickupPointUuid: uuidMatch ? uuidMatch[1] : null,
  }
}

function commentHasUuid(comments: string, uuid: string | undefined): boolean {
  if (!uuid) return true
  return comments.includes(uuid)
}

async function replaceComments(
  notion: Client,
  pageId: string,
  comments: string
) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Comments: {
        rich_text: [{ text: { content: comments.slice(0, 2000) } }],
      },
    },
  })
}

async function updatePaymentFields(
  notion: Client,
  pageId: string,
  snapshot: HayOrderSnapshot,
  decoded: MontonioOrderTokenPayload,
  paymentStatus: string
) {
  const mapped = mapMontonioStatusToNotion(paymentStatus)
  const alreadyPaid =
    snapshot.paidCheckbox || snapshot.paymentSelect === 'Makstud'
  const nextStatus = nextHayOrderStatus({
    currentStatus: snapshot.status,
    alreadyPaid,
    mapped,
  })

  const paidCheckbox = mapped.paid
    ? true
    : mapped.paymentSelect === 'Tühistatud'
      ? false
      : alreadyPaid
  const paymentSelect =
    alreadyPaid && !mapped.paid && mapped.paymentSelect !== 'Tühistatud'
      ? 'Makstud'
      : mapped.paymentSelect

  const properties: Record<string, unknown> = {
    Makse: { checkbox: paidCheckbox },
    'Makse staatus': { select: { name: paymentSelect } },
  }

  if (nextStatus) {
    properties.Status = { select: { name: nextStatus } }
  }

  if (decoded.uuid) {
    properties['Montonio UUID'] = {
      rich_text: [{ text: { content: decoded.uuid } }],
    }
  }

  await notion.pages.update({
    page_id: pageId,
    properties: properties as any,
  })
}

async function sendPaidEmailOnce(
  notion: Client,
  snapshot: HayOrderSnapshot
): Promise<string> {
  if (EMAIL_MARKER.test(snapshot.comments)) return snapshot.comments

  const marked = `${snapshot.comments}\n\nEmail sent: ${new Date().toISOString()}`
  await replaceComments(notion, snapshot.pageId, marked)

  const rabbitFoodPacks = snapshot.rabbitFoodKg > 0 ? snapshot.rabbitFoodKg / 2 : 0

  try {
    await sendHayOrderEmail({
      name: snapshot.name,
      email: snapshot.email,
      phone: snapshot.phone,
      terminal: snapshot.terminal,
      quantity: snapshot.hayQuantity,
      guineaPigFood: snapshot.guineaPigFoodKg,
      rabbitFood: rabbitFoodPacks,
      totalPrice: snapshot.totalPrice,
      comments: snapshot.comments,
    })
  } catch (error) {
    reportError(error, { tags: { area: 'email', route: 'hay-order-paid' } })
  }

  return marked
}

async function createShipmentsOnce(
  notion: Client,
  snapshot: HayOrderSnapshot,
  merchantReference: string,
  comments: string
): Promise<{
  comments: string
  shipments: ProcessHayPaymentResult['shipments']
}> {
  if (!snapshot.pickupPointUuid) {
    return { comments, shipments: [] }
  }

  if (TRACKING_MARKER.test(comments) || SHIPMENT_MARKER.test(comments)) {
    return { comments, shipments: [] }
  }

  const preflight = `${comments}\n\nShipment creating: ${new Date().toISOString()}`
  await replaceComments(notion, snapshot.pageId, preflight)

  const nameParts = snapshot.name.split(' ')
  const firstName = nameParts[0] || snapshot.name
  const lastName = nameParts.slice(1).join(' ') || firstName
  const trackingCodes: string[] = []
  const shipments: ProcessHayPaymentResult['shipments'] = []

  for (let i = 0; i < snapshot.hayQuantity; i++) {
    const shipmentRef =
      snapshot.hayQuantity > 1 ? `${merchantReference}-${i + 1}` : merchantReference

    const result = await createMontonioShipment({
      merchantReference: shipmentRef,
      pickupPointUuid: snapshot.pickupPointUuid,
      shippingFirstName: firstName,
      shippingLastName: lastName,
      shippingEmail: snapshot.email,
      shippingPhone: snapshot.phone,
      parcelCount: 1,
    })

    shipments.push(result)
    if (result.success && result.trackingCode) {
      trackingCodes.push(result.trackingCode)
    }
  }

  if (trackingCodes.length > 0) {
    const trackingInfo = trackingCodes
      .map((code, i) => `Pakk ${i + 1}: ${code}`)
      .join('\n')
    const updated = `${comments}\n\nTracking:\n${trackingInfo}\nShipment created: ${new Date().toISOString()}`
    await replaceComments(notion, snapshot.pageId, updated)
    return { comments: updated, shipments }
  }

  return { comments: preflight, shipments }
}

export async function processMontonioHayOrderPayment(input: {
  notion: Client
  token: string
  requestHeaders?: Headers
  sendMeta?: boolean
}): Promise<ProcessHayPaymentResult> {
  const decoded = decodeMontonioOrderToken(input.token)
  const paymentStatus = getMontonioPaymentStatus(decoded)
  const merchantReference = decoded.merchantReference || ''

  if (!merchantReference) {
    throw new Error('Montonio tokenis puudub merchantReference')
  }

  const expectedAccessKey = process.env.MONTONIO_ACCESS_KEY
  if (expectedAccessKey && decoded.accessKey && decoded.accessKey !== expectedAccessKey) {
    throw new Error('Montonio tokeni accessKey ei kattu')
  }

  const page = await findHayOrderByReference(input.notion, merchantReference)
  if (!page) {
    throw new Error(`Tellimust ei leitud: ${merchantReference}`)
  }

  const snapshot = snapshotHayOrder(page)
  if (!commentHasUuid(snapshot.comments, decoded.uuid)) {
    throw new Error('Montonio UUID ei kattu tellimusega')
  }

  await updatePaymentFields(
    input.notion,
    snapshot.pageId,
    snapshot,
    decoded,
    paymentStatus
  )

  const result: ProcessHayPaymentResult = {
    paid: isPaidMontonioStatus(paymentStatus),
    paymentStatus,
    merchantReference,
    uuid: decoded.uuid,
    shipments: [],
  }

  if (!result.paid) {
    return result
  }

  let comments = await sendPaidEmailOnce(input.notion, snapshot)
  const shipmentOutcome = await createShipmentsOnce(
    input.notion,
    { ...snapshot, comments },
    merchantReference,
    comments
  )
  comments = shipmentOutcome.comments
  result.shipments = shipmentOutcome.shipments

  const value = snapshot.totalPrice || parseMontonioAmount(decoded) || 0
  const currency = decoded.currency || 'EUR'
  const numItems = calculateHayOrderNumItems({
    hayQuantity: snapshot.hayQuantity,
    guineaPigFoodKg: snapshot.guineaPigFoodKg,
    rabbitFoodKg: snapshot.rabbitFoodKg,
  })

  result.purchase = {
    orderId: merchantReference,
    value,
    currency,
    email: snapshot.email,
    phone: snapshot.phone,
    numItems,
  }

  if (input.sendMeta && input.requestHeaders && !hasMetaPurchaseBeenSent(comments)) {
    const metaResult = await sendMetaPurchaseEvent({
      orderId: merchantReference,
      value,
      currency,
      email: snapshot.email,
      phone: snapshot.phone,
      numItems,
      eventSourceUrl: `${getSiteUrl()}/tellimus-kinnitatud?reference=${merchantReference}`,
      clientIpAddress: getClientIpFromHeaders(input.requestHeaders),
      clientUserAgent: input.requestHeaders.get('user-agent') || undefined,
    })

    if (metaResult.success) {
      await replaceComments(
        input.notion,
        snapshot.pageId,
        appendMetaPurchaseMarker(comments)
      )
    }
  }

  return result
}
