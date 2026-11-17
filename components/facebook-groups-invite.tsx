import {
  FACEBOOK_GROUPS_BRAND_COLOR,
  FACEBOOK_GROUPS_INVITE,
  buildFacebookGroupShortLink,
} from '@/lib/facebook-groups'

export function FacebookGroupsInvite() {
  const { title, text, groups } = FACEBOOK_GROUPS_INVITE

  return (
    <div
      className="rounded-lg p-6 mb-8 text-left border"
      style={{ borderColor: FACEBOOK_GROUPS_BRAND_COLOR }}
    >
      <h2
        className="font-semibold mb-3"
        style={{ color: FACEBOOK_GROUPS_BRAND_COLOR }}
      >
        {title}
      </h2>
      <p className="text-gray-700 mb-4">{text}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {groups.map((group) => {
          const href =
            buildFacebookGroupShortLink(group.slug, 'tanuleht', 'web', false) ??
            group.href

          return (
            <a
              key={group.slug}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: FACEBOOK_GROUPS_BRAND_COLOR }}
            >
              {group.emoji} {group.name}
            </a>
          )
        })}
      </div>
    </div>
  )
}
