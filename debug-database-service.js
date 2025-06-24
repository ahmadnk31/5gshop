// Test the database service directly without going through the server action
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Recreate the DatabaseService.getAccessoriesWithFiltersPaginated logic
async function testDatabaseService() {
  console.log('Testing DatabaseService.getAccessoriesWithFiltersPaginated logic...');
  
  try {
    const params = {
      page: 1,
      limit: 12,
      sortBy: 'name',
      sortOrder: 'asc',
      inStockOnly: true
    };
    
    const { page, limit, sortBy, sortOrder, inStockOnly } = params;
    const skip = (page - 1) * limit;

    console.log('Parameters:', { page, limit, sortBy, sortOrder, inStockOnly });

    const where = {};
    if (inStockOnly) {
      where.inStock = { gt: 0 };
    }

    console.log('Where clause:', where);

    const [accessories, totalCount] = await Promise.all([
      prisma.accessory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.accessory.count({ where }),
    ]);

    console.log(`✅ Query successful: ${accessories.length} accessories found, total: ${totalCount}`);

    const totalPages = Math.ceil(totalCount / limit);

    const result = {
      data: accessories.map(accessory => ({
        id: accessory.id,
        name: accessory.name,
        category: accessory.category,
        brand: accessory.brand,
        model: accessory.model,
        price: accessory.price,
        inStock: accessory.inStock,
        minStock: accessory.minStock,
        description: accessory.description,
        imageUrl: accessory.imageUrl,
        compatibility: accessory.compatibility,
        createdAt: accessory.createdAt.toISOString(),
        updatedAt: accessory.updatedAt.toISOString(),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    console.log('✅ Result formatted successfully');
    console.log('Sample accessory:', result.data[0] ? {
      name: result.data[0].name,
      category: result.data[0].category,
      inStock: result.data[0].inStock
    } : 'No accessories found');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error in database service test:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseService();
