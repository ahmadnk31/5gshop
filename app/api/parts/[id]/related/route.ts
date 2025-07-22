import { NextRequest, NextResponse } from 'next/server';
import { getRelatedParts } from '@/app/actions/part-actions';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    let { id } = await params;
    if (id.startsWith('part-')) {
      id = id.replace(/^part-/, '');
    }
    
    // Get limit from query params, default to 4
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '4');
    
    console.log('API /api/parts/[id]/related called with id:', id, 'limit:', limit);
    
    const relatedParts = await getRelatedParts(id, limit);
    console.log('Result from getRelatedParts:', relatedParts.length, 'parts found');
    
    return NextResponse.json(relatedParts);
  } catch (error) {
    console.error('Error in related parts API:', error);
    return NextResponse.json({ error: 'Failed to get related parts' }, { status: 500 });
  }
} 