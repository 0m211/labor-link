import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const services = [
  { name: 'Plumbing', icon: '🔧', desc: 'Pipe repairs, leaks & installation', color: 'from-blue-500 to-blue-600' },
  { name: 'Electrical', icon: '⚡', desc: 'Wiring, fixtures & repairs', color: 'from-yellow-500 to-orange-500' },
  { name: 'Carpentry', icon: '🪚', desc: 'Furniture, doors & windows', color: 'from-amber-600 to-yellow-600' },
  { name: 'Painting', icon: '🎨', desc: 'Interior & exterior painting', color: 'from-pink-500 to-rose-500' },
  { name: 'AC Repair', icon: '❄️', desc: 'Service, repair & installation', color: 'from-cyan-500 to-blue-500' },
  { name: 'Cleaning', icon: '🧹', desc: 'Deep cleaning & sanitization', color: 'from-green-500 to-emerald-500' },
  { name: 'Mechanic', icon: '🔩', desc: 'Vehicle repairs & service', color: 'from-gray-600 to-gray-700' },
  { name: 'More Services', icon: '➕', desc: 'Many more available', color: 'from-purple-500 to-indigo-500' }
]

const steps = [
  { step: '01', title: 'Choose a Service', desc: 'Browse and select from our wide range of professional home services.', icon: '🛠️' },
  { step: '02', title: 'Enter Location', desc: 'Share your address and we find verified professionals near you instantly.', icon: '📍' },
  { step: '03', title: 'Get Matched', desc: 'First available professional within 10km gets assigned to your request.', icon: '🤝' },
  { step: '04', title: 'Job Done!', desc: 'Track live, pay securely online, and rate your experience.', icon: '✅' }
]

const stats = [
  { value: '50,000+', label: 'Happy Customers', icon: '😊' },
  { value: '5,000+', label: 'Verified Professionals', icon: '👷' },
  { value: '20+', label: 'Cities Covered', icon: '🏙️' },
  { value: '4.8★', label: 'Average Rating', icon: '⭐' }
]

const testimonials = [
  { name: 'Priya Sharma', city: 'Mumbai', text: 'Got a plumber within 15 minutes! Extremely professional and the pricing was very transparent.', rating: 5, service: 'Plumbing' },
  { name: 'Rahul Verma', city: 'Delhi', text: 'The electrician fixed my entire wiring issue quickly. Best home service app in India!', rating: 5, service: 'Electrical' },
  { name: 'Anita Patel', city: 'Bangalore', text: 'Booked a painter for next week in just 2 minutes. Seamless experience from start to finish.', rating: 5, service: 'Painting' }
]

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400 rounded-full opacity-5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-full px-4 py-2 mb-8">
              <span className="text-2xl mr-2">🇮🇳</span>
              <span className="text-blue-200 text-sm font-medium">India's Most Trusted Home Services Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
              Home Services
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Delivered Fast
              </span>
            </h1>

            <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
              Connect instantly with verified plumbers, electricians, carpenters and more. Professional service at your doorstep in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/register" className="group bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 text-center shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2">
                Book a Service
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/register?type=provider" className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-opacity-20 transition-all duration-200 text-center">
                Join as Professional
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-10 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-blue-300 text-xs mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Our Services</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From plumbing to painting — verified professionals for every home need, available 24/7.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {services.map(service => (
              <Link
                key={service.name}
                to="/services"
                className="group bg-white rounded-3xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{service.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Get professional service in 4 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 z-0" />

            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center group">
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex flex-col items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-white font-black text-xs mt-1">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-200 font-semibold text-sm uppercase tracking-widest">Why LabourLink</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Built for India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Instant Matching', desc: 'Get matched with a professional within minutes using our smart location algorithm.' },
              { icon: '✅', title: 'KYC Verified', desc: 'Every professional is background checked, Aadhar verified, and trained.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. See exact pricing before you confirm the booking.' },
              { icon: '📍', title: 'Live Tracking', desc: 'Track your service provider in real-time on the map.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Pay safely via UPI, cards or cash. Powered by Razorpay.' },
              { icon: '⭐', title: 'Rated & Reviewed', desc: 'Read real reviews from verified customers before booking.' }
            ].map(item => (
              <div key={item.title} className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-3xl p-6 hover:bg-opacity-20 transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">What Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{t.service}</span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-white font-black">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-gray-400 text-xs">📍 {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
                Join 50,000+ happy customers who trust LabourLink for their home service needs across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg">
                  Book a Service Now 🚀
                </Link>
                <Link to="/register?type=provider" className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-opacity-20 transition-all duration-200">
                  Join as Professional
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home