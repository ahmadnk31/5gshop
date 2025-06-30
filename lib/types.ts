export interface Repair {
  id: string;
  customer: Customer;
  device: Device;
  issue: string;
  description: string;
  status: RepairStatus;
  priority: Priority;
  createdAt: string;
  estimatedCompletion: string;
  completedAt?: string;
  cost: number;
  parts: Part[];
  notes: string[];
  assignedTechnician?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  totalRepairs: number;
}

export interface Device {
  id: string;
  type: DeviceType;
  brand: string;
  model: string;
  order: number;
  series?: string | null;
  serialNumber?: string;
  purchaseDate?: string | null;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceData {
  type: DeviceType;
  brand: string;
  model: string;
  order?: number;
  series?: string | null;
  serialNumber?: string;
  purchaseDate?: string | null;
  imageUrl?: string;
  description?: string;
}
export interface Part {
  id: string;
  name: string;
  sku: string;
  cost: number;
  supplier: string;
  inStock: number;
  minStock: number;
  imageUrl?: string;
  description?: string;
  deviceModel?: string | null;  // Compatible device model for exact matching
  deviceType?: string | null;   // Compatible device type for broader matching
  quality?: string | null;      // e.g. "OEM", "Original", etc.
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface Quote {
  id: string;
  customer: Customer | null;
  device: Device | null;
  issues: string[];
  description: string;
  estimatedCost: number;
  estimatedTime: string;
  status: QuoteStatus;
  createdAt: string;
  expiresAt: string;
  urgency: Priority;
  adminNotes?: string;
}

export type RepairStatus = 
  | 'PENDING'
  | 'DIAGNOSED'
  | 'IN_PROGRESS'
  | 'WAITING_PARTS'
  | 'COMPLETED'
  | 'DELIVERED'
  | 'CANCELLED';

export type QuoteStatus = 
  | 'PENDING'
  | 'SENT'
  | 'RESPONDED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type DeviceType = 
  | 'SMARTPHONE'
  | 'TABLET'
  | 'LAPTOP'
  | 'SMARTWATCH'
  | 'DESKTOP'
  | 'GAMING_CONSOLE'
  | 'OTHER';

export type AccessoryCategory = 
  | 'CASE'
  | 'CHARGER'
  | 'CABLE'
  | 'HEADPHONES'
  | 'STAND'
  | 'SCREEN_PROTECTOR'
  | 'KEYBOARD'
  | 'MOUSE'
  | 'STYLUS'
  | 'MOUNT'
  | 'OTHER';

export interface Accessory {
  id: string;
  name: string;
  category: AccessoryCategory;
  brand: string;
  model?: string;
  price: number;
  inStock: number;
  minStock: number;
  description?: string;
  imageUrl?: string;
  compatibility?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRepairs: number;
  pendingRepairs: number;
  completedRepairs: number;
  totalRevenue: number;
  averageRepairTime: number;
  customerSatisfaction: number;
  lowStockParts: number;
  totalCustomers: number;
  activeQuotes: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
  createdAt: string;
  updatedAt: string;
}

export interface RepairService {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  estimatedTime: number; // in minutes
  deviceTypes: DeviceType[];
  specificBrand?: string | null; // null = all brands, "Apple" = only Apple devices
  specificModel?: string | null; // null = all models, "iPhone 15 Pro" = only this model
  priceVariations?: Record<string, number> | null; // Model-specific pricing {"iPhone 15 Pro": 120}
  popularity?: "Most Popular" | "Popular" | null;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepairData {
  customerId: string;
  deviceId?: string; // Optional, will be created if not provided
  issue: string;
  description: string;
  status: RepairStatus;
  priority: Priority;
  cost: number;
  estimatedCompletion: string;
  assignedTechnician?: string;
  // Optional device data for creating a new device
  deviceData?: CreateDeviceData;
  // Optional file attachments
  attachments?: Array<{ url: string; key: string }>;
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
}

export interface CreateDeviceData {
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate?: string | null;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceType: string;
  device?: string;
  message: string;
  status: 'new' | 'responded' | 'resolved';
  adminNotes?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}
