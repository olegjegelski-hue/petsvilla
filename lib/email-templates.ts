/**
 * E-kirjade HTML/tekst koostamine (ilma SMTP-ta — testitav).
 */

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
      <p><strong>Nimi:</strong> ${data.name}</p>
      <p><strong>E-post:</strong> ${data.email}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>SmartPost terminal:</strong> ${data.terminal}</p>
      <p><strong>Hein (kotid):</strong> ${data.quantity} pakki</p>
      ${data.guineaPigFood > 0 ? `<p><strong>Meriseatoit:</strong> ${data.guineaPigFood} kg</p>` : ''}
      ${data.rabbitFood > 0 ? `<p><strong>Küülikutoit:</strong> ${data.rabbitFood} × 2 kg</p>` : ''}
      <p><strong>Summa:</strong> ${data.totalPrice}€</p>
      ${data.comments ? `<p><strong>Kommentaarid:</strong> ${data.comments}</p>` : ''}
    </div>
  `

  const text = `
✅ HEINATELLIMUS KINNITATUD
Nimi: ${data.name}
E-post: ${data.email}
Telefon: ${data.phone}
SmartPost: ${data.terminal}
Hein: ${data.quantity} pakki
Summa: ${data.totalPrice}€
  `.trim()

  return { subject, html, text }
}
