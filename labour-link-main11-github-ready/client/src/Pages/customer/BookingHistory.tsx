// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { API_URL } from '../../utils/api'

// function BookingHistory() {
//   const [allBookings, setAllBookings] = useState<any[]>([])
//   const [filter, setFilter] = useState('all')
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchBookings()
//   }, [])

//   /* const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const res = await fetch(`${API_URL}/api/bookings/customer`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const data = await res.json()
//       if (data.success) setAllBookings(data.data)
//     } catch (err) {
//       console.error('Failed to fetch bookings')
//     } finally {
//       setLoading(false)
//     }
// }*/
//     const fetchBookings = async () => {
//   try {
//     const token = localStorage.getItem('accessToken')

//     console.log('TOKEN:', token)
//     console.log('API URL:', `${API_URL}/api/bookings/customer`)
//     const res = await fetch(`${API_URL}/api/bookings/customer`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })

//     console.log('STATUS:', res.status)

//     const data = await res.json()
//     console.log('STATUS:', res.status)
//     console.log('BOOKINGS RESPONSE:', data)
//     if (data.success) {
//       setAllBookings(data.data)
//     }
//   }  catch (err) {
//   console.error('Failed to fetch bookings', err)
// } finally {
//     setLoading(false)
//   }
// }

//   const cancelBooking = async (bookingId: string) => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const res = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ reason: 'Cancelled by customer' })
//       })
//       const data = await res.json()
//       if (data.success) fetchBookings()
//     } catch (err) {
//       console.error('Failed to cancel booking')
//     }
//   }

//   const filtered = filter === 'all'
//     ? allBookings
//     : allBookings.filter((b: any) => b.status === filter)

//   const statusConfig: Record<string, { label: string; color: string }> = {
//     completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
//     in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
//     assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
//     searching: { label: 'Searching', color: 'bg-purple-100 text-purple-700' },
//     cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
//     expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700' }
//   }

//   const serviceIcons: Record<string, string> = {
//     Plumbing: '🔧', Electrical: '⚡', Carpentry: '🪚',
//     Painting: '🎨', 'AC Repair': '❄️', Cleaning: '🧹',
//     Mechanic: '🔩', 'Appliance Repair': '🔌'
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <Link to="/customer/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
//               <div className="w-px h-5 bg-gray-200" />
//               <span className="font-black text-gray-900">My Bookings</span>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-black text-gray-900 mb-2">Booking History</h1>
//           <p className="text-gray-500">Track and manage all your service bookings</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Total', value: allBookings.length, color: 'bg-blue-50 text-blue-600' },
//             { label: 'Completed', value: allBookings.filter((b: any) => b.status === 'completed').length, color: 'bg-green-50 text-green-600' },
//             { label: 'Active', value: allBookings.filter((b: any) => ['in_progress', 'assigned', 'searching'].includes(b.status)).length, color: 'bg-yellow-50 text-yellow-600' },
//             { label: 'Cancelled', value: allBookings.filter((b: any) => b.status === 'cancelled').length, color: 'bg-red-50 text-red-600' }
//           ].map(stat => (
//             <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
//               <p className="text-3xl font-black">{stat.value}</p>
//               <p className="text-sm font-semibold mt-1">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
//           {['all', 'completed', 'in_progress', 'assigned', 'cancelled'].map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
//                 filter === f
//                   ? 'bg-blue-600 text-white shadow-md'
//                   : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
//               }`}
//             >
//               {f === 'all' ? 'All Bookings' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//             </button>
//           ))}
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-16">
//             <div className="text-4xl mb-4 animate-spin">⚙️</div>
//             <p className="text-gray-500">Loading bookings...</p>
//           </div>
//         )}

