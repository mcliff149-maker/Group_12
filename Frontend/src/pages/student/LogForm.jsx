import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { saveLog } from '../../api/students.js';

const STATUS_OPTIONS = [
  { value: 'Draft',     label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
];

const INITIAL = {
  weekNumber: '', logDate: '', company: '',
  activities: '', challenges: '', learningOutcomes: '',
  hoursWorked: '', status: 'Draft',
};

export default function LogForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [saving, setSaving]   = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.weekNumber)                        errs.weekNumber = 'Week number is required.';
    if (!form.logDate)                           errs.logDate = 'Date is required.';
    if (!form.company.trim())                    errs.company = 'Company name is required.';
    if (!form.activities.trim())                 errs.activities = 'Activities are required.';
    if (!form.challenges.trim())                 errs.challenges = 'Challenges field is required.';
    if (!form.learningOutcomes.trim())           errs.learningOutcomes = 'Learning outcomes are required.';
    if (!form.hoursWorked)                       errs.hoursWorked = 'Hours worked is required.';
    else if (isNaN(form.hoursWorked) || +form.hoursWorked <= 0) errs.hoursWorked = 'Enter a valid number.';
    if (!form.status)                            errs.status = 'Status is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await saveLog(user.username, { ...form });
      setSuccess('Log saved successfully!');
      setForm(INITIAL);
      setTimeout(() => navigate('/dashboard/student'), 1500);
    } catch {
      setSuccess('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>📝 New Log Entry</h1>
            <p>Record your internship activities for the week.</p>
          </div>

          {success && <div className="alert alert-success">{success}</div>}

          <div className="card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <FormField label="Week Number" name="weekNumber" type="number" value={form.weekNumber}
                  onChange={handleChange} error={errors.weekNumber} required min={1} max={52} placeholder="1–52" />
                <FormField label="Log Date" name="logDate" type="date" value={form.logDate}
                  onChange={handleChange} error={errors.logDate} required />
              </div>
              <div className="form-row">
                <FormField label="Company / Organization" name="company" value={form.company}
                  onChange={handleChange} error={errors.company} required placeholder="Acme Corp" />
                <FormField label="Hours Worked" name="hoursWorked" type="number" value={form.hoursWorked}
                  onChange={handleChange} error={errors.hoursWorked} required min={0} max={24} placeholder="e.g. 8" />
              </div>
              <FormField label="Daily Activities" name="activities" type="textarea" value={form.activities}
                onChange={handleChange} error={errors.activities} required rows={4}
                placeholder="Describe tasks performed today..." />
              <FormField label="Challenges Faced" name="challenges" type="textarea" value={form.challenges}
                onChange={handleChange} error={errors.challenges} required rows={3}
                placeholder="Any difficulties or blockers..." />
              <FormField label="Learning Outcomes" name="learningOutcomes" type="textarea" value={form.learningOutcomes}
                onChange={handleChange} error={errors.learningOutcomes} required rows={3}
                placeholder="What did you learn?" />
              <div className="form-row">
                <FormField label="Status" name="status" type="select" value={form.status}
                  onChange={handleChange} error={errors.status} required options={STATUS_OPTIONS} />
                <FormField label="Attachment (optional)" name="attachment" type="file" accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={() => {}} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save Log'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard/student')}>
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
