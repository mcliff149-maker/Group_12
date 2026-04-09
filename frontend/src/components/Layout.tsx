import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Role } from '../types'
import './Layout.css'

interface LayoutProps {
  role: Role
  onLogout: () => void
}

const roleConfig: Record<Role, { label: string; color: string; path: string; icon: string }> = {
  student:    { label: 'Student',                icon: '🎓', color: 'var(--student-accent)',    path: '/dashboard/student' },
  academic:   { label: 'Academic Supervisor',    icon: '📚', color: 'var(--academic-accent)',   path: '/dashboard/academic' },
  internship: { label: 'Internship Supervisor',  icon: '🏢', color: 'var(--internship-accent)', path: '/dashboard/internship' },
  admin:      { label: 'System Administrator',   icon: '⚙️',  color: 'var(--admin-accent)',      path: '/dashboard/admin' },
}

export default function Layout({ role, onLogout }: LayoutProps) {
  const navigate = useNavigate()
  const config = roleConfig[role]

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="layout">
      <aside className="sidebar" style={{ borderColor: config.color }}>
        <div className="sidebar-brand">
          <span className="sidebar-icon">{config.icon}</span>
          <div>
            <div className="sidebar-title">IMS</div>
            <div className="sidebar-role">{config.label}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to={config.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { background: config.color } : {}}>
            <span>🏠</span> Dashboard
          </NavLink>
          {role === 'student' && (
            <>
              <NavLink to="/dashboard/student" end className="nav-item" style={{ pointerEvents: 'none', opacity: 0.6 }}>
                <span>📋</span> My Logs
              </NavLink>
              <NavLink to="/dashboard/student" end className="nav-item" style={{ pointerEvents: 'none', opacity: 0.6 }}>
                <span>📊</span> My Scores
              </NavLink>
            </>
          )}
          {role === 'academic' && (
            <>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>👥</span> My Students</span>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>📝</span> Evaluations</span>
            </>
          )}
          {role === 'internship' && (
            <>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>👷</span> Interns</span>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>✅</span> Log Approvals</span>
            </>
          )}
          {role === 'admin' && (
            <>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>👤</span> Users</span>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>🏫</span> Placements</span>
              <span className="nav-item" style={{ opacity: 0.6 }}><span>📈</span> Reports</span>
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🔓 Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
