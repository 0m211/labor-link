import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  role: 'customer' | 'provider' | 'admin';
}

export default function ProtectedRoute({ children, role }: Props) {
  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');

  const user =
    JSON.parse(localStorage.getItem('user') || '{}') ||
    JSON.parse(sessionStorage.getItem('user') || '{}');

  const userRole =
    user.role ||
    localStorage.getItem('userRole') ||
    sessionStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" replace />;

  if (userRole !== role) {
    if (userRole === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    }

    if (userRole === 'provider') {
      return <Navigate to="/provider/dashboard" replace />;
    }

    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}