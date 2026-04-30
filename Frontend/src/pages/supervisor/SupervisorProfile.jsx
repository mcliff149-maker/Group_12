import { useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const PROFILE_KEY = 'iles_f2_profile_';

function loadProfile(username) {
  const raw = localStorage.getItem(PROFILE_KEY + username);
  return raw ? JSON.parse(raw) : {};
}

export default function SupervisorProfile() {
  const { user } = useAuth();
  const saved    = loadProfile(user.username);

  const [form, setForm]   = useState({
    name:       saved.name       || user.name,
    email:      saved.email      || user.email,
    company:    saved.company    || '',
    department: saved.department || '',
    position:   saved.position   || '',
    phone:      saved.phone      || '',
  });
  const [success, setSuccess] = useState('');
  const [errors, setErrors]   = useState({});

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function handleSave(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim())  errs.name  = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    localStorage.setItem(PROFILE_KEY + user.username, JSON.stringify(form));
    setSuccess('Profile saved!');
    setTimeout(() => setSuccess(''), 3000);
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>👤 Supervisor Profile</h1>
            <p>Update your company and contact information.</p>
          </div>
          {success && <div className="alert alert-success">{success}</div>}
          <div className="card">
            <form onSubmit={handleSave} noValidate>
              <FormField label="Username" name="username" value={user.username} onChange={() => {}} readOnly />
              <div className="form-row">
                <FormField label="Full Name"  name="name"  value={form.name}  onChange={handleChange} error={errors.name}  required />
                <FormField label="Email"      name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
              </div>
              <div className="form-row">
                <FormField label="Company"    name="company"    value={form.company}    onChange={handleChange} placeholder="Acme Corporation" />
                <FormField label="Department" name="department" value={form.department} onChange={handleChange} placeholder="Engineering" />
              </div>
              <div className="form-row">
                <FormField label="Position"   name="position"   value={form.position}   onChange={handleChange} placeholder="Senior Engineer" />
                <FormField label="Phone"      name="phone"      value={form.phone}      onChange={handleChange} placeholder="+1 555 0300" />
              </div>
              <button className="btn btn-primary" type="submit">💾 Save Profile</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
