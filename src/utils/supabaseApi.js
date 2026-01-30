import { supabase } from '../config/supabase';

// Helper to get current user ID
const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return session.user.id;
};

// Doctors API
export const doctorsAPI = {
  async getAll(specialization = null) {
    let query = supabase.from('doctors').select('*');
    
    if (specialization) {
      query = query.eq('specialization', specialization);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: { doctors: data } };
  },
};

// Appointments API
export const appointmentsAPI = {
  async getAll() {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: { appointments: data } };
  },

  async create(appointmentData) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: userId,
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
    return { data: { appointment: data } };
  },

  async delete(id) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: { message: 'Appointment deleted' } };
  },
};

// Medicines API
export const medicinesAPI = {
  async getAll() {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: { medicines: data } };
  },

  async create(medicineData) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('medicines')
      .insert([
        {
          user_id: userId,
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
    return { data: { medicine: data } };
  },

  async update(id, medicineData) {
    const { data, error } = await supabase
      .from('medicines')
      .update(medicineData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: { medicine: data } };
  },

  async delete(id) {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: { message: 'Medicine deleted' } };
  },
};

// Symptom Checks API
export const symptomCheckAPI = {
  async check(symptoms) {
    // This will use client-side ML prediction
    // For now, return a mock response - you'll need to implement ML model
    throw new Error('Symptom check requires ML model - coming soon');
  },

  async getHistory() {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { data: { symptom_checks: data } };
  },

  async create(checkData) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('symptom_checks')
      .insert([
        {
          user_id: userId,
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
    return { data: { symptom_check: data } };
  },
};

// Stats API
export const statsAPI = {
  async get() {
    const userId = await getCurrentUserId();

    const [appointmentsCount, medicinesCount, symptomChecksCount] = await Promise.all([
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('medicines')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('active', true),
      supabase
        .from('symptom_checks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

    return {
      data: {
        totalAppointments: appointmentsCount.count || 0,
        activeMedicines: medicinesCount.count || 0,
        symptomsChecked: symptomChecksCount.count || 0,
      }
    };
  },
};

// Auth API (already handled by authService, but keeping for compatibility)
export const authAPI = {
  register: (userData) => {
    throw new Error('Use authService.register() instead');
  },
  login: (credentials) => {
    throw new Error('Use authService.login() instead');
  },
  getCurrentUser: () => {
    throw new Error('Use authService.getCurrentUser() instead');
  },
};
