import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getProfile, updateProfile } from '../../api/auth.js';

export default function StudentProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name:              user.name || '',
    email:             user.email || '',
    phone:             '',
    university:        '',
    program:           '',
    yearOfStudy:       '',
    companyName:       '',
    supervisorContact: '',
  });
  const [success, setSuccess] = useState('');
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(data => {
      const pd = data.profileData || {};
      setForm({
        name:              data.name || user.name,
        email:             data.email || user.email,
        phone:             pd.phone             || '',
        university:        pd.university        || '',
        program:           pd.program           || '',
        yearOfStudy:       pd.yearOfStudy       || '',
        companyName:       pd.companyName       || '',
        supervisorContact: pd.supervisorContact || '',
      });
    }).finally(() => setLoading(false));
  }, [user]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    return errs;
  }

  async function handleSave(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const { name, email, ...rest } = form;
    await updateProfile({ name, email, profile_data: rest });
    setSuccess('Profile saved successfully!');
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
            <h1>👤 My Profile</h1>
            <p>Manage your personal and internship information.</p>
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
                <FormField label="Phone"       name="phone"       value={form.phone}       onChange={handleChange} placeholder="+1 555 0100" />
                <FormField label="University"  name="university"  value={form.university}  onChange={handleChange} placeholder="State University" />
              </div>
              <div className="form-row">
                <FormField label="Program / Course"  name="program"     value={form.program}     onChange={handleChange} placeholder="Computer Science" />
                <FormField label="Year of Study"     name="yearOfStudy" type="number" value={form.yearOfStudy} onChange={handleChange} min={1} max={8} placeholder="3" />
              </div>
              <div className="form-row">
                <FormField label="Company Name"       name="companyName"       value={form.companyName}       onChange={handleChange} placeholder="Acme Corp" />
                <FormField label="Supervisor Contact" name="supervisorContact" value={form.supervisorContact} onChange={handleChange} placeholder="supervisor@corp.com" />
              </div>
              <button className="btn btn-primary" type="submit">💾 Save Profile</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
