const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugPartsFiltering() {
  try {
    console.log('=== DEBUGGING PARTS FILTERING ===')
    
    // 1. Check all parts in the database
    console.log('\n1. All parts in database:')
    const allParts = await prisma.part.findMany({
      select: { name: true, sku: true }
    })
    allParts.forEach(part => {
      console.log(`  - ${part.name} (${part.sku})`)
    })
    
    // 2. Test the current filtering logic (old version)
    console.log('\n2. OLD filtering for "iPhone 15 Pro" (contains "iPhone"):')
    const oldFiltering = await prisma.part.findMany({
      where: {
        OR: [
          {
            name: {
              contains: 'Apple'
            },
          },
          {
            name: {
              contains: 'iPhone' // First word of "iPhone 15 Pro"
            },
          },
        ],
      },
      select: { name: true }
    })
    oldFiltering.forEach(part => {
      console.log(`  - ${part.name}`)
    })
    
    // 3. Test new filtering logic
    console.log('\n3. NEW filtering for "iPhone 15 Pro":')
    console.log('   a) Exact match (Apple iPhone 15 Pro):')
    const exactMatch = await prisma.part.findMany({
      where: {
        name: {
          contains: 'Apple iPhone 15 Pro'
        }
      },
      select: { name: true }
    })
    exactMatch.forEach(part => {
      console.log(`     - ${part.name}`)
    })
    
    console.log('   b) Brand + iPhone specific:')
    const brandSpecific = await prisma.part.findMany({
      where: {
        AND: [
          {
            name: {
              contains: 'Apple'
            }
          },
          {
            name: {
              contains: 'iPhone'
            }
          }
        ]
      },
      select: { name: true }
    })
    brandSpecific.forEach(part => {
      console.log(`     - ${part.name}`)
    })
    
    console.log('   c) After filtering out Watch/Phone cross-contamination:')
    const filteredParts = brandSpecific.filter(part => {
      const partName = part.name.toLowerCase()
      // Exclude smartwatch parts for phones
      if (partName.includes('watch') || partName.includes('band')) {
        return false
      }
      return true
    })
    filteredParts.forEach(part => {
      console.log(`     - ${part.name}`)
    })
    
  } catch (error) {
    console.error('Error debugging:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugPartsFiltering()
