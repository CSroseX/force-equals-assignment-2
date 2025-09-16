import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedClient, calendar } from '@/lib/google-auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  try {
    const { sellerId } = await params

    // Get seller email
    const { data: seller, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', sellerId)
      .single()

    if (error || !seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    const auth = await getAuthenticatedClient(seller.email)

    const now = new Date()
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const response = await calendar.freebusy.query({
      auth,
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: 'primary' }],
      },
    })

    const busy = response.data.calendars?.primary?.busy || []

    // Fetch manual availability from seller_availability table
    const { data: manualAvailabilityData, error: manualError } = await supabase
      .from('seller_availability')
      .select('availability')
      .eq('seller_id', sellerId)
      .single()

    let manualAvailability = {}
    if (!manualError && manualAvailabilityData) {
      manualAvailability = manualAvailabilityData.availability || {}
    }

    // Merge busy times and manual availability into one response
    return NextResponse.json({ busy, manualAvailability })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
