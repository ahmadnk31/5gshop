import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    // Dynamically import Fuse.js to prevent build-time issues
    const Fuse = (await import('fuse.js')).default;

    // Get all accessories and search through them
    const accessories = await DatabaseService.getAllAccessoriesSimple();

    // Only include accessories with price > 0
    const validAccessories = accessories.filter(
      (a: any) => typeof a.price === 'number' && a.price > 0
    );

    // Fuse.js options for multi-field fuzzy search
    const fuse = new Fuse(validAccessories, {
      keys: ['name', 'description', 'category'],
      threshold: 0.4, // Adjust for fuzziness
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    const fuseResults = fuse.search(query).slice(0, 10);
    const searchResults = fuseResults.map(({ item }) => ({
      id: item.id,
      name: item.name,
      title: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      type: 'accessory',
      imageUrl: item.imageUrl,
      compatibility: item.compatibility,
      url: `/accessories/${item.id}`,
    }));

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Search accessories error:', error);
    return NextResponse.json([]);
  }
}