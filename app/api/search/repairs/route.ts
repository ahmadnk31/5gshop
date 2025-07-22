import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import Fuse from 'fuse.js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const deviceTypeFilter = searchParams.get('deviceType');

    if (!query) {
      return NextResponse.json([]);
    }

    // Get all devices and parts
    const devices = await DatabaseService.getAllDevicesSimple();
    const parts = await DatabaseService.getAllPartsSimple();

    // Enrich parts with device info for better search
    const enrichedParts = parts.map((part: any) => {
      let foundDevice = null;
      if (part.deviceModel) {
        foundDevice = devices.find((device: any) => 
          device.model === part.deviceModel && 
          device.type === part.deviceType
        );
      }
      return {
        ...part,
        deviceBrand: foundDevice?.brand || '',
        deviceModel: foundDevice?.model || '',
        deviceType: part.deviceType || foundDevice?.type || '',
        fullDeviceName: foundDevice ? `${foundDevice.brand} ${foundDevice.model}` : '',
      };
    });

    // Apply device type filter if provided
    const filteredParts = deviceTypeFilter
      ? enrichedParts.filter((part: any) =>
          part.deviceType?.toUpperCase() === deviceTypeFilter.toUpperCase()
        )
      : enrichedParts;

    // Only include in-stock parts
    const inStockParts = filteredParts.filter((part: any) => part.inStock > 0);

    // Fuse.js options for multi-field fuzzy search
    const fuse = new Fuse(inStockParts, {
      keys: [
        'name',
        'description',
        'deviceModel',
        'deviceBrand',
        'fullDeviceName',
        'deviceType',
      ],
      threshold: 0.4, // Adjust for fuzziness
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    const fuseResults = fuse.search(query).slice(0, 10);
    const searchResults = fuseResults.map(({ item }) => {
      // Compose display name
      let displayName = item.name;
      if (
        item.deviceBrand &&
        item.deviceModel &&
        !item.name.toLowerCase().includes(item.deviceModel.toLowerCase())
      ) {
        displayName = `${item.deviceBrand} ${item.deviceModel} ${item.name}`;
      }
      const cost = typeof item.cost === 'number' && !isNaN(item.cost) ? item.cost : 0;
      const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : cost;
      const imageUrl = item.imageUrl || '/images/default-part.png';
      const inStock = typeof item.inStock === 'number' ? item.inStock : 0;
      const id = item.id ? `part-${item.id}` : undefined;
      const name = displayName || item.name || '';
if (id && name && cost > 0 && imageUrl && inStock >= 0) {
        return {
    id,
    name,
    title: name,
          description:
            item.description ||
            `${item.name} for ${
              item.deviceBrand && item.deviceModel
                ? `${item.deviceBrand} ${item.deviceModel}`
                : 'compatible devices'
            }`,
          cost,
          price,
          sku: item.sku || '',
    category: 'Replacement Part',
          deviceType: item.deviceType || 'GENERAL',
          deviceBrand: item.deviceBrand || 'Universal',
          brand: item.deviceBrand || 'Universal',
          deviceModel: item.deviceModel || 'Compatible',
          partName: item.name,
    inStock,
          url: `/parts/${item.id}`,
    type: 'part',
    imageUrl,
          supplier: item.supplier || '',
          quality: item.quality || 'Unknown',
        };
}
      return null;
    }).filter(Boolean);

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Parts search error:', error);
    return NextResponse.json([]);
  }
}
