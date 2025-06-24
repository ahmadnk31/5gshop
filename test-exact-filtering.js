const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testExactFiltering() {
  console.log('🧪 Testing exact device model filtering...\n')
  
  try {
    // Test 1: iPhone 14 (should only show iPhone 14 parts, not iPhone 14 Pro/Pro Max)
    console.log('1️⃣ Testing iPhone 14 filtering:')
    const iPhone14Parts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: 'iPhone 14'
          },
          {
            AND: [
              {
                deviceType: 'SMARTPHONE'
              },
              {
                deviceModel: null // Universal parts for this device type
              }
            ]
          }
        ]
      },
      orderBy: [
        {
          deviceModel: 'asc'
        },
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`Found ${iPhone14Parts.length} parts for iPhone 14:`)
    iPhone14Parts.forEach(part => {
      console.log(`  - ${part.name} (Model: ${part.deviceModel || 'Universal'})`)
    })
    console.log()
    
    // Test 2: iPhone 14 Pro (should only show iPhone 14 Pro parts)
    console.log('2️⃣ Testing iPhone 14 Pro filtering:')
    const iPhone14ProParts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: 'iPhone 14 Pro'
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
      orderBy: [
        {
          deviceModel: 'asc'
        },
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`Found ${iPhone14ProParts.length} parts for iPhone 14 Pro:`)
    iPhone14ProParts.forEach(part => {
      console.log(`  - ${part.name} (Model: ${part.deviceModel || 'Universal'})`)
    })
    console.log()
    
    // Test 3: iPhone 15 Pro (should only show iPhone 15 Pro parts)
    console.log('3️⃣ Testing iPhone 15 Pro filtering:')
    const iPhone15ProParts = await prisma.part.findMany({
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
      orderBy: [
        {
          deviceModel: 'asc'
        },
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`Found ${iPhone15ProParts.length} parts for iPhone 15 Pro:`)
    iPhone15ProParts.forEach(part => {
      console.log(`  - ${part.name} (Model: ${part.deviceModel || 'Universal'})`)
    })
    console.log()
    
    // Test 4: Apple Watch (should only show Watch parts, no iPhone contamination)
    console.log('4️⃣ Testing Apple Watch Series 8 filtering:')
    const watchParts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: 'Watch Series 8'
          },
          {
            AND: [
              {
                deviceType: 'SMARTWATCH'
              },
              {
                deviceModel: null
              }
            ]
          }
        ]
      },
      orderBy: [
        {
          deviceModel: 'asc'
        },
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`Found ${watchParts.length} parts for Apple Watch Series 8:`)
    watchParts.forEach(part => {
      console.log(`  - ${part.name} (Model: ${part.deviceModel || 'Universal'})`)
    })
    console.log()
    
    // Test 5: Show all devices for reference
    console.log('5️⃣ All available devices:')
    const devices = await prisma.device.findMany({
      where: {
        type: 'SMARTPHONE'
      },
      orderBy: [
        {
          model: 'asc'
        }
      ]
    })
    
    devices.forEach(device => {
      console.log(`  - ${device.brand} ${device.model}`)
    })
    
    console.log('\n✅ Exact filtering test complete!')
    
  } catch (error) {
    console.error('❌ Error testing filtering:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testExactFiltering()
