import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import StudentDashboard from './pages/StudentDashboard'
import AcademicSupervisorDashboard from './pages/AcademicSupervisorDashboard'
import InternshipSupervisorDashboard from './pages/InternshipSupervisorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { Role } from './types'

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role | null>(null)

  const handleLogin = (role: Role) => {
    setCurrentRole(role)
  }

  const handleLogout = () => {
    setCurrentRole(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            currentRole ? (
              <Navigate to={`/dashboard/${currentRole}`} replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            currentRole ? (
              <Layout role={currentRole} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="student" element={<StudentDashboard />} />
          <Route path="academic" element={<AcademicSupervisorDashboard />} />
          <Route path="internship" element={<InternshipSupervisorDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
