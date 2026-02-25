import { supabase, ensureSessionPersistence } from '../config/supabase';

class AuthService {
  constructor() {
    this.user = null;
    this.loadUserFromStorage();
    this.setupAuthListener();
  }

  setupAuthListener() {
    // Listen for auth state changes (important for mobile)
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthService] Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        await this.handleSignIn(session);
      } else if (event === 'SIGNED_OUT') {
        this.handleSignOut();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        await this.handleTokenRefresh(session);
      }
    });
  }

  async handleSignIn(session) {
    try {
      // Get user profile
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!error && profile) {
        this.user = profile;
        localStorage.setItem('user_data', JSON.stringify(profile));
        localStorage.setItem('supabase_session', JSON.stringify(session));
        
        // Ensure session persists on mobile
        await ensureSessionPersistence();
      }
    } catch (error) {
      console.error('[AuthService] handleSignIn error:', error);
    }
  }

  handleSignOut() {
    this.user = null;
    localStorage.removeItem('user_data');
    localStorage.removeItem('supabase_session');
  }

  async handleTokenRefresh(session) {
    localStorage.setItem('supabase_session', JSON.stringify(session));
    localStorage.setItem('last_token_validation', Date.now().toString());
    console.log('[AuthService] Token refreshed');
  }

  loadUserFromStorage() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  async register(userData) {
    try {
      console.log('[AuthService] Attempting registration...');
      
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
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
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));
      localStorage.setItem('last_login', Date.now().toString());
      
      // Ensure session persists on mobile
      await ensureSessionPersistence();
      
      console.log('[AuthService] User profile created, session persisted');

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

      if (authError) throw authError;

      console.log('[AuthService] Login successful');

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
      localStorage.setItem('last_login', Date.now().toString());
      
      // Ensure session persists on mobile
      await ensureSessionPersistence();
      
      console.log('[AuthService] User data stored, session persisted');

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
      // Check if we have a valid session
      const session = localStorage.getItem('supabase_session');
      const userData = localStorage.getItem('user_data');
      
      if (!session || !userData) {
        return false;
      }

      // Parse and validate session
      const sessionData = JSON.parse(session);
      if (!sessionData.access_token) {
        return false;
      }

      // Check if session is expired
      if (sessionData.expires_at) {
        const expiresAt = sessionData.expires_at * 1000; // Convert to milliseconds
        if (Date.now() >= expiresAt) {
          console.log('[AuthService] Session expired');
          this.logout();
          return false;
        }
      }

      return true;
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
        await this.logout();
        return false;
      }
      
      if (!session) {
        console.log('[AuthService] No active session');
        await this.logout();
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
        await this.logout();
        return false;
      }

      // Update stored data
      this.user = profile;
      localStorage.setItem('user_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(session));
      localStorage.setItem('last_token_validation', Date.now().toString());
      
      console.log('[AuthService] Token validated successfully');
      return true;
    } catch (error) {
      console.error('[AuthService] Token validation error:', error);
      await this.logout();
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
