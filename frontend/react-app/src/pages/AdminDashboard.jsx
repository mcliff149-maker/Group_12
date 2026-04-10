import { useState } from 'react';
import NavBar from '../components/NavBar';
import DashboardEditor from '../components/DashboardEditor';
import { loadConfig, saveConfig, adminLoadConfig, adminResetConfig, listStoredUsers, DEFAULT_CONFIGS } from '../utils/dashboardConfig';

/* ------------------------------------------------------------------
   Admin users (only these two may customise their own dashboard)
------------------------------------------------------------------ */
const ADMIN_USERNAMES = ['admin1', 'admin2'];

/* ------------------------------------------------------------------
   Initial mock user data
------------------------------------------------------------------ */
const INITIAL_USERS = [
  { id: 1, name: 'Alice Johnson',     username: 'student1',    email: 'alice@uni.ac',    role: 'student',    active: true  },
  { id: 2, name: 'Bob Martinez',      username: 'student2',    email: 'bob@uni.ac',      role: 'student',    active: true  },
  { id: 3, name: 'Dr. Bernard Smith', username: 'academic1',   email: 'bsmith@uni.ac',   role: 'academic',   active: true  },
  { id: 4, name: 'Carol White',       username: 'supervisor1', email: 'cwhite@corp.com', role: 'supervisor', active: true  },
  { id: 5, name: 'Eve Torres',        username: 'supervisor2', email: 'etorres@corp.com',role: 'supervisor', active: false },
  { id: 6, name: 'Frank Mensah',      username: 'student3',    email: 'fmensah@uni.ac',  role: 'student',    active: true  },
];

const ROLE_LABELS = {
  student:    '🎓 Student',
  academic:   '📚 Academic Sup.',
  supervisor: '🏢 Internship Sup.',
  admin:      '⚙️ Admin',
};

let userCounter = INITIAL_USERS.length + 1;

const TABS = ['users', 'dashboards'];

