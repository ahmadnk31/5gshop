import { NextResponse } from 'next/server'
import { getAccessories } from '@/app/actions/accessory-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    
    const accessories = await getAccessories()
    
    // Get featured accessories (top by stock)
    const featured = accessories
      .filter((acc) => acc.inStock > 0)
      .sort((a, b) => b.inStock - a.inStock)
      .slice(0, limit)
    
    return NextResponse.json(featured, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching featured accessories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured accessories' },
      { status: 500 }
    )
  }
}
