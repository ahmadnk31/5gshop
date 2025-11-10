import { NextResponse } from 'next/server'
import { getAccessories } from '@/app/actions/accessory-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

export async function GET() {
  try {
    const accessories = await getAccessories()
    
    return NextResponse.json(accessories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching accessories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accessories' },
      { status: 500 }
    )
  }
}
