const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addProperIPhoneParts() {
  try {
    console.log('Adding properly named iPhone parts...')
    
    // Add iPhone 15 Pro specific parts
    const iphone15ProParts = [
      {
        name: 'iPhone 15 Pro Screen',
        sku: 'IPH15PRO-SCR',
        cost: 199.99,
        inStock: 10,
        minStock: 3,
        supplier: 'Apple Parts Co',
        deviceModel: 'iPhone 15 Pro'
      },
      {
        name: 'iPhone 15 Pro Battery',
        sku: 'IPH15PRO-BAT',
        cost: 79.99,
        inStock: 15,
        minStock: 5,
        supplier: 'Apple Parts Co',
        deviceModel: 'iPhone 15 Pro'
      },
      {
        name: 'iPhone 15 Pro Camera Module',
        sku: 'IPH15PRO-CAM',
        cost: 149.99,
        inStock: 8,
        minStock: 2,
        supplier: 'Apple Parts Co',
        deviceModel: 'iPhone 15 Pro'
      },
      // Add iPhone 14 specific parts
      {
        name: 'iPhone 14 Screen',
        sku: 'IPH14-SCR',
        cost: 179.99,
        inStock: 12,
        minStock: 3,
        supplier: 'Apple Parts Co',
        deviceModel: 'iPhone 14'
      },
      {
        name: 'iPhone 14 Battery',
        sku: 'IPH14-BAT',
        cost: 69.99,
        inStock: 20,
        minStock: 5,
        supplier: 'Apple Parts Co',
        deviceModel: 'iPhone 14'
      },
      // Add some generic iPhone parts
      {
        name: 'iPhone Charging Port (USB-C)',
        sku: 'IPH-CHGPORT-USBC',
        cost: 49.99,
        inStock: 25,
        minStock: 8,
        supplier: 'Generic Parts Co',
        deviceModel: 'iPhone 15 series'
      },
      {
        name: 'iPhone Speaker Assembly',
        sku: 'IPH-SPEAKER-GEN',
        cost: 29.99,
        inStock: 30,
        minStock: 10,
        supplier: 'Generic Parts Co',
        deviceModel: 'iPhone (all models)'
      }
    ]

    for (const part of iphone15ProParts) {
      await prisma.part.create({
        data: part
      })
      console.log(`✅ Added: ${part.name}`)
    }

    console.log('\n✅ All iPhone parts added successfully!')
  } catch (error) {
    console.error('Error adding parts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addProperIPhoneParts()
