"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { Accessory, AccessoryCategory } from "@/lib/types";

// Accessory Management
export async function getAccessories() {
  try {
    return await DatabaseService.getAllAccessoriesSimple();
  } catch (error) {
    console.error("Failed to get accessories:", error);
    throw new Error("Failed to get accessories");
  }
}

export async function getAccessoryById(id: string) {
  try {
    return await DatabaseService.getAccessoryById(id);
  } catch (error) {
    console.error("Failed to get accessory:", error);
    throw new Error("Failed to get accessory");
  }
}

export async function createAccessory(data: {
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
}) {
  try {
    const accessory = await DatabaseService.createAccessory(data);
    revalidatePath("/admin");
    return accessory;
  } catch (error) {
    console.error("Failed to create accessory:", error);
    throw new Error("Failed to create accessory");
  }
}

export async function updateAccessory(accessoryId: string, data: {
  name?: string;
  category?: AccessoryCategory;
  brand?: string;
  model?: string;
  price?: number;
  inStock?: number;
  minStock?: number;
  description?: string;
  imageUrl?: string;
  compatibility?: string;
}) {
  try {
    const accessory = await DatabaseService.updateAccessory(accessoryId, data);
    revalidatePath("/admin");
    return accessory;
  } catch (error) {
    console.error("Failed to update accessory:", error);
    throw new Error("Failed to update accessory");
  }
}

export async function deleteAccessory(accessoryId: string) {
  try {
    await DatabaseService.deleteAccessory(accessoryId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete accessory:", error);
    throw new Error("Failed to delete accessory");
  }
}

export async function updateAccessoryStock(
  accessoryId: string, 
  quantity: number, 
  operation: 'add' | 'subtract' | 'set'
) {
  try {
    const accessory = await DatabaseService.updateAccessoryStock(accessoryId, quantity, operation);
    revalidatePath("/admin");
    return accessory;
  } catch (error) {
    console.error("Failed to update accessory stock:", error);
    throw new Error("Failed to update accessory stock");
  }
}

export async function getLowStockAccessories(threshold: number = 5) {
  try {
    return await DatabaseService.getLowStockAccessories(threshold);
  } catch (error) {
    console.error("Failed to get low stock accessories:", error);
    throw new Error("Failed to get low stock accessories");
  }
}
