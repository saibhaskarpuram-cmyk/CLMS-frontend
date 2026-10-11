import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { bookService } from '../services/api';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save, ArrowLeft } from 'lucide-react';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1,
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setInitialLoading(true);
      const res = await bookService.getById(id);
      setFormData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load book data.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'totalCopies' || name === 'availableCopies') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim() || !formData.isbn.trim()) {
      setError('Title, author, and ISBN are required.');
      return;
    }
    if (formData.availableCopies > formData.totalCopies) {
      setError('Available copies cannot exceed total copies.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await bookService.update(id, formData);
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Failed to update book.');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) return <LoadingSpinner message="Loading book details..." />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/books" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Books
        </Link>
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      <div className="form-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
          Edit Book Details (#{id})
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Book Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              id="author"
              name="author"
              type="text"
              className="form-control"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">ISBN Code *</label>
              <input
                id="isbn"
                name="isbn"
                type="text"
                className="form-control"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category / Branch</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Literature & Humanities">Literature & Humanities</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalCopies">Total Copies *</label>
              <input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min="1"
                className="form-control"
                value={formData.totalCopies}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="availableCopies">Available Copies *</label>
              <input
                id="availableCopies"
                name="availableCopies"
                type="number"
                min="0"
                max={formData.totalCopies}
                className="form-control"
                value={formData.availableCopies}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Cannot exceed total copies or be negative</span>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/books" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
