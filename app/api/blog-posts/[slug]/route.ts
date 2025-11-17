
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
});

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
    
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion blog database ID puudub' },
        { status: 500 }
      );
    }

    // Otsime postitust slug järgi
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
              equals: params.slug
            }
          }
        ]
      }
    });

    if (response.results.length === 0) {
      return NextResponse.json(
        { error: 'Postitust ei leitud' },
        { status: 404 }
      );
    }

    const page: any = response.results[0];
    const properties = page.properties;
    
    // Ekstraheerime kõik väljad
    const title = 
      properties.Pealkiri?.title?.[0]?.plain_text || 
      'Pealkiri puudub';
    
    const slug = 
      properties.Slug?.rich_text?.[0]?.plain_text || 
      '';
    
    const description = 
      properties.Kirjeldus?.rich_text?.[0]?.plain_text || 
      '';
    
    const content = 
      properties.Sisu?.rich_text?.[0]?.plain_text || 
      '';
    
    const publishedDate = 
      properties.Avaldamise_kuupaev?.date?.start || 
      '';
    
    const category = 
      properties.Kategooria?.select?.name || 
      '';
    
    const author = 
      properties.Autor?.rich_text?.[0]?.plain_text || 
      'PetsVilla';
    
    const readTime = 
      properties.Lugemisaeg?.number || 
      5;
    
    // Kasutame proxy URL'i, mis hankib värske pildi URL'i Notionist
    const coverImage = `/api/blog-image/${page.id}`;

    const post = {
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
    };

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Notion API viga (blog post):', error);
    
    return NextResponse.json(
      { 
        error: 'Postituse andmed ei ole kättesaadavad',
        message: error.message
      },
      { status: 500 }
    );
  }
}
