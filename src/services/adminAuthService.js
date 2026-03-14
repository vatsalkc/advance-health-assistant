import { supabase } from '../config/supabase';

class AdminAuthService {
  constructor() {
    this.admin = null;
    this.loadAdminFromStorage();
  }

  loadAdminFromStorage() {
    const adminData = localStorage.getItem('admin_data');
    if (adminData) {
      try {
        this.admin = JSON.parse(adminData);
      } catch (error) {
        console.error('[AdminAuth] Error parsing admin data:', error);
        localStorage.removeItem('admin_data');
      }
    }
  }

  async register(adminData) {
    try {
      console.log('[AdminAuth] Registering admin...');
      
      // Register admin with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Create admin profile
      const { data: profile, error: profileError } = await supabase
        .from('admins')
        .insert([
          {
            auth_id: authData.user.id,
            name: adminData.name,
            email: adminData.email,
            phone: adminData.phone || null,
            role: adminData.role || 'admin',
            is_active: true,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('[AdminAuth] Profile creation error:', profileError);
        throw new Error('Failed to create admin profile');
      }

      // Store admin data
      this.admin = profile;
      localStorage.setItem('admin_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));
      localStorage.setItem('user_role', 'admin');

      console.log('[AdminAuth] Registration successful');
      return profile;
    } catch (error) {
      console.error('[AdminAuth] Registration error:', error);
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  async login(email, password) {
    try {
      console.log('[AdminAuth] Logging in...');
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user || !authData.session) {
        throw new Error('Login failed - no session returned');
      }

      // Get admin profile
      const { data: profile, error: profileError } = await supabase
        .from('admins')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('[AdminAuth] Profile error:', profileError);
        throw new Error('Admin profile not found. Access denied.');
      }

      if (!profile.is_active) {
        throw new Error('Admin account is inactive. Please contact support.');
      }

      // Store admin data
      this.admin = profile;
      localStorage.setItem('admin_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));
      localStorage.setItem('user_role', 'admin');

      console.log('[AdminAuth] Login successful');
      return profile;
    } catch (error) {
      console.error('[AdminAuth] Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  async logout() {
    try {
      console.log('[AdminAuth] Logging out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AdminAuth] Supabase signout error:', error);
      }

      // Clear all auth data
      this.admin = null;
      localStorage.removeItem('admin_data');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('user_role');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('last_token_validation');
      
      // Clear Supabase storage
      localStorage.removeItem('sb-mklbffjqlcvowdardqkb-auth-token');
      
      console.log('[AdminAuth] Logout complete');
      return true;
    } catch (error) {
      console.error('[AdminAuth] Logout error:', error);
      
      // Force clear everything even if there's an error
      this.admin = null;
      localStorage.clear();
      
      return true;
    }
  }

  getCurrentAdmin() {
    if (!this.admin) {
      this.loadAdminFromStorage();
    }
    return this.admin;
  }

  isAuthenticated() {
    try {
      const session = localStorage.getItem('supabase_session');
      const adminData = localStorage.getItem('admin_data');
      const userRole = localStorage.getItem('user_role');
      
      if (!session || !adminData || userRole !== 'admin') {
        return false;
      }

      const sessionData = JSON.parse(session);
      if (!sessionData.access_token) {
        return false;
      }

      // Check if session is expired
      if (sessionData.expires_at) {
        const expiresAt = sessionData.expires_at * 1000;
        if (Date.now() >= expiresAt) {
          console.log('[AdminAuth] Session expired');
          this.logout();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('[AdminAuth] isAuthenticated error:', error);
      return false;
    }
  }

  async validateToken() {
    try {
      console.log('[AdminAuth] Validating token...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('[AdminAuth] Session error:', error);
        await this.logout();
        return false;
      }

      // Refresh admin profile
      const { data: profile, error: profileError } = await supabase
        .from('admins')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      if (profileError || !profile) {
        console.error('[AdminAuth] Profile error:', profileError);
        await this.logout();
        return false;
      }

      // Update stored data
      this.admin = profile;
      localStorage.setItem('admin_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(session));
      localStorage.setItem('last_token_validation', Date.now().toString());
      
      console.log('[AdminAuth] Token validated successfully');
      return true;
    } catch (error) {
      console.error('[AdminAuth] Token validation error:', error);
      await this.logout();
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

const adminAuthService = new AdminAuthService();
export default adminAuthService;
