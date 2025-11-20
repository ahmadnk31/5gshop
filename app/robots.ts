import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url || 'https://5gphones.be'
  
  // Paths that should never be indexed by search engines
  const disallowedPaths = [
    '/admin/',        // Admin dashboard - private
    '/api/',          // API endpoints - not for indexing
    '/auth/',         // Authentication pages - private
    '/_next/',        // Next.js internal files
    '/checkout/',     // Checkout process - private user data
    '/account/',      // User account pages - private
    '/wishlist/',     // User wishlists - private
    '/search/',       // Search results - dynamic, not for indexing
    '/cart/',         // Shopping cart - private user data
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
      // Googlebot uses the same rules as default, so no need for separate rule
      // If you need different rules for specific bots, add them here
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-mobile.xml`
    ],
    host: baseUrl
  }
}
