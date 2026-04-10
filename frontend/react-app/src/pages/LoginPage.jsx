import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/* ------------------------------------------------------------------
   Mock user list — in a real app this would be an API call.
   Matches the seed accounts from the existing HTML pages.
------------------------------------------------------------------ */
const MOCK_USERS = [
  { username: 'student1',    password: 'pass123', role: 'student',    name: 'Alice Johnson' },
  { username: 'academic1',   password: 'pass123', role: 'academic',   name: 'Dr. Bernard Smith' },
  { username: 'supervisor1', password: 'pass123', role: 'supervisor', name: 'Carol White' },
  { username: 'admin1',      password: 'pass123', role: 'admin',      name: 'Dave Admin' },
];

const ROLE_ROUTES = {
  student:    '/dashboard/student',
  academic:   '/dashboard/academic',
  supervisor: '/dashboard/supervisor',
  admin:      '/dashboard/admin',
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ username: '', password: '', role: '' });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Username or email is required.';
    if (!form.password)        e.password = 'Password is required.';
    if (!form.role)            e.role     = 'Please select your role.';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
    setBanner('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    const user = MOCK_USERS.find(
      u => u.username === form.username.trim() &&
           u.password === form.password &&
           u.role     === form.role
    );

    if (!user) {
      setBanner('Invalid credentials or role. Check the demo accounts below.');
      return;
    }

    sessionStorage.setItem('iles_user', JSON.stringify({ name: user.name, role: user.role }));
    navigate(ROLE_ROUTES[user.role]);
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        ILES <span>— Internship Logging &amp; Evaluation System</span>
      </header>

      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Sign in 👋</h2>
          <p className="subtitle">Welcome back! Enter your details to continue.</p>

          {banner && <div className="alert alert-error">{banner}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username / Email</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="e.g. student1"
                value={form.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className={errors.role ? 'error' : ''}
              >
                <option value="">— Select your role —</option>
                <option value="student">🎓 Student</option>
                <option value="academic">📚 Academic Supervisor</option>
                <option value="supervisor">🏢 Internship Supervisor</option>
                <option value="admin">⚙️ Administrator</option>
              </select>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Sign In</button>
            </div>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          <details style={{ marginTop: '1.2rem', fontSize: '.78rem', color: 'var(--text-muted)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Demo accounts</summary>
            <table style={{ marginTop: '.5rem', width: '100%', fontSize: '.76rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Username</th>
                  <th style={{ textAlign: 'left' }}>Password</th>
                  <th style={{ textAlign: 'left' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map(u => (
                  <tr key={u.username}>
                    <td>{u.username}</td>
                    <td>pass123</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      </div>
    </div>
  );
}
