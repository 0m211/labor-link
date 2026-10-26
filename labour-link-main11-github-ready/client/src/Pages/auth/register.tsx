// import { useState, useEffect } from 'react'
// import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import { API_URL } from '../../utils/api'
// import Services from '../public/Services'

// const serviceCategories = [
//   { name: 'Plumbing', icon: '🔧' },
//   { name: 'Electrical', icon: '⚡' },
//   { name: 'Carpentry', icon: '🪚' },
//   { name: 'Painting', icon: '🎨' },
//   { name: 'AC Repair', icon: '❄️' },
//   { name: 'Cleaning', icon: '🧹' },
//   { name: 'Mechanic', icon: '🔩' },
//   { name: 'Appliance Repair', icon: '🔌' },
//   { name: 'Pest Control', icon: '🐜' },
//   { name: 'Gardening', icon: '🌱' },
//   { name: 'Security Systems', icon: '🔐' },
//   { name: 'Interior Design', icon: '🛋️' }
// ]

// function Register() {
//   const [searchParams] = useSearchParams()
//   const [userType, setUserType] = useState<'customer' | 'provider'>(
//     searchParams.get('type') === 'provider' ? 'provider' : 'customer'
//   )
//   const [step, setStep] = useState<'register' | 'otp'>('register')
//   const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])
//   const [otp, setOtp] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const navigate = useNavigate()

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken')
//     const user = localStorage.getItem('user')
//     if (token && user) {
//       const parsed = JSON.parse(user)
//       if (parsed.role === 'customer') navigate('/customer/dashboard')
//       else if (parsed.role === 'provider') navigate('/provider/dashboard')
//     }
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const toggleCategory = (name: string) => {
//     setSelectedCategories(prev =>
//       prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
//     )
//   }

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
//     if (userType === 'provider' && selectedCategories.length === 0) { setError('Please select at least one service category'); return }
//     setLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/api/auth/register/${userType}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, Services: selectedCategories })
//       })
//       const text = await res.text()
//       const data = JSON.parse(text)
//       if (!data.success) throw new Error(data.message)
//       setStep('otp')
//     } catch (err: any) {
//       setError(err.message || 'Registration failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email: form.email, otp, userType })
//       })
//       const text = await res.text()
//       const data = JSON.parse(text)
//       if (!data.success) throw new Error(data.message)
//       localStorage.setItem('accessToken', data.data.accessToken)
//       localStorage.setItem('user', JSON.stringify(data.data.user))
//       if (userType === 'customer') navigate('/customer/dashboard')
//       else navigate('/provider/dashboard')
//     } catch (err: any) {
//       setError(err.message || 'Verification failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex items-center justify-center p-4">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
//       </div>

//       <div className="w-full max-w-lg relative">
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center space-x-2">
//             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
//               <span className="text-white font-black">LL</span>
//             </div>
//             <span className="font-black text-2xl text-white">Labour<span className="text-blue-400">Link</span></span>
//           </Link>
//           <p className="text-blue-200 mt-2 text-sm">
//             {step === 'register' ? 'Create your account' : 'Verify your email'}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl p-8 shadow-2xl">
//           {step === 'register' ? (
//             <>
//               <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
//                 <button onClick={() => setUserType('customer')}
//                   className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${userType === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
//                   Customer
//                 </button>
//                 <button onClick={() => setUserType('provider')}
//                   className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${userType === 'provider' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
//                   Professional
//                 </button>
//               </div>

//               <form onSubmit={handleRegister} className="space-y-4">
//                 {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="col-span-2">
//                     <label className="text-xs font-semibold text-gray-600 block mb-1.5">Full Name</label>
//                     <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" required
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
//                     <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" required
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="text-xs font-semibold text-gray-600 block mb-1.5">Phone Number</label>
//                     <div className="flex gap-2">
//                       <div className="bg-gray-100 px-3 py-3 rounded-xl text-gray-600 text-sm font-semibold flex items-center">+91</div>
//                       <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" required
//                         className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
//                     <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" required
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 block mb-1.5">Confirm Password</label>
//                     <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter" required
//                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
//                   </div>
//                 </div>

//                 {/* Service Categories for Provider */}
//                 {userType === 'provider' && (
//                   <div>
//                     <label className="text-xs font-semibold text-gray-600 block mb-3">
//                       Select Your Services <span className="text-red-500">*</span>
//                       <span className="text-gray-400 font-normal ml-1">(Select all that apply)</span>
//                     </label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {serviceCategories.map(cat => (
//                         <button key={cat.name} type="button" onClick={() => toggleCategory(cat.name)}
//                           className={`p-2.5 rounded-xl border-2 text-center transition-all ${
//                             selectedCategories.includes(cat.name)
//                               ? 'border-blue-500 bg-blue-50'
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}>
//                           <div className="text-lg mb-0.5">{cat.icon}</div>
//                           <p className="text-xs font-semibold text-gray-700 leading-tight">{cat.name}</p>
//                         </button>
//                       ))}
//                     </div>
//                     {selectedCategories.length > 0 && (
//                       <p className="text-blue-600 text-xs font-semibold mt-2">
//                         ✓ {selectedCategories.length} service{selectedCategories.length > 1 ? 's' : ''} selected
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <button type="submit" disabled={loading}
//                   className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 mt-2">
//                   {loading ? 'Creating Account...' : 'Create Account'}
//                 </button>

//                 <p className="text-xs text-gray-400 text-center">
//                   By signing up you agree to our <a href="#" className="text-blue-600">Terms</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
//                 </p>
//               </form>
//             </>
//           ) : (
//             <div>
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <span className="text-3xl">📧</span>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 mb-1">Check your email</h2>
//                 <p className="text-gray-500 text-sm">OTP sent to <span className="font-semibold text-gray-900">{form.email}</span></p>
//               </div>

//               <form onSubmit={handleVerifyOtp} className="space-y-4">
//                 {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
//                 <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} required
//                   className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl font-bold tracking-widest" />
//                 <button type="submit" disabled={loading}
//                   className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50">
//                   {loading ? 'Verifying...' : 'Verify & Continue'}
//                 </button>
//                 <button type="button" onClick={() => setStep('register')} className="w-full text-gray-500 text-sm hover:text-gray-700">
//                   ← Go back
//                 </button>
//               </form>
//             </div>
//           )}

//           <div className="mt-5 text-center">
//             <p className="text-gray-500 text-sm">
//               Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Sign in</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { API_URL } from '../../utils/api'

interface Service {
  _id: string
  name: string
  icon?: string
  description?: string
  basePrice?: number
}

const serviceIcons: Record<string, string> = {
  'Plumbing': '🔧',
  'Electrical': '⚡',
  'Carpentry': '🪚',
  'Painting': '🎨',
  'AC Repair': '❄️',
  'Cleaning': '🧹',
  'Mechanic': '🔩',
  'Appliance Repair': '🔌',
  'Pest Control': '🐜',
  'Gardening': '🌱',
  'Security Systems': '🔐',
  'Interior Design': '🛋️'
}

function Register() {
  const [searchParams] = useSearchParams()
  const [userType, setUserType] = useState<'customer' | 'provider'>(
    searchParams.get('type') === 'provider' ? 'provider' : 'customer'
  )
  const [step, setStep] = useState<'register' | 'otp'>('register')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    if (token && user) {
      const parsed = JSON.parse(user)
      if (parsed.role === 'customer') navigate('/customer/dashboard')
      else if (parsed.role === 'provider') navigate('/provider/dashboard')
    }
  }, [])

  useEffect(() => {
    if (userType === 'provider') {
      fetchServices()
    }
  }, [userType])

  const fetchServices = async () => {
    setServicesLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/services`)
      const data = await res.json()
          console.log("SERVICES API:", data)
      if (data.success && data.data.length > 0) {
        setServices(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch services')
    } finally {
      setServicesLoading(false)
    }
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (userType === 'provider' && selectedServices.length === 0) {
      setError('Please select at least one service category')
      return
    }
    setLoading(true)
    try {
      const body: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      }
      if (userType === 'provider') {
        body.services = selectedServices
      }
      console.log("REGISTER BODY:", body)
      console.log("SELECTED SERVICES:", selectedServices)
      const res = await fetch(`${API_URL}/api/auth/register/${userType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const text = await res.text()
      const data = JSON.parse(text)
      if (!data.success) throw new Error(data.message)
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, otp, userType })
      })
      const text = await res.text()
      const data = JSON.parse(text)
      if (!data.success) throw new Error(data.message)
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      if (userType === 'customer') navigate('/customer/dashboard')
      else navigate('/provider/dashboard')
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">LL</span>
            </div>
            <span className="font-black text-2xl text-white">
              Labour<span className="text-blue-400">Link</span>
            </span>
          </Link>
          <p className="text-blue-200 mt-2 text-sm">
            {step === 'register' ? 'Create your account' : 'Verify your email'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {step === 'register' ? (
            <>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setUserType('customer')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    userType === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}>
                  Customer
                </button>
                <button
                  onClick={() => setUserType('provider')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    userType === 'provider' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}>
                  Professional
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Full Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Rahul Sharma"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="bg-gray-100 px-3 py-3 rounded-xl text-gray-600 text-sm font-semibold flex items-center">
                        +91
                      </div>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        required
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                    />
                  </div>
                </div>

                {userType === 'provider' && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-3">
                      Select Your Services <span className="text-red-500">*</span>
                      <span className="text-gray-400 font-normal ml-1">(Select all that apply)</span>
                    </label>

                    {servicesLoading ? (
                      <div className="text-center py-4 text-gray-400 text-sm">Loading services...</div>
                    ) : services.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        No services available. Please try again.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {services.map(service => (
                          <button
                            key={service._id}
                            type="button"
                            onClick={() => toggleService(service._id)}
                            className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                              selectedServices.includes(service._id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-lg mb-0.5">
                              {serviceIcons[service.name] || service.icon || '🔧'}
                            </div>
                            <p className="text-xs font-semibold text-gray-700 leading-tight">
                              {service.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedServices.length > 0 && (
                      <p className="text-blue-600 text-xs font-semibold mt-2">
                        ✓ {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By signing up you agree to our{' '}
                  <a href="#" className="text-blue-600">Terms</a> and{' '}
                  <a href="#" className="text-blue-600">Privacy Policy</a>
                </p>
              </form>
            </>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Check your email</h2>
                <p className="text-gray-500 text-sm">
                  OTP sent to <span className="font-semibold text-gray-900">{form.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl font-bold tracking-widest"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="w-full text-gray-500 text-sm hover:text-gray-700"
                >
                  ← Go back
                </button>
              </form>
            </div>
          )}

          <div className="mt-5 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register