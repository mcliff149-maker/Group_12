import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getProfile, updateProfile } from '../../api/auth.js';

export default function AcademicProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:         user.name  || '',
    email:        user.email || '',
    department:   '',
    faculty:      '',
    officeNumber: '',
    phone:        '',
  });
  const [success, setSuccess] = useState('');
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(data => {
      const pd = data.profileData || {};
      setForm({
        name:         data.name  || user.name,
        email:        data.email || user.email,
        department:   pd.department   || '',
        faculty:      pd.faculty      || '',
        officeNumber: pd.officeNumber || '',
        phone:        pd.phone        || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  async function handleSave(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim())  errs.name  = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const { name, email, ...rest } = form;
    await updateProfile({ name, email, profile_data: rest });
    setSuccess('Profile saved!');
    setTimeout(() => setSuccess(''), 3000);
  }

  if (loading) return null;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>👤 Academic Profile</h1>
            <p>Update your academic supervisor information.</p>
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
                <FormField label="Department"    name="department"   value={form.department}   onChange={handleChange} placeholder="Computer Science Dept." />
                <FormField label="Faculty"       name="faculty"      value={form.faculty}      onChange={handleChange} placeholder="Faculty of Engineering" />
              </div>
              <div className="form-row">
                <FormField label="Office Number" name="officeNumber" value={form.officeNumber} onChange={handleChange} placeholder="Room 204" />
                <FormField label="Phone"         name="phone"        value={form.phone}        onChange={handleChange} placeholder="+1 555 0200" />
              </div>
              <button className="btn btn-primary" type="submit">💾 Save Profile</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
