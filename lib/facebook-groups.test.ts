import { describe, it, expect } from 'vitest'
import {
  FACEBOOK_GROUPS_BRAND_COLOR,
  FACEBOOK_GROUPS_INVITE,
  buildFacebookGroupShortLink,
  buildFacebookGroupsInviteHtml,
  buildFacebookGroupsInviteText,
  buildGroupJoinClickParams,
  getFacebookGroupBySlug,
} from '@/lib/facebook-groups'

const MERISIGALA_EMAIL =
  'https://petsvilla.ee/grupp/merisigala?utm_source=kinnituskiri&utm_medium=email&utm_campaign=fb_grupid'
const KUULIKUSOBRAD_EMAIL =
  'https://petsvilla.ee/grupp/kuulikusobrad?utm_source=kinnituskiri&utm_medium=email&utm_campaign=fb_grupid'
const MERISIGALA_THANKYOU =
  '/grupp/merisigala?utm_source=tanuleht&utm_medium=web&utm_campaign=fb_grupid'

describe('Facebooki gruppide kutse', () => {
  it('kasutab brändivärvi ja mõlemat grupilinki', () => {
    expect(FACEBOOK_GROUPS_BRAND_COLOR).toBe('#2F6F4E')
    expect(FACEBOOK_GROUPS_INVITE.groups).toHaveLength(2)
    expect(FACEBOOK_GROUPS_INVITE.groups[0].slug).toBe('merisigala')
    expect(FACEBOOK_GROUPS_INVITE.groups[0].href).toBe(
      'https://www.facebook.com/groups/merisigala'
    )
    expect(FACEBOOK_GROUPS_INVITE.groups[1].slug).toBe('kuulikusobrad')
    expect(FACEBOOK_GROUPS_INVITE.groups[1].href).toBe(
      'https://www.facebook.com/groups/2037723266312747'
    )
  })

  it('HTML on tabelipõhine, ilma piltideta ja kasutab lühilinke', () => {
    const html = buildFacebookGroupsInviteHtml()
    expect(html).toContain('<table role="presentation"')
    expect(html).not.toContain('<img')
    expect(html).toContain(FACEBOOK_GROUPS_INVITE.title)
    expect(html).toContain(FACEBOOK_GROUPS_INVITE.text)
    expect(html).toContain('🐹 Merisigala')
    expect(html).toContain('🐰 Küülikusõbrad')
    expect(html).toContain(MERISIGALA_EMAIL)
    expect(html).toContain(KUULIKUSOBRAD_EMAIL)
    expect(html).not.toContain('facebook.com/groups')
  })

  it('tekstiversioon sisaldab pealkirja ja lühilinkide URL-e', () => {
    const text = buildFacebookGroupsInviteText()
    expect(text).toContain(FACEBOOK_GROUPS_INVITE.title)
    expect(text).toContain(MERISIGALA_EMAIL)
    expect(text).toContain(KUULIKUSOBRAD_EMAIL)
    expect(text).not.toContain('facebook.com/groups')
  })
})

describe('Facebooki grupi lühilingid', () => {
  it('koostab täis-URL-i kinnituskirja UTM-iga', () => {
    expect(buildFacebookGroupShortLink('merisigala', 'kinnituskiri', 'email')).toBe(
      MERISIGALA_EMAIL
    )
    expect(
      buildFacebookGroupShortLink('kuulikusobrad', 'kinnituskiri', 'email')
    ).toBe(KUULIKUSOBRAD_EMAIL)
  })

  it('koostab tänulehe suhtelise tee', () => {
    expect(
      buildFacebookGroupShortLink('merisigala', 'tanuleht', 'web', false)
    ).toBe(MERISIGALA_THANKYOU)
    expect(
      buildFacebookGroupShortLink('kuulikusobrad', 'tanuleht', 'web', false)
    ).toBe(
      '/grupp/kuulikusobrad?utm_source=tanuleht&utm_medium=web&utm_campaign=fb_grupid'
    )
  })

  it('tundmatu slug tagastab nulli', () => {
    expect(getFacebookGroupBySlug('tundmatu')).toBeUndefined()
    expect(buildFacebookGroupShortLink('tundmatu', 'kinnituskiri', 'email')).toBeNull()
    expect(buildFacebookGroupShortLink('', 'tanuleht', 'web')).toBeNull()
  })

  it('group_join_click parameetrid kasutavad UTM-i või otse/(none)', () => {
    expect(
      buildGroupJoinClickParams('merisigala', 'kinnituskiri', 'email')
    ).toEqual({
      group: 'merisigala',
      link_source: 'kinnituskiri',
      link_medium: 'email',
    })
    expect(buildGroupJoinClickParams('kuulikusobrad')).toEqual({
      group: 'kuulikusobrad',
      link_source: 'otse',
      link_medium: '(none)',
    })
    const serialized = JSON.stringify(
      buildGroupJoinClickParams('merisigala', 'plakat', 'qr')
    )
    expect(serialized.toLowerCase().includes('email')).toBe(false)
    expect(serialized.toLowerCase().includes('phone')).toBe(false)
    expect(serialized.toLowerCase().includes('nimi')).toBe(false)
  })
})
