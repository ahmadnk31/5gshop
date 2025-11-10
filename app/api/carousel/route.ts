import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

// Carousel items configuration
const carouselItems = [
  {
    type: 'accessory',
    id: 'accessory',
    imageUrl: '/hero-accessories.webp',
    link: '/accessories',
  },
  {
    type: 'part',
    id: 'part',
    imageUrl: '/hero-parts.webp',
    link: '/parts',
  },
  {
    type: 'repair',
    id: 'repair',
    imageUrl: '/hero-repairs.webp',
    link: '/repairs',
  },
  {
    type: 'usp',
    id: 'usp',
    imageUrl: '/hero-usp.webp',
    link: '/about',
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'nl'
    
    // Return carousel items (translations will be handled client-side)
    return NextResponse.json(carouselItems, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching carousel items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch carousel items' },
      { status: 500 }
    )
  }
}
