"use server";
import { unstable_cache } from "next/cache";
import { DatabaseService } from "@/lib/database";

export async function getHomepageParts() {
  // Cache for 5 minutes to improve TTFB
  const getCachedHomepageParts = unstable_cache(
    async () => {
      // Get top 6 in-stock parts for homepage
      const allParts = await DatabaseService.getAllPartsSimple();
      return allParts.filter((p) => p.inStock > 0).slice(0, 6);
    },
    ['homepage-parts'],
    { revalidate: 300, tags: ['parts', 'homepage'] }
  );
  return await getCachedHomepageParts();
}
