import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { DeviceType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceType = searchParams.get('type') as DeviceType | null;
    const brand = searchParams.get('brand');

    if (!deviceType || !brand) {
      return NextResponse.json(
        { error: 'Device type and brand are required' },
        { status: 400 }
      );
    }

    // Fetch models for this brand and device type
    const models = await prisma.device.findMany({
      where: {
        type: deviceType,
        brand: {
          equals: brand,
          mode: 'insensitive',
        },
      },
      orderBy: [
        { order: 'desc' },
        { model: 'asc' },
      ],
    });

    return NextResponse.json(models, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
