import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Base SEO configuration
export const siteConfig = {
  name: "5gphones Leuven",
  title: "5gphones Leuven - Phone Repair & Mobile Accessories | GSM Reparatie",
  description: "Professional phone repair & mobile device services in Leuven. iPhone, Samsung, Huawei repair ✓ Screen replacement ✓ Battery repair ✓ Fast service ✓ Warranty | Professionele GSM reparatie en telefoon accessoires.",
  url: "https://5gphones.be",
  ogImage: "/5g-og.png",
  keywords: [
    // English primary keywords (international/student audience)
    "phone repair leuven",
    "mobile repair leuven",
    "smartphone repair leuven",
    "device repair leuven",
    "cell phone repair leuven",
    "iphone repair leuven",
    "samsung repair leuven",
    "screen repair leuven",
    "screen replacement leuven",
    "battery replacement leuven",
    "phone shop leuven",
    "mobile shop leuven",
    "electronics repair leuven",
    "tablet repair leuven",
    "laptop repair leuven",
    
    // Dutch/Flemish keywords (local audience)
    "gsm reparatie leuven",
    "telefoon reparatie leuven", 
    "smartphone reparatie leuven",
    "iphone reparatie leuven",
    "samsung reparatie leuven",
    "tablet reparatie leuven",
    "scherm reparatie leuven",
    "batterij vervanging leuven",
    "gsm winkel leuven",
    "telefoon winkel leuven",
    "smartphone winkel leuven",
    
    // Accessory keywords (English + Dutch)
    "phone accessories leuven",
    "mobile accessories leuven",
    "smartphone accessories leuven",
    "phone cases leuven",
    "phone chargers leuven",
    "screen protectors leuven",
    "wireless earbuds leuven",
    "power banks leuven",
    "telefoon accessoires leuven",
    "gsm accessoires leuven",
    "smartphone hoesjes leuven",
    "telefoon opladers leuven",
    
    // Brand-specific (bilingual)
    "iphone repair leuven",
    "samsung repair leuven",
    "huawei repair leuven",
    "xiaomi repair leuven",
    "oneplus repair leuven",
    "google pixel repair leuven",
    "oppo repair leuven",
    "realme repair leuven",
    "iphone reparatie leuven",
    "samsung reparatie leuven",
    "huawei reparatie leuven",
    
    // Service-specific (English)
    "fast phone repair",
    "same day repair",
    "quick screen fix",
    "battery service",
    "water damage repair",
    "charging port repair",
    "camera repair",
    "software repair",
    
    // Service-specific (Dutch)
    "snelle reparatie",
    "goedkope reparatie",
    "reparatie met garantie",
    "waterschap reparatie",
    "camera reparatie",
    "software reparatie",
    
    // Location variations (English)
    "leuven phone repair",
    "leuven mobile repair",
    "phone repair near me leuven",
    "repair shop leuven",
    "electronics store leuven",
    "phone store leuven center",
    "bondgenotenlaan phone repair",
    
    // Location variations (Dutch)
    "leuven gsm reparatie",
    "leuven telefoon reparatie",
    "reparatie leuven centrum",
    "gsm winkel leuven centrum",
    "telefoon reparatie bondgenotenlaan",
    
    // Student-focused keywords
    "student phone repair leuven",
    "affordable repair leuven",
    "cheap phone repair leuven",
    "budget phone repair",
    "student discount leuven",
    
    // General location
    "Leuven",
    "Belgium",
    "België", 
    "Vlaams-Brabant",
    "3000 Leuven",
    "Flemish Brabant"
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
        url: `${siteConfig.url}${siteConfig.ogImage}`,
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
    images: [`${siteConfig.url}${siteConfig.ogImage}`]
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
    // English service keywords
    'repair service',
    'phone repair',
    'mobile repair',
    'device repair',
    'smartphone repair',
    'tablet repair',
    'laptop repair',
    'screen repair',
    'battery repair',
    'fast repair',
    'professional repair',
    'affordable repair',
    'same day repair',
    price ? `€${price}` : '',
    duration ? `${duration} minutes` : '',
    // Location keywords (English)
    'repair Leuven',
    'repair Belgium',
    'phone repair Leuven',
    'mobile repair Leuven',
    'device repair Leuven',
    'repair shop Leuven',
    'electronics repair Leuven',
    // Dutch service keywords
    'reparatie service',
    'GSM reparatie',
    'telefoon reparatie',
    'smartphone reparatie',
    'tablet reparatie',
    'scherm reparatie',
    'batterij reparatie',
    'snelle reparatie',
    'professionele reparatie',
    'goedkope reparatie',
    // Location keywords (Dutch)
    'reparatie Leuven',
    'GSM reparatie Leuven',
    'telefoon reparatie Leuven',
    'reparatie België',
    // Brand and general
    '5gphones',
    '5gphones Leuven',
    '5gphones repair',
    '5gphones reparatie',
    ...(deviceTypes || []),
    'smartphone',
    'tablet',
    'laptop',
    'phone',
    'mobile',
    'electronics',
    'Leuven',
    'Belgium',
    'België',
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
    logo: `/logo.svg`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bondgenotenlaan 84A',
      addressLocality: 'Leuven',
      addressRegion: 'Vlaams-Brabant',  
      postalCode: '3000',
      addressCountry: 'BE'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+32-467871205',
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
      'Phone Repair Leuven',
      'Mobile Repair Leuven',
      'GSM Reparatie Leuven',
      'Telefoon Reparatie Leuven',
      'Smartphone Repair Shop Leuven'
    ],
    url: siteConfig.url,
    description: 'Professional phone repair, mobile device services and smartphone accessories in Leuven. iPhone, Samsung, Huawei repair specialist with warranty. | Professionele GSM reparatie en smartphone accessoires in Leuven met garantie.',
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
      name: 'Repair Services | Reparatie Diensten',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'iPhone Repair | iPhone Reparatie',
            description: 'Professional iPhone repair service in Leuven. Screen replacement, battery replacement, camera repair. | Professionele iPhone reparatie in Leuven.'
          }
        },
        {
          '@type': 'Offer', 
          itemOffered: {
            '@type': 'Service',
            name: 'Samsung Repair | Samsung Reparatie',
            description: 'Samsung smartphone and tablet repair services. All models supported. | Samsung smartphone en tablet reparatie voor alle modellen.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service', 
            name: 'Screen Repair | Scherm Reparatie',
            description: 'Fast screen repair and replacement for all smartphones. Same day service available. | Snelle scherm reparatie voor alle smartphones.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Battery Replacement | Batterij Vervanging', 
            description: 'Battery replacement service for smartphones and tablets. Quality batteries with warranty. | Batterij vervanging met garantie.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Water Damage Repair | Waterschade Reparatie',
            description: 'Water damage recovery service for all devices. Professional cleaning and repair. | Waterschade herstel voor alle toestellen.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Phone Accessories | Telefoon Accessoires',
            description: 'Wide range of phone accessories, cases, chargers, screen protectors. | Breed assortiment telefoon accessoires en onderdelen.'
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
          name: 'Sarah Johnson'
        },
        reviewRating: {
          '@type': 'Rating', 
          ratingValue: 5
        },
        reviewBody: 'Excellent service! My iPhone screen was repaired quickly and professionally. Great prices and friendly staff. Highly recommend for anyone in Leuven!'
      },
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
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Michael Chen'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5
        },
        reviewBody: 'Best phone repair shop in Leuven! Fixed my Samsung Galaxy same day. Very professional and affordable.'
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
