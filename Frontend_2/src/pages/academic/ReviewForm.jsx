import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getLogs } from '../../api/students.js';

const MOCK_STUDENTS = [
  { username: 'student1', name: 'Alice Johnson' },
  { username: 'student2', name: 'Bob Martinez' },
];
const RECOMMENDATIONS = [
  { value: 'Approve', label: 'Approve' },
  { value: 'Reject',  label: 'Reject' },
  { value: 'Revise',  label: 'Request Revision' },
];
const REVIEWS_KEY = 'iles_f2_reviews';

function loadReviews() {
  const raw = localStorage.getItem(REVIEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveReview(review) {
  const reviews = loadReviews();
  reviews.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

const INITIAL = { studentUsername: '', logId: '', score: '', feedback: '', recommendation: '', comments: '', reviewDate: '' };

export default function ReviewForm() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [logs, setLogs]       = useState([]);
  const [success, setSuccess] = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (form.studentUsername) {
      getLogs(form.studentUsername).then(setLogs);
    } else {
      setLogs([]);
    }
  }, [form.studentUsername]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.studentUsername) errs.studentUsername = 'Select a student.';
    if (!form.logId)           errs.logId = 'Select a log.';
    if (!form.score)           errs.score = 'Score is required.';
    else if (+form.score < 0 || +form.score > 100) errs.score = 'Score must be 0–100.';
    if (!form.feedback.trim()) errs.feedback = 'Feedback is required.';
    if (!form.recommendation)  errs.recommendation = 'Select a recommendation.';
    if (!form.reviewDate)      errs.reviewDate = 'Review date is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      saveReview({ ...form, id: `rev_${Date.now()}`, reviewerUsername: user.username });
      setSuccess('Review submitted successfully!');
      setForm(INITIAL);
      setTimeout(() => navigate('/dashboard/academic'), 1500);
    } finally {
      setSaving(false);
    }
  }

  const logOptions = logs.map(l => ({ value: l.id, label: `Week ${l.weekNumber} – ${l.logDate} (${l.company})` }));
  const studentOptions = MOCK_STUDENTS.map(s => ({ value: s.username, label: s.name }));

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>🔍 Review Log</h1>
            <p>Evaluate and provide feedback on a student's internship log.</p>
          </div>

          {success && <div className="alert alert-success">{success}</div>}

          <div className="card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <FormField label="Student" name="studentUsername" type="select" value={form.studentUsername}
                  onChange={handleChange} error={errors.studentUsername} required options={studentOptions} />
                <FormField label="Log Entry" name="logId" type="select" value={form.logId}
                  onChange={handleChange} error={errors.logId} required
                  options={logOptions.length ? logOptions : [{ value: '', label: form.studentUsername ? 'No logs found' : 'Select student first' }]} />
              </div>
              <div className="form-row">
                <FormField label="Score (0–100)" name="score" type="number" value={form.score}
                  onChange={handleChange} error={errors.score} required min={0} max={100} placeholder="85" />
                <FormField label="Recommendation" name="recommendation" type="select" value={form.recommendation}
                  onChange={handleChange} error={errors.recommendation} required options={RECOMMENDATIONS} />
              </div>
              <FormField label="Feedback" name="feedback" type="textarea" value={form.feedback}
                onChange={handleChange} error={errors.feedback} required rows={4}
                placeholder="Provide detailed feedback on the student's performance..." />
              <FormField label="Additional Comments" name="comments" type="textarea" value={form.comments}
                onChange={handleChange} rows={3} placeholder="Any additional remarks..." />
              <FormField label="Review Date" name="reviewDate" type="date" value={form.reviewDate}
                onChange={handleChange} error={errors.reviewDate} required />
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Submitting…' : '✅ Submit Review'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard/academic')}>
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
