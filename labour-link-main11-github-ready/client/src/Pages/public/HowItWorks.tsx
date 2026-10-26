import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const customerSteps = [
  { step: '01', icon: '📱', title: 'Download & Register', desc: 'Create your free account in under 2 minutes. No credit card required.' },
  { step: '02', icon: '🛠️', title: 'Choose a Service', desc: 'Browse from 50+ services. Select exactly what you need.' },
  { step: '03', icon: '📍', title: 'Enter Your Location', desc: 'Share your address or use GPS. We find pros within 10km.' },
  { step: '04', icon: '⚡', title: 'Get Instantly Matched', desc: 'First available verified professional accepts your request.' },
  { step: '05', icon: '📍', title: 'Track in Real-Time', desc: 'Watch your professional travel to you on the live map.' },
  { step: '06', icon: '✅', title: 'Service & Pay', desc: 'Confirm service with OTP. Pay securely online or cash.' }
]

const providerSteps = [
  { step: '01', icon: '📝', title: 'Register & Apply', desc: 'Sign up as a service professional. Choose your service categories.' },
  { step: '02', icon: '🪪', title: 'Complete KYC', desc: 'Upload Aadhar, PAN and selfie. Verification within 24 hours.' },
  { step: '03', icon: '🟢', title: 'Go Online', desc: 'Toggle online when ready to work. Control your availability.' },
  { step: '04', icon: '🔔', title: 'Receive Requests', desc: 'Get notified of nearby booking requests instantly.' },
  { step: '05', icon: '✓', title: 'Accept & Earn', desc: 'Accept jobs, complete service, earn money directly to wallet.' },
  { step: '06', icon: '💰', title: 'Withdraw Earnings', desc: 'Withdraw to bank or UPI anytime. No minimum balance.' }
]

const faqs = [
  { q: 'How quickly will a professional arrive?', a: 'For instant bookings, professionals typically arrive within 30-60 minutes depending on your location and service type.' },
  { q: 'Are all professionals verified?', a: 'Yes! Every professional undergoes Aadhar verification, background checks, and skill assessment before joining LabourLink.' },
  { q: 'What if I am not satisfied with the service?', a: 'We have a satisfaction guarantee. If you are not happy, contact us within 24 hours and we will resolve it free of charge.' },
  { q: 'How does pricing work?', a: 'Pricing is transparent and shown upfront. You see the estimated cost before confirming. Final amount depends on actual work done.' },
  { q: 'Can I schedule a booking for later?', a: 'Absolutely! You can schedule services up to 7 days in advance at your preferred date and time.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, net banking, and cash on completion.' }
]

function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h1 className="text-5xl md:text-6xl font-black mt-3 mb-6">
            How
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> LabourLink </span>
            Works
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Getting professional home service has never been easier. Here is everything you need to know.
          </p>
        </div>
      </section>

      {/* Customer Flow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">For Customers</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Book a Service in Minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerSteps.map((step, index) => (
              <div key={step.step} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-md">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-gray-100">{step.step}</span>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">For Professionals</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Start Earning Today</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providerSteps.map(step => (
              <div key={step.step} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-md">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-gray-100">{step.step}</span>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-900 mb-2 flex items-start space-x-2">
                  <span className="text-blue-600 flex-shrink-0">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of happy customers across India.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all">
              Book a Service 🚀
            </Link>
            <Link to="/register?type=provider" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-800 transition-all">
              Join as Professional
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowItWorks