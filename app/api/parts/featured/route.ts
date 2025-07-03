import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedParts } from '@/app/actions/part-actions';

export async function GET(req: NextRequest) {
  try {
    // Get limit and filters from query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '4');
    const type = searchParams.get('type') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const model = searchParams.get('model') || undefined;
    
    console.log('API /api/parts/featured called with', { limit, type, brand, model });
    
    const featuredParts = await getFeaturedParts(limit, type, brand, model);
    console.log('Result from getFeaturedParts:', featuredParts.length, 'parts found');
    
    return NextResponse.json(featuredParts);
  } catch (error) {
    console.error('Error in featured parts API:', error);
    return NextResponse.json({ error: 'Failed to get featured parts' }, { status: 500 });
  }
} 