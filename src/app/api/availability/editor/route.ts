import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, schedule } = body

    if (!sellerId || !schedule) {
      return NextResponse.json({ error: 'sellerId and schedule are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('seller_availability')
      .upsert(
        {
          seller_id: sellerId,
          availability: schedule,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'seller_id' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Availability saved successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
