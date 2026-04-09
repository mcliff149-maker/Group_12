import { useState } from 'react'
import { Role } from '../types'
import './LoginPage.css'

interface LoginPageProps {
  onLogin: (role: Role) => void
}

const roles: { value: Role; label: string; icon: string; color: string; description: string }[] = [
  {
    value: 'student',
    label: 'Student',
    icon: '🎓',
    color: 'var(--student-primary)',
    description: 'View placements, submit weekly logs, track scores',
  },
  {
    value: 'academic',
    label: 'Academic Supervisor',
    icon: '📚',
    color: 'var(--academic-primary)',
    description: 'Evaluate students, review log submissions, manage evaluations',
  },
  {
    value: 'internship',
    label: 'Internship Supervisor',
    icon: '🏢',
    color: 'var(--internship-primary)',
    description: 'Approve weekly logs, conduct performance reviews',
  },
  {
    value: 'admin',
    label: 'System Administrator',
    icon: '⚙️',
    color: 'var(--admin-primary)',
    description: 'Manage users, placements, compute final scores',
  },
]

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selected, setSelected] = useState<Role | null>(null)

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1>Internship Management System</h1>
          <p>Select your role to continue</p>
        </div>

        <div className="role-grid">
          {roles.map((r) => (
            <button
              key={r.value}
              className={`role-option ${selected === r.value ? 'selected' : ''}`}
              style={{
                background: r.color,
                borderColor: selected === r.value ? 'var(--text-primary)' : 'transparent',
              }}
              onClick={() => setSelected(r.value)}
            >
              <span className="role-icon">{r.icon}</span>
              <span className="role-label">{r.label}</span>
              <span className="role-desc">{r.description}</span>
            </button>
          ))}
        </div>

        <button
          className="login-btn"
          disabled={!selected}
          onClick={() => selected && onLogin(selected)}
        >
          Continue →
        </button>

        <p className="login-note">
          Demo mode — no credentials required. Select a role above to explore the system.
        </p>
      </div>
    </div>
  )
}
