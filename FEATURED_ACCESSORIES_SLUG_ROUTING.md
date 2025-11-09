# Featured Accessories Slug-Based Routing Update

## Overview
Updated the featured accessories section on the homepage to use SEO-friendly slug-based URLs instead of database ID-based URLs.

## Changes Made

### 1. Homepage Server Component
**File**: `/app/[locale]/page.tsx`

**Implementation**:
- Added `createSlug()` helper function in the server component
- Pre-compute slugs for all featured accessories before passing to client component
- Map accessories to include a `slug` property

**Code**:
```tsx
const createSlug = (name: string, id: string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
};

const featuredAccessories = accessories
  .filter((acc: Accessory) => acc.inStock > 0)
  .sort((a: Accessory, b: Accessory) => b.inStock - a.inStock)
  .slice(0, 6)
  .map((acc: Accessory) => ({
    ...acc,
    slug: createSlug(acc.name, acc.id)
  }));
```

**Why Server-Side?**
This prevents React hydration errors by ensuring slugs are computed once on the server and remain consistent during client-side hydration.

### 2. FeaturedAccessoriesSection Component
**File**: `/components/FeaturedAccessoriesSection.tsx`

**Before**:
```tsx
<Link href={`/accessories/${accessory.id}`}>
```
Example URL: `/accessories/cmchcgnte0000sbexory4pw5o`

**After**:
```tsx
type AccessoryWithSlug = Accessory & { slug: string };
<Link href={`/accessories/${accessory.slug}`}>
```
Example URL: `/accessories/iphone-14-pro-max-magsafe-case-cmchcgnte0000sbexory4pw5o`

**Implementation**:
- Updated TypeScript type to accept accessories with pre-computed slugs
- Removed client-side slug generation to prevent hydration mismatches
- Changed Link href to use the pre-computed slug from props

## Hydration Error Fix

**Problem**: Initial implementation generated slugs on the client component, causing React hydration mismatches because:
1. Server renders the component with slugs
2. Client's initial render might compute slugs differently or at a different time
3. React expects server HTML to match client's initial render exactly

**Solution**: Move slug generation to the server component (homepage) where data is fetched, ensuring slugs are:
- ✅ Computed once on the server
- ✅ Passed as props to client component
- ✅ Consistent during hydration
- ✅ No computational differences between server and client

This follows Next.js best practices for preventing hydration errors in Server/Client component architecture.

### 3. AccessoryViewTracker Component
**File**: `/app/[locale]/accessories/components/accessory-view-tracker.tsx`

**Before**:
```tsx
url: `/accessories/${accessory.id}`
```

**After**:
```tsx
const accessorySlug = createSlug(accessory.name, accessory.id);
url: `/accessories/${accessorySlug}`
```

**Purpose**:
- Ensures recently viewed tracking uses slug-based URLs
- Maintains consistency across the application

## Slug Generation Pattern

The `createSlug()` function creates SEO-friendly URLs by:
1. Converting name to lowercase
2. Replacing non-alphanumeric characters with hyphens
3. Removing leading/trailing hyphens
4. Appending the unique ID for database lookup

```typescript
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}
```

## Benefits

### SEO Improvements
- ✅ Keywords in URL (e.g., "iphone-14-magsafe-case")
- ✅ Better search engine indexing
- ✅ Improved URL readability for users and search engines
- ✅ Higher click-through rates from search results

### User Experience
- ✅ Readable, shareable URLs
- ✅ Users can understand product from URL alone
- ✅ Better for bookmarking and sharing
- ✅ Professional appearance

### Technical Benefits
- ✅ Consistent with parts routing pattern
- ✅ Works with existing `/accessories/[slug]/page.tsx` route
- ✅ Maintains unique IDs for database lookups
- ✅ No breaking changes (ID still embedded in slug)

## Testing Checklist

- [x] Featured accessories display correctly on homepage
- [x] Links use slug-based URLs
- [x] Clicking accessory navigates to correct detail page
- [x] Recently viewed tracking uses slug URLs
- [x] Add to cart functionality works
- [x] No TypeScript errors
- [x] No runtime errors

## Related Files

Files that already support slug-based routing:
- ✅ `/app/[locale]/accessories/[slug]/page.tsx` - Detail page (existing)
- ✅ `/app/[locale]/accessories/page-paginated.tsx` - Accessories list (existing)
- ✅ `/app/[locale]/accessories/components/related-accessory-card.tsx` - Related products (existing)
- ✅ `/components/FeaturedAccessoriesSection.tsx` - Homepage featured (updated)
- ✅ `/app/[locale]/accessories/components/accessory-view-tracker.tsx` - View tracking (updated)

Files still using ID-based routing (if any):
- Check search results component
- Check cart item links
- Check wishlist links

## Next Steps

### Recommended Updates
1. **Search Component**: Verify search results use slug-based URLs for accessories
2. **Cart Links**: Ensure cart item links use slugs
3. **Wishlist**: Update wishlist to use slug-based routing
4. **Email Templates**: Update product links in emails to use slugs

### Part Tracking
Consider adding similar view tracking for repair parts:
- Create `PartViewTracker` component
- Add to parts detail page
- Track with slug-based URLs

### Documentation
Update any API documentation or integration guides to reference the new URL pattern.

## URL Pattern Examples

| Product Name | Generated Slug |
|-------------|---------------|
| iPhone 14 Pro Max MagSafe Case | `iphone-14-pro-max-magsafe-case-{id}` |
| Samsung Galaxy S23 Screen Protector | `samsung-galaxy-s23-screen-protector-{id}` |
| USB-C to Lightning Cable 1m | `usb-c-to-lightning-cable-1m-{id}` |
| AirPods Pro (2nd Generation) | `airpods-pro-2nd-generation-{id}` |
| Apple Watch Series 8 Band 45mm | `apple-watch-series-8-band-45mm-{id}` |

## Compatibility

- ✅ Works with Next.js App Router
- ✅ Compatible with i18n routing (`/en/accessories/...`, `/nl/accessories/...`, `/fr/accessories/...`)
- ✅ No database changes required
- ✅ Backward compatible (ID still in slug for lookup)
- ✅ Works with existing caching strategies

## Performance Impact

- **Minimal**: Slug generation is a simple string operation
- **No additional API calls**: Uses existing data
- **Same page load time**: Route structure unchanged
- **Better SEO**: Improved rankings over time

## Deployment Notes

No special deployment steps required. Changes are:
- ✅ Frontend only
- ✅ No database migrations
- ✅ No environment variables
- ✅ No configuration changes

## Success Metrics

After deployment, monitor:
1. **SEO Rankings**: Track keyword positions for accessory pages
2. **Click-Through Rates**: Monitor search result CTR
3. **User Engagement**: Track bounce rate and time on page
4. **Sharing**: Monitor URL shares on social media
5. **Search Visibility**: Check Google Search Console impressions

## Maintenance

When adding new accessories:
- ✅ No special handling needed
- ✅ Slugs generated automatically
- ✅ Works with any product name
- ✅ Handles special characters correctly

---

**Updated**: December 2024  
**Status**: ✅ Complete  
**Impact**: Low risk, high benefit  
**Version**: 1.0
