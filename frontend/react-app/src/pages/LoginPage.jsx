import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { listLocalAccounts, hashCredential } from '../utils/localAccounts';

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

    const identifier = form.username.trim().toLowerCase();
    const user = listLocalAccounts().find(
      u =>
        (u.username?.toLowerCase() === identifier || u.email?.toLowerCase() === identifier) &&
        u.passwordHash === hashCredential(form.password) &&
        u.role === form.role
    );

    if (!user) {
      setBanner('Invalid credentials or role.');
      return;
    }

    sessionStorage.setItem('iles_user', JSON.stringify({ username: user.username, name: user.name, role: user.role }));
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
                placeholder="e.g. jane01 or jane@example.com"
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

        </div>
      </div>
    </div>
  );
}
