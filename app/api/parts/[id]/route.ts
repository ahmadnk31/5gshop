import { NextRequest, NextResponse } from 'next/server';
import { getPartById } from '@/app/actions/part-actions';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let { id } = await params;
  if (id.startsWith('part-')) {
    id = id.replace(/^part-/, '');
  }
  console.log('API /api/parts/[id] called with id:', id);
  const part = await getPartById(id);
  console.log('Result from getPartById:', part);
  if (!part) {
    return NextResponse.json({ error: 'Part not found' }, { status: 404 });
  }
  return NextResponse.json(part);
}
