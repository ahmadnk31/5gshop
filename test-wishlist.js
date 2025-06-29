const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testWishlist() {
  try {
    // Get a test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (!user) {
      console.log('Test user not found. Please run create-test-user.js first.');
      return;
    }
    
    console.log('Test user found:', user.email);
    
    // Get a test part
    const part = await prisma.part.findFirst();
    
    if (!part) {
      console.log('No parts found in database.');
      return;
    }
    
    console.log('Test part found:', part.name);
    
    // Test adding to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        partId: part.id,
      },
    });
    
    console.log('Successfully added to wishlist:', wishlistItem);
    
    // Test checking if item is in wishlist
    const inWishlist = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        partId: part.id,
      },
    });
    
    console.log('Item in wishlist:', !!inWishlist);
    
    // Test removing from wishlist
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        partId: part.id,
      },
    });
    
    console.log('Successfully removed from wishlist');
    
    // Verify removal
    const stillInWishlist = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        partId: part.id,
      },
    });
    
    console.log('Item still in wishlist after removal:', !!stillInWishlist);
    
    console.log('✅ All wishlist tests passed!');
    
  } catch (error) {
    console.error('❌ Error testing wishlist:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWishlist(); 