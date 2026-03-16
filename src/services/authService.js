import { supabase } from '../config/supabase';

class AuthService {
  constructor() {
    this.user = null;
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (error) {
        console.error('[AuthService] Error parsing user data:', error);
        localStorage.removeItem('user_data');
      }
    }
  }

  async register(userData) {
    try {
      console.log('[AuthService] Attempting registration...');
      
      // Register user with Supabase Auth with auto-confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: userData.name,
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      console.log('[AuthService] Registration successful');

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
        console.error('[AuthService] Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      // Store user data
      this.user = profile;
      localStorage.setItem('user_data', JSON.stringify(profile));
      
      console.log('[AuthService] User profile created');

      return profile;
    } catch (error) {
      console.error('[AuthService] Registration error:', error);
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  async login(email, password) {
    try {
      console.log('[AuthService] Attempting login...');
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('[AuthService] Login error:', authError);
        throw authError;
      }

      if (!authData.user || !authData.session) {
        throw new Error('Login failed - no session returned');
      }

      console.log('[AuthService] Login successful, user ID:', authData.user.id);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('[AuthService] Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Store user data
      this.user = profile;
      localStorage.setItem('user_data', JSON.stringify(profile));
      
      console.log('[AuthService] User data stored successfully');

      return profile;
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  async logout() {
    try {
      console.log('[AuthService] Logging out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthService] Supabase signout error:', error);
      }

      // Clear all auth data
      this.user = null;
      localStorage.removeItem('user_data');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('last_token_validation');
      
      // Clear Supabase storage
      localStorage.removeItem('sb-mklbffjqlcvowdardqkb-auth-token');
      
      console.log('[AuthService] Logout complete');
      return true;
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
      
      // Force clear everything even if there's an error
      this.user = null;
      localStorage.clear(); // Clear all localStorage to be safe
      
      return true; // Return true anyway so UI can proceed
    }
  }

  getCurrentUser() {
    if (!this.user) {
      this.loadUserFromStorage();
    }
    return this.user;
  }

  isAuthenticated() {
    try {
      // Simple check - just verify we have user data
      const userData = localStorage.getItem('user_data');
      
      if (!userData) {
        return false;
      }

      // Try to parse user data
      try {
        const user = JSON.parse(userData);
        if (user && user.id) {
          this.user = user;
          return true;
        }
      } catch (parseError) {
        console.error('[AuthService] Error parsing user data:', parseError);
        localStorage.removeItem('user_data');
        return false;
      }

      return false;
    } catch (error) {
      console.error('[AuthService] isAuthenticated error:', error);
      return false;
    }
  }

  async validateToken() {
    try {
      console.log('[AuthService] Validating token...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[AuthService] Session error:', error);
        return false;
      }
      
      if (!session) {
        console.log('[AuthService] No active session');
        return false;
      }

      // Refresh user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        console.error('[AuthService] Profile error:', profileError);
        return false;
      }

      // Update stored data
      this.user = profile;
      localStorage.setItem('user_data', JSON.stringify(profile));
      
      console.log('[AuthService] Token validated successfully');
      return true;
    } catch (error) {
      console.error('[AuthService] Token validation error:', error);
      return false;
    }
  }

  shouldValidateToken() {
    // Simplified - validate less frequently
    return false; // Disable automatic validation for now
  }

  async refreshToken() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('[AuthService] Token refresh error:', error);
        return false;
      }

      if (data.session) {
        console.log('[AuthService] Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[AuthService] Token refresh error:', error);
      return false;
    }
  }

  getToken() {
    // Get token from Supabase session
    return null; // Not needed for current implementation
  }
}

const authService = new AuthService();
export default authService;
