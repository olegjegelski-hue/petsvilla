import { formatPhoneNumber } from '@/lib/phone'

export type HayOrderInput = {
  name?: unknown
  email?: unknown
  phone?: unknown
  terminal?: unknown
  quantity?: unknown
  guineaPigFood?: unknown
  rabbitFood?: unknown
  comments?: unknown
  /** Montonio create-order väljad */
  hayAmount?: unknown
  parcelMachine?: unknown
  notes?: unknown
  website?: unknown
  formStartedAt?: unknown
}

export type HayOrderValidated = {
  name: string
  email: string
  phone: string
  terminal: string
  quantity: number
  guineaPigFood: number
  rabbitFood: number
  comments: string
  totalPrice: number
}

export type HayOrderValidationResult =
  | { ok: true; data: HayOrderValidated; honeypot?: boolean }
  | { ok: false; error: string; status: number }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseNonNegInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value ?? fallback), 10)
  if (Number.isNaN(n) || n < 0) return fallback
  return n
}

/**
 * Heina / Montonio tellimuse valideerimine + honeypot.
 * Toetab nii /api/hay-order (quantity, terminal) kui create-order (hayAmount, parcelMachine).
 */
export function validateHayOrderForm(
  body: HayOrderInput,
  now = Date.now()
): HayOrderValidationResult {
  if (body.website && String(body.website).trim().length > 0) {
    return {
      ok: true,
      honeypot: true,
      data: {
        name: '',
        email: '',
        phone: '',
        terminal: '',
        quantity: 0,
        guineaPigFood: 0,
        rabbitFood: 0,
        comments: '',
        totalPrice: 0,
      },
    }
  }

  if (body.formStartedAt && now - Number(body.formStartedAt) < 3000) {
    return { ok: false, error: 'Palun proovi uuesti.', status: 400 }
  }

  const name = body.name ? String(body.name).trim() : ''
  const email = body.email ? String(body.email).trim().toLowerCase() : ''
  const phoneRaw = body.phone ? String(body.phone).trim() : ''
  const terminal = String(
    body.terminal || body.parcelMachine || ''
  ).trim()
  const comments = String(body.comments || body.notes || '').trim()
  const quantity = parseNonNegInt(body.quantity ?? body.hayAmount, 0)
  const guineaPigFood = parseNonNegInt(body.guineaPigFood, 0)
  const rabbitFood = parseNonNegInt(body.rabbitFood, 0)

  if (!name || !email || !phoneRaw || !terminal || quantity <= 0) {
    return {
      ok: false,
      error: 'Palun täitke kõik kohustuslikud väljad',
      status: 400,
    }
  }

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: 'Nimi peab olema 2–120 tähemärki.', status: 400 }
  }

  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return {
      ok: false,
      error: 'Palun sisesta korrektne e-posti aadress.',
      status: 400,
    }
  }

  if (terminal.length > 200) {
    return { ok: false, error: 'Terminali nimi on liiga pikk.', status: 400 }
  }

  if (comments.length > 1000) {
    return { ok: false, error: 'Kommentaar on liiga pikk.', status: 400 }
  }

  if (quantity > 50 || guineaPigFood > 50 || rabbitFood > 50) {
    return { ok: false, error: 'Kogus on liiga suur.', status: 400 }
  }

  const phone = formatPhoneNumber(phoneRaw)
  if (!/^\+?\d{8,15}$/.test(phone.replace(/\s/g, ''))) {
    return {
      ok: false,
      error: 'Telefoninumber on vigase formaadiga.',
      status: 400,
    }
  }

  const totalPrice = quantity * 9 + guineaPigFood * 9 + rabbitFood * 6

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      terminal,
      quantity,
      guineaPigFood,
      rabbitFood,
      comments,
      totalPrice,
    },
  }
}
