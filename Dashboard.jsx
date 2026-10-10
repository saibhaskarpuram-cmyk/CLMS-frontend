import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, BookmarkCheck, BookCheck, ArrowRight, BookPlus, UserPlus } from 'lucide-react';
import { dashboardService, issueService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    currentlyIssuedBooks: 0,
    availableBooks: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, issuesRes] = await Promise.all([
        dashboardService.getStats(),
        issueService.getActive(),
      ]);
      setStats(statsRes.data);
      setRecentIssues(issuesRes.data.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading live dashboard statistics..." />;

  return (
    <div>
      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={26} />
          </div>
          <div className="stat-info">
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h3>Registered Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <BookmarkCheck size={26} />
          </div>
          <div className="stat-info">
            <h3>Currently Issued</h3>
            <p>{stats.currentlyIssuedBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <BookCheck size={26} />
          </div>
          <div className="stat-info">
            <h3>Available Copies</h3>
            <p>{stats.availableBooks}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--slate-800)' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/books/add" className="btn btn-primary">
            <BookPlus size={16} /> Add New Book
          </Link>
          <Link to="/students/add" className="btn btn-secondary">
            <UserPlus size={16} /> Register Student
          </Link>
          <Link to="/issues/new" className="btn btn-secondary">
            <BookmarkCheck size={16} /> Issue Book
          </Link>
          <Link to="/issues" className="btn btn-secondary">
            <ArrowRight size={16} /> View Issued Records
          </Link>
        </div>
      </div>

      {/* Recent Active Issues Table */}
      <div className="card">
        <div className="card-header">
          <h2>Active Book Loans (Recent)</h2>
          <Link to="/issues" className="btn btn-secondary btn-sm">
            View All Issued Books <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Title</th>
                <th>Student</th>
                <th>Student ID</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No books are currently issued.
                  </td>
                </tr>
              ) : (
                recentIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>#{issue.id}</td>
                    <td><strong>{issue.book?.title}</strong></td>
                    <td>{issue.student?.name}</td>
                    <td><span className="badge badge-blue">{issue.student?.studentId}</span></td>
                    <td>{issue.issueDate}</td>
                    <td>{issue.dueDate}</td>
                    <td>
                      <span className="badge badge-amber">Issued</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
