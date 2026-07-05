import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminRole } from '../utils/auth'

function ProtectedAdminRoute() {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (!isAdminRole(role)) {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}

export default ProtectedAdminRoute
