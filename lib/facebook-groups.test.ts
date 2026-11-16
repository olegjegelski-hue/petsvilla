import { describe, it, expect } from 'vitest'
import {
  FACEBOOK_GROUPS_BRAND_COLOR,
  FACEBOOK_GROUPS_INVITE,
  buildFacebookGroupsInviteHtml,
  buildFacebookGroupsInviteText,
} from '@/lib/facebook-groups'

describe('Facebooki gruppide kutse', () => {
  it('kasutab brändivärvi ja mõlemat grupilinki', () => {
    expect(FACEBOOK_GROUPS_BRAND_COLOR).toBe('#2F6F4E')
    expect(FACEBOOK_GROUPS_INVITE.groups).toHaveLength(2)
    expect(FACEBOOK_GROUPS_INVITE.groups[0].href).toBe(
      'https://www.facebook.com/groups/merisigala'
    )
    expect(FACEBOOK_GROUPS_INVITE.groups[1].href).toBe(
      'https://www.facebook.com/groups/2037723266312747'
    )
  })

  it('HTML on tabelipõhine ja ilma piltideta', () => {
    const html = buildFacebookGroupsInviteHtml()
    expect(html).toContain('<table role="presentation"')
    expect(html).not.toContain('<img')
    expect(html).toContain(FACEBOOK_GROUPS_INVITE.title)
    expect(html).toContain(FACEBOOK_GROUPS_INVITE.text)
    expect(html).toContain('🐹 Merisigala')
    expect(html).toContain('🐰 Küülikusõbrad')
  })

  it('tekstiversioon sisaldab pealkirja ja URL-e', () => {
    const text = buildFacebookGroupsInviteText()
    expect(text).toContain(FACEBOOK_GROUPS_INVITE.title)
    expect(text).toContain(FACEBOOK_GROUPS_INVITE.groups[0].href)
    expect(text).toContain(FACEBOOK_GROUPS_INVITE.groups[1].href)
  })
})
