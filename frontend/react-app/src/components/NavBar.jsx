import { useNavigate } from 'react-router-dom';

/**
 * Top navigation bar shown on all dashboard pages.
 * Props: userName (string), role (string)
 */
export default function NavBar({ userName, role }) {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem('iles_user');
    navigate('/login');
  }

  const roleLabels = {
    student:    '🎓 Student',
    academic:   '📚 Academic Supervisor',
    supervisor: '🏢 Internship Supervisor',
    admin:      '⚙️ Administrator',
  };

  return (
    <nav className="top-nav">
      <span className="brand">
        ILES <span>— Internship Logging &amp; Evaluation System</span>
      </span>
      <div className="nav-actions">
        <span className="user-badge">
          {roleLabels[role] ?? role} — {userName}
        </span>
        <button className="btn btn-logout" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
