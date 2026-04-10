import { useState } from 'react';
import NavBar from '../components/NavBar';
import DashboardEditor from '../components/DashboardEditor';
import { loadConfig, saveConfig } from '../utils/dashboardConfig';

/* ------------------------------------------------------------------
   Initial mock data
------------------------------------------------------------------ */
const INITIAL_STUDENTS = [
  { id: 1, name: 'Alice Johnson',  company: 'Acme Corp',     log: 'Week 1 submitted',     status: 'Pending'  },
  { id: 2, name: 'Bob Martinez',   company: 'TechStart Ltd', log: 'Week 1 & 2 submitted', status: 'Pending'  },
  { id: 3, name: 'Chloe Lee',      company: 'Innovate GmbH', log: 'Week 1 submitted',     status: 'Approved' },
  { id: 4, name: 'David Okonkwo',  company: 'DataFlow Inc',  log: 'No log submitted yet', status: 'Pending'  },
];

const SCHEDULE = [
  { id: 1, date: '14 Apr', desc: 'Review Alice — Week 2 log' },
  { id: 2, date: '15 Apr', desc: 'Department meeting' },
  { id: 3, date: '18 Apr', desc: 'Review Bob — Week 1 & 2 logs' },
  { id: 4, date: '22 Apr', desc: 'Mid-term evaluation submissions due' },
];

const ANNOUNCEMENTS = [
  { id: 1, text: 'Academic supervisor meeting: 16 Apr at 10:00' },
  { id: 2, text: 'Evaluation portal update scheduled for weekend' },
  { id: 3, text: 'Reminder: submit mid-term grades by 25 Apr' },
];

const statusClass = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' };

export default function AcademicDashboard({ user }) {
  const username = user.username ?? user.name;

  // widget config
  const [config, setConfig] = useState(() => loadConfig(username, 'academic'));
  const [editing, setEditing] = useState(false);

  function handleSave(updated) {
    const next = { ...config, widgets: updated };
    setConfig(next);
    saveConfig(username, next);
    setEditing(false);
  }

  // local data
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  function setStatus(id, status) {
    setStudents(ss => ss.map(s => s.id === id ? { ...s, status } : s));
  }

  const widgets = [...config.widgets].sort((a, b) => a.order - b.order);

  function renderWidget(w) {
    if (!w.visible) return null;
    const s = w.settings ?? {};

    if (w.id === 'students') {
      return (
        <div className="card" key={w.id}>
          <h3>👩‍🎓 Student Overview</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Student</th><th>Company</th><th>Log Status</th><th>Evaluation</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {students.map((st, i) => (
                  <tr key={st.id}>
                    <td>{i + 1}</td>
                    <td><strong>{st.name}</strong></td>
                    <td>{st.company}</td>
                    <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{st.log}</td>
                    <td><span className={`status ${statusClass[st.status]}`}>{st.status}</span></td>
                    <td style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-success btn-sm" disabled={st.status === 'Approved'} onClick={() => setStatus(st.id, 'Approved')}>✔ Approve</button>
                      <button className="btn btn-danger btn-sm"  disabled={st.status === 'Rejected'} onClick={() => setStatus(st.id, 'Rejected')}>✖ Reject</button>
                      {st.status !== 'Pending' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setStatus(st.id, 'Pending')}>↩ Reset</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '.78rem', color: 'var(--text-muted)' }}>
            Approved: {students.filter(s => s.status === 'Approved').length} &nbsp;|&nbsp;
            Rejected: {students.filter(s => s.status === 'Rejected').length} &nbsp;|&nbsp;
            Pending:  {students.filter(s => s.status === 'Pending').length}
          </p>
        </div>
      );
    }

    if (w.id === 'pending') {
      const pending = students.filter(s => s.status === 'Pending');
      return (
        <div className="card" key={w.id}>
          <h3>⏳ Pending Reviews</h3>
          {pending.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>No pending reviews — great work! 🎉</p>
            : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {pending.map(p => (
                  <li key={p.id} style={{
                    padding: '.45rem .7rem',
                    background: 'var(--warn-bg)',
                    color: 'var(--warn-text)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '.86rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span><strong>{p.name}</strong> — {p.log}</span>
                    <button className="btn btn-success btn-sm" onClick={() => setStatus(p.id, 'Approved')}>✔ Approve</button>
                  </li>
                ))}
              </ul>
            )}
        </div>
      );
    }

    if (w.id === 'schedule') {
      const range = Number(s.range ?? 7);
      return (
        <div className="card" key={w.id}>
          <h3>📅 Schedule <span style={{ fontSize: '.76rem', color: 'var(--text-muted)', fontWeight: 400 }}>— next {range} days</span></h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {SCHEDULE.slice(0, range <= 7 ? 2 : range <= 14 ? 3 : 4).map(ev => (
              <li key={ev.id} style={{
                padding: '.45rem .7rem',
                background: 'var(--accent-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '.86rem',
                display: 'flex',
                gap: '.7rem',
              }}>
                <strong style={{ color: 'var(--accent-dark)', minWidth: '4rem' }}>{ev.date}</strong>
                <span>{ev.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (w.id === 'announcements') {
      const limit = s.limit ?? 5;
      return (
        <div className="card" key={w.id}>
          <h3>📢 Announcements</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {ANNOUNCEMENTS.slice(0, limit).map(a => (
              <li key={a.id} style={{
                padding: '.45rem .7rem',
                background: 'var(--academic-bg)',
                color: 'var(--academic-text)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '.86rem',
              }}>{a.text}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="dashboard-page">
      <NavBar userName={user.name} role="academic" />

      {editing && (
        <DashboardEditor
          widgets={config.widgets}
          onSave={handleSave}
          onClose={() => setEditing(false)}
          role="academic"
        />
      )}

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-academic">Academic Supervisor</span>
          <h2>Welcome, {user.name}</h2>
        </div>

        <div className="dash-edit-bar">
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            ✏️ Edit Dashboard
          </button>
        </div>

        {widgets.map(w => renderWidget(w))}
      </main>
    </div>
  );
}
