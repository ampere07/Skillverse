import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
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
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name, role) => 
    api.post('/auth/register', { email, password, name, role }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Classes API
export const classAPI = {
  create: (name, description) => api.post('/classes', { name, description }),
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  join: (joinCode) => api.post('/classes/join', { joinCode }),
};

// Assignments API
export const assignmentAPI = {
  create: (assignmentData) => api.post('/assignments', assignmentData),
  getByClassId: (classId) => api.get(`/assignments/class/${classId}`),
  getById: (id) => api.get(`/assignments/${id}`),
  update: (id, data) => api.put(`/assignments/${id}`, data),
};

// Submissions API
export const submissionAPI = {
  create: (assignmentId, code) => api.post('/submissions', { assignmentId, code }),
  getByAssignmentId: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  getMySubmission: (assignmentId) => api.get(`/submissions/my/${assignmentId}`),
  grade: (id, grade, feedback) => api.put(`/submissions/${id}/grade`, { grade, feedback }),
};

// Compiler API
export const compilerAPI = {
  compile: (code, language, input) => api.post('/compile', { code, language, input }),
  test: (code, language, testCases) => api.post('/compile/test', { code, language, testCases }),
};

export default api;