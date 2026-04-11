import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getLogs, getTimesheets } from '../../api/students.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [logs, setLogs]         = useState([]);
  const [timesheets, setSheets] = useState([]);

  useEffect(() => {
    getLogs(user.username).then(setLogs);
    getTimesheets(user.username).then(setSheets);
  }, [user.username]);

  const totalLogs    = logs.length;
  const pending      = logs.filter(l => l.status === 'Submitted').length;
  const totalHours   = timesheets.reduce((s, t) => s + (parseFloat(t.hours) || 0), 0);
  const recentLogs   = [...logs].reverse().slice(0, 5);

  const statusBadge = s =>
    s === 'Submitted' ? 'badge-success' :
    s === 'Draft'     ? 'badge-secondary' : 'badge-warning';

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>Welcome, {user.name} 👋</h1>
            <p>Here's a summary of your internship progress.</p>
          </div>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="stat-label">Total Logs</span>
              <span className="stat-value">{totalLogs}</span>
              <span className="stat-sub">Submitted</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending Approval</span>
              <span className="stat-value">{pending}</span>
              <span className="stat-sub">Awaiting review</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Hours Logged</span>
              <span className="stat-value">{totalHours.toFixed(1)}</span>
              <span className="stat-sub">Total hours</span>
            </div>
          </div>

          <div className="quick-links">
            <Link to="/dashboard/student/log"       className="btn btn-primary">+ New Log Entry</Link>
            <Link to="/dashboard/student/timesheet" className="btn btn-secondary">🕐 Timesheet</Link>
            <Link to="/dashboard/student/profile"   className="btn btn-warning">👤 Profile</Link>
          </div>

          <div className="card">
            <p className="section-title">Recent Logs</p>
            {recentLogs.length === 0 ? (
              <p className="text-muted">No logs yet. <Link to="/dashboard/student/log">Add your first log →</Link></p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map(log => (
                    <tr key={log.id}>
                      <td>Week {log.weekNumber}</td>
                      <td>{log.logDate}</td>
                      <td>{log.company}</td>
                      <td>{log.hoursWorked}h</td>
                      <td><span className={`badge ${statusBadge(log.status)}`}>{log.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
