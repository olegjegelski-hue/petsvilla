import { describe, it, expect } from 'vitest'
import {
  addDaysToIsoDate,
  addWeeksToIsoDate,
  buildHayReminderNotionProperties,
  buildHayReminderSentProperties,
  createHayReminderOptOutToken,
  decideHayReminderAction,
  decideHayWinbackAction,
  DEFAULT_HAY_REMINDER_WEEKS,
  DEFAULT_HAY_WINBACK_DAILY_LIMIT,
  emailsMatch,
  getHayWinbackDailyLimit,
  HAY_REMINDER_OPT_OUT_MESSAGE,
  HAY_REMINDER_TYPE,
  HAY_WINBACK_DAYS,
  HAY_WINBACK_ORDER_URL,
  hayReminderListUnsubscribeUrl,
  hayReminderOptOutUrl,
  hasLaterPaidFromIndex,
  hayReminderUnsubscribeHeaders,
  isHayOrderPaid,
  isHayWinbackDryRun,
  isHayWinbackDue,
  maskHayEmail,
  normalizeHayEmail,
  parseHayReminderFlag,
  parseHayReminderWeeks,
  selectHayWinbackRecipients,
  todayInTallinn,
  verifyHayReminderOptOutToken,
  type HayWinbackOrder,
  type LatestPaidHayOrder,
} from '@/lib/hay-reminder'
import { isAuthorizedCron } from '@/lib/hay-reminder-job'
import {
  buildHayReminderEmailContent,
  buildHayWinbackEmailContent,
} from '@/lib/email-templates'
import { validateHayOrderForm } from '@/lib/hay-order-validation'
import { calculateHayOrderTotal } from '@/lib/phone'
import { SITE_CONTACT } from '@/lib/site-contact'

const SECRET = 'test-hay-reminder-secret'

describe('Meeldetuletuse kuupäeva arvutus', () => {
  it('lisab 4 nädalat (vaikimisi) kalendrikuupäevale', () => {
    expect(addWeeksToIsoDate(new Date('2026-11-16T12:00:00+02:00'), 4)).toBe(
      '2026-12-14'
    )
  })

  it('toetab 3 / 6 / 8 nädalat', () => {
    const from = new Date('2026-11-16T08:00:00+02:00')
    expect(addWeeksToIsoDate(from, 3)).toBe('2026-12-07')
    expect(addWeeksToIsoDate(from, 6)).toBe('2026-12-28')
    expect(addWeeksToIsoDate(from, 8)).toBe('2027-01-11')
  })

  it('todayInTallinn tagastab YYYY-MM-DD', () => {
    expect(todayInTallinn(new Date('2026-11-16T23:30:00+02:00'))).toBe(
      '2026-11-16'
    )
  })
})

describe('Meeldetuletuse väljad', () => {
  it('märkimata linnuke ei sea kuupäeva', () => {
    const props = buildHayReminderNotionProperties({ reminder: false })
    expect(props.Meeldetuletus).toEqual({ checkbox: false })
    expect(props['Meeldetuletus saadetud']).toEqual({ checkbox: false })
    expect(props['Meeldetuletuse kuupäev']).toEqual({ date: null })
  })

  it('märgitud linnuke salvestab kuupäeva tellimus + intervall', () => {
    const props = buildHayReminderNotionProperties({
      reminder: true,
      reminderWeeks: 4,
      now: new Date('2026-11-16T10:00:00+02:00'),
    })
    expect(props.Meeldetuletus).toEqual({ checkbox: true })
    expect(props['Meeldetuletuse kuupäev']).toEqual({
      date: { start: '2026-12-14' },
    })
  })

  it('vigane intervall langeb 4 nädala peale', () => {
    expect(parseHayReminderWeeks(99)).toBe(DEFAULT_HAY_REMINDER_WEEKS)
    expect(parseHayReminderWeeks('4')).toBe(4)
    expect(parseHayReminderWeeks(3)).toBe(3)
    expect(parseHayReminderFlag(undefined)).toBe(false)
    expect(parseHayReminderFlag('on')).toBe(true)
  })
})

