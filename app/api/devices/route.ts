import { NextResponse } from 'next/server'
import { getAllDevices } from '@/app/actions/device-management-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // 10 minutes

export async function GET() {
  try {
    const devices = await getAllDevices()
    
    return NextResponse.json(devices, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    console.error('API Error fetching devices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}
