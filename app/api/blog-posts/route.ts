
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
});

export async function GET() {
  try {
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
    
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion blog database ID puudub' },
        { status: 500 }
      );
    }

    // Pärime blogi andmebaasi, filtreerides ainult avaldatud postitused
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
    });

    // Töötleme Notion andmeid
    const posts = response.results.map((page: any) => {
      const properties = page.properties;
      
      // Ekstraheerime väljad
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
      
      const categories = (() => {
        const prop = properties.Kategooria
        if (prop?.select?.name) {
          return [prop.select.name]
        }
        if (Array.isArray(prop?.multi_select)) {
          return prop.multi_select.map((item: any) => item?.name).filter(Boolean)
        }
        const text = prop?.rich_text?.[0]?.plain_text
        return text ? [text] : []
      })()

      const category = categories[0] || ''

      const animals = (() => {
        const prop = properties.Loom
        if (prop?.select?.name) {
          return [prop.select.name]
        }
        if (Array.isArray(prop?.multi_select)) {
          return prop.multi_select.map((item: any) => item?.name).filter(Boolean)
        }
        const text = prop?.rich_text?.[0]?.plain_text
        return text ? [text] : []
      })()
      
      const author = 
        properties.Autor?.rich_text?.[0]?.plain_text || 
        'PetsVilla';
      
      const readTime = 
        properties.Lugemisaeg?.number || 
        5;
      
      // Kasutame proxy URL'i, mis hankib värske pildi URL'i Notionist
      const coverImage = `/api/blog-image/${page.id}`;

      return {
        id: page.id,
        title,
        slug,
        description,
        content,
        publishedDate,
        category,
        categories,
        author,
        animals,
        readTime,
        coverImage,
      };
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Notion API viga (blog):', error);
    
    return NextResponse.json(
      { 
        posts: [],
        error: 'Blogi andmed ei ole kättesaadavad',
        message: error.message
      },
      { status: 200 }
    );
  }
}
