import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (email, password, name, role) => api.post('/api/auth/register', { email, password, name, role }),
  logout: () => api.post('/api/auth/logout'),
  checkAuth: () => api.get('/api/auth/check'),
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/api/student/dashboard'),
  getClasses: () => api.get('/api/student/classes'),
  joinClass: (classCode) => api.post('/api/student/classes/join', { classCode }),
  getAssignments: (filter = 'all') => api.get(`/api/student/assignments?filter=${filter}`),
  getAssignment: (id) => api.get(`/api/student/assignments/${id}`),
  submitAssignment: (assignmentId, code, language) => 
    api.post(`/api/student/submit/${assignmentId}`, { code, language }),
  getGrades: () => api.get('/api/student/grades'),
  getSkills: () => api.get('/api/student/skills'),
};

// Teacher API
export const teacherAPI = {
  getDashboard: () => api.get('/api/teacher/dashboard'),
  getClasses: () => api.get('/api/teacher/classes'),
  createClass: (classData) => api.post('/api/teacher/classes', classData),
  updateClass: (id, classData) => api.put(`/api/teacher/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/api/teacher/classes/${id}`),
  getAssignments: () => api.get('/api/teacher/assignments'),
  createAssignment: (assignmentData) => api.post('/api/teacher/assignments', assignmentData),
  getSubmissions: (assignmentId) => api.get(`/api/teacher/submissions/${assignmentId}`),
  gradeSubmission: (submissionId, grade, feedback) => 
    api.post(`/api/teacher/grade/${submissionId}`, { grade, feedback }),
  getAnalytics: () => api.get('/api/teacher/analytics'),
};

export default api;