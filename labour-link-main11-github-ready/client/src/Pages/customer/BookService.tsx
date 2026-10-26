import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../../utils/api'

const servicesList = [
  { name: 'Plumbing', icon: '🔧', color: 'from-blue-500 to-blue-600' },
  { name: 'Electrical', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: 'Carpentry', icon: '🪚', color: 'from-amber-600 to-yellow-600' },
  { name: 'Painting', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  { name: 'AC Repair', icon: '❄️', color: 'from-cyan-500 to-blue-500' },
  { name: 'Cleaning', icon: '🧹', color: 'from-green-500 to-emerald-500' },
  { name: 'Mechanic', icon: '🔩', color: 'from-gray-600 to-gray-700' },
  { name: 'Appliance Repair', icon: '🔌', color: 'from-purple-500 to-indigo-500' }
]

declare global {
  interface Window { Razorpay: any }
}

function BookService() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const [bookingType, setBookingType] = useState<'instant' | 'scheduled'>('instant')
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '', location: { coordinates: [72.8777, 19.0760] as [number, number] } })
  const [problemDescription, setProblemDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [paymentDone, setPaymentDone] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`)
      const data = await res.json()
      console.log('Services API Response:', data)
      if (data.success) setServices(data.data)
    } catch {
      setServices(servicesList.map((s, i) => ({ ...s, _id: i.toString() })))
    }
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setAddress(prev => ({ ...prev, location: { coordinates: [pos.coords.longitude, pos.coords.latitude] } }))
    })
  }

  const createBooking = async () => {
  setLoading(true)
  setError('')
  try {
    const token = localStorage.getItem('accessToken')
    console.log("========== BOOKING DEBUG ==========");
    console.log("Selected Service:", selectedService);
    console.log("Service ID:", selectedService?._id);
    console.log("Request Body:", {
     type: bookingType,
     serviceId: selectedService?._id,
     address,
     problemDescription,
});
console.log("==================================");
    console.log('Token for booking:', token)
    if (!token) {
      navigate('/login')
      return
    }
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        type: bookingType,
        serviceId: selectedService._id,
        address,
        problemDescription,
        scheduledAt: bookingType === 'scheduled' ? scheduledAt : undefined
      })
    })
    const text = await res.text()
    const data = JSON.parse(text)
    if (!data.success) throw new Error(data.message)
    setBooking(data.data)
    setStep(4)
  } catch (err: any) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
  setLoading(true)
  setError('')

  try {
    const loaded = await loadRazorpayScript()

    if (!loaded) {
      setError('Failed to load Razorpay SDK')
      return
    }

    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login')
      return
    }

    const res = await fetch(
      `${API_URL}/api/payments/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking._id
        })
      }
    )

    const data = await res.json()

    if (!data.success) {
      throw new Error(data.message || 'Failed to create order')
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const options = {
      key: data.data.key,
      amount: data.data.amount,
      currency: data.data.currency,
      name: 'Kaaragir',
      description: `${selectedService?.name} Service`,
      order_id: data.data.orderId,

      handler: async (response: any) => {
        try {
          const verifyRes = await fetch(
            `${API_URL}/api/payments/verify`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                bookingId: booking._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            }
          )

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            setPaymentDone(true)
            setStep(5)
          } else {
            setError('Payment verification failed')
          }
        } catch (err: any) {
          setError(err.message)
        }
      },

      prefill: {
        name: user.name || '',
        email: user.email || '',
        contact: user.phone || ''
      },

      theme: {
        color: '#2563EB'
      },

      modal: {
        ondismiss: () => {
          setLoading(false)
        }
      }
    }

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded')
    }

    const paymentObject = new window.Razorpay(options)

    paymentObject.on('payment.failed', function (response: any) {
      setError(response.error.description || 'Payment Failed')
    })

    paymentObject.open()
  } catch (err: any) {
    console.error(err)
    setError(err.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

  const progressLabels = ['Service', 'Address', 'Details', 'Payment', 'Done']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/customer/dashboard" className="text-gray-500 hover:text-blue-600 font-medium text-sm">← Back</Link>
            <div className="w-px h-5 bg-gray-200" />
            <span className="font-bold text-gray-900">Book a Service</span>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">LL</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Progress */}
        {step < 5 && (
          <div className="flex items-center mb-8">
            {[1,2,3,4].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > s ? 'bg-blue-600 text-white' : step === s ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'}`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 hidden sm:block">{progressLabels[i]}</span>
                </div>
                {s < 4 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 - Select Service */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Select a Service</h2>
            <p className="text-gray-400 text-sm mb-6">What do you need help with today?</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(services.length > 0 ? services : servicesList).map((service: any, index: number) => {
                const style = servicesList[index] || servicesList[0]
                const isSelected = selectedService?._id === service._id || selectedService?.name === service.name
                return (
                  <button key={service._id || index} onClick={() => setSelectedService({...service, ...style})}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className={`w-10 h-10 bg-gradient-to-br ${style.color} rounded-xl flex items-center justify-center text-xl mb-2`}>{style.icon}</div>
                    <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">From ₹{service.basePrice || 299}</p>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep(2)} disabled={!selectedService}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-blue-700 transition-all">
              Continue
            </button>
          </div>
        )}

        {/* Step 2 - Address */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Service Address</h2>
            <p className="text-gray-400 text-sm mb-6">Where do you need the service?</p>

            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              <button onClick={() => setBookingType('instant')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${bookingType === 'instant' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                ⚡ Instant
              </button>
              <button onClick={() => setBookingType('scheduled')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${bookingType === 'scheduled' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                📅 Schedule
              </button>
            </div>

            {bookingType === 'scheduled' && (
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Date & Time</label>
                <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0,16)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">Address Details</label>
                <button onClick={getLocation} className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all">
                  📍 Use GPS
                </button>
              </div>
              <input placeholder="Street address, Building, Flat No." value={address.street} onChange={e => setAddress({...address, street: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
                <input placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
              </div>
              <input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all">Back</button>
              <button onClick={() => setStep(3)} disabled={!address.street || !address.city || !address.pincode}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-blue-700 transition-all">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3 - Problem */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Describe the Issue</h2>
            <p className="text-gray-400 text-sm mb-6">Help the professional prepare before arriving</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedService?.color || 'from-blue-500 to-blue-600'} rounded-xl flex items-center justify-center text-lg`}>
                {selectedService?.icon || '🔧'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{selectedService?.name}</p>
                <p className="text-gray-400 text-xs">{bookingType === 'instant' ? '⚡ Instant' : `📅 ${scheduledAt}`} · {address.city}</p>
              </div>
            </div>

            <textarea value={problemDescription} onChange={e => setProblemDescription(e.target.value)}
              placeholder="e.g. Water leaking from kitchen tap since morning, need urgent repair"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm resize-none mb-5" />

            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all">Back</button>
              <button onClick={createBooking} disabled={loading || !problemDescription}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-blue-700 transition-all">
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Payment */}
        {step === 4 && booking && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Payment Summary</h2>
            <p className="text-gray-400 text-sm mb-6">Review your booking and pay to confirm</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-semibold text-gray-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-semibold text-gray-900">{bookingType === 'instant' ? '⚡ Instant' : '📅 Scheduled'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">{address.street}, {address.city}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-semibold text-blue-600">{booking.bookingNumber}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Advance Payment</span>
                <span className="font-bold text-gray-900 text-lg">₹{selectedService?.basePrice || 299}</span>
              </div>
              <p className="text-gray-400 text-xs">Final amount may vary based on actual work done. This is an advance booking fee.</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-600 font-semibold text-sm">🔒 Secure Payment via Razorpay</span>
              </div>
              <p className="text-gray-500 text-xs">Supports UPI, Cards, Net Banking, Wallets</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
            {/*  
            <button onClick={handlePayment} disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base disabled:opacity-40 hover:bg-blue-700 transition-all mb-3">
              {loading ? 'Opening Payment...' : `Pay ₹${selectedService?.basePrice || 299} & Confirm`}
            </button> 
            */}
            <button
              onClick={() => {
              setPaymentDone(true)
              setStep(5)
              }}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-base hover:bg-green-700 transition-all mb-3">
                  Skip Payment (Testing)
            </button>

            <p className="text-center text-gray-400 text-xs">By paying you agree to our Terms of Service</p>
          </div>
        )}

        {/* Step 5 - Success */}
        {step === 5 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            {/* <p className="text-gray-500 mb-1">Payment successful. We are finding a professional near you.</p> */}
            <p className="text-gray-500 mb-1">Booking created successfully. We are finding a professional near you.</p>
            <p className="text-blue-600 font-semibold text-sm mb-6">{booking?.bookingNumber}</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-semibold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address</span>
                <span className="font-semibold">{address.city}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-blue-600">Searching professionals...</span>
              </div>
            </div>
            <button onClick={() => navigate('/customer/bookings')}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all">
              Track Booking
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookService