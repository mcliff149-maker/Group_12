import { useState } from 'react';
import NavBar from '../components/NavBar';

/* ------------------------------------------------------------------
   Initial mock data
------------------------------------------------------------------ */
const INITIAL_STUDENTS = [
  { id: 1, name: 'Alice Johnson',  company: 'Acme Corp',     log: 'Week 1 submitted',         status: 'Pending'  },
  { id: 2, name: 'Bob Martinez',   company: 'TechStart Ltd', log: 'Week 1 & 2 submitted',     status: 'Pending'  },
  { id: 3, name: 'Chloe Lee',      company: 'Innovate GmbH', log: 'Week 1 submitted',         status: 'Approved' },
  { id: 4, name: 'David Okonkwo',  company: 'DataFlow Inc',  log: 'No log submitted yet',     status: 'Pending'  },
];

export default function AcademicDashboard({ user }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  function setStatus(id, status) {
    setStudents(ss => ss.map(s => s.id === id ? { ...s, status } : s));
  }

  const statusClass = {
    Pending:  'status-pending',
    Approved: 'status-approved',
    Rejected: 'status-rejected',
  };

  return (
    <div className="dashboard-page">
      <NavBar userName={user.name} role="academic" />

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-academic">Academic Supervisor</span>
          <h2>Welcome, {user.name}</h2>
        </div>

        <div className="card">
          <h3>👩‍🎓 Student Overview</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Log Status</th>
                  <th>Evaluation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.company}</td>
                    <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{s.log}</td>
                    <td><span className={`status ${statusClass[s.status]}`}>{s.status}</span></td>
                    <td style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={s.status === 'Approved'}
                        onClick={() => setStatus(s.id, 'Approved')}
                      >
                        ✔ Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={s.status === 'Rejected'}
                        onClick={() => setStatus(s.id, 'Rejected')}
                      >
                        ✖ Reject
                      </button>
                      {s.status !== 'Pending' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setStatus(s.id, 'Pending')}
                        >
                          ↩ Reset
                        </button>
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
            Pending: {students.filter(s => s.status === 'Pending').length}
          </p>
        </div>
      </main>
    </div>
  );
}
