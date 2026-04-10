import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';

import LoginPage           from './pages/LoginPage';
import SignupPage          from './pages/SignupPage';
import StudentDashboard    from './pages/StudentDashboard';
import AcademicDashboard   from './pages/AcademicDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminDashboard      from './pages/AdminDashboard';
import ProtectedRoute      from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute requiredRole="student">
              {user => <StudentDashboard user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/academic"
          element={
            <ProtectedRoute requiredRole="academic">
              {user => <AcademicDashboard user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/supervisor"
          element={
            <ProtectedRoute requiredRole="supervisor">
              {user => <SupervisorDashboard user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              {user => <AdminDashboard user={user} />}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
