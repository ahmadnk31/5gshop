'use client'

import Script from 'next/script'

interface StructuredDataProps {
  data: object | object[]
}

export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]
  
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd)
      }}
    />
  )
}
