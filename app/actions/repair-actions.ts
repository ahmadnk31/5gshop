"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { CreateRepairData, RepairStatus } from "@/lib/types";

export async function getRepairs() {
  try {
    return await DatabaseService.getAllRepairsSimple();
  } catch (error) {
    console.error("Failed to get repairs:", error);
    throw new Error("Failed to get repairs");
  }
}

export async function createRepair(data: CreateRepairData) {
  try {
    let deviceId = data.deviceId;
    
    // Create device if deviceData is provided and no deviceId
    if (!deviceId && data.deviceData) {
      const device = await DatabaseService.createDevice(data.deviceData);
      deviceId = device.id;
    }
    
    if (!deviceId) {
      throw new Error("Device ID is required or device data must be provided");
    }

    const repairData = {
      customerId: data.customerId,
      deviceId,
      issue: data.issue,
      description: data.description,
      status: data.status,
      priority: data.priority,
      cost: data.cost,
      estimatedCompletion: data.estimatedCompletion,
      assignedTechnician: data.assignedTechnician,
    };

    const repair = await DatabaseService.createRepair(repairData);
    revalidatePath("/admin");
    return repair;
  } catch (error) {
    console.error("Failed to create repair:", error);
    throw new Error("Failed to create repair");
  }
}

export async function updateRepairStatus(repairId: string, status: RepairStatus) {
  try {
    const repair = await DatabaseService.updateRepair(repairId, { status });
    revalidatePath("/admin");
    return repair;
  } catch (error) {
    console.error("Failed to update repair status:", error);
    throw new Error("Failed to update repair status");
  }
}

export async function updateRepair(repairId: string, data: Partial<any>) {
  try {
    const repair = await DatabaseService.updateRepair(repairId, data);
    revalidatePath("/admin");
    return repair;
  } catch (error) {
    console.error("Failed to update repair:", error);
    throw new Error("Failed to update repair");
  }
}

export async function deleteRepair(repairId: string) {
  try {
    await DatabaseService.deleteRepair(repairId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete repair:", error);
    throw new Error("Failed to delete repair");
  }
}

export async function addRepairNote(repairId: string, note: string) {
  try {
    await DatabaseService.addRepairNote(repairId, note);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to add repair note:", error);
    throw new Error("Failed to add repair note");
  }
}
