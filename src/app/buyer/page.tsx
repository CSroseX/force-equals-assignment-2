'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'

// --- Interface Definitions ---
interface Seller {
  id: string
  name: string
  email: string
  image?: string
  online: boolean
}

interface BusyTime {
  start: string
  end: string
}

interface AvailabilitySchedule {
    [key: string]: { start: string; end: string }[];
}


// --- Reusable Icon & Loading Components ---
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.922C34.79 5.232 29.623 3 24 3C12.955 3 4 11.955 4 23s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.332 2.625-2.074 5.631-2.074 8.809c0 3.178.742 6.184 2.074 8.809L11.05 29.648C9.72 27.224 9 24.542 9 21.5s.72-5.724 2.05-8.148L6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.757-3.714C30.636 36.753 27.463 38 24 38c-5.842 0-10.858-3.518-12.607-8.381l-4.95 3.886C9.023 39.525 15.908 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-.792 2.447-2.233 4.515-4.092 5.841L34.15 37.95C39.193 33.718 42.418 27.352 42.418 20c0-1.341-.138-2.65-.389-3.917z"></path></svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
  const [sellers, setSellers] = useState<Seller[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', online: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', online: false },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', online: false },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', online: false },
  ])
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Record<string, Date[]>>({})
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedSeller && selectedSeller.online) {
      setIsLoadingSlots(true);
      setAvailableSlots({});
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      fetch(`/api/availability/${selectedSeller.id}?startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.json())
        .then(data => {
          const slots = generateAvailableSlots(data.busy || [], data.schedule);
          // Group slots by date string
          const groupedSlots = slots.reduce((acc, slot) => {
            const dateKey = slot.toDateString();
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(slot);
            return acc;
          }, {} as Record<string, Date[]>);

          setAvailableSlots(groupedSlots);
        })
        .catch(console.error)
        .finally(() => setIsLoadingSlots(false));
    } else {
      // Clear slots if seller is not online or deselected
      setAvailableSlots({});
    }
  }, [selectedSeller])
  
  // --- Core Logic ---
  const generateAvailableSlots = (busy: BusyTime[], schedule: AvailabilitySchedule) => {
    const slots: Date[] = [];
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slotDuration = 60; // in minutes

    for (let d = 0; d < 7; d++) { // Check for the next 7 days
        const currentDate = new Date();
        currentDate.setDate(now.getDate() + d);
        const dayName = daysOfWeek[currentDate.getDay()];
        
        const daySchedule = schedule ? schedule[dayName] : [];
        if (!daySchedule || daySchedule.length === 0) continue;

        for (const interval of daySchedule) {
            const [startHour, startMinute] = interval.start.split(':').map(Number);
            const [endHour, endMinute] = interval.end.split(':').map(Number);

            let slotTime = new Date(currentDate);
            slotTime.setHours(startHour, startMinute, 0, 0);
            
            let endTime = new Date(currentDate);
            endTime.setHours(endHour, endMinute, 0, 0);

            while (slotTime < endTime) {
                const slotEnd = new Date(slotTime.getTime() + slotDuration * 60 * 1000);
                if (slotEnd > endTime) break; // Ensure slot doesn't exceed the interval
                
                if (slotTime > now) {
                    const isBusy = busy.some(b => {
                        const busyStart = new Date(b.start);
                        const busyEnd = new Date(b.end);
                        return (slotTime < busyEnd && slotEnd > busyStart);
                    });

                    if (!isBusy) {
                        slots.push(new Date(slotTime));
                    }
                }
                slotTime.setMinutes(slotTime.getMinutes() + slotDuration);
            }
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
      if (response.ok) {
        setBookingStatus('success');
      } else {
        const errorData = await response.json();
        console.error("Booking failed:", errorData.error);
        setBookingStatus('error');
      }
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
    }
  };

  const closeModal = () => {
    setBookingStatus('idle');
    setSelectedSlot(null);
    // Refresh availability after booking
    if (selectedSeller) {
      const currentSeller = { ...selectedSeller };
      setSelectedSeller(null); // Deselect to clear slots
      setTimeout(() => setSelectedSeller(currentSeller), 100); // Reselect to trigger refresh
    }
  }
  
  // Filter sellers based on search query
  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Render Logic ---
  if (status === 'loading') return <LoadingSpinner text="Authenticating..." />

  if (!session) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center transform hover:scale-105 transition-transform duration-300">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-semibold text-gray-700">{session.user?.name}</p>
            </div>
            {session.user?.image && <img src={session.user.image} alt="User Avatar" className="w-10 h-10 rounded-full" />}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition-all">
              <LogoutIcon /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Step 1: Select a Seller */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">1. Select a Seller</h2>
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <SearchIcon /> </div>
                <input type="text" placeholder="Search for a seller..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {filteredSellers.length > 0 ? filteredSellers.map(seller => (
                  <div key={seller.id} className={`flex items-center p-4 rounded-lg transition-all border-2 ${seller.online ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} ${selectedSeller?.id === seller.id ? 'bg-blue-50 border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`} onClick={seller.online ? () => setSelectedSeller(seller) : undefined}>
                      <img src={seller.image || '/default-avatar.png'} alt={seller.name} className="w-12 h-12 rounded-full mr-4" />
                      <div className="flex-1">
                          <p className="font-bold text-gray-900">{seller.name}</p>
                          <p className="text-sm text-gray-500">{seller.email}</p>
                          {seller.online && <span className="text-green-600 text-xs font-medium">Online</span>}
                      </div>
                      {seller.online && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                  </div>
              )) : <p className="text-center text-gray-500 pt-4">No sellers found.</p>}
            </div>
          </div>

          {/* Step 2: Pick a Time Slot (conditionally rendered) */}
          <div className="md:col-span-2">
            {selectedSeller && (
              <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">2. Pick a Time Slot for {selectedSeller.name}</h2>
                {isLoadingSlots ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span>Fetching available times...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(availableSlots).length > 0 ? Object.entries(availableSlots).map(([date, slots]) => (
                        <div key={date}>
                            <h3 className="font-bold text-lg text-gray-700 mb-3">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {slots.map((slot, index) => (
                                    <button key={index} className="flex items-center justify-center text-center p-3 border rounded-lg font-semibold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all hover:-translate-y-1" onClick={() => setSelectedSlot(slot)}>
                                        <ClockIcon /> {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <p className="col-span-full text-center text-gray-500 py-10">No available slots found for this seller in the next week.</p>
                    )}
                  </div>
                )}
              </div>
            )}
            {!selectedSeller && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-100 rounded-xl p-10 border-2 border-dashed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>
                    <h3 className="text-lg font-semibold">Select a seller to see their availability</h3>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>

    {/* Booking Confirmation Modal */}
    {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all animate-scale-in">
                {bookingStatus === 'idle' && (
                    <Fragment>
                        <h3 className="text-xl font-bold mb-2">Confirm Your Appointment</h3>
                        <p className="text-gray-600 mb-6">Book with <span className="font-semibold">{selectedSeller?.name}</span> on <br/> <span className="font-semibold">{selectedSlot.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span> at <span className="font-semibold">{selectedSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setSelectedSlot(null)} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                            <button onClick={handleBookAppointment} className="py-2 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Confirm</button>
                        </div>
                    </Fragment>
                )}
                {bookingStatus === 'booking' && <LoadingSpinner text="Booking..." />}
                {bookingStatus === 'success' && (
                    <Fragment>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"><svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                        <h3 className="text-xl font-bold text-green-600 mb-2">Success!</h3>
                        <p className="text-gray-600 mb-6">Your appointment is confirmed. Check your Google Calendar!</p>
                        <button onClick={closeModal} className="py-2 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">Done</button>
                    </Fragment>
                )}
                {bookingStatus === 'error' && (
                     <Fragment>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"><svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div>
                        <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">Something went wrong. The slot might have been taken. Please try again.</p>
                        <button onClick={closeModal} className="py-2 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">Close</button>
                    </Fragment>
                )}
            </div>
        </div>
    )}
    </Fragment>
  )
}