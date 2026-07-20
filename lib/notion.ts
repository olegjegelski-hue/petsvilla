import { Client } from '@notionhq/client'

let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({
      auth: process.env.NOTION_API_KEY,
      notionVersion: '2022-06-28',
    })
  }
  return notionClient
}

/** Paranda UTF-8 mojibake Notion tekstist (latin1→utf8). */
export function fixMojibake(value: string): string {
  if (!value) return value
  if (!/[ÃÂâ]/.test(value)) return value
  try {
    return Buffer.from(value, 'latin1').toString('utf8')
  } catch {
    return value
  }
}

export function extractNotionText(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as Record<string, any>
  if (p.rich_text?.length) {
    return fixMojibake(
      p.rich_text.map((rt: any) => rt?.plain_text).filter(Boolean).join(' ').trim()
    )
  }
  if (p.title?.length) {
    return fixMojibake(
      p.title.map((rt: any) => rt?.plain_text).filter(Boolean).join(' ').trim()
    )
  }
  if (p.formula?.string) {
    return fixMojibake(String(p.formula.string).trim())
  }
  if (p.select?.name) {
    return fixMojibake(String(p.select.name).trim())
  }
  if (p.status?.name) {
    return fixMojibake(String(p.status.name).trim())
  }
  return ''
}

export function extractNotionFileUrl(
  filesProp: unknown,
  fallback = '/placeholder-guinea-pig.jpg'
): string {
  const files = (filesProp as { files?: any[] } | undefined)?.files
  if (!files?.[0]) return fallback
  const file = files[0]
  if (file.type === 'external') return file.external?.url || fallback
  if (file.type === 'file') return file.file?.url || fallback
  return fallback
}
