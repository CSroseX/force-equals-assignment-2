import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'seller')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sellers: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, refreshToken } = body

    if (!email || !refreshToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert seller record with encrypted refresh token
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          email,
          name,
          role: 'seller',
          refresh_token: refreshToken,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Seller saved', seller: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
