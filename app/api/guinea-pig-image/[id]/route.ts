
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID puudub' },
        { status: 400 }
      );
    }

    // Fetch the specific page from Notion
    const page = await notion.pages.retrieve({ page_id: id });
    
    // Extract image URL
    const properties = (page as any).properties;
    const imageProperty = properties.Pilt;
    
    let imageUrl = '/placeholder-guinea-pig.jpg';
    
    if (imageProperty?.files?.[0]) {
      const file = imageProperty.files[0];
      if (file.type === 'external') {
        imageUrl = file.external.url;
      } else if (file.type === 'file') {
        imageUrl = file.file.url;
      }
    }
    
    // Redirect to the fresh image URL
    if (imageUrl.startsWith('http')) {
      return NextResponse.redirect(imageUrl);
    } else {
      // Construct absolute URL for placeholder
      const baseUrl = new URL(request.url).origin;
      const absoluteUrl = `${baseUrl}${imageUrl}`;
      return NextResponse.redirect(absoluteUrl);
    }
  } catch (error: any) {
    console.error('Pildi laadimine ebaõnnestus:', error);
    
    // Return placeholder on error
    return NextResponse.json(
      { imageUrl: '/placeholder-guinea-pig.jpg' },
      { status: 200 }
    );
  }
}
