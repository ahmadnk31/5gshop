import { NextResponse } from 'next/server'
import { getDeviceTypes } from '@/app/actions/device-catalog-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // 10 minutes

export async function GET() {
  try {
    const deviceTypes = await getDeviceTypes()
    
    return NextResponse.json(deviceTypes, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('API Error fetching device types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch device types' },
      { status: 500 }
    )
  }
}