export default function AdminDashboard({ user }) {
  const username = user.username ?? user.name;
  const isAdminUser = ADMIN_USERNAMES.includes(username);

  // ── admin self-customisation (only for the two admin accounts) ─
  const [config, setConfig]   = useState(() => isAdminUser ? loadConfig(username, 'admin') : null);
  const [editing, setEditing] = useState(false);

  function handleSaveSelf(updated) {
    const next = { ...config, widgets: updated };
    setConfig(next);
    saveConfig(username, next);
    setEditing(false);
  }

  // ── tab state ──────────────────────────────────────────────────
  const [tab, setTab]         = useState('users');

  // ── user management ────────────────────────────────────────────
  const [users, setUsers]     = useState(INITIAL_USERS);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });
  const [formErr, setFormErr] = useState({});
  const [filter, setFilter]   = useState('all');

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
    const generatedUsername = newUser.name.toLowerCase().replace(/\s+/g, '') + userCounter;
    setUsers(us => [...us, { id: userCounter++, username: generatedUsername, ...newUser, active: true }]);
    setNewUser({ name: '', email: '', role: 'student' });
    setFormErr({});
  }

  const displayed = filter === 'all' ? users : users.filter(u => u.role === filter);

  // ── dashboard management ───────────────────────────────────────
  const [selectedUser, setSelectedUser]   = useState(null);
  const [viewedConfig, setViewedConfig]   = useState(null);
  const [resetMsg, setResetMsg]           = useState('');

  function viewUserDash(u) {
    setSelectedUser(u);
    setViewedConfig(adminLoadConfig(u.username, u.role));
    setResetMsg('');
  }

  function resetUserDash(u) {
    const fresh = adminResetConfig(u.username, u.role);
    setViewedConfig(fresh);
    setResetMsg(`Dashboard for ${u.name} has been reset to default.`);
  }

  // ── render ─────────────────────────────────────────────────────
  return (
    <div className="dashboard-page">
      <NavBar userName={user.name} role="admin" />

      {/* Admin self-customisation — only for the two admin users */}
      {isAdminUser && editing && config && (
        <DashboardEditor
          widgets={config.widgets}
          onSave={handleSaveSelf}
          onClose={() => setEditing(false)}
          role="admin"
        />
      )}

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <span className="badge badge-admin">System Administrator</span>
            <h2>Admin Dashboard</h2>
          </div>
          {isAdminUser && (
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
              ✏️ Edit My Dashboard
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="stats-row">
          {[
            { label: 'Total Users',  value: users.length },
            { label: 'Active',       value: users.filter(u => u.active).length },
            { label: 'Disabled',     value: users.filter(u => !u.active).length },
            { label: 'Students',     value: users.filter(u => u.role === 'student').length },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('users')}>
            👥 User Management
          </button>
          <button className={`btn btn-sm ${tab === 'dashboards' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('dashboards')}>
            🖥️ Dashboard Management
          </button>
        </div>

        {/* ── Tab: User Management ── */}
        {tab === 'users' && (
          <>
            {/* Add user form */}
            <div className="card">
              <h3>➕ Add New User</h3>
              <div className="add-row" style={{ flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
                  <input name="name" placeholder="Full name" value={newUser.name} onChange={handleNewChange}
                    style={formErr.name ? { border: '1.5px solid #e07070' } : {}} />
                  {formErr.name && <span style={{ fontSize: '.72rem', color: 'var(--error-text)' }}>{formErr.name}</span>}
                </div>
                <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
                  <input name="email" placeholder="Email address" value={newUser.email} onChange={handleNewChange}
                    style={formErr.email ? { border: '1.5px solid #e07070' } : {}} />
                  {formErr.email && <span style={{ fontSize: '.72rem', color: 'var(--error-text)' }}>{formErr.email}</span>}
                </div>
                <select name="role" value={newUser.role} onChange={handleNewChange} style={{ flex: '0 0 160px' }}>
                  <option value="student">🎓 Student</option>
                  <option value="academic">📚 Academic Sup.</option>
                  <option value="supervisor">🏢 Internship Sup.</option>
                </select>
                <button className="btn btn-primary btn-sm" onClick={addUser}>+ Add User</button>
              </div>
            </div>

            {/* User table */}
            <div className="card">
              <h3>👥 All Users</h3>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {['all', 'student', 'academic', 'supervisor'].map(f => (
                  <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'All' : ROLE_LABELS[f]}
                  </button>
                ))}
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {displayed.map((u, i) => (
                      <tr key={u.id}>
                        <td>{i + 1}</td>
                        <td><strong>{u.name}</strong></td>
                        <td style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{u.email}</td>
                        <td>{ROLE_LABELS[u.role] ?? u.role}</td>
                        <td><span className={`status ${u.active ? 'status-active' : 'status-disabled'}`}>{u.active ? 'Active' : 'Disabled'}</span></td>
                        <td>
                          <button className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleActive(u.id)}>
                            {u.active ? '🔒 Disable' : '�� Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {displayed.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No users match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Tab: Dashboard Management ── */}
        {tab === 'dashboards' && (
          <div className="card">
            <h3>🖥️ Dashboard Management</h3>
            <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              View or reset any non-admin user's dashboard configuration.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Role</th><th>Has Custom Config</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const hasConfig = !!localStorage.getItem(`iles_dash_config_${u.username}`);
                    return (
                      <tr key={u.id} style={selectedUser?.id === u.id ? { background: 'var(--accent-light)' } : {}}>
                        <td>{i + 1}</td>
                        <td><strong>{u.name}</strong></td>
                        <td>{ROLE_LABELS[u.role] ?? u.role}</td>
                        <td>
                          <span className={`status ${hasConfig ? 'status-approved' : 'status-pending'}`}>
                            {hasConfig ? 'Custom' : 'Default'}
                          </span>
                        </td>
                        <td style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewUserDash(u)}>
                            👁 View Config
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => resetUserDash(u)}>
                            ↺ Reset
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {resetMsg && (
              <div className="alert alert-success" style={{ marginTop: '1rem' }}>{resetMsg}</div>
            )}

            {/* Config preview */}
            {selectedUser && viewedConfig && (
              <div className="admin-dash-preview">
                <strong>{selectedUser.name}'s dashboard layout:</strong>
                <ul>
                  {[...viewedConfig.widgets]
                    .sort((a, b) => a.order - b.order)
                    .map(w => (
                      <li key={w.id}>
                        <span className={w.visible ? 'dash-vis-on' : 'dash-vis-off'}>
                          {w.visible ? '✓' : '✗'}
                        </span>
                        <span style={{ fontWeight: w.visible ? 600 : 400 }}>{w.label}</span>
                        {Object.keys(w.settings ?? {}).length > 0 && (
                          <span style={{ fontSize: '.74rem', color: 'var(--text-muted)', marginLeft: '.5rem' }}>
                            ({Object.entries(w.settings).map(([k, v]) => `${k}: ${v}`).join(', ')})
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
