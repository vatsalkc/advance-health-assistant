import axios from 'axios';
import demoService from './demoService';

// Dynamic API URL based on how the app is accessed
const getApiBaseUrl = () => {
  // Check if we're on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    // Use static API on GitHub Pages
    return `${window.location.origin}/advance-health-assistant/static_api/api`;
  }
  
  // If accessed via network IP, use network IP for API
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000/api`;
  }
  
  // Default to localhost for local development
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();
const IS_STATIC_API = window.location.hostname.includes('github.io');

console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);
console.log('Using static API:', IS_STATIC_API);

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
  async (error) => {
    const originalRequest = error.config;
    
    // If token expired and we haven't already tried to refresh
    if (error.response?.status === 401 && 
        error.response?.data?.error_code === 'TOKEN_EXPIRED' && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const authService = (await import('../services/authService')).default;
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${authService.getToken()}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    // If unauthorized and not a refresh attempt, redirect to login
    if (error.response?.status === 401 && !originalRequest.url?.includes('/auth/')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
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
    if (IS_STATIC_API) {
      return axios.get(`${API_BASE_URL}/doctors.json`).then(response => {
        let doctors = response.data.doctors;
        if (specialization) {
          doctors = doctors.filter(doc => doc.specialization === specialization);
        }
        return { data: { doctors } };
      });
    }
    
    const params = specialization ? { specialization } : {};
    return api.get('/doctors', { params });
  }
};

// Stats API
export const statsAPI = {
  get: () => api.get('/stats')
};

export default api;
