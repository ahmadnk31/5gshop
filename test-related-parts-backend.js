const { DatabaseService } = require('./lib/database.ts');

async function testRelatedPartsBackend() {
  console.log('🧪 Testing Related Parts Backend Functionality\n');

  try {
    // Test 1: Get all parts to find a test part
    console.log('1️⃣ Getting all parts to find a test part...');
    const allParts = await DatabaseService.getAllPartsSimple();
    console.log(`   Found ${allParts.length} total parts`);

    if (allParts.length === 0) {
      console.log('❌ No parts found in database. Please add some parts first.');
      return;
    }

    // Use the first part as our test subject
    const testPart = allParts[0];
    console.log(`   Using test part: ${testPart.name} (ID: ${testPart.id})`);
    console.log(`   Device Model: ${testPart.deviceModel || 'None'}`);
    console.log(`   Device Type: ${testPart.deviceType || 'None'}`);
    console.log(`   Quality: ${testPart.quality || 'None'}`);
    console.log(`   Supplier: ${testPart.supplier || 'None'}`);
    console.log(`   Price: €${testPart.cost}\n`);

    // Test 2: Get related parts
    console.log('2️⃣ Testing getRelatedParts...');
    const relatedParts = await DatabaseService.getRelatedParts(testPart.id, 4);
    console.log(`   Found ${relatedParts.length} related parts`);
    
    relatedParts.forEach((part, index) => {
      console.log(`   ${index + 1}. ${part.name}`);
      console.log(`      - Model: ${part.deviceModel || 'None'}`);
      console.log(`      - Type: ${part.deviceType || 'None'}`);
      console.log(`      - Quality: ${part.quality || 'None'}`);
      console.log(`      - Price: €${part.cost}`);
      console.log(`      - Stock: ${part.inStock}`);
    });

    // Test 3: Get featured parts
    console.log('\n3️⃣ Testing getFeaturedParts...');
    const featuredParts = await DatabaseService.getFeaturedParts(4);
    console.log(`   Found ${featuredParts.length} featured parts`);
    
    featuredParts.forEach((part, index) => {
      console.log(`   ${index + 1}. ${part.name}`);
      console.log(`      - Stock: ${part.inStock}`);
      console.log(`      - Price: €${part.cost}`);
      console.log(`      - Has Image: ${part.imageUrl ? 'Yes' : 'No'}`);
    });

    // Test 4: Test API endpoints (if running in browser environment)
    console.log('\n4️⃣ Testing API endpoints...');
    console.log('   To test API endpoints, visit:');
    console.log(`   - Related parts: http://localhost:3000/api/parts/${testPart.id}/related`);
    console.log(`   - Featured parts: http://localhost:3000/api/parts/featured`);
    console.log(`   - Single part: http://localhost:3000/api/parts/${testPart.id}`);

    console.log('\n✅ All backend tests completed successfully!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testRelatedPartsBackend();
}

module.exports = { testRelatedPartsBackend }; 