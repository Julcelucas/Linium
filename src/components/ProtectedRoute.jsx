import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { authReady, isAuthenticated, user } = useAuth()

  if (!authReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />
  }

  return children
}
