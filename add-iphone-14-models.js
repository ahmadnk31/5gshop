const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addIPhone14Models() {
  try {
    // Add iPhone 14 models to the database
    const iphone14Models = [
      {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14',
        serialNumber: 'IP14_001',
        purchaseDate: new Date('2023-01-15'),
        imageUrl: 'https://example.com/iphone14.jpg'
      },
      {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Plus',
        serialNumber: 'IP14P_001',
        purchaseDate: new Date('2023-01-15'),
        imageUrl: 'https://example.com/iphone14plus.jpg'
      },
      {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        serialNumber: 'IP14PR_001',
        purchaseDate: new Date('2023-01-15'),
        imageUrl: 'https://example.com/iphone14pro.jpg'
      },
      {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        serialNumber: 'IP14PM_001',
        purchaseDate: new Date('2023-01-15'),
        imageUrl: 'https://example.com/iphone14promax.jpg'
      },
      // Add some Apple Watch models as well to test cross-filtering
      {
        type: 'SMARTWATCH',
        brand: 'Apple',
        model: 'Watch Series 9',
        serialNumber: 'AW9_001',
        purchaseDate: new Date('2023-09-15'),
        imageUrl: 'https://example.com/watchseries9.jpg'
      },
      {
        type: 'SMARTWATCH',
        brand: 'Apple',
        model: 'Watch Ultra 2',
        serialNumber: 'AWU2_001',
        purchaseDate: new Date('2023-09-15'),
        imageUrl: 'https://example.com/watchultra2.jpg'
      }
    ]

    for (const device of iphone14Models) {
      await prisma.device.create({
        data: device
      })
      console.log(`Added: ${device.brand} ${device.model}`)
    }

    console.log('✅ iPhone 14 models and Apple Watch models added successfully!')
  } catch (error) {
    console.error('Error adding iPhone 14 models:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addIPhone14Models()
