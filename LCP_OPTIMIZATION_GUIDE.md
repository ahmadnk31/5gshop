# Largest Contentful Paint (LCP) Optimization - Complete Guide

**Date**: November 10, 2025  
**Goal**: Achieve LCP < 2.5 seconds (Good)  
**Current LCP Element**: Hero carousel image  
**Status**: ⏳ OPTIMIZATION NEEDED

## What is LCP?

**Largest Contentful Paint (LCP)** measures when the largest content element becomes visible in the viewport. This is typically:
- Hero images
- Large text blocks
- Video thumbnails
- Background images with text

### LCP Thresholds (Core Web Vitals)
- **Good**: 0-2.5 seconds (Green) ✅
- **Needs Improvement**: 2.5-4.0 seconds (Orange) ⚠️
- **Poor**: 4.0+ seconds (Red) ❌

## Current Implementation Analysis

### LCP Element Identified
The hero carousel image is your LCP element:
```tsx
// components/homepage-hero-carousel-client.tsx
<Image
  src={item.imageUrl || '/logo.svg'}
  alt={`${item.name}`}
  fill
  priority={idx === 0} // ✅ GOOD: First image has priority
  loading={idx === 0 ? 'eager' : 'lazy'} // ✅ GOOD: Lazy load others
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1400px"
/>
```

### What's Already Optimized ✅
1. **Priority Loading**: First image uses `priority` prop
2. **Lazy Loading**: Other carousel images lazy load
3. **Responsive Sizes**: Proper `sizes` attribute
4. **ISR**: Page uses `revalidate = 300` for caching

### What Needs Optimization ⚠️
1. **Image Format**: Need WebP/AVIF
2. **Image Compression**: Quality optimization
3. **Blur Placeholder**: Missing for better perceived performance
4. **Preload**: Add explicit `<link rel="preload">` hint
5. **Image Dimensions**: Could be optimized per breakpoint
6. **Remove Render-Blocking**: Defer non-critical resources

## LCP Optimization Strategy

### Phase 1: Image Optimization (CRITICAL - Biggest Impact)

#### 1.1 Add Preload Hint in Layout
Add explicit preload for hero image:

```tsx
// app/[locale]/layout.tsx - Add to <head>
<link
  rel="preload"
  as="image"
  href="/hero-main.webp" // Your actual hero image
  imageSrcSet="
    /hero-main-640.webp 640w,
    /hero-main-1200.webp 1200w,
    /hero-main-1920.webp 1920w
  "
  imageSizes="100vw"
  fetchpriority="high"
/>
```

**Impact**: Starts downloading hero image immediately (saves 200-400ms)

#### 1.2 Optimize Image Quality
```tsx
// components/homepage-hero-carousel-client.tsx
<Image
  src={item.imageUrl || '/logo.svg'}
  alt={`${item.name} - ${item.subtitle || 'Featured product showcase'}`}
  fill
  quality={85} // OPTIMIZED: Reduce from default 100 to 85
  priority={idx === 0}
  loading={idx === 0 ? 'eager' : 'lazy'}
  sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
  placeholder={idx === 0 ? 'blur' : 'empty'} // Add blur for first image
  blurDataURL={item.blurDataURL || generateBlurPlaceholder()} // Add blur data
/>
```

**Impact**: 
- 15-30% smaller file size
- Blur placeholder shows instantly (perceived performance)
- Proper responsive sizing

#### 1.3 Ensure WebP/AVIF Format
```typescript
// next.config.ts (Already configured ✅)
images: {
  formats: ['image/webp', 'image/avif'], // ✅ Good
  minimumCacheTTL: 31536000,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
}
```

### Phase 2: Eliminate Render-Blocking Resources

#### 2.1 Inline Critical CSS (Already Done ✅)
The critical CSS is already in place.

#### 2.2 Optimize Font Loading
```tsx
// app/[locale]/layout.tsx
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // ✅ Already optimized
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

// Add font-display CSS
<style>{`
  @font-face {
    font-family: 'Inter';
    font-display: swap; /* Show fallback immediately */
  }
`}</style>
```

