import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getSocket } from '../../hooks/useSocket'
import { API_URL } from '../../utils/api'

function Chat() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchChat()
    fetchBooking()
    setupSocket()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchChat = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/api/chat/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setMessages(data.data.messages || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const found = data.data.find((b: any) => b._id === bookingId)
        if (found) setBooking(found)
      }
    } catch (err) { console.error(err) }
  }

  const setupSocket = () => {
    const socket = getSocket()
    socket.emit('join:customer', user.id || user._id)
    socket.on('chat:message', (data: any) => {
      if (data.bookingId === bookingId) {
        setMessages(prev => [...prev, data])
      }
    })
    return () => { socket.off('chat:message') }
  }

  const sendMessage = async () => {
    if (!text.trim()) return
    const socket = getSocket()
    const provider = booking?.providerId

    // Emit via socket
    socket.emit('chat:send', {
      bookingId,
      senderId: user.id || user._id,
      receiverId: provider?._id,
      text: text.trim(),
      senderType: user.role
    })

    // Save to DB
    const token = localStorage.getItem('accessToken')
    await fetch(`${API_URL}/api/chat/booking/${bookingId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: text.trim() })
    })

    setMessages(prev => [...prev, {
      senderId: user.id || user._id,
      text: text.trim(),
      createdAt: new Date()
    }])
    setText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isMyMessage = (msg: any) => {
    return msg.senderId === (user.id || user._id) ||
      msg.senderId?._id === (user.id || user._id)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center space-x-3">
          <Link to={`/customer/tracking?bookingId=${bookingId}`}
            className="text-gray-500 hover:text-blue-600 text-sm font-medium">
            ← Back
          </Link>
          <div className="w-px h-5 bg-gray-200" />
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-sm">
            {booking?.providerId?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">
              {booking?.providerId?.name || 'Professional'}
            </p>
            <p className="text-gray-400 text-xs">{booking?.serviceId?.name}</p>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-green-600 text-xs font-semibold">Online</span>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 overflow-y-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-gray-500 font-semibold">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Send a message to the professional</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const mine = isMyMessage(msg)
              return (
                <div key={index} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  {!mine && (
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 mr-2 flex-shrink-0 mt-auto">
                      {booking?.providerId?.name?.charAt(0) || 'P'}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      mine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                    <p className="text-gray-400 text-xs mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center space-x-3">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat