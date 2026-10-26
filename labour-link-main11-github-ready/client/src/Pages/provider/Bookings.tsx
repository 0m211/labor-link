// import { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { getSocket } from '../../hooks/useSocket'
// import { API_URL } from '../../utils/api'

// function ProviderBookings() {
//   const [bookings, setBookings] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [newRequest, setNewRequest] = useState<any>(null)
//   const [countdown, setCountdown] = useState(30)
//   const [isOnline, setIsOnline] = useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     fetchBookings()
//     setupSocket()
//     const user = JSON.parse(localStorage.getItem('user') || '{}')
//     if (!user.id && !user._id) {
//       navigate('/login')
//     }
//   }, [])

//   useEffect(() => {
//     if (newRequest && countdown > 0) {
//       const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
//       return () => clearTimeout(timer)
//     }
//     if (countdown === 0) setNewRequest(null)
//   }, [newRequest, countdown])

//   const setupSocket = () => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}')
//     const socket = getSocket()
//     socket.emit('join:provider', user.id || user._id)
//     socket.on('booking:new_request', (data: any) => {
//       setNewRequest(data)
//       setCountdown(30)
//     })
//     socket.on('booking:taken', () => {
//       setNewRequest(null)
//     })
//     return () => {
//       socket.off('booking:new_request')
//       socket.off('booking:taken')
//     }
//   }

//   const fetchBookings = async () => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const res = await fetch(`${API_URL}/api/bookings/provider`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const data = await res.json()
//       if (data.success) setBookings(data.data)
//     } catch (err) {
//       console.error('Failed to fetch bookings')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleOnline = async () => {
//     const newStatus = !isOnline
//     if (newStatus) {
//       navigator.geolocation.getCurrentPosition(async (pos) => {
//         try {
//           const token = localStorage.getItem('accessToken')
//           const res = await fetch(`${API_URL}/api/provider/availability`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               isOnline: true,
//               lat: pos.coords.latitude,
//               lng: pos.coords.longitude
//             })
//           })
//           const data = await res.json()
//           if (data.success) {
//             setIsOnline(true)
//             const socket = getSocket()
//             const user = JSON.parse(localStorage.getItem('user') || '{}')
//             socket.emit('join:provider', user.id || user._id)
//           }
//         } catch (err) {
//           console.error('Failed to go online')
//         }
//       }, () => {
//         alert('Please allow location access to go online')
//       })
//     } else {
//       try {
//         const token = localStorage.getItem('accessToken')
//         await fetch(`${API_URL}/api/provider/availability`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ isOnline: false })
//         })
//         setIsOnline(false)
//       } catch (err) {
//         console.error('Failed to go offline')
//       }
//     }
//   }

//   const acceptBooking = async (bookingId: string) => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const res = await fetch(`${API_URL}/api/provider/bookings/${bookingId}/accept`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       const data = await res.json()
//       if (data.success) {
//         setNewRequest(null)
//         fetchBookings()
//       } else {
//         alert(data.message || 'Failed to accept')
//       }
//     } catch (err) {
//       console.error('Failed to accept booking')
//     }
//   }

//   const rejectBooking = async (bookingId: string) => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       await fetch(`${API_URL}/api/provider/bookings/${bookingId}/reject`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       setNewRequest(null)
//     } catch (err) {
//       console.error('Failed to reject booking')
//     }
//   }

