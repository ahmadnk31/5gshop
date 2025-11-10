# TanStack Query (React Query) Implementation Guide

## Overview
TanStack Query has been successfully integrated into the 5gshop project for advanced client-side data fetching, caching, and state management. This provides better performance, automatic background refetching, and optimistic updates.

## What's Installed

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Packages:
- **@tanstack/react-query**: Core library for data fetching and caching
- **@tanstack/react-query-devtools**: Developer tools for debugging queries

## Architecture

### 1. Query Provider (`/components/providers/query-provider.tsx`)

Wraps the entire app and provides query client configuration:

```typescript
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools /> // Only in development
</QueryClientProvider>
```

**Default Configuration:**
- **staleTime**: 5 minutes (data considered fresh)
- **gcTime**: 10 minutes (garbage collection time)
- **refetchOnWindowFocus**: false
- **refetchOnReconnect**: true
- **retry**: 1 attempt

### 2. Custom Hooks (`/hooks/use-data.ts`)

Provides reusable hooks for all data fetching needs:

#### Accessories
```typescript
useAccessories()              // Get all accessories
useAccessory(id)             // Get single accessory
useFeaturedAccessories(6)    // Get featured accessories
```

#### Repair Services
```typescript
useRepairServices()          // Get all services
usePopularServices(3)        // Get popular services
```

#### Parts
```typescript
useParts()                   // Get all parts
usePart(id)                  // Get single part
useHomepageParts()           // Get homepage parts
```

#### Devices
```typescript
useDevices()                 // Get all devices
useDeviceTypes()             // Get device types
```

#### Mutations (Updates)
```typescript
useCreateAccessory()         // Create accessory
useUpdateAccessory()         // Update accessory
useDeleteAccessory()         // Delete accessory
```

### 3. API Routes

All data flows through API routes with caching headers:

```
/app/api/
├── accessories/
│   ├── route.ts             // GET /api/accessories
│   └── featured/
│       └── route.ts         // GET /api/accessories/featured?limit=6
├── repair-services/
│   ├── route.ts             // GET /api/repair-services
│   └── popular/
│       └── route.ts         // GET /api/repair-services/popular?limit=3
├── parts/
│   └── homepage/
│       └── route.ts         // GET /api/parts/homepage
└── devices/
    ├── route.ts             // GET /api/devices
    └── types/
        └── route.ts         // GET /api/devices/types
```

**Cache Headers:**
```typescript
'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
```

## How to Use

### Basic Query Example

```typescript
'use client'

import { useFeaturedAccessories } from '@/hooks/use-data'

export function AccessoriesSection() {
  const { data, isLoading, error, refetch } = useFeaturedAccessories(6)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.map(accessory => (
        <div key={accessory.id}>{accessory.name}</div>
      ))}
    </div>
  )
}
```

### Mutation Example

```typescript
'use client'

import { useCreateAccessory } from '@/hooks/use-data'

export function CreateAccessoryForm() {
  const createAccessory = useCreateAccessory()
  
  const handleSubmit = async (formData: FormData) => {
    try {
      await createAccessory.mutateAsync({
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        // ... other fields
      })
      // Success! Cache automatically updated
    } catch (error) {
      console.error('Failed to create:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createAccessory.isPending}>
        {createAccessory.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

### Prefetching Example

```typescript
'use client'

import { usePrefetchAccessories } from '@/hooks/use-data'
import { Link } from 'next/link'

export function Navigation() {
  const prefetchAccessories = usePrefetchAccessories()
  
  return (
    <Link 
      href="/accessories"
      onMouseEnter={prefetchAccessories} // Prefetch on hover
    >
      Accessories
    </Link>
  )
}
```

## Cache Management

### Automatic Cache Invalidation

When you update data via mutations, the cache automatically updates:

```typescript
const updateAccessory = useUpdateAccessory()

// This will automatically:
// 1. Update the data
// 2. Invalidate related queries
// 3. Refetch in the background
await updateAccessory.mutateAsync({ id: '123', data: { price: 99.99 }})
```

### Manual Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['accessories'] })

// Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['accessories'] })
queryClient.invalidateQueries({ queryKey: ['parts'] })

// Clear all caches
queryClient.clear()
```

### Optimistic Updates

```typescript
const updateAccessory = useUpdateAccessory()

const handleUpdate = async (id: string, newData: any) => {
  await updateAccessory.mutateAsync(
    { id, data: newData },
    {
      // Update UI immediately before server responds
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: ['accessories', id] })
        const previous = queryClient.getQueryData(['accessories', id])
        queryClient.setQueryData(['accessories', id], newData)
        return { previous }
      },
      // Rollback on error
      onError: (err, variables, context) => {
        queryClient.setQueryData(['accessories', id], context?.previous)
      },
    }
  )
}
```

