import { useState } from 'react';
import NavBar from '../components/NavBar';

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
  { id: 1, company: 'Acme Corp',       role: 'Backend Dev',     status: 'Pending'   },
  { id: 2, company: 'TechStart Ltd',   role: 'Data Analyst',    status: 'Approved'  },
  { id: 3, company: 'Innovate GmbH',   role: 'UX Designer',     status: 'Rejected'  },
];

let taskCounter = INITIAL_TASKS.length + 1;

export default function StudentDashboard({ user }) {
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

  function handleKey(e) {
    if (e.key === 'Enter') addTask();
  }

  const statusClass = { Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' };

  return (
    <div className="dashboard-page">
      <NavBar userName={user.name} role="student" />

      <main className="dashboard-body">
        <div className="proto-notice">⚠️ UI Prototype — data is stored in local component state only.</div>

        <div className="role-banner">
          <span className="badge badge-student">Student</span>
          <h2>{user.name}'s Dashboard</h2>
        </div>

        {/* Tasks card */}
        <div className="card">
          <h3>📋 My Tasks</h3>

          {tasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>No tasks yet.</p>}

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
            {tasks.map(task => (
              <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <span className={task.done ? 'task-done' : ''}>{task.title}</span>
                {task.done && <span className="status status-complete">Done</span>}
              </li>
            ))}
          </ul>

          <div className="add-row" style={{ marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Add a new task…"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="btn btn-primary btn-sm" onClick={addTask}>+ Add</button>
          </div>
        </div>

        {/* Applications card */}
        <div className="card">
          <h3>📁 Internship Applications</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{a.company}</td>
                    <td>{a.role}</td>
                    <td><span className={`status ${statusClass[a.status]}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
