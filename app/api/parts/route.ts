import { NextRequest, NextResponse } from 'next/server';
import { getParts } from '@/app/actions/part-actions';

export async function GET(req: NextRequest) {
  const parts = await getParts();
  return NextResponse.json(parts);
}
