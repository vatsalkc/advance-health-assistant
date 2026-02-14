import { supabase } from '../config/supabase';

// Helper to get current doctor ID
const getCurrentDoctorId = async () => {
  const doctorData = localStorage.getItem('doctor_data');
  if (!doctorData) throw new Error('Not authenticated as doctor');
  const doctor = JSON.parse(doctorData);
  return doctor.id;
};

// Doctor Appointments API
export const doctorAppointmentsAPI = {
  async getAll(status = null) {
    const doctorId = await getCurrentDoctorId();
    
    let query = supabase
      .from('appointments')
      .select(`
        *,
        users:user_id (
          id,
          name,
          email,
          phone,
          age,
          gender
        )
      `)
      .eq('doctor_id', doctorId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: { appointments: data } };
  },

  async updateStatus(appointmentId, status, notes = null, rejectedReason = null) {
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) updateData.notes = notes;
    if (rejectedReason) updateData.rejected_reason = rejectedReason;

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return { data: { appointment: data } };
  },

  async addPrescription(appointmentId, prescription, diagnosis = null) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        prescription,
        diagnosis,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return { data: { appointment: data } };
  }
};

// Doctor Patients API
export const doctorPatientsAPI = {
  async getAll() {
    const doctorId = await getCurrentDoctorId();
    
    // Get unique patients from appointments
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        user_id,
        users:user_id (
          id,
          name,
          email,
          phone,
          age,
          gender,
          created_at
        )
      `)
      .eq('doctor_id', doctorId);

    if (error) throw error;

    // Remove duplicates
    const uniquePatients = [];
    const seenIds = new Set();
    
    data.forEach(item => {
      if (item.users && !seenIds.has(item.users.id)) {
        seenIds.add(item.users.id);
        uniquePatients.push(item.users);
      }
    });

    return { data: { patients: uniquePatients } };
  },

  async getPatientDetails(patientId) {
    const doctorId = await getCurrentDoctorId();
    
    // Get patient info
    const { data: patient, error: patientError } = await supabase
      .from('users')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError) throw patientError;

    // Get patient's appointments with this doctor
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', patientId)
      .eq('doctor_id', doctorId)
      .order('date', { ascending: false });

    if (appointmentsError) throw appointmentsError;

    // Get patient's symptom checks
    const { data: symptomChecks, error: symptomError } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('user_id', patientId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (symptomError) throw symptomError;

    // Get patient's medical reports from this doctor
    const { data: reports, error: reportsError } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('patient_id', patientId)
      .eq('doctor_id', doctorId)
      .order('report_date', { ascending: false });

    // Reports table might not exist yet, so don't throw error
    const medicalReports = reportsError ? [] : reports;

    return {
      data: {
        patient,
        appointments,
        symptomChecks,
        medicalReports
      }
    };
  }
};

// Medical Reports API
export const medicalReportsAPI = {
  async create(reportData) {
    const doctorId = await getCurrentDoctorId();
    
    const { data, error } = await supabase
      .from('medical_reports')
      .insert([
        {
          patient_id: reportData.patient_id,
          doctor_id: doctorId,
          appointment_id: reportData.appointment_id || null,
          report_type: reportData.report_type,
          report_title: reportData.report_title,
          report_content: reportData.report_content,
          report_date: reportData.report_date,
          attachments: reportData.attachments || []
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: { report: data } };
  },

  async getByPatient(patientId) {
    const doctorId = await getCurrentDoctorId();
    
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('patient_id', patientId)
      .eq('doctor_id', doctorId)
      .order('report_date', { ascending: false });

    if (error) throw error;
    return { data: { reports: data } };
  }
};

// Doctor Stats API
export const doctorStatsAPI = {
  async get() {
    const doctorId = await getCurrentDoctorId();
    
    const today = new Date().toISOString().split('T')[0];

    const [totalPatientsResult, todayAppointmentsResult, pendingAppointmentsResult] = await Promise.all([
      // Total unique patients
      supabase
        .from('appointments')
        .select('user_id', { count: 'exact' })
        .eq('doctor_id', doctorId),
      
      // Today's appointments
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('date', today),
      
      // Pending appointments
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('status', 'Pending')
    ]);

    // Count unique patients
    const uniquePatients = new Set(totalPatientsResult.data?.map(a => a.user_id) || []);

    return {
      data: {
        totalPatients: uniquePatients.size,
        todayAppointments: todayAppointmentsResult.count || 0,
        pendingAppointments: pendingAppointmentsResult.count || 0
      }
    };
  }
};

// Doctor Profile API
export const doctorProfileAPI = {
  async update(profileData) {
    const doctorId = await getCurrentDoctorId();
    
    const { data, error } = await supabase
      .from('doctors')
      .update({
        name: profileData.name,
        phone: profileData.phone,
        qualification: profileData.qualification,
        license_number: profileData.license_number,
        bio: profileData.bio,
        consultation_fee: profileData.consultation_fee,
        available_days: profileData.available_days,
        available_time_start: profileData.available_time_start,
        available_time_end: profileData.available_time_end,
        updated_at: new Date().toISOString()
      })
      .eq('id', doctorId)
      .select()
      .single();

    if (error) throw error;
    
    // Update localStorage
    localStorage.setItem('doctor_data', JSON.stringify(data));
    
    return { data: { doctor: data } };
  }
};
