import { MetadataRoute } from 'next'
import { getAllDevices } from '@/app/actions/device-management-actions'
import { getAccessories } from '@/app/actions/accessory-actions'
import { DatabaseService } from '@/lib/database'
import { getRepairServices } from '@/app/actions/repair-services-actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://5gphones.be'
  const locales = ['en', 'nl', 'fr']
  
  // Static pages
  const staticPages = [
    '',
    '/accessories',
    '/parts', 
    '/repairs',
    '/contact',
    '/about',
    '/privacy',
    '/terms',
    '/quote',
    '/auth/login',
    '/auth/register'
  ]

  // Generate routes for all locales
  const staticRoutes = staticPages.flatMap(route => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  try {
    // Dynamic product pages
    const [accessories, parts, devices, services] = await Promise.all([
      getAccessories(),
      DatabaseService.getAllPartsSimple(),
      getAllDevices(),
      getRepairServices()
    ])

    // Accessory pages (all locales)
    const accessoryRoutes = accessories.flatMap((accessory: any) =>
      locales.map(locale => ({
        url: `${baseUrl}/${locale}/accessories/${accessory.id}`,
        lastModified: new Date(accessory.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    )

    // Part pages (all locales)
    const partRoutes = parts.flatMap((part: any) =>
      locales.map(locale => ({
        url: `${baseUrl}/${locale}/parts/${part.id}`,
        lastModified: new Date(part.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    )

    // Service pages (all locales)
    const serviceRoutes = services.flatMap((service: any) =>
      locales.map(locale => ({
        url: `${baseUrl}/${locale}/repairs/${service.id}`,
        lastModified: new Date(service.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    )

    return [
      ...staticRoutes,
      ...accessoryRoutes,
      ...partRoutes,
      ...serviceRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static routes if dynamic content fails
    return staticRoutes
  }
}
