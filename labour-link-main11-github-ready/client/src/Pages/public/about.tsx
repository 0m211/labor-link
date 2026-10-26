import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const team = [
  { name: 'Arjun Mehta', role: 'CEO & Co-Founder', emoji: '👨‍💼' },
  { name: 'Priya Sharma', role: 'CTO & Co-Founder', emoji: '👩‍💻' },
  { name: 'Rahul Verma', role: 'Head of Operations', emoji: '👨‍🔧' },
  { name: 'Anita Patel', role: 'Head of Marketing', emoji: '👩‍🎨' }
]

function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-black mt-3 mb-6">
            About
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> LabourLink</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
            We are on a mission to make quality home services accessible and affordable for every Indian household while creating dignified earning opportunities for skilled professionals.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Our Mission</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-6">
                Bridging the Gap Between Customers and Skilled Workers
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Founded in 2024, LabourLink was born from a simple observation — millions of skilled workers in India struggle to find consistent work while millions of households struggle to find reliable service professionals.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                We built a platform that uses technology to connect them instantly, fairly, and transparently. Every professional on our platform is KYC verified, trained, and rated by real customers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50,000+', label: 'Happy Customers' },
                  { value: '5,000+', label: 'Verified Pros' },
                  { value: '20+', label: 'Cities' },
                  { value: '₹10Cr+', label: 'Paid to Workers' }
                ].map(stat => (
                  <div key={stat.label} className="bg-blue-50 rounded-2xl p-4">
                    <p className="text-2xl font-black text-blue-600">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-black mb-6">Our Values</h3>
              {[
                { icon: '🤝', title: 'Trust', desc: 'Every professional is verified and every transaction is secure.' },
                { icon: '⚡', title: 'Speed', desc: 'We connect you with professionals in minutes, not hours.' },
                { icon: '💰', title: 'Fairness', desc: 'Transparent pricing for customers. Fair earnings for workers.' },
                { icon: '🌟', title: 'Quality', desc: 'We maintain high standards through ratings and reviews.' }
              ].map(value => (
                <div key={value.title} className="flex items-start space-x-3 mb-5">
                  <span className="text-2xl flex-shrink-0">{value.icon}</span>
                  <div>
                    <p className="font-black">{value.title}</p>
                    <p className="text-blue-200 text-sm">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Our Team</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Meet the Founders</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                  {member.emoji}
                </div>
                <h3 className="font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Join the LabourLink Family</h2>
          <p className="text-blue-100 text-lg mb-8">Whether you need a service or want to offer one — we have got you covered.</p>
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

export default About