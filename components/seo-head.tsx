import { Metadata } from 'next'
import { StructuredData } from './structured-data'

interface SEOComponentProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object | object[]
  alternateUrls?: { [locale: string]: string }
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  noIndex = false,
  structuredData,
  alternateUrls
}: SEOComponentProps) {
  return (
    <>
      {/* Additional meta tags that can't be handled by Next.js metadata API */}
      {keywords && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}

      {alternateUrls && Object.entries(alternateUrls).map(([locale, url]) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}

      {/* Additional SEO meta tags */}
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Security and performance headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Performance hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      {structuredData && <StructuredData data={structuredData} />}
    </>
  )
}

// Helper function to generate breadcrumb structured data
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
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

// Helper function to generate review/rating structured data
export function generateReviewSchema(reviews: Array<{
  author: string
  rating: number
  reviewBody: string
  datePublished: string
}>, itemName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
      reviewCount: reviews.length,
      bestRating: 5
    }
  }
}
