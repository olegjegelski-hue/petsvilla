
import { MetadataRoute } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://petsvilla.ee'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/meriseabeebid`,
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
        
        return {
          url: `${baseUrl}/blogi/${slug}`,
          lastModified: new Date(publishedDate),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }
      }).filter((post: any) => post.url.includes('/blogi/') && !post.url.endsWith('/blogi/'))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [...staticPages, ...blogPosts]
}
