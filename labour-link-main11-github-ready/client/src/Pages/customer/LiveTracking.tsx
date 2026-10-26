import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getSocket } from '../../hooks/useSocket'
import { API_URL } from '../../utils/api'

declare global {
  interface Window { tt: any }
}

function LiveTracking() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [booking, setBooking] = useState<any>(null)
  const [status, setStatus] = useState('assigned')
  const [providerCoords, setProviderCoords] = useState<[number, number] | null>(null)
  const [customerCoords, setCustomerCoords] = useState<[number, number]>([72.8777, 19.0760])
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const providerMarkerRef = useRef<any>(null)
  const customerMarkerRef = useRef<any>(null)

  useEffect(() => {
    loadTomTom()
    fetchBooking()
    setupSocket()
    getCustomerLocation()
  }, [])

  const loadTomTom = () => {
    if (window.tt) { initMap(); return }
    const script = document.createElement('script')
    script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js'
    script.onload = () => initMap()
    document.head.appendChild(script)
  }

  const initMap = () => {
    if (!mapRef.current || !window.tt) return
    const map = window.tt.map({
      key: (import.meta as any).env.VITE_TOMTOM_API_KEY,
      container: mapRef.current,
      center: customerCoords,
      zoom: 14,
      style: 'tomtom://vector/1/basic-main'
    })
    mapInstanceRef.current = map

    // Customer marker (red)
    const customerEl = document.createElement('div')
    customerEl.innerHTML = '📍'
    customerEl.style.fontSize = '28px'
    customerMarkerRef.current = new window.tt.Marker({ element: customerEl })
      .setLngLat(customerCoords)
      .addTo(map)
  }

  const getCustomerLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude]
      setCustomerCoords(coords)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(coords)
        customerMarkerRef.current?.setLngLat(coords)
      }
    })
  }

  const updateProviderMarker = (lng: number, lat: number) => {
    if (!mapInstanceRef.current || !window.tt) return
    if (providerMarkerRef.current) {
      providerMarkerRef.current.setLngLat([lng, lat])
    } else {
      const el = document.createElement('div')
      el.innerHTML = '🔧'
      el.style.fontSize = '28px'
      el.style.background = '#2563EB'
      el.style.borderRadius = '50%'
      el.style.padding = '6px'
      el.style.boxShadow = '0 2px 8px rgba(37,99,235,0.4)'
      providerMarkerRef.current = new window.tt.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapInstanceRef.current)
    }
    // Fit both markers
    mapInstanceRef.current.fitBounds(
      [[Math.min(lng, customerCoords[0]), Math.min(lat, customerCoords[1])],
       [Math.max(lng, customerCoords[0]), Math.max(lat, customerCoords[1])]],
      { padding: 80 }
    )
  }

  const setupSocket = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const socket = getSocket()
    socket.emit('join:customer', user.id || user._id)

    socket.on('location:provider_moved', (data: any) => {
      if (data.bookingId === bookingId) {
        setProviderCoords([data.lng, data.lat])
        updateProviderMarker(data.lng, data.lat)
      }
    })

    socket.on('booking:status_update', (data: any) => {
      if (data.bookingId === bookingId) setStatus(data.status)
    })

    socket.on('booking:assigned', (data: any) => {
      setBooking(data.booking)
      setStatus('assigned')
    })

    return () => {
      socket.off('location:provider_moved')
      socket.off('booking:status_update')
      socket.off('booking:assigned')
    }
  }

  const fetchBooking = async () => {
    if (!bookingId) return
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch('${API_URL}/api/bookings/customer', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const found = data.data.find((b: any) => b._id === bookingId)
        if (found) {
          setBooking(found)
          setStatus(found.status)
        }
      }
    } catch (err) { console.error(err) }
  }

  const statusSteps = [
    { key: 'assigned', label: 'Professional Assigned', icon: '✅', desc: 'A professional has accepted your request' },
    { key: 'en_route', label: 'On The Way', icon: '🚗', desc: 'Professional is heading to your location' },
    { key: 'arrived', label: 'Arrived', icon: '📍', desc: 'Professional has reached your location' },
    { key: 'in_progress', label: 'Work In Progress', icon: '🔧', desc: 'Service is being performed' },
    { key: 'completed', label: 'Completed', icon: '🎉', desc: 'Service completed successfully' }
  ]

  const currentIndex = statusSteps.findIndex(s => s.key === status)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/customer/bookings" className="text-gray-500 hover:text-blue-600 text-sm font-medium">← Back</Link>
            <div className="w-px h-5 bg-gray-200" />
            <span className="font-bold text-gray-900">Live Tracking</span>
          </div>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 text-sm font-semibold">Live</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Map */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 border border-gray-200">
          <div ref={mapRef} className="w-full h-72 bg-blue-50" />
          {!providerCoords && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-80">
              <div className="text-center">
                <div className="text-4xl mb-2 animate-pulse">📡</div>
                <p className="text-blue-700 font-semibold text-sm">Waiting for provider location...</p>
              </div>
            </div>
          )}
          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-white rounded-xl px-3 py-2 shadow-md flex items-center space-x-3 text-xs font-semibold">
            <span>📍 You</span>
            <span>🔧 Provider</span>
          </div>
        </div>

        {/* Provider Info */}
        {booking?.providerId && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-xl font-black">
                  {booking.providerId?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-bold text-lg">{booking.providerId?.name || 'Professional'}</p>
                  <p className="text-blue-200 text-sm">⭐ {booking.providerId?.rating?.average || '4.8'} · {booking.serviceId?.name}</p>
                  <p className="text-blue-300 text-xs mt-0.5">#{booking.bookingNumber}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${booking.providerId?.phone}`}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all">
                  📞
                </a>
                <Link to={`/customer/chat?bookingId=${booking._id}`}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all">
                  💬
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-5">Booking Status</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
            <div className="space-y-5">
              {statusSteps.map((step, index) => {
                const isDone = index <= currentIndex
                const isCurrent = index === currentIndex
                return (
                  <div key={step.key} className="flex items-start space-x-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 z-10 transition-all ${
                      isDone ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-100'
                    }`}>
                      {isDone ? step.icon : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                    </div>
                    <div className="pt-1.5">
                      <p className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-blue-500 text-xs mt-0.5 animate-pulse">{step.desc}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* OTP */}
        {booking?.otp?.start && ['assigned', 'en_route', 'arrived'].includes(status) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <p className="text-amber-800 font-semibold text-sm mb-2">🔐 Service Start OTP</p>
            <p className="text-3xl font-black text-amber-900 tracking-widest">{booking.otp.start}</p>
            <p className="text-amber-600 text-xs mt-1">Share this OTP with the professional to start the service</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/customer/chat?bookingId=${booking?._id}`}
            className="bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all text-sm">
            💬 Chat with Provider
          </Link>
          {['assigned', 'searching'].includes(status) && (
            <button className="bg-red-50 border border-red-200 text-red-600 py-3.5 rounded-xl font-semibold hover:bg-red-100 transition-all text-sm">
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveTracking