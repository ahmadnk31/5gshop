'use server'

import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/database'
import { DeviceType } from '@/lib/types'

export async function getDeviceTypes() {
  try {
    // Cache for 10 minutes to improve TTFB
    const getCachedDeviceTypes = unstable_cache(
      async () => {
        const deviceTypes = await prisma.device.findMany({
          select: {
            type: true,
          },
          distinct: ['type'],
        })
        return deviceTypes.map(d => d.type)
      },
      ['device-types-all'],
      { revalidate: 600, tags: ['device-types'] }
    );
    return await getCachedDeviceTypes();
  } catch (error) {
    console.error('Error fetching device types:', error)
    throw new Error('Failed to fetch device types')
  }
}

export async function getBrandsByType(deviceType: DeviceType) {
  try {
    const brands = await prisma.device.findMany({
      where: {
        type: deviceType,
      },
      select: {
        brand: true,
      },
      distinct: ['brand'],
    })
    
    return brands.map(d => d.brand)
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw new Error('Failed to fetch brands')
  }
}

export async function getModelsByBrand(deviceType: DeviceType, brand: string) {
  try {
    const models = await prisma.device.findMany({
      where: {
        type: deviceType,
        brand: brand,
      },
      select: {
        model: true,
      },
      orderBy: [
        { order: 'desc' },
        { model: 'desc' },
        { brand: 'desc' }
      ],
      distinct: ['model'],
    })
    
    return models.map(d => d.model)
  } catch (error) {
    console.error('Error fetching models:', error)
    throw new Error('Failed to fetch models')
  }
}

export async function getPartsByDeviceModel(deviceType: DeviceType, brand: string, model: string) {
  try {
    console.log(`🔍 Fetching parts for: ${deviceType} ${brand} ${model}`)
    
    // Validate inputs
    if (!deviceType || !brand || !model) {
      throw new Error(`Invalid parameters: deviceType=${deviceType}, brand=${brand}, model=${model}`)
    }
    
    // Use the new deviceModel field for exact matching
    const parts = await prisma.part.findMany({
      where: {
        OR: [
          // 1. Exact device model match (highest priority)
          {
            deviceModel: model
          },
          // 2. Compatible device type parts without specific model (universal parts)
          {
            AND: [
              {
                deviceType: deviceType
              },
              {
                deviceModel: null
              }
            ]
          }
        ]
      },
      orderBy: [
        { order: 'desc' },
        { name: 'desc' }
      ],
    })

    console.log(`✅ Found ${parts.length} parts for ${model}`)
    
    // Filter out accessory-like items (keep only repair parts)
    const repairParts = parts.filter(part => {
      const partName = part.name.toLowerCase()
      
      // Exclude accessories and non-repair items
      const accessoryKeywords = [
        'case', 'cover', 'sleeve', 'protector', 'cable', 'charger', 'adapter',
        'stand', 'mount', 'band', 'strap', 'earbuds', 'headphones', 'airpods',
        'stylus', 'pencil', 'keyboard', 'mouse', 'hub', 'cleaning', 'kit'
      ]
      
      // Check if the part name contains any accessory keywords
      const isAccessory = accessoryKeywords.some(keyword => 
        partName.includes(keyword)
      )
      
      // Keep only actual repair parts (screens, batteries, internal components)
      return !isAccessory
    })
    
    console.log(`🔧 Filtered to ${repairParts.length} repair parts (removed accessories)`)
    
    // Do NOT re-sort here; preserve DB order
    return repairParts
  } catch (error) {
    console.error('❌ Error fetching parts:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      deviceType,
      brand,
      model
    })
    throw new Error(`Failed to fetch parts: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getRepairServicesForDevice(deviceType: DeviceType, brand?: string, model?: string) {
  try {
    // Import the function from repair-services-actions
    const { getRepairServicesForDevice } = await import('./repair-services-actions');
    return await getRepairServicesForDevice(deviceType, brand, model);
  } catch (error) {
    console.error('Failed to get repair services for device:', error);
    throw new Error('Failed to get repair services for device');
  }
}

export async function getAllDevicesWithRepairData() {
  try {
    const devices = await prisma.device.findMany({
      include: {
        repairs: {
          select: {
            id: true,
            status: true,
            cost: true,
          },
        },
      },
      orderBy: [
        { type: 'asc' },
        { brand: 'asc' },
        { model: 'asc' },
        { order: 'asc' }
      ],
    })
    
    return devices
  } catch (error) {
    console.error('Error fetching devices with repair data:', error)
    throw new Error('Failed to fetch devices')
  }
}
