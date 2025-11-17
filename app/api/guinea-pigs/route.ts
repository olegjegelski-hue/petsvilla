
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
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Notion database ID puudub' },
        { status: 500 }
      );
    }

    // Pärime andmebaasi andmeid, filtreerides ainult saadaolevad beebed
    // Filtreerime ainult need beebed, kus Staatus on "Emmega" või "Broneeritud"
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'Staatus',
            select: {
              equals: 'Emmega'
            }
          },
          {
            property: 'Staatus',
            select: {
              equals: 'Broneeritud'
            }
          }
        ]
      }
    });

    // Töötleme Notion andmeid
    const guineaPigs = response.results.map((page: any) => {
      const properties = page.properties;
      
      // Ekstreeme vajalikud andmed kasutades õigeid välja nimesid
      const name = 
        properties.Beebi?.title?.[0]?.plain_text || 
        'Nimetu';
      
      const price = 
        properties.Maksumus?.number || 
        0;
      
      const color = 
        properties.Värvus?.rich_text?.[0]?.plain_text || 
        '';
      
      // Vanus on formula, seega kasutame formula.string või formula.number
      const age = 
        properties.Vanus?.formula?.string || 
        properties.Vanus?.formula?.number?.toString() || 
        '';
      
      const gender = 
        properties.Sugu?.select?.name || 
        '';
      
      const breed = 
        properties.Tõug?.select?.name || 
        '';
      
      const birthDate = 
        properties['Sündis']?.date?.start || 
        '';
      
      const available = 
        properties.Saadaval?.formula?.date?.start || 
        '';
      
      const status = 
        properties.Staatus?.select?.name || 
        '';
      
      // Ekstreeme pildi
      let image = '/placeholder-guinea-pig.jpg';
      const imageProperty = properties.Pilt;
      
      if (imageProperty?.files?.[0]) {
        const file = imageProperty.files[0];
        if (file.type === 'external') {
          image = file.external.url;
        } else if (file.type === 'file') {
          image = file.file.url;
        }
      }

      return {
        id: page.id,
        name,
        price,
        color,
        age,
        gender,
        breed,
        birthDate,
        available,
        status,
        image,
      };
    });

    return NextResponse.json({ guineaPigs });
  } catch (error: any) {
    console.error('Notion API viga:', error);
    
    // Tagastame tühja nimekirja, et frontend saaks kasutada fallback andmeid
    return NextResponse.json(
      { 
        guineaPigs: [],
        error: 'Notion andmed ei ole kättesaadavad',
        message: 'Palun jaga Notion andmebaas integratsiooniga või kontrolli API võtit.'
      },
      { status: 200 }
    );
  }
}
