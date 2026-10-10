import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { issueService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';

export default function IssuedBooks() {
  const [issues, setIssues] = useState([]);
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [returnModal, setReturnModal] = useState({ isOpen: false, issue: null });
  const [processingReturn, setProcessingReturn] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, [filterActiveOnly]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = filterActiveOnly
        ? await issueService.getActive()
        : await issueService.getAll();
      setIssues(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to fetch issued books.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!returnModal.issue) return;
    try {
      setProcessingReturn(true);
      await issueService.returnBook(returnModal.issue.id);
      setMessage({
        type: 'success',
        text: `Book "${returnModal.issue.book?.title}" returned successfully! Inventory copy count restored.`,
      });
      setReturnModal({ isOpen: false, issue: null });
      fetchIssues();
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error returning book.' });
      setReturnModal({ isOpen: false, issue: null });
    } finally {
      setProcessingReturn(false);
    }
  };

  return (
    <div>
      <AlertBanner
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ type: '', text: '' })}
      />

      <div className="card">
        <div className="card-header">
          <h2>
            Book Loan Records ({issues.length} {filterActiveOnly ? 'Active' : 'Total'})
          </h2>
          <div className="table-controls">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${!filterActiveOnly ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterActiveOnly(false)}
              >
                All Records
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterActiveOnly ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterActiveOnly(true)}
              >
                Active Only
              </button>
            </div>
            <Link to="/issues/new" className="btn btn-primary">
              <BookmarkCheck size={16} /> Issue Book
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading loan records..." />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Book Title</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      <Clock size={40} />
                      <p>No loan records found.</p>
                    </td>
                  </tr>
                ) : (
                  issues.map((issue) => {
                    const isIssued = issue.status === 'ISSUED';
                    const isOverdue =
                      isIssued && new Date(issue.dueDate) < new Date(new Date().toDateString());

                    return (
                      <tr key={issue.id}>
                        <td>#{issue.id}</td>
                        <td>
                          <strong>{issue.book?.title}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                            ISBN: {issue.book?.isbn}
                          </div>
                        </td>
                        <td>{issue.student?.name}</td>
                        <td>
                          <span className="badge badge-blue">{issue.student?.studentId}</span>
                        </td>
                        <td>{issue.issueDate}</td>
                        <td>
                          <span style={{ color: isOverdue ? 'var(--danger-text)' : 'inherit', fontWeight: isOverdue ? 600 : 'normal' }}>
                            {issue.dueDate}
                          </span>
                        </td>
                        <td>{issue.returnDate || '—'}</td>
                        <td>
                          {isIssued ? (
                            <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-amber'}`}>
                              {isOverdue ? 'Overdue' : 'Issued'}
                            </span>
                          ) : (
                            <span className="badge badge-success">Returned</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isIssued ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => setReturnModal({ isOpen: true, issue })}
                            >
                              <RotateCcw size={14} /> Return Book
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={14} /> Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={returnModal.isOpen}
        title="Return Book"
        message={`Mark "${returnModal.issue?.book?.title}" borrowed by "${returnModal.issue?.student?.name}" as returned today? This will increment available copies by 1.`}
        confirmText={processingReturn ? 'Returning...' : 'Confirm Return'}
        isDanger={false}
        onConfirm={handleReturn}
        onCancel={() => setReturnModal({ isOpen: false, issue: null })}
      />
    </div>
  );
}
