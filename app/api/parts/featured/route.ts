import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedParts } from '@/app/actions/part-actions';

export async function GET(req: NextRequest) {
  try {
    // Get limit from query params, default to 4
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '4');
    
    console.log('API /api/parts/featured called with limit:', limit);
    
    const featuredParts = await getFeaturedParts(limit);
    console.log('Result from getFeaturedParts:', featuredParts.length, 'parts found');
    
    return NextResponse.json(featuredParts);
  } catch (error) {
    console.error('Error in featured parts API:', error);
    return NextResponse.json({ error: 'Failed to get featured parts' }, { status: 500 });
  }
} 