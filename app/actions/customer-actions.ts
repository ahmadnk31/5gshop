"use server";

import { revalidatePath } from "next/cache";
import { DatabaseService } from "@/lib/database";
import { CreateCustomerData } from "@/lib/types";

export async function getCustomers() {
  try {
    return await DatabaseService.getAllCustomersSimple();
  } catch (error) {
    console.error("Failed to get customers:", error);
    throw new Error("Failed to get customers");
  }
}

export async function createCustomer(data: CreateCustomerData) {
  try {
    const customer = await DatabaseService.createCustomer(data);
    revalidatePath("/admin");
    return customer;
  } catch (error) {
    console.error("Failed to create customer:", error);
    throw new Error("Failed to create customer");
  }
}

export async function updateCustomer(customerId: string, data: Partial<any>) {
  try {
    const customer = await DatabaseService.updateCustomer(customerId, data);
    revalidatePath("/admin");
    return customer;
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw new Error("Failed to update customer");
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    await DatabaseService.deleteCustomer(customerId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw new Error("Failed to delete customer");
  }
}
