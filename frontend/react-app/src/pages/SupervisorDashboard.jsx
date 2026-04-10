import { useState } from 'react';
import NavBar from '../components/NavBar';

/* ------------------------------------------------------------------
   Initial mock data
------------------------------------------------------------------ */
const INITIAL_INTERNS = [
  { id: 1, name: 'Alice Johnson',  role: 'Backend Dev',  week: 4, feedback: '' },
  { id: 2, name: 'Bob Martinez',   role: 'Data Analyst', week: 3, feedback: '' },
  { id: 3, name: 'Eve Torres',     role: 'DevOps Intern', week: 5, feedback: 'Good progress on CI pipeline.' },
  { id: 4, name: 'Frank Mensah',   role: 'Frontend Dev', week: 2, feedback: '' },
];

export default function SupervisorDashboard({ user }) {
  const [interns, setInterns] = useState(INITIAL_INTERNS);
  const [drafts, setDrafts]   = useState({});   // id → draft text

  function updateDraft(id, text) {
    setDrafts(d => ({ ...d, [id]: text }));
  }

  function saveFeedback(id) {
    const text = (drafts[id] ?? '').trim();
    if (!text) return;
    setInterns(ins => ins.map(i => i.id === id ? { ...i, feedback: text } : i));
    setDrafts(d => ({ ...d, [id]: '' }));
  }

  return (
    <div className="dashboard-page">
      <NavBar userName={user.name} role="supervisor" />

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-supervisor">Internship Supervisor</span>
          <h2>Welcome, {user.name}</h2>
        </div>

        <div className="card">
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
                  {intern.feedback && (
                    <span className="status status-approved">Feedback saved</span>
                  )}
                </div>

                {intern.feedback && (
                  <p style={{
                    marginTop: '.5rem',
                    fontSize: '.84rem',
                    background: 'var(--success-bg)',
                    color: 'var(--success-text)',
                    padding: '.4rem .6rem',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid #5cba7a',
                  }}>
                    {intern.feedback}
                  </p>
                )}

                <div style={{ marginTop: '.65rem', display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    className="feedback-box"
                    placeholder={intern.feedback ? 'Update feedback…' : 'Add feedback for this intern…'}
                    value={drafts[intern.id] ?? ''}
                    onChange={e => updateDraft(intern.id, e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap', marginTop: '.1rem' }}
                    onClick={() => saveFeedback(intern.id)}
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
