import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'

export default function AuthGuard() {
  const { user } = useAuthStore()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}