import { NextRequest, NextResponse } from 'next/server';
import { getPartsByTypeBrandModel } from '@/app/actions/part-actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const model = searchParams.get('model') || undefined;
  try {
    const parts = await getPartsByTypeBrandModel(type, brand, model);
    return NextResponse.json({ data: parts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch filtered parts' }, { status: 500 });
  }
} 