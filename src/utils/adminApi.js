import { supabase } from '../config/supabase';

// Admin API for managing doctors, users, and system operations
export const adminAPI = {
  // Doctor Management
  async getAllDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: { doctors: data } };
  },

  async getPendingDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_verified', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: { doctors: data } };
  },

  async approveDoctor(doctorId) {
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_verified: true, is_active: true })
      .eq('id', doctorId)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },

  async rejectDoctor(doctorId, reason) {
    const { data, error } = await supabase
      .from('doctors')
      .update({ 
        is_verified: false, 
        is_active: false,
        rejection_reason: reason 
      })
      .eq('id', doctorId)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },

  async updateDoctorRating(doctorId, rating) {
    const { data, error } = await supabase
      .from('doctors')
      .update({ rating: parseFloat(rating) })
      .eq('id', doctorId)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },

  async updateDoctorStatus(doctorId, isActive) {
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_active: isActive })
      .eq('id', doctorId)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },

  async deleteDoctor(doctorId) {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', doctorId);
    
    if (error) throw error;
    return { success: true };
  },

  // User Management
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: { users: data } };
  },

  async deleteUser(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return { success: true };
  },

  // Appointment Management
  async getAllAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        users (name, email, phone),
        doctors (name, specialization)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: { appointments: data } };
  },

  async deleteAppointment(appointmentId) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
    
    if (error) throw error;
    return { success: true };
  },

  // Statistics
  async getStatistics() {
    try {
      // Get counts
      const [usersCount, doctorsCount, appointmentsCount, pendingDoctorsCount] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_verified', false)
      ]);

      return {
        data: {
          totalUsers: usersCount.count || 0,
          totalDoctors: doctorsCount.count || 0,
          totalAppointments: appointmentsCount.count || 0,
          pendingDoctors: pendingDoctorsCount.count || 0
        }
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // System Health Checks
  async getRecentActivity() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          users (name, email),
          doctors (name, specialization)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return { data: { activities: data } };
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
};

export default adminAPI;
