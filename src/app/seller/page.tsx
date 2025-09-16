'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

// --- Helper Components for Icons ---
const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.922C34.79 5.232 29.623 3 24 3C12.955 3 4 11.955 4 23s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691c-1.332 2.625-2.074 5.631-2.074 8.809c0 3.178.742 6.184 2.074 8.809L11.05 29.648C9.72 27.224 9 24.542 9 21.5s.72-5.724 2.05-8.148L6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.757-3.714C30.636 36.753 27.463 38 24 38c-5.842 0-10.858-3.518-12.607-8.381l-4.95 3.886C9.023 39.525 15.908 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-.792 2.447-2.233 4.515-4.092 5.841L34.15 37.95C39.193 33.718 42.418 27.352 42.418 20c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);


export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const [isSaved, setIsSaved] = useState(false)
  const [busyTimes, setBusyTimes] = useState<any[]>([])

  // Fix TypeScript errors for session properties
  const refreshToken = (session as any)?.refreshToken
  const userId = (session?.user as any)?.id

  useEffect(() => {
    if (session?.user?.email && refreshToken) {
      // Save seller to DB
      fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          refreshToken: refreshToken,
        }),
      })
        .then(() => setIsSaved(true))
        .catch(console.error)
    }
  }, [session, refreshToken])

  useEffect(() => {
    if (session?.user?.email && userId) {
      // Fetch availability for seller for the next 7 days
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      fetch(`/api/availability/${userId}?startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.json())
        .then(data => setBusyTimes(data.busy || []))
        .catch(console.error)
    }
  }, [session, userId])

  if (status === 'loading') return <LoadingSpinner />

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center transform transition-all hover:scale-105">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600 mb-8">Connect your Google Calendar to get started.</p>
          <button
            onClick={() => signIn('google')}
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>
        <p className="text-gray-500 mt-8 text-sm">Powered by Next.js & Google Calendar</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-semibold text-gray-700">{session.user?.name}</p>
                <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
            {session.user?.image && <img src={session.user.image} alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-blue-500 p-1" />}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
            >
              <LogoutIcon />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center mb-6 border-b pb-4">
            <CheckCircleIcon />
            <h2 className="text-xl font-semibold text-gray-800">
                {isSaved ? "Google Calendar Connected" : "Connecting to Google Calendar..."}
            </h2>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <CalendarIcon />
              Your Google Calendar
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=chitranshsaxena67%40gmail.com&ctz=Asia%2FKolkata"
                style={{border: 0}}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <CalendarIcon />
              Your Busy Schedule for the Next 7 Days
            </h3>
            {busyTimes.length === 0 ? (
              <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">It looks like you're free!</h3>
                <p className="mt-1 text-sm text-gray-500">No busy events were found in your calendar for the upcoming week.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {busyTimes.map((time: any, index: number) => (
                  <li key={index} className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-3 mr-4">
                      <CalendarIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {new Date(time.start).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(time.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(time.end).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
