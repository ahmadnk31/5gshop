"use server";

import { unstable_cache } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { DeviceType, RepairService } from "@/lib/types";

export async function getRepairServices(): Promise<RepairService[]> {
  try {
    // Cache for 5 minutes to improve TTFB
    const getCachedServices = unstable_cache(
      async () => await DatabaseService.getRepairServices(),
      ['repair-services-all'],
      { revalidate: 300, tags: ['repair-services'] }
    );
    return await getCachedServices();
  } catch (error) {
    console.error("Failed to get repair services:", error);
    throw new Error("Failed to get repair services");
  }
}

export async function getRepairServicesForDevice(deviceType: DeviceType, brand?: string, model?: string): Promise<RepairService[]> {
  try {
    return await DatabaseService.getRepairServicesForModel(deviceType, brand, model);
  } catch (error) {
    console.error("Failed to get repair services for device:", error);
    throw new Error("Failed to get repair services for device");
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
}): Promise<RepairService> {
  try {
    const service = await DatabaseService.createRepairService(data);
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
}): Promise<RepairService> {
  try {
    const service = await DatabaseService.updateRepairService(serviceId, data);
    return service;
  } catch (error) {
    console.error("Failed to update repair service:", error);
    throw new Error("Failed to update repair service");
  }
}

export async function deleteRepairService(serviceId: string): Promise<void> {
  try {
    await DatabaseService.deleteRepairService(serviceId);
  } catch (error) {
    console.error("Failed to delete repair service:", error);
    throw new Error("Failed to delete repair service");
  }
}
