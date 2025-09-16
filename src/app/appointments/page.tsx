'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Appointment {
  id: string
  start_time: string
  end_time: string
  title: string
  description: string
  meet_link: string
  seller: { name: string; email: string }
  buyer: { name: string; email: string }
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetchAppointments()
    }
  }, [session])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div>Please sign in to view appointments.</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{appt.title}</h2>
              <p>{appt.description}</p>
              <p>Start: {new Date(appt.start_time).toLocaleString()}</p>
              <p>End: {new Date(appt.end_time).toLocaleString()}</p>
              <p>Seller: {appt.seller.name} ({appt.seller.email})</p>
              <p>Buyer: {appt.buyer.name} ({appt.buyer.email})</p>
              {appt.meet_link && (
                <p>
                  Meet Link: <a href={appt.meet_link} target="_blank" rel="noopener noreferrer">{appt.meet_link}</a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
