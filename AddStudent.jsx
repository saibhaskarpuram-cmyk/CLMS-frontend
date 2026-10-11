import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentService } from '../services/api';
import AlertBanner from '../components/AlertBanner';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: 'Computer Science and Engineering',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.studentId.trim() || !formData.email.trim() || !formData.department.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await studentService.create(formData);
      navigate('/students');
    } catch (err) {
      setError(err.message || 'Failed to register student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/students" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Students
        </Link>
      </div>

      <AlertBanner type="danger" message={error} onClose={() => setError('')} />

      <div className="form-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--slate-900)' }}>
          Register New Student
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentId">Student ID / Roll Number *</label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              className="form-control"
              placeholder="e.g. 21CS101"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
            <span className="form-hint">Must be unique per student</span>
          </div>

          <div className="form-group">
            <label htmlFor="email">College Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="e.g. rahul.sharma@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="form-hint">Unique official college email</span>
          </div>

          <div className="form-group">
            <label htmlFor="department">Department / Branch *</label>
            <select
              id="department"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics and Communication">Electronics and Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Management Studies">Management Studies</option>
            </select>
          </div>

          <div className="form-actions">
            <Link to="/students" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <UserPlus size={16} /> {loading ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
