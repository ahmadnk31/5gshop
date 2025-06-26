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
    // iPhone Series (Latest to Oldest)
    prisma.device.create({
      data: {
        type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 16 Pro Max', serialNumber: 'IPHONE1600004', purchaseDate: new Date('2024-09-20'),
      },
    }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 16 Pro', serialNumber: 'IPHONE1600003', purchaseDate: new Date('2024-09-20'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 16 Plus', serialNumber: 'IPHONE1600002', purchaseDate: new Date('2024-09-20'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 16', serialNumber: 'IPHONE1600001', purchaseDate: new Date('2024-09-20'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 15 Pro Max', serialNumber: 'IPHONE1500004', purchaseDate: new Date('2023-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 15 Pro', serialNumber: 'IPHONE1500003', purchaseDate: new Date('2023-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 15 Plus', serialNumber: 'IPHONE1500002', purchaseDate: new Date('2023-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 15', serialNumber: 'IPHONE1500001', purchaseDate: new Date('2023-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 14 Pro Max', serialNumber: 'IPHONE1400004', purchaseDate: new Date('2022-09-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 14 Pro', serialNumber: 'IPHONE1400003', purchaseDate: new Date('2022-09-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 14 Plus', serialNumber: 'IPHONE1400002', purchaseDate: new Date('2022-10-07'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 14', serialNumber: 'IPHONE1400001', purchaseDate: new Date('2022-09-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 13 Pro Max', serialNumber: 'IPHONE1300004', purchaseDate: new Date('2021-09-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 13 Pro', serialNumber: 'IPHONE1300003', purchaseDate: new Date('2021-09-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 13 Mini', serialNumber: 'IPHONE1300002', purchaseDate: new Date('2021-09-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 13', serialNumber: 'IPHONE1300001', purchaseDate: new Date('2021-09-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12 Pro Max', serialNumber: 'IPHONE1200004', purchaseDate: new Date('2020-11-13'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12 Pro', serialNumber: 'IPHONE1200003', purchaseDate: new Date('2020-10-23'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12 Mini', serialNumber: 'IPHONE1200002', purchaseDate: new Date('2020-11-13'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 12', serialNumber: 'IPHONE1200001', purchaseDate: new Date('2020-10-23'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone SE (2nd generation)', serialNumber: 'IPHONESE20001', purchaseDate: new Date('2020-04-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 11 Pro Max', serialNumber: 'IPHONE1100003', purchaseDate: new Date('2019-09-20'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 11 Pro', serialNumber: 'IPHONE1100002', purchaseDate: new Date('2019-09-20'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 11', serialNumber: 'IPHONE1100001', purchaseDate: new Date('2019-09-20'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone XS Max', serialNumber: 'IPHONEXSMAX01', purchaseDate: new Date('2018-09-21'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone XS', serialNumber: 'IPHONEXS00001', purchaseDate: new Date('2018-09-21'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone XR', serialNumber: 'IPHONEXR00001', purchaseDate: new Date('2018-10-26'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone X', serialNumber: 'IPHONEX000001', purchaseDate: new Date('2017-11-03'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 8 Plus', serialNumber: 'IPHONE8000002', purchaseDate: new Date('2017-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 8', serialNumber: 'IPHONE8000001', purchaseDate: new Date('2017-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 7 Plus', serialNumber: 'IPHONE7000002', purchaseDate: new Date('2016-09-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 7', serialNumber: 'IPHONE7000001', purchaseDate: new Date('2016-09-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone SE (1st generation)', serialNumber: 'IPHONE6000005', purchaseDate: new Date('2016-03-31'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 6s Plus', serialNumber: 'IPHONE6000004', purchaseDate: new Date('2015-09-25'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 6s', serialNumber: 'IPHONE6000003', purchaseDate: new Date('2015-09-25'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 6 Plus', serialNumber: 'IPHONE6000002', purchaseDate: new Date('2014-09-19'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Apple', model: 'iPhone 6', serialNumber: 'IPHONE6000001', purchaseDate: new Date('2014-09-19'), }, }),
    // Samsung Galaxy S Series (Latest to Oldest)
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S23 Ultra', serialNumber: 'S23U-2023-001', purchaseDate: new Date('2023-02-17'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S23+', serialNumber: 'S23P-2023-001', purchaseDate: new Date('2023-02-17'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S23', serialNumber: 'S23-2023-001', purchaseDate: new Date('2023-02-17'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S22 Ultra', serialNumber: 'S22U-2022-001', purchaseDate: new Date('2022-02-25'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S22+', serialNumber: 'S22P-2022-001', purchaseDate: new Date('2022-02-25'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S22', serialNumber: 'S22-2022-001', purchaseDate: new Date('2022-02-25'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S21 Ultra', serialNumber: 'S21U-2021-001', purchaseDate: new Date('2021-01-29'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S21+', serialNumber: 'S21P-2021-001', purchaseDate: new Date('2021-01-29'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S21', serialNumber: 'S21-2021-001', purchaseDate: new Date('2021-01-29'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S20', serialNumber: 'S20-2020-001', purchaseDate: new Date('2020-03-06'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy Note 20', serialNumber: 'N20-2020-001', purchaseDate: new Date('2020-08-21'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy Note 20 Ultra', serialNumber: 'N20U-2020-001', purchaseDate: new Date('2020-08-21'), }, }),
    // More Samsung models (A series, Note series, Z Fold/Flip, and older S series)
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S24 Ultra', serialNumber: 'S24U-2024-001', purchaseDate: new Date('2024-02-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S24+', serialNumber: 'S24P-2024-001', purchaseDate: new Date('2024-02-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S24', serialNumber: 'S24-2024-001', purchaseDate: new Date('2024-02-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy Z Fold5', serialNumber: 'ZFOLD5-2023-001', purchaseDate: new Date('2023-08-11'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy Z Flip5', serialNumber: 'ZFLIP5-2023-001', purchaseDate: new Date('2023-08-11'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A55', serialNumber: 'A55-2024-001', purchaseDate: new Date('2024-03-15'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A54', serialNumber: 'A54-2023-001', purchaseDate: new Date('2023-03-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A53', serialNumber: 'A53-2022-001', purchaseDate: new Date('2022-03-31'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A35', serialNumber: 'A35-2024-001', purchaseDate: new Date('2024-03-15'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A34', serialNumber: 'A34-2023-001', purchaseDate: new Date('2023-03-24'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A33', serialNumber: 'A33-2022-001', purchaseDate: new Date('2022-04-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A23', serialNumber: 'A23-2022-001', purchaseDate: new Date('2022-03-25'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A15', serialNumber: 'A15-2024-001', purchaseDate: new Date('2024-01-15'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy A05s', serialNumber: 'A05S-2023-001', purchaseDate: new Date('2023-09-22'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy Note 10+', serialNumber: 'N10PLUS-2019-001', purchaseDate: new Date('2019-08-23'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy Note 10', serialNumber: 'N10-2019-001', purchaseDate: new Date('2019-08-23'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S10+', serialNumber: 'S10PLUS-2019-001', purchaseDate: new Date('2019-03-08'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S10', serialNumber: 'S10-2019-001', purchaseDate: new Date('2019-03-08'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S9+', serialNumber: 'S9PLUS-2018-001', purchaseDate: new Date('2018-03-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S9', serialNumber: 'S9-2018-001', purchaseDate: new Date('2018-03-16'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S8+', serialNumber: 'S8PLUS-2017-001', purchaseDate: new Date('2017-04-21'), }, }),
    prisma.device.create({ data: { type: 'SMARTPHONE', brand: 'Samsung', model: 'Galaxy S8', serialNumber: 'S8-2017-001', purchaseDate: new Date('2017-04-21'), }, }),
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
    // OnePlus Phones (latest to oldest)
    await createDeviceWithParts({
      brand: 'OnePlus',
      model: 'OnePlus 12',
      serialNumber: 'ONEPLUS12-2024-001',
      releaseDate: new Date('2024-01-23'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 199.99, supplier: 'OnePlus', stock: 5 },
        { name: 'Battery', cost: 49.99, supplier: 'OnePlus', stock: 8 },
      ],
    }),
    await createDeviceWithParts({
      brand: 'OnePlus',
      model: 'OnePlus 11',
      serialNumber: 'ONEPLUS11-2023-001',
      releaseDate: new Date('2023-02-07'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 179.99, supplier: 'OnePlus', stock: 6 },
        { name: 'Battery', cost: 44.99, supplier: 'OnePlus', stock: 7 },
      ],
    }),

    // Google Pixel Phones (latest to oldest)
    await createDeviceWithParts({
      brand: 'Google',
      model: 'Pixel 8 Pro',
      serialNumber: 'PIXEL8PRO-2023-001',
      releaseDate: new Date('2023-10-12'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 209.99, supplier: 'iFixit', stock: 4 },
        { name: 'Battery', cost: 39.99, supplier: 'iFixit', stock: 8 },
      ],
    }),
    await createDeviceWithParts({
      brand: 'Google',
      model: 'Pixel 7',
      serialNumber: 'PIXEL7-2022-001',
      releaseDate: new Date('2022-10-13'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 179.99, supplier: 'iFixit', stock: 5 },
        { name: 'Battery', cost: 34.99, supplier: 'iFixit', stock: 7 },
      ],
    }),
    await createDeviceWithParts({
      brand: 'Google',
      model: 'Pixel 6 Pro',
      serialNumber: 'PIXEL6PRO-2021-001',
      releaseDate: new Date('2021-10-28'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 159.99, supplier: 'iFixit', stock: 6 },
        { name: 'Battery', cost: 29.99, supplier: 'iFixit', stock: 6 },
      ],
    }),

    // Xiaomi Phones (latest to oldest)
    await createDeviceWithParts({
      brand: 'Xiaomi',
      model: 'Xiaomi 14 Pro',
      serialNumber: 'XIAOMI14PRO-2023-001',
      releaseDate: new Date('2023-10-26'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 189.99, supplier: 'Xiaomi', stock: 5 },
        { name: 'Battery', cost: 39.99, supplier: 'Xiaomi', stock: 8 },
      ],
    }),
    await createDeviceWithParts({
      brand: 'Xiaomi',
      model: 'Redmi Note 13',
      serialNumber: 'REDMINOTE13-2024-001',
      releaseDate: new Date('2024-01-10'),
      type: 'SMARTPHONE',
      parts: [
        { name: 'Screen', cost: 129.99, supplier: 'Xiaomi', stock: 7 },
        { name: 'Battery', cost: 29.99, supplier: 'Xiaomi', stock: 10 },
      ],
    }),
  ]) // End of Promise.all for direct prisma.device.create calls

  // Add other devices (laptops, tablets, smartwatches, consoles) with their parts using the helper
  await createDeviceWithParts({
    brand: 'Apple',
    model: 'MacBook Pro 13"',
    serialNumber: 'MBP13-2023-001',
    releaseDate: new Date('2023-02-10'),
    type: 'LAPTOP',
    parts: [
      { name: 'Screen', cost: 199.99, supplier: 'iFixit', stock: 4 },
      { name: 'Battery', cost: 99.99, supplier: 'iFixit', stock: 7 },
      { name: 'SSD', cost: 129.99, supplier: 'iFixit', stock: 5 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Dell',
    model: 'XPS 13',
    serialNumber: 'XPS13-2022-001',
    releaseDate: new Date('2022-08-10'),
    type: 'LAPTOP',
    parts: [
      { name: 'Keyboard', cost: 45.99, supplier: 'Dell Parts', stock: 12 },
      { name: 'Battery', cost: 69.99, supplier: 'Dell Parts', stock: 8 },
      { name: 'Touchpad', cost: 39.99, supplier: 'Dell Parts', stock: 6 },
    ],
  });
  await createDeviceWithParts({
    brand: 'HP',
    model: 'Spectre x360',
    serialNumber: 'HPX360-2023-001',
    releaseDate: new Date('2023-01-15'),
    type: 'LAPTOP',
    parts: [
      { name: 'Screen', cost: 119.99, supplier: 'HP Parts', stock: 5 },
      { name: 'Battery', cost: 59.99, supplier: 'HP Parts', stock: 7 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    serialNumber: 'TPX1-2022-001',
    releaseDate: new Date('2022-06-10'),
    type: 'LAPTOP',
    parts: [
      { name: 'Keyboard', cost: 49.99, supplier: 'Lenovo Parts', stock: 6 },
      { name: 'Fan', cost: 29.99, supplier: 'Lenovo Parts', stock: 8 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Apple',
    model: 'iPad Pro 12.9"',
    serialNumber: 'IPADPRO129-2023-001',
    releaseDate: new Date('2023-05-02'),
    type: 'TABLET',
    parts: [
      { name: 'Digitizer', cost: 149.99, supplier: 'iFixit', stock: 6 },
      { name: 'Battery', cost: 79.99, supplier: 'iFixit', stock: 5 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Samsung',
    model: 'Galaxy Tab S8',
    serialNumber: 'GTABS8-2022-001',
    releaseDate: new Date('2022-03-01'),
    type: 'TABLET',
    parts: [
      { name: 'Screen', cost: 99.99, supplier: 'Mobile Defender', stock: 6 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Microsoft',
    model: 'Surface Pro 9',
    serialNumber: 'SURFPRO9-2023-001',
    releaseDate: new Date('2023-04-20'),
    type: 'TABLET',
    parts: [
      { name: 'Kickstand', cost: 39.99, supplier: 'Microsoft Parts', stock: 4 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Apple',
    model: 'Watch Series 8',
    serialNumber: 'AW8-2023-001',
    releaseDate: new Date('2023-07-14'),
    type: 'SMARTWATCH',
    parts: [
      { name: 'Screen', cost: 49.99, supplier: 'WatchKit', stock: 10 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Samsung',
    model: 'Galaxy Watch 6',
    serialNumber: 'GW6-2023-001',
    releaseDate: new Date('2023-08-01'),
    type: 'SMARTWATCH',
    parts: [
      { name: 'Battery', cost: 24.99, supplier: 'Mobile Defender', stock: 8 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Garmin',
    model: 'Fenix 7',
    serialNumber: 'FENIX7-2022-001',
    releaseDate: new Date('2022-11-11'),
    type: 'SMARTWATCH',
    parts: [
      { name: 'Strap', cost: 19.99, supplier: 'Garmin', stock: 12 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Sony',
    model: 'PlayStation 5',
    serialNumber: 'PS5-2022-001',
    releaseDate: new Date('2022-11-15'),
    type: 'GAMING_CONSOLE',
    parts: [
      { name: 'Fan', cost: 29.99, supplier: 'Console Parts', stock: 7 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Microsoft',
    model: 'Xbox Series X',
    serialNumber: 'XBOXX-2021-001',
    releaseDate: new Date('2021-11-10'),
    type: 'GAMING_CONSOLE',
    parts: [
      { name: 'Power Supply', cost: 59.99, supplier: 'Console Parts', stock: 5 },
    ],
  });
  await createDeviceWithParts({
    brand: 'Nintendo',
    model: 'Switch OLED',
    serialNumber: 'SWITCHOLED-2022-001',
    releaseDate: new Date('2022-10-08'),
    type: 'GAMING_CONSOLE',
    parts: [
      { name: 'Joy-Con', cost: 39.99, supplier: 'Nintendo', stock: 10 },
    ],
  });

  // --- ACCESSORIES SEED DATA ---
  await prisma.accessory.createMany({
    data: [
      {
        name: 'Apple 20W USB-C Power Adapter',
        category: 'CHARGER',
        brand: 'Apple',
        price: 24.99,
        inStock: 30,
        minStock: 5,
        description: 'Fast charge your iPhone and iPad with this compact and efficient USB-C power adapter.',
        imageUrl: '/accessories/apple-20w-usb-c.jpg',
        compatibility: 'iPhone, iPad, AirPods',
      },
      {
        name: 'Samsung 25W Super Fast Charger',
        category: 'CHARGER',
        brand: 'Samsung',
        price: 19.99,
        inStock: 25,
        minStock: 5,
        description: 'Super fast charging for Samsung Galaxy devices.',
        imageUrl: '/accessories/samsung-25w-charger.jpg',
        compatibility: 'Samsung Galaxy S/Note/A series',
      },
      {
        name: 'Anker Powerline+ USB-C to USB-C Cable (6ft)',
        category: 'CABLE',
        brand: 'Anker',
        price: 12.99,
        inStock: 50,
        minStock: 10,
        description: 'Durable and fast-charging USB-C cable for all USB-C devices.',
        imageUrl: '/accessories/anker-usb-c-cable.jpg',
        compatibility: 'USB-C devices',
      },
      {
        name: 'Spigen Ultra Hybrid Case for iPhone 15',
        category: 'CASE',
        brand: 'Spigen',
        price: 16.99,
        inStock: 40,
        minStock: 8,
        description: 'Crystal clear protection for your iPhone 15.',
        imageUrl: '/accessories/spigen-iphone15-case.jpg',
        compatibility: 'iPhone 15',
      },
      {
        name: 'ESR Tempered Glass Screen Protector (3-Pack)',
        category: 'SCREEN_PROTECTOR',
        brand: 'ESR',
        price: 14.99,
        inStock: 60,
        minStock: 12,
        description: 'Scratch-resistant tempered glass for iPhone 14/15.',
        imageUrl: '/accessories/esr-glass-3pack.jpg',
        compatibility: 'iPhone 14, iPhone 15',
      },
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        category: 'HEADPHONES',
        brand: 'Sony',
        price: 349.99,
        inStock: 10,
        minStock: 2,
        description: 'Industry-leading noise canceling headphones.',
        imageUrl: '/accessories/sony-xm5.jpg',
        compatibility: 'Bluetooth devices',
      },
      {
        name: 'Logitech K380 Bluetooth Keyboard',
        category: 'KEYBOARD',
        brand: 'Logitech',
        price: 39.99,
        inStock: 20,
        minStock: 4,
        description: 'Compact multi-device Bluetooth keyboard.',
        imageUrl: '/accessories/logitech-k380.jpg',
        compatibility: 'Windows, Mac, iOS, Android',
      },
      {
        name: 'Apple Magic Mouse 2',
        category: 'MOUSE',
        brand: 'Apple',
        price: 79.99,
        inStock: 15,
        minStock: 3,
        description: 'Wireless and rechargeable mouse for Mac.',
        imageUrl: '/accessories/apple-magic-mouse.jpg',
        compatibility: 'Mac',
      },
      {
        name: 'Baseus Laptop Stand',
        category: 'STAND',
        brand: 'Baseus',
        price: 29.99,
        inStock: 18,
        minStock: 3,
        description: 'Adjustable aluminum stand for laptops and tablets.',
        imageUrl: '/accessories/baseus-stand.jpg',
        compatibility: 'Laptops, Tablets',
      },
      {
        name: 'Ugreen Car Mount',
        category: 'MOUNT',
        brand: 'Ugreen',
        price: 13.99,
        inStock: 22,
        minStock: 4,
        description: 'Universal car mount for smartphones.',
        imageUrl: '/accessories/ugreen-car-mount.jpg',
        compatibility: 'Smartphones',
      },
      {
        name: 'Apple Pencil (2nd Generation)',
        category: 'STYLUS',
        brand: 'Apple',
        price: 129.99,
        inStock: 8,
        minStock: 2,
        description: 'Precision stylus for iPad Pro and iPad Air.',
        imageUrl: '/accessories/apple-pencil-2.jpg',
        compatibility: 'iPad Pro, iPad Air',
      },
      {
        name: 'Universal Cleaning Kit',
        category: 'OTHER',
        brand: 'CleanMaster',
        price: 9.99,
        inStock: 35,
        minStock: 7,
        description: 'Cleaning kit for screens and devices.',
        imageUrl: '/accessories/cleaning-kit.jpg',
        compatibility: 'All devices',
      },
    ],
  });

  // --- PARTS SEED DATA ---
  // Add some parts for a few devices
  await prisma.part.createMany({
    data: [
      {
        name: 'iPhone 15 Pro Max Screen',
        sku: 'IPH15PM-SCREEN-001',
        cost: 249.99,
        supplier: 'Apple',
        inStock: 5,
        minStock: 1,
        deviceModel: 'iPhone 15 Pro Max',
        deviceType: 'SMARTPHONE',
        quality: 'OEM',
      },
      {
        name: 'iPhone 15 Pro Max Battery',
        sku: 'IPH15PM-BATT-001',
        cost: 89.99,
        supplier: 'Apple',
        inStock: 7,
        minStock: 2,
        deviceModel: 'iPhone 15 Pro Max',
        deviceType: 'SMARTPHONE',
        quality: 'OEM',
      },
      {
        name: 'Galaxy S24 Ultra Screen',
        sku: 'GS24U-SCREEN-001',
        cost: 229.99,
        supplier: 'Samsung',
        inStock: 4,
        minStock: 1,
        deviceModel: 'Galaxy S24 Ultra',
        deviceType: 'SMARTPHONE',
        quality: 'OEM',
      },
      {
        name: 'Galaxy S24 Ultra Battery',
        sku: 'GS24U-BATT-001',
        cost: 79.99,
        supplier: 'Samsung',
        inStock: 6,
        minStock: 2,
        deviceModel: 'Galaxy S24 Ultra',
        deviceType: 'SMARTPHONE',
        quality: 'OEM',
      },
      {
        name: 'MacBook Pro 13" SSD',
        sku: 'MBP13-SSD-001',
        cost: 129.99,
        supplier: 'iFixit',
        inStock: 3,
        minStock: 1,
        deviceModel: 'MacBook Pro 13"',
        deviceType: 'LAPTOP',
        quality: 'OEM',
      },
      {
        name: 'Surface Pro 9 Kickstand',
        sku: 'SP9-KICK-001',
        cost: 39.99,
        supplier: 'Microsoft',
        inStock: 2,
        minStock: 1,
        deviceModel: 'Surface Pro 9',
        deviceType: 'TABLET',
        quality: 'OEM',
      },
    ],
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })