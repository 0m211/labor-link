import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../utils/api'

function Login() {
  const [userType, setUserType] = useState<'customer' | 'provider'>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
  const res = await fetch(`${API_URL}/api/auth/login/${userType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  const data = await res.json()

  if (!data.success) throw new Error(data.message)

  if (rememberMe) {
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    localStorage.setItem('userRole', userType)
  } else {
    sessionStorage.setItem('accessToken', data.data.accessToken)
    sessionStorage.setItem('user', JSON.stringify(data.data.user))
    sessionStorage.setItem('userRole', userType)
  }

  if (userType === 'customer') navigate('/customer/dashboard')
  else navigate('/provider/dashboard')
} catch (err: any) {
  setError(err.message)
}finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">LL</span>
            </div>
            <span className="font-black text-2xl text-white">
              Labour<span className="text-blue-400">Link</span>
            </span>
          </Link>
          <p className="text-blue-200 mt-2 text-sm">Welcome back! Please sign in.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* User Type Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setUserType('customer')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                userType === 'customer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👤 Customer
            </button>
            <button
              onClick={() => setUserType('provider')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                userType === 'provider'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👷 Professional
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-blue-600 text-xs font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
              <div className="flex items-center">
            <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
            <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600 font-medium"
                >
                   Remember Me
            </label>
          </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          © 2024 LabourLink. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login