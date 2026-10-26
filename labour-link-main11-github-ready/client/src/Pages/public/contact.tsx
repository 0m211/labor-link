import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h1 className="text-5xl md:text-6xl font-black mt-3 mb-6">
            Contact
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Us</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Have a question or need help? We are here 24/7 to assist you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Info */}
            <div className="space-y-5">
              {[
                { icon: '📞', title: 'Phone Support', info: '+91 98765 43210', sub: 'Mon-Sun 8am to 10pm', color: 'from-blue-500 to-blue-600' },
                { icon: '📧', title: 'Email Support', info: 'support@labourlink.in', sub: 'We reply within 2 hours', color: 'from-purple-500 to-indigo-600' },
                { icon: '📍', title: 'Head Office', info: 'Mumbai, Maharashtra', sub: 'India - 400001', color: 'from-green-500 to-emerald-600' },
                { icon: '💬', title: 'Live Chat', info: 'Available in App', sub: 'Instant response', color: 'from-yellow-500 to-orange-500' }
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{item.title}</p>
                    <p className="text-gray-700 text-sm font-semibold">{item.info}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We will get back to you within 2 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="Rahul Sharma"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="rahul@example.com"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                        <input
                          value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                        <select
                          value={form.subject}
                          onChange={e => setForm({...form, subject: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        >
                          <option value="">Select subject</option>
                          <option>Booking Issue</option>
                          <option>Payment Problem</option>
                          <option>Provider Complaint</option>
                          <option>General Query</option>
                          <option>Partnership</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        placeholder="Describe your issue or question..."
                        rows={5}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200"
                    >
                      Send Message →
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact