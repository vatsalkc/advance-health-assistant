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
      
      // Check if doctor profile already exists (from sample data)
      const { data: existingDoctor, error: checkError } = await supabase
        .from('doctors')
        .select('*')
        .eq('email', doctorData.email)
        .maybeSingle();

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

      let profile;

      // If doctor profile exists, update it with auth_id
      if (existingDoctor && !existingDoctor.auth_id) {
        console.log('[DoctorAuth] Linking existing doctor profile...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('doctors')
          .update({
            auth_id: authData.user.id,
            name: doctorData.name || existingDoctor.name,
            phone: doctorData.phone || existingDoctor.phone,
            qualification: doctorData.qualification || existingDoctor.qualification,
            license_number: doctorData.license_number || existingDoctor.license_number,
            experience: doctorData.experience || existingDoctor.experience,
            is_verified: true, // Auto-verify if from sample data
          })
          .eq('email', doctorData.email)
          .select()
          .single();

        if (updateError) {
          console.error('Doctor profile update error:', updateError);
          throw new Error('Failed to link doctor profile');
        }

        profile = updatedProfile;
      } else {
        // Create new doctor profile
        console.log('[DoctorAuth] Creating new doctor profile...');
        
        const { data: newProfile, error: profileError } = await supabase
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
          console.error('Error details:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          });
          
          // Provide helpful error message
          if (profileError.code === '42501') {
            throw new Error('Registration failed: Database permission error. Please contact support or try again later.');
          } else if (profileError.code === '23505') {
            throw new Error('This email is already registered as a doctor.');
          } else {
            throw new Error(`Failed to create doctor profile: ${profileError.message}`);
          }
        }

        profile = newProfile;
        console.log('[DoctorAuth] Profile created successfully:', profile.id);
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
      let { data: profile, error: profileError } = await supabase
        .from('doctors')
        .select('*')
        .eq('auth_id', authData.user.id)
        .maybeSingle();

      // If profile not found by auth_id, try by email
      if (!profile) {
        console.log('[DoctorAuth] Profile not found by auth_id, trying email...');
        const { data: emailProfile, error: emailError } = await supabase
          .from('doctors')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        
        if (emailProfile) {
          console.log('[DoctorAuth] Found profile by email, linking auth_id...');
          // Update profile with auth_id
          const { data: updated, error: updateError } = await supabase
            .from('doctors')
            .update({ auth_id: authData.user.id, is_active: true })
            .eq('email', email)
            .select()
            .single();
          
          if (!updateError && updated) {
            profile = updated;
            console.log('[DoctorAuth] Profile linked successfully');
          }
        }
      }

      // If still no profile, create one from auth data
      if (!profile) {
        console.log('[DoctorAuth] No profile found, creating from auth data...');
        
        // Get user metadata
        const userName = authData.user.user_metadata?.name || email.split('@')[0];
        
        const { data: newProfile, error: createError } = await supabase
          .from('doctors')
          .insert([{
            auth_id: authData.user.id,
            name: userName,
            email: email,
            specialization: 'General Physician', // Default
            rating: 4.5,
            is_verified: false,
            is_active: true,
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('[DoctorAuth] Failed to create profile:', createError);
          throw new Error('Doctor profile not found. Please complete your registration.');
        }
        
        profile = newProfile;
        console.log('[DoctorAuth] Profile created successfully');
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
