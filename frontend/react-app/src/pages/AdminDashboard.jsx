import { useState } from 'react';
import NavBar from '../components/NavBar';

/* ------------------------------------------------------------------
   Initial mock data
------------------------------------------------------------------ */
const INITIAL_USERS = [
  { id: 1, name: 'Alice Johnson',    email: 'alice@uni.ac',    role: 'student',    active: true  },
  { id: 2, name: 'Bob Martinez',     email: 'bob@uni.ac',      role: 'student',    active: true  },
  { id: 3, name: 'Dr. Bernard Smith',email: 'bsmith@uni.ac',   role: 'academic',   active: true  },
  { id: 4, name: 'Carol White',      email: 'cwhite@corp.com', role: 'supervisor', active: true  },
  { id: 5, name: 'Eve Torres',       email: 'etorres@corp.com',role: 'supervisor', active: false },
  { id: 6, name: 'Frank Mensah',     email: 'fmensah@uni.ac',  role: 'student',    active: true  },
];

const ROLE_LABELS = {
  student:    '🎓 Student',
  academic:   '📚 Academic Sup.',
  supervisor: '🏢 Internship Sup.',
  admin:      '⚙️ Admin',
};

let userCounter = INITIAL_USERS.length + 1;

export default function AdminDashboard({ user }) {
  const [users, setUsers]       = useState(INITIAL_USERS);
  const [newUser, setNewUser]   = useState({ name: '', email: '', role: 'student' });
  const [formErr, setFormErr]   = useState({});
  const [filter, setFilter]     = useState('all');

  function toggleActive(id) {
    setUsers(us => us.map(u => u.id === id ? { ...u, active: !u.active } : u));
  }

  function handleNewChange(e) {
    const { name, value } = e.target;
    setNewUser(n => ({ ...n, [name]: value }));
    setFormErr(err => ({ ...err, [name]: '' }));
  }

  function addUser() {
    const e = {};
    if (!newUser.name.trim())  e.name  = 'Name required.';
    if (!newUser.email.trim()) e.email = 'Email required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) e.email = 'Invalid email.';
    if (Object.keys(e).length) { setFormErr(e); return; }

    setUsers(us => [...us, { id: userCounter++, ...newUser, active: true }]);
    setNewUser({ name: '', email: '', role: 'student' });
    setFormErr({});
  }

  const displayed = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div className="dashboard-page">
      <NavBar userName={user.name} role="admin" />

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-admin">System Administrator</span>
          <h2>User Management</h2>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Users',  value: users.length },
            { label: 'Active',       value: users.filter(u => u.active).length },
            { label: 'Disabled',     value: users.filter(u => !u.active).length },
            { label: 'Students',     value: users.filter(u => u.role === 'student').length },
          ].map(s => (
            <div key={s.label} style={{
              flex: '1 1 140px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '.9rem 1.1rem',
              boxShadow: 'var(--shadow)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>{s.value}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add user form */}
        <div className="card">
          <h3>➕ Add New User</h3>
          <div className="add-row" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
              <input
                name="name" placeholder="Full name"
                value={newUser.name} onChange={handleNewChange}
                style={formErr.name ? { border: '1.5px solid #e07070' } : {}}
              />
              {formErr.name && <span style={{ fontSize: '.72rem', color: 'var(--error-text)' }}>{formErr.name}</span>}
            </div>
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
              <input
                name="email" placeholder="Email address"
                value={newUser.email} onChange={handleNewChange}
                style={formErr.email ? { border: '1.5px solid #e07070' } : {}}
              />
              {formErr.email && <span style={{ fontSize: '.72rem', color: 'var(--error-text)' }}>{formErr.email}</span>}
            </div>
            <select name="role" value={newUser.role} onChange={handleNewChange} style={{ flex: '0 0 160px' }}>
              <option value="student">🎓 Student</option>
              <option value="academic">📚 Academic Sup.</option>
              <option value="supervisor">🏢 Internship Sup.</option>
              <option value="admin">⚙️ Admin</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={addUser}>+ Add User</button>
          </div>
        </div>

        {/* User table */}
        <div className="card">
          <h3>👥 All Users</h3>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {['all', 'student', 'academic', 'supervisor', 'admin'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : ROLE_LABELS[f]}
              </button>
            ))}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td><strong>{u.name}</strong></td>
                    <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>{ROLE_LABELS[u.role] ?? u.role}</td>
                    <td>
                      <span className={`status ${u.active ? 'status-active' : 'status-disabled'}`}>
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleActive(u.id)}
                      >
                        {u.active ? '🔒 Disable' : '🔓 Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      No users match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
