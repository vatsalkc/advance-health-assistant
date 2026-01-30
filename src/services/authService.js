import { supabase } from '../config/supabase';

class AuthService {
  constructor() {
    this.user = null;
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  async register(userData) {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Create user profile in users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || null,
            age: userData.age ? parseInt(userData.age) : null,
            gender: userData.gender || null,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      // Store user data
      this.user = profile;
      localStorage.setItem('user_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));

      return profile;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  async login(email, password) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      // Store user data
      this.user = profile;
      localStorage.setItem('user_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));

      return profile;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      this.user = null;
      localStorage.removeItem('user_data');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage anyway
      this.user = null;
      localStorage.removeItem('user_data');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('auth_token');
    }
  }

  getCurrentUser() {
    if (!this.user) {
      this.loadUserFromStorage();
    }
    return this.user;
  }

  isAuthenticated() {
    const session = localStorage.getItem('supabase_session');
    return !!session && !!this.getCurrentUser();
  }

  async validateToken() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Refresh user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        this.user = profile;
        localStorage.setItem('user_data', JSON.stringify(profile));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  shouldValidateToken() {
    // Check if we should validate the token (e.g., every hour)
    const lastValidation = localStorage.getItem('last_token_validation');
    if (!lastValidation) return true;

    const oneHour = 60 * 60 * 1000;
    return Date.now() - parseInt(lastValidation) > oneHour;
  }

  async refreshToken() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (data.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session));
        localStorage.setItem('last_token_validation', Date.now().toString());
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  getToken() {
    const session = localStorage.getItem('supabase_session');
    if (session) {
      const sessionData = JSON.parse(session);
      return sessionData.access_token;
    }
    return null;
  }
}

const authService = new AuthService();
export default authService;
