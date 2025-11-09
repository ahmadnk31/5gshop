import { NextResponse } from 'next/server'
import { getAllDevices } from '@/app/actions/device-management-actions'
import { getAccessories } from '@/app/actions/accessory-actions'
import { DatabaseService } from '@/lib/database'
import { getRepairServices } from '@/app/actions/repair-services-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://5gphones.be'
  const locales = ['nl', 'en', 'fr']
  
  // Static pages - mobile-optimized
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/accessories', priority: '0.9', changefreq: 'daily' },
    { path: '/parts', priority: '0.9', changefreq: 'daily' },
    { path: '/repairs', priority: '0.9', changefreq: 'weekly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/quote', priority: '0.9', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  ]

  let urls: string[] = []

  // Generate static page URLs
  for (const page of staticPages) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${page.path}`
      urls.push(`
  <url>
    <loc>${url}</loc>
    <mobile:mobile/>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="nl" href="${baseUrl}/nl${page.path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en${page.path}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr${page.path}"/>
  </url>`)
    }
  }

  try {
    // Dynamic product pages
    const [accessories, parts, services] = await Promise.all([
      getAccessories(),
      DatabaseService.getAllPartsSimple(),
      getRepairServices()
    ])

    // Accessory pages
    for (const accessory of accessories) {
      const slug = `${accessory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${accessory.id}`
      for (const locale of locales) {
        const url = `${baseUrl}/${locale}/accessories/${slug}`
        urls.push(`
  <url>
    <loc>${url}</loc>
    <mobile:mobile/>
    <lastmod>${new Date(accessory.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
      }
    }

    // Part pages
    for (const part of parts) {
      const slug = `${part.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${part.id}`
      for (const locale of locales) {
        const url = `${baseUrl}/${locale}/parts/${slug}`
        urls.push(`
  <url>
    <loc>${url}</loc>
    <mobile:mobile/>
    <lastmod>${new Date(part.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
      }
    }

    // Service pages - using first deviceType from array
    for (const service of services) {
      if (service.deviceTypes && service.deviceTypes.length > 0) {
        for (const locale of locales) {
          const url = `${baseUrl}/${locale}/repairs/${service.deviceTypes[0].toLowerCase()}`
          urls.push(`
  <url>
    <loc>${url}</loc>
    <mobile:mobile/>
    <lastmod>${new Date(service.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
        }
      }
    }

  } catch (error) {
    console.error('Error generating mobile sitemap:', error)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
