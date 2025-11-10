import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { DeviceType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceType = searchParams.get('type') as DeviceType | null;

    if (!deviceType) {
      return NextResponse.json(
        { error: 'Device type is required' },
        { status: 400 }
      );
    }

    // Get distinct brands with their device count
    const devicesWithBrands = await prisma.device.groupBy({
      by: ['brand'],
      where: {
        type: deviceType,
      },
      _count: {
        id: true,
      },
      orderBy: {
        brand: 'asc',
      },
    });

    // Get image URL for each brand (first device image)
    const brandsWithImages = await Promise.all(
      devicesWithBrands.map(async (brandGroup) => {
        const firstDevice = await prisma.device.findFirst({
          where: {
            type: deviceType,
            brand: brandGroup.brand,
          },
          select: {
            imageUrl: true,
          },
        });

        return {
          brand: brandGroup.brand,
          count: brandGroup._count.id,
          imageUrl: firstDevice?.imageUrl || undefined,
        };
      })
    );

    return NextResponse.json(brandsWithImages, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
