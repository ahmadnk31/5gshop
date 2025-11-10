import { NextResponse } from 'next/server'
import { getModelsByBrand } from '@/app/actions/device-catalog-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // 10 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    
    if (!type || !brand) {
      return NextResponse.json(
        { error: 'Device type and brand are required' },
        { status: 400 }
      )
    }
    
    const models = await getModelsByBrand(type as any, brand)
    
    return NextResponse.json(models, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('API Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
