import { NextResponse } from 'next/server'
import { getRepairServices } from '@/app/actions/repair-services-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '3')
    
    const services = await getRepairServices()
    
    // Get popular services (sorted by price)
    const popular = services
      .sort((a, b) => a.basePrice - b.basePrice)
      .slice(0, limit)
    
    return NextResponse.json(popular, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching popular services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular services' },
      { status: 500 }
    )
  }
}