## DevTools

In development mode, you'll see the React Query DevTools in the bottom-right corner:

**Features:**
- View all active queries
- See query status (fetching, stale, fresh)
- Inspect cached data
- Manually refetch queries
- Clear cache
- Monitor mutations

**Access:** Click the floating icon in development builds

## Performance Benefits

### Before TanStack Query
```typescript
// Every component fetches its own data
const accessories = await getAccessories() // Database query
const accessories2 = await getAccessories() // Another database query (duplicate!)
```

### After TanStack Query
```typescript
// First component
const { data } = useAccessories() // Database query

// Second component (instant!)
const { data } = useAccessories() // Served from cache - no database query!
```

### Key Benefits:

1. **Automatic Deduplication**
   - Multiple components requesting same data = single network request
   
2. **Background Refetching**
   - Data automatically updates in the background
   - Users always see fresh data without manual refresh
   
3. **Stale-While-Revalidate**
   - Show cached data instantly
   - Update in background
   - Best of both worlds: fast + fresh
   
4. **Request Cancellation**
   - Cancels in-flight requests when component unmounts
   - Prevents memory leaks
   
5. **Pagination & Infinite Scroll**
   - Built-in support for complex data loading patterns

## Migration Path

### Current Server Components (Keep As Is)
Server components on the homepage can continue to use server actions directly:
```typescript
// app/[locale]/page.tsx - SERVER COMPONENT
export default async function Home() {
  const accessories = await getAccessories() // Direct server call
  return <FeaturedAccessories accessories={accessories} />
}
```

### Client Components (Use TanStack Query)
For interactive client components, use hooks:
```typescript
// components/accessories-browser.tsx - CLIENT COMPONENT
'use client'

export function AccessoriesBrowser() {
  const { data, isLoading } = useAccessories()
  // Interactive filtering, sorting, etc.
}
```

## Best Practices

### 1. Use Descriptive Query Keys
```typescript
// Good
['accessories', 'featured', { limit: 6 }]
['accessories', 'by-category', 'cases']

// Bad
['acc']
['data']
```

### 2. Set Appropriate Stale Times
```typescript
// Frequently changing data (stock levels)
staleTime: 1 * 60 * 1000 // 1 minute

// Rarely changing data (device types)
staleTime: 60 * 60 * 1000 // 1 hour
```

### 3. Handle Loading & Error States
```typescript
if (isLoading) return <Skeleton />
if (error) return <ErrorMessage error={error} retry={refetch} />
return <DataDisplay data={data} />
```

### 4. Enable Queries Conditionally
```typescript
// Only fetch when ID exists
useAccessory(id, {
  enabled: !!id && isAuthenticated
})
```

### 5. Use Placeholders for Better UX
```typescript
useAccessories({
  placeholderData: previousData => previousData // Keep showing old data while refetching
})
```

## Testing

### Mock Queries in Tests
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

<QueryClientProvider client={queryClient}>
  <ComponentToTest />
</QueryClientProvider>
```

## Troubleshooting

### Query Not Refetching
- Check `staleTime` setting (might be too long)
- Verify query key is correct
- Check if component is mounted

### Cache Not Updating After Mutation
- Ensure you're calling `invalidateQueries` with correct key
- Check mutation's `onSuccess` callback
- Verify query key matches between query and invalidation

### Memory Issues
- Reduce `gcTime` if caching too much data
- Use query key arrays to prevent duplicates
- Clear cache periodically for long-running apps

## Next Steps

1. **Convert Client Components**: Gradually migrate client components to use TanStack Query hooks
2. **Add Suspense**: Implement React Suspense for better loading states
3. **Optimistic Updates**: Add optimistic updates for instant UI feedback
4. **Offline Support**: Enable offline mode with persistence plugin
5. **WebSocket Integration**: Add real-time updates for stock levels

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Best Practices Guide](https://tkdodo.eu/blog/practical-react-query)
- [Performance Tips](https://tanstack.com/query/latest/docs/react/guides/performance)
- [DevTools Guide](https://tanstack.com/query/latest/docs/react/devtools)

## Summary

✅ TanStack Query installed and configured
✅ QueryProvider wrapping app
✅ Custom hooks for all data types
✅ API routes with caching
✅ DevTools enabled in development
✅ Automatic cache invalidation
✅ Optimized for performance

**Status**: Ready to use! Start converting client components to use the hooks from `/hooks/use-data.ts`
