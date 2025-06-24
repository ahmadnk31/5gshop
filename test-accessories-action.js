const { DatabaseService } = require('./lib/database.ts');

async function testAccessoriesAction() {
  try {
    console.log('Testing DatabaseService.getAccessoriesWithFiltersPaginated...');
    
    const result = await DatabaseService.getAccessoriesWithFiltersPaginated({
      page: 1,
      limit: 10,
      inStockOnly: true
    });
    
    console.log('SUCCESS: Function returned', result.data.length, 'accessories');
    console.log('Pagination info:', result.pagination);
    
    return result;
  } catch (error) {
    console.error('ERROR in test:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

testAccessoriesAction()
  .then(() => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
