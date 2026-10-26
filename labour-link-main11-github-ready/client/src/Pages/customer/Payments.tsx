import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CustomerPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    setPayments([
      { _id: '1', amount: 45000, status: 'captured', method: 'razorpay', createdAt: '2024-06-02', bookingId: { bookingNumber: 'LL-2024-001234' } },
      { _id: '2', amount: 65000, status: 'captured', method: 'razorpay', createdAt: '2024-06-05', bookingId: { bookingNumber: 'LL-2024-001235' } },
      { _id: '3', amount: 59900, status: 'refunded', method: 'razorpay', createdAt: '2024-05-20', bookingId: { bookingNumber: 'LL-2024-001220' } }
    ])
    setLoading(false)
  }, [])

  const statusConfig: Record<string, { label: string; color: string }> = {
    captured: { label: 'Paid', color: 'bg-green-100 text-green-700' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-700' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/customer/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
              <div className="w-px h-5 bg-gray-200" />
              <span className="font-black text-gray-900">Payments</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Paid', value: '₹4,200', color: 'from-blue-500 to-blue-600' },
            { label: 'Transactions', value: '12', color: 'from-purple-500 to-indigo-600' },
            { label: 'Refunds', value: '₹599', color: 'from-green-500 to-emerald-600' }
          ].map(stat => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white`}>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-white text-opacity-70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900">Transaction History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : payments.map(payment => (
              <div key={payment._id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">
                    💳
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {payment.bookingId?.bookingNumber || 'Payment'}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">{payment.method}</p>
                    <p className="text-gray-400 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 text-lg">
                    ₹{(payment.amount / 100).toLocaleString()}
                  </p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusConfig[payment.status]?.color}`}>
                    {statusConfig[payment.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerPayments