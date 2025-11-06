import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuthLoading() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center space-y-2">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form Fields */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* Submit Button */}
            <Skeleton className="h-10 w-full" />
            
            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-px flex-1" />
            </div>
            
            {/* Social Login Buttons */}
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            
            {/* Footer Links */}
            <div className="text-center mt-6">
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
