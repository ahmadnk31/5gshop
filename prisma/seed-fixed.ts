import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.repairNote.deleteMany()
  await prisma.repairPart.deleteMany()
  await prisma.repair.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.device.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.part.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@repairshop.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@repairshop.com',
        name: 'John Manager',
        role: 'MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'tech1@repairshop.com',
        name: 'Mike Rodriguez',
        role: 'TECHNICIAN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'tech2@repairshop.com',
        name: 'Sarah Johnson',
        role: 'TECHNICIAN',
      },
    }),
  ])

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, Anytown, ST 12345',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.johnson@example.com',
        phone: '(555) 234-5678',
        address: '456 Oak Ave, Somewhere, ST 67890',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        phone: '(555) 345-6789',
        address: '789 Pine Rd, Elsewhere, ST 13579',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'sarah.davis@example.com',
        phone: '(555) 456-7890',
        address: '321 Elm St, Nowhere, ST 24680',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@example.com',
        phone: '(555) 567-8901',
        address: '654 Maple Dr, Anywhere, ST 97531',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Garcia',
        email: 'lisa.garcia@example.com',
        phone: '(555) 678-9012',
        address: '987 Cedar Ln, Somewhere Else, ST 86420',
      },
    }),
  ])

  // Create devices
  const devices = await Promise.all([
    // iPhones - Latest Models
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        serialNumber: 'ABC123456788',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        serialNumber: 'ABC123456789',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15 Plus',
        serialNumber: 'ABC123456790',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15',
        serialNumber: 'ABC123456791',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    // Samsung Phones
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S23',
        serialNumber: 'DEF987654321',
        purchaseDate: new Date('2023-03-20'),
      },
    }),
    // Laptops
    prisma.device.create({
      data: {
        type: 'LAPTOP',
        brand: 'Dell',
        model: 'XPS 13',
        serialNumber: 'GHI456789123',
        purchaseDate: new Date('2022-08-10'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'LAPTOP',
        brand: 'Apple',
        model: 'MacBook Pro 13"',
        serialNumber: 'GHI456789125',
        purchaseDate: new Date('2023-02-10'),
      },
    }),
    // Tablets
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad Pro 12.9"',
        serialNumber: 'JKL789123456',
        purchaseDate: new Date('2023-05-02'),
      },
    }),
    // Smartwatches
    prisma.device.create({
      data: {
        type: 'SMARTWATCH',
        brand: 'Apple',
        model: 'Watch Series 8',
        serialNumber: 'MNO123456789',
        purchaseDate: new Date('2023-07-14'),
      },
    }),
    // Gaming Console
    prisma.device.create({
      data: {
        type: 'GAMING_CONSOLE',
        brand: 'Sony',
        model: 'PlayStation 5',
        serialNumber: 'PQR456789123',
        purchaseDate: new Date('2022-11-15'),
      },
    }),
  ])

  // Create parts
  const parts = await Promise.all([
    // iPhone Parts
    prisma.part.create({
      data: {
        name: 'iPhone 15 Pro Max Screen',
        sku: 'IPH15PROMAX-SCR',
        cost: 129.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 3,
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 15 Pro Max Battery',
        sku: 'IPH15PROMAX-BAT',
        cost: 34.99,
        supplier: 'iFixit',
        inStock: 15,
        minStock: 5,
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Screen',
        sku: 'SAM-S23-SCR',
        cost: 79.99,
        supplier: 'Mobile Defender',
        inStock: 8,
        minStock: 5,
      },
    }),
    prisma.part.create({
      data: {
        name: 'Dell XPS 13 Keyboard',
        sku: 'DELL-XPS13-KB',
        cost: 45.99,
        supplier: 'Dell Parts',
        inStock: 12,
        minStock: 3,
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Pro 12.9" Digitizer',
        sku: 'IPAD-PRO12-DIG',
        cost: 149.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 2,
      },
    }),
    prisma.part.create({
      data: {
        name: 'Apple Watch Series 8 Battery',
        sku: 'AW-S8-BAT',
        cost: 19.99,
        supplier: 'WatchKit',
        inStock: 20,
        minStock: 8,
      },
    }),
    prisma.part.create({
      data: {
        name: 'PS5 HDMI Port',
        sku: 'PS5-HDMI-PORT',
        cost: 25.99,
        supplier: 'Console Parts',
        inStock: 10,
        minStock: 3,
      },
    }),
  ])

  // Create repairs
  const repairs = await Promise.all([
    prisma.repair.create({
      data: {
        customerId: customers[0].id,
        deviceId: devices[0].id,
        issue: 'Cracked Screen',
        description: 'Phone dropped and screen cracked. Touch functionality still works.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        cost: 129.99,
        estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        assignedTechnician: 'Mike Rodriguez',
      },
    }),
    prisma.repair.create({
      data: {
        customerId: customers[1].id,
        deviceId: devices[1].id,
        issue: 'Battery Issues',
        description: 'Battery drains quickly and phone randomly shuts down.',
        status: 'WAITING_PARTS',
        priority: 'HIGH',
        cost: 89.99,
        estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        assignedTechnician: 'Sarah Johnson',
      },
    }),
    prisma.repair.create({
      data: {
        customerId: customers[2].id,
        deviceId: devices[2].id,
        issue: 'Keyboard Not Working',
        description: 'Several keys stopped working after liquid spill.',
        status: 'DIAGNOSED',
        priority: 'MEDIUM',
        cost: 75.99,
        estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        assignedTechnician: 'Mike Rodriguez',
      },
    }),
    prisma.repair.create({
      data: {
        customerId: customers[3].id,
        deviceId: devices[3].id,
        issue: 'Touch Screen Unresponsive',
        description: 'iPad screen not responding to touch after being dropped.',
        status: 'PENDING',
        priority: 'LOW',
        cost: 199.99,
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.repair.create({
      data: {
        customerId: customers[4].id,
        deviceId: devices[4].id,
        issue: 'Won\'t Charge',
        description: 'Apple Watch won\'t hold charge and dies within hours.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        cost: 49.99,
        estimatedCompletion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedTechnician: 'Sarah Johnson',
      },
    }),
    prisma.repair.create({
      data: {
        customerId: customers[5].id,
        deviceId: devices[5].id,
        issue: 'HDMI Port Not Working',
        description: 'Console won\'t output video to TV via HDMI.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        cost: 45.99,
        estimatedCompletion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        assignedTechnician: 'Mike Rodriguez',
      },
    }),
  ])

  // Create repair parts
  const repairParts = await Promise.all([
    prisma.repairPart.create({
      data: {
        repairId: repairs[0].id,
        partId: parts[0].id, // iPhone 15 Pro Max Screen
        quantity: 1,
      },
    }),
    prisma.repairPart.create({
      data: {
        repairId: repairs[1].id,
        partId: parts[1].id, // iPhone 15 Pro Max Battery
        quantity: 1,
      },
    }),
    prisma.repairPart.create({
      data: {
        repairId: repairs[2].id,
        partId: parts[3].id, // Dell XPS 13 Keyboard
        quantity: 1,
      },
    }),
    prisma.repairPart.create({
      data: {
        repairId: repairs[3].id,
        partId: parts[4].id, // iPad Pro 12.9" Digitizer
        quantity: 1,
      },
    }),
    prisma.repairPart.create({
      data: {
        repairId: repairs[4].id,
        partId: parts[5].id, // Apple Watch Series 8 Battery
        quantity: 1,
      },
    }),
    prisma.repairPart.create({
      data: {
        repairId: repairs[5].id,
        partId: parts[6].id, // PS5 HDMI Port
        quantity: 1,
      },
    }),
  ])

  // Create repair notes
  const repairNotes = await Promise.all([
    prisma.repairNote.create({
      data: {
        repairId: repairs[0].id,
        note: 'Device received. Confirmed cracked screen but touch functionality intact.',
      },
    }),
    prisma.repairNote.create({
      data: {
        repairId: repairs[0].id,
        note: 'Ordered replacement screen. ETA 2 days.',
      },
    }),
    prisma.repairNote.create({
      data: {
        repairId: repairs[1].id,
        note: 'Battery test confirms degraded capacity. Replacement needed.',
      },
    }),
    prisma.repairNote.create({
      data: {
        repairId: repairs[2].id,
        note: 'Liquid damage detected. Keyboard replacement required.',
      },
    }),
    prisma.repairNote.create({
      data: {
        repairId: repairs[4].id,
        note: 'Battery replacement completed successfully. Device tested and working.',
      },
    }),
    prisma.repairNote.create({
      data: {
        repairId: repairs[5].id,
        note: 'HDMI port damaged. Replacement in progress.',
      },
    }),
  ])

  // Create quotes
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        customerId: customers[0].id,
        deviceId: devices[0].id,
        issues: JSON.stringify(['Water Damage', 'Speaker Issues']),
        description: 'iPhone was dropped in water. Speakers not working properly.',
        estimatedCost: 149.99,
        estimatedTime: '3-5 business days',
        status: 'SENT',
        urgency: 'HIGH',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.quote.create({
      data: {
        customerId: customers[1].id,
        deviceId: devices[1].id,
        issues: JSON.stringify(['Camera Issues']),
        description: 'Rear camera produces blurry images.',
        estimatedCost: 79.99,
        estimatedTime: '2-3 business days',
        status: 'PENDING',
        urgency: 'LOW',
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
    }),
    prisma.quote.create({
      data: {
        customerId: customers[2].id,
        deviceId: devices[2].id,
        issues: JSON.stringify(['Performance Issues', 'Overheating']),
        description: 'Laptop runs very slowly and gets extremely hot.',
        estimatedCost: 125.99,
        estimatedTime: '4-6 business days',
        status: 'APPROVED',
        urgency: 'MEDIUM',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`  - ${users.length} users`)
  console.log(`  - ${customers.length} customers`)
  console.log(`  - ${devices.length} devices`)
  console.log(`  - ${parts.length} parts`)
  console.log(`  - ${repairs.length} repairs`)
  console.log(`  - ${repairParts.length} repair parts`)
  console.log(`  - ${repairNotes.length} repair notes`)
  console.log(`  - ${quotes.length} quotes`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
