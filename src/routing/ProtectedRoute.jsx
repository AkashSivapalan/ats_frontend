import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function ProtectedRoute({ children }) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return children
}

