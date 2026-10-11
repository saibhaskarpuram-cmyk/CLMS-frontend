import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookService } from '../services/api';
import AlertBanner from '../components/AlertBanner';
import { BookPlus, ArrowLeft } from 'lucide-react';

export default function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 5,
    availableCopies: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'totalCopies') {
      const total = parseInt(value, 10) || 0;
      setFormData((prev) => ({
        ...prev,
        totalCopies: total,
        availableCopies: total, // Default available to total when setting total
      }));
    } else if (name === 'availableCopies') {
      setFormData((prev) => ({
        ...prev,
        availableCopies: parseInt(value, 10) || 0,
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
      setLoading(true);
      setError('');
      await bookService.create(formData);
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Failed to save book.');
    } finally {
      setLoading(false);
    }
  };

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
          Add New Book to Library
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Book Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Introduction to Algorithms"
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
              placeholder="e.g. Thomas H. Cormen"
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
                placeholder="e.g. 978-0262033848"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Must be unique for each book</span>
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
              <span className="form-hint">Cannot exceed total copies</span>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/books" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <BookPlus size={16} /> {loading ? 'Saving...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
