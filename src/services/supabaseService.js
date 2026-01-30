import { supabase } from '../config/supabase';

// Auth Service
export const authService = {
  async register(userData) {
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          age: userData.age,
          gender: userData.gender,
        },
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    return { user: profile, session: authData.session };
  },

  async login(email, password) {
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

    return { user: profile, session: authData.session };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return profile;
  },

  getSession() {
    return supabase.auth.getSession();
  },
};

// Doctors Service
export const doctorsService = {
  async getAll(specialization = null) {
    let query = supabase.from('doctors').select('*');
    
    if (specialization) {
      query = query.eq('specialization', specialization);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

// Appointments Service
export const appointmentsService = {
  async getAll() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(appointmentData) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: session.user.id,
          doctor_id: appointmentData.doctor_id,
          doctor_name: appointmentData.doctor_name,
          specialization: appointmentData.specialization,
          date: appointmentData.date,
          time: appointmentData.time,
          reason: appointmentData.reason,
          status: appointmentData.status || 'Pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Medicines Service
export const medicinesService = {
  async getAll() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(medicineData) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('medicines')
      .insert([
        {
          user_id: session.user.id,
          medicine_name: medicineData.medicine_name,
          dosage: medicineData.dosage,
          time: medicineData.time,
          frequency: medicineData.frequency,
          active: medicineData.active !== undefined ? medicineData.active : true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, medicineData) {
    const { data, error } = await supabase
      .from('medicines')
      .update(medicineData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Symptom Checks Service
export const symptomChecksService = {
  async create(checkData) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('symptom_checks')
      .insert([
        {
          user_id: session.user.id,
          symptoms: checkData.symptoms,
          predicted_disease: checkData.predicted_disease,
          recommended_specialization: checkData.recommended_specialization,
          confidence: checkData.confidence,
          description: checkData.description,
          precautions: checkData.precautions,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(limit = 10) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};

// Stats Service
export const statsService = {
  async get() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const [appointmentsCount, medicinesCount, symptomChecksCount] = await Promise.all([
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id),
      supabase
        .from('medicines')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('active', true),
      supabase
        .from('symptom_checks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id),
    ]);

    return {
      totalAppointments: appointmentsCount.count || 0,
      activeMedicines: medicinesCount.count || 0,
      symptomsChecked: symptomChecksCount.count || 0,
    };
  },
};
