import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  delete: (id) => api.delete(`/appointments/${id}`)
};

// Medicines API
export const medicinesAPI = {
  getAll: () => api.get('/medicines'),
  create: (medicineData) => api.post('/medicines', medicineData),
  update: (id, medicineData) => api.put(`/medicines/${id}`, medicineData),
  delete: (id) => api.delete(`/medicines/${id}`)
};

// Symptom Check API
export const symptomCheckAPI = {
  check: (symptoms) => api.post('/symptom-check', { symptoms }),
  getHistory: () => api.get('/symptom-checks')
};

// Doctors API
export const doctorsAPI = {
  getAll: (specialization = null) => {
    const params = specialization ? { specialization } : {};
    return api.get('/doctors', { params });
  }
};

// Stats API
export const statsAPI = {
  get: () => api.get('/stats')
};

export default api;
