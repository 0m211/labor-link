import { Link } from 'react-router-dom'

const weeklyData = [
  { day: 'Mon', amount: 850, jobs: 2 },
  { day: 'Tue', amount: 450, jobs: 1 },
  { day: 'Wed', amount: 1200, jobs: 3 },
  { day: 'Thu', amount: 0, jobs: 0 },
  { day: 'Fri', amount: 950, jobs: 2 },
  { day: 'Sat', amount: 1800, jobs: 4 },
  { day: 'Sun', amount: 650, jobs: 1 }
]

const maxAmount = Math.max(...weeklyData.map(d => d.amount))

function ProviderEarnings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/provider/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
              <div className="w-px h-5 bg-gray-200" />
              <span className="font-black text-gray-900">Earnings</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Today', value: '₹650', icon: '📅', color: 'from-blue-500 to-blue-600' },
            { label: 'This Week', value: '₹5,900', icon: '📊', color: 'from-green-500 to-emerald-600' },
            { label: 'This Month', value: '₹28,500', icon: '🗓️', color: 'from-purple-500 to-indigo-600' },
            { label: 'Total Jobs', value: '48', icon: '✅', color: 'from-yellow-500 to-orange-500' }
          ].map(stat => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-white text-opacity-70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-6">This Week</h2>
          <div className="flex items-end space-x-3 h-48">
            {weeklyData.map(day => (
              <div key={day.day} className="flex-1 flex flex-col items-center space-y-2">
                <p className="text-xs font-bold text-gray-500">
                  {day.amount > 0 ? `₹${day.amount}` : '-'}
                </p>
                <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-xl transition-all hover:from-green-700 hover:to-emerald-500"
                    style={{ height: day.amount > 0 ? `${(day.amount / maxAmount) * 100}%` : '4px', minHeight: day.amount > 0 ? '20px' : '4px', opacity: day.amount > 0 ? 1 : 0.2 }}
                  />
                </div>
                <p className="text-xs font-bold text-gray-600">{day.day}</p>
                <p className="text-xs text-gray-400">{day.jobs} jobs</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-100 mt-4">
            <div>
              <p className="text-2xl font-black text-gray-900">₹5,900</p>
              <p className="text-gray-400 text-sm">This week total</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-green-600">13 jobs</p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
          </div>
        </div>

        {/* Platform Info */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h3 className="font-black text-blue-900 mb-3">💡 Earnings Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Earnings</span>
              <span className="font-bold text-gray-900">₹28,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee (15%)</span>
              <span className="font-bold text-red-500">-₹4,275</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="font-black text-gray-900">Net Earnings</span>
              <span className="font-black text-green-600">₹24,225</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderEarnings