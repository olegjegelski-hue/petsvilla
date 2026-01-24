
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import Script from 'next/script'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
})

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  publishedDate: string
  category: string
  author: string
  readTime: number
  coverImage: string
}

// Fetch blog post from Notion (server-side)
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID
    
    if (!databaseId) {
      return null
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Avaldatud',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          }
        ]
      }
    })

    if (response.results.length === 0) {
      return null
    }

    const page: any = response.results[0]
    const properties = page.properties

    const title = properties.Pealkiri?.title?.[0]?.plain_text || 'Pealkiri puudub'
    const description = properties.Kirjeldus?.rich_text?.[0]?.plain_text || ''
    
    // Get content from Sisu property first
    let content = properties.Sisu?.rich_text?.map((rt: any) => rt.plain_text).join('') || ''
    
    // If Sisu is empty or short, try to get content from page blocks
    if (!content || content.length < 100) {
      try {
        const blocks = await notion.blocks.children.list({
          block_id: page.id,
          page_size: 100,
        })
        
        const blockContent = blocks.results
          .map((block: any) => {
            if (block.type === 'paragraph') {
              return block.paragraph?.rich_text?.map((rt: any) => rt.plain_text).join('') || ''
            }
            if (block.type === 'heading_1') {
              return '## ' + (block.heading_1?.rich_text?.map((rt: any) => rt.plain_text).join('') || '')
            }
            if (block.type === 'heading_2') {
              return '### ' + (block.heading_2?.rich_text?.map((rt: any) => rt.plain_text).join('') || '')
            }
            if (block.type === 'heading_3') {
              return '#### ' + (block.heading_3?.rich_text?.map((rt: any) => rt.plain_text).join('') || '')
            }
            if (block.type === 'bulleted_list_item') {
              return '• ' + (block.bulleted_list_item?.rich_text?.map((rt: any) => rt.plain_text).join('') || '')
            }
            if (block.type === 'numbered_list_item') {
              return '- ' + (block.numbered_list_item?.rich_text?.map((rt: any) => rt.plain_text).join('') || '')
            }
            return ''
          })
          .filter((text: string) => text.trim())
          .join('\n\n')
        
        if (blockContent) {
          content = blockContent
        }
      } catch (blockError) {
        console.error('Error fetching page blocks:', blockError)
      }
    }
    
    const publishedDate = properties.Avaldamise_kuupaev?.date?.start || ''
    const category = properties.Kategooria?.select?.name || ''
    const author = properties.Autor?.rich_text?.[0]?.plain_text || 'PetsVilla'
    const readTime = properties.Lugemisaeg?.number || 5

    let coverImage = '/placeholder-guinea-pig.jpg'
    const imageProperty = properties.Kaanepilt

    if (imageProperty?.files?.[0]) {
      const file = imageProperty.files[0]
      if (file.type === 'external') {
        coverImage = file.external.url
      } else if (file.type === 'file') {
        coverImage = file.file.url
      }
    }

    return {
      id: page.id,
      title,
      slug,
      description,
      content,
      publishedDate,
      category,
      author,
      readTime,
      coverImage,
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Postitus ei leitud - PetsVilla Blogi',
      description: 'Blogipositust ei leitud.',
    }
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://petsvilla.ee'

  return {
    title: `${post.title} - PetsVilla Blogi`,
    description: post.description,
    keywords: [
      post.title,
      post.category,
      'lemmikloomade blogi',
      'merisead',
      'viirpapagoid',
      'loomade hooldus',
      'PetsVilla',
    ],
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${baseUrl}/blogi/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blogi/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return notFound()
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://petsvilla.ee'

  // Schema.org Article structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PetsVilla OÜ',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blogi/${post.slug}`,
    },
    articleSection: post.category,
    inLanguage: 'et-EE',
  }

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Avaleht',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogi',
        item: `${baseUrl}/blogi`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/blogi/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <Script
        id="article-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        <Navigation />
        
        <article className="py-20">
          <div className="container mx-auto max-w-4xl px-4">
            {/* Back Button */}
            <Link href="/blogi">
              <Button variant="ghost" className="mb-8 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Tagasi blogisse
              </Button>
            </Link>

            <Card className="border-0 shadow-lg overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-96 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                {post.category && (
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-purple-500 hover:bg-purple-600">
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-8 md:p-12">
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                  {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.publishedDate).toLocaleDateString('et-EE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} min lugemist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✍️ {post.author}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {post.content}
                  </div>
                </div>

                {/* Author Box */}
                <div className="mt-12 pt-8 border-t">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="font-semibold text-gray-900 mb-1">Autor</p>
                    <p className="text-gray-600">{post.author}</p>
                  </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                  <Link href="/blogi">
                    <Button size="lg" className="bg-purple-500 hover:bg-purple-600">
                      Vaata teisi postitusi
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </article>

        <Footer />
      </div>
    </>
  )
}