//   const updateStatus = async (bookingId: string, status: string, customerId: string) => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       const res = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ status })
//       })
//       const data = await res.json()
//       if (data.success) {
//         fetchBookings()
//         if (status === 'en_route') {
//           startLocationSharing(bookingId, customerId)
//         }
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const startLocationSharing = (bookingId: string, customerId: string) => {
//     const socket = getSocket()
//     const user = JSON.parse(localStorage.getItem('user') || '{}')
//     const watchId = navigator.geolocation.watchPosition(pos => {
//       socket.emit('location:update', {
//         bookingId,
//         providerId: user.id || user._id,
//         customerId,
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude
//       })
//     }, null, { enableHighAccuracy: true, maximumAge: 3000 })
//     setTimeout(() => navigator.geolocation.clearWatch(watchId), 7200000)
//   }

//   const statusConfig: Record<string, { label: string; color: string }> = {
//     completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
//     in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
//     assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
//     en_route: { label: 'En Route', color: 'bg-indigo-100 text-indigo-700' },
//     arrived: { label: 'Arrived', color: 'bg-purple-100 text-purple-700' },
//     cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
//   }

//   const nextStatus: Record<string, string> = {
//     assigned: 'en_route',
//     en_route: 'arrived',
//     arrived: 'in_progress',
//     in_progress: 'completed'
//   }

//   const nextStatusLabel: Record<string, string> = {
//     assigned: '🚗 Start Journey',
//     en_route: '📍 Mark Arrived',
//     arrived: '🔧 Start Work',
//     in_progress: '✅ Complete Job'
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <Link to="/provider/dashboard" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
//                 ← Back
//               </Link>
//               <div className="w-px h-5 bg-gray-200" />
//               <span className="font-bold text-gray-900">My Bookings</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="text-sm font-semibold text-gray-600">
//                 {isOnline ? '🟢 Online' : '🔴 Offline'}
//               </span>
//               <button
//                 onClick={toggleOnline}
//                 className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
//                   isOnline ? 'bg-green-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
//                   isOnline ? 'translate-x-7' : 'translate-x-1'
//                 }`} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {!isOnline && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-center">
//             <p className="text-yellow-800 font-semibold text-sm">
//               You are currently offline. Toggle online to receive booking requests.
//             </p>
//           </div>
//         )}

//         {newRequest && (
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 shadow-xl">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
//                   🔔
//                 </div>
//                 <div>
//                   <p className="text-white font-black text-lg">New Booking Request!</p>
//                   <p className="text-blue-200 text-sm">{newRequest.address?.city}</p>
//                   <p className="text-blue-300 text-xs">{newRequest.problemDescription}</p>
//                 </div>
//               </div>
//               <div className="bg-white bg-opacity-20 rounded-2xl px-3 py-2 text-center">
//                 <p className="text-white font-black text-2xl">{countdown}</p>
//                 <p className="text-blue-200 text-xs">secs</p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => acceptBooking(newRequest.bookingId)}
//                 className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-black hover:bg-blue-50 transition-all">
//                 ✓ Accept
//               </button>
//               <button onClick={() => rejectBooking(newRequest.bookingId)}
//                 className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 text-white py-3 rounded-xl font-black hover:bg-opacity-30 transition-all">
//                 ✗ Reject
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-3 gap-4 mb-8">
//           {[
//             { label: 'Total Jobs', value: bookings.length, color: 'bg-blue-50 text-blue-600' },
//             { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-green-50 text-green-600' },
//             { label: 'Active', value: bookings.filter(b => ['assigned', 'en_route', 'arrived', 'in_progress'].includes(b.status)).length, color: 'bg-yellow-50 text-yellow-600' }
//           ].map(stat => (
//             <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
//               <p className="text-3xl font-black">{stat.value}</p>
//               <p className="text-sm font-semibold mt-1">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {loading ? (
//           <div className="text-center py-16">
//             <div className="text-4xl mb-4 animate-spin">⚙️</div>
//             <p className="text-gray-500">Loading bookings...</p>
//           </div>
//         ) : bookings.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
//             <div className="text-6xl mb-4">📋</div>
//             <h3 className="text-xl font-black text-gray-900 mb-2">No bookings yet</h3>
//             <p className="text-gray-500 text-sm">Go online and wait for booking requests</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {bookings.map((booking: any) => (
//               <div key={booking._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
//                       🔧
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900">{booking.serviceId?.name || 'Service'}</p>
//                       <p className="text-gray-500 text-sm">👤 {booking.customerId?.name || 'Customer'}</p>
//                       <p className="text-gray-400 text-xs">📍 {booking.address?.street}, {booking.address?.city}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-gray-900 text-sm mb-1">
//                       ₹{booking.pricing?.providerEarning || 0}
//                     </p>
//                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusConfig[booking.status]?.color}`}>
//                       {statusConfig[booking.status]?.label}
//                     </span>
//                     <p className="text-gray-400 text-xs mt-1">
//                       {new Date(booking.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 {booking.problemDescription && (
//                   <p className="text-gray-500 text-sm bg-gray-50 rounded-xl p-3 mb-4">
//                     "{booking.problemDescription}"
//                   </p>
//                 )}

//                 {nextStatus[booking.status] && (
//                   <button
//                     onClick={() => updateStatus(booking._id, nextStatus[booking.status], booking.customerId?._id)}
//                     className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm">
//                     {nextStatusLabel[booking.status]}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ProviderBookings
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSocket } from '../../hooks/useSocket'
import { API_URL } from '../../utils/api'

function ProviderDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, rating: 0, earnings: 0 })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { navigate('/login'); return }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'provider') { navigate('/login'); return }
    setUser(parsed)
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
    fetchStats()
    setupSocket(parsed)
  }, [])

  const setupSocket = (userData: any) => {
    const socket = getSocket()
    socket.emit('join:provider', userData.id || userData._id)
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/api/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const bookings = data.data
        const completed = bookings.filter((b: any) => b.status === 'completed')
        const active = bookings.filter((b: any) => ['assigned', 'en_route', 'arrived', 'in_progress'].includes(b.status))
        const earnings = completed.reduce((sum: number, b: any) => sum + (b.pricing?.providerEarning || 0), 0)
        setStats({
          total: bookings.length,
          completed: completed.length,
          active: active.length,
          rating: 0,
          earnings
        })
        setRecentBookings(bookings.slice(0, 3))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleOnline = async () => {
    const newStatus = !isOnline
    if (newStatus) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const token = localStorage.getItem('accessToken')
            const res = await fetch(`${API_URL}/api/provider/availability`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                isOnline: true,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              })
            })
            const data = await res.json()
            if (data.success) {
              setIsOnline(true)
              const socket = getSocket()
              const u = JSON.parse(localStorage.getItem('user') || '{}')
              socket.emit('join:provider', u.id || u._id)
            }
          } catch (err) {
            console.error('Failed to update availability')
          }
        },
        () => {
          alert('Please allow location access to go online. We need your location to match you with nearby customers.')
        }
      )
    } else {
      try {
        const token = localStorage.getItem('accessToken')
        await fetch(`${API_URL}/api/provider/availability`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isOnline: false })
        })
        setIsOnline(false)
      } catch (err) {
        console.error('Failed to go offline')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
    en_route: { label: 'En Route', color: 'bg-indigo-100 text-indigo-700' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    searching: { label: 'Searching', color: 'bg-purple-100 text-purple-700' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">LL</span>
              </div>
              <span className="font-black text-xl text-gray-900">
                Labour<span className="text-blue-600">Link</span>
              </span>
              <span className="ml-2 text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                Professional
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-600">
                  {isOnline ? '🟢 Online' : '🔴 Offline'}
                </span>
                <button
                  onClick={toggleOnline}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                    isOnline ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    {user?.name?.charAt(0) || 'P'}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Banner */}
        <div className={`rounded-3xl p-8 mb-8 relative overflow-hidden ${
          isOnline ? 'bg-gradient-to-br from-green-600 to-emerald-700' : 'bg-gradient-to-br from-slate-800 to-slate-900'
        }`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-5 blur-2xl" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-green-200 font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-3xl font-black text-white mb-2">{user?.name || 'Professional'}</h1>
              <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                isOnline ? 'bg-green-500 bg-opacity-30 text-green-100' : 'bg-white bg-opacity-10 text-gray-300'
              }`}>
                {isOnline ? '🟢 You are Online — Accepting bookings' : '🔴 You are Offline — Toggle to go online'}
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <Link to="/provider/earnings" className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-opacity-20 transition-all">
                💰 Earnings
              </Link>
              <Link to="/provider/wallet" className="bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all">
                👛 Wallet
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: loading ? '...' : stats.total, icon: '📋', color: 'bg-blue-50 text-blue-600' },
            { label: 'Completed', value: loading ? '...' : stats.completed, icon: '✅', color: 'bg-green-50 text-green-600' },
            { label: 'Active', value: loading ? '...' : stats.active, icon: '⚡', color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Earnings', value: loading ? '...' : `₹${stats.earnings}`, icon: '💰', color: 'bg-purple-50 text-purple-600' }
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-900">Recent Jobs</h2>
            <Link to="/provider/bookings" className="text-blue-600 text-sm font-semibold hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : recentBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500 font-semibold">No jobs yet</p>
              <p className="text-gray-400 text-sm mt-1">Go online to start receiving booking requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div key={booking._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🔧</div>
                      <div>
                        <p className="font-bold text-gray-900">{booking.serviceId?.name || 'Service'}</p>
                        <p className="text-gray-500 text-sm">👤 {booking.customerId?.name || 'Customer'}</p>
                        <p className="text-gray-400 text-xs mt-0.5">📍 {booking.address?.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 mb-1">₹{booking.pricing?.providerEarning || 0}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig[booking.status]?.color}`}>
                        {statusConfig[booking.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/provider/bookings" className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-black text-lg mb-1">My Bookings</h3>
            <p className="text-blue-200 text-sm">View and manage all your jobs</p>
          </Link>
          <Link to="/provider/earnings" className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-black text-lg mb-1">Earnings</h3>
            <p className="text-green-100 text-sm">Track your daily and monthly earnings</p>
          </Link>
          <Link to="/provider/wallet" className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="text-3xl mb-3">👛</div>
            <h3 className="font-black text-lg mb-1">Wallet</h3>
            <p className="text-purple-100 text-sm">Manage balance and withdrawals</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard