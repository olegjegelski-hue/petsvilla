
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
});

export async function GET(request: Request) {
  try {
    const databaseId = process.env.NOTION_PETRA_AQUA_DATABASE_ID;
    
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Petra-Aqua database ID puudub' },
        { status: 500 }
      );
    }

    // Pärime URL parameetreid
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // nt "Birds", "Fish", jne

    // Loome filtri objekti
    const filters: any = {
      and: [
        {
          property: 'Staatus',
          select: {
            equals: 'Aktiivne'
          }
        }
      ]
    };

    // Kui kategooria on määratud, lisame selle filtrisse
    if (category) {
      // Teisendame URL-friendly slug tagasi Notion kategooriaks
      // Näiteks: "BIRDS" → "BIRDS", "TROPICAL" → "TROPICAL"
      // URL decode kategoorianimede jaoks nagu "REPTILES & AMPHIBIANS"
      const notionCategory = decodeURIComponent(category);
      
      filters.and.push({
        property: 'Kategooria',
        select: {
          equals: notionCategory
        }
      });
    }

    // Pärime Petra-Aqua andmebaasi andmeid
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filters,
      sorts: [
        {
          property: 'Common Name',
          direction: 'ascending'
        }
      ]
    });

    // Töötleme Notion andmeid
    const products = response.results.map((page: any) => {
      const properties = page.properties;
      
      // Ekstraheerime väljad
      const code = 
        properties.Code?.rich_text?.[0]?.plain_text || 
        '';
      
      // Ekstraheerime Genus - võib olla rich_text, title, select või formula
      let genus = '';
      const genusProp = properties.Genus;
      
      if (genusProp?.rich_text?.[0]?.plain_text) {
        genus = genusProp.rich_text[0].plain_text.trim();
      } else if (genusProp?.title?.[0]?.plain_text) {
        genus = genusProp.title[0].plain_text.trim();
      } else if (genusProp?.select?.name) {
        genus = genusProp.select.name.trim();
      } else if (genusProp?.formula?.string) {
        genus = genusProp.formula.string.trim();
      }
      
      // Ekstraheerime Species - võib olla rich_text, title, select või formula
      let species = '';
      const speciesProp = properties.Species;
      
      if (speciesProp?.rich_text?.[0]?.plain_text) {
        species = speciesProp.rich_text[0].plain_text.trim();
      } else if (speciesProp?.title?.[0]?.plain_text) {
        species = speciesProp.title[0].plain_text.trim();
      } else if (speciesProp?.select?.name) {
        species = speciesProp.select.name.trim();
      } else if (speciesProp?.formula?.string) {
        species = speciesProp.formula.string.trim();
      }
      
      // Ekstraheerime Common Name - võib olla title, rich_text või formula
      let commonName = 'Nimetu toode';
      const commonNameProp = properties['Common Name'];
      
      if (commonNameProp?.title?.[0]?.plain_text) {
        commonName = commonNameProp.title[0].plain_text.trim();
      } else if (commonNameProp?.rich_text?.[0]?.plain_text) {
        commonName = commonNameProp.rich_text[0].plain_text.trim();
      } else if (commonNameProp?.formula?.string) {
        commonName = commonNameProp.formula.string.trim();
      }
      
      const productCategory = 
        properties.Kategooria?.select?.name || 
        '';
      
      const status = 
        properties.Staatus?.select?.name || 
        '';
      
      // Ekstraheerime hinna
      const price = properties.Hind?.number || 0;
      
      // Ekstraheerime saadavuse
      const availability = 
        properties.Saadavus?.rich_text?.[0]?.plain_text || 
        properties.Saadavus?.select?.name ||
        '';
      
      // Ekstraheerime pildi
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

      // Loome slug'i common name'ist
      const slug = commonName
        .toLowerCase()
        .replace(/õ/g, 'o')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

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
        image,
        slug,
      };
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Petra-Aqua API viga:', error);
    
    return NextResponse.json(
      { 
        products: [],
        error: 'Petra-Aqua andmed ei ole kättesaadavad',
        message: error.message
      },
      { status: 200 }
    );
  }
}
