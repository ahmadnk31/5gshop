import { NextResponse } from 'next/server'
import { getRepairServices } from '@/app/actions/repair-services-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

export async function GET() {
  try {
    const services = await getRepairServices()
    
    return NextResponse.json(services, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('API Error fetching repair services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repair services' },
      { status: 500 }
    )
  }
}
