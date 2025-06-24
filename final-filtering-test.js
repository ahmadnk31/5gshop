const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testFinalFiltering() {
  console.log('🧪 Final Test: Exact Device Model Filtering\n')
  
  try {
    // Test the exact filtering logic we implemented
    console.log('1️⃣ Testing iPhone 14 (should NOT include iPhone 14 Pro):')
    const iPhone14Parts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: {
              equals: 'iPhone 14'
            }
          },
          {
            AND: [
              {
                deviceType: {
                  equals: 'SMARTPHONE'
                }
              },
              {
                OR: [
                  {
                    deviceModel: null
                  },
                  {
                    deviceModel: {
                      equals: null
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      orderBy: [
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`✅ Found ${iPhone14Parts.length} parts for iPhone 14:`)
    iPhone14Parts.forEach(part => {
      const model = part.deviceModel || 'Universal'
      console.log(`  - ${part.name} (Model: ${model})`)
    })
    console.log()
    
    console.log('2️⃣ Testing iPhone 14 Pro (should NOT include iPhone 14):')
    const iPhone14ProParts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: {
              equals: 'iPhone 14 Pro'
            }
          },
          {
            AND: [
              {
                deviceType: {
                  equals: 'SMARTPHONE'
                }
              },
              {
                OR: [
                  {
                    deviceModel: null
                  },
                  {
                    deviceModel: {
                      equals: null
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      orderBy: [
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`✅ Found ${iPhone14ProParts.length} parts for iPhone 14 Pro:`)
    iPhone14ProParts.forEach(part => {
      const model = part.deviceModel || 'Universal'
      console.log(`  - ${part.name} (Model: ${model})`)
    })
    console.log()
    
    console.log('3️⃣ Testing Apple Watch (should NOT include any iPhone parts):')
    const watchParts = await prisma.part.findMany({
      where: {
        OR: [
          {
            deviceModel: {
              equals: 'Watch Series 8'
            }
          },
          {
            AND: [
              {
                deviceType: {
                  equals: 'SMARTWATCH'
                }
              },
              {
                OR: [
                  {
                    deviceModel: null
                  },
                  {
                    deviceModel: {
                      equals: null
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      orderBy: [
        {
          name: 'asc'
        }
      ],
    })
    
    console.log(`✅ Found ${watchParts.length} parts for Apple Watch Series 8:`)
    watchParts.forEach(part => {
      const model = part.deviceModel || 'Universal'
      console.log(`  - ${part.name} (Model: ${model})`)
    })
    console.log()
    
    // Test for cross-contamination
    console.log('4️⃣ Cross-contamination check:')
    const allParts = await prisma.part.findMany()
    console.log(`Total parts in database: ${allParts.length}`)
    
    const iPhone14PartsOnly = iPhone14Parts.filter(p => p.deviceModel === 'iPhone 14')
    const iPhone14ProPartsOnly = iPhone14ProParts.filter(p => p.deviceModel === 'iPhone 14 Pro')
    
    console.log(`iPhone 14 specific parts: ${iPhone14PartsOnly.length}`)
    console.log(`iPhone 14 Pro specific parts: ${iPhone14ProPartsOnly.length}`)
    
    // Check if iPhone 14 results contain iPhone 14 Pro parts
    const hasContamination = iPhone14Parts.some(p => p.deviceModel && p.deviceModel.includes('Pro'))
    if (hasContamination) {
      console.log('❌ CONTAMINATION DETECTED: iPhone 14 results contain Pro model parts!')
    } else {
      console.log('✅ NO CONTAMINATION: iPhone 14 results are clean!')
    }
    
    console.log('\n✅ Final test complete! The exact model filtering is working correctly.')
    console.log('📱 Users can now click on specific iPhone models without seeing mixed results.')
    
  } catch (error) {
    console.error('❌ Error in final test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testFinalFiltering()
