import { Navigate } from 'react-router-dom';

/**
 * Reads the session from sessionStorage.
 * If no session exists, redirects to /login.
 * If a role mismatch is detected, redirects to the correct dashboard.
 */
export default function ProtectedRoute({ requiredRole, children }) {
  const raw = sessionStorage.getItem('iles_user');
  if (!raw) return <Navigate to="/login" replace />;

  const user = JSON.parse(raw);
  if (requiredRole && user.role !== requiredRole) {
    const routes = {
      student:    '/dashboard/student',
      academic:   '/dashboard/academic',
      supervisor: '/dashboard/supervisor',
      admin:      '/dashboard/admin',
    };
    return <Navigate to={routes[user.role] ?? '/login'} replace />;
  }

  return children(user);
}