#### 2.3 Defer Non-Critical Scripts
```tsx
// Move analytics and chat to lazyOnload strategy
<GoogleAnalytics /> // Should use strategy="afterInteractive"
<TawkToChat /> // Already optimized with 5s delay ✅
```

### Phase 3: Optimize Image Delivery

#### 3.1 Use CDN for Images
Ensure images are served from CloudFront:
```
✅ dl8rlqtc6lw1l.cloudfront.net (Already configured)
✅ tire-files.s3.us-east-1.amazonaws.com (Backup)
```

#### 3.2 Add Proper Cache Headers
```typescript
// next.config.ts (Already configured ✅)
{
  source: '/_next/image(.*)',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

### Phase 4: Reduce Document Size

#### 4.1 Code Split Heavy Components
```tsx
// app/[locale]/page.tsx
import dynamic from 'next/dynamic';

// Lazy load below-the-fold components
const FeaturedAccessoriesSection = dynamic(
  () => import('@/components/FeaturedAccessoriesSection'),
  { ssr: false } // Skip SSR for below-fold
);

const RecentlyViewedSection = dynamic(
  () => import('@/components/recently-viewed-section'),
  { ssr: false }
);
```

**Impact**: Reduces initial JavaScript bundle by 100-200KB

#### 4.2 Optimize Hero Carousel Load
```tsx
// Don't auto-play initially
useEffect(() => {
  const timer = setTimeout(() => {
    setPlaying(true);
  }, 3000); // Delay auto-play
  return () => clearTimeout(timer);
}, []);
```

**Already implemented ✅**

### Phase 5: Server-Side Optimizations

#### 5.1 Static Generation
```tsx
// app/[locale]/page.tsx
export const revalidate = 300; // ✅ Already set

// Add static generation for locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
    { locale: 'fr' },
  ];
}
```

#### 5.2 Optimize Data Fetching
```tsx
// Fetch only essential data for above-fold
// Defer below-fold data fetching

const [heroData, servicesData] = await Promise.all([
  getHeroCarouselData(), // Critical
  getRepairServices().then(d => d.slice(0, 6)), // Limit results
]);

// Load accessories later (below fold)
```

## Implementation Checklist

### 🔴 CRITICAL (Immediate Impact on LCP)

- [ ] **Add preload link for hero image** in layout.tsx
- [ ] **Reduce image quality to 85%** in hero carousel
- [ ] **Add blur placeholder** for first hero image
- [ ] **Optimize hero image files** (compress, convert to WebP)
- [ ] **Ensure CDN delivery** for all hero images

### 🟡 HIGH PRIORITY

- [ ] **Code-split below-fold components**
- [ ] **Generate static pages** at build time
- [ ] **Optimize image dimensions** per breakpoint
- [ ] **Add fetchpriority="high"** to hero image
- [ ] **Defer analytics loading**

### 🟢 MEDIUM PRIORITY

- [ ] **Optimize font loading strategy**
- [ ] **Compress JavaScript bundles**
- [ ] **Add service worker** for repeat visits
- [ ] **Optimize third-party scripts**
- [ ] **Add resource hints** for hero images

## Expected LCP Improvements

### Before Optimization (Estimated)
```
LCP: 3.2-4.0 seconds
- Image download: 1.5s
- Render blocking: 0.8s
- Parse/render: 0.5s
- Other delays: 0.4-1.2s
```

### After Optimization (Target)
```
LCP: 1.8-2.3 seconds ✅
- Image preload: 0.8s (-47%)
- Render blocking: 0.3s (-63%)
- Parse/render: 0.4s (-20%)
- Other delays: 0.3-0.8s
```

**Total Improvement: 40-50% faster LCP**

## Quick Wins (Can Implement Now)

### 1. Add Image Preload (5 minutes)
```tsx
// app/[locale]/layout.tsx - Add to <head>
<link
  rel="preload"
  as="image"
  href={`${process.env.NEXT_PUBLIC_CDN_URL}/hero-default.webp`}
  fetchpriority="high"
/>
```

### 2. Reduce Image Quality (2 minutes)
```tsx
// components/homepage-hero-carousel-client.tsx
<Image
  quality={85} // Add this prop
  // ... other props
