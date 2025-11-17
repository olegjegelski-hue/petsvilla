
import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageId = params.id;

    // Hankige Notion lehekülg
    const page: any = await notion.pages.retrieve({
      page_id: pageId,
    });

    // Ekstraheerime kaanepildi
    let imageUrl = '/placeholder-guinea-pig.jpg';
    const imageProperty = page.properties.Kaanepilt;

    if (imageProperty?.files?.[0]) {
      const file = imageProperty.files[0];
      if (file.type === 'external') {
        imageUrl = file.external.url;
      } else if (file.type === 'file') {
        imageUrl = file.file.url;
      }
    }

    // Redirect'i värske URL'ile
    return NextResponse.redirect(imageUrl);
  } catch (error: any) {
    console.error('Blogi pildi hankimine ebaõnnestus:', error);
    
    // Tagasta placeholder kui viga
    return NextResponse.redirect('/placeholder-guinea-pig.jpg');
  }
}
