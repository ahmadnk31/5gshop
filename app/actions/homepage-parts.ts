"use server";
import { DatabaseService } from "@/lib/database";

export async function getHomepageParts() {
  // Get top 6 in-stock parts for homepage
  const allParts = await DatabaseService.getAllPartsSimple();
  return allParts.filter((p) => p.inStock > 0).slice(0, 6);
}
