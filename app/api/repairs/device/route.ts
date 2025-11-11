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

    // Normalize model names for better matching
    // Handles: "14 Inch" vs "14-inch", "Macbook" vs "MacBook", etc.
    const normalizeForComparison = (name: string) => {
      return name
        .toLowerCase()
        .replace(/\s*-\s*/g, '-')           // Normalize spaces around hyphens
        .replace(/\s+inch\b/gi, '-inch')     // Convert " inch" to "-inch"
        .replace(/\binch\b/gi, '-inch')      // Convert standalone "inch" to "-inch"
        .replace(/[(),]/g, '')               // Remove special chars for comparison
        .replace(/\s+/g, '')                 // Remove all spaces for comparison
        .trim();
    };

    // Try multiple strategies to find the device
    let device = null;
    
    // Strategy 1: Exact match (case-insensitive)
    device = await prisma.device.findFirst({
      where: {
        type: deviceType,
        brand: { equals: brand, mode: 'insensitive' },
        model: { equals: model, mode: 'insensitive' },
      },
    });

    // Strategy 2: Match with spaces instead of hyphens in the search term
    if (!device) {
      device = await prisma.device.findFirst({
        where: {
          type: deviceType,
          brand: { equals: brand, mode: 'insensitive' },
          model: { equals: model.replace(/-/g, ' '), mode: 'insensitive' },
        },
      });
    }

    // Strategy 3: Fetch all devices of this brand/type and do fuzzy matching
    if (!device) {
      const allDevices = await prisma.device.findMany({
        where: {
          type: deviceType,
          brand: { equals: brand, mode: 'insensitive' },
        },
      });
      
      const normalizedSearch = normalizeForComparison(model);
      device = allDevices.find(d => 
        normalizeForComparison(d.model) === normalizedSearch
      ) || null;
    }

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
