import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookService, studentService, issueService } from '../services/api';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookmarkCheck, ArrowLeft } from 'lucide-react';

export default function IssueBook() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);

  // Default dates: today and 14 days later
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 14);
  const defaultDueStr = defaultDue.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    studentId: '',
    bookId: '',
    dueDate: defaultDueStr,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      const [studentsRes, booksRes] = await Promise.all([
        studentService.getAll(),
        bookService.getAll(),
      ]);
      setStudents(studentsRes.data);
      setBooks(booksRes.data);

      // Auto-select first student and first available book if available
      if (studentsRes.data.length > 0) {
        setFormData((prev) => ({ ...prev, studentId: studentsRes.data[0].id }));
      }
      const availableBook = booksRes.data.find((b) => b.availableCopies > 0);
      if (availableBook) {
        setFormData((prev) => ({ ...prev, bookId: availableBook.id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load library data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.bookId) {
      setError('Please select both a student and an available book.');
      return;
    }

    const selectedBook = books.find((b) => b.id === Number(formData.bookId));
    if (selectedBook && selectedBook.availableCopies <= 0) {
      setError(`Cannot issue "${selectedBook.title}". No copies are currently available.`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await issueService.issueBook({
        studentId: Number(formData.studentId),
        bookId: Number(formData.bookId),
        dueDate: formData.dueDate,
      });
      navigate('/issues');
    } catch (err) {
      setError(err.message || 'Failed to issue book.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading students and catalog..." />;

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/issues" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Issued Records
        </Link>
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      <div className="form-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
          Issue Book to Student
        </h2>

        {students.length === 0 || books.length === 0 ? (
          <div className="empty-state">
            <p>
              {students.length === 0 && 'No students registered. Please add students first.'}
              <br />
              {books.length === 0 && 'No books available in library. Please add books first.'}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {students.length === 0 && (
                <Link to="/students/add" className="btn btn-primary btn-sm">
                  Register Student
                </Link>
              )}
              {books.length === 0 && (
                <Link to="/books/add" className="btn btn-primary btn-sm">
                  Add Book
                </Link>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentId">Select Student *</label>
              <select
                id="studentId"
                name="studentId"
                className="form-control"
                value={formData.studentId}
                onChange={handleChange}
                required
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId}) - {student.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bookId">Select Book *</label>
              <select
                id="bookId"
                name="bookId"
                className="form-control"
                value={formData.bookId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a book --</option>
                {books.map((book) => {
                  const isOutOfStock = book.availableCopies <= 0;
                  return (
                    <option key={book.id} value={book.id} disabled={isOutOfStock}>
                      {book.title} by {book.author} (Available: {book.availableCopies}/{book.totalCopies})
                      {isOutOfStock ? ' [OUT OF STOCK]' : ''}
                    </option>
                  );
                })}
              </select>
              <span className="form-hint">Books with 0 copies available cannot be issued</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={todayStr}
                  disabled
                />
                <span className="form-hint">Automatically recorded as today</span>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date *</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  min={todayStr}
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to="/issues" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <BookmarkCheck size={16} /> {submitting ? 'Issuing Book...' : 'Issue Book'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
