/**
 * E-kirjade HTML/tekst koostamine (ilma SMTP-ta — testitav).
 */

import {
  buildFacebookGroupsInviteHtml,
  buildFacebookGroupsInviteText,
} from '@/lib/facebook-groups'
import { HAY_REMINDER_ORDER_URL } from '@/lib/hay-reminder'

const BRAND_GREEN = '#2F6F4E'

export function buildContactEmailContent(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  product?: string
}): { subject: string; html: string; text: string } {
  const subject = `Kontaktivorm: ${data.subject || 'Uus päring'} - ${data.name}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 3px solid #f97316; padding-bottom: 10px;">
        Uus kontaktivormi päring
      </h2>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>Nimi:</strong> ${data.name}</p>
        <p style="margin: 10px 0;"><strong>E-post:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p style="margin: 10px 0;"><strong>Telefon:</strong> ${data.phone}</p>` : ''}
        ${data.subject ? `<p style="margin: 10px 0;"><strong>Teema:</strong> ${data.subject}</p>` : ''}
        ${data.product ? `<p style="margin: 10px 0;"><strong>Toode:</strong> ${data.product}</p>` : ''}
      </div>
      
      <div style="background-color: #fff; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Sõnum:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
      
      <div style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>PetsVilla OÜ - petsvilla.ee</p>
      </div>
    </div>
  `

  const text = `
Uus kontaktivormi päring

Nimi: ${data.name}
E-post: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}
${data.subject ? `Teema: ${data.subject}` : ''}
${data.product ? `Toode: ${data.product}` : ''}

Sõnum:
${data.message}
  `.trim()

  return { subject, html, text }
}

export function buildHayOrderEmailContent(data: {
  name: string
  email: string
  phone: string
  terminal: string
  quantity: number
  guineaPigFood: number
  rabbitFood: number
  totalPrice: number
  comments?: string
}): { subject: string; html: string; text: string } {
  const subject = `🌾 Heinatellimus kinnitus: ${data.quantity} pakki - ${data.name}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>✅ Heinatellimus kinnitatud</h2>
      <p>Aitäh tellimuse eest! Pakk jõuab sinuni tavaliselt 1–3 tööpäeva jooksul.</p>
      <p><strong>Nimi:</strong> ${data.name}</p>
      <p><strong>E-post:</strong> ${data.email}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>SmartPost terminal:</strong> ${data.terminal}</p>
      <p><strong>Hein (kotid):</strong> ${data.quantity} pakki</p>
      ${data.guineaPigFood > 0 ? `<p><strong>Meriseatoit:</strong> ${data.guineaPigFood} kg</p>` : ''}
      ${data.rabbitFood > 0 ? `<p><strong>Küülikutoit:</strong> ${data.rabbitFood} × 2 kg</p>` : ''}
      <p><strong>Summa:</strong> ${data.totalPrice}€</p>
      ${data.comments ? `<p><strong>Kommentaarid:</strong> ${data.comments}</p>` : ''}
      ${buildFacebookGroupsInviteHtml()}
      <div style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>PetsVilla OÜ - petsvilla.ee</p>
      </div>
    </div>
  `

  const text = `
✅ HEINATELLIMUS KINNITATUD
Aitäh tellimuse eest! Pakk jõuab sinuni tavaliselt 1–3 tööpäeva jooksul.
Nimi: ${data.name}
E-post: ${data.email}
Telefon: ${data.phone}
SmartPost: ${data.terminal}
Hein: ${data.quantity} pakki
Summa: ${data.totalPrice}€

${buildFacebookGroupsInviteText()}

PetsVilla OÜ - petsvilla.ee
  `.trim()

  return { subject, html, text }
}

export function buildHayReminderEmailContent(data: {
  optOutUrl: string
}): { subject: string; html: string; text: string } {
  const subject = 'Kas hein hakkab otsa saama? 🌾'
  const orderUrl = HAY_REMINDER_ORDER_URL
  const optOutUrl = data.optOutUrl

  const html = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;margin:0;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333333;">
            <tr>
              <td style="background-color:${BRAND_GREEN};color:#ffffff;padding:24px 28px;font-size:22px;font-weight:bold;">
                PetsVilla
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Tere!</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.5;">
                  Mõne nädala eest tellisid PetsVilla heina. Kui varu hakkab lõppema, saad uue koti tellida siit:
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="background-color:${BRAND_GREEN};border-radius:6px;">
                      <a href="${orderUrl}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                        Telli hein
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:16px;line-height:1.5;">
                  Pakk jõuab tavaliselt 1–3 tööpäeva jooksul.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 28px;border-top:1px solid #e5e7eb;font-size:13px;line-height:1.5;color:#6b7280;">
                <p style="margin:0 0 8px;">PetsVilla OÜ · petsvilla.ee</p>
                <p style="margin:0;">
                  <a href="${optOutUrl}" style="color:${BRAND_GREEN};text-decoration:underline;">Ära enam meelde tuleta</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim()

  const text = `
Tere!

Mõne nädala eest tellisid PetsVilla heina. Kui varu hakkab lõppema, saad uue koti tellida siit:
${orderUrl}

Pakk jõuab tavaliselt 1–3 tööpäeva jooksul.

Ära enam meelde tuleta: ${optOutUrl}

PetsVilla OÜ · petsvilla.ee
  `.trim()

  return { subject, html, text }
}

export function buildHayAbandonedEmailContent(data: {
  quantity: number
  terminal: string
  totalPrice: number
  continueUrl: string
}): { subject: string; html: string; text: string } {
  const subject = 'Sinu heinatellimus jäi pooleli'
  const continueUrl = data.continueUrl
  const summa = Number.isInteger(data.totalPrice)
    ? `${data.totalPrice}€`
    : `${data.totalPrice.toFixed(2).replace('.', ',')}€`
  const kottLabel = data.quantity === 1 ? 'kott' : 'kotti'

  const html = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;margin:0;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333333;">
            <tr>
              <td style="background-color:${BRAND_GREEN};color:#ffffff;padding:24px 28px;font-size:22px;font-weight:bold;">
                PetsVilla
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Tere!</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
                  Sinu heinatellimus jäi pooleli. Makset ei võetud. Saad sama tellimuse juurde naasta ja makse lõpetada:
                </p>
                <p style="margin:0 0 8px;font-size:16px;line-height:1.5;"><strong>Hein:</strong> ${data.quantity} ${kottLabel}</p>
                <p style="margin:0 0 8px;font-size:16px;line-height:1.5;"><strong>Pakiautomaat:</strong> ${data.terminal}</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.5;"><strong>Summa:</strong> ${summa}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="background-color:${BRAND_GREEN};border-radius:6px;">
                      <a href="${continueUrl}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                        Jätka maksmist
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#6b7280;">
                  Link kehtib 7 päeva. Kui heina enam ei vaja, võid kirja ignoreerida.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 28px;border-top:1px solid #e5e7eb;font-size:13px;line-height:1.5;color:#6b7280;">
                <p style="margin:0;">PetsVilla OÜ · petsvilla.ee · service@petsvilla.ee</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim()

  const text = `
Tere!

Sinu heinatellimus jäi pooleli. Makset ei võetud.

Hein: ${data.quantity} ${kottLabel}
Pakiautomaat: ${data.terminal}
Summa: ${summa}

Jätka maksmist: ${continueUrl}

Link kehtib 7 päeva. Kui heina enam ei vaja, võid kirja ignoreerida.

PetsVilla OÜ · petsvilla.ee
  `.trim()

  return { subject, html, text }
}
