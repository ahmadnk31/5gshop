import { NextResponse } from 'next/server'
import { getHomepageParts } from '@/app/actions/homepage-parts'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

export async function GET() {
  try {
    const parts = await getHomepageParts()
    
    return NextResponse.json(parts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching homepage parts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage parts' },
      { status: 500 }
    )
  }
}
