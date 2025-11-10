import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { DeviceType } from '@/lib/types';
import { getPartsByDeviceModel } from '@/app/actions/device-catalog-actions';
import { getRepairServicesForDevice } from '@/app/actions/repair-services-actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceType = searchParams.get('type') as DeviceType | null;
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');

    if (!deviceType || !brand || !model) {
      return NextResponse.json(
        { error: 'Device type, brand, and model are required' },
        { status: 400 }
      );
    }

    // Find the specific device
    const device = await prisma.device.findFirst({
      where: {
        type: deviceType,
        brand: {
          equals: brand,
          mode: 'insensitive',
        },
        OR: [
          {
            model: {
              equals: model,
              mode: 'insensitive',
            },
          },
          {
            model: {
              contains: model.replace(/-/g, ' '),
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    // Fetch parts and services in parallel
    const [parts, services] = await Promise.all([
      getPartsByDeviceModel(deviceType, brand, device.model).catch(() => []),
      getRepairServicesForDevice(deviceType, brand, device.model).catch(() => []),
    ]);

    return NextResponse.json(
      {
        device,
        parts,
        services,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[API] Error fetching device details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch device details' },
      { status: 500 }
    );
  }
}
