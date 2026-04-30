import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_DASHBOARDS = {
  student:    '/dashboard/student',
  academic:   '/dashboard/academic',
  supervisor: '/dashboard/supervisor',
  admin:      '/dashboard/admin',
};

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROLE_DASHBOARDS[user.role] || '/login'} replace />;
  }

  return children;
}
