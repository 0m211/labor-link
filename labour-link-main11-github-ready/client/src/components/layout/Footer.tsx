import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LL</span>
              </div>
              <span className="font-bold text-xl text-white">
                Labour<span className="text-blue-400">Link</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting customers with verified skilled professionals across Indian cities.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Instagram</a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-blue-400 text-sm">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-blue-400 text-sm">How It Works</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-blue-400 text-sm">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@labourlink.in</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, Maharashtra</li>
              <li>India - 400001</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 LabourLink. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer