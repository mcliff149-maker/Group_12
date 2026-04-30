import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStudents, getReviews, getStudentLogs } from '../../api/academic.js';

export default function AcademicDashboard() {
  const { user }   = useAuth();
  const [allLogs, setAllLogs]   = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    Promise.all([getStudents(), getReviews()]).then(([students, revs]) => {
      setAssigned(students);
      setReviews(revs);
      return Promise.all(
        students.map(s =>
          getStudentLogs(s.username).then(ls => ls.map(l => ({ ...l, studentUsername: s.username })))
        )
      );
    }).then(results => {
      setAllLogs(results.flat());
    });
  }, []);

  const reviewed   = reviews.length;
  const pending    = allLogs.filter(l => l.status === 'Submitted' && !reviews.find(r => r.logId === l.id)).length;
  const approved   = reviews.filter(r => r.recommendation === 'Approve').length;
  const rejected   = reviews.filter(r => r.recommendation === 'Reject').length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          <div className="page-heading">
            <h1>Welcome, {user.name} 👋</h1>
            <p>Review and evaluate student internship logs.</p>
          </div>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="stat-label">Students Assigned</span>
              <span className="stat-value">{assigned.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending Reviews</span>
              <span className="stat-value">{pending}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Approved</span>
              <span className="stat-value" style={{ color: 'var(--color-secondary)' }}>{approved}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Rejected</span>
              <span className="stat-value" style={{ color: 'var(--color-danger)' }}>{rejected}</span>
            </div>
          </div>

          <div className="quick-links">
            <Link to="/dashboard/academic/review"  className="btn btn-primary">🔍 Review Logs</Link>
            <Link to="/dashboard/academic/profile" className="btn btn-warning">👤 Profile</Link>
          </div>

          <div className="card">
            <p className="section-title">Student Logs</p>
            {allLogs.length === 0 ? (
              <p className="text-muted">No logs submitted yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Week</th>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allLogs.map(log => {
                    const reviewed = reviews.find(r => r.logId === log.id);
                    return (
                      <tr key={log.id}>
                        <td>{log.studentUsername}</td>
                        <td>Week {log.weekNumber}</td>
                        <td>{log.logDate}</td>
                        <td>{log.company}</td>
                        <td>{log.hoursWorked}h</td>
                        <td>
                          <span className={`badge ${log.status === 'Submitted' ? 'badge-success' : 'badge-secondary'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td>
                          {reviewed
                            ? <span className="badge badge-success">Reviewed</span>
                            : <Link to="/dashboard/academic/review" className="btn btn-primary btn-sm">Review</Link>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
