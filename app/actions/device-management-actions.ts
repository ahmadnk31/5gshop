"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { DeviceType } from "@/lib/types";

// Device Management
export async function getAllDevices() {
  try {
    return await DatabaseService.getAllDevicesSimple();
  } catch (error) {
    console.error("Failed to get devices:", error);
    throw new Error("Failed to get devices");
  }
}

export async function createDevice(data: {
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate?: string;
}) {
  try {
    const device = await DatabaseService.createDevice(data);
    revalidatePath("/admin");
    return device;
  } catch (error) {
    console.error("Failed to create device:", error);
    throw new Error("Failed to create device");
  }
}

export async function updateDevice(deviceId: string, data: {
  type?: DeviceType;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  imageUrl?: string; // <-- Add imageUrl
  description?: string; // <-- Add description
}) {
  try {
    const device = await DatabaseService.updateDevice(deviceId, data);
    revalidatePath("/admin");
    return device;
  } catch (error) {
    console.error("Failed to update device:", error);
    throw new Error("Failed to update device");
  }
}

export async function deleteDevice(deviceId: string) {
  try {
    await DatabaseService.deleteDevice(deviceId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete device:", error);
    throw new Error("Failed to delete device");
  }
}

export async function getAllDevicesBySerialNumber(order: 'asc' | 'desc' = 'asc') {
  try {
    return await DatabaseService.getAllDevicesBySerialNumber(order);
  } catch (error) {
    console.error("Failed to get devices by serial number:", error);
    throw new Error("Failed to get devices by serial number");
  }
}

// Parts Management
export async function getAllParts() {
  try {
    return await DatabaseService.getAllPartsSimple();
  } catch (error) {
    console.error("Failed to get parts:", error);
    throw new Error("Failed to get parts");
  }
}

export async function createPart(data: {
  name: string;
  sku: string;
  cost: number;
  inStock: number;
  minStock: number;
  supplier: string;
  deviceModel?: string;
  deviceType?: string;
  quality?: string; // Add quality
}) {
  try {
    const part = await DatabaseService.createPart(data);
    revalidatePath("/admin");
    return part;
  } catch (error) {
    console.error("Failed to create part:", error);
    throw new Error("Failed to create part");
  }
}

export async function updatePart(partId: string, data: {
  name?: string;
  sku?: string;
  cost?: number;
  inStock?: number;
  minStock?: number;
  supplier?: string;
  deviceModel?: string;
  deviceType?: string;
  quality?: string; // Add quality
}) {
  try {
    const part = await DatabaseService.updatePart(partId, data);
    revalidatePath("/admin");
    return part;
  } catch (error) {
    console.error("Failed to update part:", error);
    throw new Error("Failed to update part");
  }
}

export async function deletePart(partId: string) {
  try {
    await DatabaseService.deletePart(partId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete part:", error);
    throw new Error("Failed to delete part");
  }
}

// Inventory Management
export async function updatePartStock(partId: string, quantity: number, operation: 'add' | 'subtract' | 'set') {
  try {
    const part = await DatabaseService.updatePartStock(partId, quantity, operation);
    revalidatePath("/admin");
    return part;
  } catch (error) {
    console.error("Failed to update part stock:", error);
    throw new Error("Failed to update part stock");
  }
}

export async function getLowStockParts(threshold?: number) {
  try {
    return await DatabaseService.getLowStockParts(threshold);
  } catch (error) {
    console.error("Failed to get low stock parts:", error);
    throw new Error("Failed to get low stock parts");
  }
}

// Brand and Model Management
export async function getAllBrands() {
  try {
    return await DatabaseService.getAllBrands();
  } catch (error) {
    console.error("Failed to get brands:", error);
    throw new Error("Failed to get brands");
  }
}

export async function getModelsByBrandDetailed(brand: string) {
  try {
    return await DatabaseService.getModelsByBrandDetailed(brand);
  } catch (error) {
    console.error("Failed to get models:", error);
    throw new Error("Failed to get models");
  }
}

// Service Management
export async function getRepairServices() {
  try {
    // Use the new repair services actions
    const { getRepairServices } = await import('./repair-services-actions');
    return await getRepairServices();
  } catch (error) {
    console.error("Failed to get repair services:", error);
    throw new Error("Failed to get repair services");
  }
}

export async function createRepairService(data: {
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
}) {
  try {
    const { createRepairService } = await import('./repair-services-actions');
    const service = await createRepairService(data);
    revalidatePath("/admin");
    return service;
  } catch (error) {
    console.error("Failed to create repair service:", error);
    throw new Error("Failed to create repair service");
  }
}

export async function updateRepairService(serviceId: string, data: {
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
}) {
  try {
    const { updateRepairService } = await import('./repair-services-actions');
    const service = await updateRepairService(serviceId, data);
    revalidatePath("/admin");
    return service;
  } catch (error) {
    console.error("Failed to update repair service:", error);
    throw new Error("Failed to update repair service");
  }
}

export async function deleteRepairService(serviceId: string) {
  try {
    const { deleteRepairService } = await import('./repair-services-actions');
    await deleteRepairService(serviceId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete repair service:", error);
    throw new Error("Failed to delete repair service");
  }
}
export async function getRepairServicesForDevice(deviceType: DeviceType) {
  try {
    const { getRepairServicesForDevice } = await import('./repair-services-actions');
    return await getRepairServicesForDevice(deviceType);
  } catch (error) {
    console.error("Failed to get repair services for device:", error);
    throw new Error("Failed to get repair services for device");
  }
}
