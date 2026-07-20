import { getNotionClient, extractNotionFileUrl } from '@/lib/notion'
import type { ShopProduct } from '@/lib/types'

export const SHOP_CATEGORIES: Record<
  string,
  { title: string; description: string; icon: string; notionCategory: string }
> = {
  birds: {
    title: 'Papagoid',
    description: 'Erinevad linnuliigid - papagoid, kakaduud, ja muud eksootilised linnud',
    icon: '🦜',
    notionCategory: 'BIRDS',
  },
  'feed-for-reptiles': {
    title: 'Elustoit',
    description: 'Kvaliteetne elustoit roomajatele ja kahepaiksetele',
    icon: '🦗',
    notionCategory: 'FEED FOR REPTILES',
  },
  'reptiles-amphibians': {
    title: 'Roomajad ja Kahepaiksed',
    description: 'Roomajad, kahepaiksed ja nende hooldus',
    icon: '🦎',
    notionCategory: 'REPTILES & AMPHIBIANS',
  },
  plants: {
    title: 'Akvaariumi Taimed',
    description: 'Elavad akvaariumi taimed - ilu ja tervisliku keskkonna loomiseks',
    icon: '🌿',
    notionCategory: 'PLANTS',
  },
}

/** Landing-/avalehe kaardid (järjestus: Birds + tarbekaubad). */
export const SHOP_CATEGORY_CARDS: Array<{
  id: string
  title: string
  slug: string
  description: string
  icon: string
}> = [
  {
    id: 'birds',
    title: SHOP_CATEGORIES.birds.title,
    slug: 'birds',
    description: SHOP_CATEGORIES.birds.description,
    icon: SHOP_CATEGORIES.birds.icon,
  },
  {
    id: 'feed-for-reptiles',
    title: SHOP_CATEGORIES['feed-for-reptiles'].title,
    slug: 'feed-for-reptiles',
    description: SHOP_CATEGORIES['feed-for-reptiles'].description,
    icon: SHOP_CATEGORIES['feed-for-reptiles'].icon,
  },
  {
    id: 'reptiles-amphibians',
    title: SHOP_CATEGORIES['reptiles-amphibians'].title,
    slug: 'reptiles-amphibians',
    description: SHOP_CATEGORIES['reptiles-amphibians'].description,
    icon: SHOP_CATEGORIES['reptiles-amphibians'].icon,
  },
  {
    id: 'plants',
    title: SHOP_CATEGORIES.plants.title,
    slug: 'plants',
    description: SHOP_CATEGORIES.plants.description,
    icon: SHOP_CATEGORIES.plants.icon,
  },
]

export function slugifyProductName(commonName: string): string {
  return commonName
    .toLowerCase()
    .replace(/õ/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapProductPage(page: any): ShopProduct {
  const properties = page.properties

  const code = properties.Code?.rich_text?.[0]?.plain_text || ''

  let genus = ''
  const genusProp = properties.Genus
  if (genusProp?.rich_text?.[0]?.plain_text) {
    genus = genusProp.rich_text[0].plain_text.trim()
  } else if (genusProp?.title?.[0]?.plain_text) {
    genus = genusProp.title[0].plain_text.trim()
  } else if (genusProp?.select?.name) {
    genus = genusProp.select.name.trim()
  } else if (genusProp?.formula?.string) {
    genus = genusProp.formula.string.trim()
  }

  let species = ''
  const speciesProp = properties.Species
  if (speciesProp?.rich_text?.[0]?.plain_text) {
    species = speciesProp.rich_text[0].plain_text.trim()
  } else if (speciesProp?.title?.[0]?.plain_text) {
    species = speciesProp.title[0].plain_text.trim()
  } else if (speciesProp?.select?.name) {
    species = speciesProp.select.name.trim()
  } else if (speciesProp?.formula?.string) {
    species = speciesProp.formula.string.trim()
  }

  let commonName = 'Nimetu toode'
  const commonNameProp = properties['Common Name']
  if (commonNameProp?.title?.[0]?.plain_text) {
    commonName = commonNameProp.title[0].plain_text.trim()
  } else if (commonNameProp?.rich_text?.[0]?.plain_text) {
    commonName = commonNameProp.rich_text[0].plain_text.trim()
  } else if (commonNameProp?.formula?.string) {
    commonName = commonNameProp.formula.string.trim()
  }

  const productCategory = properties.Kategooria?.select?.name || ''
  const status = properties.Staatus?.select?.name || ''
  const price = properties.Hind?.number || 0
  const availability =
    properties.Saadavus?.rich_text?.[0]?.plain_text ||
    properties.Saadavus?.select?.name ||
    ''

  return {
    id: page.id,
    code,
    genus,
    species,
    commonName,
    scientificName: `${genus} ${species}`.trim(),
    category: productCategory,
    status,
    price,
    availability,
    image: extractNotionFileUrl(properties.Pilt),
    slug: slugifyProductName(commonName),
  }
}

export async function getProducts(notionCategory?: string): Promise<ShopProduct[]> {
  const databaseId = process.env.NOTION_PETRA_AQUA_DATABASE_ID
  if (!databaseId) {
    console.error('NOTION_PETRA_AQUA_DATABASE_ID puudub')
    return []
  }

  try {
    const filters: any = {
      and: [{ property: 'Staatus', select: { equals: 'Aktiivne' } }],
    }

    if (notionCategory) {
      filters.and.push({
        property: 'Kategooria',
        select: { equals: decodeURIComponent(notionCategory) },
      })
    }

    const notion = getNotionClient()
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filters,
      sorts: [{ property: 'Common Name', direction: 'ascending' }],
    })

    return response.results.map(mapProductPage)
  } catch (error) {
    console.error('Petra-Aqua products fetch viga:', error)
    return []
  }
}

export async function getProductBySlug(
  notionCategory: string,
  slug: string
): Promise<ShopProduct | null> {
  const products = await getProducts(notionCategory)
  return products.find((p) => p.slug === slug) ?? null
}

/** Kõik aktiivsed tooted (generateStaticParams jaoks). */
export async function getAllShopStaticParams(): Promise<
  { category: string; slug: string }[]
> {
  const params: { category: string; slug: string }[] = []
  const slugByNotion = Object.entries(SHOP_CATEGORIES)

  for (const [categorySlug, meta] of slugByNotion) {
    const products = await getProducts(meta.notionCategory)
    for (const product of products) {
      if (product.slug) {
        params.push({ category: categorySlug, slug: product.slug })
      }
    }
  }

  return params
}
