import { PrismaClient } from '@prisma/client'
import { Customer, Device, Part, Repair, Quote, User, Accessory, Contact, RepairService, CreateRepairData, CreateCustomerData, CreateDeviceData, DeviceType, RepairStatus, AccessoryCategory } from './types'

// Global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Database service functions
export class DatabaseService {
  // Customer operations
  static async getCustomers(params?: PaginationParams): Promise<PaginatedResult<Customer>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {}

    const customers = await prisma.customer.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalItems = await prisma.customer.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: customers.map(DatabaseService.mapCustomer),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const customer = await prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    })
    return DatabaseService.mapCustomer(customer)
  }
  static async addRepairNote(repairId: string, note: string): Promise<Repair> {
    const repair = await prisma.repair.update({
      where: { id: repairId },
      data: {
        repairNotes: {
          create: {
            note,
          },
        },
      },
      include: {
        customer: true,
        device: true,
        repairParts: {
          include: {
            part: true,
          },
        },
        repairNotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return DatabaseService.mapRepair(repair)
  }
  static async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    })
    return DatabaseService.mapCustomer(customer)
  }

  static async deleteCustomer(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    })
  }

  // Device operations
  static async getDevices(params?: PaginationParams): Promise<PaginatedResult<Device>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {}

    const devices = await prisma.device.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalItems = await prisma.device.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: devices.map(DatabaseService.mapDevice),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async createDevice(data: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>): Promise<Device> {
    const device = await prisma.device.create({
      data: {
        type: data.type as any,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        imageUrl: data.imageUrl,
        description: data.description,
      },
    })
    return DatabaseService.mapDevice(device)
  }

  // Part operations
  static async getParts(params?: PaginationParams): Promise<PaginatedResult<Part>> {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = params || {}

    const parts = await prisma.part.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalItems = await prisma.part.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: parts.map(DatabaseService.mapPart),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async createPart(data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>): Promise<Part> {
    const part = await prisma.part.create({
      data: {
        name: data.name,
        sku: data.sku,
        cost: data.cost,
        supplier: data.supplier,
        inStock: data.inStock,
        minStock: data.minStock,
        imageUrl: data.imageUrl,
        description: data.description,
        deviceModel: data.deviceModel,
        deviceType: data.deviceType,
      },
    })
    return DatabaseService.mapPart(part)
  }

  static async updatePart(id: string, data: Partial<Part>): Promise<Part> {
    const part = await prisma.part.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        cost: data.cost,
        supplier: data.supplier,
        inStock: data.inStock,
        minStock: data.minStock,
        imageUrl: data.imageUrl,
        description: data.description,
        deviceModel: data.deviceModel,
        deviceType: data.deviceType,
      },
    })
    return DatabaseService.mapPart(part)
  }

  static async deletePart(id: string): Promise<void> {
    await prisma.part.delete({
      where: { id },
    })
  }

  // Repair operations
  static async getRepairs(params?: PaginationParams): Promise<PaginatedResult<Repair>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc' } = params || {}

    const repairs = await prisma.repair.findMany({
      include: {
        customer: true,
        device: true,
        repairParts: {
          include: {
            part: true,
          },
        },
        repairNotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })
    const totalItems = await prisma.repair.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: repairs.map(DatabaseService.mapRepair),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async createRepair(data: CreateRepairData): Promise<Repair> {
    const repair = await prisma.repair.create({
      data: {
        customerId: data?.customerId,
        deviceId: data.deviceId || '', // Provide default empty string if undefined
        issue: data.issue,
        description: data.description,
        status: data.status as any,
        priority: data.priority as any,
        cost: data.cost,
        estimatedCompletion: new Date(data.estimatedCompletion),
        assignedTechnician: data.assignedTechnician,
      },
      include: {
        customer: true,
        device: true,
        repairParts: {
          include: {
            part: true,
          },
        },
        repairNotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return DatabaseService.mapRepair(repair)
  }

  static async updateRepair(id: string, data: Partial<Repair>): Promise<Repair> {
    const repair = await prisma.repair.update({
      where: { id },
      data: {
        issue: data.issue,
        description: data.description,
        status: data.status as any,
        priority: data.priority as any,
        cost: data.cost,
        estimatedCompletion: data.estimatedCompletion ? new Date(data.estimatedCompletion) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        assignedTechnician: data.assignedTechnician,
      },
      include: {
        customer: true,
        device: true,
        repairParts: {
          include: {
            part: true,
          },
        },
        repairNotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return DatabaseService.mapRepair(repair)
  }

  static async deleteRepair(id: string): Promise<void> {
    await prisma.repair.delete({
      where: { id },
    })
  }

  // Quote operations
  static async getQuotes(params?: PaginationParams): Promise<PaginatedResult<Quote>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {}

    const quotes = await prisma.quote.findMany({
      include: {
        customer: true,
        device: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })
    const totalItems = await prisma.quote.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: quotes.map(DatabaseService.mapQuote),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async createQuote(data: any): Promise<Quote> {
    const quote = await prisma.quote.create({
      data: {
        customerId: data?.customerId,
        deviceId: data.deviceId,
        issues: JSON.stringify(data.issues),
        description: data.description,
        estimatedCost: data.estimatedCost,
        // Ensure estimatedTime is a string or null
        estimatedTime: data.estimatedTime != null ? String(data.estimatedTime) : null,
        status: data.status,
        urgency: data.urgency,
        expiresAt: new Date(data.expiresAt),
      },
      include: {
        customer: true,
        device: true,
      },
    })
    return DatabaseService.mapQuote(quote)
  }

  static async updateQuote(id: string, data: any): Promise<Quote> {
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: data.status,
        estimatedCost: data.estimatedCost,
        estimatedTime: data.estimatedTime,
        adminNotes: data.adminNotes,
      },
      include: {
        customer: true,
        device: true,
      },
    })
    return DatabaseService.mapQuote(quote)
  }

  static async deleteQuote(id: string): Promise<void> {
    await prisma.quote.delete({
      where: { id },
    })
  }

  // Device management operations
  static async getAllDevices(params?: PaginationParams): Promise<PaginatedResult<Device>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {}

    const devices = await prisma.device.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalItems = await prisma.device.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: devices.map(DatabaseService.mapDevice),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async updateDevice(id: string, data: Partial<Device>): Promise<Device> {
    const device = await prisma.device.update({
      where: { id },
      data: {
        type: data.type as any,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        imageUrl: data.imageUrl,
        description: data.description,
      },
    })
    return DatabaseService.mapDevice(device)
  }

  static async deleteDevice(id: string): Promise<void> {
    await prisma.device.delete({
      where: { id },
    })
  }

  // Enhanced part operations
  static async getAllParts(params?: PaginationParams): Promise<PaginatedResult<Part>> {
    return this.getParts(params)
  }

  static async updatePartStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<Part> {
    const currentPart = await prisma.part.findUnique({ where: { id } })
    if (!currentPart) throw new Error('Part not found')

    let newStock: number
    switch (operation) {
      case 'add':
        newStock = currentPart.inStock + quantity
        break
      case 'subtract':
        newStock = Math.max(0, currentPart.inStock - quantity)
        break
      case 'set':
        newStock = quantity
        break
      default:
        throw new Error('Invalid operation')
    }

    const part = await prisma.part.update({
      where: { id },
      data: { inStock: newStock },
    })
    return DatabaseService.mapPart(part)
  }

  static async getLowStockParts(threshold: number = 5): Promise<Part[]> {
    const parts = await prisma.part.findMany({
      where: {
        inStock: { lte: threshold }
      },
      orderBy: { inStock: 'asc' },
    })
    return parts.map(DatabaseService.mapPart)
  }

  // Brand and model operations
  static async getAllBrands(): Promise<string[]> {
    const devices = await prisma.device.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    })
    return devices.map(d => d.brand)
  }

  static async getModelsByBrandDetailed(brand: string): Promise<Device[]> {
    const devices = await prisma.device.findMany({
      where: { brand },
      orderBy: { model: 'asc' },
    })
    return devices.map(DatabaseService.mapDevice)
  }

  // Service management operations
  static async getRepairServices(): Promise<RepairService[]> {
    const services = await prisma.repairService.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return services.map(DatabaseService.mapRepairService)
  }

  static async getRepairServicesForModel(deviceType: DeviceType, brand?: string, model?: string): Promise<RepairService[]> {
    const services = await prisma.repairService.findMany({
      where: {
        isActive: true,
        deviceTypes: { contains: deviceType },
        OR: [
          // Universal services (no specific brand/model)
          { specificBrand: null, specificModel: null },
          // Brand-specific services that match
          { specificBrand: brand, specificModel: null },
          // Model-specific services that match exactly
          { specificBrand: brand, specificModel: model },
        ]
      },
      orderBy: [
        { popularity: 'desc' },
        { name: 'asc' }
      ],
    })
    return services.map(DatabaseService.mapRepairService)
  }

  static async createRepairService(data: {
    name: string;
    description?: string;
    basePrice: number;
    estimatedTime: number;
    deviceTypes: DeviceType[];
    specificBrand?: string | null;
    specificModel?: string | null;
    priceVariations?: Record<string, number> | null;
    popularity?: "Most Popular" | "Popular" | null;
    icon?: string;
  }): Promise<RepairService> {
    const service = await prisma.repairService.create({
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        estimatedTime: data.estimatedTime,
        deviceTypes: JSON.stringify(data.deviceTypes),
        specificBrand: data.specificBrand,
        specificModel: data.specificModel,
        priceVariations: data.priceVariations ? JSON.stringify(data.priceVariations) : null,
        popularity: data.popularity,
        icon: data.icon,
        isActive: true,
      },
    })
    return DatabaseService.mapRepairService(service)
  }

  static async updateRepairService(id: string, data: {
    name?: string;
    description?: string;
    basePrice?: number;
    estimatedTime?: number;
    deviceTypes?: DeviceType[];
    specificBrand?: string | null;
    specificModel?: string | null;
    priceVariations?: Record<string, number> | null;
    popularity?: "Most Popular" | "Popular" | null;
    icon?: string;
    isActive?: boolean;
  }): Promise<RepairService> {
    const service = await prisma.repairService.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        estimatedTime: data.estimatedTime,
        deviceTypes: data.deviceTypes ? JSON.stringify(data.deviceTypes) : undefined,
        specificBrand: data.specificBrand,
        specificModel: data.specificModel,
        priceVariations: data.priceVariations ? JSON.stringify(data.priceVariations) : undefined,
        popularity: data.popularity,
        icon: data.icon,
        isActive: data.isActive,
      },
    })
    return DatabaseService.mapRepairService(service)
  }

  static async deleteRepairService(id: string): Promise<void> {
    await prisma.repairService.delete({
      where: { id },
    })
  }

  // Accessory management operations
  static async getAccessories(params?: PaginationParams): Promise<PaginatedResult<Accessory>> {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = params || {}

    const accessories = await prisma.accessory.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalItems = await prisma.accessory.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: accessories.map(DatabaseService.mapAccessory),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  }

  static async getAccessoryById(id: string): Promise<Accessory | null> {
    const accessory = await prisma.accessory.findUnique({
      where: { id },
    })
    return accessory ? DatabaseService.mapAccessory(accessory) : null
  }

  static async createAccessory(data: Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Accessory> {
    const accessory = await prisma.accessory.create({
      data: {
        name: data.name,
        category: data.category,
        brand: data.brand,
        model: data.model,
        price: data.price,
        inStock: data.inStock,
        minStock: data.minStock,
        description: data.description,
        imageUrl: data.imageUrl,
        compatibility: data.compatibility,
      },
    })
    return DatabaseService.mapAccessory(accessory)
  }

  static async updateAccessory(id: string, data: Partial<Accessory>): Promise<Accessory> {
    const accessory = await prisma.accessory.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        brand: data.brand,
        model: data.model,
        price: data.price,
        inStock: data.inStock,
        minStock: data.minStock,
        description: data.description,
        imageUrl: data.imageUrl,
        compatibility: data.compatibility,
      },
    })
    return DatabaseService.mapAccessory(accessory)
  }

  static async deleteAccessory(id: string): Promise<void> {
    await prisma.accessory.delete({
      where: { id },
    })
  }

  static async updateAccessoryStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<Accessory> {
    const currentAccessory = await prisma.accessory.findUnique({ where: { id } })
    if (!currentAccessory) throw new Error('Accessory not found')

    let newStock: number
    switch (operation) {
      case 'add':
        newStock = currentAccessory.inStock + quantity
        break
      case 'subtract':
        newStock = Math.max(0, currentAccessory.inStock - quantity)
        break
      case 'set':
        newStock = quantity
        break
      default:
        throw new Error('Invalid operation')
    }

    const accessory = await prisma.accessory.update({
      where: { id },
      data: { inStock: newStock },
    })
    return DatabaseService.mapAccessory(accessory)
  }

  static async getLowStockAccessories(threshold: number = 5): Promise<Accessory[]> {
    const accessories = await prisma.accessory.findMany({
      where: {
        inStock: { lte: threshold }
      },
      orderBy: { inStock: 'asc' },
    })
    return accessories.map(DatabaseService.mapAccessory)
  }

  // Simple (non-paginated) accessory method for frontend use
  static async getAllAccessoriesSimple(): Promise<Accessory[]> {
    const accessories = await prisma.accessory.findMany({
      orderBy: { name: 'asc' },
    })
    return accessories.map(DatabaseService.mapAccessory)
  }

  static async getAllDevicesSimple(): Promise<Device[]> {
    const devices = await prisma.device.findMany({
      orderBy: [{ brand: 'asc' }, { model: 'asc' }],
    })
    return devices.map(DatabaseService.mapDevice)
  }

  static async getAllPartsSimple(): Promise<Part[]> {
    const parts = await prisma.part.findMany({
      orderBy: { name: 'asc' },
    })
    return parts.map(DatabaseService.mapPart)
  }

  static async getAllContactsSimple(): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return contacts.map(DatabaseService.mapContact)
  }

  static async getAllRepairsSimple(): Promise<Repair[]> {
    const repairs = await prisma.repair.findMany({
      include: {
        customer: true,
        device: true,
        repairParts: {
          include: {
            part: true,
          },
        },
        repairNotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return repairs.map(DatabaseService.mapRepair)
  }

  static async getAllCustomersSimple(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      orderBy: { lastName: 'asc' },
    })
    return customers.map(DatabaseService.mapCustomer)
  }

  static async getAllQuotesSimple(): Promise<Quote[]> {
    const quotes = await prisma.quote.findMany({
      include: {
        customer: true,
        device: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return quotes.map(DatabaseService.mapQuote)
  }

  static async getAllRepairs(): Promise<Repair[]> {
    const repairs = await prisma.repair.findMany({
      include: {
        customer: true,
        device: true,
        repairParts: {
          include: {
            part: true,
          },
        },
        repairNotes: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return repairs.map(DatabaseService.mapRepair)
  }

  static async getAllCustomers(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      orderBy: { lastName: 'asc' },
    })
    return customers.map(DatabaseService.mapCustomer)
  }

  static async getAllQuotes(): Promise<Quote[]> {
    const quotes = await prisma.quote.findMany({
      include: {
        customer: true,
        device: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return quotes.map(DatabaseService.mapQuote)
  }

  // Contact operations
  static async createContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    serviceType: string;
    device?: string;
    message: string;
    status: 'new' | 'responded' | 'resolved';
    createdAt: Date;
  }) {
    const contact = await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType,
        device: data.device,
        message: data.message,
        status: data.status,
        createdAt: data.createdAt,
      },
    });
    return DatabaseService.mapContact(contact);
  }

  static async getContacts(params?: PaginationParams) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {}

    const contacts = await prisma.contact.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalItems = await prisma.contact.count()
    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: contacts.map(DatabaseService.mapContact),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getContactById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    return contact ? DatabaseService.mapContact(contact) : null;
  }

  static async updateContact(id: string, data: {
    status?: 'new' | 'responded' | 'resolved';
    adminNotes?: string;
    respondedAt?: Date;
  }) {
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
        respondedAt: data.respondedAt,
      },
    });
    return DatabaseService.mapContact(contact);
  }

  static async deleteContact(id: string) {
    await prisma.contact.delete({
      where: { id },
    });
  }

  // Analytics
  static async getAnalytics() {
    const [
      totalRepairs,
      pendingRepairs,
      completedRepairs,
      totalRevenue,
    ] = await Promise.all([
      prisma.repair.count(),
      prisma.repair.count({ where: { status: 'PENDING' } }),
      prisma.repair.count({ where: { status: 'COMPLETED' } }),
      prisma.repair.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { cost: true },
      }),
    ])

    // Get low stock parts by fetching all parts and comparing inStock <= minStock
    const allParts = await prisma.part.findMany({
      select: {
        inStock: true,
        minStock: true,
      },
    })
    
    const lowStockParts = allParts.filter(part => part.inStock <= part.minStock).length

    return {
      totalRepairs,
      pendingRepairs,
      completedRepairs,
      lowStockParts,
      totalRevenue: totalRevenue._sum.cost || 0,
    }
  }

  // Paginated accessory operations
  static async getAccessoriesPaginated(params: PaginationParams = {}): Promise<PaginatedResult<Accessory>> {
    const { page = 1, limit = 12, sortBy = 'name', sortOrder = 'asc' } = params;
    const skip = (page - 1) * limit;

    const [accessories, totalCount] = await Promise.all([
      prisma.accessory.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.accessory.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: accessories.map(DatabaseService.mapAccessory),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getAccessoriesWithFiltersPaginated(params: PaginationParams & {
    category?: AccessoryCategory;
    search?: string;
    inStockOnly?: boolean;
  } = {}): Promise<PaginatedResult<Accessory>> {
    const { 
      page = 1, 
      limit = 12, 
      sortBy = 'name', 
      sortOrder = 'asc',
      category,
      search,
      inStockOnly = true 
    } = params;
    const skip = (page - 1) * limit;

    console.log('DatabaseService.getAccessoriesWithFiltersPaginated called with:', {
      page, limit, sortBy, sortOrder, category, search, inStockOnly
    });

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (inStockOnly) {
      where.inStock = { gt: 0 };
    }

    console.log('Prisma where clause:', where);

    try {
      const [accessories, totalCount] = await Promise.all([
        prisma.accessory.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.accessory.count({ where }),
      ]);

      console.log('Prisma query successful:', accessories.length, 'accessories found, total:', totalCount);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: accessories.map(DatabaseService.mapAccessory),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error('Prisma query failed:', error);
      throw error;
    }
  }

  // Paginated repair operations
  static async getRepairsPaginated(params: PaginationParams & {
    status?: RepairStatus | 'all';
    search?: string;
  } = {}): Promise<PaginatedResult<Repair>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status,
      search 
    } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { device: { contains: search, mode: 'insensitive' } },
        { issue: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [repairs, totalCount] = await Promise.all([
      prisma.repair.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.repair.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: repairs.map(DatabaseService.mapRepair),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Paginated customer operations
  static async getCustomersPaginated(params: PaginationParams & {
    search?: string;
  } = {}): Promise<PaginatedResult<Customer>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'lastName', 
      sortOrder = 'asc',
      search 
    } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.customer.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: customers.map(DatabaseService.mapCustomer),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Paginated contact operations
  static async getContactsPaginated(params: PaginationParams & {
    status?: 'new' | 'responded' | 'resolved' | 'all';
  } = {}): Promise<PaginatedResult<any>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status 
    } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    const [contacts, totalCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.contact.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: contacts.map(DatabaseService.mapContact),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Mapping functions to convert Prisma types to frontend types
  private static mapCustomer(customer: any): Customer {
    if (!customer) {
      throw new Error('Customer data is required');
    }
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      totalRepairs: customer.repairs?.length || 0,
    }
  }

  private static mapCustomerNullable(customer: any): Customer | null {
    if (!customer) {
      return null;
    }
    return DatabaseService.mapCustomer(customer);
  }

  private static mapDevice(device: any): Device {
    return {
      id: device.id,
      type: device.type,
      brand: device.brand,
      model: device.model,
      serialNumber: device.serialNumber,
      purchaseDate: device.purchaseDate?.toISOString(),
      imageUrl: device.imageUrl,
      description: device.description,
      createdAt: device.createdAt.toISOString(),
      updatedAt: device.updatedAt.toISOString(),
    }
  }

  private static mapDeviceNullable(device: any): Device | null {
    if (!device) {
      return null;
    }
    return DatabaseService.mapDevice(device);
  }

  private static mapPart(part: any): Part {
    return {
      id: part.id,
      name: part.name,
      sku: part.sku,
      cost: part.cost,
      supplier: part.supplier,
      inStock: part.inStock,
      minStock: part.minStock,
      imageUrl: part.imageUrl,
      description: part.description,
      deviceModel: part.deviceModel,
      deviceType: part.deviceType,
      createdAt: part.createdAt.toISOString(),
      updatedAt: part.updatedAt.toISOString(),
    }
  }

  private static mapRepair(repair: any): Repair {
    return {
      id: repair.id,
      issue: repair.issue,
      description: repair.description,
      status: repair.status,
      priority: repair.priority,
      cost: repair.cost,
      estimatedCompletion: repair.estimatedCompletion.toISOString(),
      completedAt: repair.completedAt?.toISOString(),
      assignedTechnician: repair.assignedTechnician,
      customer: DatabaseService.mapCustomer(repair.customer),
      device: DatabaseService.mapDevice(repair.device),
      parts: repair.repairParts.map((rp: any) => DatabaseService.mapPart(rp.part)),
      notes: repair.repairNotes.map((note: any) => note.note),
      createdAt: repair.createdAt.toISOString(),
    }
  }

  private static mapQuote(quote: any): Quote {
    return {
      id: quote.id,
      issues: JSON.parse(quote.issues),
      description: quote.description,
      estimatedCost: quote.estimatedCost,
      estimatedTime: quote.estimatedTime,
      status: quote.status,
      urgency: quote.urgency,
      adminNotes: quote.adminNotes,
      expiresAt: quote.expiresAt.toISOString(),
      customer: DatabaseService.mapCustomerNullable(quote.customer),
      device: DatabaseService.mapDeviceNullable(quote.device),
      createdAt: quote.createdAt.toISOString(),
    }
  }

  private static mapAccessory(accessory: any): Accessory {
    return {
      id: accessory.id,
      name: accessory.name,
      category: accessory.category,
      brand: accessory.brand,
      model: accessory.model,
      price: accessory.price,
      inStock: accessory.inStock,
      minStock: accessory.minStock,
      description: accessory.description,
      imageUrl: accessory.imageUrl,
      compatibility: accessory.compatibility,
      createdAt: accessory.createdAt.toISOString(),
      updatedAt: accessory.updatedAt.toISOString(),
    }
  }

  private static mapContact(contact: any): Contact {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      serviceType: contact.serviceType,
      device: contact.device,
      message: contact.message,
      status: contact.status,
      adminNotes: contact.adminNotes,
      respondedAt: contact.respondedAt?.toISOString(),
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
    };
  }

  private static mapRepairService(service: any): RepairService {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      estimatedTime: service.estimatedTime,
      deviceTypes: JSON.parse(service.deviceTypes),
      specificBrand: service.specificBrand,
      specificModel: service.specificModel,
      priceVariations: service.priceVariations ? JSON.parse(service.priceVariations) : null,
      popularity: service.popularity,
      icon: service.icon,
      isActive: service.isActive,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    }
  }
}
