import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      if (error.response.data.validationErrors) {
        const details = Object.values(error.response.data.validationErrors).join(', ');
        message = `${message} (${details})`;
      }
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const bookService = {
  getAll: (search) => apiClient.get('/books', { params: { search } }),
  getById: (id) => apiClient.get(`/books/${id}`),
  create: (book) => apiClient.post('/books', book),
  update: (id, book) => apiClient.put(`/books/${id}`, book),
  delete: (id) => apiClient.delete(`/books/${id}`),
};

export const studentService = {
  getAll: (search) => apiClient.get('/students', { params: { search } }),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (student) => apiClient.post('/students', student),
  update: (id, student) => apiClient.put(`/students/${id}`, student),
  delete: (id) => apiClient.delete(`/students/${id}`),
};

export const issueService = {
  getAll: () => apiClient.get('/issues'),
  getActive: () => apiClient.get('/issues/active'),
  issueBook: (payload) => apiClient.post('/issues', payload),
  returnBook: (id) => apiClient.put(`/issues/${id}/return`),
};

export const dashboardService = {
  getStats: () => apiClient.get('/dashboard/stats'),
};

export default apiClient;
