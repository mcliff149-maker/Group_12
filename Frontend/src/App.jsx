import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import LogForm from './pages/student/LogForm.jsx';
import Timesheet from './pages/student/Timesheet.jsx';
import StudentProfile from './pages/student/StudentProfile.jsx';

import AcademicDashboard from './pages/academic/AcademicDashboard.jsx';
import ReviewForm from './pages/academic/ReviewForm.jsx';
import AcademicProfile from './pages/academic/AcademicProfile.jsx';

import SupervisorDashboard from './pages/supervisor/SupervisorDashboard.jsx';
import EvaluationForm from './pages/supervisor/EvaluationForm.jsx';
import SupervisorProfile from './pages/supervisor/SupervisorProfile.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student routes */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/student/log" element={
            <ProtectedRoute requiredRole="student"><LogForm /></ProtectedRoute>
          } />
          <Route path="/dashboard/student/timesheet" element={
            <ProtectedRoute requiredRole="student"><Timesheet /></ProtectedRoute>
          } />
          <Route path="/dashboard/student/profile" element={
            <ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>
          } />

          {/* Academic routes */}
          <Route path="/dashboard/academic" element={
            <ProtectedRoute requiredRole="academic"><AcademicDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/academic/review" element={
            <ProtectedRoute requiredRole="academic"><ReviewForm /></ProtectedRoute>
          } />
          <Route path="/dashboard/academic/profile" element={
            <ProtectedRoute requiredRole="academic"><AcademicProfile /></ProtectedRoute>
          } />

          {/* Supervisor routes */}
          <Route path="/dashboard/supervisor" element={
            <ProtectedRoute requiredRole="supervisor"><SupervisorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/supervisor/evaluate" element={
            <ProtectedRoute requiredRole="supervisor"><EvaluationForm /></ProtectedRoute>
          } />
          <Route path="/dashboard/supervisor/profile" element={
            <ProtectedRoute requiredRole="supervisor"><SupervisorProfile /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin/profile" element={
            <ProtectedRoute requiredRole="admin"><AdminProfile /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
