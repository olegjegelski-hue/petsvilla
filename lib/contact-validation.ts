/**
 * Kontaktivormi sisendi valideerimine (puhas funktsioon — testitav).
 */

export type ContactFormInput = {
  name?: unknown
  email?: unknown
  phone?: unknown
  subject?: unknown
  message?: unknown
  product?: unknown
  website?: unknown
  formStartedAt?: unknown
}

export type ContactFormValidated = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  product?: string
}

export type ContactValidationResult =
  | { ok: true; data: ContactFormValidated; honeypot?: boolean }
  | { ok: false; error: string; status: number }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Valideeri kontaktivorm. Honeypot tabamus → ok:true + honeypot (API vastab 200 ilma meilita).
 */
export function validateContactForm(
  body: ContactFormInput,
  now = Date.now()
): ContactValidationResult {
  // Honeypot — botid täidavad peidetud välja
  if (body.website && String(body.website).trim().length > 0) {
    return {
      ok: true,
      honeypot: true,
      data: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      },
    }
  }

  if (body.formStartedAt && now - Number(body.formStartedAt) < 3000) {
    return { ok: false, error: 'Palun proovi uuesti.', status: 400 }
  }

  if (!body.name || !body.email || !body.message) {
    return {
      ok: false,
      error: 'Nimi, e-post ja sõnum on kohustuslikud',
      status: 400,
    }
  }

  const name = String(body.name).trim()
  const email = String(body.email).trim().toLowerCase()
  const message = String(body.message).trim()
  const subject = body.subject ? String(body.subject).trim() : ''
  const phone = body.phone ? String(body.phone).trim() : ''
  const product = body.product ? String(body.product).trim() : undefined

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

  if (message.length < 10 || message.length > 2000) {
    return {
      ok: false,
      error: 'Sõnum peab olema 10–2000 tähemärki.',
      status: 400,
    }
  }

  if (subject.length > 120) {
    return { ok: false, error: 'Teema on liiga pikk.', status: 400 }
  }

  if (phone && !/^[+\d\s\-()]{5,20}$/.test(phone)) {
    return {
      ok: false,
      error: 'Telefoninumber on vigase formaadiga.',
      status: 400,
    }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      subject,
      message,
      product: product || undefined,
    },
  }
}
