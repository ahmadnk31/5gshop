import { Suspense } from "react";
import AccessoriesPagePaginated from "./page-paginated";
import { Skeleton } from '@/components/ui/skeleton';
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata({
    title: "Premium Phone & Device Accessories",
    description: "Shop high-quality accessories for smartphones, tablets, laptops & more. Cases, chargers, cables, screen protectors & more. Fast shipping in Belgium.",
    path: "/accessories",
    keywords: [
      "phone accessories",
      "smartphone cases",
      "phone chargers", 
      "cables",
      "screen protectors",
      "tablet accessories",
      "laptop accessories",
      "wireless chargers",
      "Belgium accessories",
      "Leuven phone shop"
    ]
  });
}

function AccessoriesPageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="w-full aspect-square mb-3" />
                <Skeleton className="w-2/3 h-5 mb-2" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-full h-8 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <AccessoriesPagePaginated />
    </Suspense>
  );
}

export default AccessoriesPageWithSuspense;
