import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/public/Home'
import About from './Pages/public/about'
import Services from './Pages/public/Services'
import HowItWorks from './Pages/public/HowItWorks'
import Contact from './Pages/public/contact'
import Login from './Pages/auth/login'
import Register from './Pages/auth/register'
import CustomerDashboard from './Pages/customer/Dashboard'
import CustomerProfile from './Pages/customer/Profile'
import BookingHistory from './Pages/customer/BookingHistory'
import BookService from './Pages/customer/BookService'
import CustomerPayments from './Pages/customer/Payments'
import LiveTracking from './Pages/customer/LiveTracking'
import Chat from './Pages/customer/Chat'
import ProviderDashboard from './Pages/provider/Dashboard'
import ProviderWallet from './Pages/provider/Wallet'
import ProviderEarnings from './Pages/provider/Earnings'
import KycUpload from './Pages/provider/KycUpload'
import ProviderBookings from './Pages/provider/Bookings'
import AdminDashboard from './Pages/admin/Dashboard'
import AdminLogin from './Pages/admin/Login'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/customer/dashboard" element={
          <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>
        } />
        <Route path="/customer/bookings" element={
          <ProtectedRoute role="customer"><BookingHistory /></ProtectedRoute>
        } />
        <Route path="/customer/book" element={
          <ProtectedRoute role="customer"><BookService /></ProtectedRoute>
        } />
        <Route path="/customer/payments" element={
          <ProtectedRoute role="customer"><CustomerPayments /></ProtectedRoute>
        } />
        <Route path="/customer/tracking" element={
          <ProtectedRoute role="customer"><LiveTracking /></ProtectedRoute>
        } />
        <Route path="/customer/chat" element={
          <ProtectedRoute role="customer"><Chat /></ProtectedRoute>
        } />
        <Route path="/provider/dashboard" element={
          <ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>
        } />
        <Route path="/provider/wallet" element={
          <ProtectedRoute role="provider"><ProviderWallet /></ProtectedRoute>
        } />
        <Route path="/provider/earnings" element={
          <ProtectedRoute role="provider"><ProviderEarnings /></ProtectedRoute>
        } />
        <Route path="/provider/kyc" element={
          <ProtectedRoute role="provider"><KycUpload /></ProtectedRoute>
        } />
        <Route path="/provider/bookings" element={
          <ProtectedRoute role="provider"><ProviderBookings /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App