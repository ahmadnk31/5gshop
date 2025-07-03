"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";

export async function getParts() {
  try {
    return await DatabaseService.getParts();
  } catch (error) {
    console.error("Failed to get parts:", error);
    throw new Error("Failed to get parts");
  }
}

export async function createPart(data: any) {
  try {
    const part = await DatabaseService.createPart(data);
    revalidatePath("/admin");
    return part;
  } catch (error) {
    console.error("Failed to create part:", error);
    throw new Error("Failed to create part");
  }
}

export async function updatePart(partId: string, data: any) {
  try {
    const part = await DatabaseService.updatePart(partId, data);
    revalidatePath("/admin");
    return part;
  } catch (error) {
    console.error("Failed to update part:", error);
    throw new Error("Failed to update part");
  }
}

export async function updatePartStock(partId: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set') {
  try {
    const part = await DatabaseService.updatePartStock(partId, quantity, operation);
    revalidatePath("/admin");
    return part;
  } catch (error) {
    console.error("Failed to update part stock:", error);
    throw new Error("Failed to update part stock");
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

export async function getPartById(partId: string) {
  try {
    return await DatabaseService.getPartById(partId);
  } catch (error) {
    console.error("Failed to get part by id:", error);
    throw new Error("Failed to get part by id");
  }
}

export async function getRelatedParts(partId: string, limit: number = 4) {
  try {
    return await DatabaseService.getRelatedParts(partId, limit);
  } catch (error) {
    console.error("Failed to get related parts:", error);
    throw new Error("Failed to get related parts");
  }
}

export async function getFeaturedParts(limit: number = 4, type?: string, brand?: string, model?: string) {
  try {
    return await DatabaseService.getFeaturedParts(limit, type, brand, model);
  } catch (error) {
    console.error("Failed to get featured parts:", error);
    throw new Error("Failed to get featured parts");
  }
}

export async function getPartsByTypeBrandModel(type?: string, _brand?: string, model?: string) {
  try {
    if (!type) throw new Error('type is required');
    const where = {
      OR: [
        model ? { deviceModel: model } : {},
        { deviceType: type, deviceModel: null }
      ]
    };
    if (!model) where.OR = [{ deviceType: type, deviceModel: null }];
    return await DatabaseService.getPartsByFilter(where);
  } catch (error) {
    console.error('Failed to get parts by type, brand, model:', error);
    throw new Error('Failed to get parts by type, brand, model');
  }
}
