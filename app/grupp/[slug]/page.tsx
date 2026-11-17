import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { GroupJoinRedirect } from '@/components/group-join-redirect'
import {
  FACEBOOK_GROUPS_INVITE,
  getFacebookGroupBySlug,
} from '@/lib/facebook-groups'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ utm_source?: string | string[]; utm_medium?: string | string[] }>
}

function firstQueryValue(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export const dynamicParams = false

export function generateStaticParams() {
  return FACEBOOK_GROUPS_INVITE.groups.map((group) => ({ slug: group.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getFacebookGroupBySlug(slug)

  return {
    title: group ? group.name : 'Facebooki grupp',
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}

export default async function GruppPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const group = getFacebookGroupBySlug(slug)
  if (!group) {
    notFound()
  }

  const query = await searchParams

  return (
    <GroupJoinRedirect
      slug={group.slug}
      facebookUrl={group.href}
      groupName={group.name}
      utmSource={firstQueryValue(query.utm_source)}
      utmMedium={firstQueryValue(query.utm_medium)}
    />
  )
}