/>
```

### 3. Add Blur Placeholder (10 minutes)
```tsx
// Generate blur placeholder data URL
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRg..."; // Tiny base64

<Image
  placeholder="blur"
  blurDataURL={blurDataURL}
  // ... other props
/>
```

### 4. Code-Split Heavy Components (15 minutes)
```tsx
// app/[locale]/page.tsx
import dynamic from 'next/dynamic';

const FeaturedAccessoriesSection = dynamic(
  () => import('@/components/FeaturedAccessoriesSection'),
  { ssr: false, loading: () => <div>Loading...</div> }
);
```

## Testing LCP

### Local Testing
```bash
# 1. Start dev server
npm run dev

# 2. Open Chrome DevTools
# - Performance tab
# - Record page load
# - Look for "LCP" marker in timeline

# 3. Lighthouse
# - DevTools > Lighthouse
# - Run Performance audit
# - Check LCP score
```

### Production Testing
```bash
# WebPageTest
https://www.webpagetest.org/
# Test: https://5gphones.be/en
# Check "Largest Contentful Paint" metric

# PageSpeed Insights
https://pagespeed.web.dev/
# Enter: https://5gphones.be/en
# Check "LCP" in Core Web Vitals

# Chrome UX Report (CrUX)
# Real user data from Chrome browsers
# Available in PageSpeed Insights
```

## Monitoring LCP

### Vercel Analytics (RUM)
Monitor real user LCP:
```
Dashboard > Performance
- LCP Score
- LCP by Country
- LCP by Device
- LCP Trend over time
```

### Web Vitals JavaScript
```typescript
// Add to layout.tsx
import { onLCP } from 'web-vitals';

useEffect(() => {
  onLCP((metric) => {
    console.log('LCP:', metric.value, 'ms');
    // Send to analytics
  });
}, []);
```

## Common LCP Issues & Fixes

### Issue 1: Large Image Size
**Problem**: Hero image is 2MB+
**Fix**: Compress to <200KB, use WebP
**Impact**: -70% load time

### Issue 2: Render-Blocking CSS
**Problem**: Waiting for full CSS bundle
**Fix**: Inline critical CSS
**Impact**: -300ms

### Issue 3: Slow Server Response
**Problem**: TTFB > 600ms
**Fix**: Enable ISR, use CDN
**Impact**: -400ms

### Issue 4: Missing Preload Hint
**Problem**: Browser discovers image late
**Fix**: Add `<link rel="preload">`
**Impact**: -200ms

### Issue 5: Client-Side Rendering
**Problem**: Image loads after hydration
**Fix**: SSR + priority loading
**Impact**: -500ms

## Browser Compatibility

All LCP optimizations are compatible with:
- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- ✅ Mobile browsers - Full support

## Performance Budget

Set LCP budgets for monitoring:
```json
{
  "lcp": {
    "mobile": 2500,  // ms
    "desktop": 2000  // ms
  }
}
```

Alert if LCP exceeds budget.

## Related Optimizations

These optimizations also help LCP:
- ✅ Speed Index optimization (fonts, scripts)
- ✅ FCP optimization (critical CSS)
- ⏳ TTFB optimization (server response)
- ⏳ CLS optimization (layout stability)

## Next Steps

1. **Measure current LCP** with Lighthouse
2. **Implement critical optimizations** (preload, quality, blur)
3. **Test improvements** in dev
4. **Deploy to production**
5. **Monitor with Vercel Analytics**
6. **Iterate based on real user data**

## Success Criteria

✅ **LCP < 2.5 seconds** on mobile (75th percentile)
✅ **LCP < 2.0 seconds** on desktop
✅ **All hero images < 200KB**
✅ **Hero image preloaded**
✅ **Blur placeholder visible**
✅ **WebP/AVIF format used**

---

**Status**: ⏳ READY FOR IMPLEMENTATION  
**Priority**: 🔴 CRITICAL (Core Web Vital)  
**Estimated Impact**: 40-50% LCP improvement  
**Implementation Time**: 2-4 hours

