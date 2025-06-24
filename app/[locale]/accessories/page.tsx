import { Suspense } from "react";
import AccessoriesPagePaginated from "./page-paginated";

function AccessoriesPageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading accessories...</p>
          </div>
        </div>
      </div>
    }>
      <AccessoriesPagePaginated />
    </Suspense>
  );
}

export default AccessoriesPageWithSuspense;
