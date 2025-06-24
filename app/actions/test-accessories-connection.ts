"use server";

import { prisma } from "@/lib/database";

export async function testAccessoriesConnection() {
  try {
    console.log('Testing direct Prisma connection...');
    
    const count = await prisma.accessory.count();
    console.log('Total accessories in database:', count);
    
    const accessories = await prisma.accessory.findMany({
      take: 5,
      where: {
        inStock: {
          gt: 0
        }
      }
    });
    
    console.log('Sample accessories:', accessories.map(a => ({ id: a.id, name: a.name, inStock: a.inStock })));
    
    return {
      success: true,
      totalCount: count,
      sampleAccessories: accessories
    };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
