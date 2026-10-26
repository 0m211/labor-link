import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  role?: 'customer' | 'provider' | 'admin'
}

function ProtectedRoute({ children, role }: Props) {
  const token = localStorage.getItem('accessToken')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  if (!token || !user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    if (user.role === 'customer') return <Navigate to="/customer/dashboard" replace />
    if (user.role === 'provider') return <Navigate to="/provider/dashboard" replace />
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute