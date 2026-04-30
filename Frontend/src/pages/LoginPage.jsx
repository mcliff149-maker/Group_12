import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';

const ROLE_OPTIONS = [
  { value: 'student',    label: 'Student' },
  { value: 'academic',   label: 'Academic Supervisor' },
  { value: 'supervisor', label: 'Internship Supervisor' },
  { value: 'admin',      label: 'Admin' },
];

const ROLE_DASHBOARD = {
  student:    '/dashboard/student',
  academic:   '/dashboard/academic',
  supervisor: '/dashboard/supervisor',
  admin:      '/dashboard/admin',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required.';
    if (!form.password) errs.password = 'Password is required.';
    if (!form.role) errs.role = 'Please select a role.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const { user, token } = await signIn(form.username, form.password, form.role);
      login(user, token);
      navigate(ROLE_DASHBOARD[user.role]);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Welcome to ILES</h1>
        <p className="subtitle">Sign in to your account</p>

        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Username" name="username" value={form.username}
            onChange={handleChange} error={errors.username} required
            placeholder="Enter username"
          />
          <FormField
            label="Password" name="password" type="password" value={form.password}
            onChange={handleChange} error={errors.password} required
            placeholder="Enter password"
          />
          <FormField
            label="Role" name="role" type="select" value={form.role}
            onChange={handleChange} error={errors.role} required
            options={ROLE_OPTIONS}
          />
          <button className="btn btn-primary full-width mt-3" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
