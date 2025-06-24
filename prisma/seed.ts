import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to create a device and its parts
async function createDeviceWithParts({ brand, model, serialNumber, releaseDate, parts, type = 'TABLET' }: {
  brand: string;
  model: string;
  serialNumber: string;
  releaseDate: Date;
  parts: Array<{ name: string; cost: number; supplier: string; stock: number; minStock?: number }>;
  type?: string;
}) {
  const device = await prisma.device.create({
    data: {
      type,
      brand,
      model,
      serialNumber,
      purchaseDate: releaseDate,
    },
  });
  for (const part of parts) {
    // Generate a globally unique SKU for each part
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeModel = model.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    const safePart = part.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    const sku = `${safeModel}-${safePart}-${randomSuffix}`;
    await prisma.part.create({
      data: {
        name: part.name,
        sku,
        cost: part.cost,
        supplier: part.supplier,
        inStock: part.stock,
        minStock: part.minStock ?? 2, // default minStock if not provided
        deviceModel: model,
        deviceType: type,
      },
    });
  }
}

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
  await prisma.accessory.deleteMany()

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
    // iPhone 14 Series
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        serialNumber: 'ABC123456792',
        purchaseDate: new Date('2022-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        serialNumber: 'ABC123456793',
        purchaseDate: new Date('2022-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Plus',
        serialNumber: 'ABC123456794',
        purchaseDate: new Date('2022-09-16'),
      },
    }),

    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14',
        serialNumber: 'ABC123456795',
        purchaseDate: new Date('2022-09-16'),
      },
    }),
    
    // More Apple iPhones
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 13',
        serialNumber: 'ABC123456798',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 12 Pro',
        serialNumber: 'ABC123456799',
        purchaseDate: new Date('2020-10-23'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 11',
        serialNumber: 'ABC123456800',
        purchaseDate: new Date('2019-09-20'),
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
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S22',
        serialNumber: 'DEF987654322',
        purchaseDate: new Date('2022-02-25'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S21',
        serialNumber: 'DEF987654323',
        purchaseDate: new Date('2021-01-29'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S21 Ultra',
        serialNumber: 'DEF987654324',
        purchaseDate: new Date('2021-01-29'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S20',
        serialNumber: 'DEF987654325',
        purchaseDate: new Date('2020-03-06'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy Note 20',
        serialNumber: 'DEF987654326',
        purchaseDate: new Date('2020-08-21'),
      },
    }),
    // Google Pixel
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Google',
        model: 'Pixel 8 Pro',
        serialNumber: 'GGL123456789',
        purchaseDate: new Date('2023-10-12'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Google',
        model: 'Pixel 7',
        serialNumber: 'GGL123456788',
        purchaseDate: new Date('2022-10-13'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Google',
        model: 'Pixel 6 Pro',
        serialNumber: 'GGL123456787',
        purchaseDate: new Date('2021-10-28'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Google',
        model: 'Pixel 5',
        serialNumber: 'GGL123456786',
        purchaseDate: new Date('2020-10-15'),
      },
    }),
    // OnePlus
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'OnePlus',
        model: 'OnePlus 12',
        serialNumber: 'ONEPLUS123456',
        purchaseDate: new Date('2024-01-23'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'OnePlus',
        model: 'OnePlus 11',
        serialNumber: 'ONEPLUS123457',
        purchaseDate: new Date('2023-02-07'),
      },
    }),
    // Xiaomi
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Xiaomi',
        model: 'Xiaomi 14 Pro',
        serialNumber: 'XIAOMI123456',
        purchaseDate: new Date('2023-10-26'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Xiaomi',
        model: 'Redmi Note 13',
        serialNumber: 'XIAOMI123457',
        purchaseDate: new Date('2024-01-10'),
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
    prisma.device.create({
      data: {
        type: 'LAPTOP',
        brand: 'HP',
        model: 'Spectre x360',
        serialNumber: 'HP123456789',
        purchaseDate: new Date('2023-01-15'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'LAPTOP',
        brand: 'Lenovo',
        model: 'ThinkPad X1 Carbon',
        serialNumber: 'LEN123456789',
        purchaseDate: new Date('2022-06-10'),
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
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Samsung',
        model: 'Galaxy Tab S8',
        serialNumber: 'SAMTAB123456',
        purchaseDate: new Date('2022-03-01'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Microsoft',
        model: 'Surface Pro 9',
        serialNumber: 'MSFT123456789',
        purchaseDate: new Date('2023-04-20'),
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
    prisma.device.create({
      data: {
        type: 'SMARTWATCH',
        brand: 'Samsung',
        model: 'Galaxy Watch 6',
        serialNumber: 'SAMWATCH12345',
        purchaseDate: new Date('2023-08-01'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTWATCH',
        brand: 'Garmin',
        model: 'Fenix 7',
        serialNumber: 'GARMIN123456',
        purchaseDate: new Date('2022-11-11'),
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
    prisma.device.create({
      data: {
        type: 'GAMING_CONSOLE',
        brand: 'Microsoft',
        model: 'Xbox Series X',
        serialNumber: 'XBOX123456789',
        purchaseDate: new Date('2021-11-10'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'GAMING_CONSOLE',
        brand: 'Nintendo',
        model: 'Switch OLED',
        serialNumber: 'NINTENDO12345',
        purchaseDate: new Date('2022-10-08'),
      },
    }),
    // All iPhone series from iPhone 6 to iPhone 16
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 6',
        serialNumber: 'IPHONE6000001',
        purchaseDate: new Date('2014-09-19'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 6 Plus',
        serialNumber: 'IPHONE6000002',
        purchaseDate: new Date('2014-09-19'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 6s',
        serialNumber: 'IPHONE6000003',
        purchaseDate: new Date('2015-09-25'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 6s Plus',
        serialNumber: 'IPHONE6000004',
        purchaseDate: new Date('2015-09-25'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone SE (1st generation)',
        serialNumber: 'IPHONE6000005',
        purchaseDate: new Date('2016-03-31'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 7',
        serialNumber: 'IPHONE7000001',
        purchaseDate: new Date('2016-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 7 Plus',
        serialNumber: 'IPHONE7000002',
        purchaseDate: new Date('2016-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 8',
        serialNumber: 'IPHONE8000001',
        purchaseDate: new Date('2017-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 8 Plus',
        serialNumber: 'IPHONE8000002',
        purchaseDate: new Date('2017-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone X',
        serialNumber: 'IPHONEX000001',
        purchaseDate: new Date('2017-11-03'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone XR',
        serialNumber: 'IPHONEXR00001',
        purchaseDate: new Date('2018-10-26'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone XS',
        serialNumber: 'IPHONEXS00001',
        purchaseDate: new Date('2018-09-21'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone XS Max',
        serialNumber: 'IPHONEXSMAX01',
        purchaseDate: new Date('2018-09-21'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 11',
        serialNumber: 'IPHONE1100001',
        purchaseDate: new Date('2019-09-20'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 11 Pro',
        serialNumber: 'IPHONE1100002',
        purchaseDate: new Date('2019-09-20'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 11 Pro Max',
        serialNumber: 'IPHONE1100003',
        purchaseDate: new Date('2019-09-20'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone SE (2nd generation)',
        serialNumber: 'IPHONESE20001',
        purchaseDate: new Date('2020-04-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 12',
        serialNumber: 'IPHONE1200001',
        purchaseDate: new Date('2020-10-23'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 12 Mini',
        serialNumber: 'IPHONE1200002',
        purchaseDate: new Date('2020-11-13'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 12 Pro',
        serialNumber: 'IPHONE1200003',
        purchaseDate: new Date('2020-10-23'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 12 Pro Max',
        serialNumber: 'IPHONE1200004',
        purchaseDate: new Date('2020-11-13'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 13',
        serialNumber: 'IPHONE1300001',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 13 Mini',
        serialNumber: 'IPHONE1300002',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        serialNumber: 'IPHONE1300003',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 13 Pro Max',
        serialNumber: 'IPHONE1300004',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone SE (3rd generation)',
        serialNumber: 'IPHONESE30001',
        purchaseDate: new Date('2022-03-18'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14',
        serialNumber: 'IPHONE1400001',
        purchaseDate: new Date('2022-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Plus',
        serialNumber: 'IPHONE1400002',
        purchaseDate: new Date('2022-10-07'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        serialNumber: 'IPHONE1400003',
        purchaseDate: new Date('2022-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        serialNumber: 'IPHONE1400004',
        purchaseDate: new Date('2022-09-16'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15',
        serialNumber: 'IPHONE1500001',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15 Plus',
        serialNumber: 'IPHONE1500002',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        serialNumber: 'IPHONE1500003',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        serialNumber: 'IPHONE1500004',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    // Future iPhone 16 series (2024, hypothetical)
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 16',
        serialNumber: 'IPHONE1600001',
        purchaseDate: new Date('2024-09-20'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 16 Plus',
        serialNumber: 'IPHONE1600002',
        purchaseDate: new Date('2024-09-20'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 16 Pro',
        serialNumber: 'IPHONE1600003',
        purchaseDate: new Date('2024-09-20'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model: 'iPhone 16 Pro Max',
        serialNumber: 'IPHONE1600004',
        purchaseDate: new Date('2024-09-20'),
      },
    }),
    // iPad Devices
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad (9th generation)',
        serialNumber: 'IPAD900001',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad (10th generation)',
        serialNumber: 'IPAD1000001',
        purchaseDate: new Date('2022-10-26'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad Air (4th generation)',
        serialNumber: 'IPADAIR40001',
        purchaseDate: new Date('2020-10-23'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad Air (5th generation)',
        serialNumber: 'IPADAIR50001',
        purchaseDate: new Date('2022-03-18'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad mini (6th generation)',
        serialNumber: 'IPADMINI60001',
        purchaseDate: new Date('2021-09-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad Pro 11" (3rd generation)',
        serialNumber: 'IPADPRO110003',
        purchaseDate: new Date('2021-05-21'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'TABLET',
        brand: 'Apple',
        model: 'iPad Pro 12.9" (5th generation)',
        serialNumber: 'IPADPRO129005',
        purchaseDate: new Date('2021-05-21'),
      },
    }),
    // Samsung Galaxy S23 Ultra
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S23 Ultra',
        serialNumber: 'S23U-2023-001',
        purchaseDate: new Date('2023-02-17'),
      },
    }),
    // Samsung Galaxy S23+
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S23+',
        serialNumber: 'S23P-2023-001',
        purchaseDate: new Date('2023-02-17'),
      },
    }),
    // Samsung Galaxy S23
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S23',
        serialNumber: 'S23-2023-001',
        purchaseDate: new Date('2023-02-17'),
      },
    }),
    // Samsung Galaxy S22 Ultra
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S22 Ultra',
        serialNumber: 'S22U-2022-001',
        purchaseDate: new Date('2022-02-25'),
      },
    }),
    // Samsung Galaxy S22+
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S22+',
        serialNumber: 'S22P-2022-001',
        purchaseDate: new Date('2022-02-25'),
      },
    }),
    // Samsung Galaxy S22
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S22',
        serialNumber: 'S22-2022-001',
        purchaseDate: new Date('2022-02-25'),
      },
    }),
    // Samsung Galaxy S21 Ultra
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S21 Ultra',
        serialNumber: 'S21U-2021-001',
        purchaseDate: new Date('2021-01-29'),
      },
    }),
    // Samsung Galaxy S21+
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S21+',
        serialNumber: 'S21P-2021-001',
        purchaseDate: new Date('2021-01-29'),
      },
    }),
    // Samsung Galaxy S21
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy S21',
        serialNumber: 'S21-2021-001',
        purchaseDate: new Date('2021-01-29'),
      },
    }),
    // Samsung Galaxy Note 20 Ultra
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy Note 20 Ultra',
        serialNumber: 'N20U-2020-001',
        purchaseDate: new Date('2020-08-21'),
      },
    }),
    // Samsung Galaxy Note 20
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy Note 20',
        serialNumber: 'N20-2020-001',
        purchaseDate: new Date('2020-08-21'),
      },
    }),
    // Samsung Galaxy A15
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A15',
        serialNumber: 'A15-2024-001',
        purchaseDate: new Date('2024-01-15'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A05s',
        serialNumber: 'A05S-2023-001',
        purchaseDate: new Date('2023-09-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A23',
        serialNumber: 'A23-2022-001',
        purchaseDate: new Date('2022-03-25'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A33',
        serialNumber: 'A33-2022-001',
        purchaseDate: new Date('2022-04-22'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A34',
        serialNumber: 'A34-2023-001',
        purchaseDate: new Date('2023-03-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A35',
        serialNumber: 'A35-2024-001',
        purchaseDate: new Date('2024-03-15'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A53',
        serialNumber: 'A53-2022-001',
        purchaseDate: new Date('2022-03-31'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A54',
        serialNumber: 'A54-2023-001',
        purchaseDate: new Date('2023-03-24'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A55',
        serialNumber: 'A55-2024-001',
        purchaseDate: new Date('2024-03-15'),
      },
    }),
    prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Samsung',
        model: 'Galaxy A73',
        serialNumber: 'A73-2022-001',
        purchaseDate: new Date('2022-04-22'),
      },
    }),
  ])

  // Create parts
  const parts = await Promise.all([
    // iPhone 15 Pro Max Parts
    prisma.part.create({
      data: {
        name: 'iPhone 15 Pro Max Screen',
        sku: 'IPH15PROMAX-SCR',
        cost: 129.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 3,
        deviceModel: 'iPhone 15 Pro Max',
        deviceType: 'SMARTPHONE',
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
        deviceModel: 'iPhone 15 Pro Max',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 15 Pro Parts
    prisma.part.create({
      data: {
        name: 'iPhone 15 Pro Screen',
        sku: 'IPH15PRO-SCR',
        cost: 119.99,
        supplier: 'iFixit',
        inStock: 12,
        minStock: 3,
        deviceModel: 'iPhone 15 Pro',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 15 Pro Battery',
        sku: 'IPH15PRO-BAT',
        cost: 32.99,
        supplier: 'iFixit',
        inStock: 18,
        minStock: 5,
        deviceModel: 'iPhone 15 Pro',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 15 Plus Parts
    prisma.part.create({
      data: {
        name: 'iPhone 15 Plus Screen',
        sku: 'IPH15PLUS-SCR',
        cost: 109.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 3,
        deviceModel: 'iPhone 15 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 15 Plus Battery',
        sku: 'IPH15PLUS-BAT',
        cost: 29.99,
        supplier: 'iFixit',
        inStock: 14,
        minStock: 5,
        deviceModel: 'iPhone 15 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 15 Parts
    prisma.part.create({
      data: {
        name: 'iPhone 15 Screen',
        sku: 'IPH15-SCR',
        cost: 99.99,
        supplier: 'iFixit',
        inStock: 16,
        minStock: 3,
        deviceModel: 'iPhone 15',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 15 Battery',
        sku: 'IPH15-BAT',
        cost: 27.99,
        supplier: 'iFixit',
        inStock: 20,
        minStock: 5,
        deviceModel: 'iPhone 15',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 14 Pro Max Parts
    prisma.part.create({
      data: {
        name: 'iPhone 14 Pro Max Screen',
        sku: 'IPH14PROMAX-SCR',
        cost: 119.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 3,
        deviceModel: 'iPhone 14 Pro Max',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 14 Pro Max Battery',
        sku: 'IPH14PROMAX-BAT',
        cost: 31.99,
        supplier: 'iFixit',
        inStock: 12,
        minStock: 5,
        deviceModel: 'iPhone 14 Pro Max',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 14 Pro Parts
    prisma.part.create({
      data: {
        name: 'iPhone 14 Pro Screen',
        sku: 'IPH14PRO-SCR',
        cost: 109.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 3,
        deviceModel: 'iPhone 14 Pro',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 14 Pro Battery',
        sku: 'IPH14PRO-BAT',
        cost: 28.99,
        supplier: 'iFixit',
        inStock: 15,
        minStock: 5,
        deviceModel: 'iPhone 14 Pro',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 14 Plus Parts
    prisma.part.create({
      data: {
        name: 'iPhone 14 Plus Screen',
        sku: 'IPH14PLUS-SCR',
        cost: 99.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 3,
        deviceModel: 'iPhone 14 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 14 Plus Battery',
        sku: 'IPH14PLUS-BAT',
        cost: 26.99,
        supplier: 'iFixit',
        inStock: 11,
        minStock: 5,
        deviceModel: 'iPhone 14 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 14 Parts
    prisma.part.create({
      data: {
        name: 'iPhone 14 Screen',
        sku: 'IPH14-SCR',
        cost: 89.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 3,
        deviceModel: 'iPhone 14',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 14 Battery',
        sku: 'IPH14-BAT',
        cost: 24.99,
        supplier: 'iFixit',
        inStock: 18,
        minStock: 5,
        deviceModel: 'iPhone 14',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S23 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Screen',
        sku: 'SAM-S23-SCR',
        cost: 79.99,
        supplier: 'Mobile Defender',
        inStock: 8,
        minStock: 5,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Battery',
        sku: 'SAM-S23-BAT',
        cost: 29.99,
        supplier: 'Mobile Defender',
        inStock: 10,
        minStock: 4,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Rear Camera',
        sku: 'SAM-S23-CAM',
        cost: 54.99,
        supplier: 'Mobile Defender',
        inStock: 6,
        minStock: 2,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S22 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Screen',
        sku: 'SAM-S22-SCR',
        cost: 74.99,
        supplier: 'Mobile Defender',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S22',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Battery',
        sku: 'SAM-S22-BAT',
        cost: 27.99,
        supplier: 'Mobile Defender',
        inStock: 9,
        minStock: 4,
        deviceModel: 'Galaxy S22',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S21 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Screen',
        sku: 'SAM-S21-SCR',
        cost: 69.99,
        supplier: 'Mobile Defender',
        inStock: 6,
        minStock: 3,
        deviceModel: 'Galaxy S21',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Battery',
        sku: 'SAM-S21-BAT',
        cost: 25.99,
        supplier: 'Mobile Defender',
        inStock: 8,
        minStock: 3,
        deviceModel: 'Galaxy S21',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Google Pixel 8 Pro Parts
    prisma.part.create({
      data: {
        name: 'Google Pixel 8 Pro Screen',
        sku: 'PIX8PRO-SCR',
        cost: 109.99,
        supplier: 'Mobile Defender',
        inStock: 7,
        minStock: 2,
        deviceModel: 'Pixel 8 Pro',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Google Pixel 8 Pro Battery',
        sku: 'PIX8PRO-BAT',
        cost: 27.99,
        supplier: 'Mobile Defender',
        inStock: 10,
        minStock: 3,
        deviceModel: 'Pixel 8 Pro',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Google Pixel 7 Parts
    prisma.part.create({
      data: {
        name: 'Google Pixel 7 Screen',
        sku: 'PIX7-SCR',
        cost: 89.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 2,
        deviceModel: 'Pixel 7',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Google Pixel 7 Battery',
        sku: 'PIX7-BAT',
        cost: 22.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'Pixel 7',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Dell XPS 13 Parts
    prisma.part.create({
      data: {
        name: 'Dell XPS 13 Keyboard',
        sku: 'DELL-XPS13-KB',
        cost: 45.99,
        supplier: 'Dell Parts',
        inStock: 12,
        minStock: 3,
        deviceModel: 'XPS 13',
        deviceType: 'LAPTOP',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Dell XPS 13 Battery',
        sku: 'DELL-XPS13-BAT',
        cost: 69.99,
        supplier: 'Dell Parts',
        inStock: 8,
        minStock: 2,
        deviceModel: 'XPS 13',
        deviceType: 'LAPTOP',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Dell XPS 13 Touchpad',
        sku: 'DELL-XPS13-TP',
        cost: 39.99,
        supplier: 'Dell Parts',
        inStock: 6,
        minStock: 2,
        deviceModel: 'XPS 13',
        deviceType: 'LAPTOP',
      },
    }),
    // MacBook Pro 13" Parts
    prisma.part.create({
      data: {
        name: 'MacBook Pro 13" Screen',
        sku: 'MBP13-SCR',
        cost: 199.99,
        supplier: 'iFixit',
        inStock: 4,
        minStock: 1,
        deviceModel: 'MacBook Pro 13"',
        deviceType: 'LAPTOP',
      },
    }),
    prisma.part.create({
      data: {
        name: 'MacBook Pro 13" Battery',
        sku: 'MBP13-BAT',
        cost: 99.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 2,
        deviceModel: 'MacBook Pro 13"',
        deviceType: 'LAPTOP',
      },
    }),
    prisma.part.create({
      data: {
        name: 'MacBook Pro 13" SSD',
        sku: 'MBP13-SSD',
        cost: 129.99,
        supplier: 'iFixit',
        inStock: 5,
        minStock: 2,
        deviceModel: 'MacBook Pro 13"',
        deviceType: 'LAPTOP',
      },
    }),
    // HP Spectre x360 Parts
    prisma.part.create({
      data: {
        name: 'HP Spectre x360 Screen',
        sku: 'HP-SPECTRE-SCR',
        cost: 119.99,
        supplier: 'HP Parts',
        inStock: 5,
        minStock: 2,
        deviceModel: 'Spectre x360',
        deviceType: 'LAPTOP',
      },
    }),
    prisma.part.create({
      data: {
        name: 'HP Spectre x360 Battery',
        sku: 'HP-SPECTRE-BAT',
        cost: 59.99,
        supplier: 'HP Parts',
        inStock: 7,
        minStock: 2,
        deviceModel: 'Spectre x360',
        deviceType: 'LAPTOP',
      },
    }),
    // Lenovo ThinkPad X1 Carbon Parts
    prisma.part.create({
      data: {
        name: 'Lenovo ThinkPad X1 Carbon Keyboard',
        sku: 'LEN-X1-KB',
        cost: 49.99,
        supplier: 'Lenovo Parts',
        inStock: 6,
        minStock: 2,
        deviceModel: 'ThinkPad X1 Carbon',
        deviceType: 'LAPTOP',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Lenovo ThinkPad X1 Carbon Fan',
        sku: 'LEN-X1-FAN',
        cost: 29.99,
        supplier: 'Lenovo Parts',
        inStock: 8,
        minStock: 2,
        deviceModel: 'ThinkPad X1 Carbon',
        deviceType: 'LAPTOP',
      },
    }),
    // iPad Pro 12.9" Parts
    prisma.part.create({
      data: {
        name: 'iPad Pro 12.9" Digitizer',
        sku: 'IPAD-PRO12-DIG',
        cost: 149.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 2,
        deviceModel: 'iPad Pro 12.9"',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Pro 12.9" Battery',
        sku: 'IPAD-PRO12-BAT',
        cost: 79.99,
        supplier: 'iFixit',
        inStock: 5,
        minStock: 2,
        deviceModel: 'iPad Pro 12.9"',
        deviceType: 'TABLET',
      },
    }),
    // Samsung Galaxy Tab S8 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Tab S8 Screen',
        sku: 'SAM-TABS8-SCR',
        cost: 99.99,
        supplier: 'Mobile Defender',
        inStock: 6,
        minStock: 2,
        deviceModel: 'Galaxy Tab S8',
        deviceType: 'TABLET',
      },
    }),
    // Microsoft Surface Pro 9 Parts
    prisma.part.create({
      data: {
        name: 'Surface Pro 9 Kickstand',
        sku: 'SURFPRO9-KICK',
        cost: 39.99,
        supplier: 'Microsoft Parts',
        inStock: 4,
        minStock: 1,
        deviceModel: 'Surface Pro 9',
        deviceType: 'TABLET',
      },
    }),
    // Apple Watch Series 8 Parts
    prisma.part.create({
      data: {
        name: 'Apple Watch Series 8 Screen',
        sku: 'AW-S8-SCR',
        cost: 49.99,
        supplier: 'WatchKit',
        inStock: 10,
        minStock: 3,
        deviceModel: 'Watch Series 8',
        deviceType: 'SMARTWATCH',
      },
    }),
    // Samsung Galaxy Watch 6 Parts
    prisma.part.create({
      data: {
        name: 'Galaxy Watch 6 Battery',
        sku: 'SAMWATCH6-BAT',
        cost: 24.99,
        supplier: 'Mobile Defender',
        inStock: 8,
        minStock: 2,
        deviceModel: 'Galaxy Watch 6',
        deviceType: 'SMARTWATCH',
      },
    }),
    // Garmin Fenix 7 Parts
    prisma.part.create({
      data: {
        name: 'Garmin Fenix 7 Strap',
        sku: 'GARMIN7-STRAP',
        cost: 19.99,
        supplier: 'Garmin',
        inStock: 12,
        minStock: 3,
        deviceModel: 'Fenix 7',
        deviceType: 'SMARTWATCH',
      },
    }),
    // PlayStation 5 Parts
    prisma.part.create({
      data: {
        name: 'PS5 Fan',
        sku: 'PS5-FAN',
        cost: 29.99,
        supplier: 'Console Parts',
        inStock: 7,
        minStock: 2,
        deviceModel: 'PlayStation 5',
        deviceType: 'GAMING_CONSOLE',
      },
    }),
    // Xbox Series X Parts
    prisma.part.create({
      data: {
        name: 'Xbox Series X Power Supply',
        sku: 'XBOX-X-PSU',
        cost: 59.99,
        supplier: 'Console Parts',
        inStock: 5,
        minStock: 2,
        deviceModel: 'Xbox Series X',
        deviceType: 'GAMING_CONSOLE',
      },
    }),
    // Nintendo Switch OLED Parts
    prisma.part.create({
      data: {
        name: 'Switch OLED Joy-Con',
        sku: 'SWITCHOLED-JOY',
        cost: 39.99,
        supplier: 'Nintendo',
        inStock: 10,
        minStock: 3,
        deviceModel: 'Switch OLED',
        deviceType: 'GAMING_CONSOLE',
      },
    }),
    // iPhone 6 Series Parts
    prisma.part.create({
      data: {
        name: 'iPhone 6 Screen',
        sku: 'IPH6-SCR',
        cost: 39.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 2,
        deviceModel: 'iPhone 6',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 6 Battery',
        sku: 'IPH6-BAT',
        cost: 14.99,
        supplier: 'iFixit',
        inStock: 15,
        minStock: 3,
        deviceModel: 'iPhone 6',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 6 Plus Screen',
        sku: 'IPH6PLUS-SCR',
        cost: 44.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPhone 6 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 6 Plus Battery',
        sku: 'IPH6PLUS-BAT',
        cost: 16.99,
        supplier: 'iFixit',
        inStock: 12,
        minStock: 2,
        deviceModel: 'iPhone 6 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 6s Series
    prisma.part.create({
      data: {
        name: 'iPhone 6s Screen',
        sku: 'IPH6S-SCR',
        cost: 42.99,
        supplier: 'iFixit',
        inStock: 9,
        minStock: 2,
        deviceModel: 'iPhone 6s',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 6s Battery',
        sku: 'IPH6S-BAT',
        cost: 15.99,
        supplier: 'iFixit',
        inStock: 13,
        minStock: 2,
        deviceModel: 'iPhone 6s',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 6s Plus Screen',
        sku: 'IPH6SPLUS-SCR',
        cost: 47.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 2,
        deviceModel: 'iPhone 6s Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 6s Plus Battery',
        sku: 'IPH6SPLUS-BAT',
        cost: 17.99,
        supplier: 'iFixit',
        inStock: 11,
        minStock: 2,
        deviceModel: 'iPhone 6s Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 7 Series
    prisma.part.create({
      data: {
        name: 'iPhone 7 Screen',
        sku: 'IPH7-SCR',
        cost: 49.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 2,
        deviceModel: 'iPhone 7',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 7 Battery',
        sku: 'IPH7-BAT',
        cost: 18.99,
        supplier: 'iFixit',
        inStock: 14,
        minStock: 2,
        deviceModel: 'iPhone 7',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 7 Plus Screen',
        sku: 'IPH7PLUS-SCR',
        cost: 54.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPhone 7 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 7 Plus Battery',
        sku: 'IPH7PLUS-BAT',
        cost: 20.99,
        supplier: 'iFixit',
        inStock: 12,
        minStock: 2,
        deviceModel: 'iPhone 7 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 8 Series
    prisma.part.create({
      data: {
        name: 'iPhone 8 Screen',
        sku: 'IPH8-SCR',
        cost: 52.99,
        supplier: 'iFixit',
        inStock: 9,
        minStock: 2,
        deviceModel: 'iPhone 8',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 8 Battery',
        sku: 'IPH8-BAT',
        cost: 19.99,
        supplier: 'iFixit',
        inStock: 13,
        minStock: 2,
        deviceModel: 'iPhone 8',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 8 Plus Screen',
        sku: 'IPH8PLUS-SCR',
        cost: 57.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 2,
        deviceModel: 'iPhone 8 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone 8 Plus Battery',
        sku: 'IPH8PLUS-BAT',
        cost: 21.99,
        supplier: 'iFixit',
        inStock: 11,
        minStock: 2,
        deviceModel: 'iPhone 8 Plus',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone X Series
    prisma.part.create({
      data: {
        name: 'iPhone X Screen',
        sku: 'IPHX-SCR',
        cost: 69.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPhone X',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone X Battery',
        sku: 'IPHX-BAT',
        cost: 24.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 2,
        deviceModel: 'iPhone X',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone XR, XS, XS Max
    prisma.part.create({
      data: {
        name: 'iPhone XR Screen',
        sku: 'IPHX-R-SCR',
        cost: 64.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 2,
        deviceModel: 'iPhone XR',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone XR Battery',
        sku: 'IPHX-R-BAT',
        cost: 22.99,
        supplier: 'iFixit',
        inStock: 9,
        minStock: 2,
        deviceModel: 'iPhone XR',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone XS Screen',
        sku: 'IPHX-S-SCR',
        cost: 69.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPhone XS',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone XS Battery',
        sku: 'IPHX-S-BAT',
        cost: 24.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 2,
        deviceModel: 'iPhone XS',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone XS Max Screen',
        sku: 'IPHX-SMAX-SCR',
        cost: 74.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 2,
        deviceModel: 'iPhone XS Max',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPhone XS Max Battery',
        sku: 'IPHX-SMAX-BAT',
        cost: 26.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPhone XS Max',
        deviceType: 'SMARTPHONE',
      },
    }),
    // iPhone 11, 12, 13, 14, 15, 16, SE, Mini, Pro, Pro Max, Plus, etc. (add as needed)
    // iPad Parts
    prisma.part.create({
      data: {
        name: 'iPad (9th gen) Screen',
        sku: 'IPAD9-SCR',
        cost: 79.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPad (9th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad (9th gen) Battery',
        sku: 'IPAD9-BAT',
        cost: 39.99,
        supplier: 'iFixit',
        inStock: 10,
        minStock: 2,
        deviceModel: 'iPad (9th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad (10th gen) Screen',
        sku: 'IPAD10-SCR',
        cost: 89.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 2,
        deviceModel: 'iPad (10th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad (10th gen) Battery',
        sku: 'IPAD10-BAT',
        cost: 44.99,
        supplier: 'iFixit',
        inStock: 9,
        minStock: 2,
        deviceModel: 'iPad (10th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Air (4th gen) Screen',
        sku: 'IPADAIR4-SCR',
        cost: 99.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 2,
        deviceModel: 'iPad Air (4th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Air (4th gen) Battery',
        sku: 'IPADAIR4-BAT',
        cost: 49.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPad Air (4th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Air (5th gen) Screen',
        sku: 'IPADAIR5-SCR',
        cost: 109.99,
        supplier: 'iFixit',
        inStock: 5,
        minStock: 2,
        deviceModel: 'iPad Air (5th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Air (5th gen) Battery',
        sku: 'IPADAIR5-BAT',
        cost: 54.99,
        supplier: 'iFixit',
        inStock: 7,
        minStock: 2,
        deviceModel: 'iPad Air (5th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad mini (6th gen) Screen',
        sku: 'IPADMINI6-SCR',
        cost: 89.99,
        supplier: 'iFixit',
        inStock: 6,
        minStock: 2,
        deviceModel: 'iPad mini (6th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad mini (6th gen) Battery',
        sku: 'IPADMINI6-BAT',
        cost: 39.99,
        supplier: 'iFixit',
        inStock: 8,
        minStock: 2,
        deviceModel: 'iPad mini (6th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Pro 11" (3rd gen) Screen',
        sku: 'IPADPRO11-3-SCR',
        cost: 149.99,
        supplier: 'iFixit',
        inStock: 4,
        minStock: 1,
        deviceModel: 'iPad Pro 11" (3rd generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Pro 11" (3rd gen) Battery',
        sku: 'IPADPRO11-3-BAT',
        cost: 69.99,
        supplier: 'iFixit',
        inStock: 5,
        minStock: 1,
        deviceModel: 'iPad Pro 11" (3rd generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Pro 12.9" (5th gen) Screen',
        sku: 'IPADPRO129-5-SCR',
        cost: 199.99,
        supplier: 'iFixit',
        inStock: 3,
        minStock: 1,
        deviceModel: 'iPad Pro 12.9" (5th generation)',
        deviceType: 'TABLET',
      },
    }),
    prisma.part.create({
      data: {
        name: 'iPad Pro 12.9" (5th gen) Battery',
        sku: 'IPADPRO129-5-BAT',
        cost: 89.99,
        supplier: 'iFixit',
        inStock: 4,
        minStock: 1,
        deviceModel: 'iPad Pro 12.9" (5th generation)',
        deviceType: 'TABLET',
      },
    }),
    // Samsung Galaxy S23 Ultra Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Ultra Screen',
        sku: 'S23U-SCR',
        cost: 320,
        supplier: 'Samsung',
        inStock: 8,
        minStock: 3,
        deviceModel: 'Galaxy S23 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Ultra Battery',
        sku: 'S23U-BAT',
        cost: 55,
        supplier: 'Samsung',
        inStock: 12,
        minStock: 5,
        deviceModel: 'Galaxy S23 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Ultra Rear Camera',
        sku: 'S23U-CAM',
        cost: 110,
        supplier: 'Samsung',
        inStock: 5,
        minStock: 2,
        deviceModel: 'Galaxy S23 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Ultra Charging Port',
        sku: 'S23U-CHG',
        cost: 28,
        supplier: 'Samsung',
        inStock: 10,
        minStock: 4,
        deviceModel: 'Galaxy S23 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S23+ Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23+ Screen',
        sku: 'S23P-SCR',
        cost: 270,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S23+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23+ Battery',
        sku: 'S23P-BAT',
        cost: 48,
        supplier: 'Samsung',
        inStock: 10,
        minStock: 4,
        deviceModel: 'Galaxy S23+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23+ Rear Camera',
        sku: 'S23P-CAM',
        cost: 95,
        supplier: 'Samsung',
        inStock: 4,
        minStock: 2,
        deviceModel: 'Galaxy S23+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23+ Charging Port',
        sku: 'S23P-CHG',
        cost: 25,
        supplier: 'Samsung',
        inStock: 8,
        minStock: 3,
        deviceModel: 'Galaxy S23+',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S23 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Screen',
        sku: 'S23-SCR',
        cost: 250,
        supplier: 'Samsung',
        inStock: 9,
        minStock: 3,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Battery',
        sku: 'S23-BAT',
        cost: 45,
        supplier: 'Samsung',
        inStock: 11,
        minStock: 5,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Rear Camera',
        sku: 'S23-CAM',
        cost: 90,
        supplier: 'Samsung',
        inStock: 4,
        minStock: 2,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S23 Charging Port',
        sku: 'S23-CHG',
        cost: 22,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S23',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S22 Ultra Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Ultra Screen',
        sku: 'S22U-SCR',
        cost: 300,
        supplier: 'Samsung',
        inStock: 6,
        minStock: 3,
        deviceModel: 'Galaxy S22 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Ultra Battery',
        sku: 'S22U-BAT',
        cost: 50,
        supplier: 'Samsung',
        inStock: 10,
        minStock: 5,
        deviceModel: 'Galaxy S22 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Ultra Rear Camera',
        sku: 'S22U-CAM',
        cost: 100,
        supplier: 'Samsung',
        inStock: 3,
        minStock: 2,
        deviceModel: 'Galaxy S22 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Ultra Charging Port',
        sku: 'S22U-CHG',
        cost: 25,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S22 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S22+ Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22+ Screen',
        sku: 'S22P-SCR',
        cost: 240,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S22+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22+ Battery',
        sku: 'S22P-BAT',
        cost: 42,
        supplier: 'Samsung',
        inStock: 9,
        minStock: 5,
        deviceModel: 'Galaxy S22+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22+ Rear Camera',
        sku: 'S22P-CAM',
        cost: 85,
        supplier: 'Samsung',
        inStock: 3,
        minStock: 2,
        deviceModel: 'Galaxy S22+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22+ Charging Port',
        sku: 'S22P-CHG',
        cost: 20,
        supplier: 'Samsung',
        inStock: 6,
        minStock: 3,
        deviceModel: 'Galaxy S22+',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S22 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Screen',
        sku: 'S22-SCR',
        cost: 220,
        supplier: 'Samsung',
        inStock: 8,
        minStock: 3,
        deviceModel: 'Galaxy S22',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Battery',
        sku: 'S22-BAT',
        cost: 40,
        supplier: 'Samsung',
        inStock: 10,
        minStock: 5,
        deviceModel: 'Galaxy S22',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Rear Camera',
        sku: 'S22-CAM',
        cost: 80,
        supplier: 'Samsung',
        inStock: 3,
        minStock: 2,
        deviceModel: 'Galaxy S22',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S22 Charging Port',
        sku: 'S22-CHG',
        cost: 18,
        supplier: 'Samsung',
        inStock: 5,
        minStock: 3,
        deviceModel: 'Galaxy S22',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S21 Ultra Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Ultra Screen',
        sku: 'S21U-SCR',
        cost: 280,
        supplier: 'Samsung',
        inStock: 5,
        minStock: 2,
        deviceModel: 'Galaxy S21 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Ultra Battery',
        sku: 'S21U-BAT',
        cost: 48,
        supplier: 'Samsung',
        inStock: 8,
        minStock: 3,
        deviceModel: 'Galaxy S21 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Ultra Rear Camera',
        sku: 'S21U-CAM',
        cost: 95,
        supplier: 'Samsung',
        inStock: 2,
        minStock: 2,
        deviceModel: 'Galaxy S21 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Ultra Charging Port',
        sku: 'S21U-CHG',
        cost: 20,
        supplier: 'Samsung',
        inStock: 5,
        minStock: 2,
        deviceModel: 'Galaxy S21 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S21+ Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21+ Screen',
        sku: 'S21P-SCR',
        cost: 210,
        supplier: 'Samsung',
        inStock: 6,
        minStock: 3,
        deviceModel: 'Galaxy S21+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21+ Battery',
        sku: 'S21P-BAT',
        cost: 38,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S21+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21+ Rear Camera',
        sku: 'S21P-CAM',
        cost: 75,
        supplier: 'Samsung',
        inStock: 2,
        minStock: 2,
        deviceModel: 'Galaxy S21+',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21+ Charging Port',
        sku: 'S21P-CHG',
        cost: 15,
        supplier: 'Samsung',
        inStock: 4,
        minStock: 2,
        deviceModel: 'Galaxy S21+',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy S21 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Screen',
        sku: 'S21-SCR',
        cost: 190,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 3,
        deviceModel: 'Galaxy S21',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Battery',
        sku: 'S21-BAT',
        cost: 35,
        supplier: 'Samsung',
        inStock: 8,
        minStock: 3,
        deviceModel: 'Galaxy S21',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Rear Camera',
        sku: 'S21-CAM',
        cost: 70,
        supplier: 'Samsung',
        inStock: 2,
        minStock: 2,
        deviceModel: 'Galaxy S21',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy S21 Charging Port',
        sku: 'S21-CHG',
        cost: 12,
        supplier: 'Samsung',
        inStock: 4,
        minStock: 2,
        deviceModel: 'Galaxy S21',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy Note 20 Ultra Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Ultra Screen',
        sku: 'N20U-SCR',
        cost: 260,
        supplier: 'Samsung',
        inStock: 4,
        minStock: 2,
        deviceModel: 'Galaxy Note 20 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Ultra Battery',
        sku: 'N20U-BAT',
        cost: 45,
        supplier: 'Samsung',
        inStock: 6,
        minStock: 2,
        deviceModel: 'Galaxy Note 20 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Ultra Rear Camera',
        sku: 'N20U-CAM',
        cost: 90,
        supplier: 'Samsung',
        inStock: 2,
        minStock: 2,
        deviceModel: 'Galaxy Note 20 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Ultra Charging Port',
        sku: 'N20U-CHG',
        cost: 18,
        supplier: 'Samsung',
        inStock: 3,
        minStock: 2,
        deviceModel: 'Galaxy Note 20 Ultra',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy Note 20 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Screen',
        sku: 'N20-SCR',
        cost: 210,
        supplier: 'Samsung',
        inStock: 5,
        minStock: 2,
        deviceModel: 'Galaxy Note 20',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Battery',
        sku: 'N20-BAT',
        cost: 38,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 2,
        deviceModel: 'Galaxy Note 20',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Rear Camera',
        sku: 'N20-CAM',
        cost: 70,
        supplier: 'Samsung',
        inStock: 2,
        minStock: 2,
        deviceModel: 'Galaxy Note 20',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy Note 20 Charging Port',
        sku: 'N20-CHG',
        cost: 12,
        supplier: 'Samsung',
        inStock: 3,
        minStock: 2,
        deviceModel: 'Galaxy Note 20',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy A15 Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A15 Screen',
        sku: 'A15-SCR',
        cost: 80,
        supplier: 'Samsung',
        inStock: 10,
        minStock: 3,
        deviceModel: 'Galaxy A15',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A15 Battery',
        sku: 'A15-BAT',
        cost: 18,
        supplier: 'Samsung',
        inStock: 15,
        minStock: 5,
        deviceModel: 'Galaxy A15',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A15 Rear Camera',
        sku: 'A15-CAM',
        cost: 30,
        supplier: 'Samsung',
        inStock: 6,
        minStock: 2,
        deviceModel: 'Galaxy A15',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A15 Charging Port',
        sku: 'A15-CHG',
        cost: 8,
        supplier: 'Samsung',
        inStock: 10,
        minStock: 4,
        deviceModel: 'Galaxy A15',
        deviceType: 'SMARTPHONE',
      },
    }),
    // Samsung Galaxy A05s Parts
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A05s Screen',
        sku: 'A05S-SCR',
        cost: 65,
        supplier: 'Samsung',
        inStock: 12,
        minStock: 3,
        deviceModel: 'Galaxy A05s',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A05s Battery',
        sku: 'A05S-BAT',
        cost: 15,
        supplier: 'Samsung',
        inStock: 18,
        minStock: 5,
        deviceModel: 'Galaxy A05s',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A05s Rear Camera',
        sku: 'A05S-CAM',
        cost: 22,
        supplier: 'Samsung',
        inStock: 7,
        minStock: 2,
        deviceModel: 'Galaxy A05s',
        deviceType: 'SMARTPHONE',
      },
    }),
    prisma.part.create({
      data: {
        name: 'Samsung Galaxy A05s Charging Port',
        sku: 'A05S-CHG',
        cost: 6,
        supplier: 'Samsung',
        inStock: 12,
        minStock: 4,
        deviceModel: 'Galaxy A05s',
        deviceType: 'SMARTPHONE',
      },
    }),
  ])

  // Create accessories
  const accessories = await Promise.all([
    // iPhone Cases
    prisma.accessory.create({
      data: {
        name: 'iPhone 15 Pro Max Silicone Case',
        category: 'CASE',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        price: 49.99,
        inStock: 25,
        minStock: 5,
        description: 'Official Apple silicone case with MagSafe compatibility',
        compatibility: 'iPhone 15 Pro Max',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'iPhone 15 Pro Clear Case',
        category: 'CASE',
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        price: 39.99,
        inStock: 30,
        minStock: 8,
        description: 'Crystal clear case showing off your iPhone design',
        compatibility: 'iPhone 15 Pro',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Universal Phone Case',
        category: 'CASE',
        brand: 'Generic',
        price: 12.99,
        inStock: 50,
        minStock: 15,
        description: 'Universal protective case for most smartphones',
        compatibility: 'Universal smartphones',
      },
    }),
    
    // Chargers and Cables
    prisma.accessory.create({
      data: {
        name: 'USB-C to Lightning Cable',
        category: 'CABLE',
        brand: 'Apple',
        price: 29.99,
        inStock: 40,
        minStock: 10,
        description: '1m USB-C to Lightning cable for fast charging',
        compatibility: 'iPhone 15 series, older iPhones',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'USB-C to USB-C Cable',
        category: 'CABLE',
        brand: 'Apple',
        price: 19.99,
        inStock: 35,
        minStock: 10,
        description: '1m USB-C to USB-C cable for iPhone 15 series',
        compatibility: 'iPhone 15 series, iPad Pro, MacBook',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Wireless Charging Pad',
        category: 'CHARGER',
        brand: 'Belkin',
        price: 34.99,
        inStock: 20,
        minStock: 5,
        description: '15W wireless charging pad with fast charging',
        compatibility: 'iPhone 8 and later, Samsung Galaxy, Google Pixel',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'MagSafe Charger',
        category: 'CHARGER',
        brand: 'Apple',
        price: 39.99,
        inStock: 18,
        minStock: 5,
        description: 'Official Apple MagSafe wireless charger',
        compatibility: 'iPhone 12 series and later',
      },
    }),
    prisma.accessory.create({
      data: {
        name: '65W USB-C Power Adapter',
        category: 'CHARGER',
        brand: 'Apple',
        price: 59.99,
        inStock: 15,
        minStock: 3,
        description: 'Fast charging adapter for MacBook and iPad',
        compatibility: 'MacBook Air, iPad Pro, iPhone 15 series',
      },
    }),

    // Screen Protectors
    prisma.accessory.create({
      data: {
        name: 'iPhone 15 Pro Max Tempered Glass',
        category: 'SCREEN_PROTECTOR',
        brand: 'Zagg',
        model: 'iPhone 15 Pro Max',
        price: 24.99,
        inStock: 45,
        minStock: 10,
        description: 'Premium tempered glass screen protector',
        compatibility: 'iPhone 15 Pro Max',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'iPad Pro 12.9" Screen Protector',
        category: 'SCREEN_PROTECTOR',
        brand: 'Paperlike',
        model: 'iPad Pro 12.9"',
        price: 39.99,
        inStock: 20,
        minStock: 5,
        description: 'Paper-like texture for Apple Pencil users',
        compatibility: 'iPad Pro 12.9" (all generations)',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Universal Tablet Screen Protector',
        category: 'SCREEN_PROTECTOR',
        brand: 'Generic',
        price: 14.99,
        inStock: 30,
        minStock: 8,
        description: 'Cut-to-fit screen protector for various tablets',
        compatibility: 'Most tablets 9-13 inches',
      },
    }),

    // Headphones and Audio
    prisma.accessory.create({
      data: {
        name: 'AirPods Pro (2nd generation)',
        category: 'HEADPHONES',
        brand: 'Apple',
        price: 249.99,
        inStock: 12,
        minStock: 3,
        description: 'Active noise cancellation wireless earbuds',
        compatibility: 'iPhone, iPad, Mac, Apple Watch',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'AirPods (3rd generation)',
        category: 'HEADPHONES',
        brand: 'Apple',
        price: 179.99,
        inStock: 15,
        minStock: 4,
        description: 'Spatial audio wireless earbuds',
        compatibility: 'iPhone, iPad, Mac, Apple Watch',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Galaxy Buds2 Pro',
        category: 'HEADPHONES',
        brand: 'Samsung',
        price: 199.99,
        inStock: 10,
        minStock: 3,
        description: 'Active noise cancellation for Samsung devices',
        compatibility: 'Samsung Galaxy phones and tablets',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Wired Earbuds with USB-C',
        category: 'HEADPHONES',
        brand: 'Generic',
        price: 19.99,
        inStock: 40,
        minStock: 12,
        description: 'Basic wired earbuds with USB-C connector',
        compatibility: 'Devices with USB-C port',
      },
    }),

    // Stands and Mounts
    prisma.accessory.create({
      data: {
        name: 'iPhone MagSafe Desktop Stand',
        category: 'STAND',
        brand: 'Belkin',
        price: 34.99,
        inStock: 25,
        minStock: 5,
        description: 'Adjustable MagSafe compatible desktop stand',
        compatibility: 'iPhone 12 series and later with MagSafe',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'iPad Pro Magic Keyboard',
        category: 'KEYBOARD',
        brand: 'Apple',
        model: 'iPad Pro 12.9"',
        price: 349.99,
        inStock: 8,
        minStock: 2,
        description: 'Backlit keyboard with trackpad for iPad Pro',
        compatibility: 'iPad Pro 12.9" (3rd gen and later)',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Apple Pencil (2nd generation)',
        category: 'STYLUS',
        brand: 'Apple',
        price: 129.99,
        inStock: 20,
        minStock: 5,
        description: 'Precision stylus for iPad with magnetic attachment',
        compatibility: 'iPad Pro, iPad Air (4th gen and later), iPad mini (6th gen)',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Universal Tablet Stand',
        category: 'STAND',
        brand: 'Generic',
        price: 15.99,
        inStock: 35,
        minStock: 8,
        description: 'Adjustable stand for tablets and phones',
        compatibility: 'Most tablets and large phones',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Car Phone Mount',
        category: 'MOUNT',
        brand: 'iOttie',
        price: 24.99,
        inStock: 30,
        minStock: 8,
        description: 'Dashboard and windshield phone mount',
        compatibility: 'Most smartphones',
      },
    }),

    // Computer Accessories
    prisma.accessory.create({
      data: {
        name: 'Magic Mouse',
        category: 'MOUSE',
        brand: 'Apple',
        price: 99.99,
        inStock: 15,
        minStock: 3,
        description: 'Wireless rechargeable mouse with Multi-Touch surface',
        compatibility: 'Mac, iPad with mouse support',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'MacBook Pro 13" Laptop Sleeve',
        category: 'CASE',
        brand: 'Apple',
        model: 'MacBook Pro 13"',
        price: 59.99,
        inStock: 12,
        minStock: 3,
        description: 'Premium leather sleeve for MacBook Pro',
        compatibility: 'MacBook Pro 13" and MacBook Air',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'USB-C Hub with HDMI',
        category: 'OTHER',
        brand: 'Anker',
        price: 49.99,
        inStock: 18,
        minStock: 5,
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
        compatibility: 'MacBook, iPad Pro, laptops with USB-C',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Laptop Cleaning Kit',
        category: 'OTHER',
        brand: 'CleanTech',
        price: 12.99,
        inStock: 40,
        minStock: 10,
        description: 'Complete cleaning kit for laptops and screens',
        compatibility: 'All laptops and devices with screens',
      },
    }),

    // Gaming Console Accessories
    prisma.accessory.create({
      data: {
        name: 'PS5 DualSense Controller',
        category: 'OTHER',
        brand: 'Sony',
        model: 'PlayStation 5',
        price: 69.99,
        inStock: 12,
        minStock: 3,
        description: 'Wireless controller with haptic feedback',
        compatibility: 'PlayStation 5',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'PS5 Console Stand',
        category: 'STAND',
        brand: 'Sony',
        model: 'PlayStation 5',
        price: 29.99,
        inStock: 15,
        minStock: 3,
        description: 'Vertical stand for PS5 console',
        compatibility: 'PlayStation 5',
      },
    }),

    // Watch Accessories
    prisma.accessory.create({
      data: {
        name: 'Apple Watch Sport Band',
        category: 'OTHER',
        brand: 'Apple',
        price: 49.99,
        inStock: 25,
        minStock: 6,
        description: 'Comfortable sport band in various colors',
        compatibility: 'Apple Watch (all sizes and generations)',
      },
    }),
    prisma.accessory.create({
      data: {
        name: 'Apple Watch Charging Cable',
        category: 'CABLE',
        brand: 'Apple',
        price: 29.99,
        inStock: 20,
        minStock: 5,
        description: 'Magnetic charging cable for Apple Watch',
        compatibility: 'All Apple Watch models',
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

  // Add more parts for iPhone devices
  const iphoneModels = [
    'iPhone 6', 'iPhone 6 Plus', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone SE (1st generation)',
    'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max',
    'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE (2nd generation)',
    'iPhone 12', 'iPhone 12 Mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
    'iPhone 13', 'iPhone 13 Mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone SE (3rd generation)',
    'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
    'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
    'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
  ];

  const iphoneParts = [
    { name: 'Screen', sku: 'SCR', cost: 200, supplier: 'Apple', stock: 10 },
    { name: 'Battery', sku: 'BAT', cost: 40, supplier: 'Apple', stock: 15 },
    { name: 'Rear Camera', sku: 'RCAM', cost: 120, supplier: 'Apple', stock: 6 },
    { name: 'Front Camera', sku: 'FCAM', cost: 60, supplier: 'Apple', stock: 8 },
    { name: 'Charging Port', sku: 'CHG', cost: 25, supplier: 'Apple', stock: 12 },
    { name: 'Speaker', sku: 'SPK', cost: 18, supplier: 'Apple', stock: 10 },
    { name: 'Earpiece', sku: 'EAR', cost: 12, supplier: 'Apple', stock: 10 },
    { name: 'Vibration Motor', sku: 'VIB', cost: 15, supplier: 'Apple', stock: 8 },
    { name: 'Face ID Sensor', sku: 'FID', cost: 80, supplier: 'Apple', stock: 5 },
    { name: 'Touch ID Sensor', sku: 'TID', cost: 50, supplier: 'Apple', stock: 5 },
    { name: 'SIM Tray', sku: 'SIM', cost: 5, supplier: 'Apple', stock: 20 },
    { name: 'Back Glass', sku: 'BGL', cost: 35, supplier: 'Apple', stock: 10 },
    { name: 'Frame', sku: 'FRM', cost: 60, supplier: 'Apple', stock: 4 },
    { name: 'Proximity Sensor', sku: 'PROX', cost: 10, supplier: 'Apple', stock: 10 },
    { name: 'Microphone', sku: 'MIC', cost: 8, supplier: 'Apple', stock: 10 },
    { name: 'Power Button', sku: 'PWR', cost: 7, supplier: 'Apple', stock: 10 },
    { name: 'Volume Button', sku: 'VOL', cost: 7, supplier: 'Apple', stock: 10 },
    { name: 'Mute Switch', sku: 'MUTE', cost: 6, supplier: 'Apple', stock: 10 },
  ];

  for (const model of iphoneModels) {
    await prisma.device.create({
      data: {
        type: 'SMARTPHONE',
        brand: 'Apple',
        model,
        serialNumber: `${model.replace(/\s+/g, '').replace(/\(|\)/g, '').replace(/\"/g, '').toUpperCase()}-SEED`,
        purchaseDate: new Date('2023-01-01'), // Use realistic dates if needed
      },
    });

    for (const part of iphoneParts) {
      await prisma.part.create({
        data: {
          name: `${part.name} for ${model}`,
          sku: `${model.replace(/\s+/g, '').replace(/\(|\)/g, '').replace(/\"/g, '').toUpperCase()}-${part.sku}`,
          cost: part.cost,
          supplier: part.supplier,
          inStock: part.stock,
          minStock: 3,
          deviceModel: model,
          deviceType: 'SMARTPHONE',
        },
      });
    }
  }

  // Add more Xiaomi smartphones
  const moreXiaomiPhones = [
    { model: 'Xiaomi 13', releaseDate: '2022-12-14' },
    { model: 'Xiaomi 13 Pro', releaseDate: '2022-12-14' },
    { model: 'Xiaomi 12T', releaseDate: '2022-10-06' },
    { model: 'Redmi Note 13 Pro', releaseDate: '2023-09-21' },
    { model: 'Redmi Note 10', releaseDate: '2021-03-04' },
    { model: 'Poco X6 Pro', releaseDate: '2024-01-11' },
    { model: 'Poco F4', releaseDate: '2022-06-27' }
  ];
  const xiaomiParts = [
    { name: 'Screen', cost: 110, supplier: 'Xiaomi OEM', stock: 8 },
    { name: 'Battery', cost: 35, supplier: 'Xiaomi OEM', stock: 12 },
    { name: 'Rear Camera', cost: 40, supplier: 'Xiaomi OEM', stock: 5 },
    { name: 'Front Camera', cost: 22, supplier: 'Xiaomi OEM', stock: 6 },
    { name: 'Charging Port', cost: 15, supplier: 'Xiaomi OEM', stock: 10 },
    { name: 'Speaker', cost: 12, supplier: 'Xiaomi OEM', stock: 8 },
    { name: 'Frame', cost: 25, supplier: 'Xiaomi OEM', stock: 4 },
    { name: 'Back Cover', cost: 20, supplier: 'Xiaomi OEM', stock: 5 },
    { name: 'Microphone', cost: 6, supplier: 'Xiaomi OEM', stock: 8 },
    { name: 'Power Button', cost: 5, supplier: 'Xiaomi OEM', stock: 7 },
    { name: 'Volume Button', cost: 5, supplier: 'Xiaomi OEM', stock: 7 }
  ];
  for (const phone of moreXiaomiPhones) {
    await createDeviceWithParts({
      brand: 'Xiaomi',
      model: phone.model,
      serialNumber: `${phone.model.replace(/\s+/g, '').replace(/\+|"/g, '').toUpperCase()}-SEED`,
      releaseDate: new Date(phone.releaseDate),
      type: 'SMARTPHONE',
      parts: xiaomiParts,
    });
  }

  // Add more Samsung smartphones
  const moreSamsungPhones = [
    { model: 'Galaxy S24 FE', releaseDate: '2024-04-10' },
    { model: 'Galaxy S23 FE', releaseDate: '2023-10-05' },
    { model: 'Galaxy S20 FE', releaseDate: '2020-10-02' },
    { model: 'Galaxy Z Fold4', releaseDate: '2022-08-25' },
    { model: 'Galaxy Z Flip4', releaseDate: '2022-08-26' },
    { model: 'Galaxy Note 8', releaseDate: '2017-09-15' },
    { model: 'Galaxy A52', releaseDate: '2021-03-26' },
    { model: 'Galaxy A72', releaseDate: '2021-03-26' }
  ];
  const samsungParts = [
    { name: 'Screen', cost: 180, supplier: 'Samsung OEM', stock: 8 },
    { name: 'Battery', cost: 45, supplier: 'Samsung OEM', stock: 12 },
    { name: 'Rear Camera', cost: 90, supplier: 'Samsung OEM', stock: 5 },
    { name: 'Front Camera', cost: 40, supplier: 'Samsung OEM', stock: 6 },
    { name: 'Charging Port', cost: 22, supplier: 'Samsung OEM', stock: 10 },
    { name: 'Speaker', cost: 20, supplier: 'Samsung OEM', stock: 8 },
    { name: 'Frame', cost: 50, supplier: 'Samsung OEM', stock: 4 },
    { name: 'Back Cover', cost: 40, supplier: 'Samsung OEM', stock: 5 },
    { name: 'Microphone', cost: 10, supplier: 'Samsung OEM', stock: 8 },
    { name: 'Power Button', cost: 8, supplier: 'Samsung OEM', stock: 7 },
    { name: 'Volume Button', cost: 8, supplier: 'Samsung OEM', stock: 7 }
  ];
  for (const phone of moreSamsungPhones) {
    await createDeviceWithParts({
      brand: 'Samsung',
      model: phone.model,
      serialNumber: `${phone.model.replace(/\s+/g, '').replace(/\+|"/g, '').toUpperCase()}-SEED`,
      releaseDate: new Date(phone.releaseDate),
      type: 'SMARTPHONE',
      parts: samsungParts,
    });
  }

  // Add missing Samsung smartphones with their parts
  const missingSamsungPhones = [
    { model: 'Galaxy S23', releaseDate: '2023-02-17' },
    { model: 'Galaxy S22', releaseDate: '2022-02-25' },
    { model: 'Galaxy S21', releaseDate: '2021-01-29' },
    { model: 'Galaxy S21 Ultra', releaseDate: '2021-01-29' },
    { model: 'Galaxy S20', releaseDate: '2020-03-06' },
    { model: 'Galaxy Note 20', releaseDate: '2020-08-21' },
    { model: 'Galaxy Note 20 Ultra', releaseDate: '2020-08-21' },
    { model: 'Galaxy S23 Ultra', releaseDate: '2023-02-17' },
    { model: 'Galaxy S23+', releaseDate: '2023-02-17' },
    { model: 'Galaxy S22 Ultra', releaseDate: '2022-02-25' },
    { model: 'Galaxy S22+', releaseDate: '2022-02-25' },
    { model: 'Galaxy S21+', releaseDate: '2021-01-29' },
    { model: 'Galaxy A15', releaseDate: '2024-01-15' },
    { model: 'Galaxy A05s', releaseDate: '2023-09-22' },
    { model: 'Galaxy A23', releaseDate: '2022-03-25' },
    { model: 'Galaxy A33', releaseDate: '2022-04-22' },
    { model: 'Galaxy A34', releaseDate: '2023-03-24' },
    { model: 'Galaxy A35', releaseDate: '2024-03-15' },
    { model: 'Galaxy A53', releaseDate: '2022-03-31' },
    { model: 'Galaxy A54', releaseDate: '2023-03-24' },
    { model: 'Galaxy A55', releaseDate: '2024-03-15' },
    { model: 'Galaxy A73', releaseDate: '2022-04-22' },
    { model: 'Galaxy S21 FE', releaseDate: '2022-01-11' },
    { model: 'Galaxy S20+', releaseDate: '2020-03-06' },
    { model: 'Galaxy S20 Ultra', releaseDate: '2020-03-06' },
    { model: 'Galaxy S10', releaseDate: '2019-03-08' },
    { model: 'Galaxy S10e', releaseDate: '2019-03-08' },
    { model: 'Galaxy S9', releaseDate: '2018-03-16' },
    { model: 'Galaxy S8', releaseDate: '2017-04-21' },
    { model: 'Galaxy Note 10+', releaseDate: '2019-08-23' },
    { model: 'Galaxy Note 9', releaseDate: '2018-08-24' }
  ];
  // Use the already-declared samsungParts array
  for (const phone of missingSamsungPhones) {
    await createDeviceWithParts({
      brand: 'Samsung',
      model: phone.model,
      serialNumber: `${phone.model.replace(/\s+/g, '').replace(/\+|"/g, '').toUpperCase()}-SEED`,
      releaseDate: new Date(phone.releaseDate),
      type: 'SMARTPHONE',
      parts: samsungParts,
    });
  }

  // Add Apple Watch Series
  const appleWatchSeries = [
    { model: 'Watch Series 6', releaseDate: '2020-09-18', serialNumber: 'AW6000001' },
    { model: 'Watch Series 7', releaseDate: '2021-10-15', serialNumber: 'AW7000001' },
    { model: 'Watch Series 8', releaseDate: '2022-09-16', serialNumber: 'AW8000001' },
    { model: 'Watch Series 9', releaseDate: '2023-09-22', serialNumber: 'AW9000001' }
  ];
  const appleWatchParts = [
    { name: 'Screen', cost: 100, supplier: 'Apple OEM', stock: 5 },
    { name: 'Battery', cost: 35, supplier: 'Apple OEM', stock: 8 },
    { name: 'Back Cover', cost: 28, supplier: 'Apple OEM', stock: 4 },
    { name: 'Digital Crown', cost: 22, supplier: 'Apple OEM', stock: 3 },
    { name: 'Sensor Assembly', cost: 45, supplier: 'Apple OEM', stock: 2 },
    { name: 'Charging Port', cost: 16, supplier: 'Apple OEM', stock: 6 },
    { name: 'Band', cost: 12, supplier: 'Apple OEM', stock: 10 }
  ];
  for (const watch of appleWatchSeries) {
    await createDeviceWithParts({
      brand: 'Apple',
      model: watch.model,
      serialNumber: watch.serialNumber,
      releaseDate: new Date(watch.releaseDate),
      type: 'SMARTWATCH',
      parts: appleWatchParts,
    });
  }

  // Add Samsung Galaxy Watch Series
  const samsungWatchSeries = [
    { model: 'Galaxy Watch 4', releaseDate: '2021-08-27', serialNumber: 'SGW4000001' },
    { model: 'Galaxy Watch 5', releaseDate: '2022-08-26', serialNumber: 'SGW5000001' },
    { model: 'Galaxy Watch 6', releaseDate: '2023-08-11', serialNumber: 'SGW6000001' }
  ];
  const samsungWatchParts = [
    { name: 'Screen', cost: 90, supplier: 'Samsung OEM', stock: 5 },
    { name: 'Battery', cost: 32, supplier: 'Samsung OEM', stock: 8 },
    { name: 'Back Cover', cost: 25, supplier: 'Samsung OEM', stock: 4 },
    { name: 'Bezel', cost: 22, supplier: 'Samsung OEM', stock: 3 },
    { name: 'Sensor Assembly', cost: 40, supplier: 'Samsung OEM', stock: 2 },
    { name: 'Charging Port', cost: 14, supplier: 'Samsung OEM', stock: 6 },
    { name: 'Band', cost: 10, supplier: 'Samsung OEM', stock: 10 }
  ];
  for (const watch of samsungWatchSeries) {
    await createDeviceWithParts({
      brand: 'Samsung',
      model: watch.model,
      serialNumber: watch.serialNumber,
      releaseDate: new Date(watch.releaseDate),
      type: 'SMARTWATCH',
      parts: samsungWatchParts,
    });
  }

  // Repair services data
  const repairServicesData = [
    // Apple iPhone - Screen Replacement
    {
      name: 'Screen Replacement',
      description: 'Replace cracked or broken screen with a new OEM-quality display.',
      basePrice: 199,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(['SMARTPHONE']),
      specificBrand: 'Apple',
      specificModel: null,
      priceVariations: JSON.stringify({
        'iPhone 15 Pro Max': 399,
        'iPhone 14 Pro': 349,
        'iPhone 13': 249
      }),
      popularity: 'Most Popular',
      icon: '🖥️',
      isActive: true
    },
    // Apple iPhone - Battery Replacement
    {
      name: 'Battery Replacement',
      description: 'Replace degraded or faulty battery with a new OEM-quality battery.',
      basePrice: 99,
      estimatedTime: 40,
      deviceTypes: JSON.stringify(['SMARTPHONE']),
      specificBrand: 'Apple',
      specificModel: null,
      priceVariations: JSON.stringify({
        'iPhone 15 Pro Max': 129,
        'iPhone 14 Pro': 119,
        'iPhone 13': 109
      }),
      popularity: 'Popular',
      icon: '🔋',
      isActive: true
    },
    // Apple iPhone - Camera Repair
    {
      name: 'Camera Repair',
      description: 'Repair or replace rear or front camera module.',
      basePrice: 129,
      estimatedTime: 50,
      deviceTypes: JSON.stringify(['SMARTPHONE']),
      specificBrand: 'Apple',
      specificModel: null,
      priceVariations: JSON.stringify({
        'iPhone 15 Pro Max': 199,
        'iPhone 14 Pro': 179
      }),
      popularity: null,
      icon: '📷',
      isActive: true
    },
    // Apple iPad - Screen Replacement
    {
      name: 'Screen Replacement',
      description: 'Replace cracked or broken iPad screen.',
      basePrice: 249,
      estimatedTime: 90,
      deviceTypes: JSON.stringify(['TABLET']),
      specificBrand: 'Apple',
      specificModel: null,
      priceVariations: JSON.stringify({
        'iPad Pro 12.9"': 399,
        'iPad Air 5': 299
      }),
      popularity: 'Most Popular',
      icon: '🖥️',
      isActive: true
    },
    // Apple iPad - Battery Replacement
    {
      name: 'Battery Replacement',
      description: 'Replace iPad battery for improved performance.',
      basePrice: 129,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(['TABLET']),
      specificBrand: 'Apple',
      specificModel: null,
      priceVariations: JSON.stringify({
        'iPad Pro 12.9"': 179,
        'iPad Air 5': 149
      }),
      popularity: null,
      icon: '🔋',
      isActive: true
    },
    // Samsung Galaxy Phone - Screen Replacement
    {
      name: 'Screen Replacement',
      description: 'Replace cracked or broken Samsung Galaxy screen.',
      basePrice: 189,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(['SMARTPHONE']),
      specificBrand: 'Samsung',
      specificModel: null,
      priceVariations: JSON.stringify({
        'Galaxy S24 Ultra': 349,
        'Galaxy S23': 249
      }),
      popularity: 'Most Popular',
      icon: '🖥️',
      isActive: true
    },
    // Samsung Galaxy Phone - Battery Replacement
    {
      name: 'Battery Replacement',
      description: 'Replace Samsung Galaxy battery for better performance.',
      basePrice: 89,
      estimatedTime: 40,
      deviceTypes: JSON.stringify(['SMARTPHONE']),
      specificBrand: 'Samsung',
      specificModel: null,
      priceVariations: JSON.stringify({
        'Galaxy S24 Ultra': 119,
        'Galaxy S23': 99
      }),
      popularity: 'Popular',
      icon: '🔋',
      isActive: true
    },
    // Samsung Galaxy Phone - Camera Repair
    {
      name: 'Camera Repair',
      description: 'Repair or replace Samsung Galaxy camera module.',
      basePrice: 119,
      estimatedTime: 50,
      deviceTypes: JSON.stringify(['SMARTPHONE']),
      specificBrand: 'Samsung',
      specificModel: null,
      priceVariations: JSON.stringify({
        'Galaxy S24 Ultra': 179,
        'Galaxy S23': 149
      }),
      popularity: null,
      icon: '📷',
      isActive: true
    },
    // Samsung Tablet - Screen Replacement
    {
      name: 'Screen Replacement',
      description: 'Replace cracked or broken Samsung tablet screen.',
      basePrice: 229,
      estimatedTime: 90,
      deviceTypes: JSON.stringify(['TABLET']),
      specificBrand: 'Samsung',
      specificModel: null,
      priceVariations: JSON.stringify({
        'Galaxy Tab S9 Ultra': 399,
        'Galaxy Tab S8': 299
      }),
      popularity: 'Most Popular',
      icon: '🖥️',
      isActive: true
    },
    // Samsung Tablet - Battery Replacement
    {
      name: 'Battery Replacement',
      description: 'Replace Samsung tablet battery for improved performance.',
      basePrice: 109,
      estimatedTime: 60,
      deviceTypes: JSON.stringify(['TABLET']),
      specificBrand: 'Samsung',
      specificModel: null,
      priceVariations: JSON.stringify({
        'Galaxy Tab S9 Ultra': 159,
        'Galaxy Tab S8': 129
      }),
      popularity: null,
      icon: '🔋',
      isActive: true
    },
    // Universal - Water Damage Repair
    {
      name: 'Water Damage Repair',
      description: 'Full device cleaning and repair after water exposure.',
      basePrice: 149,
      estimatedTime: 120,
      deviceTypes: JSON.stringify(['SMARTPHONE', 'TABLET']),
      specificBrand: null,
      specificModel: null,
      priceVariations: null,
      popularity: null,
      icon: '💧',
      isActive: true
    },
    // Universal - Charging Port Repair
    {
      name: 'Charging Port Repair',
      description: 'Repair or replace faulty charging port.',
      basePrice: 89,
      estimatedTime: 45,
      deviceTypes: JSON.stringify(['SMARTPHONE', 'TABLET']),
      specificBrand: null,
      specificModel: null,
      priceVariations: null,
      popularity: null,
      icon: '🔌',
      isActive: true
    }
  ];
  await prisma.repairService.createMany({ data: repairServicesData });

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`  - ${users.length} users`)
  console.log(`  - ${customers.length} customers`)
  console.log(`  - ${devices.length} devices`)
  console.log(`  - ${parts.length} parts`)
  console.log(`  - ${accessories.length} accessories`)
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
