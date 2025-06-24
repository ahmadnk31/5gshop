const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugDeviceFiltering() {
  try {
    console.log('=== DEBUGGING DEVICE FILTERING ===')
    
    // 1. Check all Apple devices
    console.log('\n1. All Apple devices in database:')
    const allAppleDevices = await prisma.device.findMany({
      where: { brand: 'Apple' },
      select: { type: true, brand: true, model: true }
    })
    allAppleDevices.forEach(device => {
      console.log(`  ${device.type}: ${device.brand} ${device.model}`)
    })
    
    // 2. Check Apple smartphones only
    console.log('\n2. Apple smartphones only:')
    const appleSmartphones = await prisma.device.findMany({
      where: { 
        type: 'SMARTPHONE',
        brand: 'Apple' 
      },
      select: { type: true, brand: true, model: true },
      distinct: ['model']
    })
    appleSmartphones.forEach(device => {
      console.log(`  ${device.type}: ${device.brand} ${device.model}`)
    })
    
    // 3. Check Apple smartwatches only
    console.log('\n3. Apple smartwatches only:')
    const appleWatches = await prisma.device.findMany({
      where: { 
        type: 'SMARTWATCH',
        brand: 'Apple' 
      },
      select: { type: true, brand: true, model: true },
      distinct: ['model']
    })
    appleWatches.forEach(device => {
      console.log(`  ${device.type}: ${device.brand} ${device.model}`)
    })
    
    // 4. Simulate what getModelsByBrand would return
    console.log('\n4. Models returned by getModelsByBrand(SMARTPHONE, Apple):')
    const smartphoneModels = await prisma.device.findMany({
      where: {
        type: 'SMARTPHONE',
        brand: 'Apple',
      },
      select: {
        model: true,
      },
      distinct: ['model'],
    })
    smartphoneModels.forEach(model => {
      console.log(`  - ${model.model}`)
    })
    
  } catch (error) {
    console.error('Error debugging:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugDeviceFiltering()
