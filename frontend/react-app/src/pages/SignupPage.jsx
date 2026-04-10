import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ROLE_ROUTES = {
  student:    '/dashboard/student',
  academic:   '/dashboard/academic',
  supervisor: '/dashboard/supervisor',
  admin:      '/dashboard/admin',
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', role: '',
  });
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState('');

  function validate() {
    const e = {};
    if (!form.name.trim())       e.name    = 'Full name is required.';
    if (!form.email.trim())      e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                 e.email   = 'Enter a valid email address.';
    if (!form.password)          e.password = 'Password is required.';
    else if (form.password.length < 6)
                                 e.password = 'Password must be at least 6 characters.';
    if (!form.confirm)           e.confirm  = 'Please confirm your password.';
    else if (form.confirm !== form.password)
                                 e.confirm  = 'Passwords do not match.';
    /* role is optional — defaults to 'student' if not selected */
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    const role = form.role || 'student';
    /* Store in sessionStorage and redirect */
    sessionStorage.setItem('iles_user', JSON.stringify({ name: form.name, role }));
    setSuccess('Account created! Redirecting…');
    setTimeout(() => navigate(ROLE_ROUTES[role]), 1000);
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        ILES <span>— Internship Logging &amp; Evaluation System</span>
      </header>

      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Create an account ✨</h2>
          <p className="subtitle">Fill in the details below to get started.</p>

          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text"
                placeholder="Jane Smith"
                value={form.name} onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={form.email} onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password" name="password" type="password"
                  autoComplete="new-password"
                  placeholder="min. 6 chars"
                  value={form.password} onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm" name="confirm" type="password"
                  autoComplete="new-password"
                  placeholder="repeat password"
                  value={form.confirm} onChange={handleChange}
                  className={errors.confirm ? 'error' : ''}
                />
                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role <em style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</em></label>
              <select
                id="role" name="role"
                value={form.role} onChange={handleChange}
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
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
