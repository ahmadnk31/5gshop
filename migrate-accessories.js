const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateAccessories() {
  try {
    console.log('🔄 Starting accessory migration...');
    
    // Find parts that should be accessories (based on name patterns)
    const parts = await prisma.part.findMany();
    const accessoriesToMigrate = parts.filter(part => {
      const name = part.name.toLowerCase();
      const sku = part.sku.toLowerCase();
      
      // Identify parts that are actually accessories
      return (
        name.includes('cable') ||
        name.includes('case') ||
        name.includes('charger') ||
        name.includes('mount') ||
        name.includes('stand') ||
        name.includes('protector') ||
        name.includes('headphone') ||
        name.includes('earphone') ||
        sku.includes('cable') ||
        sku.includes('case') ||
        sku.includes('generic')
      );
    });
    
    console.log(`Found ${accessoriesToMigrate.length} items to migrate:`);
    accessoriesToMigrate.forEach(item => {
      console.log(`- ${item.name} (${item.sku})`);
    });
    
    if (accessoriesToMigrate.length === 0) {
      console.log('✅ No accessories found in parts table. Migration not needed.');
      return;
    }
    
    // Migrate each item
    for (const part of accessoriesToMigrate) {
      console.log(`\n🔄 Migrating: ${part.name}`);
      
      // Determine accessory category based on name
      let category = 'OTHER';
      const name = part.name.toLowerCase();
      
      if (name.includes('cable')) category = 'CABLE';
      else if (name.includes('case')) category = 'CASE';
      else if (name.includes('charger')) category = 'CHARGER';
      else if (name.includes('mount')) category = 'MOUNT';
      else if (name.includes('stand')) category = 'STAND';
      else if (name.includes('protector')) category = 'SCREEN_PROTECTOR';
      else if (name.includes('headphone') || name.includes('earphone')) category = 'HEADPHONES';
      
      // Determine compatibility based on name/description
      let compatibility = 'Universal';
      if (name.includes('iphone')) compatibility = 'iPhone';
      else if (name.includes('ipad')) compatibility = 'iPad';
      else if (name.includes('samsung')) compatibility = 'Samsung';
      else if (name.includes('android')) compatibility = 'Android';
      
      // Create accessory record
      const accessory = await prisma.accessory.create({
        data: {
          name: part.name,
          category: category,
          brand: part.supplier || 'Generic', // Use supplier as brand
          model: '', // Empty model for generic accessories
          price: part.cost * 1.5, // Add markup for retail price
          inStock: part.inStock,
          minStock: part.minStock,
          description: part.description || `${part.name} - Migrated from parts inventory`,
          imageUrl: part.imageUrl,
          compatibility: compatibility
        }
      });
      
      console.log(`✅ Created accessory: ${accessory.name} (Category: ${category})`);
      
      // Delete from parts table
      await prisma.part.delete({
        where: { id: part.id }
      });
      
      console.log(`✅ Removed from parts table: ${part.name}`);
    }
    
    console.log(`\n🎉 Migration complete! Migrated ${accessoriesToMigrate.length} items from parts to accessories.`);
    
    // Show final counts
    const finalPartsCount = await prisma.part.count();
    const finalAccessoriesCount = await prisma.accessory.count();
    
    console.log(`\n📊 Final counts:`);
    console.log(`- Parts: ${finalPartsCount}`);
    console.log(`- Accessories: ${finalAccessoriesCount}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAccessories();
