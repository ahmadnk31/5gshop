import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Base SEO configuration
export const siteConfig = {
  name: "5gphones Leuven",
  title: "5gphones Leuven - Device Repair & Accessories",
  description: "Professional device repair services and premium accessories for smartphones, tablets, laptops, and more in Leuven, Belgium.",
  url: "https://5gphones.be",
  ogImage: "/og-image.png",
  keywords: [
    "phone repair",
    "device repair", 
    "smartphone accessories",
    "Leuven repair shop",
    "iPhone repair",
    "Samsung repair", 
    "tablet repair",
    "laptop repair",
    "screen replacement",
    "battery replacement",
    "phone cases",
    "chargers",
    "Belgium",
    "Leuven"
  ],
  author: "5gphones Leuven",
  creator: "5gphones Leuven",
  publisher: "5gphones Leuven",
  type: "website",
  locale: "en_US",
  alternateLocales: ["nl_BE", "fr_BE"],
  twitter: {
    card: "summary_large_image",
    site: "@5gphones",
    creator: "@5gphones"
  }
}

// Base metadata that's used across all pages
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en': '/en',
      'nl': '/nl',
      'fr': '/fr',
      'x-default': '/en'
    }
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    alternateLocale: siteConfig.alternateLocales,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
        type: 'image/png'
      }
    ]
  },
  twitter: {
    ...siteConfig.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' }
    ]
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000'
  }
}

// Helper function to generate page-specific metadata
export async function generatePageMetadata({
  title,
  description,
  path = '',
  images,
  keywords,
  locale = 'en',
  noIndex = false,
  type = 'website'
}: {
  title?: string
  description?: string
  path?: string
  images?: string[]
  keywords?: string[]
  locale?: string
  noIndex?: boolean
  type?: 'website' | 'article' | 'product'
}): Promise<Metadata> {
  const url = `${siteConfig.url}${path}`
  const pageImages = images || [siteConfig.ogImage]
  
  return {
    title,
    description,
    keywords: keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords,
    alternates: {
      canonical: url,
      languages: {
        'en': `/en${path}`,
        'nl': `/nl${path}`,
        'fr': `/fr${path}`,
        'x-default': `/en${path}`
      }
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: type === 'product' ? 'website' : type, // OpenGraph doesn't support 'product' type
      url,
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: pageImages.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: title || siteConfig.title
      }))
    },
    twitter: {
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: pageImages
    }
  }
}

// Specific metadata generators for different page types
export async function generateProductMetadata({
  productName,
  description,
  price,
  images,
  category,
  brand,
  availability = 'in_stock',
  path,
  locale = 'en'
}: {
  productName: string
  description: string
  price?: number
  images?: string[]
  category?: string
  brand?: string
  availability?: 'in_stock' | 'out_of_stock' | 'preorder'
  path: string
  locale?: string
}): Promise<Metadata> {
  const title = `${productName} | ${siteConfig.name}`
  const keywords = [
    productName.toLowerCase(),
    category?.toLowerCase(),
    brand?.toLowerCase(),
    'buy online',
    'Belgium',
    'Leuven'
  ].filter(Boolean) as string[]

  const baseMetadata = await generatePageMetadata({
    title,
    description,
    path,
    images,
    keywords,
    locale,
    type: 'product'
  })

  // Add structured data for products
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description,
    ...(images?.length && { image: images }),
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    ...(category && { category }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: 'EUR',
        availability: `https://schema.org/${availability.replace('_', '')}`
      }
    }),
    manufacturer: {
      '@type': 'Organization',
      name: siteConfig.name
    }
  }

  const otherMeta: { [key: string]: string | number | (string | number)[] } = {
    'product:price:currency': 'EUR',
    'product:availability': availability
  }
  
  if (price) otherMeta['product:price:amount'] = price.toString()
  if (brand) otherMeta['product:brand'] = brand
  if (category) otherMeta['product:category'] = category

  return {
    ...baseMetadata,
    other: {
      ...(baseMetadata.other || {}),
      ...otherMeta
    }
  }
}

export async function generateServiceMetadata({
  serviceName,
  description,
  price,
  duration,
  deviceTypes,
  path,
  locale = 'en'
}: {
  serviceName: string
  description: string
  price?: number
  duration?: number
  deviceTypes?: string[]
  path: string
  locale?: string
}): Promise<Metadata> {
  const title = `${serviceName} | ${siteConfig.name}`
  const keywords = [
    serviceName.toLowerCase(),
    'repair service',
    'Leuven',
    'Belgium',
    ...(deviceTypes || [])
  ]

  return generatePageMetadata({
    title,
    description,
    path,
    keywords,
    locale,
    type: 'article'
  })
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Leuven',
      addressRegion: 'Vlaams-Brabant',
      postalCode: '3000',
      addressCountry: 'BE'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+32-XXX-XXX-XXX',
      contactType: 'customer service',
      areaServed: 'BE',
      availableLanguage: ['en', 'nl', 'fr']
    },
    sameAs: [
      'https://www.facebook.com/5gphones',
      'https://www.instagram.com/5gphones',
      'https://twitter.com/5gphones'
    ]
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}#business`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    image: `${siteConfig.url}/logo.png`,
    telephone: '+32-XXX-XXX-XXX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Leuven',
      addressRegion: 'Vlaams-Brabant',
      postalCode: '3000',
      addressCountry: 'BE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '50.8798',
      longitude: '4.7005'
    },
    openingHours: [
      'Mo-Fr 09:00-18:00',
      'Sa 10:00-16:00'
    ],
    priceRange: '€€',
    servesCuisine: null,
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '50.8798',
        longitude: '4.7005'
      },
      geoRadius: '50000'
    }
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}#business`
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    ],
    inLanguage: ['en', 'nl', 'fr']
  }
}
