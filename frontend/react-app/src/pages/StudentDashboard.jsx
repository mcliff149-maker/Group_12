import { useState } from 'react';
import NavBar from '../components/NavBar';
import DashboardEditor from '../components/DashboardEditor';
import { loadConfig, saveConfig } from '../utils/dashboardConfig';

/* ------------------------------------------------------------------
   Initial mock data
------------------------------------------------------------------ */
const INITIAL_TASKS = [
  { id: 1, title: 'Submit internship application form', done: false },
  { id: 2, title: 'Attend orientation session',         done: true  },
  { id: 3, title: 'Upload week-1 log report',           done: false },
  { id: 4, title: 'Get supervisor signature on form B', done: false },
];

const INITIAL_APPS = [
  { id: 1, company: 'Acme Corp',     role: 'Backend Dev',  status: 'Pending'  },
  { id: 2, company: 'TechStart Ltd', role: 'Data Analyst', status: 'Approved' },
  { id: 3, company: 'Innovate GmbH', role: 'UX Designer',  status: 'Rejected' },
];

const ANNOUNCEMENTS = [
  { id: 1, text: 'Internship placement deadline: 30 Apr 2025' },
  { id: 2, text: 'Log submission portal will be down 12–13 Apr for maintenance' },
  { id: 3, text: 'Orientation webinar recording is now available on the portal' },
  { id: 4, text: 'Week-5 log approval is now open' },
  { id: 5, text: 'New company partners added — check the placement board' },
];

let taskCounter = INITIAL_TASKS.length + 1;

const STATUS_CLASS = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' };

export default function StudentDashboard({ user }) {
  const username = user.username ?? user.name;

  // widget config
  const [config, setConfig] = useState(() => loadConfig(username, 'student'));
  const [editing, setEditing] = useState(false);

  function handleSave(updated) {
    const next = { ...config, widgets: updated };
    setConfig(next);
    saveConfig(username, next);
    setEditing(false);
  }

  // local data
  const [tasks, setTasks]     = useState(INITIAL_TASKS);
  const [apps]                = useState(INITIAL_APPS);
  const [newTask, setNewTask] = useState('');

  function toggleTask(id) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    const title = newTask.trim();
    if (!title) return;
    setTasks(ts => [...ts, { id: taskCounter++, title, done: false }]);
    setNewTask('');
  }

  const doneTasks = tasks.filter(t => t.done).length;
  const pct       = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const approved  = apps.filter(a => a.status === 'Approved').length;

  const widgets = [...config.widgets].sort((a, b) => a.order - b.order);

  function renderWidget(w) {
    if (!w.visible) return null;
    const s = w.settings ?? {};

    if (w.id === 'tasks') {
      const shown = s.showDone === false ? tasks.filter(t => !t.done) : tasks;
      return (
        <div className="card" key={w.id}>
          <h3>📋 My Tasks</h3>
          {shown.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>No tasks yet.</p>}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
            {shown.map(task => (
              <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                <span className={task.done ? 'task-done' : ''}>{task.title}</span>
                {task.done && <span className="status status-complete">Done</span>}
              </li>
            ))}
          </ul>
          <div className="add-row" style={{ marginTop: '1rem' }}>
            <input type="text" placeholder="Add a new task…" value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()} />
            <button className="btn btn-primary btn-sm" onClick={addTask}>+ Add</button>
          </div>
        </div>
      );
    }

    if (w.id === 'applications') {
      return (
        <div className="card" key={w.id}>
          <h3>📁 Internship Applications</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Company</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {apps.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td><td>{a.company}</td><td>{a.role}</td>
                    <td><span className={`status ${STATUS_CLASS[a.status]}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (w.id === 'progress') {
      return (
        <div className="card" key={w.id}>
          <h3>📊 Progress Tracker</h3>
          <div className="stats-row">
            {[
              { label: 'Tasks Done',      value: `${doneTasks}/${tasks.length}` },
              { label: 'Task Completion', value: `${pct}%` },
              { label: 'Apps Approved',   value: approved },
            ].map(st => (
              <div key={st.label} className="stat-card">
                <div className="stat-value">{st.value}</div>
                <div className="stat-label">{st.label}</div>
              </div>
            ))}
          </div>
          <label style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Task completion
          </label>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p style={{ fontSize: '.76rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>{pct}% of tasks completed</p>
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
      <NavBar userName={user.name} role="student" />

      {editing && (
        <DashboardEditor
          widgets={config.widgets}
          onSave={handleSave}
          onClose={() => setEditing(false)}
          role="student"
        />
      )}

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-student">Student</span>
          <h2>{user.name}'s Dashboard</h2>
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
