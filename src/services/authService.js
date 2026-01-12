import { authAPI } from '../utils/api';
import axios from 'axios';

class AuthService {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('auth_token');
    this.refreshPromise = null;
  }

  async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      this.setAuthData(token, user);
      
      return user;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Please fill in all fields');
      } else if (!error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      this.setAuthData(token, user);
      
      return user;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Please check your input');
      } else if (!error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  setAuthData(token, user) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('auth_timestamp', Date.now().toString());
    
    this.token = token;
    this.user = user;
  }

  async validateToken() {
    if (!this.token) {
      return false;
    }

    try {
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
      
      if (error.response?.data?.error_code === 'TOKEN_EXPIRED') {
        return await this.refreshToken();
      }
      
      this.logout();
      return false;
    }
  }

  async refreshToken() {
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
      this.setAuthData(token, user);
      
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_timestamp');
    this.token = null;
    this.user = null;
  }

  getCurrentUser() {
    if (!this.user && this.token) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
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

  shouldValidateToken() {
    const lastCheck = localStorage.getItem('auth_timestamp');
    if (!lastCheck) return true;
    
    const fiveMinutes = 5 * 60 * 1000;
    return (Date.now() - parseInt(lastCheck)) > fiveMinutes;
  }
}

export default new AuthService();