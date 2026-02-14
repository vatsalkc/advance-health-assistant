import { supabase } from '../config/supabase';

class DoctorAuthService {
  constructor() {
    this.doctor = null;
    this.loadDoctorFromStorage();
  }

  loadDoctorFromStorage() {
    const doctorData = localStorage.getItem('doctor_data');
    if (doctorData) {
      this.doctor = JSON.parse(doctorData);
    }
  }

  async register(doctorData) {
    try {
      console.log('[DoctorAuth] Registering doctor...');
      
      // Register doctor with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: doctorData.email,
        password: doctorData.password,
        options: {
          data: {
            role: 'doctor'
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Create doctor profile in doctors table
      const { data: profile, error: profileError } = await supabase
        .from('doctors')
        .insert([
          {
            auth_id: authData.user.id,
            name: doctorData.name,
            email: doctorData.email,
            phone: doctorData.phone || null,
            specialization: doctorData.specialization,
            qualification: doctorData.qualification || null,
            license_number: doctorData.license_number || null,
            experience: doctorData.experience || null,
            rating: 4.5, // Default rating
            is_verified: false, // Needs admin verification
            is_active: true,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Doctor profile creation error:', profileError);
        throw new Error('Failed to create doctor profile');
      }

      // Store doctor data
      this.doctor = profile;
      localStorage.setItem('doctor_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));
      localStorage.setItem('user_role', 'doctor');

      console.log('[DoctorAuth] Registration successful');
      return profile;
    } catch (error) {
      console.error('Doctor registration error:', error);
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  async login(email, password) {
    try {
      console.log('[DoctorAuth] Logging in...');
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Get doctor profile
      const { data: profile, error: profileError } = await supabase
        .from('doctors')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Doctor profile not found. Please register as a doctor.');
      }

      // Store doctor data
      this.doctor = profile;
      localStorage.setItem('doctor_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(authData.session));
      localStorage.setItem('user_role', 'doctor');

      console.log('[DoctorAuth] Login successful');
      return profile;
    } catch (error) {
      console.error('Doctor login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  async logout() {
    try {
      console.log('[DoctorAuth] Logging out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[DoctorAuth] Supabase signout error:', error);
      }

      // Clear all auth data
      this.doctor = null;
      localStorage.removeItem('doctor_data');
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('user_role');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('last_token_validation');
      
      // Clear Supabase storage
      localStorage.removeItem('sb-mklbffjqlcvowdardqkb-auth-token');
      
      console.log('[DoctorAuth] Logout complete');
      return true;
    } catch (error) {
      console.error('[DoctorAuth] Logout error:', error);
      
      // Force clear everything even if there's an error
      this.doctor = null;
      localStorage.clear();
      
      return true;
    }
  }

  getCurrentDoctor() {
    if (!this.doctor) {
      this.loadDoctorFromStorage();
    }
    return this.doctor;
  }

  isAuthenticated() {
    try {
      const session = localStorage.getItem('supabase_session');
      const doctorData = localStorage.getItem('doctor_data');
      const userRole = localStorage.getItem('user_role');
      
      if (!session || !doctorData || userRole !== 'doctor') {
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
          console.log('[DoctorAuth] Session expired');
          this.logout();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('[DoctorAuth] isAuthenticated error:', error);
      return false;
    }
  }

  async validateToken() {
    try {
      console.log('[DoctorAuth] Validating token...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('[DoctorAuth] Session error:', error);
        await this.logout();
        return false;
      }

      // Refresh doctor profile
      const { data: profile, error: profileError } = await supabase
        .from('doctors')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      if (profileError || !profile) {
        console.error('[DoctorAuth] Profile error:', profileError);
        await this.logout();
        return false;
      }

      // Update stored data
      this.doctor = profile;
      localStorage.setItem('doctor_data', JSON.stringify(profile));
      localStorage.setItem('supabase_session', JSON.stringify(session));
      localStorage.setItem('last_token_validation', Date.now().toString());
      
      console.log('[DoctorAuth] Token validated successfully');
      return true;
    } catch (error) {
      console.error('[DoctorAuth] Token validation error:', error);
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

const doctorAuthService = new DoctorAuthService();
export default doctorAuthService;
