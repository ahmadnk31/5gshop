import { MetadataRoute } from 'next'
import { getAccessories } from '@/app/actions/accessory-actions'
import { DatabaseService } from '@/lib/database'
import { siteConfig } from '@/lib/seo'

// Revalidate sitemap every hour (3600 seconds)
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use base URL from SEO config
  const baseUrl = siteConfig.url || 'https://5gphones.be'
  const locales = ['en', 'nl', 'fr']
  
  // Static pages - exclude auth pages (they shouldn't be indexed)
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/accessories', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/parts', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/repairs', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/quote', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/privacy', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFreq: 'yearly' as const },
  ]

  // Generate routes for all locales
  const staticRoutes = staticPages.flatMap(page => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    }))
  )

  try {
    // Dynamic product pages
    const [accessories, parts] = await Promise.all([
      getAccessories(),
      DatabaseService.getAllPartsSimple()
    ])

    // Helper function to create slug from name and ID
    const createSlug = (name: string, id: string): string => {
      const nameSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return `${nameSlug}-${id}`;
    };

    // Accessory pages (all locales) - using slug format
    // Only include accessories that are in stock or have stock > 0
    const accessoryRoutes = accessories
      .filter((accessory: any) => accessory.inStock !== undefined && accessory.inStock > 0)
      .flatMap((accessory: any) => {
        const slug = createSlug(accessory.name, accessory.id);
        return locales.map(locale => ({
          url: `${baseUrl}/${locale}/accessories/${slug}`,
          lastModified: accessory.updatedAt ? new Date(accessory.updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      });

    // Part pages (all locales) - using slug format
    // Only include parts that are in stock or have stock > 0
    const partRoutes = parts
      .filter((part: any) => part.inStock !== undefined && part.inStock > 0)
      .flatMap((part: any) => {
        const slug = createSlug(part.name, part.id);
        return locales.map(locale => ({
          url: `${baseUrl}/${locale}/parts/${slug}`,
          lastModified: part.updatedAt ? new Date(part.updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      });

    // Device type pages for repairs (hierarchical structure)
    const deviceTypes = ['smartphone', 'tablet', 'laptop', 'smartwatch', 'desktop', 'gaming-console'];
    const repairRoutes = deviceTypes.flatMap(deviceType =>
      locales.map(locale => ({
        url: `${baseUrl}/${locale}/repairs/${deviceType}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    );

    return [
      ...staticRoutes,
      ...accessoryRoutes,
      ...partRoutes,
      ...repairRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static routes if dynamic content fails
    return staticRoutes
  }
}
