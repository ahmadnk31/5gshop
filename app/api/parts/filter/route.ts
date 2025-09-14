import { NextRequest, NextResponse } from 'next/server';
import { getPartsByTypeBrandModel } from '@/app/actions/part-actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const model = searchParams.get('model') || undefined;
  
  // Return empty array if no type is provided
  if (!type) {
    return NextResponse.json({ data: [] });
  }
  
  // Convert type to uppercase to match database values
  const deviceType = type.toUpperCase();
  
  try {
    const parts = await getPartsByTypeBrandModel(deviceType, brand, model);
    return NextResponse.json({ data: parts });
  } catch (error) {
    console.error('Failed to fetch filtered parts:', error);
    return NextResponse.json({ error: 'Failed to fetch filtered parts' }, { status: 500 });
  }
} 