import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../utils/api';

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  assigned: { label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
  searching: { label: 'Searching', color: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
}

const navItems = [
  { label: 'Dashboard', icon: '📊', path: '/admin/dashboard', active: true },
  { label: 'Users', icon: '👥', path: '/admin/users', active: false },
  { label: 'Providers', icon: '👷', path: '/admin/providers', active: false },
  { label: 'Bookings', icon: '📋', path: '/admin/bookings', active: false },
  { label: 'Services', icon: '🛠️', path: '/admin/services', active: false },
  { label: 'Revenue', icon: '💰', path: '/admin/revenue', active: false },
  { label: 'KYC Verify', icon: '✅', path: '/admin/kyc', active: false },
  { label: 'Reviews', icon: '⭐', path: '/admin/reviews', active: false }
]

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState<any>({})
  const [bookings, setBookings] = useState<any[]>([])
  const [pendingKyc, setPendingKyc] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchAll() }, [])

  const getToken = () => localStorage.getItem('adminToken') || localStorage.getItem('accessToken')

  const fetchAll = async () => {
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [statsRes, bookingsRes, kycRes] = await Promise.all([
        fetch('${API_URL}/api/admin/dashboard', { headers }),
        fetch('${API_URL}/api/admin/bookings?limit=5', { headers }),
        fetch('${API_URL}/api/admin/providers/pending-kyc', { headers })
      ])
      const [statsData, bookingsData, kycData] = await Promise.all([
        statsRes.json(), bookingsRes.json(), kycRes.json()
      ])
      if (statsData.success) setStats(statsData.data)
      if (bookingsData.success) setBookings(bookingsData.data.bookings || [])
      if (kycData.success) setPendingKyc(kycData.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const approveKyc = async (providerId: string, status: string) => {
    const token = getToken()
    const res = await fetch(`${API_URL}/api/admin/providers/${providerId}/kyc`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    const data = await res.json()
    if (data.success) fetchAll()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('accessToken')
    navigate('/admin/login')
  }

  const statsCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, change: '', icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Providers', value: stats.totalProviders || 0, change: '', icon: '👷', color: 'from-green-500 to-emerald-600' },
    { label: 'Total Bookings', value: stats.totalBookings || 0, change: '', icon: '📋', color: 'from-purple-500 to-indigo-600' },
    { label: 'Revenue', value: `₹${((stats.totalRevenue || 0) / 100).toLocaleString()}`, change: '', icon: '💰', color: 'from-yellow-500 to-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-blue-950 min-h-screen transition-all duration-300 flex flex-col sticky top-0`}>
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">LL</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-black text-xl text-gray-900">
  K               aar<span className="text-blue-600">agir</span>
                </span>
                <p className="text-blue-300 text-xs">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900' : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
              }`}>
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white border-opacity-10">
          <button onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-3 rounded-xl text-red-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-200 transition-all w-full">
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
                <p className="text-gray-400 text-xs">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">A</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Admin</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statsCards.map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-md`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1">{loading ? '...' : stat.value}</p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-900">Revenue Overview</h2>
                <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="flex items-end space-x-3 h-40">
                {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl" style={{ height: `${h}%` }} />
                    <span className="text-gray-400 text-xs">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-black text-gray-900">₹{((stats.totalRevenue || 0) / 100).toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-600">{stats.activeBookings || 0}</p>
                  <p className="text-gray-400 text-sm">Active Bookings</p>
                </div>
              </div>
            </div>

            {/* Pending KYC */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-black text-gray-900">Pending KYC</h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingKyc.length} pending
                </span>
              </div>
              <div className="space-y-4">
                {pendingKyc.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No pending KYC</p>
                ) : pendingKyc.map((provider: any) => (
                  <div key={provider._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-sm">{provider.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{provider.name}</p>
                        <p className="text-gray-400 text-xs">{provider.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => approveKyc(provider._id, 'approved')}
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 font-bold text-sm">
                        ✓
                      </button>
                      <button onClick={() => approveKyc(provider._id, 'rejected')}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 font-bold text-sm">
                        ✗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/kyc" className="block text-center text-blue-600 text-sm font-bold mt-4 hover:underline">
                View All →
              </Link>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-blue-600 text-sm font-bold hover:underline">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Booking ID', 'Service', 'Customer', 'Provider', 'City', 'Amount', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-sm">{loading ? 'Loading...' : 'No bookings yet'}</td></tr>
                  ) : bookings.map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">{booking.bookingNumber}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{booking.serviceId?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.customerId?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.providerId?.name || 'Pending'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{booking.address?.city}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{booking.pricing?.totalAmount || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusConfig[booking.status]?.color}`}>
                          {statusConfig[booking.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Manage Users', icon: '👥', path: '/admin/users', color: 'from-blue-500 to-blue-600' },
              { label: 'Verify KYC', icon: '✅', path: '/admin/kyc', color: 'from-green-500 to-emerald-600' },
              { label: 'View Revenue', icon: '💰', path: '/admin/revenue', color: 'from-yellow-500 to-orange-500' },
              { label: 'Moderate Reviews', icon: '⭐', path: '/admin/reviews', color: 'from-purple-500 to-indigo-600' }
            ].map(action => (
              <Link key={action.label} to={action.path}
                className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                <div className="text-3xl mb-3">{action.icon}</div>
                <p className="font-black text-sm">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard