import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Base SEO configuration
export const siteConfig = {
  name: "5gphones Leuven",
  title: "5gphones Leuven - GSM Reparatie & Telefoon Accessoires",
  description: "Professionele GSM reparatie, telefoon reparatie en smartphone accessoires in Leuven. iPhone reparatie, Samsung reparatie, tablet reparatie. Snelle service en garantie.",
  url: "https://5gphones.be",
  ogImage: "https://5gphones.be/og.png",
  keywords: [
    // Dutch/Flemish primary keywords
    "gsm reparatie leuven",
    "telefoon reparatie leuven", 
    "smartphone reparatie leuven",
    "iphone reparatie leuven",
    "samsung reparatie leuven",
    "tablet reparatie leuven",
    "telefoon accessoires leuven",
    "gsm winkel leuven",
    "smartphone winkel leuven",
    "telefoon winkel leuven",
    "gsm onderdelen leuven",
    "telefoon onderdelen leuven",
    "scherm reparatie leuven",
    "batterij vervanging leuven",
    
    // English keywords for international visitors
    "phone repair leuven",
    "device repair leuven", 
    "smartphone repair leuven",
    "mobile repair leuven",
    "cell phone repair leuven",
    "iphone repair leuven",
    "samsung repair leuven", 
    "tablet repair leuven",
    "laptop repair leuven",
    "screen replacement leuven",
    "battery replacement leuven",
    "phone accessories leuven",
    "smartphone accessories leuven",
    "phone cases leuven",
    "chargers leuven",
    
    // Location variations
    "leuven gsm",
    "leuven telefoon",
    "leuven smartphone",
    "leuven reparatie",
    "gsm leuven centrum",
    "telefoon reparatie centrum leuven",
    "smartphone winkel centrum leuven",
    
    // Service-specific
    "gsm reparatie",
    "telefoon reparatie",
    "smartphone reparatie",
    "device repair",
    "phone repair",
    "mobile repair",
    "iphone reparatie",
    "samsung reparatie",
    "huawei reparatie",
    "xiaomi reparatie",
    "oneplus reparatie",
    "google pixel reparatie",
    
    // General location
    "Belgium",
    "België", 
    "Leuven",
    "Vlaams-Brabant",
    "3000 Leuven"
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
  
  // Ensure all image URLs are absolute
  const absolutePageImages = pageImages.map(img => 
    img.startsWith('http') ? img : `${siteConfig.url}${img.startsWith('/') ? '' : '/'}${img}`
  )
  
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
      images: absolutePageImages.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: title || siteConfig.title
      }))
    },
    twitter: {
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: absolutePageImages
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
    'online store',
    'online shopping',
    'smartphone accessories',
    'device accessories',
    'phone accessories',
    'smartphone parts',
    'device parts',
    'phone parts',
    'accessories',
    'parts',
    'repair parts',
    'electronics',
    'GSM',
    'GSM accessories',
    'GSM parts',
    'GSM Leuven',
    'GSM Belgium',
    '5gphones',
    '5gphones Leuven',
    '5gphones accessories',
    '5gphones parts',
    '5gphones repair',
    '5gphones electronics',
    '5gphones shop',
    '5gphones store',
    '5gphones Belgium',
    '5gphones Leuven',
    '5gphones accessories',
    '5gphones parts',
    '5gphones repair',
    '5gphones electronics',
    '5gphones shop',
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
    'device repair',
    'smartphone repair',
    'tablet repair',
    'laptop repair',
    price ? `€${price}` : '',
    duration ? `${duration} minutes` : '',
    'repair Leuven',
    'repair Belgium',
    '5gphones',
    '5gphones Leuven',
    '5gphones repair',
    '5gphones accessories',
    '5gphones parts',
    ...(deviceTypes || []),
    'smartphone',
    'tablet',
    'laptop',
    'phone',
    'accessories',
    'parts',
    'GSM',
    'electronics',
    'GSM Reparatie',
    'GSM Accessoires',
    'GSM Onderdelen',
    'GSM Leuven',
    'GSM België',
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
    '@type': ['LocalBusiness', 'ElectronicsStore', 'ComputerRepairService'],
    '@id': `${siteConfig.url}#business`,
    name: siteConfig.name,
    alternateName: [
      '5gphones',
      '5G Phones Leuven',
      'GSM Reparatie Leuven',
      'Telefoon Reparatie Leuven'
    ],
    url: siteConfig.url,
    description: 'Professionele GSM reparatie, telefoon reparatie en smartphone accessoires in Leuven. Specialist in iPhone, Samsung, Huawei reparaties met garantie.',
    image: [`${siteConfig.url}/logo.png`, `${siteConfig.url}/storefront.jpg`],
    telephone: '+32 466 13 41 81',
    email: 'info@5gphones.be',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bondgenotenlaan 84A',
      addressLocality: 'Leuven',
      addressRegion: 'Vlaams-Brabant',
      postalCode: '3000',
      addressCountry: 'BE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.8798,
      longitude: 4.7005
    },
    openingHours: [
      'Mo 10:00-18:00',
      'Tu 10:00-18:00', 
      'We 10:00-18:00',
      'Th 10:00-18:00',
      'Fr 10:00-18:00',
      'Sa 10:00-18:30'
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification', 
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:30'
      }
    ],
    priceRange: '€€',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Bancontact'],
    currenciesAccepted: 'EUR',
    areaServed: [
      {
        '@type': 'City',
        name: 'Leuven',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Vlaams-Brabant'
        }
      },
      {
        '@type': 'City', 
        name: 'Heverlee'
      },
      {
        '@type': 'City',
        name: 'Kessel-Lo'
      },
      {
        '@type': 'City',
        name: 'Wilsele'
      },
      {
        '@type': 'City',
        name: 'Wijgmaal'
      }
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 50.8798,
        longitude: 4.7005
      },
      geoRadius: '25000'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Repair Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'iPhone Reparatie',
            description: 'Professionele iPhone reparatie service in Leuven'
          }
        },
        {
          '@type': 'Offer', 
          itemOffered: {
            '@type': 'Service',
            name: 'Samsung Reparatie',
            description: 'Samsung smartphone en tablet reparatie'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service', 
            name: 'Scherm Reparatie',
            description: 'Snelle scherm reparatie voor alle smartphones'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Batterij Vervanging', 
            description: 'Batterij vervanging voor smartphones en tablets'
          }
        }
      ]
    },
    sameAs: [
      'https://www.facebook.com/5gphones',
      'https://www.instagram.com/5gphones',
      'https://twitter.com/5gphones',
      'https://www.google.com/maps/place/5gphones'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 127,
      bestRating: 5
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Jan Janssen'
        },
        reviewRating: {
          '@type': 'Rating', 
          ratingValue: 5
        },
        reviewBody: 'Uitstekende service! Mijn iPhone scherm werd snel en professioneel gerepareerd.'
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Marie Dupont'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5
        },
        reviewBody: 'Snelle reparatie en goede prijs. Aanrader voor GSM reparaties in Leuven!'
      }
    ]
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

// Helper function to generate FAQ structured data
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}
