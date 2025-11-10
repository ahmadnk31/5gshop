import { NextResponse } from 'next/server'
import { getBrandsByType } from '@/app/actions/device-catalog-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // 10 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (!type) {
      return NextResponse.json(
        { error: 'Device type is required' },
        { status: 400 }
      )
    }
    
    const brands = await getBrandsByType(type as any)
    
    return NextResponse.json(brands, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('API Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}
