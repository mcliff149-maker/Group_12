import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import FormField from '../../components/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAllUsers, createUser, toggleDisableUser } from '../../api/admin.js';

const ROLE_OPTIONS = [
  { value: 'student',    label: 'Student' },
  { value: 'academic',   label: 'Academic Supervisor' },
  { value: 'supervisor', label: 'Internship Supervisor' },
  { value: 'admin',      label: 'Admin' },
];

const NEW_USER_INIT = { name: '', email: '', username: '', password: '', role: '' };

export default function AdminDashboard() {
  const { user }   = useAuth();
  const [tab, setTab]           = useState('users');
  const [users, setUsers]       = useState([]);
  const [newUser, setNewUser]   = useState(NEW_USER_INIT);
  const [nuErrors, setNuErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving]     = useState(false);
  const [actionResult, setActionResult] = useState('');

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  async function handleToggle(username) {
    try {
      await toggleDisableUser(username);
      const updated = await getAllUsers();
      setUsers(updated);
    } catch (err) {
      setFeedback(err.message);
    }
  }

  function handleNewUserChange(e) {
    setNewUser(n => ({ ...n, [e.target.name]: e.target.value }));
    setNuErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validateNewUser() {
    const errs = {};
    if (!newUser.name.trim())     errs.name     = 'Required.';
    if (!newUser.email.trim())    errs.email    = 'Required.';
    if (!newUser.username.trim()) errs.username = 'Required.';
    if (!newUser.password)        errs.password = 'Required.';
    if (!newUser.role)            errs.role     = 'Required.';
    return errs;
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    const errs = validateNewUser();
    if (Object.keys(errs).length) { setNuErrors(errs); return; }
    setSaving(true);
    setFeedback('');
    try {
      await createUser(newUser);
      const updated = await getAllUsers();
      setUsers(updated);
      setNewUser(NEW_USER_INIT);
      setFeedback('✅ User created successfully!');
      setTab('users');
    } catch (err) {
      setFeedback(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function mockAction(action) {
    const results = {
      export:  '✅ Data exported to iles_export.json (mock)',
      reset:   '⚠️ All logs reset successfully (mock)',
      health:  '✅ System health: OK | DB: Healthy | API: Online | Uptime: 99.9%',
    };
    setActionResult(results[action] || 'Done.');
  }

  const roleBadge = r =>
    r === 'admin' ? 'badge-admin' :
    r === 'academic' ? 'badge-academic' :
    r === 'supervisor' ? 'badge-supervisor' : 'badge-student';

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>🛠️ Admin Dashboard</h1>
            <p>Manage users and system settings.</p>
          </div>

          {feedback && (
            <div className={`alert ${feedback.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
              {feedback}
            </div>
          )}

          <div className="tabs">
            {['users', 'create', 'actions'].map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setFeedback(''); }}>
                {t === 'users' ? '👥 Users' : t === 'create' ? '➕ Create User' : '⚙️ Admin Actions'}
              </button>
            ))}
          </div>

          {tab === 'users' && (
            <div className="card">
              <p className="section-title">All Accounts ({users.length})</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.username}>
                      <td><code>{u.username}</code></td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
                      <td>
                        <span className={`badge ${u.disabled ? 'badge-danger' : 'badge-success'}`}>
                          {u.disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td>
                        {u.username !== user.username && (
                          <button
                            className={`btn btn-sm ${u.disabled ? 'btn-secondary' : 'btn-danger'}`}
                            onClick={() => handleToggle(u.username)}
                          >
                            {u.disabled ? 'Enable' : 'Disable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'create' && (
            <div className="card">
              <p className="section-title">Create New User</p>
              <form onSubmit={handleCreateUser} noValidate>
                <div className="form-row">
                  <FormField label="Full Name" name="name"  value={newUser.name}  onChange={handleNewUserChange} error={nuErrors.name}  required />
                  <FormField label="Email"     name="email" type="email" value={newUser.email} onChange={handleNewUserChange} error={nuErrors.email} required />
                </div>
                <div className="form-row">
                  <FormField label="Username" name="username" value={newUser.username} onChange={handleNewUserChange} error={nuErrors.username} required />
                  <FormField label="Password" name="password" type="password" value={newUser.password} onChange={handleNewUserChange} error={nuErrors.password} required />
                </div>
                <FormField label="Role" name="role" type="select" value={newUser.role} onChange={handleNewUserChange} error={nuErrors.role} required options={ROLE_OPTIONS} />
                <button className="btn btn-primary mt-2" type="submit" disabled={saving}>
                  {saving ? 'Creating…' : '➕ Create User'}
                </button>
              </form>
            </div>
          )}

          {tab === 'actions' && (
            <div className="card">
              <p className="section-title">Admin Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 }}>
                <button className="btn btn-secondary" onClick={() => mockAction('export')}>📤 Export Data</button>
                <button className="btn btn-warning"   onClick={() => mockAction('reset')}>🗑️ Reset Logs</button>
                <button className="btn btn-primary"   onClick={() => mockAction('health')}>💚 System Health Check</button>
              </div>
              {actionResult && (
                <div className="alert alert-info mt-3">{actionResult}</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
