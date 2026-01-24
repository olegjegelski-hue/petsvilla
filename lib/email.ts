
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// Create reusable transporter with error handling
const createTransporter = (): Transporter => {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD

  if (!host || !user || !password) {
    throw new Error(
      'SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables.'
    )
  }

  try {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for other ports (TLS)
      auth: {
        user,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
        minVersion: 'TLSv1.2', // Minimum TLS version
      },
      debug: process.env.NODE_ENV === 'development', // Enable debug in development
      logger: process.env.NODE_ENV === 'development', // Enable logging in development
    })
  } catch (error) {
    console.error('Failed to create email transporter:', error)
    throw new Error(`SMTP configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Send contact form email
export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  product?: string
}) {
  try {
    const transporter = createTransporter()

  const htmlContent = `
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
        <p>Saadetud: ${new Date().toLocaleString('et-EE', { timeZone: 'Europe/Tallinn' })}</p>
        <p>PetsVilla OÜ - petsvilla.ee</p>
      </div>
    </div>
  `

    const mailOptions = {
      from: `"PetsVilla Koduleht" <${process.env.SMTP_USER}>`,
      to: 'service@petsvilla.ee',
      replyTo: data.email,
      subject: `Kontaktivorm: ${data.subject || 'Uus päring'} - ${data.name}`,
      html: htmlContent,
      text: `
Uus kontaktivormi päring

Nimi: ${data.name}
E-post: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}
${data.subject ? `Teema: ${data.subject}` : ''}
${data.product ? `Toode: ${data.product}` : ''}

Sõnum:
${data.message}

Saadetud: ${new Date().toLocaleString('et-EE', { timeZone: 'Europe/Tallinn' })}
      `.trim(),
    }

    await transporter.sendMail(mailOptions)
    console.log(`Contact form email sent successfully to service@petsvilla.ee from ${data.email}`)
  } catch (error) {
    console.error('Failed to send contact form email:', error)
    throw new Error(
      `Email saatmine ebaõnnestus: ${error instanceof Error ? error.message : 'Tundmatu viga'}. ` +
      'Palun kontrollige SMTP seadeid või proovige hiljem uuesti.'
    )
  }
}

// Send hay order email
export async function sendHayOrderEmail(data: {
  name: string
  email: string
  phone: string
  terminal: string
  quantity: number
  guineaPigFood: number
  rabbitFood: number
  totalPrice: number
  comments?: string
}) {
  try {
    const transporter = createTransporter()

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
        ✅ Heinatellimus kinnitatud
      </h2>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981;">
        <h3 style="color: #059669; margin-top: 0;">Kliendi andmed:</h3>
        <p style="margin: 10px 0;"><strong>Nimi:</strong> ${data.name}</p>
        <p style="margin: 10px 0;"><strong>E-post:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p style="margin: 10px 0;"><strong>Telefon:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
      </div>
      
      <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b;">
        <h3 style="color: #d97706; margin-top: 0;">Tellimuse üksikasjad:</h3>
        <p style="margin: 10px 0;"><strong>SmartPost terminal:</strong> ${data.terminal}</p>
        <p style="margin: 10px 0;"><strong>Hein (kotid):</strong> ${data.quantity} pakki</p>
        ${data.guineaPigFood > 0 ? `<p style="margin: 10px 0;"><strong>Meriseatoit:</strong> ${data.guineaPigFood} kg</p>` : ''}
        ${data.rabbitFood > 0 ? `<p style="margin: 10px 0;"><strong>Küülikutoit:</strong> ${data.rabbitFood} × 2 kg pakend (kokku ${data.rabbitFood * 2} kg)</p>` : ''}
        <p style="margin: 10px 0; font-size: 18px;"><strong>Summa:</strong> <span style="color: #d97706;">${data.totalPrice}€</span></p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #0ea5e9;">
        <h3 style="color: #0369a1; margin-top: 0;">💳 Palume tasuda antud tellimus:</h3>
        <p style="margin: 10px 0;"><strong>Saaja:</strong> PetsVilla OÜ</p>
        <p style="margin: 10px 0;"><strong>Konto:</strong> EE252200221078273363</p>
        <p style="margin: 10px 0; font-size: 18px;"><strong>Summa:</strong> <span style="color: #0369a1;">${data.totalPrice}€</span></p>
        <p style="margin: 10px 0;"><strong>Selgitus:</strong> Petsvilla kodulehe tellimus</p>
      </div>
      
      ${data.comments ? `
      <div style="background-color: #fff; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Kommentaarid:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.comments}</p>
      </div>
      ` : ''}
      
      <div style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Saadetud: ${new Date().toLocaleString('et-EE', { timeZone: 'Europe/Tallinn' })}</p>
        <p>PetsVilla OÜ - petsvilla.ee</p>
      </div>
    </div>
  `

    const mailOptions = {
      from: `"PetsVilla Heinatellimus" <${process.env.SMTP_USER}>`,
      to: `${data.email}, service@petsvilla.ee`,
      replyTo: data.email,
      subject: `🌾 Heinatellimus kinnitus: ${data.quantity} pakki - ${data.name}`,
      html: htmlContent,
      text: `
✅ HEINATELLIMUS KINNITATUD

Kliendi andmed:
- Nimi: ${data.name}
- E-post: ${data.email}
- Telefon: ${data.phone}

Tellimuse üksikasjad:
- SmartPost terminal: ${data.terminal}
- Hein (kotid): ${data.quantity} pakki
${data.guineaPigFood > 0 ? `- Meriseatoit: ${data.guineaPigFood} kg\n` : ''}${data.rabbitFood > 0 ? `- Küülikutoit: ${data.rabbitFood} × 2 kg pakend (kokku ${data.rabbitFood * 2} kg)\n` : ''}- Summa: ${data.totalPrice}€

💳 PALUME TASUDA ANTUD TELLIMUS:
Saaja: PetsVilla OÜ
Konto: EE252200221078273363
Summa: ${data.totalPrice}€
Selgitus: Petsvilla kodulehe tellimus

${data.comments ? `Kommentaarid:\n${data.comments}\n` : ''}

Saadetud: ${new Date().toLocaleString('et-EE', { timeZone: 'Europe/Tallinn' })}
      `.trim(),
    }

    await transporter.sendMail(mailOptions)
    console.log(`Hay order confirmation email sent successfully to ${data.email}`)
  } catch (error) {
    console.error('Failed to send hay order email:', error)
    throw new Error(
      `Email saatmine ebaõnnestus: ${error instanceof Error ? error.message : 'Tundmatu viga'}. ` +
      'Palun kontrollige SMTP seadeid või proovige hiljem uuesti.'
    )
  }
}
