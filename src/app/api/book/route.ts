import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedClient, calendar } from '@/lib/google-auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, buyerEmail, startTime } = body

    if (!sellerId || !buyerEmail || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get seller email
    const { data: seller, error: sellerError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', sellerId)
      .single()

    if (sellerError || !seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    // Get buyer name
    const { data: buyer, error: buyerError } = await supabase
      .from('users')
      .select('name')
      .eq('email', buyerEmail)
      .single()

    if (buyerError || !buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    const auth = await getAuthenticatedClient(seller.email)

    const startDateTime = new Date(startTime)
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hour

    const event = {
      summary: 'Appointment',
      description: `Appointment with ${buyer.name}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: seller.email },
        { email: buyerEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `appointment-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    }

    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    })

    // Save appointment to DB
    const { data: buyerData } = await supabase
      .from('users')
      .select('id')
      .eq('email', buyerEmail)
      .single()

    if (buyerData) {
      await supabase
        .from('appointments')
        .insert({
          seller_id: sellerId,
          buyer_id: buyerData.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          event_id: response.data.id,
          meet_link: response.data.hangoutLink,
        })
    }

    return NextResponse.json({ event: response.data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 })
  }
}
