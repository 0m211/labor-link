import { useState } from 'react'
import { Link } from 'react-router-dom'

const transactions = [
  { id: 1, type: 'credit', description: 'Payment for Plumbing Job', amount: '+₹382', date: 'Jun 5, 2024', booking: 'LL-2024-001234', status: 'completed' },
  { id: 2, type: 'credit', description: 'Payment for Electrical Job', amount: '+₹552', date: 'Jun 4, 2024', booking: 'LL-2024-001230', status: 'completed' },
  { id: 3, type: 'debit', description: 'Withdrawal to Bank Account', amount: '-₹2,000', date: 'Jun 3, 2024', booking: '', status: 'completed' },
  { id: 4, type: 'credit', description: 'Payment for AC Repair Job', amount: '+₹680', date: 'Jun 2, 2024', booking: 'LL-2024-001225', status: 'completed' },
  { id: 5, type: 'debit', description: 'Withdrawal to UPI', amount: '-₹1,500', date: 'Jun 1, 2024', booking: '', status: 'completed' },
  { id: 6, type: 'credit', description: 'Payment for Plumbing Job', amount: '+₹425', date: 'May 30, 2024', booking: 'LL-2024-001210', status: 'completed' }
]

function ProviderWallet() {
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('upi')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/provider/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
              <div className="w-px h-5 bg-gray-200" />
              <span className="font-black text-gray-900">My Wallet</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-5 blur-2xl" />
          <div className="relative">
            <p className="text-green-200 font-semibold mb-2">Available Balance</p>
            <p className="text-5xl font-black mb-6">₹3,284</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Earned', value: '₹28,500' },
                { label: 'Withdrawn', value: '₹25,216' },
                { label: 'Pending', value: '₹0' }
              ].map(stat => (
                <div key={stat.label} className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
                  <p className="font-black text-lg">{stat.value}</p>
                  <p className="text-green-200 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowWithdraw(true)}
              className="mt-6 w-full bg-white text-green-700 py-3 rounded-2xl font-black hover:bg-green-50 transition-all shadow-lg"
            >
              💸 Withdraw Money
            </button>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">Withdraw Money</h3>
                <button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 mb-5">
                <p className="text-green-600 text-sm font-semibold">Available: ₹3,284</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 text-xl font-bold"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Withdraw To</label>
                <div className="grid grid-cols-2 gap-3">
                  {['upi', 'bank'].map(method => (
                    <button
                      key={method}
                      onClick={() => setWithdrawMethod(method)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        withdrawMethod === method
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {method === 'upi' ? '📱 UPI' : '🏦 Bank Account'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowWithdraw(false)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Request Withdrawal →
              </button>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900">Transaction History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {transactions.map(tx => (
              <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'credit' ? '⬇️' : '⬆️'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{tx.description}</p>
                    {tx.booking && <p className="text-gray-400 text-xs">{tx.booking}</p>}
                    <p className="text-gray-400 text-xs">{tx.date}</p>
                  </div>
                </div>
                <p className={`font-black text-lg ${
                  tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderWallet