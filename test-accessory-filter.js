const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAccessoryFiltering() {
  try {
    console.log('🧪 Testing accessory filtering for iPhone 15 Pro...')
    
    // Test the filtering logic
    const parts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: 'iPhone 15 Pro'
          },
          {
            AND: [
              {
                deviceType: 'SMARTPHONE'
              },
              {
                deviceModel: null
              }
            ]
          }
        ]
      },
      orderBy: {
        name: 'asc'
      },
    })

    console.log(`📦 All parts found: ${parts.length}`)
    parts.forEach(part => {
      console.log(`  - ${part.name}`)
    })
    
    // Apply accessory filtering
    const accessoryKeywords = [
      'case', 'cover', 'sleeve', 'protector', 'cable', 'charger', 'adapter',
      'stand', 'mount', 'band', 'strap', 'earbuds', 'headphones', 'airpods',
      'stylus', 'pencil', 'keyboard', 'mouse', 'hub', 'cleaning', 'kit'
    ]
    
    const repairParts = parts.filter(part => {
      const partName = part.name.toLowerCase()
      const isAccessory = accessoryKeywords.some(keyword => 
        partName.includes(keyword)
      )
      return !isAccessory
    })
    
    console.log(`\n🔧 Repair parts only: ${repairParts.length}`)
    repairParts.forEach(part => {
      console.log(`  - ${part.name}`)
    })
    
    const filteredOut = parts.filter(part => {
      const partName = part.name.toLowerCase()
      const isAccessory = accessoryKeywords.some(keyword => 
        partName.includes(keyword)
      )
      return isAccessory
    })
    
    console.log(`\n🚫 Accessories filtered out: ${filteredOut.length}`)
    filteredOut.forEach(part => {
      console.log(`  - ${part.name}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAccessoryFiltering()
