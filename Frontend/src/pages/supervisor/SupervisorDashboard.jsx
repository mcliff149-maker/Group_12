import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStudentsForSupervisor, getVerifications } from '../../api/supervisors.js';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [students, setStudents]       = useState([]);
  const [verifications, setVerifs]    = useState([]);

  useEffect(() => {
    getStudentsForSupervisor().then(setStudents);
    getVerifications().then(setVerifs);
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>Welcome, {user.name} 👋</h1>
            <p>Manage and evaluate your assigned interns.</p>
          </div>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="stat-label">Interns Assigned</span>
              <span className="stat-value">{students.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Evaluations Done</span>
              <span className="stat-value">{verifications.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{Math.max(0, students.length - verifications.length)}</span>
            </div>
          </div>

          <div className="quick-links">
            <Link to="/dashboard/supervisor/evaluate" className="btn btn-primary">📋 Evaluate Intern</Link>
            <Link to="/dashboard/supervisor/profile"  className="btn btn-warning">👤 Profile</Link>
          </div>

          <div className="card mb-3">
            <p className="section-title">Intern Roster</p>
            {students.length === 0 ? (
              <p className="text-muted">No interns assigned.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>University</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.username}>
                      <td>{s.name}</td>
                      <td>{s.username}</td>
                      <td>{s.email}</td>
                      <td>{s.program}</td>
                      <td>{s.university}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <p className="section-title">Recent Evaluations</p>
            {verifications.length === 0 ? (
              <p className="text-muted">No evaluations submitted yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Intern</th>
                    <th>Period</th>
                    <th>Overall Rating</th>
                    <th>Hours Verified</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...verifications].reverse().map(v => (
                    <tr key={v.id}>
                      <td>{v.internUsername}</td>
                      <td>{v.period}</td>
                      <td><strong>{v.overallRating}/5</strong></td>
                      <td>{v.hoursVerified}h</td>
                      <td>{new Date(v.createdAt).toLocaleDateString()}</td>
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
