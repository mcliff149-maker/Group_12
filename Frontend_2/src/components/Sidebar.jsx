import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = {
  student: [
    { to: '/dashboard/student',           label: '🏠 Dashboard' },
    { to: '/dashboard/student/log',       label: '📝 Log Entry' },
    { to: '/dashboard/student/timesheet', label: '🕐 Timesheet' },
    { to: '/dashboard/student/profile',   label: '👤 Profile' },
  ],
  academic: [
    { to: '/dashboard/academic',          label: '🏠 Dashboard' },
    { to: '/dashboard/academic/review',   label: '🔍 Review Logs' },
    { to: '/dashboard/academic/profile',  label: '👤 Profile' },
  ],
  supervisor: [
    { to: '/dashboard/supervisor',             label: '🏠 Dashboard' },
    { to: '/dashboard/supervisor/evaluate',    label: '📋 Evaluate Intern' },
    { to: '/dashboard/supervisor/profile',     label: '👤 Profile' },
  ],
  admin: [
    { to: '/dashboard/admin',             label: '🏠 Dashboard' },
    { to: '/dashboard/admin',             label: '👥 User Management' },
    { to: '/dashboard/admin/profile',     label: '👤 Profile' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const links = NAV_LINKS[user.role] || [];

  return (
    <aside className="sidebar">
      <p className="sidebar-title">Navigation</p>
      {links.map((link, i) => (
        <NavLink
          key={i}
          to={link.to}
          end={link.to.split('/').length === 3}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
