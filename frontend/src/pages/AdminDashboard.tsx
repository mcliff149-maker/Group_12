import StatCard from '../components/StatCard'
import { mockStudents, mockPlacements } from '../data/mockData'
import './Dashboard.css'

export default function AdminDashboard() {
  const active    = mockPlacements.filter(p => p.status === 'active').length
  const completed = mockPlacements.filter(p => p.status === 'completed').length
  const suspended = mockPlacements.filter(p => p.status === 'suspended').length

  const systemActivity = [
    { action: 'Score computed for CS/003/2021',    user: 'Admin',        time: '10 min ago',  type: 'success' },
    { action: 'New placement created (Alice M.)',  user: 'Admin',        time: '1 hour ago',  type: 'info'    },
    { action: 'Suspension: Eva Chebet',            user: 'Admin',        time: '2 hours ago', type: 'warning' },
    { action: 'Academic evaluation submitted',     user: 'Dr. Kamau',    time: '3 hours ago', type: 'info'    },
    { action: 'Log approved (Brian Otieno W3)',    user: 'P. Odhiambo',  time: '5 hours ago', type: 'success' },
  ]

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>System Administrator Dashboard ⚙️</h2>
          <p className="dash-subtitle">Full system access · All operations</p>
        </div>
        <div className="dash-tag" style={{ background: 'var(--admin-primary)' }}>
          Semester 2, 2024
        </div>
      </div>

      <div className="stat-grid">
        <StatCard title="Total Placements" value={mockPlacements.length} subtitle="All time"          icon="🏫" color="var(--pastel-peach)"    />
        <StatCard title="Active"           value={active}                subtitle="Currently running" icon="🟢" color="var(--pastel-mint)"     />
        <StatCard title="Completed"        value={completed}             subtitle="Finished"          icon="✅" color="var(--pastel-sky)"      />
        <StatCard title="Suspended"        value={suspended}             subtitle="On hold"           icon="⚠️"  color="var(--pastel-rose)"     />
      </div>

      <div className="dash-grid">
        {/* Score Computation */}
        <div className="card">
          <h3 className="card-title">🧮 Score Computation</h3>
          <p className="card-desc">Compute final weighted scores (50% supervisor + 30% academic + 20% log rate)</p>
          <div className="score-list">
            {mockStudents.filter(s => s.status === 'completed' || s.status === 'active').map(s => (
              <div key={s.id} className="score-row">
                <div>
                  <strong>{s.name}</strong>
                  <span className="sub-text">{s.regNumber}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {s.score !== undefined && (
                    <span className={`badge ${s.score >= 80 ? 'badge-green' : s.score >= 60 ? 'badge-blue' : 'badge-red'}`}>
                      {s.score}%
                    </span>
                  )}
                  <button className="tbl-btn">Compute</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="card">
          <h3 className="card-title">📜 Recent Activity</h3>
          <div className="activity-list">
            {systemActivity.map((a, i) => (
              <div key={i} className={`activity-item activity-${a.type}`}>
                <span className="activity-msg">{a.action}</span>
                <div className="activity-meta">
                  <span>{a.user}</span>
                  <span>·</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Students Table */}
      <div className="card">
        <div className="card-header-row">
          <h3 className="card-title">👤 All Students</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="action-btn" style={{ background: 'var(--admin-primary)' }}>+ Add Student</button>
            <button className="action-btn" style={{ background: 'var(--pastel-sky)' }}>Export CSV</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg No.</th>
                <th>Programme</th>
                <th>Company</th>
                <th>Supervisor</th>
                <th>Status</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.regNumber}</td>
                  <td>{s.program}</td>
                  <td>{s.company}</td>
                  <td>{s.supervisor}</td>
                  <td>
                    <span className={`badge ${s.status === 'active' ? 'badge-green' : s.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>{s.score !== undefined ? `${s.score}%` : '–'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="tbl-btn">Edit</button>
                      <button className="tbl-btn">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
