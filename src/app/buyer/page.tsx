'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'

// --- Interface Definitions ---
interface Seller {
  id: string
  name: string
  email: string
  image?: string
}

interface BusyTime {
  start: string
  end: string
}

// --- Reusable Icon & Loading Components ---
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.922C34.79 5.232 29.623 3 24 3C12.955 3 4 11.955 4 23s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.332 2.625-2.074 5.631-2.074 8.809c0 3.178.742 6.184 2.074 8.809L11.05 29.648C9.72 27.224 9 24.542 9 21.5s.72-5.724 2.05-8.148L6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.757-3.714C30.636 36.753 27.463 38 24 38c-5.842 0-10.858-3.518-12.607-8.381l-4.95 3.886C9.023 39.525 15.908 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-.792 2.447-2.233 4.515-4.092 5.841L34.15 37.95C39.193 33.718 42.418 27.352 42.418 20c0-1.341-.138-2.65-.389-3.917z"></path></svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const LoadingSpinner = ({ text = "Loading..."}) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">{text}</p>
    </div>
);

export default function BuyerPage() {
  const { data: session, status } = useSession()
  
  // State Management
  const [sellers, setSellers] = useState<Seller[]>([])
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Date[]>([])
  const [isLoadingSellers, setIsLoadingSellers] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/sellers')
        .then(res => res.json())
        .then(data => {
            setSellers(data.sellers || [])
            setIsLoadingSellers(false);
        })
        .catch(console.error)
    }
  }, [session])

  useEffect(() => {
    if (selectedSeller) {
      setIsLoadingSlots(true);
      setAvailableSlots([]);
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      fetch(`/api/availability/${selectedSeller.id}?startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.json())
        .then(data => {
          const slots = generateAvailableSlots(data.busy || [])
          setAvailableSlots(slots)
        })
        .catch(console.error)
        .finally(() => setIsLoadingSlots(false));
    }
  }, [selectedSeller])
  
  // --- Core Logic ---
  const generateAvailableSlots = (busy: BusyTime[]) => {
    const slots: Date[] = [];
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(startOfDay.getHours() + 1, 0, 0, 0); 
    
    for (let d = 0; d < 5; d++) {
        for (let h = 9; h < 17; h++) {
            const slotTime = new Date(startOfDay);
            slotTime.setDate(startOfDay.getDate() + d);
            slotTime.setHours(h, 0, 0, 0);
            if (slotTime < now) continue;

            const isBusy = busy.some(b => {
                const start = new Date(b.start);
                const end = new Date(b.end);
                const slotEnd = new Date(slotTime.getTime() + 60 * 60 * 1000);
                return (slotTime < end && slotEnd > start);
            });

            if (!isBusy) slots.push(slotTime);
        }
    }
    return slots;
  }

  const handleBookAppointment = async () => {
    if (!selectedSeller || !session?.user?.email || !selectedSlot) return;
    setBookingStatus('booking');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: selectedSeller.id,
          buyerEmail: session.user.email,
          startTime: selectedSlot.toISOString(),
          endTime: new Date(selectedSlot.getTime() + 60 * 60 * 1000).toISOString()
        }),
      });
      if (response.ok) setBookingStatus('success');
      else setBookingStatus('error');
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
    }
  };

  const closeModal = () => {
    setBookingStatus('idle');
    setSelectedSlot(null);
    if (selectedSeller) setSelectedSeller({ ...selectedSeller });
  }
  
  // Filter sellers based on search query
  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Render Logic ---
  if (status === 'loading') return <LoadingSpinner text="Authenticating..." />

  if (!session) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-green-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Appointment Booker</h1>
                <p className="text-gray-600 mb-8">Sign in to book a meeting with our experts.</p>
                <button
                    onClick={() => signIn('google')}
                    className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                >
                    <GoogleIcon /> Sign in with Google
                </button>
            </div>
        </div>
    );
  }

  return (
    <Fragment>
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-semibold text-gray-700">{session.user?.name}</p>
            </div>
            {session.user?.image && <img src={session.user.image} alt="User Avatar" className="w-12 h-12 rounded-full" />}
            <button onClick={() => signOut()} className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition-all">
              <LogoutIcon /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Step 1: Select a Seller */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">1. Select a Seller</h2>
            
            {/* Search Input */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search for a seller by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            {isLoadingSellers ? <p>Loading sellers...</p> : (
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                    {filteredSellers.map(seller => (
                        <div key={seller.id} className={`flex items-center p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedSeller?.id === seller.id ? 'bg-blue-50 border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`} onClick={() => setSelectedSeller(seller)}>
                            <img src={seller.image || '/default-avatar.png'} alt={seller.name} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-bold text-gray-900">{seller.name}</p>
                                <p className="text-sm text-gray-500">{seller.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Step 2: Pick a Time Slot (conditionally rendered) */}
          {selectedSeller && (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">2. Pick a Time Slot for {selectedSeller.name}</h2>
              {isLoadingSlots ? (
                  <div className="flex items-center justify-center h-full text-gray-500 py-10">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span>Fetching available times...</span>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {availableSlots.length > 0 ? availableSlots.map((slot, index) => (
                          <button key={index} className="flex items-center justify-center text-center p-3 border rounded-lg font-semibold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all hover:-translate-y-1" onClick={() => setSelectedSlot(slot)}>
                              <ClockIcon /> {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </button>
                      )) : (
                          <p className="col-span-full text-center text-gray-500 py-10">No available slots found for this seller in the next 5 days.</p>
                      )}
                  </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>

    {/* Booking Confirmation Modal */}
    {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
                {bookingStatus === 'idle' && (
                    <Fragment>
                        <h3 className="text-xl font-bold mb-2">Confirm Your Appointment</h3>
                        <p className="text-gray-600 mb-6">Book with <span className="font-semibold">{selectedSeller?.name}</span> on <br/> <span className="font-semibold">{selectedSlot.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span> at <span className="font-semibold">{selectedSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setSelectedSlot(null)} className="py-2 px-6 bg-gray-200 rounded-lg font-semibold">Cancel</button>
                            <button onClick={handleBookAppointment} className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold">Confirm</button>
                        </div>
                    </Fragment>
                )}
                {bookingStatus === 'booking' && <LoadingSpinner text="Booking..." />}
                {bookingStatus === 'success' && (
                    <Fragment>
                        <h3 className="text-xl font-bold text-green-600 mb-2">Success!</h3>
                        <p className="text-gray-600 mb-6">Your appointment is confirmed. Check your Google Calendar!</p>
                        <button onClick={closeModal} className="py-2 px-6 bg-green-600 text-white rounded-lg font-semibold">Done</button>
                    </Fragment>
                )}
                {bookingStatus === 'error' && (
                     <Fragment>
                        <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
                        <button onClick={closeModal} className="py-2 px-6 bg-red-600 text-white rounded-lg font-semibold">Close</button>
                    </Fragment>
                )}
            </div>
        </div>
    )}
    </Fragment>
  )
}