import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { bookService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, book: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (query = '') => {
    try {
      setLoading(true);
      const res = await bookService.getAll(query);
      setBooks(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to fetch books.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      fetchBooks('');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.book) return;
    try {
      await bookService.delete(deleteModal.book.id);
      setMessage({ type: 'success', text: `Book "${deleteModal.book.title}" was deleted successfully.` });
      setDeleteModal({ isOpen: false, book: null });
      fetchBooks(searchTerm);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error deleting book.' });
      setDeleteModal({ isOpen: false, book: null });
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
          <h2>All Books Inventory ({books.length})</h2>
          <div className="table-controls">
            <form onSubmit={handleSearch} className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
            <Link to="/books/add" className="btn btn-primary">
              <Plus size={16} /> Add Book
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading library catalog..." />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Copies (Total)</th>
                  <th>Available</th>
                  <th>Availability Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      <BookOpen size={40} />
                      <p>No books found. Add some books to get started.</p>
                    </td>
                  </tr>
                ) : (
                  books.map((book) => {
                    const isAvailable = book.availableCopies > 0;
                    return (
                      <tr key={book.id}>
                        <td>#{book.id}</td>
                        <td><strong>{book.title}</strong></td>
                        <td>{book.author}</td>
                        <td><code>{book.isbn}</code></td>
                        <td>
                          <span className="badge badge-blue">{book.category || 'General'}</span>
                        </td>
                        <td>{book.totalCopies}</td>
                        <td><strong>{book.availableCopies}</strong></td>
                        <td>
                          {isAvailable ? (
                            <span className="badge badge-success">Available</span>
                          ) : (
                            <span className="badge badge-danger">Out of Stock</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              title="Edit book"
                              onClick={() => navigate(`/books/edit/${book.id}`)}
                            >
                              <Edit2 size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              title="Delete book"
                              onClick={() => setDeleteModal({ isOpen: true, book })}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
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
        isOpen={deleteModal.isOpen}
        title="Delete Book"
        message={`Are you sure you want to permanently delete "${deleteModal.book?.title}"? (Deletion will be prevented if copies are currently borrowed)`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, book: null })}
      />
    </div>
  );
}
