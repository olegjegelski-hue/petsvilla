import { describe, it, expect } from 'vitest'
import {
  addWeeksToIsoDate,
  buildHayReminderNotionProperties,
  createHayReminderOptOutToken,
  decideHayReminderAction,
  DEFAULT_HAY_REMINDER_WEEKS,
  hayReminderOptOutUrl,
  isHayOrderPaid,
  parseHayReminderFlag,
  parseHayReminderWeeks,
  todayInTallinn,
  verifyHayReminderOptOutToken,
} from '@/lib/hay-reminder'
import { isAuthorizedCron } from '@/lib/hay-reminder-job'
import { buildHayReminderEmailContent } from '@/lib/email-templates'
import { validateHayOrderForm } from '@/lib/hay-order-validation'

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
