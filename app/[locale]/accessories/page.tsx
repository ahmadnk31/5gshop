import { Suspense } from "react";
import AccessoriesPagePaginated from "./page-paginated";
import { Skeleton } from '@/components/ui/skeleton';

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