//         {/* Bookings List */}
//         {!loading && (
//           <div className="space-y-4">
//             {filtered.map((booking: any) => (
//               <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">
//                       {serviceIcons[booking.serviceId?.name] || '🔧'}
//                     </div>
//                     <div>
//                       <p className="font-black text-gray-900 text-lg">
//                         {booking.serviceId?.name || 'Service'}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         👷 {booking.providerId?.name || 'Searching...'}
//                       </p>
//                       <p className="text-gray-400 text-xs mt-0.5">
//                         📍 {booking.address?.city}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-black text-gray-900 text-lg">
//                       ₹{booking.pricing?.totalAmount || 0}
//                     </p>
//                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusConfig[booking.status]?.color}`}>
//                       {statusConfig[booking.status]?.label}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <div className="flex items-center space-x-4">
//                     <p className="text-gray-400 text-xs">
//                       📅 {new Date(booking.createdAt).toLocaleDateString()}
//                     </p>
//                     <p className="text-gray-400 text-xs">🔖 {booking.bookingNumber}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     {['assigned', 'searching'].includes(booking.status) && (
//                       <button
//                         onClick={() => cancelBooking(booking._id)}
//                         className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {filtered.length === 0 && !loading && (
//               <div className="text-center py-16">
//                 <div className="text-6xl mb-4">📋</div>
//                 <h3 className="text-xl font-black text-gray-900 mb-2">No bookings found</h3>
//                 <p className="text-gray-500 mb-6">You have no {filter} bookings yet.</p>
//                 <Link to="/customer/book" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
//                   Book a Service
//                 </Link>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default BookingHistory  

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../utils/api'

function BookingHistory() {
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/api/bookings/customer`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setAllBookings(data.data)
    } catch (err) {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Cancelled by customer' })
      })
      const data = await res.json()
      if (data.success) fetchBookings()
    } catch (err) {
      console.error('Failed to cancel booking')
    }
  }

  const filtered = filter === 'all'
    ? allBookings
    : allBookings.filter((b: any) => b.status === filter)

  const statusConfig: Record<string, { label: string; color: string }> = {
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
    searching: { label: 'Searching', color: 'bg-purple-100 text-purple-700' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700' }
  }

  const serviceIcons: Record<string, string> = {
    Plumbing: '🔧', Electrical: '⚡', Carpentry: '🪚',
    Painting: '🎨', 'AC Repair': '❄️', Cleaning: '🧹',
    Mechanic: '🔩', 'Appliance Repair': '🔌'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/customer/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
              <div className="w-px h-5 bg-gray-200" />
              <span className="font-black text-gray-900">My Bookings</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Booking History</h1>
          <p className="text-gray-500">Track and manage all your service bookings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: allBookings.length, color: 'bg-blue-50 text-blue-600' },
            { label: 'Completed', value: allBookings.filter((b: any) => b.status === 'completed').length, color: 'bg-green-50 text-green-600' },
            { label: 'Active', value: allBookings.filter((b: any) => ['in_progress', 'assigned', 'searching'].includes(b.status)).length, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Cancelled', value: allBookings.filter((b: any) => b.status === 'cancelled').length, color: 'bg-red-50 text-red-600' }
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-sm font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {['all', 'completed', 'in_progress', 'assigned', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              {f === 'all' ? 'All Bookings' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {filtered.map((booking: any) => (
              <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">
                      {serviceIcons[booking.serviceId?.name] || '🔧'}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{booking.serviceId?.name || 'Service'}</p>
                      <p className="text-gray-500 text-sm">👷 {booking.providerId?.name || 'Searching...'}</p>
                      <p className="text-gray-400 text-xs mt-0.5">📍 {booking.address?.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-lg">₹{booking.pricing?.totalAmount || 0}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusConfig[booking.status]?.color}`}>
                      {statusConfig[booking.status]?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-400 text-xs">📅 {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-xs">🔖 {booking.bookingNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    {['assigned', 'searching'].includes(booking.status) && (
                      <button onClick={() => cancelBooking(booking._id)}
                        className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-100">
                        Cancel
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <Link to={`/customer/tracking?bookingId=${booking._id}`}
                        className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100">
                        📍 Track
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-6">You have no {filter} bookings yet.</p>
                <Link to="/customer/book" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
                  Book a Service
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingHistory