import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../utils/api'



const services = [
  { name: 'Plumbing', icon: '🔧', color: 'from-blue-500 to-blue-600' },
  { name: 'Electrical', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: 'Carpentry', icon: '🪚', color: 'from-amber-600 to-yellow-600' },
  { name: 'Painting', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  { name: 'AC Repair', icon: '❄️', color: 'from-cyan-500 to-blue-500' },
  { name: 'Cleaning', icon: '🧹', color: 'from-green-500 to-emerald-500' },
  { name: 'Mechanic', icon: '🔩', color: 'from-gray-600 to-gray-700' },
  { name: 'More', icon: '➕', color: 'from-purple-500 to-indigo-500' }
]

const recentBookings: any[] = []

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
  searching: { label: 'Searching...', color: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
}

function CustomerDashboard() {
  const [user, setUser] = useState<any>(null)
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
  const [bookingStats, setBookingStats] = useState({
  total: 0, completed: 0, active: 0, spent: 0
})

useEffect(() => {
  fetchStats()
}, [])

const fetchStats = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${API_URL}/api/bookings/customer`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      const bookings = data.data
      setBookingStats({
        total: bookings.length,
        completed: bookings.filter((b: any) => b.status === 'completed').length,
        active: bookings.filter((b: any) => ['searching', 'assigned', 'in_progress'].includes(b.status)).length,
        spent: bookings.reduce((sum: number, b: any) => sum + (b.pricing?.totalAmount || 0), 0)
      })
    }
  } catch (err) { console.error(err) }
}
  const handleLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  navigate('/login')
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              
  <Link to="/" className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-black text-sm">LL</span>
    </div>

    <span className="font-black text-xl text-gray-900">
      Kaar<span className="text-blue-600">agir</span>
    </span>
  </Link>
   
</Link>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                  Logout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full opacity-10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-blue-300 font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-3xl font-black text-white mb-2">
                {user?.name || 'User'}
              </h1>
              <p className="text-blue-200 text-sm">What service do you need today?</p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <Link
                to="/customer/bookings"
                className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-opacity-20 transition-all"
              >
                My Bookings
              </Link>
              <Link
                to="/customer/profile"
                className="bg-white text-blue-900 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all"
              >
                My Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookingStats.total, icon: '📋', color: 'bg-blue-50 text-blue-600' },
            { label: 'Completed', value: bookingStats.completed, icon: '✅', color: 'bg-green-50 text-green-600' },
            { label: 'Active', value: bookingStats.active, icon: '⚡', color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Total Spent', value: `₹${bookingStats.spent}`, icon: '💰', color: 'bg-purple-50 text-purple-600' }
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

        {/* Services Grid */}
       <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
  {services.map((service) => (
    <Link
      key={service.name}
      to="/customer/book"
      className="group flex flex-col items-center p-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-xl mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
        {service.icon}
      </div>
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
        {service.name}
      </span>
    </Link>
  ))}
</div>
        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-900">Recent Bookings</h2>
            <Link to="/customer/bookings" className="text-blue-600 text-sm font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                    {booking.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{booking.service}</p>
                    <p className="text-gray-500 text-sm">{booking.provider}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{booking.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 mb-1">{booking.amount}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig[booking.status].color}`}>
                    {statusConfig[booking.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/customer/tracking"
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-black text-lg mb-1">Live Tracking</h3>
            <p className="text-blue-200 text-sm">Track your service provider in real-time</p>
          </Link>
          <Link
            to="/customer/payments"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-black text-lg mb-1">Payments</h3>
            <p className="text-green-100 text-sm">View payment history and invoices</p>
          </Link>
          <Link
            to="/customer/reviews"
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-black text-lg mb-1">My Reviews</h3>
            <p className="text-yellow-100 text-sm">Rate and review your experiences</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard