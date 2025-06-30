'use client'
import Skeleton from "@/components/ui/skeleton";

export default function loading(){
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
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
    );
  }