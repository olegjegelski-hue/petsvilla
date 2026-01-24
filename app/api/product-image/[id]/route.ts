
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;

    // Pärime Notion lehekülje andmeid
    const page: any = await notion.pages.retrieve({
      page_id: pageId,
    });

    // Ekstraheerime pildi URL
    const imageProperty = page.properties.Pilt;
    let imageUrl = '/placeholder-guinea-pig.jpg';

    if (imageProperty?.files?.[0]) {
      const file = imageProperty.files[0];
      if (file.type === 'external') {
        imageUrl = file.external.url;
      } else if (file.type === 'file') {
        imageUrl = file.file.url;
      }
    }

    // Redirect'ime värske pildi URL'ile
    // Kui imageUrl on suhteline, konverteerime absoluutseks
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : new URL(imageUrl, request.url).toString();
    
    return NextResponse.redirect(absoluteImageUrl);
  } catch (error: any) {
    console.error('Toote pildi hankimine ebaõnnestus:', error);
    
    // Fallback placeholder'ile (absoluutne URL)
    return NextResponse.redirect(
      new URL('/placeholder-guinea-pig.jpg', request.url).toString()
    );
  }
}
