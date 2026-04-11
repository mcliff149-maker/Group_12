import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_LABELS = {
  student: 'Student',
  academic: 'Academic Supervisor',
  supervisor: 'Internship Supervisor',
  admin: 'Admin',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">🎓 ILES</span>
      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">
              {user.name}
            </span>
            <span className={`badge badge-${user.role}`}>
              {ROLE_LABELS[user.role] || user.role}
            </span>
          </>
        )}
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
