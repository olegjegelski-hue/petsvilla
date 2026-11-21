import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import {
  buildContactEmailContent,
  buildHayAbandonedEmailContent,
  buildHayOrderEmailContent,
  buildHayReminderEmailContent,
  buildHayWinbackEmailContent,
} from '@/lib/email-templates'
import {
  buildHayReminderDailyReportContent,
  getHayReminderReportTo,
  hayReminderUnsubscribeHeaders,
  type HayReminderDailyReport,
} from '@/lib/hay-reminder'
import { SITE_CONTACT } from '@/lib/site-contact'

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
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
    })
  } catch (error) {
    console.error('Failed to create email transporter:', error)
    throw new Error(
      `SMTP configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

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
    const content = buildContactEmailContent(data)

    await transporter.sendMail({
      from: `"PetsVilla Koduleht" <${process.env.SMTP_USER}>`,
      to: 'service@petsvilla.ee',
      replyTo: data.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    })
    console.log(
      `Contact form email sent successfully to service@petsvilla.ee from ${data.email}`
    )
  } catch (error) {
    console.error('Failed to send contact form email:', error)
    throw new Error(
      `Email saatmine ebaõnnestus: ${error instanceof Error ? error.message : 'Tundmatu viga'}. ` +
        'Palun kontrollige SMTP seadeid või proovige hiljem uuesti.'
    )
  }
}

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
    const content = buildHayOrderEmailContent(data)

    await transporter.sendMail({
      from: `"PetsVilla Heinatellimus" <${process.env.SMTP_USER}>`,
      to: `${data.email}, service@petsvilla.ee`,
      replyTo: data.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    })
    console.log(`Hay order confirmation email sent successfully to ${data.email}`)
  } catch (error) {
    console.error('Failed to send hay order email:', error)
    throw new Error(
      `Email saatmine ebaõnnestus: ${error instanceof Error ? error.message : 'Tundmatu viga'}. ` +
        'Palun kontrollige SMTP seadeid või proovige hiljem uuesti.'
    )
  }
}

export async function sendHayReminderEmail(data: {
  email: string
  optOutUrl: string
  listUnsubscribeUrl: string
}) {
  const transporter = createTransporter()
  const content = buildHayReminderEmailContent({ optOutUrl: data.optOutUrl })

  await transporter.sendMail({
    from: `"PetsVilla Heinatellimus" <${process.env.SMTP_USER}>`,
    to: data.email,
    replyTo: SITE_CONTACT.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
    headers: hayReminderUnsubscribeHeaders(data.listUnsubscribeUrl),
  })
  console.log(`Hay reminder email sent successfully to ${data.email}`)
}

export async function sendHayWinbackEmail(data: {
  email: string
  optOutUrl: string
  listUnsubscribeUrl: string
}) {
  const transporter = createTransporter()
  const content = buildHayWinbackEmailContent({ optOutUrl: data.optOutUrl })

  await transporter.sendMail({
    from: `"PetsVilla Heinatellimus" <${process.env.SMTP_USER}>`,
    to: data.email,
    replyTo: SITE_CONTACT.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
    headers: hayReminderUnsubscribeHeaders(data.listUnsubscribeUrl),
  })
  console.log(`Hay 90-day reminder email sent successfully to ${data.email}`)
}

export async function sendHayReminderDailyReport(report: HayReminderDailyReport) {
  const transporter = createTransporter()
  const to = getHayReminderReportTo()
  const content = buildHayReminderDailyReportContent(report)

  await transporter.sendMail({
    from: `"PetsVilla Heinatellimus" <${process.env.SMTP_USER}>`,
    to,
    replyTo: SITE_CONTACT.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  })
  console.log(`Hay reminder daily report sent to ${to}`)
}

export async function sendHayAbandonedEmail(data: {
  email: string
  quantity: number
  terminal: string
  totalPrice: number
  continueUrl: string
}) {
  const transporter = createTransporter()
  const content = buildHayAbandonedEmailContent({
    quantity: data.quantity,
    terminal: data.terminal,
    totalPrice: data.totalPrice,
    continueUrl: data.continueUrl,
  })

  await transporter.sendMail({
    from: `"PetsVilla Heinatellimus" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  })
  console.log(`Hay abandoned-order email sent successfully to ${data.email}`)
}
