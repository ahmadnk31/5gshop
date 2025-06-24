"use server";

import { DatabaseService, PaginationParams, PaginatedResult } from "@/lib/database";
import { Accessory, AccessoryCategory, Repair, Customer, RepairStatus } from "@/lib/types";

// Accessory pagination actions
export async function getAccessoriesPaginated(
  params: PaginationParams = {}
): Promise<PaginatedResult<Accessory>> {
  try {
    return await DatabaseService.getAccessoriesPaginated(params);
  } catch (error) {
    console.error("Failed to get paginated accessories:", error);
    throw new Error("Failed to get paginated accessories");
  }
}

export async function getAccessoriesWithFiltersPaginated(
  params: PaginationParams & {
    category?: AccessoryCategory;
    search?: string;
    inStockOnly?: boolean;
  } = {}
): Promise<PaginatedResult<Accessory>> {
  try {
    console.log('[SERVER ACTION] getAccessoriesWithFiltersPaginated called');
    console.log('[SERVER ACTION] Params:', JSON.stringify(params, null, 2));
    
    // Validate parameters
    const {
      page = 1,
      limit = 12,
      sortBy = 'name',
      sortOrder = 'asc',
      category,
      search,
      inStockOnly = true
    } = params;

    console.log('[SERVER ACTION] Normalized params:', {
      page, limit, sortBy, sortOrder, category, search, inStockOnly
    });

    // Check if DatabaseService is available
    if (!DatabaseService || typeof DatabaseService.getAccessoriesWithFiltersPaginated !== 'function') {
      console.error('[SERVER ACTION] DatabaseService or method not available');
      throw new Error('DatabaseService.getAccessoriesWithFiltersPaginated is not available');
    }

    console.log('[SERVER ACTION] Calling DatabaseService...');
    const result = await DatabaseService.getAccessoriesWithFiltersPaginated({
      page, limit, sortBy, sortOrder, category, search, inStockOnly
    });
    
    console.log('[SERVER ACTION] Database service returned:', result.data.length, 'accessories');
    console.log('[SERVER ACTION] Pagination info:', result.pagination);
    
    return result;
  } catch (error) {
    console.error('[SERVER ACTION] Error in getAccessoriesWithFiltersPaginated:', error);
    console.error('[SERVER ACTION] Error type:', typeof error);
    console.error('[SERVER ACTION] Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('[SERVER ACTION] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[SERVER ACTION] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Re-throw with more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    throw new Error(`Failed to get filtered paginated accessories: ${errorMessage}`);
  }
}

// Admin pagination actions
export async function getRepairsPaginated(
  params: PaginationParams & {
    status?: RepairStatus | 'all';
    search?: string;
  } = {}
): Promise<PaginatedResult<Repair>> {
  try {
    return await DatabaseService.getRepairsPaginated(params);
  } catch (error) {
    console.error("Failed to get paginated repairs:", error);
    throw new Error("Failed to get paginated repairs");
  }
}

export async function getCustomersPaginated(
  params: PaginationParams & {
    search?: string;
  } = {}
): Promise<PaginatedResult<Customer>> {
  try {
    return await DatabaseService.getCustomersPaginated(params);
  } catch (error) {
    console.error("Failed to get paginated customers:", error);
    throw new Error("Failed to get paginated customers");
  }
}

export async function getContactsPaginated(
  params: PaginationParams & {
    status?: 'new' | 'responded' | 'resolved' | 'all';
  } = {}
): Promise<PaginatedResult<any>> {
  try {
    return await DatabaseService.getContactsPaginated(params);
  } catch (error) {
    console.error("Failed to get paginated contacts:", error);
    throw new Error("Failed to get paginated contacts");
  }
}
