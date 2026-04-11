import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth.js';
import FormField from '../components/FormField.jsx';

const ROLE_OPTIONS = [
  { value: 'student',    label: 'Student' },
  { value: 'academic',   label: 'Academic Supervisor' },
  { value: 'supervisor', label: 'Internship Supervisor' },
];

const INITIAL = { name: '', email: '', username: '', password: '', confirmPassword: '', role: '' };

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]  = useState(false);
  const [loading, setLoading]  = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())                      errs.name = 'Full name is required.';
    if (!form.email.trim())                     errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.username.trim())                  errs.username = 'Username is required.';
    else if (form.username.length < 3)          errs.username = 'At least 3 characters.';
    if (!form.password)                         errs.password = 'Password is required.';
    else if (form.password.length < 6)          errs.password = 'At least 6 characters.';
    if (!form.confirmPassword)                  errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!form.role)                             errs.role = 'Please select a role.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await signUp({ name: form.name, email: form.email, username: form.username, password: form.password, role: form.role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join the ILES platform</p>

        {success && <div className="alert alert-success">Account created! Redirecting to login…</div>}
        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Full Name"        name="name"            value={form.name}            onChange={handleChange} error={errors.name}            required placeholder="Jane Doe" />
          <FormField label="Email"            name="email"           type="email" value={form.email} onChange={handleChange} error={errors.email}   required placeholder="jane@example.com" />
          <FormField label="Username"         name="username"        value={form.username}         onChange={handleChange} error={errors.username}        required placeholder="janedoe" />
          <FormField label="Password"         name="password"        type="password" value={form.password} onChange={handleChange} error={errors.password}  required placeholder="Min 6 chars" />
          <FormField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required placeholder="Repeat password" />
          <FormField label="Role"             name="role"            type="select" value={form.role} onChange={handleChange} error={errors.role}     required options={ROLE_OPTIONS} />
          <button className="btn btn-primary full-width mt-3" type="submit" disabled={loading || success}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
