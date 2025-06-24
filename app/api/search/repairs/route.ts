import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

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
    const searchResults: any[] = [];

    // Search through parts for matching devices
    parts.forEach((part: any) => {
      const searchTerm = query.toLowerCase();
      const partName = part.name?.toLowerCase() || '';
      const partDescription = part.description?.toLowerCase() || '';
      const deviceModel = part.deviceModel?.toLowerCase() || '';
      const deviceType = part.deviceType?.toLowerCase() || '';
      
      // Clean search term by removing "part" and related words for better matching
      const cleanedSearchTerm = searchTerm
        .replace(/\b(part|parts|component|components|replacement)\b/g, '')
        .trim();

      // Apply device type filter if provided
      if (deviceTypeFilter && part.deviceType?.toUpperCase() !== deviceTypeFilter.toUpperCase()) {
        return; // Skip this part if it doesn't match the filter
      }

      // Check if search matches part or device info
      const searchTermLower = searchTerm.toLowerCase();
      const cleanedSearchTermLower = cleanedSearchTerm.toLowerCase();

      // For parts, we want to match:
      // 1. Part name (e.g., "Battery", "Screen")
      // 2. Device model (e.g., "iPhone 14", "Galaxy S23") 
      // 3. Combined (e.g., "iPhone 14 Battery")

      let matchScore = 0;
      let foundDevice = null;

      // Try to find the device this part belongs to
      if (part.deviceModel) {
        foundDevice = devices.find((device: any) => 
          device.model === part.deviceModel && 
          device.type === part.deviceType
        );
      }

      if (foundDevice) {
        const deviceBrand = foundDevice.brand?.toLowerCase() || '';
        const fullDeviceName = `${deviceBrand} ${deviceModel}`.toLowerCase();
        
        // Check device matching first
        const isExactDeviceMatch = fullDeviceName === searchTermLower || 
                                   deviceModel === searchTermLower ||
                                   `${deviceBrand} ${deviceModel}` === searchTermLower;

        const deviceContainsMatch = deviceBrand.includes(searchTermLower) ||
                                   deviceModel.includes(searchTermLower) ||
                                   fullDeviceName.includes(searchTermLower);

        // Check part name matching
        const isPartNameMatch = partName.includes(searchTermLower) ||
                               partName.includes(cleanedSearchTermLower);

        // Scoring for parts
        if (isExactDeviceMatch && isPartNameMatch) matchScore = 90; // Exact device + part match
        else if (isExactDeviceMatch) matchScore = 70; // Exact device match
        else if (deviceContainsMatch && isPartNameMatch) matchScore = 60; // Device + part match
        else if (deviceContainsMatch) matchScore = 50; // Device match only
        else if (isPartNameMatch) matchScore = 40; // Part name match only
      } else {
        // Universal part (no specific device model)
        const isPartNameMatch = partName.includes(searchTermLower) ||
                               partName.includes(cleanedSearchTermLower);
        
        if (isPartNameMatch) matchScore = 30; // Universal part match
      }

      // Only include parts that are in stock and have a match
      if (matchScore > 0 && part.inStock > 0) {
        // Avoid duplication: if part name already contains device info, use it as-is
        let displayName = part.name;
        
        if (foundDevice) {
          const deviceFullName = `${foundDevice.brand} ${foundDevice.model}`;
          const deviceModel = foundDevice.model;
          const partNameLower = part.name.toLowerCase();
          
          // Check if part name already contains the device model
          // (e.g., "iPhone 14 Battery" contains "iPhone 14")
          const modelInPartName = partNameLower.includes(deviceModel.toLowerCase());
          
          // Only prepend device name if the part name doesn't contain the model
          if (!modelInPartName) {
            displayName = `${deviceFullName} ${part.name}`;
          }
        }
          
        // In your parts API, make sure this section is correct:
searchResults.push({
  id: `part-${part.id}`,
  name: displayName,
  title: displayName,
  description: part.description || `${part.name} for ${foundDevice ? `${foundDevice.brand} ${foundDevice.model}` : 'compatible devices'}`,
  price: part.cost,
  category: 'Replacement Part',
  deviceType: part.deviceType || 'GENERAL',
  deviceBrand: foundDevice?.brand || 'Universal',
  deviceModel: foundDevice?.model || 'Compatible',
  partName: part.name,
  inStock: part.inStock,
  matchScore: matchScore,
  url: `/parts/${part.id}`, // Use /parts instead of /accessories for parts
  type: 'part', // Make sure this is 'part', not 'accessory'
  imageUrl: part.imageUrl || '/images/default-part.png',
});
      }
    });

    // Remove duplicates and sort by match score (highest first), then limit results
    const uniqueResults = searchResults.filter((result: any, index: number, self: any[]) => 
      index === self.findIndex((r: any) => r.name === result.name)
    );
    
    // Sort by match score (highest first), then by name
    const sortedResults = uniqueResults.sort((a: any, b: any) => {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher score first
      }
      return a.name.localeCompare(b.name); // Alphabetical if same score
    });
    
    const limitedResults = sortedResults.slice(0, 10);
    
    return NextResponse.json(limitedResults);
  } catch (error) {
    console.error('Parts search error:', error);
    return NextResponse.json([]);
  }
}
