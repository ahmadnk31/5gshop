# Quick Fix for Repair Pages 500 Error

## TL;DR - The Real Issue

The "BAILOUT_TO_CLIENT_SIDE_RENDERING" message you see locally is **NOT the problem**. It's normal Next.js behavior for pages with dynamic components.

The **real 500 error** in production happens because:
1. The API route `/api/repairs/brands` is being called during ISR/build
2. The fetch uses `NEXT_PUBLIC_BASE_URL` which might not be set
3. Or the database connection fails during build time

## Immediate Fix

**Option 1: Use Direct Prisma Query (BEST)**

Instead of fetching from the API route, query the database directly in the server component:

```typescript
// app/[locale]/repairs/[deviceType]/page.tsx

import { prisma } from '@/lib/database';

// Fetch brands data on server side for SSR/ISR
let brandsData: { brand: string; count: number; imageUrl?: string }[] = [];
try {
  const devicesWithBrands = await prisma.device.groupBy({
    by: ['brand'],
    where: {
      type: mappedDeviceType,
    },
    _count: {
      id: true,
    },
    orderBy: {
      brand: 'asc',
    },
  });

  brandsData = await Promise.all(
    devicesWithBrands.map(async (brandGroup) => {
      const firstDevice = await prisma.device.findFirst({
        where: {
          type: mappedDeviceType,
          brand: brandGroup.brand,
        },
        select: {
          imageUrl: true,
        },
      });

      return {
        brand: brandGroup.brand,
        count: brandGroup._count.id,
        imageUrl: firstDevice?.imageUrl || undefined,
      };
    })
  );
} catch (error) {
  console.error('[Server] Error fetching brands:', error);
  // Continue with empty data
}
```

**Option 2: Set Environment Variable**

If you want to keep the API fetch approach, add to Vercel:

```bash
NEXT_PUBLIC_BASE_URL=https://www.5gphones.be
```

## Why Option 1 is Better

✅ **No API calls** - Direct database access is faster
✅ **No URL issues** - No need for base URL
✅ **Better for ISR** - Works during build time
✅ **Same caching** - Still respects ISR revalidate
✅ **More reliable** - Fewer failure points

## Implementation

I'll implement Option 1 for you now...
