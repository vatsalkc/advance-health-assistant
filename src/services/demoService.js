import { 
  DEMO_MODE, 
  DEMO_USER, 
  DEMO_DOCTORS, 
  DEMO_APPOINTMENTS, 
  DEMO_MEDICINES, 
  DEMO_SYMPTOM_CHECKS, 
  DEMO_STATS,
  DEMO_SYMPTOMS,
  mockSymptomCheck 
} from '../config/demo';

class DemoService {
  constructor() {
    this.isDemo = DEMO_MODE;
    this.user = DEMO_USER;
  }

  // Auth methods
  async login(credentials) {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'demo-token-12345',
          user: this.user
        });
      }, 1000);
    });
  }

  async register(userData) {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'demo-token-12345',
          user: { ...this.user, ...userData }
        });
      }, 1000);
    });
  }

  // Doctors
  async getDoctors() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ doctors: DEMO_DOCTORS });
      }, 500);
    });
  }

  // Appointments
  async getAppointments() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ appointments: DEMO_APPOINTMENTS });
      }, 500);
    });
  }

  async createAppointment(appointmentData) {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment = {
          id: Date.now(),
          ...appointmentData,
          status: 'Pending'
        };
        resolve({ appointment: newAppointment });
      }, 800);
    });
  }

  // Medicines
  async getMedicines() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ medicines: DEMO_MEDICINES });
      }, 500);
    });
  }

  async createMedicine(medicineData) {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMedicine = {
          id: Date.now(),
          ...medicineData,
          active: true
        };
        resolve({ medicine: newMedicine });
      }, 800);
    });
  }

  // Symptom checks
  async checkSymptoms(symptoms) {
    if (!this.isDemo) return null;
    
    return mockSymptomCheck(symptoms);
  }

  async getSymptomChecks() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ symptom_checks: DEMO_SYMPTOM_CHECKS });
      }, 500);
    });
  }

  async getAllSymptoms() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ symptoms: DEMO_SYMPTOMS });
      }, 300);
    });
  }

  // User profile
  async getUserProfile() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: this.user,
          stats: DEMO_STATS,
          recent_data: {
            appointments: DEMO_APPOINTMENTS,
            medicines: DEMO_MEDICINES,
            symptom_checks: DEMO_SYMPTOM_CHECKS
          }
        });
      }, 600);
    });
  }

  // Stats
  async getStats() {
    if (!this.isDemo) return null;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DEMO_STATS);
      }, 400);
    });
  }
}

export default new DemoService();