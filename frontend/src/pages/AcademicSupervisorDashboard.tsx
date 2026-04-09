import StatCard from '../components/StatCard'
import { mockStudents } from '../data/mockData'
import './Dashboard.css'

export default function AcademicSupervisorDashboard() {
  const myStudents = mockStudents.filter(s => s.supervisor === 'Dr. Kamau')
  const active    = myStudents.filter(s => s.status === 'active').length
  const completed = myStudents.filter(s => s.status === 'completed').length
  const avgScore  = Math.round(myStudents.reduce((sum, s) => sum + (s.score ?? 0), 0) / myStudents.length)

  const pendingEvals = [
    { student: 'Alice Mwangi',    type: 'Mid-term Evaluation', due: '2024-03-15', priority: 'high'   },
    { student: 'Carol Wanjiku',   type: 'Final Evaluation',    due: '2024-04-01', priority: 'medium' },
    { student: 'David Kiprotich', type: 'Log Review',          due: '2024-03-20', priority: 'low'    },
  ]

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>Academic Supervisor Dashboard 📚</h2>
          <p className="dash-subtitle">Dr. James Kamau · Department of Computer Science</p>
        </div>
        <div className="dash-tag" style={{ background: 'var(--academic-primary)' }}>
          Semester 2, 2024
        </div>
      </div>

      <div className="stat-grid">
        <StatCard title="My Students"      value={myStudents.length} subtitle="Assigned to me"  icon="👥" color="var(--pastel-lavender)" />
        <StatCard title="Active"           value={active}            subtitle="On internship"   icon="🟢" color="var(--pastel-mint)"     />
        <StatCard title="Completed"        value={completed}         subtitle="This semester"   icon="✅" color="var(--pastel-sky)"      />
        <StatCard title="Avg Score"        value={`${avgScore}%`}    subtitle="My students"     icon="📈" color="var(--pastel-peach)"    />
      </div>

      <div className="dash-grid">
        {/* Pending Evaluations */}
        <div className="card">
          <h3 className="card-title">📝 Pending Evaluations</h3>
          <div className="todo-list">
            {pendingEvals.map((e, i) => (
              <div key={i} className="todo-item">
                <div className="todo-left">
                  <strong>{e.student}</strong>
                  <span>{e.type}</span>
                </div>
                <div className="todo-right">
                  <span className={`badge ${e.priority === 'high' ? 'badge-red' : e.priority === 'medium' ? 'badge-yellow' : 'badge-blue'}`}>
                    {e.priority}
                  </span>
                  <span className="due-date">Due: {e.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="card">
          <h3 className="card-title">📊 Score Distribution</h3>
          <div className="score-bars">
            {myStudents.map(s => (
              <div key={s.id} className="score-bar-row">
                <span className="score-name">{s.name.split(' ')[0]}</span>
                <div className="score-bar-bg">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${s.score ?? 0}%`,
                      background: (s.score ?? 0) >= 80 ? 'var(--pastel-mint-dark)' : (s.score ?? 0) >= 60 ? 'var(--pastel-sky-dark)' : 'var(--pastel-rose-dark)',
                    }}
                  />
                </div>
                <span className="score-val">{s.score ?? '–'}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-header-row">
          <h3 className="card-title">👥 My Students</h3>
          <button className="action-btn" style={{ background: 'var(--academic-primary)' }}>Export Report</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Reg No.</th>
                <th>Programme</th>
                <th>Company</th>
                <th>Status</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.regNumber}</td>
                  <td>{s.program}</td>
                  <td>{s.company}</td>
                  <td>
                    <span className={`badge ${s.status === 'active' ? 'badge-green' : s.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>{s.score !== undefined ? `${s.score}%` : '–'}</td>
                  <td><button className="tbl-btn">Evaluate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
