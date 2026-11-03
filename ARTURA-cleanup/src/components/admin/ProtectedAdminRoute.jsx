import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminAuthenticated } from '../../utils/adminAuth.js'

export default function ProtectedAdminRoute() {
  const location = useLocation()
  return isAdminAuthenticated() ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
}
