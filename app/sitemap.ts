
import { MetadataRoute } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://petsvilla.ee'
  const categorySlugMap: Record<string, string> = {
    'BIRDS': 'birds',
    'FEED FOR REPTILES': 'feed-for-reptiles',
    'REPTILES & AMPHIBIANS': 'reptiles-amphibians',
    'PLANTS': 'plants',
  }
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/merisead`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/viirpapagoid`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hein`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/meist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/telli-hein`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blogi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pood`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pood/birds`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pood/feed-for-reptiles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pood/reptiles-amphibians`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pood/plants`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/muugitingimused`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tagastuspoliitika`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tarneinfo`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sonum-saadetud`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
    {
      url: `${baseUrl}/privaatsuspoliitika`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kupsiste-teadaanne`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID
    
    if (databaseId) {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Avaldatud',
          checkbox: {
            equals: true
          }
        },
        sorts: [
          {
            property: 'Avaldamise_kuupaev',
            direction: 'descending'
          }
        ]
      })

      blogPosts = response.results.map((page: any) => {
        const properties = page.properties
        const slug = properties.Slug?.rich_text?.[0]?.plain_text || ''
        const publishedDate = properties.Avaldamise_kuupaev?.date?.start || new Date().toISOString()
        const coverProperty = properties.Kaanepilt
        let coverImage = `${baseUrl}/og-image.png`

        if (coverProperty?.files?.[0]) {
          const file = coverProperty.files[0]
          if (file.type === 'external') {
            coverImage = file.external.url
          } else if (file.type === 'file') {
            coverImage = file.file.url
          }
        }
        
        return {
          url: `${baseUrl}/blogi/${slug}`,
          lastModified: new Date(publishedDate),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          images: [coverImage],
        }
      }).filter((post: any) => post.url.includes('/blogi/') && !post.url.endsWith('/blogi/'))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Dynamic product pages
  try {
    const productDatabaseId = process.env.NOTION_PETRA_AQUA_DATABASE_ID
    if (productDatabaseId) {
      const response = await notion.databases.query({
        database_id: productDatabaseId,
        filter: {
          property: 'Staatus',
          select: { equals: 'Aktiivne' },
        },
        sorts: [
          {
            property: 'Common Name',
            direction: 'ascending',
          },
        ],
      })

      productPages = response.results.map((page: any) => {
        const properties = page.properties
        const category = properties.Kategooria?.select?.name || ''
        const slug = (() => {
          const commonName =
            properties['Common Name']?.title?.[0]?.plain_text ||
            properties['Common Name']?.rich_text?.[0]?.plain_text ||
            properties['Common Name']?.formula?.string ||
            'nimetu-toode'
          return commonName
            .toLowerCase()
            .replace(/õ/g, 'o')
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/ü/g, 'u')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        })()

        const categorySlug = categorySlugMap[category]
        if (!categorySlug || !slug) {
          return null
        }

        return {
          url: `${baseUrl}/pood/${categorySlug}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }
      }).filter(Boolean) as MetadataRoute.Sitemap
    }
  } catch (error) {
    console.error('Error fetching product pages for sitemap:', error)
  }

  return [...staticPages, ...blogPosts, ...productPages]
}
