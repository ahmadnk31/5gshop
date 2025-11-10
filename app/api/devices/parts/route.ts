import { NextResponse } from 'next/server'
import { getPartsByDeviceModel } from '@/app/actions/device-catalog-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    
    if (!type || !model) {
      return NextResponse.json(
        { error: 'Device type and model are required' },
        { status: 400 }
      )
    }
    
    const parts = await getPartsByDeviceModel(type as any, brand || '', model)
    
    return NextResponse.json(parts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching parts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    )
  }
}
