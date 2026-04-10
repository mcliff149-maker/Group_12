import { useState } from 'react';
import NavBar from '../components/NavBar';
import DashboardEditor from '../components/DashboardEditor';
import { loadConfig, saveConfig } from '../utils/dashboardConfig';

/* ------------------------------------------------------------------
   Initial mock data
------------------------------------------------------------------ */
const INITIAL_INTERNS = [
  { id: 1, name: 'Alice Johnson', role: 'Backend Dev',   week: 4, feedback: '' },
  { id: 2, name: 'Bob Martinez',  role: 'Data Analyst',  week: 3, feedback: '' },
  { id: 3, name: 'Eve Torres',    role: 'DevOps Intern',  week: 5, feedback: 'Good progress on CI pipeline.' },
  { id: 4, name: 'Frank Mensah',  role: 'Frontend Dev',  week: 2, feedback: '' },
];

const SCHEDULE = [
  { id: 1, date: '14 Apr', desc: 'Check-in with Alice — Week 4 review' },
  { id: 2, date: '15 Apr', desc: 'Site visit to TechStart Ltd' },
  { id: 3, date: '17 Apr', desc: 'Submit mid-term evaluations' },
  { id: 4, date: '22 Apr', desc: 'Check-in with Frank — Week 3 review' },
];

const ANNOUNCEMENTS = [
  { id: 1, text: 'Mid-term evaluation form is now available' },
  { id: 2, text: 'Reminder: verify intern attendance logs weekly' },
  { id: 3, text: 'New safety briefing required for on-site interns' },
];

export default function SupervisorDashboard({ user }) {
  const username = user.username ?? user.name;

  // widget config
  const [config, setConfig] = useState(() => loadConfig(username, 'supervisor'));
  const [editing, setEditing] = useState(false);

  function handleSave(updated) {
    const next = { ...config, widgets: updated };
    setConfig(next);
    saveConfig(username, next);
    setEditing(false);
  }

  // local data
  const [interns, setInterns] = useState(INITIAL_INTERNS);
  const [drafts, setDrafts]   = useState({});

  function updateDraft(id, text) {
    setDrafts(d => ({ ...d, [id]: text }));
  }

  function saveFeedback(id) {
    const text = (drafts[id] ?? '').trim();
    if (!text) return;
    setInterns(ins => ins.map(i => i.id === id ? { ...i, feedback: text } : i));
    setDrafts(d => ({ ...d, [id]: '' }));
  }

  const withFeedback = interns.filter(i => i.feedback).length;
  const avgWeek      = interns.length
    ? (interns.reduce((s, i) => s + i.week, 0) / interns.length).toFixed(1)
    : 0;

  const widgets = [...config.widgets].sort((a, b) => a.order - b.order);

  function renderWidget(w) {
    if (!w.visible) return null;
    const s = w.settings ?? {};

    if (w.id === 'interns') {
      return (
        <div className="card" key={w.id}>
          <h3>👷 Intern Roster</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {interns.length} interns — add feedback below each row.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {interns.map(intern => (
              <div key={intern.id} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '.9rem 1.1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.4rem' }}>
                  <div>
                    <strong>{intern.name}</strong>
                    <span style={{ marginLeft: '.6rem', fontSize: '.82rem', color: 'var(--text-muted)' }}>
                      {intern.role} · Week {intern.week}
                    </span>
                  </div>
                  {intern.feedback && <span className="status status-approved">Feedback saved</span>}
                </div>
                {intern.feedback && (
                  <p style={{
                    marginTop: '.5rem', fontSize: '.84rem',
                    background: 'var(--success-bg)', color: 'var(--success-text)',
                    padding: '.4rem .6rem', borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid #5cba7a',
                  }}>{intern.feedback}</p>
                )}
                <div style={{ marginTop: '.65rem', display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    className="feedback-box"
                    placeholder={intern.feedback ? 'Update feedback…' : 'Add feedback for this intern…'}
                    value={drafts[intern.id] ?? ''}
                    onChange={e => updateDraft(intern.id, e.target.value)}
                  />
                  <button className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap', marginTop: '.1rem' }} onClick={() => saveFeedback(intern.id)}>
                    💾 Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (w.id === 'stats') {
      return (
        <div className="card" key={w.id}>
          <h3>📈 Feedback Stats</h3>
          <div className="stats-row">
            {[
              { label: 'Total Interns',    value: interns.length },
              { label: 'Feedback Given',   value: withFeedback },
              { label: 'Avg. Week',        value: avgWeek },
              { label: 'Pending Feedback', value: interns.length - withFeedback },
            ].map(st => (
              <div key={st.label} className="stat-card">
                <div className="stat-value">{st.value}</div>
                <div className="stat-label">{st.label}</div>
              </div>
            ))}
          </div>
          <label style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Feedback coverage</label>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: interns.length ? `${Math.round(withFeedback / interns.length * 100)}%` : '0%' }} />
          </div>
          <p style={{ fontSize: '.76rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>
            {interns.length ? Math.round(withFeedback / interns.length * 100) : 0}% of interns have feedback
          </p>
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
                background: 'var(--supervisor-bg)',
                color: 'var(--supervisor-text)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '.86rem',
                display: 'flex', gap: '.7rem',
              }}>
                <strong style={{ minWidth: '4rem' }}>{ev.date}</strong>
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
                background: 'var(--supervisor-bg)',
                color: 'var(--supervisor-text)',
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
      <NavBar userName={user.name} role="supervisor" />

      {editing && (
        <DashboardEditor
          widgets={config.widgets}
          onSave={handleSave}
          onClose={() => setEditing(false)}
          role="supervisor"
        />
      )}

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-supervisor">Internship Supervisor</span>
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
