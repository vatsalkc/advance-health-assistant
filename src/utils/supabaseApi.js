import { supabase } from '../config/supabase';
import { predictDisease } from '../data/diseaseDatabase';

// Helper to get current user ID
const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return session.user.id;
};

// Doctors API
export const doctorsAPI = {
  async getAll(specialization = null) {
    let query = supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true) // Only show active doctors
      .order('created_at', { ascending: false }); // Show newest first
    
    if (specialization) {
      query = query.eq('specialization', specialization);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Format the data to ensure all fields are present
    const formattedDoctors = (data || []).map(doctor => ({
      ...doctor,
      rating: doctor.rating || 4.5,
      experience: doctor.experience || 'Not specified',
      qualification: doctor.qualification || 'Not specified',
      license_number: doctor.license_number || 'Not specified',
      phone: doctor.phone || 'Not specified',
      is_verified: doctor.is_verified || false
    }));
    
    return { data: { doctors: formattedDoctors } };
  },
  
  async getById(id) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data: { doctor: data } };
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

    console.log('[appointmentsAPI] Creating appointment for user:', userId);
    console.log('[appointmentsAPI] Appointment data:', appointmentData);

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: userId,
          doctor_id: appointmentData.doctor_id,
          doctor_name: appointmentData.doctor_name,
          patient_name: appointmentData.patient_name, // Add patient name
          patient_phone: appointmentData.patient_phone, // Add patient phone
          specialization: appointmentData.specialization,
          date: appointmentData.date,
          time: appointmentData.time,
          reason: appointmentData.reason,
          status: appointmentData.status || 'Pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[appointmentsAPI] Insert error:', error);
      console.error('[appointmentsAPI] Error code:', error.code);
      console.error('[appointmentsAPI] Error message:', error.message);
      console.error('[appointmentsAPI] Error details:', error.details);
      
      // Provide helpful error messages
      if (error.message.includes('column') && (error.message.includes('patient_name') || error.message.includes('patient_phone'))) {
        throw new Error('Database columns missing. Please run FIX_ALL_ISSUES.sql script. See COMPLETE_FIX_GUIDE.md');
      } else if (error.code === '42501' || error.message.includes('policy')) {
        throw new Error('Permission denied. Please check RLS policies. See COMPLETE_FIX_GUIDE.md');
      } else if (error.message.includes('auth')) {
        throw new Error('Authentication error. Please logout and login again.');
      } else {
        throw new Error(error.message || 'Failed to create appointment');
      }
    }
    
    console.log('[appointmentsAPI] Appointment created successfully:', data);
    return { data: { appointment: data } };
  },

  async update(id, appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...appointmentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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
    // Use client-side disease prediction
    const prediction = predictDisease(symptoms);
    
    if (!prediction) {
      throw new Error('Unable to predict disease from symptoms');
    }

    // Save to database
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('symptom_checks')
      .insert([
        {
          user_id: userId,
          symptoms: symptoms.join(', '),
          predicted_disease: prediction.disease,
          recommended_specialization: prediction.specialization,
          confidence: prediction.confidence,
          description: prediction.description,
          precautions: prediction.precautions.join('; '),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Return prediction result
    return {
      disease: prediction.disease,
      specialization: prediction.specialization,
      description: prediction.description,
      precautions: prediction.precautions,
      confidence: prediction.confidence,
      top_predictions: prediction.top_predictions,
      symptoms: symptoms
    };
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
