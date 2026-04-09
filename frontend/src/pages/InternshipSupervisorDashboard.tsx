import StatCard from '../components/StatCard'
import { mockPlacements } from '../data/mockData'
import './Dashboard.css'

export default function InternshipSupervisorDashboard() {
  const active    = mockPlacements.filter(p => p.status === 'active').length
  const totalLogs = mockPlacements.reduce((s, p) => s + p.pendingLogs, 0)

  const recentReviews = [
    { student: 'Alice Mwangi',    score: 84, date: '2024-02-28', type: 'Mid-term' },
    { student: 'Brian Otieno',    score: 77, date: '2024-02-28', type: 'Mid-term' },
    { student: 'David Kiprotich', score: 65, date: '2024-02-15', type: 'Mid-term' },
  ]

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>Internship Supervisor Dashboard 🏢</h2>
          <p className="dash-subtitle">Mr. Peter Odhiambo · TechCorp Ltd</p>
        </div>
        <div className="dash-tag" style={{ background: 'var(--internship-primary)' }}>
          {active} active interns
        </div>
      </div>

      <div className="stat-grid">
        <StatCard title="Active Interns"   value={active}      subtitle="Current batch"      icon="👷" color="var(--pastel-mint)"     />
        <StatCard title="Pending Logs"     value={totalLogs}   subtitle="Awaiting approval"  icon="📋" color="var(--pastel-peach)"    />
        <StatCard title="Reviews Done"     value={3}           subtitle="This semester"      icon="📝" color="var(--pastel-sky)"      />
        <StatCard title="Avg Rating"       value="75%"         subtitle="All interns"        icon="⭐" color="var(--pastel-lavender)" />
      </div>

      <div className="dash-grid">
        {/* Pending Log Approvals */}
        <div className="card">
          <h3 className="card-title">⏳ Pending Log Approvals</h3>
          <div className="todo-list">
            {mockPlacements.filter(p => p.pendingLogs > 0).map(p => (
              <div key={p.id} className="todo-item">
                <div className="todo-left">
                  <strong>{p.student}</strong>
                  <span>{p.company}</span>
                </div>
                <div className="todo-right">
                  <span className="badge badge-yellow">{p.pendingLogs} log{p.pendingLogs > 1 ? 's' : ''}</span>
                  <button className="tbl-btn">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Performance Reviews */}
        <div className="card">
          <h3 className="card-title">📊 Recent Performance Reviews</h3>
          <div className="todo-list">
            {recentReviews.map((r, i) => (
              <div key={i} className="todo-item">
                <div className="todo-left">
                  <strong>{r.student}</strong>
                  <span>{r.type} · {r.date}</span>
                </div>
                <div className="todo-right">
                  <span className={`badge ${r.score >= 80 ? 'badge-green' : r.score >= 60 ? 'badge-blue' : 'badge-red'}`}>
                    {r.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intern Placements Table */}
      <div className="card">
        <div className="card-header-row">
          <h3 className="card-title">👷 Intern Placements</h3>
          <button className="action-btn" style={{ background: 'var(--internship-primary)' }}>+ Add Review</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Pending Logs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPlacements.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.student}</strong></td>
                  <td>{p.company}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate}</td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-green' : p.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.pendingLogs > 0
                      ? <span className="badge badge-yellow">{p.pendingLogs}</span>
                      : <span className="badge badge-green">0</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="tbl-btn">Logs</button>
                      <button className="tbl-btn">Review</button>
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
