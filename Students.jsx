import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, Edit2, Trash2, Users } from 'lucide-react';
import { studentService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';
import ConfirmModal from '../components/ConfirmModal';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (query = '') => {
    try {
      setLoading(true);
      const res = await studentService.getAll(query);
      setStudents(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to fetch students.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      fetchStudents('');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.student) return;
    try {
      await studentService.delete(deleteModal.student.id);
      setMessage({ type: 'success', text: `Student "${deleteModal.student.name}" was deleted successfully.` });
      setDeleteModal({ isOpen: false, student: null });
      fetchStudents(searchTerm);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error deleting student.' });
      setDeleteModal({ isOpen: false, student: null });
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
          <h2>Registered Students Directory ({students.length})</h2>
          <div className="table-controls">
            <form onSubmit={handleSearch} className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
            <Link to="/students/add" className="btn btn-primary">
              <UserPlus size={16} /> Register Student
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading student records..." />
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <Users size={40} />
                      <p>No students registered yet. Click "Register Student" to add one.</p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>#{student.id}</td>
                      <td><strong>{student.name}</strong></td>
                      <td>
                        <span className="badge badge-blue">{student.studentId}</span>
                      </td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            title="Edit student"
                            onClick={() => navigate(`/students/edit/${student.id}`)}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            title="Delete student"
                            onClick={() => setDeleteModal({ isOpen: true, student })}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Student"
        message={`Are you sure you want to delete student "${deleteModal.student?.name}"? (Students with active unreturned books cannot be deleted)`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, student: null })}
      />
    </div>
  );
}
