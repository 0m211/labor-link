import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSocket } from '../../hooks/useSocket'
import { API_URL } from '../../utils/api'

const recentBookings: any[] = []

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
}

function ProviderDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [greeting, setGreeting] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const handleLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  navigate('/login')
}
  const toggleOnline = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const newStatus = !isOnline
    navigator.geolocation.getCurrentPosition(async (pos) => {
      console.log('Sending:', {
      isOnline: newStatus,
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
})
      const res = await fetch(`${API_URL}/api/provider/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isOnline: newStatus,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      })
      const data = await res.json()
      console.log('Provider Availability Response:', data)

    if (data.success) {
    setIsOnline(newStatus)

      const socket = getSocket()
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      socket.emit('join:provider', user.id || user._id)
    } else {
     alert(data.message || 'Availability update failed')
    }
    }, () => {
       alert('Please enable location access')
    })
  } catch (err) {
    console.error('Failed to update availability')
  }
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">LL</span>
              </div>
              <span className="font-black text-xl text-gray-900">
               Kaar<span className="text-blue-600">agir</span>
              </span>
              <span className="ml-2 text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                Provider
              </span>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
                Home
                </Link>

                <Link to="/services" className="text-gray-600 hover:text-blue-600 font-medium">
                Services
                 </Link>

                <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">
                How It Works
                </Link>

                <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">
                 About
                 </Link>

                <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">
                 Contact
                 </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Online Toggle */}
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
              <button className="relative p-2 text-gray-500 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    {user?.name?.charAt(0) || 'P'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 font-medium"
                >
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
          isOnline
            ? 'bg-gradient-to-br from-green-600 to-emerald-700'
            : 'bg-gradient-to-br from-slate-800 to-slate-900'
        }`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-5 blur-2xl" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-green-200 font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-3xl font-black text-white mb-2">
                {user?.name || 'Provider'}
              </h1>
              <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                isOnline
                  ? 'bg-green-500 bg-opacity-30 text-green-100'
                  : 'bg-white bg-opacity-10 text-gray-300'
              }`}>
                {isOnline ? '🟢 You are Online — Accepting bookings' : '🔴 You are Offline — Toggle to go online'}
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <Link
                to="/provider/earnings"
                className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-opacity-20 transition-all"
              >
                💰 Earnings
              </Link>
              <Link
                to="/provider/wallet"
                className="bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all"
              >
                👛 Wallet
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
           { label: 'Total Jobs', value: '0', icon: '📋', color: 'bg-blue-50 text-blue-600' },
           { label: 'Completed', value: '0', icon: '✅', color: 'bg-green-50 text-green-600' },
           { label: 'Rating', value: '0.0', icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
           { label: 'Total Earned', value: '₹0', icon: '💰', color: 'bg-purple-50 text-purple-600' }
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

        {/* Incoming Request Banner */}

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-900">Recent Jobs</h2>
            <Link to="/provider/bookings" className="text-blue-600 text-sm font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                      {booking.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{booking.service}</p>
                      <p className="text-gray-500 text-sm">👤 {booking.customer}</p>
                      <p className="text-gray-400 text-xs mt-0.5">📍 {booking.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 mb-1">{booking.amount}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig[booking.status].color}`}>
                      {statusConfig[booking.status].label}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">{booking.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/provider/earnings"
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-black text-lg mb-1">Earnings Dashboard</h3>
            <p className="text-blue-200 text-sm">Track your daily and monthly earnings</p>
          </Link>
          <Link
            to="/provider/wallet"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-3xl mb-3">👛</div>
            <h3 className="font-black text-lg mb-1">Wallet</h3>
            <p className="text-green-100 text-sm">Manage balance and withdrawals</p>
          </Link>
          <Link
            to="/provider/profile"
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-3xl mb-3">👷</div>
            <h3 className="font-black text-lg mb-1">My Profile</h3>
            <p className="text-purple-100 text-sm">Update KYC and service categories</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard