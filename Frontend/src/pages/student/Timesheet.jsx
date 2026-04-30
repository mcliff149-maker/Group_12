import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getTimesheets, saveTimesheet } from '../../api/students.js';

const INITIAL_ENTRY = { date: '', startTime: '', endTime: '', taskDescription: '' };

function calcHours(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  return diff > 0 ? +(diff / 60).toFixed(2) : 0;
}

export default function Timesheet() {
  const { user }   = useAuth();
  const [entries, setEntries]   = useState([]);
  const [form, setForm]         = useState(INITIAL_ENTRY);
  const [errors, setErrors]     = useState({});
  const [success, setSuccess]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getTimesheets(user.username).then(setEntries);
  }, [user.username]);

  const totalHours = entries.reduce((s, e) => s + (parseFloat(e.hours) || 0), 0);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.date)                      errs.date = 'Date is required.';
    if (!form.startTime)                 errs.startTime = 'Start time is required.';
    if (!form.endTime)                   errs.endTime = 'End time is required.';
    if (!form.taskDescription.trim())    errs.taskDescription = 'Task description is required.';
    if (form.startTime && form.endTime && calcHours(form.startTime, form.endTime) <= 0)
      errs.endTime = 'End time must be after start time.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const hours = calcHours(form.startTime, form.endTime);
      const entry = await saveTimesheet(user.username, { ...form, hours, status: 'Pending' });
      setEntries(prev => [...prev, entry]);
      setSuccess('Entry added successfully!');
      setForm(INITIAL_ENTRY);
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
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
          <div className="page-heading flex-between">
            <div>
              <h1>🕐 Timesheet</h1>
              <p>Track your daily work hours.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
              {showForm ? 'Cancel' : '+ Add Entry'}
            </button>
          </div>

          {success && <div className="alert alert-success">{success}</div>}

          {showForm && (
            <div className="card mb-3">
              <p className="section-title">New Timesheet Entry</p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <FormField label="Date" name="date" type="date" value={form.date}
                    onChange={handleChange} error={errors.date} required />
                  <FormField label="Task Description" name="taskDescription" value={form.taskDescription}
                    onChange={handleChange} error={errors.taskDescription} required placeholder="What did you work on?" />
                </div>
                <div className="form-row">
                  <FormField label="Start Time" name="startTime" type="time" value={form.startTime}
                    onChange={handleChange} error={errors.startTime} required />
                  <FormField label="End Time" name="endTime" type="time" value={form.endTime}
                    onChange={handleChange} error={errors.endTime} required />
                </div>
                {form.startTime && form.endTime && (
                  <p className="text-muted mb-2">
                    Calculated: <strong>{calcHours(form.startTime, form.endTime)} hours</strong>
                  </p>
                )}
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save Entry'}
                </button>
              </form>
            </div>
          )}

          <div className="card">
            <div className="flex-between mb-3">
              <p className="section-title" style={{ margin: 0 }}>Timesheet Entries</p>
              <span className="badge badge-success">Total: {totalHours.toFixed(2)} hrs</span>
            </div>
            {entries.length === 0 ? (
              <p className="text-muted">No entries yet. Add your first timesheet entry above.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Hours</th>
                    <th>Task</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().map(e => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td>{e.startTime}</td>
                      <td>{e.endTime}</td>
                      <td><strong>{e.hours}h</strong></td>
                      <td>{e.taskDescription}</td>
                      <td><span className="badge badge-secondary">{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
