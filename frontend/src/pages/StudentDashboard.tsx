import StatCard from '../components/StatCard'
import { mockWeeklyLogs, mockStudentProfile, mockNotifications } from '../data/mockData'
import './Dashboard.css'

export default function StudentDashboard() {
  const approved = mockWeeklyLogs.filter(l => l.status === 'approved').length
  const pending  = mockWeeklyLogs.filter(l => l.status === 'pending').length

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>Welcome back, {mockStudentProfile.name} 👋</h2>
          <p className="dash-subtitle">{mockStudentProfile.program} · {mockStudentProfile.company}</p>
        </div>
        <div className="dash-tag" style={{ background: 'var(--student-primary)' }}>
          Week 5 of 24
        </div>
      </div>

      <div className="stat-grid">
        <StatCard title="Current Score"    value={`${mockStudentProfile.currentScore}%`} subtitle="B Grade"          icon="📊" color="var(--pastel-sky)" />
        <StatCard title="Logs Submitted"   value={mockWeeklyLogs.length}                 subtitle="This semester"    icon="📋" color="var(--pastel-mint)" />
        <StatCard title="Logs Approved"    value={approved}                              subtitle={`${pending} pending`} icon="✅" color="var(--pastel-lavender)" />
        <StatCard title="Weeks Remaining"  value={19}                                    subtitle="of 24 total"      icon="📅" color="var(--pastel-peach)" />
      </div>

      <div className="dash-grid">
        {/* Placement Info */}
        <div className="card">
          <h3 className="card-title">📌 Placement Details</h3>
          <div className="info-list">
            <div className="info-row"><span>Company</span><strong>{mockStudentProfile.company}</strong></div>
            <div className="info-row"><span>Location</span><strong>{mockStudentProfile.companyAddress}</strong></div>
            <div className="info-row"><span>Academic Supervisor</span><strong>{mockStudentProfile.academicSupervisor}</strong></div>
            <div className="info-row"><span>Industry Supervisor</span><strong>{mockStudentProfile.internshipSupervisor}</strong></div>
            <div className="info-row"><span>Start Date</span><strong>{mockStudentProfile.startDate}</strong></div>
            <div className="info-row"><span>End Date</span><strong>{mockStudentProfile.endDate}</strong></div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="card-title">🔔 Notifications</h3>
          <div className="notif-list">
            {mockNotifications.map(n => (
              <div key={n.id} className={`notif-item notif-${n.type}`}>
                <span className="notif-msg">{n.message}</span>
                <span className="notif-time">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Logs Table */}
      <div className="card">
        <div className="card-header-row">
          <h3 className="card-title">📋 Weekly Log Submissions</h3>
          <button className="action-btn" style={{ background: 'var(--student-primary)' }}>+ Submit Log</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Date</th>
                <th>Activities</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockWeeklyLogs.map(log => (
                <tr key={log.id}>
                  <td>Week {log.week}</td>
                  <td>{log.date}</td>
                  <td style={{ maxWidth: 300 }}>{log.activities}</td>
                  <td>
                    <span className={`badge ${log.status === 'approved' ? 'badge-green' : log.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                      {log.status}
                    </span>
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
