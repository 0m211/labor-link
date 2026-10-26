import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CustomerProfile() {
  const [user, setUser] = useState<any>({
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    avatar: ''
  })
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/customer/dashboard" className="text-gray-500 hover:text-blue-600">← Back</Link>
              <div className="w-px h-5 bg-gray-200" />
              <span className="font-black text-gray-900">My Profile</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 font-semibold text-sm">
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-2xl" />
          <div className="relative flex items-center space-x-5">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black">{user.name}</h1>
              <p className="text-blue-300 text-sm">{user.email}</p>
              <p className="text-blue-300 text-sm">{user.phone}</p>
            </div>
          </div>
          <div className="relative flex gap-4 mt-6">
            {[
              { label: 'Bookings', value: '12' },
              { label: 'Reviews', value: '8' },
              { label: 'Spent', value: '₹4,200' }
            ].map(stat => (
              <div key={stat.label} className="bg-white bg-opacity-10 rounded-2xl px-4 py-2 text-center">
                <p className="font-black text-lg">{stat.value}</p>
                <p className="text-blue-300 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900">Personal Information</h2>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                editing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email Address', key: 'email', type: 'email' },
              { label: 'Phone Number', key: 'phone', type: 'tel' },
              { label: 'City', key: 'city', type: 'text' },
              { label: 'State', key: 'state', type: 'text' },
              { label: 'Pincode', key: 'pincode', type: 'text' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={user[field.key]}
                  onChange={e => setUser({ ...user, [field.key]: e.target.value })}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    editing
                      ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900'
                      : 'border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100 mt-6">
          <h2 className="text-lg font-black text-red-600 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Delete Account</p>
              <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfile