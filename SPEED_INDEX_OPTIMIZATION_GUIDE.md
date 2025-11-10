# Speed Index Optimization Implementation Guide

**Date**: November 10, 2025  
**Goal**: Optimize Speed Index to improve visual loading performance  
**Current Status**: Performance optimization needed

## What is Speed Index?

Speed Index measures how quickly content is visually displayed during page load. Lower scores are better:
- **0-3.4s**: Good (Green)
- **3.4-5.8s**: Needs Improvement (Orange)
- **5.8s+**: Poor (Red)

## Critical Speed Index Factors

### 1. Above-the-Fold Content Priority
- Hero section and navigation must load first
- Defer below-the-fold content
- Minimize render-blocking resources

### 2. Resource Loading Strategy
- Critical CSS inline
- Defer non-critical JavaScript
- Lazy load images below fold
- Prioritize visible content

### 3. Font Optimization
- Use font-display: swap
- Preload critical fonts
- Minimize font variants

## Implementation Plan

### Phase 1: Font Optimization (CRITICAL)

**Current Issues**:
- Loading 3 font families (Inter, Roboto, Poppins)
- Multiple font weights blocking render
- No font subsetting

**Solutions**:

```typescript
// app/[locale]/layout.tsx - OPTIMIZED
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // ✅ Already optimized
  preload: true,   // ✅ Preload primary font
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial', // NEW: Better fallback matching
});

// Only load Roboto/Poppins if actually used - consider removing
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // REDUCE: Only essential weights
  display: 'swap',
  preload: false, // Don't preload secondary fonts
  fallback: ['Arial', 'sans-serif'],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // REDUCE: Only essential weights
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
});
```

**Recommendation**: Use only ONE primary font (Inter) to reduce HTTP requests and blocking time.

### Phase 2: Critical CSS Extraction

Create inline critical CSS for above-the-fold content:

```tsx
// app/[locale]/layout.tsx - Add to <head>
<style dangerouslySetInnerHTML={{
  __html: `
    /* Critical above-the-fold styles */
    body { 
      margin: 0;
      font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
      background-color: #FFFFFF;
      color: #111827;
    }
    .hero-section {
      min-height: 60vh;
      display: flex;
      align-items: center;
    }
    /* Navigation critical styles */
    nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  `
}} />
```

### Phase 3: Resource Hints Optimization

**Current Implementation** (Good but can improve):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="//www.googletagmanager.com" />
<link rel="dns-prefetch" href="//tire-files.s3.us-east-1.amazonaws.com" />
```

**Enhanced Version**:
```html
<!-- HIGH PRIORITY: Preconnect to critical origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

<!-- MEDIUM PRIORITY: DNS prefetch for analytics -->
<link rel="dns-prefetch" href="//www.googletagmanager.com" />
<link rel="dns-prefetch" href="//www.google-analytics.com" />

<!-- LOW PRIORITY: Image CDN -->
<link rel="dns-prefetch" href="//tire-files.s3.us-east-1.amazonaws.com" />
<link rel="dns-prefetch" href="//dl8rlqtc6lw1l.cloudfront.net" />

<!-- Preload hero image if static -->
<link rel="preload" as="image" href="/hero-image.webp" fetchpriority="high" />

<!-- Preload critical CSS chunks -->
<link rel="preload" as="style" href="/_next/static/css/[hash].css" />
```

### Phase 4: Script Loading Strategy

**Current Issues**:
- Multiple third-party scripts can block rendering
- Analytics loading too early

**Optimized Approach**:

```tsx
// Move heavy scripts to end of body or defer
// app/[locale]/layout.tsx

<body>
  {/* Critical content first */}
  <Navigation />
  <main>{children}</main>
  <Footer />
  
  {/* Defer non-critical scripts */}
  {/* Analytics - Load after interaction or timeout */}
  <Script
    src="https://www.googletagmanager.com/gtag/js"
    strategy="afterInteractive" // or "lazyOnload"
  />
  
  {/* Tawk.to - Lazy load after 3 seconds */}
  <Script
    id="tawk-to"
    strategy="lazyOnload"
    onLoad={() => {
      // Init after load
    }}
  />
</body>
```

### Phase 5: Image Optimization

**Current Status**: Good (WebP/AVIF enabled)

**Enhancements**:

```tsx
// Homepage hero image
<Image
  src="/hero.webp"
  alt="Phone Repair Leuven"
  width={1920}
  height={1080}
  priority // Critical for LCP
  quality={85} // Reduce from default 100
  placeholder="blur" // Add blur placeholder
  blurDataURL="data:image/jpeg;base64,..." // Inline blur
  sizes="100vw"
/>

// Below-the-fold images
<Image
  src="/service.webp"
  alt="Service"
  width={600}
  height={400}
  loading="lazy" // Lazy load
  quality={75} // Lower quality for non-hero
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Phase 6: Component Code Splitting

**Current**: All components load at once

**Optimized**: Dynamic imports for heavy components

```tsx
// app/[locale]/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HomepageHeroCarouselClient = dynamic(
  () => import('@/components/homepage-hero-carousel-client'),
  {
    loading: () => <HeroSkeleton />,
    ssr: true // Keep SSR for SEO
  }
);

const FeaturedAccessoriesSection = dynamic(
  () => import('@/components/FeaturedAccessoriesSection'),
  {
    loading: () => <AccessoriesSkeleton />,
    ssr: false // Can skip SSR for below-fold content
  }
);

const QuickLinksSection = dynamic(
  () => import('@/components/quick-links-section'),
  {
    loading: () => null,
    ssr: false
  }
);

const RecentlyViewedSection = dynamic(
  () => import('@/components/recently-viewed-section'),
  {
    loading: () => null,
    ssr: false // Client-side only
  }
);
```

### Phase 7: CSS Optimization

**Bundle Size Reduction**:

```tsx
// tailwind.config.js - Tree-shake unused styles
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Remove unused Tailwind features
  corePlugins: {
    // Disable if not used
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
  },
}
```

### Phase 8: Third-Party Script Optimization

**Current Third-Party Scripts**:
1. Google Analytics
2. Tawk.to Chat
3. Cookie Consent
4. Vercel Analytics

**Optimization Strategy**:

```tsx
// Facade Pattern for Tawk.to
// Only load when user interacts
const [chatLoaded, setChatLoaded] = useState(false);

const loadChat = () => {
  if (!chatLoaded) {
    // Load Tawk.to script
    setChatLoaded(true);
  }
};

// Trigger on scroll, click, or timeout
useEffect(() => {
  const timer = setTimeout(loadChat, 5000); // Load after 5s
  window.addEventListener('scroll', loadChat, { once: true });
  return () => clearTimeout(timer);
}, []);
```

### Phase 9: Server-Side Optimizations

**Enhance ISR Configuration**:

```tsx
// app/[locale]/page.tsx
export const revalidate = 300; // ✅ Already set

// Add static generation for predictable paths
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'nl' },
    { locale: 'fr' },
  ];
}

// Optimize data fetching
export const dynamic = 'force-static'; // or 'auto'
export const dynamicParams = true;
export const fetchCache = 'force-cache';
```

### Phase 10: Skeleton Loaders

Create loading skeletons for better perceived performance:

```tsx
// components/skeletons.tsx
export function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded"></div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

## Priority Implementation Order

### 🔴 CRITICAL (Do First)
1. **Font Optimization**: Reduce to 1 font family, minimal weights
2. **Defer Third-Party Scripts**: Move analytics/chat to lazyOnload
3. **Inline Critical CSS**: Add critical above-the-fold styles
4. **Hero Image Priority**: Add priority + blur placeholder

### 🟡 HIGH PRIORITY
5. **Dynamic Imports**: Code-split heavy components
6. **Resource Hints**: Optimize preconnect/dns-prefetch
7. **Script Strategy**: Use afterInteractive/lazyOnload properly

### 🟢 MEDIUM PRIORITY
8. **CSS Tree-Shaking**: Remove unused Tailwind utilities
9. **Skeleton Loaders**: Add loading states
10. **Static Generation**: Pre-render locale variations

## Expected Performance Gains

### Before Optimization (Estimated)
- Speed Index: ~4.5-6.0s
- Fonts blocking: 600-800ms
- Third-party scripts: 1-2s blocking time
- Unoptimized images: 500-1000ms

### After Optimization (Target)
- Speed Index: ~2.0-3.4s (Good)
- Font blocking: <200ms
- Third-party deferred: 0ms blocking
- Optimized images: <300ms
- **Overall improvement: 40-50% faster**

## Measurement Tools

### Before Changes
```bash
# Lighthouse CI
npm run lighthouse

# WebPageTest
# Visit: https://www.webpagetest.org/
# Test: https://5gphones.be/en

# Chrome DevTools
# 1. Open DevTools > Lighthouse
# 2. Run audit
# 3. Note Speed Index score
```

### Monitoring
```bash
# Real User Monitoring (RUM)
# Vercel Analytics provides:
# - Speed Index
# - LCP (Largest Contentful Paint)
# - FCP (First Contentful Paint)
# - CLS (Cumulative Layout Shift)
```

## Quick Wins (15 minutes)

These can be implemented immediately for instant improvement:

1. **Reduce font weights** (2 min)
2. **Add font-display: swap** (already done ✅)
3. **Defer Tawk.to chat** (3 min)
4. **Move analytics to lazyOnload** (2 min)
5. **Add hero image priority** (3 min)
6. **Inline critical navigation CSS** (5 min)

## Next Steps

1. Implement critical optimizations (fonts, scripts)
2. Test with Lighthouse
3. Compare before/after Speed Index
4. Deploy to production
5. Monitor with Vercel Analytics
6. Iterate based on real user data

---

**Related Documentation**:
- `PERFORMANCE_OPTIMIZATION_COMPLETE.md`
- `MOBILE_PERFORMANCE_THEME_OPTIMIZATION_COMPLETE.md`
- `next.config.ts` (caching, compression)

**Status**: ⏳ Implementation pending