describe('Meeldetuletuse väljajätmise loogika', () => {
  const due = {
    reminder: true,
    reminderSent: false,
    reminderDate: '2026-11-16',
    paid: true,
    email: 'mari@example.com',
  }

  it('saadab, kui kuupäev on käes, makstud ja uuemat tellimust pole', () => {
    expect(
      decideHayReminderAction({
        candidate: due,
        today: '2026-11-16',
        hasLaterPaidOrder: false,
      })
    ).toBe('send')
  })

  it('ei saada, kui vahepeal on uus makstud tellimus', () => {
    expect(
      decideHayReminderAction({
        candidate: due,
        today: '2026-11-16',
        hasLaterPaidOrder: true,
      })
    ).toBe('skip-later-order')
  })

  it('ei saada maksmata, juba saadetud või tulevase kuupäeva korral', () => {
    expect(
      decideHayReminderAction({
        candidate: { ...due, paid: false },
        today: '2026-11-16',
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
    expect(
      decideHayReminderAction({
        candidate: { ...due, reminderSent: true },
        today: '2026-11-16',
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
    expect(
      decideHayReminderAction({
        candidate: { ...due, reminderDate: '2026-11-17' },
        today: '2026-11-16',
        hasLaterPaidOrder: false,
      })
    ).toBe('ignore')
  })

  it('isHayOrderPaid tunneb Makse linnukese ja staatuse', () => {
    expect(isHayOrderPaid({ paidCheckbox: true })).toBe(true)
    expect(isHayOrderPaid({ paymentSelect: 'Makstud' })).toBe(true)
    expect(isHayOrderPaid({ paymentSelect: 'Ootel' })).toBe(false)
  })
})

describe('Loobumise token', () => {
  it('allkirjastab ja kontrollib pageId-d', () => {
    const pageId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
    const token = createHayReminderOptOutToken(pageId, SECRET)
    expect(verifyHayReminderOptOutToken(token, SECRET)).toBe(pageId)
    expect(verifyHayReminderOptOutToken(token, 'muu-saladus')).toBeNull()
    expect(verifyHayReminderOptOutToken('vigane', SECRET)).toBeNull()
  })

  it('koostab loobumis-URL-i', () => {
    const url = hayReminderOptOutUrl(
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      'https://petsvilla.ee',
      SECRET
    )
    expect(url).toMatch(
      /^https:\/\/petsvilla\.ee\/meeldetuletus-valja\?token=/
    )
  })

  it('koostab List-Unsubscribe One-Click URL-i', () => {
    const url = hayReminderListUnsubscribeUrl(
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      'https://petsvilla.ee',
      SECRET
    )
    expect(url).toMatch(
      /^https:\/\/petsvilla\.ee\/api\/hay-reminder\/unsubscribe\?token=/
    )
    const headers = hayReminderUnsubscribeHeaders(url)
    expect(headers['List-Unsubscribe']).toBe(`<${url}>`)
    expect(headers['List-Unsubscribe-Post']).toBe(
      'List-Unsubscribe=One-Click'
    )
  })
})

describe('Meeldetuletuse meilimall', () => {
  it('sisaldab teemat, CTA-d, UTM-i ja loobumislinki', () => {
    const content = buildHayReminderEmailContent({
      optOutUrl: 'https://petsvilla.ee/meeldetuletus-valja?token=abc',
    })
    expect(content.subject).toBe('Kas hein hakkab otsa saama? 🌾')
    expect(content.html).toContain('#2F6F4E')
    expect(content.html).toContain('<table')
    expect(content.html).toContain('Telli hein')
    expect(content.html).toContain(
      'utm_source=email&utm_medium=meeldetuletus&utm_campaign=hein_kordus'
    )
    expect(content.html).toContain('Ära enam meelde tuleta')
    expect(content.html).toContain(
      'https://petsvilla.ee/meeldetuletus-valja?token=abc'
    )
    expect(content.text).toContain('Tere!')
    expect(content.text).toContain('Ära enam meelde tuleta')
    expect(content.text).toContain(
      'https://petsvilla.ee/telli-hein?utm_source=email'
    )
  })
})

describe('Heinatellimus ilma meeldetuletuseta', () => {
  it('jätab linnukese vaikimisi märkimata ja tellimus töötab nagu enne', () => {
    const r = validateHayOrderForm({
      name: 'Jüri Tamm',
      email: 'juri@example.com',
      phone: '5127938',
      terminal: 'Tartu Lõunakeskus',
      quantity: '2',
    })
    expect(r.ok).toBe(true)
    if (r.ok && !r.honeypot) {
      expect(r.data.reminder).toBe(false)
      expect(r.data.reminderWeeks).toBe(4)
      expect(r.data.totalPrice).toBe(18)
    }
  })

  it('võtab vastu märgitud linnukese ja 6 nädalat', () => {
    const r = validateHayOrderForm({
      name: 'Mari Mets',
      email: 'mari@example.com',
      phone: '+3725127938',
      terminal: 'Tallinn Ülemiste',
      quantity: 1,
      reminder: true,
      reminderWeeks: 6,
    })
    expect(r.ok).toBe(true)
    if (r.ok && !r.honeypot) {
      expect(r.data.reminder).toBe(true)
      expect(r.data.reminderWeeks).toBe(6)
    }
  })
})

describe('Croni autoriseerimine', () => {
  it('nõuab Bearer CRON_SECRET', () => {
    const previous = process.env.CRON_SECRET
    process.env.CRON_SECRET = 'cron-test-secret'
    expect(
      isAuthorizedCron(
        new Request('https://petsvilla.ee/api/cron/hay-reminder', {
          headers: { authorization: 'Bearer cron-test-secret' },
        })
      )
    ).toBe(true)
    expect(
      isAuthorizedCron(
        new Request('https://petsvilla.ee/api/cron/hay-reminder')
      )
    ).toBe(false)
    process.env.CRON_SECRET = previous
  })
})

describe('E-posti normaliseerimine', () => {
  it('trim + väiketähed, sh 7 sama aadressi eri tähesuurusega', () => {
    expect(normalizeHayEmail('  Mari@Example.COM ')).toBe('mari@example.com')
    expect(emailsMatch('Mari@Example.COM', 'mari@example.com')).toBe(true)
    expect(emailsMatch('a@b.ee', 'c@b.ee')).toBe(false)
    expect(emailsMatch('', 'a@b.ee')).toBe(false)
  })

  it('maskeerib e-posti Vercel logi jaoks', () => {
    expect(maskHayEmail('mari@example.com')).toBe('ma***@example.com')
    expect(maskHayEmail('A@petsvilla.ee')).toBe('a***@petsvilla.ee')
  })
})

describe('Linnukese meeldetuletus + Loobunud', () => {
  const due = {
    reminder: true,
    reminderSent: false,
    reminderDate: '2026-11-16',
    paid: true,
    email: 'Mari@Example.com',
  }

  it('jätab saamata, kui sama e-post on Loobunud', () => {
    expect(
      decideHayReminderAction({
        candidate: due,
        today: '2026-11-16',
        hasLaterPaidOrder: false,
        emailOptedOut: true,
      })
    ).toBe('skip-opted-out')
  })

  it('saadab edasi, kui Loobunud ei ole', () => {
    expect(
      decideHayReminderAction({
        candidate: due,
        today: '2026-11-16',
        hasLaterPaidOrder: false,
        emailOptedOut: false,
      })
    ).toBe('send')
  })
})

describe('90 päeva meeldetuletuse valik', () => {
  const today = '2026-11-22'
  const createdDue = new Date('2026-08-24T10:00:00+03:00')
  const createdRecent = new Date('2026-10-01T10:00:00+03:00')

  const dueOrder = (partial: Partial<HayWinbackOrder> = {}): HayWinbackOrder => ({
    pageId: 'page-old',
    email: 'mari@example.com',
    createdTime: createdDue.toISOString(),
    reminder: false,
    reminderSent: false,
    paid: true,
    ...partial,
  })

  it('90 päeva täis täpselt täna (Tallinn)', () => {
    expect(HAY_WINBACK_DAYS).toBe(90)
    expect(addDaysToIsoDate('2026-08-24', 90)).toBe('2026-11-22')
    expect(isHayWinbackDue(createdDue, today)).toBe(true)
    expect(isHayWinbackDue(createdRecent, today)).toBe(false)
  })

  it('saadab ainult e-posti viimase makstud, linnukeseta, ≥90p, mitte loobunud', () => {
    expect(
      decideHayWinbackAction({
        candidate: dueOrder(),
        today,
        isLatestPaidOrder: true,
        emailOptedOut: false,
      })
    ).toBe('send')
    expect(
      decideHayWinbackAction({
        candidate: dueOrder({ reminder: true }),
        today,
        isLatestPaidOrder: true,
      })
    ).toBe('ignore')
    expect(
      decideHayWinbackAction({
        candidate: dueOrder({ reminderSent: true }),
        today,
        isLatestPaidOrder: true,
      })
    ).toBe('ignore')
    expect(
      decideHayWinbackAction({
        candidate: dueOrder({ createdTime: createdRecent.toISOString() }),
        today,
        isLatestPaidOrder: true,
      })
    ).toBe('ignore')
  })

  it('uuem makstud tellimus tühistab vana 90p meeldetuletuse', () => {
    expect(
      decideHayWinbackAction({
        candidate: dueOrder(),
        today,
        isLatestPaidOrder: false,
      })
    ).toBe('skip-later-order')
  })

  it('uuem makstud tellimus kehtib ka siis, kui e-posti tähesuurus erineb', () => {
    const latest = new Map<string, LatestPaidHayOrder>([
      [
        'mari@example.com',
        { pageId: 'page-new', createdTime: '2026-11-01T10:00:00.000Z' },
      ],
    ])
    expect(
      hasLaterPaidFromIndex(
        'MARI@Example.COM',
        'page-old',
        createdDue.toISOString(),
        latest
      )
    ).toBe(true)
  })

  it('Loobunud kehtib e-posti kohta, tähesuurusest sõltumata', () => {
    const latest = new Map<string, LatestPaidHayOrder>([
      [
        'mari@example.com',
        { pageId: 'page-old', createdTime: createdDue.toISOString() },
      ],
    ])
    const queue = selectHayWinbackRecipients({
      candidates: [dueOrder({ email: '  MARI@Example.COM ' })],
      latestPaidByEmail: latest,
      optedOutEmails: new Set(['mari@example.com']),
      today,
      limit: 10,
    })
    expect(queue.selected).toHaveLength(0)
    expect(queue.skippedOptedOut).toBe(1)
  })

  it('päevalimiit 10, järjekord: hiljem kadunud (viimane tellimus) enne', () => {
    const candidates: HayWinbackOrder[] = []
    const latest = new Map<string, LatestPaidHayOrder>()
    for (let i = 0; i < 12; i += 1) {
      const created = new Date(createdDue.getTime() + i * 86400000)
      const email = `klient${i}@example.com`
      const pageId = `page-${i}`
      candidates.push(
        dueOrder({
          pageId,
          email,
          createdTime: created.toISOString(),
        })
      )
      latest.set(email, { pageId, createdTime: created.toISOString() })
    }

    const queue = selectHayWinbackRecipients({
      candidates,
      latestPaidByEmail: latest,
      optedOutEmails: new Set(),
      today: '2026-12-10',
      limit: DEFAULT_HAY_WINBACK_DAILY_LIMIT,
    })

    expect(queue.selected).toHaveLength(10)
    expect(queue.deferred).toHaveLength(2)
    expect(queue.selected[0].email).toBe('klient11@example.com')
    expect(queue.selected[9].email).toBe('klient2@example.com')
    expect(getHayWinbackDailyLimit(undefined)).toBe(10)
    expect(getHayWinbackDailyLimit('25')).toBe(25)
    expect(getHayWinbackDailyLimit('0')).toBe(10)
  })

  it('dry-run vaikimisi sees; false ainult selgesõnaliselt', () => {
    expect(isHayWinbackDryRun(undefined)).toBe(true)
    expect(isHayWinbackDryRun('')).toBe(true)
    expect(isHayWinbackDryRun('true')).toBe(true)
    expect(isHayWinbackDryRun('false')).toBe(false)
    expect(isHayWinbackDryRun('0')).toBe(false)
    expect(isHayWinbackDryRun('maybe')).toBe(true)
  })

  it('täidab Notionis tüübi ja saatmiskuupäeva', () => {
    expect(
      buildHayReminderSentProperties({
        type: HAY_REMINDER_TYPE.winback,
        sentDate: today,
      })
    ).toEqual({
      'Meeldetuletus saadetud': { checkbox: true },
      'Meeldetuletuse tüüp': { select: { name: '90 päeva' } },
      'Meeldetuletus saadetud (kp)': { date: { start: today } },
    })
  })
})

describe('90 päeva meilimall', () => {
  it('kasutab /telli-hein hinnaallikat, ET teksti ja loobumislinki', () => {
    const price = calculateHayOrderTotal({ quantity: 1 })
    const content = buildHayWinbackEmailContent({
      optOutUrl: 'https://petsvilla.ee/meeldetuletus-valja?token=abc',
    })
    expect(content.subject).toBe('Kas heinavaru hakkab otsa saama? 🌾')
    expect(content.html).toContain('#2F6F4E')
    expect(content.html).toContain('<table')
    expect(content.html).toContain(`${price} €`)
    expect(content.html).toContain(HAY_WINBACK_ORDER_URL)
    expect(content.html).toContain('utm_campaign=hein_90p')
    expect(content.html).toContain('Ära enam meelde tuleta')
    expect(content.html).toContain('Oleg Jegelski')
    expect(content.text).toContain('paar kuud')
    expect(content.text).toContain(`${price} €`)

    const otherPrice = buildHayWinbackEmailContent({
      optOutUrl: 'https://petsvilla.ee/meeldetuletus-valja?token=abc',
      hayBagPriceEur: price + 3,
    })
    expect(otherPrice.html).toContain(`${price + 3} €`)
    expect(otherPrice.html).not.toContain(`${price} €`)
  })

  it('loobumise kinnitus on e-posti põhine', () => {
    expect(HAY_REMINDER_OPT_OUT_MESSAGE).toBe(
      'Selge — me ei saada sulle enam heina meeldetuletusi.'
    )
    expect(SITE_CONTACT.email).toBe('service@petsvilla.ee')
  })
})
