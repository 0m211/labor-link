import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const services = [
  {
    name: 'Plumbing',
    icon: '🔧',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    description: 'Expert plumbers for all pipe repairs, leakage fixing, tap installation, bathroom fitting and drainage issues.',
    price: 'Starting ₹299',
    time: '30-60 mins',
    rating: '4.8',
    jobs: '12,400+',
    features: ['Pipe Repair', 'Tap Installation', 'Drainage Fix', 'Bathroom Fitting', 'Water Heater', 'Leakage Fix']
  },
  {
    name: 'Electrical',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50',
    description: 'Certified electricians for wiring, fixture installation, switchboard repair, and all electrical work.',
    price: 'Starting ₹349',
    time: '30-90 mins',
    rating: '4.9',
    jobs: '9,800+',
    features: ['Wiring', 'Switchboard Repair', 'Fan Installation', 'Light Fitting', 'MCB Issues', 'Inverter Setup']
  },
  {
    name: 'Carpentry',
    icon: '🪚',
    color: 'from-amber-600 to-yellow-600',
    bg: 'bg-amber-50',
    description: 'Skilled carpenters for furniture repair, door fitting, window work and custom woodwork.',
    price: 'Starting ₹399',
    time: '1-3 hours',
    rating: '4.7',
    jobs: '6,200+',
    features: ['Furniture Repair', 'Door Fitting', 'Window Work', 'Cabinet Making', 'Bed Assembly', 'Wood Polish']
  },
  {
    name: 'Painting',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    description: 'Professional painters for interior, exterior, waterproofing and texture painting.',
    price: 'Starting ₹999',
    time: '1-2 days',
    rating: '4.8',
    jobs: '4,500+',
    features: ['Interior Painting', 'Exterior Painting', 'Waterproofing', 'Texture Paint', 'Wall Putty', 'Wood Polish']
  },
  {
    name: 'AC Repair',
    icon: '❄️',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    description: 'AC technicians for servicing, repair, gas refilling and installation of all AC brands.',
    price: 'Starting ₹499',
    time: '1-2 hours',
    rating: '4.9',
    jobs: '8,100+',
    features: ['AC Service', 'Gas Refill', 'AC Repair', 'Installation', 'Deep Clean', 'PCB Repair']
  },
  {
    name: 'Cleaning',
    icon: '🧹',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    description: 'Deep cleaning services for home, kitchen, bathroom, sofa and pest control.',
    price: 'Starting ₹599',
    time: '2-4 hours',
    rating: '4.7',
    jobs: '7,300+',
    features: ['Home Deep Clean', 'Kitchen Clean', 'Bathroom Clean', 'Sofa Clean', 'Pest Control', 'Sanitization']
  },
  {
    name: 'Mechanic',
    icon: '🔩',
    color: 'from-gray-600 to-gray-700',
    bg: 'bg-gray-50',
    description: 'Expert mechanics for two-wheeler and four-wheeler repair at your doorstep.',
    price: 'Starting ₹299',
    time: '1-3 hours',
    rating: '4.6',
    jobs: '3,200+',
    features: ['Bike Repair', 'Car Repair', 'Oil Change', 'Battery Check', 'Tyre Change', 'Doorstep Service']
  },
  {
    name: 'Appliance Repair',
    icon: '🔌',
    color: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50',
    description: 'Repair of washing machine, refrigerator, microwave, TV and all home appliances.',
    price: 'Starting ₹399',
    time: '1-2 hours',
    rating: '4.8',
    jobs: '5,600+',
    features: ['Washing Machine', 'Refrigerator', 'Microwave', 'TV Repair', 'Geyser', 'RO Service']
  }
]

function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">All Services</span>
          <h1 className="text-5xl md:text-6xl font-black mt-3 mb-6">
            Everything Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Home Needs</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Verified professionals for every home service. Available 24/7 across 20+ Indian cities.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map(service => (
              <div
                key={service.name}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${service.color} p-6 flex items-center justify-between`}>
                  <div>
                    <div className="text-4xl mb-2">{service.icon}</div>
                    <h3 className="text-2xl font-black text-white">{service.name}</h3>
                    <p className="text-white text-opacity-80 text-sm mt-1">{service.price}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <p className="text-white font-black text-lg">{service.rating}★</p>
                      <p className="text-white text-opacity-70 text-xs">{service.jobs} jobs</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>

                  <div className="flex items-center space-x-4 mb-5">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>⏱️</span>
                      <span>{service.time}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>✅</span>
                      <span>Verified Professionals</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.features.map(f => (
                      <span key={f} className={`text-xs font-semibold px-3 py-1 rounded-full ${service.bg} text-gray-700`}>
                        {f}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/register"
                    className={`block w-full text-center bg-gradient-to-r ${service.color} text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity`}
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Services