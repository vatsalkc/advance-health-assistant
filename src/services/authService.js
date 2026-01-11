import { authAPI } from '../utils/api';
import axios from 'axios';
import demoService from './demoService';

class AuthService {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('auth_token');
    this.refreshPromise = null; // Prevent multiple refresh attempts
    this.demoMode = false;
    this.backendAvailable = null; // null = unknown, true = available, false = unavailable
  }

  async checkBackendAvailability() {
    if (this.backendAvailable !== null) {
      return this.backendAvailable;
    }

    try {
      // Get dynamic API URL
      const getApiUrl = () => {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          return `http://${window.location.hostname}:5000/api`;
        }
        return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      };

      const response = await axios.get(`${getApiUrl()}/auth/validate`, {
        timeout: 3000 // 3 second timeout
      });
      
      this.backendAvailable = true;
      this.demoMode = false;
      console.log('Backend is available');
      return true;
    } catch (error) {
      console.log('Backend not available, switching to demo mode');
      this.backendAvailable = false;
      this.demoMode = true;
      return false;
    }
  }

  async login(email, password) {
    // Check if backend is available
    const backendAvailable = await this.checkBackendAvailability();
    
    if (!backendAvailable) {
      // Use demo service
      try {
        const response = await demoService.login({ email, password });
        const { token, user } = response;
        
        // Store demo auth data
        this.setAuthData(token, user, true);
        
        return user;
      } catch (error) {
        throw new Error('Demo login failed');
      }
    }

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      // Store token and user data
      this.setAuthData(token, user, false);
      
      return user;
    } catch (error) {
      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Please fill in all fields');
      } else if (!error.response) {
        throw new Error('Unable to connect to server. Switching to demo mode...');
      }
      
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData) {
    // Check if backend is available
    const backendAvailable = await this.checkBackendAvailability();
    
    if (!backendAvailable) {
      // Use demo service
      try {
        const response = await demoService.register(userData);
        const { token, user } = response;
        
        // Store demo auth data
        this.setAuthData(token, user, true);
        
        return user;
      } catch (error) {
        throw new Error('Demo registration completed');
      }
    }

    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      // Store token and user data
      this.setAuthData(token, user, false);
      
      return user;
    } catch (error) {
      // Provide more specific error messages
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Please check your input');
      } else if (!error.response) {
        throw new Error('Unable to connect to server. Switching to demo mode...');
      }
      
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  setAuthData(token, user, isDemoMode = false) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('auth_timestamp', Date.now().toString());
    localStorage.setItem('demo_mode', isDemoMode.toString());
    
    this.token = token;
    this.user = user;
    this.demoMode = isDemoMode;
  }

  async validateToken() {
    if (!this.token) {
      return false;
    }

    // Check if we're in demo mode
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      this.demoMode = true;
      return true; // Demo tokens are always valid
    }

    try {
      // Get dynamic API URL
      const getApiUrl = () => {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          return `http://${window.location.hostname}:5000/api`;
        }
        return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      };

      const response = await axios.get(`${getApiUrl()}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        timeout: 3000
      });
      
      if (response.data.valid) {
        this.user = response.data.user;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      
      // If backend is not available, switch to demo mode
      if (!error.response) {
        console.log('Backend unavailable during validation, switching to demo mode');
        this.demoMode = true;
        this.backendAvailable = false;
        return true; // Continue in demo mode
      }
      
      // If token is expired or invalid, try to refresh
      if (error.response?.data?.error_code === 'TOKEN_EXPIRED') {
        return await this.refreshToken();
      }
      
      // Clear invalid token
      this.logout();
      return false;
    }
  }

  async refreshToken() {
    if (this.demoMode) {
      return true; // Demo mode doesn't need refresh
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    
    return result;
  }

  async _performRefresh() {
    try {
      // Get dynamic API URL
      const getApiUrl = () => {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          return `http://${window.location.hostname}:5000/api`;
        }
        return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      };

      const response = await axios.post(`${getApiUrl()}/auth/refresh`, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        timeout: 3000
      });
      
      const { token, user } = response.data;
      this.setAuthData(token, user, false);
      
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // If backend is not available, switch to demo mode
      if (!error.response) {
        console.log('Backend unavailable during refresh, switching to demo mode');
        this.demoMode = true;
        this.backendAvailable = false;
        return true;
      }
      
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_timestamp');
    localStorage.removeItem('demo_mode');
    this.token = null;
    this.user = null;
    this.demoMode = false;
    this.backendAvailable = null;
  }

  getCurrentUser() {
    if (!this.user && this.token) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
          this.demoMode = localStorage.getItem('demo_mode') === 'true';
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.logout();
        }
      }
    }
    return this.user;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  isDemoMode() {
    return this.demoMode || localStorage.getItem('demo_mode') === 'true';
  }

  // Check if we need to validate token (every 5 minutes)
  shouldValidateToken() {
    if (this.isDemoMode()) {
      return false; // Demo mode doesn't need validation
    }
    
    const lastCheck = localStorage.getItem('auth_timestamp');
    if (!lastCheck) return true;
    
    const fiveMinutes = 5 * 60 * 1000;
    return (Date.now() - parseInt(lastCheck)) > fiveMinutes;
  }
}

export default new AuthService();