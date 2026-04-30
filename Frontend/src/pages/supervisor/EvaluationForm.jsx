import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStudentsForSupervisor, submitVerification } from '../../api/supervisors.js';

const RATING_OPTIONS = [
  { value: '1', label: '1 – Poor' },
  { value: '2', label: '2 – Below Average' },
  { value: '3', label: '3 – Average' },
  { value: '4', label: '4 – Good' },
  { value: '5', label: '5 – Excellent' },
];

const INITIAL = {
  internUsername: '', period: '',
  punctuality: '', workQuality: '', teamwork: '', communication: '',
  hoursVerified: '', comments: '',
};

export default function EvaluationForm() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [students, setStudents] = useState([]);
  const [success, setSuccess]   = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    getStudentsForSupervisor().then(setStudents);
  }, []);

  const overallRating = (() => {
    const vals = [form.punctuality, form.workQuality, form.teamwork, form.communication]
      .map(Number).filter(n => n > 0);
    if (!vals.length) return '';
    return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2);
  })();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.internUsername) errs.internUsername = 'Select an intern.';
    if (!form.period.trim())  errs.period = 'Evaluation period is required.';
    if (!form.punctuality)    errs.punctuality = 'Required.';
    if (!form.workQuality)    errs.workQuality = 'Required.';
    if (!form.teamwork)       errs.teamwork = 'Required.';
    if (!form.communication)  errs.communication = 'Required.';
    if (!form.hoursVerified)  errs.hoursVerified = 'Hours verified is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await submitVerification(user.username, { ...form, overallRating });
      setSuccess('Evaluation submitted successfully!');
      setForm(INITIAL);
      setTimeout(() => navigate('/dashboard/supervisor'), 1500);
    } finally {
      setSaving(false);
    }
  }

  const internOptions = students.map(s => ({ value: s.username, label: s.name }));

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>📋 Evaluate Intern</h1>
            <p>Submit a performance evaluation for an intern.</p>
          </div>

          {success && <div className="alert alert-success">{success}</div>}

          <div className="card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <FormField label="Intern" name="internUsername" type="select" value={form.internUsername}
                  onChange={handleChange} error={errors.internUsername} required options={internOptions} />
                <FormField label="Evaluation Period" name="period" value={form.period}
                  onChange={handleChange} error={errors.period} required placeholder="e.g. June 2024" />
              </div>

              <p className="section-title mt-3">Performance Ratings (1–5)</p>
              <div className="form-row">
                <FormField label="Punctuality"   name="punctuality"   type="select" value={form.punctuality}   onChange={handleChange} error={errors.punctuality}   required options={RATING_OPTIONS} />
                <FormField label="Work Quality"  name="workQuality"   type="select" value={form.workQuality}   onChange={handleChange} error={errors.workQuality}   required options={RATING_OPTIONS} />
              </div>
              <div className="form-row">
                <FormField label="Teamwork"      name="teamwork"      type="select" value={form.teamwork}      onChange={handleChange} error={errors.teamwork}      required options={RATING_OPTIONS} />
                <FormField label="Communication" name="communication" type="select" value={form.communication} onChange={handleChange} error={errors.communication} required options={RATING_OPTIONS} />
              </div>

              {overallRating && (
                <div className="alert alert-info">
                  Overall Rating (auto-calculated): <strong>{overallRating} / 5</strong>
                </div>
              )}

              <FormField label="Hours Verified" name="hoursVerified" type="number" value={form.hoursVerified}
                onChange={handleChange} error={errors.hoursVerified} required min={0} placeholder="e.g. 160" />
              <FormField label="Comments" name="comments" type="textarea" value={form.comments}
                onChange={handleChange} rows={4} placeholder="General observations and recommendations..." />

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Submitting…' : '✅ Submit Evaluation'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard/supervisor')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
