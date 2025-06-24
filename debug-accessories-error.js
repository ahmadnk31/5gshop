const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAccessoriesFunction() {
  console.log('Testing getAccessoriesWithFiltersPaginated function...');
  
  try {
    // Test basic database connection
    console.log('1. Testing database connection...');
    const count = await prisma.accessory.count();
    console.log(`✅ Database connected. Total accessories: ${count}`);
    
    // Test basic accessory query
    console.log('2. Testing basic accessory query...');
    const accessories = await prisma.accessory.findMany({
      take: 5,
      where: { inStock: { gt: 0 } }
    });
    console.log(`✅ Basic query works. Found ${accessories.length} accessories in stock`);
    
    // Test the exact query from the function
    console.log('3. Testing exact query from getAccessoriesWithFiltersPaginated...');
    const where = {
      inStock: { gt: 0 }
    };
    
    const [testAccessories, totalCount] = await Promise.all([
      prisma.accessory.findMany({
        where,
        skip: 0,
        take: 12,
        orderBy: { name: 'asc' },
      }),
      prisma.accessory.count({ where }),
    ]);
    
    console.log(`✅ Filtered query works. Found ${testAccessories.length} accessories, total: ${totalCount}`);
    
    // Test import of the actual function
    console.log('4. Testing actual function import...');
    
    // Try to simulate the server action call
    const { getAccessoriesWithFiltersPaginated } = require('./app/actions/pagination-actions.ts');
    console.log('✅ Function imported successfully');
    
    // Test the function call
    console.log('5. Testing function call...');
    const result = await getAccessoriesWithFiltersPaginated({
      page: 1,
      limit: 12,
      inStockOnly: true
    });
    
    console.log(`✅ Function call successful. Got ${result.data.length} accessories`);
    console.log('Pagination info:', result.pagination);
    
  } catch (error) {
    console.error('❌ Error occurred:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testAccessoriesFunction();
