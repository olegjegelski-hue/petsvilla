/**
 * Tellimuse kinnitus: kutse PetsVilla Facebooki gruppidesse.
 * Üks allikas e-kirja, /tellimus-kinnitatud ja /grupp/[slug] jaoks.
 */

export const FACEBOOK_GROUPS_BRAND_COLOR = '#2F6F4E'
export const FACEBOOK_GROUP_SHORT_ORIGIN = 'https://petsvilla.ee'
export const FACEBOOK_GROUP_UTM_CAMPAIGN = 'fb_grupid'

export const FACEBOOK_GROUPS_INVITE = {
  title: 'Liitu meie Facebooki gruppidega',
  text: 'Nõuanded, küsimused ja teiste loomaomanike kogemused – merisigade ja küülikute omanikele.',
  groups: [
    {
      slug: 'merisigala',
      emoji: '🐹',
      name: 'Merisigala',
      href: 'https://www.facebook.com/groups/merisigala',
    },
    {
      slug: 'kuulikusobrad',
      emoji: '🐰',
      name: 'Küülikusõbrad',
      href: 'https://www.facebook.com/groups/2037723266312747',
    },
  ],
} as const

export type FacebookGroup = (typeof FACEBOOK_GROUPS_INVITE.groups)[number]
export type FacebookGroupSlug = FacebookGroup['slug']

export function getFacebookGroupBySlug(slug: string): FacebookGroup | undefined {
  return FACEBOOK_GROUPS_INVITE.groups.find((group) => group.slug === slug)
}

/**
 * Lühilink /grupp/[slug] UTM-iga. Tundmatu slug → null.
 * absolute=true (vaikimisi): https://petsvilla.ee/... (kinnitusmeil, QR).
 * absolute=false: /grupp/... (tänuleht).
 */
export function buildFacebookGroupShortLink(
  slug: string,
  source: string,
  medium: string,
  absolute = true
): string | null {
  if (!getFacebookGroupBySlug(slug)) return null

  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: FACEBOOK_GROUP_UTM_CAMPAIGN,
  })
  const path = `/grupp/${slug}?${params.toString()}`
  return absolute ? `${FACEBOOK_GROUP_SHORT_ORIGIN}${path}` : path
}

/** GA4 group_join_click parameetrid — ilma isikuandmeteta. */
export function buildGroupJoinClickParams(
  slug: string,
  utmSource?: string | null,
  utmMedium?: string | null
): {
  group: string
  link_source: string
  link_medium: string
} {
  return {
    group: slug,
    link_source: utmSource?.trim() ? utmSource : 'otse',
    link_medium: utmMedium?.trim() ? utmMedium : '(none)',
  }
}

function groupInviteHref(
  slug: FacebookGroupSlug,
  source: string,
  medium: string,
  absolute: boolean
): string {
  const href = buildFacebookGroupShortLink(slug, source, medium, absolute)
  if (!href) {
    throw new Error(`Tundmatu Facebooki grupi slug: ${slug}`)
  }
  return href
}

/** Tabelipõhine HTML e-posti klientidele (ilma piltideta). */
export function buildFacebookGroupsInviteHtml(): string {
  const { title, text, groups } = FACEBOOK_GROUPS_INVITE
  const color = FACEBOOK_GROUPS_BRAND_COLOR

  const buttons = groups
    .map((group, index) => {
      const href = groupInviteHref(group.slug, 'kinnituskiri', 'email', true)
      return `
                  <td style="padding: 0 ${index === 0 ? '8px' : '0'} 8px 0;">
                    <a href="${href}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: ${color}; color: #ffffff; text-decoration: none; padding: 10px 16px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; border-radius: 4px;">
                      ${group.emoji} ${group.name}
                    </a>
                  </td>`
    })
    .join('')

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 24px 0; border: 1px solid ${color}; border-collapse: collapse;">
      <tr>
        <td style="background-color: ${color}; padding: 12px 16px;">
          <p style="margin: 0; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;">
            ${title}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px; font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.5;">
          <p style="margin: 0 0 16px 0;">${text}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${buttons}
            </tr>
          </table>
        </td>
      </tr>
    </table>`
}

export function buildFacebookGroupsInviteText(): string {
  const { title, text, groups } = FACEBOOK_GROUPS_INVITE
  const links = groups
    .map((group) => {
      const href = groupInviteHref(group.slug, 'kinnituskiri', 'email', true)
      return `${group.emoji} ${group.name}: ${href}`
    })
    .join('\n')

  return `${title}\n${text}\n${links}`
}
