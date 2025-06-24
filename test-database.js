// Test script to verify database functionality with accessories
import { DatabaseService } from './lib/database.js';

async function testDatabaseService() {
  try {
    console.log('🧪 Testing Database Service with Accessories...\n');

    // Test 1: Get all accessories
    console.log('1. Testing getAccessories()...');
    const accessories = await DatabaseService.getAccessories();
    console.log(`✅ Retrieved ${accessories.length} accessories\n`);

    // Test 2: Get customers
    console.log('2. Testing getCustomers()...');
    const customers = await DatabaseService.getCustomers();
    console.log(`✅ Retrieved ${customers.length} customers\n`);

    // Test 3: Get devices
    console.log('3. Testing getDevices()...');
    const devices = await DatabaseService.getDevices();
    console.log(`✅ Retrieved ${devices.length} devices\n`);

    // Test 4: Get parts
    console.log('4. Testing getParts()...');
    const parts = await DatabaseService.getParts();
    console.log(`✅ Retrieved ${parts.length} parts\n`);

    // Test 5: Get analytics
    console.log('5. Testing getAnalytics()...');
    const analytics = await DatabaseService.getAnalytics();
    console.log(`✅ Analytics retrieved:`, analytics);
    console.log(`   - Total Repairs: ${analytics.totalRepairs}`);
    console.log(`   - Pending Repairs: ${analytics.pendingRepairs}`);
    console.log(`   - Completed Repairs: ${analytics.completedRepairs}`);
    console.log(`   - Low Stock Parts: ${analytics.lowStockParts}\n`);

    // Test 6: Get low stock accessories
    console.log('6. Testing getLowStockAccessories()...');
    const lowStockAccessories = await DatabaseService.getLowStockAccessories();
    console.log(`✅ Retrieved ${lowStockAccessories.length} low stock accessories\n`);

    console.log('🎉 All database tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Run the test
testDatabaseService();
