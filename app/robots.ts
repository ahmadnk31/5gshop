import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/_next/',
          '/checkout/',
          '/account/',
          '/wishlist/',
          '/quote/',
          '/search/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/checkout/',
          '/account/',
          '/wishlist/',
          '/quote/',
          '/search/'
        ],
      }
    ],
    sitemap: 'https://5gphones.be/sitemap.xml',
    host: 'https://5gphones.be'
  }
}
