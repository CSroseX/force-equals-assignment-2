import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, availability } = body

    if (!sellerId || !availability) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For simplicity, store availability as JSON in a separate table or in users table (extend schema if needed)
    // Here, assuming a new table 'seller_availability' with columns: seller_id (UUID), availability (JSONB), updated_at (timestamp)

    const { data, error } = await supabase
      .from('seller_availability')
      .upsert(
        {
          seller_id: sellerId,
          availability,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'seller_id' }
      )
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Availability saved', availability: data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save availability' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    const { sellerId } = params

    const { data, error } = await supabase
      .from('seller_availability')
      .select('availability')
      .eq('seller_id', sellerId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Availability not found' }, { status: 404 })
    }

    return NextResponse.json({ availability: data.availability })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
